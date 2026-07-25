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

  if (loading) {
    return (
      <div className="church-portal">
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="church-portal">
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error || "Not found."}</p>
          <Link to="/" style={{ color: "var(--gold, #b8860b)" }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="church-portal">
      <section style={{ padding: "60px 0", background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)" }}>
        <div className="wrapper" style={{ maxWidth: "900px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#eaf3f8",
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

          {entry.image && (
            <img
              src={entry.image}
              alt={entry.title || "Church hero"}
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "18px", marginBottom: "30px", boxShadow: "0 24px 40px rgba(15,36,56,0.35)" }}
            />
          )}

          <h1 className="display" style={{ fontSize: "2.6rem", margin: "0 0 20px 0", color: "#eaf3f8" }}>
            {entry.title}
          </h1>

          <p style={{ fontSize: "1.3rem", color: "#a9c2d3", lineHeight: 1.7 }}>
            {entry.description}
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroDetail;