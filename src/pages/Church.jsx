import React, { useState, useEffect } from "react";
import API from "../api/api";
import "./Church.css";

const Church = () => {
  const [showConstructionAd, setShowConstructionAd] = useState(false);

  // --- Hero: GET /api/churches/primary (the one church with isPrimary: true) ---
  const [primaryChurch, setPrimaryChurch] = useState(null);
  const [primaryLoading, setPrimaryLoading] = useState(true);
  const [primaryError, setPrimaryError] = useState("");

  // --- Where The Leader Serves Now: GET /api/churches/current (public, no userId) ---
  const [currentChurch, setCurrentChurch] = useState(null);
  const [currentLoading, setCurrentLoading] = useState(true);
  const [currentError, setCurrentError] = useState("");

  // --- Other Churches (full list, no pagination): GET /api/churches ---
  const [churches, setChurches] = useState([]);
  const [churchesLoading, setChurchesLoading] = useState(true);
  const [churchesError, setChurchesError] = useState("");

  // --- "The church in Ethiopia" blog grid: GET /api/churches?page=&limit=20, with Load More ---
  const [blogChurches, setBlogChurches] = useState([]);
  const [blogPage, setBlogPage] = useState(1);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogLoadingMore, setBlogLoadingMore] = useState(false);
  const [blogError, setBlogError] = useState("");
  const [hasMoreBlog, setHasMoreBlog] = useState(true);

  const BLOG_LIMIT = 20;

  useEffect(() => {
    const timer = setTimeout(() => setShowConstructionAd(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchPrimaryChurch();
    fetchCurrentChurch();
    fetchChurches();
    fetchBlogChurches(1);
  }, []);

  const fetchPrimaryChurch = async () => {
    try {
      setPrimaryLoading(true);
      setPrimaryError("");

      // Public endpoint — returns the single church with isPrimary: true.
      // Powers the hero section (title, description, image) instead of
      // hardcoded copy.
      const res = await API.get(`/churches/primary`);

      setPrimaryChurch(res.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 404) {
        setPrimaryChurch(null);
      } else {
        setPrimaryError(
          err.response?.data?.message || "Failed to load the church"
        );
      }
    } finally {
      setPrimaryLoading(false);
    }
  };

  const fetchCurrentChurch = async () => {
    try {
      setCurrentLoading(true);
      setCurrentError("");

      // Public endpoint — returns the single isCurrent && isPrimary
      // assignment (the featured leader). A 404 here just means no
      // leader is currently assigned — not a real error.
      const res = await API.get(`/churches/current`);

      setCurrentChurch(res.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 404) {
        setCurrentChurch(null);
      } else {
        setCurrentError(
          err.response?.data?.message || "Failed to load the current church"
        );
      }
    } finally {
      setCurrentLoading(false);
    }
  };

  const fetchChurches = async () => {
    try {
      setChurchesLoading(true);
      setChurchesError("");

      const res = await API.get("/churches");

      setChurches(res.data);
    } catch (err) {
      console.log(err);
      setChurchesError(err.response?.data?.message || "Failed to load churches");
    } finally {
      setChurchesLoading(false);
    }
  };

  const fetchBlogChurches = async (page) => {
    try {
      if (page === 1) {
        setBlogLoading(true);
      } else {
        setBlogLoadingMore(true);
      }
      setBlogError("");

      const res = await API.get(`/churches?page=${page}&limit=${BLOG_LIMIT}`);

      // Adjust these keys to match whatever your /churches endpoint actually
      // returns when paginated — e.g. { churches: [...], totalPages } or
      // just a plain array with no pagination metadata.
      const newChurches = res.data.churches || res.data.data || res.data || [];
      const totalPages = res.data.totalPages;

      setBlogChurches((prev) => (page === 1 ? newChurches : [...prev, ...newChurches]));
      setBlogPage(page);

      if (totalPages != null) {
        setHasMoreBlog(page < totalPages);
      } else {
        // Fallback: if we got a full page, assume there might be more
        setHasMoreBlog(newChurches.length === BLOG_LIMIT);
      }
    } catch (err) {
      console.log(err);
      setBlogError(err.response?.data?.message || "Failed to load churches");
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

  // Helper: safely render a field that might be a populated object
  // (e.g. { _id, name }) instead of a plain string — prevents the
  // "Objects are not valid as a React child" crash.
  const renderLabel = (value, fallback = "") => {
    if (!value) return fallback;
    if (typeof value === "string") return value;
    if (typeof value === "object") return value.name || value.title || fallback;
    return fallback;
  };

  return (
    <div className="church-page">
      <section className="church-hero">
        <img
          src={
            primaryChurch?.image ||
            "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=80"
          }
          alt={primaryChurch?.churchName || "A beautiful church filled with light"}
        />
        <div className="church-hero-content">
          <span className="eyebrow">Our Church</span>
          {primaryLoading ? (
            <h1 className="display">Loading...</h1>
          ) : primaryError ? (
            <p style={{ color: "red" }}>{primaryError}</p>
          ) : primaryChurch ? (
            <>
              <h1 className="display">{primaryChurch.churchName}</h1>
              <p>{primaryChurch.shortDescription || primaryChurch.description}</p>
            </>
          ) : (
            <>
              <h1 className="display">A living faith, rooted in ancient soil.</h1>
              <p>
                From the highlands of Aksum to the halls we gather in today, our
                story is part of one of the oldest continuous Christian
                traditions on earth.
              </p>
            </>
          )}
          <button className="hero-cta">Read Our Story</button>
        </div>
      </section>

      {showConstructionAd && (
        <div style={{ background: "var(--navy-deep)", padding: "1px 24px 40px 24px" }}>
          <div className="construction-ad visible">
            <div className="construction-ad-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80"
                alt="Church building under construction"
              />
              <span className="construction-ad-badge">Under Construction</span>
            </div>
            <button
              className="construction-ad-close"
              onClick={dismissConstructionAd}
              aria-label="Close"
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
              <span className="eyebrow">Building For Tomorrow</span>
              <h3>A new home for a growing church</h3>
              <p>
                Our Eastside campus has outgrown its walls — help us build a
                larger sanctuary for the families joining us each week.
              </p>
              <div className="ad-progress-label">
                <span>Progress</span>
                <strong>62% complete</strong>
              </div>
              <div className="ad-progress-track">
                <div className="ad-progress-fill" style={{ width: "62%" }} />
              </div>
              <button className="construction-ad-support-btn">Support the Build</button>
            </div>
          </div>
        </div>
      )}

      <section className="serve-now-section">
        <div className="wrapper">
          {currentLoading ? (
            <p>Loading current church...</p>
          ) : currentError ? (
            <p style={{ color: "red" }}>{currentError}</p>
          ) : !currentChurch ? (
            <p>No leader is currently assigned to a church.</p>
          ) : (
            <div className="serve-now-card">
              <div className="serve-now-img-wrap">
                <img
                  src={currentChurch.church?.image || ""}
                  alt={currentChurch.church?.churchName || ""}
                />
                <span className="serve-now-badge">Where I Serve Now</span>
              </div>
              <div className="serve-now-body">
                <span className="serve-now-role">{renderLabel(currentChurch.role)}</span>
                <h2 className="display">{currentChurch.church?.churchName}</h2>
                <div className="serve-now-since">
                  {currentChurch.servingSince &&
                    `Serving since ${new Date(currentChurch.servingSince).getFullYear()}`}
                </div>
                <p className="serve-now-desc">{currentChurch.description}</p>
                <div className="serve-now-details">
                  <div className="serve-now-line">
                    <strong>Address:</strong> {currentChurch.church?.address}
                  </div>
                  <div className="serve-now-line">
                    <strong>Service:</strong> {currentChurch.church?.serviceDays} ·{" "}
                    {currentChurch.church?.serviceTime}
                  </div>
                </div>
                <button className="serve-now-cta">
                  Visit This Campus
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
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="campuses-section">
        <div className="wrapper">
          <div className="campuses-head">
            <span className="eyebrow">Where We Gather</span>
            <h2 className="display">The churches it serves</h2>
            <p>
              One community, gathered every Sunday — each with its own
              rhythm, but the same commitment to the Word.
            </p>
          </div>

          {churchesLoading ? (
            <p>Loading churches...</p>
          ) : churchesError ? (
            <p style={{ color: "red" }}>{churchesError}</p>
          ) : churches.length === 0 ? (
            <p>No churches found.</p>
          ) : (
            <div className="campus-grid">
              {churches.map((c) => (
                <div className="campus-card" key={c._id}>
                  <img src={c.image || ""} alt={c.churchName} />
                  <div className="campus-card-body">
                    {c.isPrimary && <div className="campus-role">Primary</div>}
                    {c.isFeatured && <div className="campus-role">Featured</div>}
                    <h3>{c.churchName}</h3>
                    <p>{c.shortDescription}</p>
                    <div className="campus-line">
                      <strong>Address:</strong> {c.address}
                    </div>
                    <div className="campus-line">
                      <strong>Service:</strong> {c.serviceDays} · {c.serviceTime}
                    </div>
                    <button
                      className="read-more"
                      onClick={() => (window.location.href = `/churches/${c._id}`)}
                    >
                      Read more
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 12H19M19 12L13 6M19 12L13 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="blog-section">
        <div className="wrapper">
          <div className="blog-head">
            <span className="eyebrow">From the Journal</span>
            <h2 className="display">The church in Ethiopia</h2>
            <p>
              A closer look at the history, architecture, and living
              traditions that shape our faith community.
            </p>
          </div>

          {blogLoading ? (
            <p>Loading churches...</p>
          ) : blogError ? (
            <p style={{ color: "red" }}>{blogError}</p>
          ) : blogChurches.length === 0 ? (
            <p>No churches found.</p>
          ) : (
            <>
              <div className="blog-grid">
                {blogChurches.map((c) => (
                  <div className="blog-card" key={c._id}>
                    <img src={c.image || ""} alt={c.churchName} />
                    <div className="blog-card-body">
                      <div className="blog-tag">
                        {c.isPrimary ? "Primary" : c.isFeatured ? "Featured" : "Church"}
                      </div>
                      <h3>{c.churchName}</h3>
                      <p>{c.shortDescription || c.description}</p>
                      <button
                        className="read-more"
                        onClick={() => (window.location.href = `/churches/${c._id}`)}
                      >
                        Read more
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5 12H19M19 12L13 6M19 12L13 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
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
                    {blogLoadingMore ? "Loading..." : "Load More"}
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