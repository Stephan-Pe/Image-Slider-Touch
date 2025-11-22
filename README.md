# ImageSlider — README

This project is a small, accessible, touch-enabled image slider built with plain HTML, CSS and JavaScript.

**Quick start**
- Open `index.html` in your browser (double-click or use a local static server).

**Files**
- `index.html`: Markup for the slider, navigation buttons, and image items.
- `style.css`: Styling for layout, controls, responsive rules, and accessibility utilities (e.g., `.sr-only`).
- `index.js`: Slider logic — autoplay, pointer/touch handling, keyboard support, pagination dots and play/pause control, ARIA/live-region announcements.

**What I changed (step-by-step)**
1. Added base styles and layout in `style.css`.
   - Global resets, body background, font smoothing.
   - `.slider`, `.slider__wrapper`, and `.slider__item` layout so slides line up horizontally.
   - Smooth transform transitions for slide movement.
2. Styled navigation buttons in `style.css`.
   - Positioned left/right buttons, SVG sizing, hover/focus states.
3. Improved pointer interaction and performance.
   - Set `.slider { touch-action: pan-y; }` so browser preserves vertical scrolling but allows the script to receive horizontal pointer gestures.
   - Disabled image dragging/selection during interactions (`user-select: none`, `-webkit-user-drag: none`).
4. Implemented autoplay and pointer-event-based slider in `index.js`.
   - Uses `pointerdown`/`pointermove`/`pointerup` to support mouse, touch and stylus consistently.
   - Calculates `translateX` in pixels based on slider width for robust responsive behavior.
   - Autoplay timer with configurable delay and pause-on-hover/focus.
   - Keyboard left/right navigation (slider is focusable via `tabindex`).
5. Added pagination dots and a play/pause control.
   - Dots are created dynamically and reflect the active slide.
   - Clicking dots jumps to a slide and restarts autoplay.
   - Play/pause toggles autoplay and updates the control label/icon.
6. Improved accessibility and semantics.
   - `loading="lazy"` added to images for better performance.
   - `role="region"`, `aria-roledescription="carousel"`, and `aria-label` applied to the slider container.
   - Active slides get `role="group"`, `aria-roledescription="slide"`, and `aria-label="Slide X of Y"`.
   - A visually-hidden live region (`aria-live="polite"`) announces slide changes with a short summary (index + image alt text).

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

**Troubleshooting**
- If swipe isn't recognized: ensure the browser supports Pointer Events (modern browsers do). If not, fallback to touch/mouse events may be needed.
- If the autoplay seems jittery: check that `transition` and `requestAnimationFrame` updates are working; reduce heavy operations during pointer dragging.
- If images cause layout shifts: consider adding explicit width/height attributes, or use a placeholder with fixed aspect ratio.

**Next improvements (suggestions)**
- Add lazy-loading placeholders or low-quality image placeholders (LQIP).
- Add unit/behavioral tests with Playwright or Cypress to automate cross-device checks.
- Add a small settings UI so end-users can toggle autoplay, animation speed, or switch to a RTL mode.
- Add support for infinite looping with cloned slides if you want continuous circular behavior without a noticeable jump.

If you'd like, I can:
- Add `aria-controls` attributes linking dots to slides and explicit `id`s on slides.
- Add visual focus indicators for keyboard navigation.
- Add a small demo script or automated test to exercise interactions.

Enjoy — tell me which next step you'd like me to implement.
# Image-Slider-Touch
