from flask import Flask, render_template, request, redirect, session, url_for, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import os
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from wtforms import Form, URLField, SubmitField
from wtforms.validators import DataRequired, URL
import secrets, string
from upstash_redis import Redis
import os
from dotenv import load_dotenv
from functools import wraps
from pybloom_live import ScalableBloomFilter

load_dotenv()

redis = Redis(url=os.environ.get("UPSTASH_REDIS_REST_URL"), token=os.environ.get("UPSTASH_REDIS_REST_TOKEN"))
bloom = ScalableBloomFilter(initial_capacity=10000, error_rate=0.001)

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///project.db")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-key-change-in-production")

db.init_app(app)

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    long_link: Mapped[str] = mapped_column(unique=True)
    short_link: Mapped[str] = mapped_column(unique=True)

# with app.app_context():
#     db.create_all()

class UrlAccepterForm(Form):
    accept_url = URLField('Input URL', validators=[DataRequired(), URL()])
    submit = SubmitField("Enter")

def rate_limit(limit=10, window=60):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.remote_addr
            key = f"rate:{ip}"
            current = redis.incr(key)
            if current == 1:
                redis.expire(key, window)
            if current > limit:
                abort(429, "Too Many Requests")
            return f(*args, **kwargs)
        return wrapped
    return decorator

def generate_short_id(length=6):
      chars = string.ascii_letters + string.digits
      return ''.join(secrets.choice(chars) for _ in range(length))

with app.app_context():
    existing_urls = db.session.execute(db.select(User.short_link)).scalars().all()
    for url in existing_urls:
        bloom.add(url)

@app.route("/", methods=["GET","POST"])
@rate_limit(limit=10, window=60)
def home():
   form = UrlAccepterForm(request.form)
   if form.validate() and request.method == "POST":
      input_url = form.accept_url.data

      existing_link = db.session.execute(db.select(User).filter_by(long_link=input_url)).scalar_one_or_none()
      if existing_link:
         redis.set(existing_link.short_link, existing_link.long_link)
         session["short_url"] = existing_link.short_link
         return redirect(url_for("home"))
      
      new_short_id = generate_short_id()
      while db.session.execute(db.select(User).filter_by(short_link=new_short_id)).scalar_one_or_none():
         new_short_id = generate_short_id()
      
      new_url = User(
         long_link = input_url,
         short_link = new_short_id
      )
      db.session.add(new_url)
      db.session.commit()

      bloom.add(new_short_id)
      redis.set(new_short_id, input_url,ex=3600)
      session["short_url"] = new_short_id
      return redirect(url_for("home"))
   
   short_url = session.pop("short_url", None)
   return render_template("index.html", form=form, short_url=short_url, base_url=request.host_url)

@app.route("/<short_id>")
def redirect_url(short_id):
    if short_id not in bloom:
        return "Not Found", 404

    cached_link = redis.get(short_id)
    if cached_link:
        return redirect(cached_link)
    
    link_record = db.session.execute(db.select(User).filter_by(short_link=short_id)).scalar_one_or_none()
    if link_record:
        redis.set(short_id, link_record.long_link, ex=3600)
        return redirect(link_record.long_link)
    
    return "Not Found", 404



if __name__=="__main__":
   app.run(debug=True)
