export function initProgressTracker() {
  const checkboxes = document.querySelectorAll('.nb-progress-checkbox');
  const progressText = document.querySelector('.nb-progress-text');
  const progressBar = document.querySelector('.nb-progress-bar-fill');
  
  if (!checkboxes.length) return;

  const STORAGE_KEY = 'system-design-progress';
  
  // Load state from local storage
  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    console.warn('LocalStorage not available');
  }

  function updateProgressUI() {
    const total = checkboxes.length;
    const completed = document.querySelectorAll('.nb-progress-checkbox:checked').length;
    
    if (progressText) {
      progressText.textContent = `${completed} / ${total} Completed`;
    }
    if (progressBar) {
      const percentage = total === 0 ? 0 : (completed / total) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  checkboxes.forEach(checkbox => {
    const id = checkbox.id;
    
    // Restore state
    if (savedState[id]) {
      checkbox.checked = true;
    }

    checkbox.addEventListener('change', () => {
      // Save state
      savedState[id] = checkbox.checked;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      } catch (e) {
        // Ignore
      }
      
      updateProgressUI();
    });
  });

  // Initial UI update
  updateProgressUI();
}
