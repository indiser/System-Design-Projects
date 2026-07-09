export function initFilter() {
  const searchInput = document.getElementById('resource-search');
  const filterButtons = document.querySelectorAll('.nb-filter-btn');
  const resourceCards = document.querySelectorAll('.nb-resource-card');
  
  if (!searchInput && !filterButtons.length) return;

  let currentSearchTerm = '';
  let currentCategory = 'all';

  function applyFilters() {
    resourceCards.forEach(card => {
      const title = card.getAttribute('data-title')?.toLowerCase() || '';
      const category = card.getAttribute('data-category') || '';
      
      const matchesSearch = title.includes(currentSearchTerm);
      const matchesCategory = currentCategory === 'all' || category === currentCategory;
      
      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex'; // Or block depending on card display type
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value.toLowerCase();
      applyFilters();
    });
  }

  if (filterButtons) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state of buttons
        filterButtons.forEach(b => {
          b.classList.remove('nb-button--primary');
          b.classList.add('nb-button--secondary');
        });
        
        btn.classList.remove('nb-button--secondary');
        btn.classList.add('nb-button--primary');
        
        currentCategory = btn.getAttribute('data-filter') || 'all';
        applyFilters();
      });
    });
  }
}
