import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";
import { useTranslation } from "react-i18next";
import "./Footer.css";

const footerColumns = [
  { key: "visit", items: ["serviceTimes", "directions", "whatToExpect"] },
  { key: "getInvolved", items: ["ministries", "volunteer", "give", "missions"] },
  { key: "connect", items: ["facebook", "instagram", "youtube"] }
];

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback("");
      setStatus("idle");
    }, 5000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setFeedback(t("footer.newsletter.errorEmpty"));
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      // Matches: app.use("/api/subscribers", subscriberRoutes) -> POST "/"
      const res = await API.post("/subscribers", { email });
      setStatus("success");
      setFeedback(res.data?.msg || t("footer.newsletter.successDefault"));
      setEmail("");
    } catch (err) {
      console.error("Subscribe request failed:", err);
      setStatus("error");
      setFeedback(err.response?.data?.msg || t("footer.newsletter.errorDefault"));
    }
  };

  return (
    <footer className="site-footer">
      <section style={{ background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)', color: '#eaf3f8' }}>
        <div className="wrapper" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <h3 className="display" style={{ fontSize: '2.9rem', fontWeight: 700, margin: '18px 0 18px 0' }}>
            {t("footer.newsletter.heading")}
          </h3>
          <p style={{ fontSize: '1.3rem', color: '#a9c2d3', marginBottom: '32px' }}>
            {t("footer.newsletter.subheading")}
          </p>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.newsletter.placeholder")}
              disabled={status === "loading"}
              style={{ padding: '15px 20px', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', width: '280px', maxWidth: '80vw', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{ background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 32px', fontWeight: 700, borderRadius: '30px', cursor: status === "loading" ? 'default' : 'pointer', fontSize: '1.05rem', opacity: status === "loading" ? 0.7 : 1 }}
            >
              {status === "loading" ? t("footer.newsletter.subscribingButton") : t("footer.newsletter.subscribeButton")}
            </button>
          </form>
          {feedback && (
            <p
              role="status"
              style={{
                marginTop: '16px',
                fontSize: '0.95rem',
                color: status === "error" ? '#ffb4b4' : '#a9e3c3',
              }}
            >
              {feedback}
            </p>
          )}
        </div>
      </section>

      <div className="wrapper">
        <div className="footer-grid">
          <div>
            <h4 className="display footer-brand">{t("footer.brand.name")}</h4>
            <p className="footer-tagline">{t("footer.brand.tagline")}</p>
          </div>
          {footerColumns.map((col, i) => (
            <div key={i}>
              <h5 className="eyebrow footer-col-title">{t(`footer.columns.${col.key}.title`)}</h5>
              {col.items.map((itemKey, j) => (
                <p key={j} className="footer-link">{t(`footer.columns.${col.key}.items.${itemKey}`)}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p className="eyebrow footer-bottom-text">{t("footer.bottom.copyright")}</p>
          <p className="eyebrow footer-bottom-text">{t("footer.bottom.privacyPolicy")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;