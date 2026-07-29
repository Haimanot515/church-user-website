import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import "./ChurchDetail.css";

/**
 * Church detail page — single-church view reached from the
 * "Read more" buttons on Church.jsx (campus cards + blog cards,
 * which both link to /churches/:id).
 *
 * Assumes GET /api/churches/:id on the backend, same convention as
 * the other detail pages (AboutDetail, MediaDetail, etc.).
 */
const ChurchDetail = () => {
  const { id } = useParams();
  const [church, setChurch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchChurch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/churches/${id}`);
        setChurch(res.data);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load this church");
      } finally {
        setLoading(false);
      }
    };
    fetchChurch();
  }, [id]);

  const BackButton = () => (
    <Link to="/cv" aria-label="Go back" className="church-detail-back-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  if (loading) {
    return (
      <div className="church-detail-page">
        <BackButton />
        <div className="wrapper" style={{ padding: "160px 0", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !church) {
    return (
      <div className="church-detail-page">
        <BackButton />
        <div className="wrapper" style={{ padding: "160px 0", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error || "Not found."}</p>
          <Link to="/cv" style={{ color: "var(--gold)" }}>Back to Churches</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="church-detail-page">
      <BackButton />

      <section className="church-detail-hero">
        <img
          src={church.image || ""}
          alt={church.churchName}
        />
        <div className="church-detail-hero-content">
          {church.isPrimary && <span className="church-detail-tag">Primary</span>}
          {!church.isPrimary && church.isFeatured && (
            <span className="church-detail-tag">Featured</span>
          )}
          <h1>{church.churchName}</h1>
        </div>
      </section>

      <section className="church-detail-section">
        <div className="wrapper">
          <div className="church-detail-body">
            <p className="church-detail-description">
              {church.description || church.shortDescription}
            </p>

            <div className="church-detail-details">
              {church.address && (
                <div className="church-detail-line">
                  <strong>Address:</strong> {church.address}
                </div>
              )}
              {(church.serviceDays || church.serviceTime) && (
                <div className="church-detail-line">
                  <strong>Service:</strong> {church.serviceDays}
                  {church.serviceDays && church.serviceTime ? " · " : ""}
                  {church.serviceTime}
                </div>
              )}
            </div>

            {church.address && (
              <a
                className="church-detail-cta"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChurchDetail;