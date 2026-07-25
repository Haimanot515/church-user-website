import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api.jsx";

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

  if (loading) {
    return (
      <div className="church-portal">
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p>Loading promotion...</p>
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="church-portal">
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
      <section style={{ padding: "60px 0" }}>
        <div className="wrapper" style={{ maxWidth: "900px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#555",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              marginBottom: "24px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#d32f2f", textTransform: "uppercase", marginBottom: "16px", display: "block" }}>
            Sponsored Content
          </span>

          {image && (
            <img
              src={image}
              alt={promotion.title || "Sponsored content"}
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "8px", marginBottom: "30px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            />
          )}

          <h1 style={{ fontSize: "2.4rem", margin: "0 0 20px 0", fontFamily: "Georgia, serif" }}>
            {promotion.title}
          </h1>

          <p style={{ fontSize: "1.2rem", color: "#444", lineHeight: 1.7, marginBottom: "30px" }}>
            {promotion.description}
          </p>

          {promotion.link && (
            <button
              onClick={() => window.open(promotion.link, "_blank", "noopener,noreferrer")}
              style={{
                backgroundColor: "#d32f2f",
                color: "#fff",
                border: "none",
                padding: "14px 34px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#b71c1c")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            >
              Visit Sponsor
            </button>
          )}
        </div>
      </section>

      {otherPromotions.length > 0 && (
        <section style={{ padding: "20px 0 70px 0", background: "#f7f7f7" }}>
          <div className="wrapper" style={{ maxWidth: "1080px" }}>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "28px", fontFamily: "Georgia, serif" }}>
              More Promotions
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {otherPromotions.map((p) => {
                const thumb = p.image || p.photo || p.photoUrl || p.imageUrl;
                return (
                  <div
                    key={p._id}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate(`/promotions/${p._id}`);
                    }}
                    style={{
                      cursor: "pointer",
                      background: "#fff",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    {thumb && (
                      <img
                        src={thumb}
                        alt={p.title || "Sponsored content"}
                        style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
                      />
                    )}
                    <div style={{ padding: "16px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#d32f2f", textTransform: "uppercase" }}>
                        Sponsored
                      </span>
                      <h4 style={{ fontSize: "1.15rem", margin: "8px 0 6px 0", fontFamily: "Georgia, serif" }}>
                        {p.title}
                      </h4>
                      <p style={{ fontSize: "0.95rem", color: "#555", margin: 0 }}>
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