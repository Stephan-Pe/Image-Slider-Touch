// Exportable slider module
export function createSlider(root, options = {}) {
  const slider = typeof root === 'string' ? document.querySelector(root) : root;
  if (!slider) return null;

  const wrapper = slider.querySelector('.slider__wrapper');
  const slides = Array.from(wrapper.children);
  const buttons = slider.querySelectorAll('[data-carousel-button]');

  let index = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationFrame = null;
  let pointerId = null;
  let slideWidth = slider.clientWidth;

  // Options
  const AUTOPLAY_DELAY = options.delay || 3000;
  let autoplayId = null;
  let isPlaying = options.autoplay !== false; // default true
  let dotsContainer = null;
  let playPauseButton = null;
  let liveRegion = null;

  function setPosition(translateX, withTransition = true) {
    if (withTransition) wrapper.style.transition = 'transform 480ms cubic-bezier(.22,.9,.3,1)';
    else wrapper.style.transition = 'none';
    wrapper.style.transform = `translateX(${translateX}px)`;
  }

  function updateActive() {
    slides.forEach((s, i) => {
      if (i === index) {
        s.dataset.active = 'true';
        s.setAttribute('aria-hidden', 'false');
        s.setAttribute('role', 'group');
        s.setAttribute('aria-roledescription', 'slide');
        s.setAttribute('aria-label', `Slide ${i+1} of ${slides.length}`);
      } else {
        delete s.dataset.active;
        s.setAttribute('aria-hidden', 'true');
        s.removeAttribute('role');
        s.removeAttribute('aria-roledescription');
        s.removeAttribute('aria-label');
      }
    });

    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((d, i) => {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-pressed', i === index ? 'true' : 'false');
      });
    }

    if (liveRegion) {
      const img = slides[index].querySelector('img');
      const label = img ? img.alt || '' : '';
      liveRegion.textContent = `Slide ${index+1} of ${slides.length}. ${label}`;
    }
  }

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    prevTranslate = -index * slideWidth;
    setPosition(prevTranslate, true);
    updateActive();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // Buttons
  buttons.forEach(btn => {
    const dir = btn.dataset.carouselButton === 'next' ? 1 : -1;
    btn.addEventListener('click', () => {
      if (dir > 0) next(); else prev();
      restartAutoplay();
    });
  });

  // Autoplay control
  function startAutoplay() {
    stopAutoplay();
    autoplayId = AUTOPLAY_DELAY > 0 ? setInterval(() => next(), AUTOPLAY_DELAY) : null;
    isPlaying = Boolean(autoplayId);
   
  }

  function stopAutoplay() {
    if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
    isPlaying = false;
    
  }

  function restartAutoplay() {
    stopAutoplay();
    setTimeout(() => { if (options.autoplay !== false) startAutoplay(); }, 800);
  }

  // Pointer / touch handling
  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging = true;
    pointerId = e.pointerId;
    startX = e.clientX;
    wrapper.setPointerCapture(pointerId);
    wrapper.style.transition = 'none';
    stopAutoplay();
    animationFrame = requestAnimationFrame(render);
  }

  function onPointerMove(e) {
    if (!isDragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    currentTranslate = prevTranslate + dx;
  }

  function onPointerUp(e) {
    if (!isDragging || e.pointerId !== pointerId) return;
    isDragging = false;
    wrapper.releasePointerCapture(pointerId);
    cancelAnimationFrame(animationFrame);

    const movedBy = currentTranslate - prevTranslate;
    const threshold = Math.max(50, slideWidth * 0.2);
    if (movedBy < -threshold) next();
    else if (movedBy > threshold) prev();
    else setPosition(prevTranslate, true);

    prevTranslate = -index * slideWidth;
    restartAutoplay();
  }

  function render() {
    setPosition(currentTranslate, false);
    if (isDragging) animationFrame = requestAnimationFrame(render);
  }

  // Keyboard support
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
    if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
  });

  // Pause autoplay while hovering or focusing
  slider.addEventListener('pointerenter', stopAutoplay);
  slider.addEventListener('pointerleave', () => { if (!isDragging) startAutoplay(); });
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', () => { if (!isDragging) startAutoplay(); });

  // Pointer events
  wrapper.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // Resize handler
  function onResize() {
    slideWidth = slider.clientWidth;
    prevTranslate = -index * slideWidth;
    setPosition(prevTranslate, false);
  }
  window.addEventListener('resize', onResize);

  // init
  onResize();
  slider.setAttribute('role', 'region');
  slider.setAttribute('aria-roledescription', 'carousel');
  slider.setAttribute('aria-label', 'Image slider');
  slider.tabIndex = 0;

  liveRegion = document.createElement('div');
  liveRegion.className = 'sr-only';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  slider.appendChild(liveRegion);

  updateActive();

  // Bind existing static controls if present
  dotsContainer = slider.querySelector('.dots');
  if (dotsContainer) {
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    dots.forEach((dot, i) => {
      dot.dataset.slide = String(i);
      dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
    });
  }

  playPauseButton = slider.querySelector('.play-pause');
  if (playPauseButton) {
    playPauseButton.addEventListener('click', () => {
      if (isPlaying) stopAutoplay(); else startAutoplay();
    });
  }

  if (options.autoplay !== false) startAutoplay();

  // public API
  return {
    goTo,
    next,
    prev,
    start: startAutoplay,
    stop: stopAutoplay,
    destroy() {
      stopAutoplay();
      window.removeEventListener('resize', onResize);
      wrapper.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    }
  };
}
