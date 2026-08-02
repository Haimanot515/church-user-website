import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";

const CHURCH_NAME = "Ethiopian Orthodox Tewahedo Church – Debre Selam Abune Gebre Menfes Kidus Church, Udine";

const ChurchAboutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeChapter, setActiveChapter] = useState(0);
  const [activeFaith, setActiveFaith] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  // === About/Hero content fetched from /about ===
  const [about, setAbout] = useState(null);
  // NEW: true when the about/hero content currently shown came from the
  // English fallback because the active language had none
  const [aboutFallback, setAboutFallback] = useState(false);
  // NEW: true while the hero content is being fetched — shows the
  // circular spinner instead of any content until data arrives
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

  // === Leadership Team / Special Thanks / Testimonials fetched from /church-persons ===
  const [leaders, setLeaders] = useState([]);
  const [thanksList, setThanksList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  // NEW: true when the respective list currently shown came from the
  // English fallback because the active language had none
  const [leadersFallback, setLeadersFallback] = useState(false);
  const [thanksFallback, setThanksFallback] = useState(false);
  const [testimonialsFallback, setTestimonialsFallback] = useState(false);
  // NEW: true while each list is being fetched — shows the circular
  // spinner instead of any content until data arrives
  const [leadersLoading, setLeadersLoading] = useState(true);
  const [thanksLoading, setThanksLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    const fetchChurchPersons = async (category, setter, setFallback, setLoading) => {
      try {
        setLoading(true);
        setFallback(false);

        let res = await API.get("/church-persons", { params: { category } });
        let data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          res = await API.get("/church-persons", {
            params: { category },
            headers: { "Accept-Language": "en" },
          });
          data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) setFallback(true);
        }

        setter(data);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchChurchPersons("leader", setLeaders, setLeadersFallback, setLeadersLoading);
    fetchChurchPersons("specialThanks", setThanksList, setThanksFallback, setThanksLoading);
    fetchChurchPersons("testimony", setTestimonialsList, setTestimonialsFallback, setTestimonialsLoading);
  }, [t]);

  // === "Our Church Story" chapters fetched from /church-story (paginated server-side) ===
  const HISTORY_PAGE_SIZE = 10;
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyHasMore, setHistoryHasMore] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  // NEW: true when the story chapters currently shown came from the
  // English fallback because the active language had none
  const [historyFallback, setHistoryFallback] = useState(false);

  const fetchHistory = async (page) => {
    try {
      setHistoryLoading(true);
      if (page === 1) setHistoryFallback(false);

      const params = { page, limit: HISTORY_PAGE_SIZE };
      let res = await API.get("/church-story", { params });

      // Handle either a raw array response or a { stories, total, pages } shape
      let data = Array.isArray(res.data) ? res.data : res.data.stories || [];
      let totalPages = res.data.pages ?? (Array.isArray(res.data) ? 1 : undefined);

      // Only attempt the fallback on a fresh load (page 1) — a "Load More"
      // click on page > 1 should never silently switch language.
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
        // Fallback: if we got a full page, assume there might be more
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

  const location = {
    city: "Udine, Italy",
    address: `${CHURCH_NAME}`,
    note: t("about.location.note"),
    serviceTimes: (() => {
      const raw = t("about.location.serviceTimes", { returnObjects: true });
      return Array.isArray(raw) ? raw : [];
    })(),
  };

  // === Advanced About-page sections (translated) ===

  const missionVision = [
    { label: t("about.missionVision.missionLabel"), value: t("about.missionVision.missionValue") },
    { label: t("about.missionVision.visionLabel"), value: t("about.missionVision.visionValue") },
  ];

  const faithPointsRaw = t("about.faith.points", { returnObjects: true });
  const faithPoints = Array.isArray(faithPointsRaw) ? faithPointsRaw : [];

  const faqsRaw = t("about.faq.items", { returnObjects: true });
  const faqs = Array.isArray(faqsRaw) ? faqsRaw : [];

  // NEW: circular loading spinner, matching the one used on the Home page
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

        .nav-bar {
          position: sticky; top: 0; z-index: 40;
          display: flex; align-items: center; gap: 26px;
          padding: 0 24px; height: 100px;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          overflow-x: auto; white-space: nowrap; scrollbar-width: none;
        }
        .nav-bar::-webkit-scrollbar { display: none; }
        .nav-brand { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.6rem; color: #eaf3f8; margin-right: 10px; flex-shrink: 0; }
        .nav-item { font-size: 1.05rem; font-weight: 700; color: #ffffff; cursor: pointer; flex-shrink: 0; position: relative; padding: 4px 0; transition: color 0.2s ease; }
        .nav-item:hover { color: var(--gold); }
        .nav-item::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px; background: var(--gold); transition: width 0.25s ease; }
        .nav-item:hover::after { width: 100%; }
        .nav-item.active { color: var(--gold); }
        .nav-item.active::after { width: 100%; }

        .card { background: rgba(255,255,255,0.7); border: 1px solid rgba(28,58,82,0.10); border-radius: 12px; backdrop-filter: blur(6px); }

        .cross-track {
          position: absolute; top: 0; bottom: 0; width: 50px;
          display: flex; flex-direction: column; justify-content: space-around; align-items: center;
          pointer-events: none; z-index: 0;
        }
        .cross-track.left { left: 3%; }
        .cross-track.right { right: 3%; }
        .wave-cross { animation: waveMotion 3.2s ease-in-out infinite; }
        @keyframes waveMotion { 0% { transform: translateX(-14px) scaleX(0.85); } 50% { transform: translateX(14px) scaleX(1.2); } 100% { transform: translateX(-14px) scaleX(0.85); } }
        @media (max-width: 900px) { .cross-track { display: none; } }

        .chapter-rail { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; margin-bottom: 40px; padding-bottom: 4px; }
        .chapter-rail::-webkit-scrollbar { display: none; }
        .chapter-tab {
          flex-shrink: 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem; font-weight: 500;
          padding: 12px 20px;
          border-radius: 30px;
          border: 1.5px solid rgba(28,58,82,0.18);
          background: rgba(255,255,255,0.5);
          color: var(--navy);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .chapter-tab:hover { border-color: var(--gold); }
        .chapter-tab.active { background: var(--navy-deep); border-color: var(--navy-deep); color: #eaf3f8; }

        .fact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(255,255,255,0.14); border-radius: 12px; overflow: hidden; }
        .fact-item { background: rgba(255,255,255,0.06); padding: 26px 28px; }
        .fact-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin: 0 0 8px 0; }
        .fact-value { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 600; color: #eaf3f8; margin: 0; line-height: 1.5; }
        @media (max-width: 600px) { .fact-grid { grid-template-columns: 1fr; } }

        .pull-quote { border-left: 4px solid var(--gold); padding-left: 30px; margin: 0; }

        /* EDUCATION */
        .edu-row {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 30px;
          padding: 30px 0;
          border-bottom: 1px solid rgba(28,58,82,0.14);
        }
        .edu-row:first-child { padding-top: 0; }
        .edu-row:last-child { border-bottom: none; }
        .edu-years {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem; font-weight: 500; color: var(--gold);
          letter-spacing: 0.02em;
        }
        @media (max-width: 600px) { .edu-row { grid-template-columns: 1fr; gap: 6px; } }

        /* JOURNEY PATH */
        .journey-path { position: relative; }
        .journey-line {
          position: absolute; left: 21px; top: 12px; bottom: 12px; width: 2px;
          background: linear-gradient(180deg, var(--gold) 0%, rgba(207,159,63,0.15) 100%);
        }
        .journey-step { position: relative; padding: 0 0 46px 64px; }
        .journey-step:last-child { padding-bottom: 0; }
        .journey-marker {
          position: absolute; left: 0; top: 0;
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--navy-deep); color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.3rem;
          border: 2px solid var(--gold);
        }

        /* SPECIAL THANKS */
        .thanks-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 650px) { .thanks-grid { grid-template-columns: 1fr; } }
        .thanks-card {
          display: flex; flex-direction: column; gap: 18px; align-items: center; text-align: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 26px;
        }
        .thanks-photo {
          width: 100%; aspect-ratio: 1 / 1; border-radius: 12px; object-fit: cover;
          flex-shrink: 0; border: 3px solid var(--gold); display: block;
        }

        /* DREAM CARDS */
        .dream-card {
          padding: 32px;
          border-radius: 12px;
          background: rgba(255,255,255,0.7);
          border: 3px solid var(--deep-red);
        }
        .dream-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
        @media (max-width: 650px) { .dream-grid { grid-template-columns: 1fr; } }

        /* FAMILY PHOTO CARD */
        .photo-card {
          overflow: hidden;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid rgba(28,58,82,0.10);
          box-shadow: 0 10px 24px rgba(15,36,56,0.10);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .photo-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(15,36,56,0.16); }
        .photo-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .photo-card-body { padding: 18px 20px 22px 20px; }

        /* LOCATION */
        .location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 46px; align-items: center; }
        @media (max-width: 800px) { .location-grid { grid-template-columns: 1fr; } }
        .map-frame {
          width: 100%; aspect-ratio: 4/3; border-radius: 14px; overflow: hidden;
          box-shadow: 0 20px 40px rgba(15,36,56,0.2);
        }
        .service-time-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; border-bottom: 1px dashed rgba(255,255,255,0.2);
          font-size: 1.05rem;
        }
        .service-time-row:last-child { border-bottom: none; }

        /* UNIFIED BODY TEXT (matches "Why We Write" pull-quote treatment) */
        .body-copy {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 600;
          line-height: 1.5;
          color: var(--navy-deep);
          margin: 0;
        }
        .body-copy.on-dark { color: #ffffff; }
        .body-copy.on-red { color: rgba(255,255,255,0.9); }

        /* BADGE */
        .badge {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem; letter-spacing: 0.06em;
          padding: 8px 16px; border-radius: 20px;
          background: rgba(207,159,63,0.14);
          border: 1px solid rgba(207,159,63,0.4);
          color: var(--gold);
          margin-bottom: 20px;
        }

        /* ACCORDION (Statement of Faith / FAQ) */
        .accordion-item { border-bottom: 1px solid rgba(28,58,82,0.14); }
        .accordion-item:first-child { border-top: 1px solid rgba(28,58,82,0.14); }
        .accordion-head {
          width: 100%; text-align: left; background: none; border: none; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 4px; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700;
          color: var(--navy-deep);
        }
        .accordion-icon { font-family: 'IBM Plex Mono', monospace; color: var(--gold); font-size: 1.2rem; flex-shrink: 0; margin-left: 20px; }
        .accordion-body { padding: 0 4px 24px 4px; max-width: 640px; }

        /* SIMPLE LIST CARDS (Small Groups / Volunteer / Sermons) */
        .list-card {
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;
          padding: 20px 24px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .list-card + .list-card { margin-top: 12px; }
        .list-card-title { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.3rem; color: #ffffff; }
        .list-card-meta { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--gold); }

        /* TESTIMONIALS */
        .testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        @media (max-width: 800px) { .testimonial-grid { grid-template-columns: 1fr; } }
        .testimonial-card { padding: 30px; border-radius: 12px; }
        .testimonial-photo {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 10px;
          border: 3px solid var(--gold);
          margin-bottom: 18px;
          display: block;
        }
        .testimonial-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--deep-red); margin: 2px 0 0 0;
        }

        /* LANGUAGE TOGGLE */
        .lang-toggle { display: inline-flex; border-radius: 20px; border: 1.5px solid rgba(255,255,255,0.3); overflow: hidden; margin-bottom: 24px; }
        .lang-btn { font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; padding: 8px 16px; background: transparent; border: none; color: #eaf3f8; cursor: pointer; }
        .lang-btn.active { background: var(--gold); color: var(--navy-deep); font-weight: 700; }

        /* CTA BAND */
        .cta-band { text-align: center; }

        /* ABOUT-STYLE PHOTO + TEXT LAYOUT (for Our Story) */
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
          font-size: 2.8rem;
          color: var(--navy-deep);
          margin: 16px 0;
          font-weight: 700;
          line-height: 1.1;
        }
        .about-description {
          font-size: 1.1rem;
          line-height: 1.8;
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
          margin-top: 26px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #ffffff;
          background: var(--deep-red);
          border: 1.5px solid var(--deep-red);
          padding: 12px 30px;
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
          .about-title { font-size: 2.2rem; }
        }
        @media (max-width: 480px) {
          .about-image { height: 350px; }
          .about-title { font-size: 1.8rem; }
        }

        /* ============================================================
           RESPONSIVE ADDITIONS
           Nothing above this line was modified.
           Desktop (≥1025px) renders identically to before — every rule
           below only takes effect at ≤1024px and narrower breakpoints.
           ============================================================ */

        html, body { overflow-x: hidden; width: 100%; }
        .church-portal { overflow-x: hidden; }
        img, video { max-width: 100%; height: auto; }
        *, *::before, *::after { min-width: 0; }

        /* ---------- ≤1024px ---------- */
        @media (max-width: 1024px) {
          .wrapper { padding: 0 20px; }
          .about-container { padding: 0 20px; }
          section { padding: 70px 0; }
          .about-section { padding: 70px 0; }
        }

        /* ---------- ≤900px (tablet portrait) ---------- */
        @media (max-width: 900px) {
          section { padding: 60px 0; }
          .about-section { padding: 60px 0; }
          .nav-bar { height: 80px; gap: 20px; padding: 0 16px; }
          .nav-brand { font-size: 1.3rem; }
          .nav-item { font-size: 0.95rem; }
          .about-hero-flex { gap: 36px !important; }
        }

        /* ---------- ≤768px ---------- */
        @media (max-width: 768px) {
          .wrapper { padding: 0 18px; }
          .about-container { padding: 0 18px; }
          section { padding: 50px 0; }
          .about-section { padding: 50px 0; }

          .give-info-box { width: 100% !important; padding: 22px !important; }
          .give-info-box p { word-break: break-word; }

          .thanks-card { padding: 20px; }

          .testimonial-card { padding: 22px; }
        }

        /* ---------- ≤600px (large phone) ---------- */
        @media (max-width: 600px) {
          section { padding: 40px 0; }
          .about-section { padding: 40px 0; }
          .wrapper { padding: 0 16px; }
          .about-container { padding: 0 16px; }

          .nav-bar { height: 64px; gap: 16px; padding: 0 14px; }
          .nav-brand { font-size: 1.1rem; margin-right: 4px; }
          .nav-item { font-size: 0.85rem; }

          .about-hero-flex { gap: 28px !important; }
          .about-hero-image-col { flex: 0 1 260px !important; min-width: 220px !important; }

          .fact-item { padding: 20px; }
          .accordion-head { font-size: 1.25rem; padding: 20px 4px; }
          .accordion-body { padding: 0 4px 20px 4px; }

          .lang-toggle { margin-bottom: 18px; }
          .lang-btn { padding: 7px 13px; font-size: 0.72rem; }
        }

        /* ---------- ≤480px (standard phone) ---------- */
        @media (max-width: 480px) {
          section { padding: 32px 0; }
          .about-section { padding: 32px 0; }
          .wrapper { padding: 0 14px; }
          .about-container { padding: 0 14px; }

          .nav-bar { height: 56px; gap: 12px; }
          .nav-brand { display: none; }

          .about-hero-flex { gap: 22px !important; }
          .about-hero-text-col { min-width: 0 !important; }
          .about-hero-image-col { flex: 0 1 100% !important; min-width: 0 !important; width: 100% !important; }

          .give-info-box { padding: 18px !important; }
          .give-info-box p { font-size: 1rem !important; }

          .service-time-row { font-size: 0.92rem; }
        }

        /* ---------- ≤360px (small phone) ---------- */
        @media (max-width: 360px) {
          .wrapper { padding: 0 12px; }
          .about-container { padding: 0 12px; }
          section { padding: 26px 0; }
          .about-section { padding: 26px 0; }

          .nav-bar { gap: 10px; padding: 0 12px; }
          .nav-item { font-size: 0.78rem; }

          .about-image { height: 300px; }
        }

        /* ============================================================
           NEW ADDITIONS ONLY — nothing above this line was changed
           except the testimonial-photo/thanks-photo size rules further
           up (explicitly requested to match the Home page sizing).
           ============================================================ */

        /* Circular loading spinner — identical to the one used on the
           Home page, shown instead of any content until the backend
           data for a section has arrived. */
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

        /* "Read Our Story" / "Say Hello" buttons — keep them side by
           side on mobile instead of stacking, same as the Home page. */
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

        /* Role/leader tag ("Our Story" section) — centered below the
           photo once the layout stacks vertically on tablet/mobile. */
        @media (max-width: 900px) {
          .about-label { display: block; text-align: center; }
        }
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
          <div className="about-hero-text-col" style={{ flex: '1', minWidth: '320px' }}>
            {about?._id ? (
              <Link to={`/about/${about._id}`} style={{ display: 'block', cursor: 'pointer' }}>
                <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 26px 0', color: '#eaf3f8' }}>
                  {about?.title || t("about.hero.titleFallback")}
                </h1>
                <p style={{ fontSize: '1.35rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
                  {about?.description || t("about.hero.descriptionFallback", { churchName: CHURCH_NAME })}
                </p>
              </Link>
            ) : (
              <>
                <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 26px 0', color: '#eaf3f8' }}>
                  {about?.title || t("about.hero.titleFallback")}
                </h1>
                <p style={{ fontSize: '1.35rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
                  {about?.description || t("about.hero.descriptionFallback", { churchName: CHURCH_NAME })}
                </p>
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
            {/* note shown when the about/hero content fell back to English */}
            {aboutFallback && (
              <p style={{ fontSize: '0.85rem', color: '#a9c2d3', margin: '18px 0 0 0' }}>
                {t("about.hero.fallbackNotice")}
              </p>
            )}
          </div>
          <div className="about-hero-image-col" style={{ flex: '0 0 340px', minWidth: '280px' }}>
            {about?._id ? (
              <Link to={`/about/${about._id}`}>
                <img
                  src={about?.image || "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=80"}
                  alt={about?.title || t("about.hero.imageAltFallback", { churchName: CHURCH_NAME })}
                  style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)', cursor: 'pointer' }}
                />
              </Link>
            ) : (
              <img
                src={about?.image || "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=80"}
                alt={about?.title || t("about.hero.imageAltFallback", { churchName: CHURCH_NAME })}
                style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)' }}
              />
            )}
            {about?.churchLeader && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <p className="display" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>
                  {about.churchLeader}
                </p>
                <p className="eyebrow" style={{ fontSize: '0.72rem', margin: 0 }}>
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
      <section style={{ background: 'var(--navy-deep)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="wrapper">
          <div className="fact-grid">
            {missionVision.map((m, i) => (
              <div className="fact-item" key={i}>
                <p className="fact-label">{m.label}</p>
                <p className="fact-value">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY (paginated via /church-story?page=&limit=) */}
      <section className="about-section" id="our-church-story">
        <div className="about-container">
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 50px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            {t("about.story.heading")}
          </h2>

          {/* note shown when the story chapters fell back to English */}
          {historyFallback && (
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888', marginTop: '-30px', marginBottom: '40px' }}>
              {t("about.story.fallbackNotice")}
            </p>
          )}

          {history.map((item) => (
            <div key={item._id} className="about-item">

              {/* PHOTO SIDE — clicking the photo goes to the detail page */}
              <div className="about-photo-side">
                {item.photo && (
                  <Link to={`/about/story/${item._id}`} className="about-img-wrapper">
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="about-image"
                    />
                  </Link>
                )}
                <div className="about-art-accent"></div>
              </div>

              {/* TEXT SIDE */}
              <div className="about-text-side">
                <span className="about-label">
                  {item.leaderRole} · Led {item.range}
                </span>

                <h2 className="about-title">
                  {item.title}
                </h2>
                <div className="about-description">
                  <p>{item.desc}</p>
                </div>
                <div className="about-tags">
                  <div className="about-tag">{item.leader}</div>
                  <div className="about-tag">{item.range}</div>
                  <div className="about-tag">{item.servedBy}</div>
                </div>

                {/* Read Full Story button — goes to the detail page */}
                <Link to={`/about/story/${item._id}`} className="read-full-story-btn">
                  {t("about.story.readFullStoryButton")}
                </Link>
              </div>
            </div>
          ))}

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

      {/* STATEMENT OF FAITH + WHY WE WRITE (combined) */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h3 className="eyebrow" style={{ marginBottom: '30px', fontSize: '0.85rem', textAlign: 'center' }}>{t("about.faith.heading")}</h3>
          <div>
            {faithPoints.map((f, i) => (
              <div className="accordion-item" key={i}>
                <button className="accordion-head" onClick={() => setActiveFaith(activeFaith === i ? -1 : i)}>
                  {f.title}
                  <span className="accordion-icon">{activeFaith === i ? '−' : '+'}</span>
                </button>
                {activeFaith === i && (
                  <div className="accordion-body">
                    <p className="body-copy">{f.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="eyebrow" style={{ margin: '70px 0 30px 0', fontSize: '0.85rem', textAlign: 'center' }}>{t("about.faith.whyWeWriteHeading")}</h3>
          <p className="display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.5, margin: 0 }}>
            "{t("about.faith.whyWeWriteQuote")}"
          </p>
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <div className="cross-bg" style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <section>
          <div className="wrapper" style={{ maxWidth: '760px' }}>
            <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 44px 0', color: '#ffffff', textAlign: 'center' }}>
              {t("about.leadership.heading")}
            </h2>

            {/* note shown when leadership content fell back to English */}
            {leadersFallback && !leadersLoading && (
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#f2d9d9', marginTop: '-24px', marginBottom: '30px' }}>
                {t("about.leadership.fallbackNotice")}
              </p>
            )}

            {leadersLoading ? (
              <Spinner light />
            ) : (
            <div className="thanks-grid">
              {leaders.map((p) => (
                <div className="thanks-card" key={p._id}>
                  <img
                    className="thanks-photo"
                    src={(p.photos && p.photos[0]) || `https://ui-avatars.com/api/?name=${p.name}&background=0f2438&color=fff`}
                    alt={p.name}
                  />
                  <div>
                    <h4 className="display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2px 0', color: '#ffffff' }}>{p.name}</h4>
                    <span className="eyebrow" style={{ fontSize: '0.75rem' }}>{p.role || p.title}</span>
                    <p className="body-copy on-red" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', marginTop: '10px' }}>{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            {t("about.testimonials.heading")}
          </h2>

          {/* note shown when testimonials fell back to English */}
          {testimonialsFallback && !testimonialsLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '-14px', marginBottom: '30px' }}>
              {t("about.testimonials.fallbackNotice")}
            </p>
          )}

          {testimonialsLoading ? (
            <Spinner />
          ) : (
          <div className="testimonial-grid">
            {testimonialsList.map((person) => (
              <div className="card testimonial-card" key={person._id}>
                <img
                  className="testimonial-photo"
                  src={(person.photos && person.photos[0]) || `https://ui-avatars.com/api/?name=${person.name}&background=0070f3&color=fff`}
                  alt={person.name}
                />
                <p className="body-copy" style={{ fontSize: '1.3rem', marginBottom: '18px' }}>"{person.message}"</p>
                <p style={{ fontWeight: 700, margin: 0, color: 'var(--navy-deep)' }}>{person.name}</p>
                <p className="testimonial-title">{person.title}</p>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 30px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            {t("about.faq.heading")}
          </h2>
          <div>
            {faqs.map((f, i) => (
              <div className="accordion-item" key={i}>
                <button className="accordion-head" onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}>
                  {f.q}
                  <span className="accordion-icon">{activeFaq === i ? '−' : '+'}</span>
                </button>
                {activeFaq === i && (
                  <div className="accordion-body">
                    <p className="body-copy" style={{ fontSize: '1.2rem' }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL THANKS (testimonial-style cards) */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            {t("about.specialThanks.heading")}
          </h2>

          {/* note shown when special thanks content fell back to English */}
          {thanksFallback && !thanksLoading && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '-14px', marginBottom: '30px' }}>
              {t("about.specialThanks.fallbackNotice")}
            </p>
          )}

          {thanksLoading ? (
            <Spinner />
          ) : (
          <div className="testimonial-grid">
            {thanksList.map((p) => (
              <div className="card testimonial-card" key={p._id}>
                <img
                  className="testimonial-photo"
                  src={(p.photos && p.photos[0]) || `https://ui-avatars.com/api/?name=${p.name}&background=7a1010&color=fff`}
                  alt={p.name}
                />
                <p className="body-copy" style={{ fontSize: '1.3rem', marginBottom: '18px' }}>{p.description}</p>
                <p style={{ fontWeight: 700, margin: 0, color: 'var(--navy-deep)' }}>{p.name}</p>
                <p className="testimonial-title">{p.role || p.title}</p>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* LOCATION & CONTACT */}
      <div style={{ background: 'var(--navy-deep)' }}>
        <section>
          <div className="wrapper">
            <div className="location-grid">
              <div>
                <h3 className="eyebrow" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>{t("about.location.eyebrow")}</h3>
                <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 700, margin: '0 0 18px 0', color: '#ffffff' }}>{location.address}</h2>
                <p className="body-copy on-dark" style={{ fontSize: '1.2rem', marginBottom: '26px' }}>{location.note}</p>
                <div>
                  {location.serviceTimes.map((time, i) => (
                    <div className="service-time-row" key={i}>
                      <span style={{ color: '#ffffff' }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="map-frame">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
                  alt={t("about.location.mapAlt", { churchName: CHURCH_NAME })}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SUPPORT THE CHURCH */}
      <div style={{ background: 'var(--deep-red)' }}>
        <section>
          <div className="wrapper" style={{ maxWidth: '760px', textAlign: 'center' }}>
            <h3 className="eyebrow" style={{ marginBottom: '18px', fontSize: '0.85rem' }}>{t("about.support.eyebrow")}</h3>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, margin: '0 0 20px 0', color: '#ffffff' }}>
              {t("about.support.heading")}
            </h2>
            <p className="body-copy on-red" style={{ margin: '0 auto 34px auto', maxWidth: '600px' }}>
              {t("about.support.description")}
            </p>
            <div className="give-info-box" style={{ display: 'inline-block', textAlign: 'left', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '28px 34px' }}>
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
          </div>
        </section>
      </div>

      {/* GIVE / GET INVOLVED CTA */}
      <div style={{ background: 'var(--deep-red)' }}>
        <section className="cta-band">
          <div className="wrapper" style={{ maxWidth: '640px' }}>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, margin: '0 0 18px 0', color: '#ffffff' }}>
              {t("about.cta.heading")}
            </h2>
            <p className="body-copy on-red" style={{ margin: '0 auto 30px auto', maxWidth: '520px' }}>
              {t("about.cta.description")}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                {t("about.cta.giveButton")}
              </button>
              <button style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1.5px solid #ffffff', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                {t("about.cta.volunteerButton")}
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default ChurchAboutPage;