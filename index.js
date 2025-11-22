import { createSlider } from './slider.js';

document.addEventListener('DOMContentLoaded', () => {
  const instance = createSlider('.slider', { autoplay: true, delay: 3000 });
  // expose instance for debugging from devtools if needed
  window.__imageSlider = instance;
});