import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import "./Contact.css";

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
  const location = useLocation();

  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const quickFactsRaw = t("contact.quickFacts.items", { returnObjects: true });
  const quickFacts = Array.isArray(quickFactsRaw) ? quickFactsRaw : [];

  const reachMethodsRaw = t("contact.reachMethods.items", { returnObjects: true });
  const reachMethods = Array.isArray(reachMethodsRaw) ? reachMethodsRaw : [];

  const serviceTimesRaw = t("contact.location.serviceTimes", { returnObjects: true });
  const serviceTimes = Array.isArray(serviceTimesRaw) ? serviceTimesRaw : [];

  const location_ = {
    address: t("contact.location.address"),
    note: t("contact.location.note"),
    serviceTimes,
  };

  // === FAQ fetched from /faq?category=Contact ===
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqFallback, setFaqFallback] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setFaqLoading(true);
        setFaqFallback(false);

        let res = await API.get("/faq", { params: { category: "Contact" } });
        let data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          res = await API.get("/faq", {
            params: { category: "Contact" },
            headers: { "Accept-Language": "en" },
          });
          data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) setFaqFallback(true);
        }

        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setFaqs(
          sorted.map((item) => ({
            q: item.question,
            a: item.answer,
          }))
        );
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setFaqs([]);
      } finally {
        setFaqLoading(false);
      }
    };
    fetchFaqs();
  }, [t]);

  useEffect(() => {
    if (location.hash === "#contact-form") {
      const scrollToForm = () => {
        const el = document.getElementById("contact-form");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
      requestAnimationFrame(scrollToForm);
      const timer = setTimeout(scrollToForm, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

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

  const factsLoop = useLoopStrip({ itemCount: quickFacts.length });
  const factsLoopItems = factsLoop.canLoop ? [...quickFacts, ...quickFacts] : quickFacts;

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

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
        </div>
      </section>

      <section id="contact-form" style={{ background: "var(--deep-red)", position: "relative", overflow: "hidden", scrollMarginTop: "24px" }}>
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

      <section style={{ background: "#ffffff" }}>
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", fontWeight: 700, margin: "0 0 20px 0", color: "var(--navy-deep)" }}>
            {t("contact.faq.heading")}
          </h2>

          {faqFallback && !faqLoading && (
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "20px" }}>
              {t("contact.faq.fallbackNotice", { defaultValue: "Showing English content." })}
            </p>
          )}

          {faqLoading ? (
            <div className="loading-spinner-wrap">
              <div className="loading-spinner" />
            </div>
          ) : (
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
          )}
        </div>
      </section>

      <section style={{ background: "linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)" }}>
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          <p className="pull-quote display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)", fontWeight: 600, color: "var(--navy-deep)", lineHeight: 1.55 }}>
            "{t("contact.quote.text")}"
          </p>
          <p style={{ marginTop: "26px", fontSize: "1.25rem", color: "#3d5a6c" }}>{t("contact.quote.attribution")}</p>
        </div>
      </section>

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
                ></iframe>
              </div>
              <div>
                <p style={{ fontSize: "1.4rem", color: "#eaf3f8", lineHeight: 1.75, marginBottom: "12px" }}>{location_.address}</p>
                <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.75, marginBottom: "20px", maxWidth: "460px" }}>{location_.note}</p>
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
                  {location_.serviceTimes.map((time, i) => {
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