import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ONE loading spinner per page.
//
// Every section/component can keep rendering <Spinner /> while its own
// backend request is pending. Only the first mounted instance actually
// draws anything (a single centered spinner over the page); the others
// render nothing. When the last request finishes, the spinner disappears.
// If the page that "owns" the spinner finishes first, the next pending
// one takes over, so there is never more than one spinner on screen.

let nextId = 0;
const active = []; // ids of currently mounted <Spinner /> instances, in mount order
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

const STYLE_ID = "page-spinner-style";
const css = `
@keyframes page-spinner-rotate { to { transform: rotate(360deg); } }
.page-spinner-overlay {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  z-index: 9999; pointer-events: none;
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 6px 24px rgba(15, 36, 56, 0.18);
  display: flex; align-items: center; justify-content: center;
}
.page-spinner-ring {
  width: 44px; height: 44px; border-radius: 50%;
  border: 4px solid rgba(28, 58, 82, 0.15);
  border-top-color: var(--gold, #cf9f3f);
  animation: page-spinner-rotate 0.85s linear infinite;
}
`;

const Spinner = () => {
  const { t } = useTranslation();
  const [id] = useState(() => ++nextId);
  const [, setTick] = useState(0);

  useEffect(() => {
    const rerender = () => setTick((n) => n + 1);
    listeners.add(rerender);
    active.push(id);
    notify();
    return () => {
      listeners.delete(rerender);
      const i = active.indexOf(id);
      if (i !== -1) active.splice(i, 1);
      notify();
    };
  }, [id]);

  if (active[0] !== id || typeof document === "undefined") return null;

  if (!document.getElementById(STYLE_ID)) {
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  return createPortal(
    <div className="page-spinner-overlay" role="status" aria-label={t("common.loading")}>
      <div className="page-spinner-ring" />
    </div>,
    document.body
  );
};

export default Spinner;
