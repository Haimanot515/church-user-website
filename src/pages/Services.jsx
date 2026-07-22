import React, { useEffect, useState } from "react";
import API from "../api/api";
import "./Services.css";

/**
 * Public Services page.
 *
 * Services are now fetched from the backend (same API client/pattern used
 * in ManageServices.jsx) instead of a hardcoded array. Only services with
 * status "active" are shown to visitors.
 *
 * Uses the same outer shell as ChurchBlogPage.jsx (home page):
 * drifting cloud layer, sticky marquee nav bar, and site footer —
 * so this page reads as part of the same site.
 *
 * Styles live in Services.css (imported above) rather than an inline
 * <style> block.
 */
const Services = () => {
  const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  // Turns whatever the API sends back for imageUrl (a full URL, or just a
  // filename/relative path saved from an upload) into a usable <img src>.
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl; // already a full URL
    const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
    const path = imageUrl.startsWith("/") ? imageUrl : `/uploads/${imageUrl}`;
    return `${base}${path}`;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/services");
      // Only show services that are marked active on the public page
      const active = res.data
        .filter((s) => s.status === "active")
        .map((s) => ({ ...s, resolvedImageUrl: getImageUrl(s.imageUrl) }));
      setServices(active);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const footerColumns = [
    { title: "Visit", items: ["Service Times", "Directions", "What to Expect"] },
    { title: "Get Involved", items: ["Ministries", "Volunteer", "Give", "Missions"] },
    { title: "Connect", items: ["Facebook", "Instagram", "YouTube"] },
  ];

  return (
    <div className="services-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <section className="services-hero">
        <div className="wrapper">
          <h1 className="display">Our Services</h1>
          <p>From covenant prayer, to the sacred rhythm of the Liturgy, to the teaching and hymns that carry it through the week — every service is open to all.</p>
        </div>
      </section>

      <nav className="nav-bar">
        <div className="nav-marquee-viewport">
          <div className="nav-marquee-track">
            {categories.map((cat, i) => <span key={`a-${i}`} className="nav-item">{cat}</span>)}
            {categories.map((cat, i) => <span key={`b-${i}`} className="nav-item" aria-hidden="true">{cat}</span>)}
          </div>
        </div>
      </nav>

      <section className="services-list">
        <div className="wrapper">
          {loading && <p style={{ textAlign: "center" }}>Loading services...</p>}

          {!loading && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}

          {!loading && !error && services.length === 0 && (
            <p style={{ textAlign: "center" }}>No services found.</p>
          )}

          {!loading && !error && services.slice(0, visibleCount).map((s, i) => (
            <div className={`service-row${i % 2 === 1 ? " reverse" : ""}`} key={s._id || i}>
              <div className="service-img">
                {s.resolvedImageUrl ? (
                  <img src={s.resolvedImageUrl} alt={s.title} />
                ) : (
                  <div className="service-img-placeholder" aria-hidden="true" />
                )}
              </div>
              <div className="service-copy">
                <svg className="service-cross" width="22" height="32" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="0" width="4" height="32" fill="var(--gold)" />
                  <rect x="1" y="12" width="20" height="4" fill="var(--gold)" />
                </svg>
                <h2>{s.title}</h2>
                <p className="time">{s.schedule}{s.location ? ` · ${s.location}` : ""}</p>
                {s.isFeatured && <p className="note">Featured service</p>}
                <p className="desc">{s.description}</p>
              </div>
            </div>
          ))}

          {!loading && !error && services.length > visibleCount && (
            <div className="load-more-wrap">
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount((c) => c + 10)}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="services-cta">
        <div className="wrapper">
          <h3 className="display">Come as you are.</h3>
          <p>All are welcome — no invitation needed.</p>
        </div>
      </section>

      {/* FOOTER - same as home page */}
      <footer className="services-footer">
        <div className="wrapper">
          <div className="footer-grid">
            <div>
              <h4 className="display footer-brand">Harbor Light Church</h4>
              <p className="footer-tagline">Sunday services at 9:00 & 11:00 AM. All are welcome, always.</p>
            </div>
            {footerColumns.map((col, i) => (
              <div key={i}>
                <h5 className="eyebrow footer-col-title">{col.title}</h5>
                {col.items.map((s, j) => (
                  <p key={j} className="footer-col-item">{s}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p className="eyebrow">© 2026 Harbor Light Church</p>
            <p className="eyebrow">Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;