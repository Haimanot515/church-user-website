import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import { stripHtml, Rich } from "../components/RichTextView";
import Spinner from "../components/Spinner";
import useInView from "../hooks/useInView";


const ChurchAboutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const CHURCH_NAME = t("about.churchName", {
    defaultValue:
      "Ethiopian Orthodox Tewahedo Church – Debre Selam Abune Gebre Menfes Kidus Church, Udine",
  });

  const MAP_QUERY =
    "LA CHIESA ORTODOSSA TEWAHDO D'ETIOPI Abune g.menfeskidus, Via Baldasseria Bassa, 353, 33100 Udine UD, Italy";

  const MAP_PLACE_URL = "https://maps.app.goo.gl/561B5ceMkyJfWMaZ6";

  const [activeFaq, setActiveFaq] = useState(null);
  const [historyRef, historySeen] = useInView();
  const [missionRef, missionSeen] = useInView();
  const [faithRef, faithSeen] = useInView();
  const [faqRef, faqSeen] = useInView();

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
    if (historySeen) fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, historySeen]);

  const handleLoadMoreStory = () => {
    const nextPage = historyPage + 1;
    setHistoryPage(nextPage);
    fetchHistory(nextPage);
  };

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
    if (missionSeen) fetchMissionVision();
  }, [t, missionSeen]);

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
            q: stripHtml(item.question),
            a: item.answer,
          }))
        );
      } catch (err) {
        console.error("Error fetching faith questions:", err);
        setFaithFaqs([]);
      } finally {
        setFaithFaqsLoading(false);
      }
    };
    if (faithSeen) fetchFaithFaqs();
  }, [t, faithSeen]);

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
            q: stripHtml(item.question),
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
    if (faqSeen) fetchFaqs();
  }, [t, faqSeen]);


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
          --button-red: #a81c1c;
          --button-red-hover: #7a1010;
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

        .fact-grid.mv-grid {
          background: transparent;
          border-radius: 0;
          overflow: visible;
          gap: 48px;
          width: min(1500px, 96vw);
          max-width: none;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }
        .fact-item.mv-card {
          position: relative;
          padding: 48px 36px;
          border-radius: 18px;
          border: 2px solid rgba(207,159,63,0.6);
          background-color: #4a2e18;
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='c' x='0' y='0' width='100%25' height='100%25'><feTurbulence type='fractalNoise' baseFrequency='0.018' numOctaves='4' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.05 0 0 0 0 0.03 0 0 0 0 0.01 0 0 0 1.6 -0.55'/></filter><rect width='100%25' height='100%25' filter='url(%23c)'/></svg>"),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='g' x='0' y='0' width='100%25' height='100%25'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.1 0 0 0 0 0.04 0 0 0 0.9 -0.18'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>"),
            radial-gradient(circle at 12% 18%, rgba(168,124,78,0.55) 0 2px, transparent 3px),
            radial-gradient(circle at 63% 41%, rgba(30,17,8,0.7) 0 3px, transparent 4px),
            radial-gradient(circle at 82% 77%, rgba(150,108,66,0.5) 0 2px, transparent 3px),
            radial-gradient(circle at 37% 88%, rgba(25,14,6,0.65) 0 2px, transparent 3px),
            radial-gradient(ellipse at 30% 0%, #7a5330 0%, transparent 60%),
            linear-gradient(160deg, #6a4527 0%, #4a2e18 55%, #331e0e 100%);
          background-size: 320px 320px, 260px 260px, 83px 83px, 127px 127px, 97px 97px, 151px 151px, 100% 100%, 100% 100%;
          box-shadow: inset 0 0 70px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,220,160,0.12), 0 22px 40px rgba(0,0,0,0.38);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .fact-item.mv-card:hover {
          transform: translateY(-5px);
          box-shadow: inset 0 0 70px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,220,160,0.12), 0 28px 48px rgba(0,0,0,0.48);
        }
        .mv-card .fact-label { text-shadow: 0 2px 6px rgba(0,0,0,0.55); font-size: 2.1rem; }
        .mv-card .fact-value { color: #f8ecdb; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
        @media (max-width: 600px) {
          .fact-grid.mv-grid { gap: 30px; }
          .fact-item.mv-card { padding: 34px 22px; }
          .mv-card .fact-label { font-size: 1.7rem; }
        }

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

        /* FAQ - same look as Contact and Travel pages */
        .faq-item { border-bottom: 1px solid rgba(28,58,82,0.14); }
        .faq-item:first-child { border-top: 1px solid rgba(28,58,82,0.14); }
        .faq-question {
          width: 100%; text-align: left; background: none; border: none; cursor: pointer;
          padding: 24px 0; display: flex; justify-content: space-between; align-items: center;
          gap: 20px; font-family: 'Cormorant Garamond', serif; font-size: 1.65rem; font-weight: 700;
          color: var(--navy-deep);
        }
        .faq-toggle {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          border: 1.5px solid var(--gold); color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-family: 'IBM Plex Mono', monospace;
        }
        .faq-answer { padding: 0 0 26px 0; font-size: 1.2rem; color: #3d5a6c; line-height: 1.8; max-width: 640px; text-align: left; }
        .faq-section + div + .faq-section { padding-top: 0; }
        @media (max-width: 900px) {
          .faq-section h2.display { text-align: left !important; }
        }
        @media (max-width: 600px) {
          .faq-question { font-size: 1.35rem; padding: 20px 0; }
          .faq-answer { font-size: 1.05rem; line-height: 1.65; }
        }

        /* Unified typography - every section follows the Our Church Story style */
        .church-portal h2.display {
          font-size: 2.8rem !important;
          font-weight: 700 !important;
          line-height: 1.1 !important;
          letter-spacing: normal !important;
          -webkit-text-stroke: 0 !important;
        }
        .church-portal h2.display:not(.team-card-title) { margin: 0 0 40px 0 !important; }
        .church-portal h3.display,
        .church-portal .location-name {
          font-size: 2rem !important;
          font-weight: 700 !important;
          line-height: 1.1 !important;
          letter-spacing: normal !important;
          -webkit-text-stroke: 0 !important;
        }
        .church-portal .faq-question { font-size: 1.5rem; font-weight: 700; }
        .church-portal .team-card-desc,
        .church-portal .support-card-text,
        .church-portal .location-address,
        .church-portal .faq-answer,
        .church-portal .body-copy.on-red {
          font-size: 1.5rem !important;
          font-weight: 400 !important;
          line-height: 1.6 !important;
        }
        .church-portal .faq-answer p { font-size: inherit; line-height: inherit; margin: 0 0 12px 0; }
        @media (max-width: 900px) {
          .church-portal h2.display { font-size: 2.3rem !important; }
          .church-portal h3.display,
          .church-portal .location-name { font-size: 1.8rem !important; }
        }
        @media (max-width: 600px) {
          .church-portal h2.display { font-size: 2rem !important; }
          .church-portal .faq-question { font-size: 1.25rem; }
          .church-portal .team-card-desc,
          .church-portal .support-card-text,
          .church-portal .location-address,
          .church-portal .faq-answer,
          .church-portal .body-copy.on-red {
            font-size: 1.05rem !important;
            line-height: 1.55 !important;
          }
        }
        @media (max-width: 480px) {
          .church-portal h3.display,
          .church-portal .location-name { font-size: 1.6rem !important; }
        }

        /* Unified type - labels, buttons, empty state and notices follow the story style */
        .church-portal .team-card-label,
        .church-portal .support-card-label {
          font-family: 'IBM Plex Mono', monospace !important;
          font-size: 0.82rem !important;
          font-weight: 700 !important;
          letter-spacing: 2px !important;
          text-transform: uppercase !important;
        }
        .church-portal .team-card-btn,
        .church-portal .support-card-btn,
        .church-portal .location-btn {
          font-family: 'IBM Plex Mono', monospace !important;
          font-size: 0.85rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.04em !important;
        }
        .church-portal p.display {
          font-size: 2rem !important;
          font-weight: 700 !important;
          line-height: 1.1 !important;
        }
        .church-portal .faq-answer,
        .church-portal .faq-answer * { font-family: 'Nunito Sans', sans-serif; }

        /* Type matched to the Home page Current Series section */
        .church-portal .about-title,
        .church-portal h3.display,
        .church-portal .location-name,
        .church-portal p.display {
          font-family: Georgia, serif !important;
          font-size: 2rem !important;
          font-weight: 600 !important;
          line-height: 1 !important;
          letter-spacing: normal !important;
          -webkit-text-stroke: 0 !important;
        }
        .church-portal .faq-question {
          font-family: Georgia, serif !important;
          font-size: 1.5rem !important;
          font-weight: 600 !important;
        }
        .church-portal .about-description,
        .church-portal .team-card-desc,
        .church-portal .support-card-text,
        .church-portal .location-address,
        .church-portal .faq-answer,
        .church-portal .body-copy.on-red {
          font-family: 'Nunito Sans', sans-serif !important;
          font-size: 1.5rem !important;
          font-weight: 400 !important;
          line-height: 1.6 !important;
        }
        .church-portal .read-full-story-btn,
        .church-portal .team-card-btn,
        .church-portal .support-card-btn,
        .church-portal .location-btn {
          font-family: 'Nunito Sans', sans-serif !important;
          font-size: 1rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.04em !important;
        }
        @media (max-width: 900px) {
          .church-portal .about-title,
          .church-portal h3.display,
          .church-portal .location-name,
          .church-portal p.display { font-size: 1.8rem !important; }
        }
        @media (max-width: 600px) {
          .church-portal .faq-question { font-size: 1.25rem !important; }
          .church-portal .about-description,
          .church-portal .team-card-desc,
          .church-portal .support-card-text,
          .church-portal .location-address,
          .church-portal .faq-answer,
          .church-portal .body-copy.on-red {
            font-size: 1.05rem !important;
            line-height: 1.55 !important;
          }
        }
        @media (max-width: 480px) {
          .church-portal .about-title,
          .church-portal h3.display,
          .church-portal .location-name,
          .church-portal p.display { font-size: 1.6rem !important; }
        }

        /* Lighter weights from the FAQ sections down to the bottom of the page */
        .church-portal .team-section ~ * h2.display { font-weight: 600 !important; }
        .church-portal .team-section ~ * h3.display,
        .church-portal .team-section ~ * .location-name,
        .church-portal .team-section ~ * .faq-question { font-weight: 400 !important; }
        .church-portal .team-section ~ * .support-card-label { font-weight: 500 !important; }
        .church-portal .team-section ~ * .support-card-btn,
        .church-portal .team-section ~ * .location-btn { font-weight: 600 !important; }

        /* Lighter weights for the leadership team section too */
        .church-portal .team-section h2.display { font-weight: 600 !important; }
        .church-portal .team-section .team-card-label { font-weight: 500 !important; }
        .church-portal .team-section .team-card-btn { font-weight: 600 !important; }

        /* Lighter weights for the support section, set directly on its own classes */
        .church-portal .support-head-text h2.display { font-weight: 600 !important; }
        .church-portal .support-card .support-card-title { font-weight: 400 !important; }
        .church-portal .support-card .support-card-label { font-weight: 500 !important; }
        .church-portal .support-card .support-card-btn { font-weight: 600 !important; }
        .church-portal .support-card .support-card-text,
        .church-portal .support-head-text .body-copy { font-weight: 400 !important; }

        /* FAQ question and answer sizes match the item titles and text of the other sections */
        .church-portal .faq-question { font-size: 2rem !important; line-height: 1.1 !important; }
        .church-portal .faq-answer,
        .church-portal .faq-answer p { font-size: 1.5rem !important; line-height: 1.6 !important; max-width: 900px; }
        @media (max-width: 900px) {
          .church-portal .faq-question { font-size: 1.8rem !important; }
        }
        @media (max-width: 600px) {
          .church-portal .faq-question { font-size: 1.8rem !important; }
          .church-portal .faq-answer,
          .church-portal .faq-answer p { font-size: 1.05rem !important; line-height: 1.55 !important; }
        }
        @media (max-width: 480px) {
          .church-portal .faq-question { font-size: 1.6rem !important; }
        }

        /* FAQ questions use the normal text size of the page */
        .church-portal .faq-question { font-size: 1.5rem !important; line-height: 1.6 !important; }
        @media (max-width: 900px) {
          .church-portal .faq-question { font-size: 1.5rem !important; }
        }
        @media (max-width: 600px) {
          .church-portal .faq-question { font-size: 1.05rem !important; line-height: 1.55 !important; }
        }
        @media (max-width: 480px) {
          .church-portal .faq-question { font-size: 1.05rem !important; }
        }

        /* No underlines anywhere on the About page, including links from the rich text editor */
        .church-portal a,
        .church-portal a:hover,
        .church-portal u,
        .church-portal span,
        .church-portal [style*="underline"] {
          text-decoration: none !important;
          text-decoration-line: none !important;
        }

        .cta-band { text-align: center; }

        .about-hero-text-col .hero-cta-row {
          display: grid !important;
          grid-template-columns: repeat(2, 200px);
          justify-content: start;
          align-items: stretch;
        }
        .about-hero-text-col .hero-cta-btn {
          width: 100%;
          min-height: 44px;
          padding: 10px 16px !important;
          border: 1.5px solid var(--button-red) !important;
          font-size: 1.05rem !important;
          line-height: 1.2;
          text-align: center;
          border-radius: 10px !important;
        }
        .about-hero-text-col .hero-cta-btn + .hero-cta-btn { border-color: #eaf3f8 !important; }
        .about-hero-text-col .hero-cta-btn:first-child { background-color: var(--button-red) !important; color: #ffffff !important; }
        .about-hero-text-col .hero-cta-btn:first-child:hover { background-color: var(--button-red-hover) !important; border-color: var(--button-red-hover) !important; }
        .about-section .load-more-btn { background: var(--button-red); }
        .about-section .load-more-btn:hover { background: var(--button-red-hover); }
        .about-section .load-more-btn:disabled { background: #ccc; }
        @media (max-width: 600px) {
          .about-hero-text-col .hero-cta-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .about-hero-text-col .hero-cta-btn { font-size: 0.92rem !important; }
        }

        .about-hero-text-col .hero-cta-row { gap: 80px !important; }
        @media (max-width: 600px) {
          .about-hero-text-col .hero-cta-row { gap: 48px !important; }
        }

        .about-hero-text-col .hero-desc { margin-bottom: 0 !important; }
        .about-hero-text-col .hero-desc > :last-child { margin-bottom: 0 !important; }
        .about-hero-text-col .hero-cta-row { margin-top: 56px; }
        @media (max-width: 600px) {
          .about-hero-text-col .hero-cta-row { margin-top: 44px; }
        }

        .location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 46px; align-items: center; }
        .map-frame { width: 100%; aspect-ratio: 4/3; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 40px rgba(15,36,56,0.16); border: 1px solid rgba(28,58,82,0.12); }
        .map-frame iframe { width: 100%; height: 100%; display: block; border: 0; }
        .location-name { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 700; color: var(--navy-deep); line-height: 1.25; margin: 0 0 14px 0; text-align: left; }
        .location-address { font-size: 1.25rem; color: var(--slate); line-height: 1.7; margin: 0 0 28px 0; text-align: left; }
        .location-btn { display: inline-block; }
        @media (max-width: 800px) {
          .location-grid { grid-template-columns: 1fr; gap: 30px; }
          .location-name { font-size: 1.6rem; }
          .location-address { font-size: 1.05rem; }
          .location-btn { width: 100%; }
        }

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
          align-items: stretch;
          justify-content: center;
          gap: 50px;
          margin-bottom: 60px;
        }
        .about-photo-side { flex: 0 1 380px; position: relative; align-self: stretch; min-height: 450px; }
        .about-img-wrapper { position: relative; z-index: 2; display: block; cursor: pointer; height: 100%; }
        .about-image {
          width: 100%;
          height: 100%;
          min-height: 450px;
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
          background: var(--button-red);
          border: 1.5px solid var(--button-red);
          padding: 8px 18px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .read-full-story-btn:hover { background: var(--navy-deep); border-color: var(--navy-deep); }
        @media (max-width: 900px) {
          .about-item { flex-direction: column; align-items: center; text-align: center; }
          .about-photo-side { flex: 0 1 100%; width: 100%; max-width: 450px; min-height: 0; }
          .about-img-wrapper { height: auto; }
          .about-image { height: 450px; min-height: 0; }
          .about-description { text-align: center; }
          .about-tags { justify-content: center; }
          .about-title { font-size: 1.8rem; }
        }
        @media (max-width: 480px) {
          .about-image { height: 350px; min-height: 0; }
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

        /* story-fit-override */
        @media (min-width: 901px) {
          .about-item { align-items: stretch !important; }
          .about-photo-side { align-self: stretch !important; min-height: 450px !important; }
          .about-img-wrapper { height: 100% !important; }
          .about-image { height: 100% !important; min-height: 450px !important; }
        }

        /* story-card-cover */
        .about-art-accent { display: none !important; }

        /* button-shape-match */
        .read-full-story-btn,
        .load-more-btn,
        a[href="/church-teams"],
        a[href^="/church-support#"] {
          border-radius: 10px !important;
        }

        /* story-image-wider-left */
        @media (min-width: 901px) {
          .about-photo-side { flex: 0 1 404px !important; margin-left: -24px !important; }
        }
        @media (min-width: 1200px) {
          .about-photo-side { flex: 0 1 480px !important; margin-left: -100px !important; }
        }

        /* story-gap-after-first */
        .about-item + .about-item { margin-top: 50px; }

        /* story-image-left-distance */
        @media (min-width: 901px) {
          .about-photo-side { flex: 0 1 392px !important; margin-left: -12px !important; }
        }
        @media (min-width: 1200px) {
          .about-photo-side { flex: 0 1 430px !important; margin-left: -50px !important; }
        }

        /* support-grid */
        .support-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }
        .support-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 36px 34px;
          border-radius: 16px;
          border: 1.5px solid rgba(207,159,63,0.55);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 18px 34px rgba(0,0,0,0.25);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .support-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.11);
          box-shadow: 0 24px 42px rgba(0,0,0,0.35);
        }
        .support-card-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gold);
        }
        .support-card-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 12px 0 12px 0;
          text-align: left;
        }
        .support-card-text {
          font-family: 'Nunito Sans', sans-serif;
          font-size: 1.25rem;
          line-height: 1.6;
          color: #f3e3e3;
          margin: 0 0 28px 0;
          text-align: left;
          flex: 1;
        }
        .support-card-btn {
          display: inline-block;
          min-width: 180px;
          padding: 12px 24px;
          text-align: center;
          font-size: 1.05rem;
          font-weight: 700;
          text-decoration: none;
          border-radius: 10px !important;
        }
        .support-card-btn-fill { background: var(--gold); color: var(--navy-deep); border: 1.5px solid var(--gold); }
        .support-card-btn-fill:hover { background: #e0b25a; border-color: #e0b25a; }
        .support-card-btn-outline { background: transparent; color: #ffffff; border: 1.5px solid #ffffff; }
        .support-card-btn-outline:hover { background: rgba(255,255,255,0.14); }
        @media (max-width: 800px) {
          .support-grid { grid-template-columns: 1fr; gap: 22px; }
          .support-card { padding: 28px 24px; }
          .support-card-title { font-size: 1.9rem; }
          .support-card-btn { width: 100%; }
        }

        /* support-graphic */
        .support-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 44px;
        }
        .support-head-text { flex: 1 1 420px; }
        .support-art { flex: 0 0 260px; }
        .support-art svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 14px 22px rgba(0,0,0,0.3)); }
        @media (max-width: 800px) {
          .support-head { flex-direction: column; align-items: center; gap: 24px; }
          .support-head-text { flex: 0 0 auto; width: 100%; }
          .support-art { flex: 0 0 auto; width: 200px; max-width: 70%; }
        }

        /* support-photo */
        .support-art { flex: 0 0 380px; }
        .support-photo {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
          border-radius: 16px;
          border: 1.5px solid rgba(207,159,63,0.6);
          box-shadow: 0 22px 40px rgba(0,0,0,0.38);
        }
        @media (max-width: 800px) {
          .support-art { width: 100%; max-width: 420px; }
        }

        /* support-label-bold */
        .support-card-label {
          font-family: 'Nunito Sans', sans-serif !important;
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          letter-spacing: 1.5px !important;
          color: #f5c542 !important;
        }

        /* support-title-bold */
        .support-head-text h2 {
          font-size: clamp(2.5rem, 5vw, 3.6rem) !important;
          font-weight: 700 !important;
          -webkit-text-stroke: 1px currentColor;
          letter-spacing: 0.01em;
        }

        /* team-card */
        .team-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          padding: 40px 44px;
          border-radius: 16px;
          border: 1.5px solid rgba(207,159,63,0.55);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 18px 34px rgba(0,0,0,0.25);
        }
        .team-card-text { flex: 1 1 auto; max-width: 760px; }
        .team-card-label {
          display: block;
          font-family: 'Nunito Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #f5c542;
        }
        .team-card-title {
          font-size: clamp(2.5rem, 5vw, 3.6rem);
          font-weight: 700;
          -webkit-text-stroke: 1px currentColor;
          color: #ffffff;
          margin: 12px 0 14px 0;
          text-align: left;
        }
        .team-card-desc {
          font-family: 'Nunito Sans', sans-serif;
          font-size: 1.25rem;
          line-height: 1.6;
          color: #f3e3e3;
          margin: 0;
          text-align: left;
        }
        .team-card-btn {
          flex: 0 0 auto;
          display: inline-block;
          min-width: 190px;
          padding: 12px 24px;
          text-align: center;
          font-size: 1.05rem;
          font-weight: 700;
          text-decoration: none;
          background: var(--gold);
          color: var(--navy-deep);
          border: 1.5px solid var(--gold);
          border-radius: 10px !important;
          transition: background 0.2s ease;
        }
        .team-card-btn:hover { background: #e0b25a; border-color: #e0b25a; }
        @media (max-width: 800px) {
          .team-card { flex-direction: column; align-items: stretch; gap: 26px; padding: 28px 24px; }
          .team-card-btn { width: 100%; }
        }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

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
                  <img loading="lazy" decoding="async"
                    src={about?.image || "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=80"}
                    alt={stripHtml(about?.title) || t("about.hero.imageAltFallback", { churchName: CHURCH_NAME })}
                    style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)', cursor: 'pointer', display: 'block' }}
                  />
                </Link>
              ) : (
                <img loading="lazy" decoding="async"
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

      <div ref={missionRef} />
      {/* MISSION & VISION */}
      <section style={{ background: 'var(--deep-red)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="wrapper">
          {missionVisionFallback && !missionVisionLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#a9c2d3', marginBottom: '20px' }}>
              {t("about.missionVision.fallbackNotice", { defaultValue: "Showing English content." })}
            </p>
          )}
          {missionVisionLoading ? (
            missionSeen ? <Spinner light /> : <div style={{ minHeight: 320 }} />
          ) : (
            <div className="fact-grid mv-grid">
              {missionVision.map((m, i) => (
                <div className="fact-item mv-card" key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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

      <div ref={historyRef} />
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
            const STORY_WORD_LIMIT = 60;
            const isLatest = index === 0;

            return (
            <div key={item.id} className="about-item">

              <div className="about-photo-side">
                {item.photo && (
                  <Link to={`/about/story/${item.id}`} className="about-img-wrapper">
                    <img loading="lazy" decoding="async"
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
            historySeen ? <Spinner /> : <div style={{ minHeight: 320 }} />
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

      <section className="team-section" style={{ background: 'var(--deep-red)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="wrapper">
          <div className="team-card">
            <div className="team-card-text">
              <span className="team-card-label">
                {t("team.leadership.heading", { defaultValue: "Our Leadership Team" })}
              </span>
              <h2 className="display team-card-title">
                {t("about.teamLink.heading", { defaultValue: "Meet Our Team" })}
              </h2>
              <p className="team-card-desc">
                {t("team.description")}
              </p>
            </div>
            <Link to="/church-teams" className="team-card-btn">
              {t("about.teamLink.button", { defaultValue: "View the team" })}
            </Link>
          </div>
        </div>
      </section>

      <div ref={faithRef} />
      <section className="faq-section" style={{ background: '#ffffff' }}>
        <div className="wrapper">
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--navy-deep)' }}>
            {t("about.faithFaq.heading", { defaultValue: "Questions of Faith" })}
          </h2>

          {faithFaqsFallback && !faithFaqsLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '-14px', marginBottom: '30px' }}>
              {t("about.faithFaq.fallbackNotice", { defaultValue: "Showing English content." })}
            </p>
          )}

          {faithFaqsLoading ? (
            faithSeen ? <Spinner /> : <div style={{ minHeight: 320 }} />
          ) : (
            <div>
              {faithFaqs.map((f, i) => (
                <div className="faq-item" key={`faith-${i}`}>
                  <button className="faq-question" onClick={() => setActiveFaq(activeFaq === `faith-${i}` ? null : `faith-${i}`)}>
                    <span>{f.q}</span>
                    <span className="faq-toggle">{activeFaq === `faith-${i}` ? '–' : '+'}</span>
                  </button>
                  {activeFaq === `faith-${i}` && (
                    <Rich className="faq-answer" inline={false} unwrapLinks={false} html={f.a} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div ref={faqRef} />
      <section className="faq-section" style={{ background: '#ffffff' }}>
        <div className="wrapper">
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--navy-deep)' }}>
            {t("about.faq.heading")}
          </h2>

          {faqFallback && !faqLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '-14px', marginBottom: '30px' }}>
              {t("about.faq.fallbackNotice", { defaultValue: "Showing English content." })}
            </p>
          )}

          {faqLoading ? (
            faqSeen ? <Spinner /> : <div style={{ minHeight: 320 }} />
          ) : (
            <div>
              {faqs.map((f, i) => (
                <div className="faq-item" key={`info-${i}`}>
                  <button className="faq-question" onClick={() => setActiveFaq(activeFaq === `info-${i}` ? null : `info-${i}`)}>
                    <span>{f.q}</span>
                    <span className="faq-toggle">{activeFaq === `info-${i}` ? '–' : '+'}</span>
                  </button>
                  {activeFaq === `info-${i}` && (
                    <Rich className="faq-answer" inline={false} unwrapLinks={false} html={f.a} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={{ background: 'var(--deep-red)' }}>
        <section style={{ paddingTop: '60px', paddingBottom: '70px' }}>
          <div className="wrapper">
            <div className="support-head">
              <div className="support-head-text">
                <h2 className="display" style={{ fontSize: '2.8rem', fontWeight: 700, margin: '0 0 18px 0', color: '#ffffff', textAlign: 'left' }}>
                  {t("about.support.heading")}
                </h2>
                <p className="body-copy on-red" style={{ margin: 0, maxWidth: '720px', textAlign: 'left' }}>
                  {t("about.support.description")}
                </p>
              </div>
            </div>

            <div className="support-grid">
              <div className="support-card">
                <span className="support-card-label">
                  {t("about.support.eyebrow", { defaultValue: "Give Online or In Person" })}
                </span>
                <h3 className="display support-card-title">{t("about.cta.giveButton")}</h3>
                <p className="support-card-text">
                  {t("about.cta.giveText", { defaultValue: "Send your gift by bank transfer or online, or give in person on Sunday." })}
                </p>
                <Link to="/church-support#accounts" className="support-card-btn support-card-btn-fill">
                  {t("about.cta.giveButton")}
                </Link>
              </div>

              <div className="support-card">
                <span className="support-card-label">
                  {t("about.cta.volunteerLabel", { defaultValue: "Serve With Us" })}
                </span>
                <h3 className="display support-card-title">{t("about.cta.volunteerButton")}</h3>
                <p className="support-card-text">
                  {t("about.cta.volunteerText", { defaultValue: "Offer your time and skills. There is a place for you here." })}
                </p>
                <Link to="/church-support#volunteer" className="support-card-btn support-card-btn-outline">
                  {t("about.cta.volunteerButton")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="location" className="about-location" style={{ background: '#ffffff', scrollMarginTop: '24px' }}>
        <section>
          <div className="wrapper">
            <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 40px 0', color: 'var(--navy-deep)', textAlign: 'left' }}>
              {t("about.map.heading", { defaultValue: "Find Us" })}
            </h2>
            <div className="location-grid">
              <div className="map-frame">
                <iframe
                  title={t("about.map.iframeTitle", { defaultValue: "Church location map" })}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="location-info">
                <p className="location-name">{CHURCH_NAME}</p>
                <p className="location-address">{t("about.map.placeName", { defaultValue: MAP_QUERY })}</p>
                <a href={MAP_PLACE_URL} target="_blank" rel="noopener noreferrer" className="team-card-btn location-btn">
                  {t("about.map.linkLabel", { defaultValue: "Open in Google Maps" })}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default ChurchAboutPage;

export { ChurchAboutPage };
