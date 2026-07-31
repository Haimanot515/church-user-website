import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import "./Travel.css";

const TRAVEL_ITEM_LIMIT = 10;

const Travel = () => {
  const { t } = useTranslation();

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTrip, setActiveTrip] = useState(0);

  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState("");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(1);
  // NEW: true when the upcoming trips currently shown came from the
  // English fallback because the active language had none
  const [upcomingFallback, setUpcomingFallback] = useState(false);

  // === Fetch travel posts, same Accept-Language fallback pattern as
  // ChurchAboutPage's fetchChurchPersons/fetchHistory and Blog's
  // fetchPosts: try the active language first, and only on a fresh load
  // (page 1) that comes back empty, retry with an explicit "en" header
  // and flag it. A "Load More" click on page > 1 never silently
  // switches language. ===
  const fetchTravelPosts = async (pageNum) => {
    try {
      setUpcomingLoading(true);
      setUpcomingError("");
      if (pageNum === 1) setUpcomingFallback(false);

      const params = {
        category: "Travel",
        limit: TRAVEL_ITEM_LIMIT,
        page: pageNum,
      };

      let res = await API.get("/posts", { params });
      let postsData = Array.isArray(res.data) ? res.data : res.data.posts;
      let pages = Array.isArray(res.data) ? 1 : (res.data.totalPages || 1);

      if (pageNum === 1 && (!postsData || postsData.length === 0)) {
        res = await API.get("/posts", {
          params,
          headers: { "Accept-Language": "en" },
        });
        postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        pages = Array.isArray(res.data) ? 1 : (res.data.totalPages || 1);
        if (postsData && postsData.length > 0) setUpcomingFallback(true);
      }

      setUpcomingTrips((prev) => (pageNum === 1 ? (postsData || []) : [...prev, ...(postsData || [])]));
      setUpcomingTotalPages(pages);
    } catch (err) {
      console.log(err);
      setUpcomingError(err.response?.data?.message || t("travel.upcoming.errorDefault"));
    } finally {
      setUpcomingLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelPosts(upcomingPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingPage, t]);

  const handleLoadMoreTrips = () => {
    if (upcomingPage < upcomingTotalPages) setUpcomingPage((p) => p + 1);
  };

  const getFormattedDate = (post) =>
    post.publishedAt || post.createdAt
      ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "";

  // === Static, translated content sections ===
  const quickFactsRaw = t("travel.quickFacts.items", { returnObjects: true });
  const quickFacts = Array.isArray(quickFactsRaw) ? quickFactsRaw : [];

  const travelKindsRaw = t("travel.travelKinds.items", { returnObjects: true });
  const travelKinds = Array.isArray(travelKindsRaw) ? travelKindsRaw : [];

  const tripsRaw = t("travel.trips.items", { returnObjects: true });
  const trips = Array.isArray(tripsRaw) ? tripsRaw : [];

  const faqsRaw = t("travel.faq.items", { returnObjects: true });
  const faqs = Array.isArray(faqsRaw) ? faqsRaw : [];

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <div
        className="hero-image"
        style={{
          width: '100%',
          height: 'clamp(320px, 52vw, 620px)',
          backgroundImage: "url('https://images.unsplash.com/photo-1698350876380-0c7c97a3c1e4?fm=jpg&q=80&w=2400&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <section style={{ padding: '70px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 26px 0', color: '#eaf3f8' }}>
            {t("travel.hero.title")}
          </h1>
          <p style={{ fontSize: '1.35rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '0', maxWidth: '560px' }}>
            {t("travel.hero.description")}
          </p>
        </div>
      </section>

      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)' }}>
            {t("travel.upcoming.heading")}
          </h2>

          {upcomingError && <p style={{ color: 'red' }}>{upcomingError}</p>}

          {/* note shown when the upcoming trips fell back to English */}
          {upcomingFallback && (
            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '-14px', marginBottom: '24px' }}>
              {t("travel.upcoming.fallbackNotice")}
            </p>
          )}

          {upcomingLoading ? (
            <p>{t("travel.upcoming.loading")}</p>
          ) : upcomingTrips.length === 0 ? (
            <p>{t("travel.upcoming.none")}</p>
          ) : (
            <div className="upcoming-grid">
              {upcomingTrips.map((trip) => (
                <Link
                  className="upcoming-card"
                  key={trip._id}
                  to={`/projects/${trip._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src={trip.imageUrl} alt={trip.title} />
                  <div className="upcoming-card-body">
                    <span className="upcoming-card-date">{getFormattedDate(trip)}</span>
                    <h4 className="upcoming-card-title">{trip.title}</h4>
                    <p className="upcoming-card-desc">{trip.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {upcomingPage < upcomingTotalPages && (
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button
                onClick={handleLoadMoreTrips}
                disabled={upcomingLoading}
                style={{
                  backgroundColor: upcomingLoading ? '#ccc' : '#7a1010',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  fontSize: '1.05rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  cursor: upcomingLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => { if (!upcomingLoading) e.target.style.backgroundColor = '#5c0c0c'; }}
                onMouseOut={(e) => { if (!upcomingLoading) e.target.style.backgroundColor = '#7a1010'; }}
              >
                {upcomingLoading ? t("travel.upcoming.loadingMoreButton") : t("travel.upcoming.loadMoreButton")}
              </button>
            </div>
          )}
        </div>
      </section>

      <div style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <section style={{ padding: '64px 0' }}>
          <div className="wrapper">
            <h3 className="eyebrow" style={{ marginBottom: '28px', fontSize: '0.85rem' }}>{t("travel.quickFacts.heading")}</h3>
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

      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)' }}>
            {t("travel.travelKinds.heading")}
          </h2>
          <div className="reach-grid">
            {travelKinds.map((m, i) => (
              <div className="reach-card" key={i}>
                <h4 className="display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--navy-deep)' }}>{m.title}</h4>
                <p className="reach-value">{m.value}</p>
                <p style={{ fontSize: '1rem', color: '#3d5a6c', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <div className="fixed-cross left">
          <svg width="46" height="64" viewBox="0 0 46 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="0" width="8" height="64" fill="var(--gold)" />
            <rect x="4" y="12" width="38" height="8" fill="var(--gold)" />
            <rect x="9" y="38" width="28" height="8" fill="var(--gold)" />
          </svg>
        </div>
        <section>
          <div className="wrapper">
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 40px 0', color: '#ffffff' }}>
              {t("travel.trips.heading")}
            </h2>
            <div className="trip-layout">
              <div className="trip-list">
                {trips.map((trip, i) => (
                  <button
                    key={i}
                    className={`trip-tab${activeTrip === i ? " active" : ""}`}
                    onClick={() => setActiveTrip(i)}
                  >
                    <span className="trip-tab-place">{trip.place}</span>
                    <span className="trip-tab-year">{trip.year}</span>
                  </button>
                ))}
              </div>
              {trips.length > 0 && (
                <div>
                  <h4 className="display trip-detail-title">{trips[activeTrip]?.title}</h4>
                  <p className="trip-detail-body">{trips[activeTrip]?.body}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--navy-deep)' }}>
            {t("travel.faq.heading")}
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

      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <p className="pull-quote display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.5 }}>
            "{t("travel.quote.text")}"
          </p>
          <p style={{ marginTop: '26px', fontSize: '1.1rem', color: '#3d5a6c' }}>{t("travel.quote.attribution")}</p>
        </div>
      </section>

      
    </div>
  );
};

export default Travel;