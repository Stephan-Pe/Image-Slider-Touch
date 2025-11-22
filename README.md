# ImageSlider — README

This project is a small, accessible, touch-enabled image slider built with plain HTML, CSS and JavaScript.

**Quick start**
- Open `index.html` in your browser (double-click or use a local static server).

**Files**
- `index.html`: Markup for the slider, navigation buttons, and image items.
- `style.css`: Styling for layout, controls, responsive rules, and accessibility utilities (e.g., `.sr-only`).
- `slider.js`: Slider logic — autoplay, pointer/touch handling, keyboard support, pagination dots and play/pause control, ARIA/live-region announcements.
- `index.js`: Load DOM contend and call slider.js.

**How the slider works (technical details)**
- Markup: `.slider` contains `.slider__wrapper` which contains multiple `.slider__item` elements each holding an `<img>`.
- Movement: The script sets `wrapper.style.transform = 'translateX(...)'` to move slides. The target translate value is `-index * slideWidth`.
- Swiping: On `pointerdown` we record the start X; on `pointermove` we update a `currentTranslate` and render using `requestAnimationFrame` for smooth updates; on `pointerup` we compare the dragged distance to a threshold (20% of width or 50px minimum) to decide whether to change slides or snap back.
- Autoplay: A timer (`setInterval`) calls `next()` every `AUTOPLAY_DELAY` milliseconds; autoplay is paused during pointer interactions and when the slider is hovered or focused.
- Controls: Prev/Next buttons use `[data-carousel-button]` attributes; dots and play/pause are created dynamically by `index.js` and kept in sync with the current slide.

**Accessibility considerations**
- The slider is navigable via keyboard (left/right arrows when focused).
- Buttons and dots are real `<button>` elements with `aria-label`s and `aria-pressed` where appropriate.
- Live region announces the current slide and the image alt text.
- Images have improved `alt` text and use `loading="lazy"`.

**Customization**
- Change autoplay delay: `AUTOPLAY_DELAY` (in `index.js`).
- Change transition timing or easing: modify the `transition` on `.slider__wrapper` in `style.css`.
- Change button sizes/colors: update `.slide-btn` and `.play-pause` styles in `style.css`.
- To disable autoplay entirely, set `AUTOPLAY_DELAY` to `0` and update the code to avoid creating the autoplay timer (simple change: wrap startAutoplay call in a condition).

**Testing checklist**
- Open `index.html` and verify slides change automatically (unless autoplay disabled).
- Click next/previous buttons.
- Click pagination dots and observe active state.
- Use Left/Right arrow keys when slider is focused.
- On a touch device (or emulator), swipe left/right to change slides.
- Confirm live-region announces slide changes with a screen reader.
- Inspect CSS on mobile widths to ensure images scale and controls remain usable.



# Image-Slider-Touch
