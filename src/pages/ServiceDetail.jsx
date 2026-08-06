import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api.jsx";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Turns whatever the API sends back for imageUrl (a full URL, or just a
  // filename/relative path saved from an upload) into a usable <img src>.
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl; // already a full URL
    const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
    const path = imageUrl.startsWith("/") ? imageUrl : `/uploads/${imageUrl}`;
    return `${base}${path}`;
  };

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/services");
        const list = Array.isArray(res.data) ? res.data : res.data?.services || [];
        const match = (list || []).find((s) => s._id === id);
        setEntry(match || null);

        // "You may also like" — other active services, excluding this one
        const others = (list || [])
          .filter((s) => s._id !== id && s.status === "active")
          .slice(0, 3);
        setRelated(others);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load this service");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  // === Same fixed top-left back button used on the Detail / PromotionDetail / HeroDetail pages ===
  const BackButton = () => (
    <Link to="/services" aria-label="Go back" className="service-detail-back-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  // === Same responsive breakpoint pattern used in HeroDetail.jsx / PromotionDetail.css, inlined here ===
  const responsiveStyles = `
    .service-detail-back-btn {
      position: fixed;
      top: 90px;
      left: 24px;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(15, 36, 56, 0.75);
      color: #eaf3f8;
      backdrop-filter: blur(4px);
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(15,36,56,0.4);
      pointer-events: auto;
    }
    .service-detail-back-btn:hover {
      background: rgba(15, 36, 56, 0.75);
    }

    .service-detail-section {
      padding: 60px 0;
    }

    /* Photo — reduced size, centered, capped width instead of running full-bleed */
    .service-detail-image {
      display: block;
      width: 100%;
      max-width: 420px;
      aspect-ratio: 4/3;
      object-fit: cover;
      border-radius: 16px;
      margin: 0 auto 28px auto;
      box-shadow: 0 18px 30px rgba(15,36,56,0.32);
    }
    .service-detail-image-placeholder {
      width: 100%;
      max-width: 420px;
      aspect-ratio: 4/3;
      border-radius: 16px;
      margin: 0 auto 28px auto;
      box-shadow: 0 18px 30px rgba(15,36,56,0.32);
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-deep) 100%);
    }

    .service-detail-title {
      font-size: 2.4rem;
      margin: 0 0 12px 0;
      color: #eaf3f8;
      text-align: center;
    }
    .service-detail-time {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--gold, #cf9f3f);
      margin: 0 0 20px 0;
      text-align: center;
    }
    .service-detail-note {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem;
      color: #a9c2d3;
      font-style: italic;
      margin: 0 0 20px 0;
      text-align: center;
    }
    .service-detail-description {
      font-size: 1.2rem;
      color: #a9c2d3;
      line-height: 1.7;
    }

    /* --- "You may also like" section --- */
    .service-related-section {
      padding: 50px 0 70px 0;
      background: rgba(255,255,255,0.03);
    }
    .service-related-title {
      font-size: 1.5rem;
      color: #eaf3f8;
      margin: 0 0 24px 0;
    }
    .service-related-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }
    .service-related-card {
      display: block;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .service-related-img {
      width: 100%;
      aspect-ratio: 4/3;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 10px;
      box-shadow: 0 10px 18px rgba(15,36,56,0.28);
    }
    .service-related-img-placeholder {
      width: 100%;
      aspect-ratio: 4/3;
      border-radius: 12px;
      margin-bottom: 10px;
      box-shadow: 0 10px 18px rgba(15,36,56,0.28);
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-deep) 100%);
    }
    .service-related-name {
      font-size: 1.05rem;
      color: #eaf3f8;
      margin: 0;
    }

    /* --- Laptops / small desktops (max-width: 1024px) ----------------------- */
    @media (max-width: 1024px) {
      .service-detail-section { padding: 50px 0; }
      .service-detail-title { font-size: 2.1rem; }
      .service-detail-description { font-size: 1.1rem; }
      .service-detail-image, .service-detail-image-placeholder { max-width: 380px; }
    }

    /* --- Tablets portrait / large phones (max-width: 768px) ------------------ */
    @media (max-width: 768px) {
      .service-detail-section { padding: 42px 0; }
      .service-detail-title { font-size: 1.9rem; margin-bottom: 10px; }
      .service-detail-description { font-size: 1.05rem; }
      .service-detail-back-btn { top: 78px; left: 18px; width: 36px; height: 36px; }
      .service-detail-image, .service-detail-image-placeholder { max-width: 320px; }
      .service-related-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* --- Large phones (max-width: 600px) -------------------------------------- */
    @media (max-width: 600px) {
      .service-detail-section { padding: 34px 0; }
      .service-detail-title { font-size: 1.6rem; }
      .service-detail-description { font-size: 1rem; line-height: 1.6; }
      .service-detail-image, .service-detail-image-placeholder { max-width: 280px; }
      .service-related-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
    }

    /* --- Standard phones (max-width: 480px) ------------------------------------ */
    @media (max-width: 480px) {
      .service-detail-section { padding: 26px 0; }
      .service-detail-title { font-size: 1.4rem; }
      .service-detail-description { font-size: 0.95rem; }
      .service-detail-back-btn { top: 70px; left: 14px; width: 32px; height: 32px; }
      .service-detail-image, .service-detail-image-placeholder { max-width: 240px; }
      .service-related-section { padding: 40px 0 50px 0; }
    }

    /* --- Small phones (max-width: 380px) ---------------------------------------- */
    @media (max-width: 380px) {
      .service-detail-title { font-size: 1.25rem; }
      .service-detail-description { font-size: 0.9rem; }
      .service-related-grid { grid-template-columns: 1fr; }
    }
  `;

  if (loading) {
    return (
      <div className="church-portal">
        <style>{responsiveStyles}</style>
        <BackButton />
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="church-portal">
        <style>{responsiveStyles}</style>
        <BackButton />
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error || "Not found."}</p>
          <Link to="/services" style={{ color: "var(--gold, #b8860b)" }}>Back to Services</Link>
        </div>
      </div>
    );
  }

  const resolvedImageUrl = getImageUrl(entry.imageUrl);

  return (
    <div className="church-portal">
      <style>{responsiveStyles}</style>
      <BackButton />

      <section className="service-detail-section" style={{ background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)" }}>
        <div className="wrapper" style={{ maxWidth: "900px" }}>
          {resolvedImageUrl ? (
            <img
              src={resolvedImageUrl}
              alt={entry.title || "Service"}
              className="service-detail-image"
            />
          ) : (
            <div className="service-detail-image-placeholder" aria-hidden="true" />
          )}

          <h1 className="display service-detail-title">
            {entry.title}
          </h1>

          <p className="service-detail-time">
            {entry.schedule}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>

          {entry.isFeatured && (
            <p className="service-detail-note">Featured Service</p>
          )}

          <p className="service-detail-description">
            {entry.description}
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="service-related-section" style={{ background: "var(--navy-deep, #0f2438)" }}>
          <div className="wrapper" style={{ maxWidth: "900px" }}>
            <h3 className="service-related-title">You may also like</h3>
            <div className="service-related-grid">
              {related.map((s) => {
                const img = getImageUrl(s.imageUrl);
                return (
                  <div
                    key={s._id}
                    className="service-related-card"
                    onClick={() => navigate(`/services/${s._id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") navigate(`/services/${s._id}`);
                    }}
                  >
                    {img ? (
                      <img src={img} alt={s.title} className="service-related-img" />
                    ) : (
                      <div className="service-related-img-placeholder" aria-hidden="true" />
                    )}
                    <p className="service-related-name">{s.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetail;