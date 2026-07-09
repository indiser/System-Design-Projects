export function initAccordion() {
  const accordions = document.querySelectorAll('.nb-accordion');
  
  accordions.forEach(accordion => {
    const header = accordion.querySelector('.nb-accordion__header');
    
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = accordion.classList.contains('is-open');
        
        // Optional: close other accordions in the same group
        /*
        const group = accordion.getAttribute('data-group');
        if (group) {
          document.querySelectorAll(`.nb-accordion[data-group="${group}"]`).forEach(a => {
            if (a !== accordion) {
              a.classList.remove('is-open');
              a.querySelector('.nb-accordion__header').setAttribute('aria-expanded', 'false');
            }
          });
        }
        */
        
        if (isOpen) {
          accordion.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          accordion.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}
