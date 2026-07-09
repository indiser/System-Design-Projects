export function initNav() {
  const header = document.querySelector('.nb-header');
  const hamburger = document.querySelector('.nb-hamburger');
  const mobileMenu = document.querySelector('.nb-mobile-menu');
  const navLinks = document.querySelectorAll('.nb-nav-link, .nb-mobile-menu .nb-nav-link');
  
  if (!header) return;

  // Sticky header border logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('is-stuck');
    } else {
      header.classList.remove('is-stuck');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', !isOpen);
      
      // Optional: trap focus in mobile menu or prevent body scroll
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  // Smooth scroll and active state management
  const sections = Array.from(document.querySelectorAll('section[id]'));
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
          
          const headerHeight = header.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Scrollspy logic
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -80% 0px', // Trigger when section is in top part of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
