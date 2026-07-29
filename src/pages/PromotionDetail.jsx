import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api.jsx";
import "./Blog.css";
import "./Detail.css";
import "./PromotionDetail.css";

const PromotionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [otherPromotions, setOtherPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/promotions");
        const list = Array.isArray(res.data) ? res.data : res.data.promotions;
        const match = (list || []).find((p) => p._id === id);
        setPromotion(match || null);
        setOtherPromotions((list || []).filter((p) => p._id !== id));
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load this promotion");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotion();
  }, [id]);

  // === Same fixed top-left back button used on the Detail page ===
  const BackButton = () => (
    <Link to="/" aria-label="Go back" className="detail-back-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  if (loading) {
    return (
      <div className="church-portal">
        <BackButton />
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p>Loading promotion...</p>
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="church-portal">
        <BackButton />
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error || "Promotion not found."}</p>
          <Link to="/" style={{ color: "var(--gold, #b8860b)" }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  const image = promotion.image || promotion.photo || promotion.photoUrl || promotion.imageUrl;

  return (
    <div className="church-portal">
      <BackButton />

      <section className="promo-hero-section">
        <div className="wrapper" style={{ maxWidth: "900px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#d32f2f", textTransform: "uppercase", marginBottom: "16px", display: "block" }}>
            Sponsored Content
          </span>

          {image && (
            <img
              src={image}
              alt={promotion.title || "Sponsored content"}
              className="promo-hero-image"
            />
          )}

          <h1 className="promo-title">
            {promotion.title}
          </h1>

          <p className="promo-description">
            {promotion.description}
          </p>

          {promotion.link && (
            <button
              className="promo-visit-btn"
              onClick={() => window.open(promotion.link, "_blank", "noopener,noreferrer")}
            >
              Visit Sponsor
            </button>
          )}
        </div>
      </section>

      {otherPromotions.length > 0 && (
        <section className="promo-more-section">
          <div className="wrapper" style={{ maxWidth: "1080px" }}>
            <h3 className="promo-more-heading">
              More Promotions
            </h3>
            <div className="promo-more-grid">
              {otherPromotions.map((p) => {
                const thumb = p.image || p.photo || p.photoUrl || p.imageUrl;
                return (
                  <div
                    key={p._id}
                    className="promo-more-card"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate(`/promotions/${p._id}`);
                    }}
                  >
                    {thumb && (
                      <img
                        src={thumb}
                        alt={p.title || "Sponsored content"}
                        className="promo-more-thumb"
                      />
                    )}
                    <div className="promo-more-card-body">
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#d32f2f", textTransform: "uppercase" }}>
                        Sponsored
                      </span>
                      <h4 className="promo-more-card-title">
                        {p.title}
                      </h4>
                      <p className="promo-more-card-desc">
                        {p.description}
                      </p>
                    </div>
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

export default PromotionDetail;