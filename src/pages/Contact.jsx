import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import "./Contact.css";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M23.5 6.5s-.23-1.64-.94-2.36c-.9-.95-1.9-.95-2.36-1.01C16.9 2.8 12 2.8 12 2.8h-.01s-4.89 0-8.2.33c-.46.06-1.46.06-2.36 1.01C.72 4.86.5 6.5.5 6.5S.27 8.42.27 10.34v1.31c0 1.92.23 3.84.23 3.84s.23 1.64.93 2.36c.9.96 2.08.93 2.6 1.03 1.89.18 8.02.32 8.02.32s4.9-.01 8.2-.34c.46-.06 1.46-.06 2.36-1.01.71-.72.94-2.36.94-2.36s.23-1.92.23-3.84v-1.31c0-1.92-.23-3.84-.23-3.84zM9.68 14.6V7.9l6.5 3.36-6.5 3.34z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M22.05 2.94a1.6 1.6 0 0 0-1.66-.24L2.4 9.86a1.55 1.55 0 0 0 .1 2.9l4.65 1.5 1.8 5.62a1.5 1.5 0 0 0 2.5.6l2.5-2.4 4.55 3.35a1.55 1.55 0 0 0 2.45-.9l3.02-15.15a1.6 1.6 0 0 0-.87-1.44zM9.4 14.8l-.7 3.1-1.4-4.4 10.5-6.9-8.4 8.2z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/251900000000",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12.02 2C6.5 2 2.04 6.46 2.04 11.98c0 1.88.5 3.63 1.44 5.14L2 22l5.02-1.44a9.9 9.9 0 0 0 5 1.35h.01c5.52 0 9.98-4.46 9.98-9.98A9.9 9.9 0 0 0 12.02 2zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.13.09-1.83-.11-.42-.13-.96-.3-1.66-.6-2.92-1.26-4.83-4.2-4.98-4.4-.15-.2-1.2-1.6-1.2-3.06 0-1.46.77-2.17 1.04-2.47.27-.3.6-.37.8-.37h.57c.18 0 .43-.07.67.51.24.6.83 2.06.9 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.3.75 1.24 1.61 2 1.1.98 2.03 1.29 2.33 1.44.3.15.47.12.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.07.13.07.75-.17 1.43z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18.24 2.5h3.3l-7.2 8.23L22.8 21.5h-6.62l-5.18-6.77-5.93 6.77H1.77l7.7-8.8L1.2 2.5h6.79l4.68 6.19 5.57-6.19zm-1.16 17.02h1.83L6.94 4.38H5.98l11.1 15.14z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M16.6 2h-3.2v13.4a3 3 0 1 1-2.4-2.94V9.2a6.2 6.2 0 1 0 5.6 6.17V8.9a7.6 7.6 0 0 0 4.4 1.4V7.1a4.4 4.4 0 0 1-4.4-4.4V2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.23 2.63 7.85 6.35 9.31-.09-.79-.17-2.01.03-2.87.19-.79 1.23-5.05 1.23-5.05s-.31-.63-.31-1.55c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.29-1.96 3.29-4.79 0-2.5-1.8-4.26-4.36-4.26-2.97 0-4.71 2.23-4.71 4.53 0 .9.34 1.86.78 2.38.09.1.1.2.07.3-.08.34-.26 1.05-.3 1.2-.05.2-.16.24-.37.15-1.38-.64-2.24-2.66-2.24-4.28 0-3.48 2.53-6.68 7.3-6.68 3.83 0 6.81 2.73 6.81 6.38 0 3.8-2.4 6.87-5.72 6.87-1.12 0-2.17-.58-2.53-1.27l-.69 2.62c-.25.96-.92 2.16-1.37 2.9.95.32 2.05.44 3.02.44a10 10 0 1 0 0-20z" />
      </svg>
    ),
  },
  {
    name: "Snapchat",
    href: "https://snapchat.com/add/yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2.5c3.3 0 5.2 2.6 5.1 5.7-.03.9-.08 1.85-.14 2.5.3.16.9.06 1.24-.13.4-.23.9-.1 1.05.36.13.4-.06.86-.5 1.08-.5.26-1.24.55-1.5.68 0 .3.1.7.4 1.1.55.75 1.5 1.2 2.15 1.35.4.1.6.5.45.9-.15.4-.6.6-1.05.65-.35.04-.75.3-.9.65-.1.25-.3.4-.55.4-.55 0-1.35-.1-2.05.2-.65.28-1.15.9-2.1 1.6-.75.55-1.65.9-2.6.9s-1.85-.35-2.6-.9c-.95-.7-1.45-1.32-2.1-1.6-.7-.3-1.5-.2-2.05-.2-.25 0-.45-.15-.55-.4-.15-.35-.55-.61-.9-.65-.45-.05-.9-.25-1.05-.65-.15-.4.05-.8.45-.9.65-.15 1.6-.6 2.15-1.35.3-.4.4-.8.4-1.1-.26-.13-1-.42-1.5-.68-.44-.22-.63-.68-.5-1.08.15-.46.65-.59 1.05-.36.34.19.94.29 1.24.13-.06-.65-.11-1.6-.14-2.5C6.8 5.1 8.7 2.5 12 2.5z" />
      </svg>
    ),
  },
  {
    name: "Threads",
    href: "https://threads.net/@yourchurch",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M16.5 11.4c-.1-3.4-2.1-5.4-5.5-5.4-2.1 0-3.9.9-5 2.5l1.6 1.1c.8-1.1 1.9-1.7 3.3-1.7 1.8 0 2.9.9 3.2 2.5-.7-.1-1.5-.2-2.3-.2-2.9 0-5.4 1.2-5.4 3.8 0 2.1 1.9 3.4 4.2 3.4 2.1 0 3.5-.9 4.3-2.3.3.5.4 1 .4 1.6h1.9c0-1-.2-1.9-.7-2.6.6-1 .3-1.7 0-2.7zM10.9 15.6c-1.3 0-2.2-.6-2.2-1.5 0-1.1 1.2-1.7 3-1.7.7 0 1.4.1 2 .2-.2 1.9-1.3 3-2.8 3z" />
      </svg>
    ),
  },
];

