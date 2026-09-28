import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import { stripHtml, Rich } from "../components/RichTextView";

// Rich keeps colors/bold/links; stripHtml gives plain text for alt/aria.
// Leadership, Testimonials and Special Thanks now live in ChurchTeamsPage.jsx.

const ChurchAboutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Localized church name, falls back to English if no translation exists
  const CHURCH_NAME = t("about.churchName", {
    defaultValue:
      "Ethiopian Orthodox Tewahedo Church – Debre Selam Abune Gebre Menfes Kidus Church, Udine",
  });

  // Map query includes the business name so the geocoder resolves to the verified Place listing
  const MAP_QUERY =
    "LA CHIESA ORTODOSSA TEWAHDO D'ETIOPI Abune g.menfeskidus, Via Baldasseria Bassa, 353, 33100 Udine UD, Italy";

  // Verified Google Maps place link, same place as the embed
  const MAP_PLACE_URL = "https://maps.app.goo.gl/561B5ceMkyJfWMaZ6";

  const [activeFaq, setActiveFaq] = useState(null);

  // About/Hero content from /about
  const [about, setAbout] = useState(null);
  const [aboutFallback, setAboutFallback] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setAboutLoading(true);
        setAboutFallback(false);

        let aboutRes = await API.get("/about");
        let aboutData = Array.isArray(aboutRes.data) ? aboutRes.data : [aboutRes.data];
        let latest = aboutData
          .filter(Boolean)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        if (!latest) {
          aboutRes = await API.get("/about", {
            headers: { "Accept-Language": "en" },
          });
          aboutData = Array.isArray(aboutRes.data) ? aboutRes.data : [aboutRes.data];
          latest = aboutData
            .filter(Boolean)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          if (latest) setAboutFallback(true);
        }

        setAbout(latest || null);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setAboutLoading(false);
      }
    };
    fetchAbout();
  }, [t]);

  // "Our Church Story" chapters from /church-story (paginated server-side)
  const HISTORY_PAGE_SIZE = 10;
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyHasMore, setHistoryHasMore] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyFallback, setHistoryFallback] = useState(false);

  const fetchHistory = async (page) => {
    try {
      setHistoryLoading(true);
      if (page === 1) setHistoryFallback(false);

      const params = { page, limit: HISTORY_PAGE_SIZE };
      let res = await API.get("/church-story", { params });

      let data = Array.isArray(res.data) ? res.data : res.data.stories || [];
      let totalPages = res.data.pages ?? (Array.isArray(res.data) ? 1 : undefined);

      if (page === 1 && data.length === 0) {
        res = await API.get("/church-story", {
          params,
          headers: { "Accept-Language": "en" },
        });
        data = Array.isArray(res.data) ? res.data : res.data.stories || [];
        totalPages = res.data.pages ?? (Array.isArray(res.data) ? 1 : undefined);
        if (data.length > 0) setHistoryFallback(true);
      }

      setHistory((prev) => (page === 1 ? data : [...prev, ...data]));

      if (typeof totalPages === "number") {
        setHistoryHasMore(page < totalPages);
      } else {
        setHistoryHasMore(data.length === HISTORY_PAGE_SIZE);
      }
    } catch (err) {
      console.error("Error fetching church story:", err);
      if (page === 1) setHistory([]);
      setHistoryHasMore(false);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const handleLoadMoreStory = () => {
    const nextPage = historyPage + 1;
    setHistoryPage(nextPage);
    fetchHistory(nextPage);
  };

  // Mission & Vision from /mission-vision
  const [missionVision, setMissionVision] = useState([]);
  const [missionVisionLoading, setMissionVisionLoading] = useState(true);
  const [missionVisionFallback, setMissionVisionFallback] = useState(false);

  useEffect(() => {
    const fetchMissionVision = async () => {
      try {
        setMissionVisionLoading(true);
        setMissionVisionFallback(false);

        let res = await API.get("/mission-vision");
        let data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          res = await API.get("/mission-vision", {
            headers: { "Accept-Language": "en" },
          });
          data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) setMissionVisionFallback(true);
        }

        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setMissionVision(
          sorted.map((mv) => ({
            label: mv.title,
            value: mv.desc,
          }))
        );
      } catch (err) {
        console.error("Error fetching mission/vision:", err);
        setMissionVision([]);
      } finally {
        setMissionVisionLoading(false);
      }
    };
    fetchMissionVision();
  }, [t]);

  // Faith questions from /faq?category=Faith, shown above the FAQ section
  const [faithFaqs, setFaithFaqs] = useState([]);
  const [faithFaqsLoading, setFaithFaqsLoading] = useState(true);
  const [faithFaqsFallback, setFaithFaqsFallback] = useState(false);

  useEffect(() => {
    const fetchFaithFaqs = async () => {
      try {
        setFaithFaqsLoading(true);
        setFaithFaqsFallback(false);

        let res = await API.get("/faq", { params: { category: "Faith" } });
        let data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          res = await API.get("/faq", {
            params: { category: "Faith" },
            headers: { "Accept-Language": "en" },
          });
          data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) setFaithFaqsFallback(true);
        }

        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setFaithFaqs(
          sorted.map((item) => ({
            q: stripHtml(item.question), // plain text for the button label
            a: item.answer, // HTML, rendered with Rich
          }))
        );
      } catch (err) {
        console.error("Error fetching faith questions:", err);
        setFaithFaqs([]);
      } finally {
        setFaithFaqsLoading(false);
      }
    };
    fetchFaithFaqs();
  }, [t]);

  // FAQ accordion from /faq?category=Information
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqFallback, setFaqFallback] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setFaqLoading(true);
        setFaqFallback(false);

        let res = await API.get("/faq", { params: { category: "Information" } });
        let data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          res = await API.get("/faq", {
            params: { category: "Information" },
            headers: { "Accept-Language": "en" },
          });
          data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) setFaqFallback(true);
        }

        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setFaqs(
          sorted.map((item) => ({
            q: stripHtml(item.question), // plain text for the button label
            a: item.answer, // HTML, rendered with Rich
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

  const Spinner = ({ light }) => (
    <div className="loading-spinner-wrap">
      <div className={`loading-spinner${light ? " light" : ""}`} />
    </div>
  );

  return (
    <div className="church-portal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --sky-top: #a9d3e8;
          --sky-mid: #d5eaf3;
          --sky-low: #f3f8fa;
          --navy: #1c3a52;
          --navy-deep: #0f2438;
          --slate: #3d5a6c;
          --gold: #cf9f3f;
          --white: #ffffff;
          --deep-red: #7a1010;
        }

        * { box-sizing: border-box; }

        .church-portal {
          font-family: 'Nunito Sans', sans-serif;
          background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 40%, var(--sky-low) 100%);
          color: var(--navy);
          -webkit-font-smoothing: antialiased;
        }
        .wrapper { max-width: 1180px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }
        .display { font-family: 'Cormorant Garamond', serif; }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold);
        }
        a { color: inherit; text-decoration: none; }

        .cloud-layer { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .cloud { position: absolute; background: rgba(255,255,255,0.75); border-radius: 100px; filter: blur(1px); }
        .cloud::before, .cloud::after { content: ''; position: absolute; background: inherit; border-radius: 100px; }
        .cloud-a { width: 180px; height: 55px; top: 8%; left: -10%; animation: drift 70s linear infinite; }
        .cloud-a::before { width: 90px; height: 90px; top: -45px; left: 25px; }
        .cloud-a::after { width: 70px; height: 70px; top: -30px; left: 90px; }
        .cloud-b { width: 130px; height: 40px; top: 22%; left: -15%; animation: drift 95s linear infinite; animation-delay: -20s; opacity: 0.6; }
        .cloud-b::before { width: 65px; height: 65px; top: -32px; left: 18px; }
        .cloud-b::after { width: 50px; height: 50px; top: -22px; left: 65px; }
        .cloud-c { width: 220px; height: 60px; top: 4%; left: -20%; animation: drift 120s linear infinite; animation-delay: -50s; opacity: 0.5; }
        .cloud-c::before { width: 100px; height: 100px; top: -50px; left: 30px; }
        .cloud-c::after { width: 80px; height: 80px; top: -35px; left: 110px; }
        @keyframes drift { from { transform: translateX(0); } to { transform: translateX(160vw); } }
        @media (prefers-reduced-motion: reduce) { .cloud { animation: none !important; } }

        section { padding: 90px 0; position: relative; z-index: 1; }

        .card { background: rgba(255,255,255,0.7); border: 1px solid rgba(28,58,82,0.10); border-radius: 12px; backdrop-filter: blur(6px); }

        .fact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(255,255,255,0.14); border-radius: 12px; overflow: hidden; }
        .fact-item { background: rgba(255,255,255,0.06); padding: 26px 28px; text-align: center; }
        .fact-label { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; letter-spacing: 0.01em; text-transform: none; color: var(--gold); margin: 0 0 10px 0; }
        .fact-value { font-family: 'Nunito Sans', sans-serif; font-size: 1.4rem; font-weight: 600; color: #eaf3f8; margin: 0; line-height: 1.65; }
        @media (max-width: 600px) { .fact-grid { grid-template-columns: 1fr; } }

        .body-copy {
          font-family: 'Nunito Sans', sans-serif;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 1.65;
          color: var(--navy-deep);
          margin: 0;
        }
        .body-copy.on-dark { color: #ffffff; }
        .body-copy.on-red { color: rgba(255,255,255,0.9); }

        .accordion-item { border-bottom: 1px solid rgba(28,58,82,0.14); }
        .accordion-item:first-child { border-top: 1px solid rgba(28,58,82,0.14); }
        .accordion-head {
          width: 100%; text-align: left; background: none; border: none; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 4px; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700;
          color: var(--navy-deep) !important;
        }
        .accordion-head:hover,
        .accordion-head:focus,
        .accordion-head:active,
        .accordion-head:visited {
          color: var(--navy-deep) !important;
        }
        .accordion-icon { font-family: 'IBM Plex Mono', monospace; color: var(--gold); font-size: 1.2rem; flex-shrink: 0; margin-left: 20px; }
        .accordion-body { padding: 0 4px 24px 4px; max-width: 640px; }

        .cta-band { text-align: center; }

        .map-frame {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(15,36,56,0.16);
          border: 1px solid rgba(28,58,82,0.12);
          background: #ffffff;
        }
        .map-frame iframe { width: 100%; height: 420px; display: block; border: 0; }
        @media (max-width: 600px) { .map-frame iframe { height: 300px; } }

        .about-section {
          width: 100%;
          background: #ffffff;
          padding: 90px 0;
        }
        .about-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .about-item {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
          gap: 50px;
          margin-bottom: 60px;
        }
        .about-photo-side { flex: 0 1 380px; position: relative; }
        .about-img-wrapper { position: relative; z-index: 2; display: block; cursor: pointer; }
        .about-image {
          width: 100%;
          height: 450px;
          border-radius: 20px;
          object-fit: cover;
          object-position: center;
          box-shadow: 0 25px 50px -12px rgba(15,36,56,0.25);
          display: block;
          border: 4px solid #fff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .about-img-wrapper:hover .about-image {
          transform: translateY(-4px);
          box-shadow: 0 30px 55px -10px rgba(15,36,56,0.35);
        }
        .about-art-accent {
          position: absolute;
          top: 20px; left: 20px;
          width: 100%; height: 100%;
          background: var(--sky-mid);
          border-radius: 20px;
          z-index: 1;
          border: 1px solid rgba(28,58,82,0.14);
        }
        .about-art-accent::after {
          content: '';
          position: absolute;
          bottom: -14px; right: -14px;
          width: 70px; height: 70px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.18;
        }
        .about-text-side { flex: 1.2 1 450px; padding-top: 10px; }
        .about-label {
          font-family: 'IBM Plex Mono', monospace;
          color: var(--deep-red);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.82rem;
        }
        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: var(--navy-deep);
          margin: 16px 0;
          font-weight: 700;
          line-height: 1.1;
        }
        .about-description {
          font-size: 1.5rem;
          line-height: 1.6;
          color: var(--slate);
          margin-bottom: 26px;
        }
        .about-tags { display: flex; gap: 10px; flex-wrap: wrap; }
        .about-tag {
          background: var(--sky-low);
          border: 1px solid rgba(28,58,82,0.16);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--navy);
          font-weight: 700;
        }
        .read-full-story-btn {
          display: inline-block;
          margin-left: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #ffffff;
          background: var(--deep-red);
          border: 1.5px solid var(--deep-red);
          padding: 8px 18px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .read-full-story-btn:hover { background: var(--navy-deep); border-color: var(--navy-deep); }
        .load-more-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--navy-deep);
          background: transparent;
          border: 1.5px solid var(--navy-deep);
          padding: 12px 30px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .load-more-btn:hover { background: var(--navy-deep); color: #eaf3f8; }
        .load-more-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 900px) {
          .about-item { flex-direction: column; align-items: center; text-align: center; }
          .about-photo-side { flex: 0 1 100%; width: 100%; max-width: 450px; }
          .about-description { text-align: center; }
          .about-tags { justify-content: center; }
          .about-title { font-size: 1.8rem; }
        }
        @media (max-width: 480px) {
          .about-image { height: 350px; }
          .about-title { font-size: 1.6rem; }
        }

        html, body { overflow-x: hidden; width: 100%; }
        .church-portal { overflow-x: hidden; }
        img, video { max-width: 100%; height: auto; }
        *, *::before, *::after { min-width: 0; }

        @media (max-width: 1024px) {
          .wrapper { padding: 0 20px; }
          .about-container { padding: 0 20px; }
          section { padding: 70px 0; }
          .about-section { padding: 70px 0; }
        }

        @media (max-width: 900px) {
          section { padding: 60px 0; }
          .about-section { padding: 60px 0; }
          .about-hero-flex { gap: 36px !important; }
        }

        @media (max-width: 768px) {
          .wrapper { padding: 0 18px; }
          .about-container { padding: 0 18px; }
          section { padding: 50px 0; }
          .about-section { padding: 50px 0; }

          .give-info-box { width: 100% !important; padding: 22px !important; }
          .give-info-box p { word-break: break-word; }
        }

        @media (max-width: 600px) {
          section { padding: 40px 0; }
          .about-section { padding: 40px 0; }
          .wrapper { padding: 0 16px; }
          .about-container { padding: 0 16px; }

          .about-hero-flex { gap: 28px !important; }
          .about-hero-image-col { flex: 0 1 260px !important; min-width: 220px !important; }

          .hero-title { margin-bottom: 20px !important; }
          .hero-desc { font-size: 1.05rem !important; line-height: 1.55 !important; margin-bottom: 20px !important; max-width: none !important; }

          .body-copy,
          .about-description,
          .fact-value {
            font-size: 1.05rem !important;
            line-height: 1.55 !important;
          }
          .about-description { margin-bottom: 20px !important; }

          .fact-item { padding: 20px; }
          .accordion-head { font-size: 1.25rem; padding: 20px 4px; }
          .accordion-body { padding: 0 4px 20px 4px; }
        }

        @media (max-width: 480px) {
          section { padding: 32px 0; }
          .about-section { padding: 32px 0; }
          .wrapper { padding: 0 14px; }
          .about-container { padding: 0 14px; }

          .about-hero-flex { gap: 22px !important; }
          .about-hero-text-col { min-width: 0 !important; }
          .about-hero-image-col { flex: 0 1 100% !important; min-width: 0 !important; width: 100% !important; }

          .hero-title { font-size: 1.7rem !important; margin-bottom: 16px !important; }
          .hero-desc { font-size: 1rem !important; margin-bottom: 16px !important; }

          .body-copy,
          .about-description,
          .fact-value {
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }
          .about-description { margin-bottom: 16px !important; }

          .give-info-box { padding: 18px !important; }
          .give-info-box p { font-size: 1rem !important; }
        }

        @media (max-width: 360px) {
          .wrapper { padding: 0 12px; }
          .about-container { padding: 0 12px; }
          section { padding: 26px 0; }
          .about-section { padding: 26px 0; }

          .about-image { height: 300px; }
        }

        .loading-spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 70px 0;
          width: 100%;
        }
        .loading-spinner {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 4px solid rgba(28, 58, 82, 0.15);
          border-top-color: var(--gold);
          animation: spin 0.85s linear infinite;
        }
        .loading-spinner.light {
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--gold);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .hero-cta-row { flex-wrap: nowrap !important; gap: 10px !important; align-items: stretch; }
          .hero-cta-btn {
            flex: 1 1 0;
            min-width: 0;
            padding: 13px 10px !important;
            font-size: 0.92rem !important;
            white-space: normal;
            line-height: 1.2;
          }
        }

        @media (max-width: 900px) {
          .about-label { display: block; text-align: center; }
        }

        @media (max-width: 900px) {
          h1.display, h2.display, h4.display { text-align: center !important; }
          .body-copy { text-align: center; }
          .eyebrow { display: block; text-align: center; }
          .about-tags { justify-content: center; }
          .accordion-head { justify-content: center; text-align: center; }
          .accordion-body { text-align: center; margin: 0 auto; }
          .fact-item { text-align: center !important; }
          .fact-label, .fact-value { width: 100%; text-align: center !important; }
        }

        .map-address-line {
          margin-top: 16px;
          font-size: 1.05rem;
          color: var(--slate);
        }
        .map-address-link {
          color: var(--deep-red);
          text-decoration: underline;
          font-weight: 600;
        }
        .map-address-link:hover { color: var(--navy-deep); }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      {/* HERO */}
      <section style={{ padding: '100px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper about-hero-flex" style={{ display: 'flex', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>
          {aboutLoading ? (
            <div style={{ width: '100%' }}>
              <Spinner light />
            </div>
          ) : (
          <>
          <div className="about-hero-text-col" style={{ flex: '1', minWidth: '320px', textAlign: 'left' }}>
            {about?.id ? (
              <Link to={`/about/${about.id}`} style={{ display: 'block', cursor: 'pointer' }}>
                <h1 className="display hero-title" style={{ fontSize: 'clamp(1rem, 6vw, 3rem)', fontWeight: 700, lineHeight: 1.08, margin: '0 0 26px 0', padding: 0, textAlign: 'left', color: '#eaf3f8' }}>
                  <Rich html={about?.title} fallback={t("about.hero.titleFallback")} />
                </h1>
                {/* Inside a Link: links in the text render as plain underlined text (nested anchors are invalid) */}
                <Rich
                  className="hero-desc"
                  inline={false}
                  html={about?.description || t("about.hero.descriptionFallback", { churchName: CHURCH_NAME })}
                />
              </Link>
            ) : (
              <>
                <h1 className="display hero-title" style={{ fontSize: 'clamp(1rem, 6vw, 3rem)', fontWeight: 700, lineHeight: 1.08, margin: '0 0 26px 0', padding: 0, textAlign: 'left', color: '#eaf3f8' }}>
                  <Rich html={about?.title} unwrapLinks={false} fallback={t("about.hero.titleFallback")} />
                </h1>
                <Rich
                  className="hero-desc"
                  inline={false}
                  unwrapLinks={false}
                  html={about?.description || t("about.hero.descriptionFallback", { churchName: CHURCH_NAME })}
                />
              </>
            )}
            <div className="hero-cta-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                className="hero-cta-btn"
                onClick={() => document.getElementById('our-church-story')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}
              >
                {t("about.hero.readStoryButton")}
              </button>
              <button
                className="hero-cta-btn"
                onClick={() => navigate('/contact')}
                style={{ backgroundColor: 'transparent', color: '#eaf3f8', border: '1.5px solid #eaf3f8', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}
              >
                {t("about.hero.sayHelloButton")}
              </button>
            </div>
            {aboutFallback && (
              <p style={{ fontSize: '0.85rem', color: '#a9c2d3', margin: '18px 0 0 0' }}>
                {t("about.hero.fallbackNotice")}
              </p>
            )}
          </div>
          <div className="about-hero-image-col" style={{ flex: '0 0 340px', minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              {about?.id ? (
                <Link to={`/about/${about.id}`} style={{ display: 'block', width: '100%' }}>
                  <img
                    src={about?.image || "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=80"}
                    alt={stripHtml(about?.title) || t("about.hero.imageAltFallback", { churchName: CHURCH_NAME })}
                    style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)', cursor: 'pointer', display: 'block' }}
                  />
                </Link>
              ) : (
                <img
                  src={about?.image || "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=80"}
                  alt={stripHtml(about?.title) || t("about.hero.imageAltFallback", { churchName: CHURCH_NAME })}
                  style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)', display: 'block' }}
                />
              )}
            </div>
            {about?.churchLeader && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '14px' }}>
                <p className="display" style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, color: '#eaf3f8', margin: '0 0 2px 0' }}>
                  {stripHtml(about.churchLeader)}
                </p>
                <p className="eyebrow" style={{ textAlign: 'center', fontSize: '0.72rem', margin: 0 }}>
                  {t("about.hero.churchLeaderLabel")}
                </p>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </section>

      {/* MISSION & VISION */}
      <section style={{ background: 'var(--deep-red)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="wrapper">
          {missionVisionFallback && !missionVisionLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#a9c2d3', marginBottom: '20px' }}>
              {t("about.missionVision.fallbackNotice", { defaultValue: "Showing English content." })}
            </p>
          )}
          {missionVisionLoading ? (
            <Spinner light />
          ) : (
            <div className="fact-grid">
              {missionVision.map((m, i) => (
                <div className="fact-item" key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {/* div, not p: rich text renders block HTML */}
                  <div className="fact-label" style={{ textAlign: 'center' }}>
                    <Rich html={m.label} unwrapLinks={false} />
                  </div>
                  <Rich className="fact-value" inline={false} unwrapLinks={false} html={m.value} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OUR STORY (paginated via /church-story?page=&limit=) */}
      <section className="about-section" id="our-church-story">
        <div className="about-container">
          <h2 className="display" style={{ fontSize: '2.8rem', fontWeight: 700, margin: '0 0 50px 0', color: 'var(--navy-deep)', textAlign: 'left' }}>
            {t("about.story.heading")}
          </h2>

          {historyFallback && (
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888', marginTop: '-30px', marginBottom: '40px' }}>
              {t("about.story.fallbackNotice")}
            </p>
          )}

          {history.map((item, index) => {
            // Only the latest chapter (index 0) is shown in full, older ones are truncated
            const STORY_WORD_LIMIT = 60;
            const isLatest = index === 0;

            return (
            <div key={item.id} className="about-item">

              <div className="about-photo-side">
                {item.photo && (
                  <Link to={`/about/story/${item.id}`} className="about-img-wrapper">
                    <img
                      src={item.photo}
                      alt={stripHtml(item.title)}
                      className="about-image"
                    />
                  </Link>
                )}
                <div className="about-art-accent"></div>
              </div>

              <div className="about-text-side">
                <span className="about-label">
                  {t("about.story.ledByLabel", {
                    leaderRole: stripHtml(item.leaderRole),
                    range: stripHtml(item.range),
                    defaultValue: "{{leaderRole}} · Led {{range}}",
                  })}
                </span>

                <h2 className="about-title">
                  <Rich html={item.title} unwrapLinks={false} />
                </h2>
                {/* Not inside a Link, so links stay clickable */}
                <div className="about-description">
                  {isLatest ? (
                    <Rich html={item.desc} inline={false} unwrapLinks={false} />
                  ) : (
                    <Rich html={item.desc} words={STORY_WORD_LIMIT} unwrapLinks={false} />
                  )}
                </div>
                <div className="about-tags">
                  <div className="about-tag"><Rich html={item.leader} unwrapLinks={false} /></div>
                  <div className="about-tag"><Rich html={item.range} unwrapLinks={false} /></div>
                  <div className="about-tag"><Rich html={item.servedBy} unwrapLinks={false} /></div>
                  <Link to={`/about/story/${item.id}`} className="read-full-story-btn">
                    {t("about.story.readFullStoryButton")}
                  </Link>
                </div>
              </div>
            </div>
            );
          })}

          {history.length === 0 && historyLoading && (
            <Spinner />
          )}

          {history.length === 0 && !historyLoading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p className="display" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--navy-deep)', margin: '0 0 8px 0' }}>
                {t("about.story.noneTitle")}
              </p>
              <p style={{ color: 'var(--slate)', fontSize: '1rem', margin: 0 }}>
                {t("about.story.noneSubtitle")}
              </p>
            </div>
          )}

          {historyHasMore && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button className="load-more-btn" onClick={handleLoadMoreStory} disabled={historyLoading}>
                {historyLoading ? t("about.story.loadingMoreButton") : t("about.story.loadMoreButton")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* LINK TO TEAMS PAGE */}
      <section style={{ background: 'var(--deep-red)', paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="wrapper" style={{ maxWidth: '760px', textAlign: 'center' }}>
          <h2 className="display" style={{ fontSize: '2.4rem', fontWeight: 700, margin: '0 0 20px 0', color: '#ffffff' }}>
            {t("about.teamLink.heading", { defaultValue: "Meet Our Team" })}
          </h2>
          <Link
            to="/church-teams"
            style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '30px', display: 'inline-block' }}
          >
            {t("about.teamLink.button", { defaultValue: "View the team" })}
          </Link>
        </div>
      </section>

      {/* FAITH QUESTIONS from /faq?category=Faith, above the FAQ section */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: '2.8rem', fontWeight: 700, margin: '0 0 30px 0', color: 'var(--navy-deep)', textAlign: 'left' }}>
            {t("about.faithFaq.heading", { defaultValue: "Questions of Faith" })}
          </h2>

          {faithFaqsFallback && !faithFaqsLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '-14px', marginBottom: '30px' }}>
              {t("about.faithFaq.fallbackNotice", { defaultValue: "Showing English content." })}
            </p>
          )}

          {faithFaqsLoading ? (
            <Spinner />
          ) : (
            <div>
              {faithFaqs.map((f, i) => (
                <div className="accordion-item" key={`faith-${i}`}>
                  <button className="accordion-head" onClick={() => setActiveFaq(activeFaq === `faith-${i}` ? null : `faith-${i}`)}>
                    {f.q}
                    <span className="accordion-icon">{activeFaq === `faith-${i}` ? '−' : '+'}</span>
                  </button>
                  {activeFaq === `faith-${i}` && (
                    <div className="accordion-body">
                      <Rich className="body-copy" inline={false} unwrapLinks={false} html={f.a} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ from /faq?category=Information */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: '2.8rem', fontWeight: 700, margin: '0 0 30px 0', color: 'var(--navy-deep)', textAlign: 'left' }}>
            {t("about.faq.heading")}
          </h2>

          {faqFallback && !faqLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '-14px', marginBottom: '30px' }}>
              {t("about.faq.fallbackNotice", { defaultValue: "Showing English content." })}
            </p>
          )}

          {faqLoading ? (
            <Spinner />
          ) : (
            <div>
              {faqs.map((f, i) => (
                <div className="accordion-item" key={`info-${i}`}>
                  <button className="accordion-head" onClick={() => setActiveFaq(activeFaq === `info-${i}` ? null : `info-${i}`)}>
                    {f.q}
                    <span className="accordion-icon">{activeFaq === `info-${i}` ? '−' : '+'}</span>
                  </button>
                  {activeFaq === `info-${i}` && (
                    <div className="accordion-body">
                      <Rich className="body-copy" inline={false} unwrapLinks={false} html={f.a} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SUPPORT & GET INVOLVED: account details plus give/volunteer buttons */}
      <div style={{ background: 'var(--deep-red)' }}>
        <section className="cta-band">
          <div className="wrapper" style={{ maxWidth: '760px', textAlign: 'center' }}>
            <h2 className="display" style={{ fontSize: '2.8rem', fontWeight: 700, margin: '0 0 20px 0', color: '#ffffff' }}>
              {t("about.support.heading")}
            </h2>
            <p className="body-copy on-red" style={{ margin: '0 auto 34px auto', maxWidth: '600px' }}>
              {t("about.support.description")}
            </p>

            <div
              className="give-info-box"
              style={{
                display: 'inline-block',
                textAlign: 'left',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '28px 34px',
                marginBottom: '34px',
              }}
            >
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>{t("about.support.bankTransferLabel")}</p>
              <p style={{ color: '#ffffff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.15rem', fontWeight: 600, margin: '0 0 20px 0' }}>
                {t("about.support.accountName", { churchName: CHURCH_NAME })}<br />
                {t("about.support.accountNumber")}
              </p>
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>{t("about.support.onlineGivingLabel")}</p>
              <p style={{ color: '#ffffff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
                {t("about.support.merchantName", { churchName: CHURCH_NAME })}
              </p>
            </div>

            {/* Give and Volunteer link to the #accounts and #volunteer sections on /church-support */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                to="/church-support#accounts"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px', textDecoration: 'none', display: 'inline-block' }}
              >
                {t("about.cta.giveButton")}
              </Link>
              <Link
                to="/church-support#volunteer"
                style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1.5px solid #ffffff', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px', textDecoration: 'none', display: 'inline-block' }}
              >
                {t("about.cta.volunteerButton")}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* FIND US (MAP) with plain-text address and link to the verified Google Maps place */}
      <div style={{ background: '#ffffff' }}>
        <section style={{ paddingTop: '60px', paddingBottom: '0px' }}>
          <div className="wrapper" style={{ maxWidth: '1000px', textAlign: 'center' }}>
            <h2 className="display" style={{ fontSize: '2.8rem', fontWeight: 700, margin: '0 0 18px 0', color: 'var(--navy-deep)' }}>
              {t("about.map.heading", { defaultValue: "Find Us" })}
            </h2>
            <p className="body-copy" style={{ margin: '0 auto 34px auto', maxWidth: '600px', color: 'var(--slate)' }}>
              {t("about.map.description", { churchName: CHURCH_NAME, defaultValue: "Visit us at {{churchName}}." })}
            </p>
            <div className="map-frame" style={{ marginBottom: 0 }}>
              <iframe
                title={t("about.map.iframeTitle", { defaultValue: "Church location map" })}
                src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="map-address-line">
              {t("about.map.placeName", { defaultValue: MAP_QUERY })}
              {" — "}
              <a
                href={MAP_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="map-address-link"
              >
                {t("about.map.linkLabel", { defaultValue: "Open in Google Maps" })}
              </a>
            </p>
          </div>
        </section>
      </div>

    </div>
  );
};

export default ChurchAboutPage;