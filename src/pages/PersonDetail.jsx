import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api.jsx";
import "./PersonDetail.css";

const PersonDetail = () => {
  const { id } = useParams();
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
        const res = await API.get("/church-persons", { params: { category: "testimony" } });
        const list = Array.isArray(res.data) ? res.data : [res.data];
        const match = (list || []).find((p) => p._id === id);
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

  const BackButton = () => (
    <Link to="/about" aria-label="Go back" className="person-detail-back-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  if (loading) {
    return (
      <div className="church-portal">
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
        <BackButton />
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error || "Not found."}</p>
          <Link to="/about" style={{ color: "var(--gold, #b8860b)" }}>Back to About</Link>
        </div>
      </div>
    );
  }

  const photo =
    (entry.photos && entry.photos[0]) ||
    `https://ui-avatars.com/api/?name=${entry.name}&background=0070f3&color=fff`;

  return (
    <div className="church-portal">
      <BackButton />

      <section className="person-detail-section">
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          <span className="person-detail-label">Testimony</span>

          <img src={photo} alt={entry.name} className="person-detail-photo" />

          <p className="person-detail-quote">"{entry.message}"</p>

          <h1 className="person-detail-name">{entry.name}</h1>
          {entry.title && <p className="person-detail-title-tag">{entry.title}</p>}
        </div>
      </section>
    </div>
  );
};

export default PersonDetail;