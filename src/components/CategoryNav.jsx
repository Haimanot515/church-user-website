import { useEffect, useRef } from "react";
import "./CategoryNav.css";

/**
 * Category nav bar used on Home and Blog.
 *
 * How this works:
 * - The visible bar (.cat-nav-track) is a fixed-width, clipped window
 *   (overflow: hidden) — never wider than the screen, on any device.
 * - Inside it, the actual list of categories is rendered twice back to
 *   back and moved with a CSS transform (translateX), driven by
 *   requestAnimationFrame. Once it has slid past the first copy, the
 *   position silently wraps back to 0 — since copy #2 is pixel-identical
 *   to copy #1, nobody can see the jump, so it reads as one endless loop.
 * - Because the window is always clipped to the container's width, you
 *   can NEVER see both copies at once (that was the "double categories"
 *   bug from the previous scroll-based version, where a wide desktop
 *   viewport was sometimes big enough to fit both copies side by side
 *   with nothing to scroll). This version can't do that — only a
 *   container-width slice is ever visible, on phones, tablets, or huge
 *   desktop monitors alike.
 * - Because the animation is a transform (not "wait for overflow, then
 *   scroll"), it runs continuously on every device/screen size, not
 *   just on narrow screens where the list happens not to fit.
 * - Manual drag/swipe (mouse or touch, on any device) grabs the same
 *   position value, pauses the auto-drift while you're interacting, and
 *   resumes it a couple of seconds after you let go.
 */
export default function CategoryNav({ categories, activeCategory, onSelect }) {
  const viewportRef = useRef(null); // clipped outer window
  const trackRef = useRef(null); // the moving inner element
  const posRef = useRef(0); // current translateX, always in (-half, 0]
  const halfRef = useRef(0); // width of one copy of the list
  const drag = useRef({ active: false, moved: false, startX: 0, startPos: 0 });
  const paused = useRef(false);
  const resumeTimeout = useRef(null);

  const canLoop = categories.length > 1;
  const loopItems = canLoop ? [...categories, ...categories] : categories;

  const applyTransform = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;
    }
  };

  const wrap = (pos) => {
    const half = halfRef.current;
    if (half <= 0) return 0;
    let p = pos % half;
    if (p > 0) p -= half;
    return p;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !canLoop) return;

    // Measure once layout has settled.
    halfRef.current = track.scrollWidth / 2;
    posRef.current = 0;
    applyTransform();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId;
    const SPEED = 0.45; // px per frame, gentle drift

    const tick = () => {
      if (!prefersReduced && !drag.current.active && !paused.current) {
        posRef.current = wrap(posRef.current - SPEED);
        applyTransform();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      halfRef.current = track.scrollWidth / 2;
      posRef.current = wrap(posRef.current);
      applyTransform();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const pauseAutoScroll = () => {
    paused.current = true;
    clearTimeout(resumeTimeout.current);
  };
  const scheduleResume = () => {
    clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      paused.current = false;
    }, 2200);
  };
  useEffect(() => () => clearTimeout(resumeTimeout.current), []);

  const startDrag = (e) => {
    drag.current = { active: true, moved: false, startX: e.clientX, startPos: posRef.current };
    pauseAutoScroll();
    // Pointer capture keeps move/up events firing on this element even if
    // the pointer drifts outside its (fairly thin) bounds mid-drag — on
    // mouse, touch, or pen alike — so a fast or slightly-off-axis drag
    // never gets cut short before reaching the edges.
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const moveDrag = (e) => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    posRef.current = wrap(drag.current.startPos + delta);
    applyTransform();
  };
  const endDrag = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (e?.currentTarget?.releasePointerCapture && e?.pointerId != null) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // no-op: pointer may already be released
      }
    }
    scheduleResume();
  };

  const handleSelect = (cat) => {
    // Suppress the click that fires right after a drag/swipe gesture.
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    onSelect(cat);
  };

  return (
    <nav className="cat-nav-bar" aria-label="Post categories">
      <div
        className="cat-nav-track"
        ref={viewportRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="cat-nav-scroll" ref={trackRef}>
          {loopItems.map((cat, i) => (
            <span
              key={`${cat}-${i}`}
              className={`cat-nav-item${cat === activeCategory ? " active" : ""}`}
              onClick={() => handleSelect(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}
