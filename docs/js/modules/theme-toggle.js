export function initThemeToggle() {
  const toggleBtn = document.querySelector('.nb-theme-toggle');
  if (!toggleBtn) return;

  const STORAGE_KEY = 'nb-theme';
  const htmlEl = document.documentElement;
  
  // Determine initial state (inline script in HTML prevents flash, but we ensure JS knows)
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  updateButtonIcon(isDark);

  toggleBtn.addEventListener('click', () => {
    const currentlyDark = htmlEl.getAttribute('data-theme') === 'dark';
    const newTheme = currentlyDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      htmlEl.setAttribute('data-theme', 'dark');
    } else {
      htmlEl.removeAttribute('data-theme');
    }
    
    updateButtonIcon(newTheme === 'dark');
    
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      // Ignore
    }
  });

  function updateButtonIcon(isDark) {
    // Assuming toggleBtn has SVG icons inside for sun/moon, we can toggle visibility
    const sunIcon = toggleBtn.querySelector('.nb-icon-sun');
    const moonIcon = toggleBtn.querySelector('.nb-icon-moon');
    
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }
}
