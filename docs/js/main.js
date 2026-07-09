import { initNav } from './modules/nav.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initProgressTracker } from './modules/progress-tracker.js';
import { initThemeToggle } from './modules/theme-toggle.js';
import { initAccordion } from './modules/accordion.js';
import { initFilter } from './modules/filter.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initProgressTracker();
  initThemeToggle();
  initAccordion();
  initFilter();
});
