import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import "./Church.css";

const Church = () => {
  const { t, i18n } = useTranslation();

  const [showConstructionAd, setShowConstructionAd] = useState(false);

  // --- Hero: GET /api/churches/primary (the one church with isPrimary: true) ---
  const [primaryChurch, setPrimaryChurch] = useState(null);
  const [primaryLoading, setPrimaryLoading] = useState(true);
  const [primaryError, setPrimaryError] = useState("");
  const [primaryFallback, setPrimaryFallback] = useState(false);

  // --- Where The Leader Serves Now: GET /api/churches/current (public, no userId) ---
  const [currentChurch, setCurrentChurch] = useState(null);
  const [currentLoading, setCurrentLoading] = useState(true);
  const [currentError, setCurrentError] = useState("");
  const [currentFallback, setCurrentFallback] = useState(false);

  // --- "The church in Ethiopia" blog grid: GET /api/churches?page=&limit=20, with Load More ---
  const [blogChurches, setBlogChurches] = useState([]);
  const [blogPage, setBlogPage] = useState(1);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogLoadingMore, setBlogLoadingMore] = useState(false);
  const [blogError, setBlogError] = useState("");
  const [hasMoreBlog, setHasMoreBlog] = useState(true);
  const [blogFallback, setBlogFallback] = useState(false);

  const BLOG_LIMIT = 20;

  // Reusable inline loading spinner — shown while a section's data is
  // being fetched from the backend, so no hardcoded frontend placeholder
  // content is ever visible before the real data arrives. Same
  // markup/classes as Home.jsx's Spinner, so it renders identically.
  const Spinner = ({ light }) => (
    <div className="loading-spinner-wrap">
      <div className={`loading-spinner${light ? " light" : ""}`} />
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowConstructionAd(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchPrimaryChurch();
    fetchCurrentChurch();
    fetchBlogChurches(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // === Same Accept-Language fallback pattern used in Services.jsx / Blog /
  // Travel / About: try the active language first, and if it comes back
  // empty, retry with an explicit "en" header and flag it so the UI can
  // show a small "showing English content" notice. ===

  const fetchPrimaryChurch = async () => {
    try {
      setPrimaryLoading(true);
      setPrimaryError("");
      setPrimaryFallback(false);

      let res = await API.get(`/churches/primary`);
      let data = res.data || null;

      if (!data || (!data.churchName && !data.name)) {
        res = await API.get(`/churches/primary`, {
          headers: { "Accept-Language": "en" },
        });
        data = res.data || null;
        if (data) setPrimaryFallback(true);
      }

      setPrimaryChurch(data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 404) {
        setPrimaryChurch(null);
      } else {
        setPrimaryError(err.response?.data?.message || t("church.errors.primaryDefault"));
      }
    } finally {
      setPrimaryLoading(false);
    }
  };

  const fetchCurrentChurch = async () => {
    try {
      setCurrentLoading(true);
      setCurrentError("");
      setCurrentFallback(false);

      let res = await API.get(`/churches/current`);
      let data = res.data || null;

      if (!data || (!data.church && !data.role)) {
        res = await API.get(`/churches/current`, {
          headers: { "Accept-Language": "en" },
        });
        data = res.data || null;
        if (data) setCurrentFallback(true);
      }

      setCurrentChurch(data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 404) {
        setCurrentChurch(null);
      } else {
        setCurrentError(err.response?.data?.message || t("church.errors.currentDefault"));
      }
    } finally {
      setCurrentLoading(false);
    }
  };

  const fetchBlogChurches = async (page) => {
    try {
      if (page === 1) {
        setBlogLoading(true);
        setBlogFallback(false);
      } else {
        setBlogLoadingMore(true);
      }
      setBlogError("");

      let res = await API.get(`/churches?page=${page}&limit=${BLOG_LIMIT}`);
      let newChurches = res.data.churches || res.data.data || res.data || [];
      let totalPages = res.data.totalPages;
      let usedFallback = false;

      if (page === 1 && newChurches.length === 0) {
        res = await API.get(`/churches?page=${page}&limit=${BLOG_LIMIT}`, {
          headers: { "Accept-Language": "en" },
        });
        newChurches = res.data.churches || res.data.data || res.data || [];
        totalPages = res.data.totalPages;
        if (newChurches.length > 0) usedFallback = true;
      }

      setBlogChurches((prev) => (page === 1 ? newChurches : [...prev, ...newChurches]));
      setBlogPage(page);
      if (page === 1) setBlogFallback(usedFallback);

      if (totalPages != null) {
        setHasMoreBlog(page < totalPages);
      } else {
        setHasMoreBlog(newChurches.length === BLOG_LIMIT);
      }
    } catch (err) {
      console.log(err);
      setBlogError(err.response?.data?.message || t("church.errors.blogDefault"));
    } finally {
      setBlogLoading(false);
      setBlogLoadingMore(false);
    }
  };

  const handleLoadMoreBlog = () => {
    if (!blogLoadingMore && hasMoreBlog) {
      fetchBlogChurches(blogPage + 1);
    }
  };

  const dismissConstructionAd = () => setShowConstructionAd(false);

  const renderLabel = (value, fallback = "") => {
    if (!value) return fallback;
    if (typeof value === "string") return value;
    if (typeof value === "object") return value.name || value.title || fallback;
    return fallback;
  };

  // Exclude the "Where I Serve Now" church from the blog grid so it
  // isn't shown twice on the page. currentChurch is a ChurchAssignment,
  // so the church id lives at currentChurch.church._id.
  const currentChurchId = currentChurch?.church?._id;
  const visibleBlogChurches = currentChurchId
    ? blogChurches.filter((c) => c._id !== currentChurchId)
    : blogChurches;

  return (
    <div className="church-page">
      <section className="church-hero">
        <div className="wrapper church-hero-inner">
          <div className="church-hero-text">
            <span className="eyebrow">{t("church.hero.eyebrow")}</span>
            {primaryLoading ? (
              <div style={{ width: "100%" }}>
                <Spinner light />
              </div>
            ) : primaryError ? (
              <p style={{ color: "red" }}>{primaryError}</p>
            ) : primaryChurch ? (
              <>
                <h1 className="display">{primaryChurch.churchName}</h1>
                <p>{primaryChurch.shortDescription || primaryChurch.description}</p>
              </>
            ) : (
              <>
                <h1 className="display">{t("church.hero.fallbackTitle")}</h1>
                <p>{t("church.hero.fallbackDescription")}</p>
              </>
            )}
            {primaryChurch && primaryFallback && (
              <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "4px" }}>
                {t("church.blog.fallbackNotice")}
              </p>
            )}
            <button className="hero-cta">{t("church.hero.cta")}</button>
          </div>
          <div className="church-hero-media">
            <img
              src={
                primaryChurch?.image ||
                "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=80"
              }
              alt={primaryChurch?.churchName || t("church.hero.imageAlt")}
            />
          </div>
        </div>
      </section>

      {showConstructionAd && (
        <div style={{ background: "var(--navy-deep)", padding: "1px 24px 40px 24px" }}>
          <div className="construction-ad visible">
            <div className="construction-ad-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80"
                alt={t("church.constructionAd.imageAlt")}
              />
              <span className="construction-ad-badge">{t("church.constructionAd.badge")}</span>
            </div>
            <button
              className="construction-ad-close"
              onClick={dismissConstructionAd}
              aria-label={t("church.constructionAd.closeAria")}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="construction-ad-body">
              <span className="eyebrow">{t("church.constructionAd.eyebrow")}</span>
              <h3>{t("church.constructionAd.title")}</h3>
              <p>{t("church.constructionAd.description")}</p>
              <div className="ad-progress-label">
                <span>{t("church.constructionAd.progressLabel")}</span>
                <strong>{t("church.constructionAd.progressValue")}</strong>
              </div>
              <div className="ad-progress-track">
                <div className="ad-progress-fill" style={{ width: "62%" }} />
              </div>
              <button className="construction-ad-support-btn">
                {t("church.constructionAd.cta")}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="serve-now-section">
        <div className="wrapper">
          {currentLoading ? (
            <Spinner />
          ) : currentError ? (
            <p style={{ color: "red" }}>{currentError}</p>
          ) : !currentChurch ? (
            <p>{t("church.serveNow.none")}</p>
          ) : (
            <div className="serve-now-card">
              <div className="serve-now-img-wrap">
                <img
                  src={
                    currentChurch.image ||
                    currentChurch.user?.image ||
                    currentChurch.church?.image ||
                    ""
                  }
                  alt={currentChurch.user?.name || "Leader"}
                />
                <span className="serve-now-badge">{t("church.serveNow.badge")}</span>
              </div>
              <div className="serve-now-body">
                <span className="serve-now-role">{renderLabel(currentChurch.role)}</span>
                <h2 className="display">{currentChurch.church?.churchName}</h2>
                <div className="serve-now-since">
                  {currentChurch.servingSince &&
                    t("church.serveNow.since", {
                      year: new Date(currentChurch.servingSince).getFullYear(),
                    })}
                </div>
                <p className="serve-now-desc">{currentChurch.description}</p>
                <div className="serve-now-details">
                  <div className="serve-now-line">
                    <strong>{t("church.serveNow.address")}</strong> {currentChurch.church?.address}
                  </div>
                  <div className="serve-now-line">
                    <strong>{t("church.serveNow.service")}</strong>{" "}
                    {currentChurch.church?.serviceDays} · {currentChurch.church?.serviceTime}
                  </div>
                </div>
                {currentFallback && (
                  <p style={{ fontSize: "0.85rem", color: "#888" }}>
                    {t("church.blog.fallbackNotice")}
                  </p>
                )}
                {currentChurchId ? (
                  <a className="serve-now-cta" href={`/churches/${currentChurchId}`}>
                    {t("church.serveNow.cta")}
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12H19M19 12L13 6M19 12L13 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <button className="serve-now-cta" disabled>
                    {t("church.serveNow.cta")}
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12H19M19 12L13 6M19 12L13 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="blog-section">
        <div className="wrapper">
          <div className="blog-head">
            <span className="eyebrow">{t("church.blog.eyebrow")}</span>
            <h2 className="display">{t("church.blog.title")}</h2>
            <p>{t("church.blog.description")}</p>
          </div>

          {blogLoading ? (
            <Spinner />
          ) : blogError ? (
            <p style={{ color: "red" }}>{blogError}</p>
          ) : visibleBlogChurches.length === 0 ? (
            <p>{t("church.blog.none")}</p>
          ) : (
            <>
              {blogFallback && (
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "24px" }}>
                  {t("church.blog.fallbackNotice")}
                </p>
              )}
              <div className="blog-grid">
                {visibleBlogChurches.map((c) => (
                  <div className="blog-card" key={c._id}>
                    <img src={c.image || ""} alt={c.churchName} />
                    <div className="blog-card-body">
                      <div className="blog-tag">
                        {c.isPrimary
                          ? t("church.blog.tagPrimary")
                          : c.isFeatured
                          ? t("church.blog.tagFeatured")
                          : t("church.blog.tagDefault")}
                      </div>
                      <h3>{c.churchName}</h3>
                      <p>{c.shortDescription || c.description}</p>
                      <a className="read-more" href={`/churches/${c._id}`}>
                        {t("church.blog.readMore")}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5 12H19M19 12L13 6M19 12L13 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreBlog && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
                  <button
                    className="hero-cta"
                    onClick={handleLoadMoreBlog}
                    disabled={blogLoadingMore}
                  >
                    {blogLoadingMore ? t("church.blog.loadingMore") : t("church.blog.loadMore")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Church;