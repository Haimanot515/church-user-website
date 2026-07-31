import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import "./Contact.css";

const Contact = () => {
  const { t } = useTranslation();

  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  // === Static, translated content sections ===
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

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      {/* HERO */}
      <section style={{ padding: '100px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h1 className="display" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.12, margin: '0 0 26px 0', color: '#eaf3f8' }}>
            {t("contact.hero.title")}
          </h1>
          <p style={{ fontSize: '1.55rem', color: '#a9c2d3', lineHeight: 1.75, marginBottom: '0', maxWidth: '560px' }}>
            {t("contact.hero.description")}
          </p>
        </div>
      </section>

      {/* QUICK FACTS BAND */}
      <div style={{ background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)', position: 'relative', overflow: 'hidden' }}>
        <section style={{ padding: '64px 0' }}>
          <div className="wrapper">
            <div className="fact-grid">
              {quickFacts.map((f, i) => (
                <div className="fact-item" key={i}>
                  <p className="fact-label">{f.label}</p>
                  <p className="fact-value">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* WAYS TO REACH ME */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)' }}>
            {t("contact.reachMethods.heading")}
          </h2>
          <div className="reach-grid">
            {reachMethods.map((m, i) => (
              <div className="reach-card" key={i}>
                <h4 className="display" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#eaf3f8' }}>{m.title}</h4>
                <p className="reach-value">{m.value}</p>
                <p style={{ fontSize: '1.15rem', color: '#a9c2d3', lineHeight: 1.75, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 34px 0', color: '#ffffff' }}>
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
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--navy-deep)' }}>
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
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <p className="pull-quote display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.55 }}>
            "{t("contact.quote.text")}"
          </p>
          <p style={{ marginTop: '26px', fontSize: '1.25rem', color: '#3d5a6c' }}>{t("contact.quote.attribution")}</p>
        </div>
      </section>

      {/* LOCATION & SERVICE TIMES */}
      <div style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <section>
          <div className="wrapper">
            <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 40px 0', color: '#ffffff' }}>
              {t("contact.location.heading")}
            </h2>
            <div className="location-grid">
              <div className="map-frame">
                <iframe
                  title={t("contact.location.mapIframeTitle")}
                  src="https://www.google.com/maps?q=Bole+Road,+Addis+Ababa,+Ethiopia&output=embed"
                  style={{ width: '100%', height: '100%', border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div>
                <p style={{ fontSize: '1.4rem', color: '#eaf3f8', lineHeight: 1.75, marginBottom: '12px' }}>{location.address}</p>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, marginBottom: '20px', maxWidth: '460px' }}>{location.note}</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Harbor+Light+Church+Bole+Road+Addis+Ababa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow"
                  style={{ fontSize: '0.85rem', display: 'inline-block', marginBottom: '30px', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}
                >
                  {t("contact.location.getDirections")}
                </a>
                <div>
                  {location.serviceTimes.map((time, i) => {
                    const [label, timeValue] = time.split(" — ");
                    return (
                      <div className="service-time-row" key={i} style={{ color: '#eaf3f8' }}>
                        <span>{label}</span>
                        <span className="eyebrow" style={{ fontSize: '0.85rem' }}>{timeValue}</span>
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