/**
 * Reusable infinite-drift + drag-to-scroll strip.
 * Mirrors the mechanics of the category nav in Blog.jsx: translateX
 * position ref, half-width wrap, rAF drift, pointer drag, pause-on-
 * interaction + delayed resume, click-through only when not dragged.
 */
function useLoopStrip({ itemCount, onItemClick, speed = 0.45 }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const halfRef = useRef(0);
  const drag = useRef({ active: false, moved: false, startX: 0, startPos: 0, downIndex: null });
  const paused = useRef(false);
  const resumeTimeout = useRef(null);

  const canLoop = itemCount > 1;

  const applyTransform = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;
    }
  };

  const wrapPos = (pos) => {
    const half = halfRef.current;
    if (half <= 0) return 0;
    let p = pos % half;
    if (p > 0) p -= half;
    return p;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !canLoop) return;

    halfRef.current = track.scrollWidth / 2;
    posRef.current = 0;
    applyTransform();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId;
    const tick = () => {
      if (!prefersReduced && !drag.current.active && !paused.current) {
        posRef.current = wrapPos(posRef.current - speed);
        applyTransform();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      halfRef.current = track.scrollWidth / 2;
      posRef.current = wrapPos(posRef.current);
      applyTransform();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

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
    const itemEl = e.target.closest?.("[data-loop-index]");
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startPos: posRef.current,
      downIndex: itemEl ? itemEl.dataset.loopIndex : null,
    };
    pauseAutoScroll();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const moveDrag = (e) => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    posRef.current = wrapPos(drag.current.startPos + delta);
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
    if (!drag.current.moved && drag.current.downIndex != null && onItemClick) {
      onItemClick(Number(drag.current.downIndex));
    }
    drag.current.moved = false;
    drag.current.downIndex = null;
    scheduleResume();
  };

  return { viewportRef, trackRef, canLoop, startDrag, moveDrag, endDrag };
}

