import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api.jsx";

const HeroDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/homeheros");
        const list = Array.isArray(res.data) ? res.data : [res.data];
        const match = (list || []).find((h) => h._id === id);
        setEntry(match || null);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load this entry");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  // === Same fixed top-left back button used on the Detail / PromotionDetail pages ===
  const BackButton = () => (
    <Link to="/" aria-label="Go back" className="hero-detail-back-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  // === Same responsive breakpoint pattern used in PromotionDetail.css, inlined here ===
  const responsiveStyles = `
    .hero-detail-back-btn {
      position: fixed;
      top: 24px;
      left: 24px;
      z-index: 10;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(15, 36, 56, 0.55);
      color: #eaf3f8;
      backdrop-filter: blur(4px);
      text-decoration: none;
    }
    .hero-detail-back-btn:hover {
      background: rgba(15, 36, 56, 0.75);
    }

    .hero-detail-section {
      padding: 60px 0;
    }
    .hero-detail-image {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 18px;
      margin-bottom: 30px;
      box-shadow: 0 24px 40px rgba(15,36,56,0.35);
    }
    .hero-detail-title {
      font-size: 2.6rem;
      margin: 0 0 20px 0;
      color: #eaf3f8;
    }
    .hero-detail-description {
      font-size: 1.3rem;
      color: #a9c2d3;
      line-height: 1.7;
    }

    /* --- Laptops / small desktops (max-width: 1024px) ----------------------- */
    @media (max-width: 1024px) {
      .hero-detail-section { padding: 50px 0; }
      .hero-detail-title { font-size: 2.3rem; }
      .hero-detail-description { font-size: 1.2rem; }
    }

    /* --- Tablets portrait / large phones (max-width: 768px) ------------------ */
    @media (max-width: 768px) {
      .hero-detail-section { padding: 42px 0; }
      .hero-detail-title { font-size: 2rem; margin-bottom: 16px; }
      .hero-detail-description { font-size: 1.1rem; }
      .hero-detail-back-btn { top: 18px; left: 18px; width: 36px; height: 36px; }
    }

    /* --- Large phones (max-width: 600px) -------------------------------------- */
    @media (max-width: 600px) {
      .hero-detail-section { padding: 34px 0; }
      .hero-detail-title { font-size: 1.7rem; }
      .hero-detail-description { font-size: 1rem; line-height: 1.6; }
    }

    /* --- Standard phones (max-width: 480px) ------------------------------------ */
    @media (max-width: 480px) {
      .hero-detail-section { padding: 26px 0; }
      .hero-detail-title { font-size: 1.5rem; }
      .hero-detail-description { font-size: 0.95rem; }
      .hero-detail-back-btn { top: 14px; left: 14px; width: 32px; height: 32px; }
    }

    /* --- Small phones (max-width: 380px) ---------------------------------------- */
    @media (max-width: 380px) {
      .hero-detail-title { font-size: 1.3rem; }
      .hero-detail-description { font-size: 0.9rem; }
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
          <Link to="/" style={{ color: "var(--gold, #b8860b)" }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="church-portal">
      <style>{responsiveStyles}</style>
      <BackButton />

      <section className="hero-detail-section" style={{ background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)" }}>
        <div className="wrapper" style={{ maxWidth: "900px" }}>
          {entry.image && (
            <img
              src={entry.image}
              alt={entry.title || "Church hero"}
              className="hero-detail-image"
            />
          )}

          <h1 className="display hero-detail-title">
            {entry.title}
          </h1>

          <p className="hero-detail-description">
            {entry.description}
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroDetail;