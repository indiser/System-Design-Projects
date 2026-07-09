export function initScrollReveal() {
  // Respect prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return;

  const revealElements = document.querySelectorAll('.nb-reveal');
  
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only reveal once
      }
    });
  }, observerOptions);

  // Apply stagger delay to children of elements with data-stagger attribute
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = Array.from(parent.querySelectorAll('.nb-reveal'));
    children.forEach((child, index) => {
      child.style.transitionDelay = `${index * 60}ms`; // --nb-delay-stagger
    });
  });

  revealElements.forEach(el => observer.observe(el));
}