const Contact = () => {
  const { t } = useTranslation();

  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const quickFactsRaw = t("contact.quickFacts.items", { returnObjects: true });
  const quickFacts = Array.isArray(quickFactsRaw) ? quickFactsRaw : [];

  const reachMethodsRaw = t("contact.reachMethods.items", { returnObjects: true });
  const reachMethods = Array.isArray(reachMethodsRaw) ? reachMethodsRaw : [];

  const faqsRaw = t("contact.faq.items", { returnObjects: true });
  const faqs = Array.isArray(faqsRaw) ? faqsRaw : [];

  const serviceTimesRaw = t("contact.location.serviceTimes", { returnObjects: true });
  const serviceTimes = Array.isArray(serviceTimesRaw) ? serviceTimesRaw : [];

  const location = {
    address: t("contact.location.address"),
    note: t("contact.location.note"),
    serviceTimes,
  };

  const handleChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await API.post("/contact", formState);
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || t("contact.form.errorDefault"));
    } finally {
      setSubmitting(false);
    }
  };

  // === Quick Facts looping strip ===
  const factsLoop = useLoopStrip({ itemCount: quickFacts.length });
  const factsLoopItems = factsLoop.canLoop ? [...quickFacts, ...quickFacts] : quickFacts;

  // === Social Icons looping strip ===
  const socialLoop = useLoopStrip({
    itemCount: socialLinks.length,
    onItemClick: (i) => {
      const link = socialLinks[i % socialLinks.length];
      window.open(link.href, "_blank", "noopener,noreferrer");
    },
  });
  const socialLoopItems = socialLoop.canLoop ? [...socialLinks, ...socialLinks] : socialLinks;

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      {/* HERO */}
      <section style={{ padding: "100px 0 80px 0", background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)" }}>
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          <h1 className="display" style={{ fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 700, lineHeight: 1.12, margin: "0 0 26px 0", color: "#eaf3f8" }}>
            {t("contact.hero.title")}
          </h1>
          <p style={{ fontSize: "1.55rem", color: "#a9c2d3", lineHeight: 1.75, marginBottom: "0", maxWidth: "560px" }}>
            {t("contact.hero.description")}
          </p>
        </div>
      </section>

      {/* QUICK FACTS BAND — infinite drift/drag strip */}
      <div style={{ background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)", position: "relative", overflow: "hidden" }}>
        <section style={{ padding: "64px 0" }}>
          <div className="wrapper">
            <div
              className="loop-strip-viewport"
              ref={factsLoop.viewportRef}
              onPointerDown={factsLoop.startDrag}
              onPointerMove={factsLoop.moveDrag}
              onPointerUp={factsLoop.endDrag}
              onPointerCancel={factsLoop.endDrag}
            >
              <div className="loop-strip-track fact-strip-track" ref={factsLoop.trackRef}>
                {factsLoopItems.map((f, i) => (
                  <div className="fact-item" data-loop-index={i % quickFacts.length} key={`${f.label}-${i}`}>
                    <p className="fact-label">{f.label}</p>
                    <p className="fact-value">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* WAYS TO REACH ME */}
      <section style={{ background: "#ffffff" }}>
        <div className="wrapper" style={{ maxWidth: "1000px" }}>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", fontWeight: 700, margin: "0 0 34px 0", color: "var(--navy-deep)" }}>
            {t("contact.reachMethods.heading")}
          </h2>
          <div className="reach-grid">
            {reachMethods.map((m, i) => (
              <div
                className="reach-card"
                key={i}
                style={{
                  background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)",
                  borderLeft: "3px solid var(--gold)",
                }}
              >
                <h4 className="display" style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "#eaf3f8" }}>{m.title}</h4>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "1.15rem", fontWeight: 500, color: "var(--gold)", margin: "8px 0 14px 0", wordBreak: "break-word" }}>{m.value}</p>
                <p style={{ fontSize: "1.15rem", color: "#a9c2d3", lineHeight: 1.75, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* SOCIAL ICONS — infinite drift/drag strip */}
          <div className="social-row">
            <div
              className="loop-strip-viewport social-viewport"
              ref={socialLoop.viewportRef}
              onPointerDown={socialLoop.startDrag}
              onPointerMove={socialLoop.moveDrag}
              onPointerUp={socialLoop.endDrag}
              onPointerCancel={socialLoop.endDrag}
            >
              <div className="loop-strip-track social-strip-track" ref={socialLoop.trackRef}>
                {socialLoopItems.map((s, i) => (
                  <span
                    key={`${s.name}-${i}`}
                    data-loop-index={i % socialLinks.length}
                    className="social-icon"
                    aria-label={s.name}
                    title={s.name}
                  >
                    {s.icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section style={{ background: "var(--deep-red)", position: "relative", overflow: "hidden" }}>
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", fontWeight: 700, margin: "0 0 34px 0", color: "#ffffff" }}>
            {t("contact.form.heading")}
          </h2>

          <div className="form-card">
            {submitted && (
              <div className="success-note">
                {t("contact.form.successNote")}
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                name="name"
                value={formState.name}
                onChange={handleChange("name")}
                placeholder={t("contact.form.namePlaceholder")}
                required
                className="contact-input"
              />
              <input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange("email")}
                placeholder={t("contact.form.emailPlaceholder")}
                required
                className="contact-input"
              />
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange("message")}
                placeholder={t("contact.form.messagePlaceholder")}
                required
                className="contact-textarea"
              />
              <button type="submit" className="contact-btn" disabled={submitting}>
                {submitting ? t("contact.form.sendingButton") : t("contact.form.sendButton")}
              </button>
              {error && <p style={{ color: "#fb7185", marginTop: "20px", fontWeight: "700" }}>{error}</p>}
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#ffffff" }}>
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", fontWeight: 700, margin: "0 0 20px 0", color: "var(--navy-deep)" }}>
            {t("contact.faq.heading")}
          </h2>
          <div>
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq-toggle">{openFaq === i ? "–" : "+"}</span>
                </button>
                {openFaq === i && <p className="faq-answer">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section style={{ background: "linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)" }}>
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          <p className="pull-quote display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)", fontWeight: 600, color: "var(--navy-deep)", lineHeight: 1.55 }}>
            "{t("contact.quote.text")}"
          </p>
          <p style={{ marginTop: "26px", fontSize: "1.25rem", color: "#3d5a6c" }}>{t("contact.quote.attribution")}</p>
        </div>
      </section>

      {/* LOCATION & SERVICE TIMES */}
      <div style={{ background: "var(--deep-red)", position: "relative", overflow: "hidden" }}>
        <section>
          <div className="wrapper">
            <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", fontWeight: 700, margin: "0 0 40px 0", color: "#ffffff" }}>
              {t("contact.location.heading")}
            </h2>
            <div className="location-grid">
              <div className="map-frame">
                <iframe
                  title={t("contact.location.mapIframeTitle")}
                  src="https://www.google.com/maps?q=Bole+Road,+Addis+Ababa,+Ethiopia&output=embed"
                  style={{ width: "100%", height: "100%", border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div>
                <p style={{ fontSize: "1.4rem", color: "#eaf3f8", lineHeight: 1.75, marginBottom: "12px" }}>{location.address}</p>
                <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.75, marginBottom: "20px", maxWidth: "460px" }}>{location.note}</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Harbor+Light+Church+Bole+Road+Addis+Ababa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow"
                  style={{ fontSize: "0.85rem", display: "inline-block", marginBottom: "30px", borderBottom: "1px solid var(--gold)", paddingBottom: "2px" }}
                >
                  {t("contact.location.getDirections")}
                </a>
                <div>
                  {location.serviceTimes.map((time, i) => {
                    const [label, timeValue] = time.split(" — ");
                    return (
                      <div className="service-time-row" key={i} style={{ color: "#eaf3f8" }}>
                        <span>{label}</span>
                        <span className="eyebrow" style={{ fontSize: "0.85rem" }}>{timeValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;