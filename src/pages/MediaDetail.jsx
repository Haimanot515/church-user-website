import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import "./MediaDetail.css";

/**
 * Media detail page — single-item view for whatever was clicked on
 * the Media page. Renders differently depending on entry.mediaType:
 *   "video"    → inline video player
 *   "photo"    → full image
 *   "audio"    → play button + native audio element
 *   "document" → cover + "Open" button (opens file in a new tab)
 *
 * Uses the same getMediaUrl helper and design system (cloud layer,
 * navy/gold palette, fonts) as Media.jsx / Media.css.
 */

const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;
  const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/uploads/${mediaUrl}`;
  return `${base}${path}`;
};

const MediaDetail = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/media/${id}`);
        const item = res.data;
        setEntry({
          ...item,
          mediaUrl: getMediaUrl(item.mediaUrl),
          thumbnail: getMediaUrl(item.thumbnail),
        });
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load this item");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  };

  const BackButton = () => (
    <Link to="/media" aria-label="Go back" className="media-detail-back-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  const Shell = ({ children }) => (
    <div className="media-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>
      <BackButton />
      {children}
    </div>
  );

  if (loading) {
    return (
      <Shell>
        <div className="wrapper" style={{ padding: "160px 0", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </Shell>
    );
  }

  if (error || !entry) {
    return (
      <Shell>
        <div className="wrapper" style={{ padding: "160px 0", textAlign: "center" }}>
          <p style={{ color: "#dc2626" }}>{error || "Not found."}</p>
          <Link to="/media" style={{ color: "var(--gold)" }}>Back to Media</Link>
        </div>
      </Shell>
    );
  }

  const eyebrowByType = {
    video: "Watch",
    photo: "Look Back",
    audio: "Listen",
    document: "Read",
  };

  return (
    <Shell>
      <section className="media-detail-hero">
        <div className="wrapper">
          <span className="eyebrow">{eyebrowByType[entry.mediaType] || "Media"}</span>
          <h1>{entry.title}</h1>
        </div>
      </section>

      <section className="media-detail-section">
        <div className="wrapper">
          <div className="media-detail-body">
            {entry.mediaType === "video" && (
              <div className="media-detail-video">
                <video src={entry.mediaUrl} controls autoPlay />
              </div>
            )}

            {entry.mediaType === "photo" && (
              <img src={entry.mediaUrl} alt={entry.title} className="media-detail-photo" />
            )}

            {entry.mediaType === "audio" && (
              <div className="media-detail-audio-card">
                <button
                  className="media-detail-audio-play-btn"
                  onClick={toggleAudio}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>
                <audio
                  ref={audioRef}
                  src={entry.mediaUrl}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            )}

            {entry.mediaType === "document" && (
              <div className="media-detail-document">
                {entry.thumbnail ? (
                  <img src={entry.thumbnail} alt={entry.title} style={{ maxWidth: "220px", borderRadius: "6px" }} />
                ) : (
                  <svg className="media-detail-document-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z" />
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  </svg>
                )}
                <div>
                  <a
                    className="media-detail-open-btn"
                    href={entry.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Document
                  </a>
                </div>
              </div>
            )}

            {entry.description && (
              <p className="media-detail-description">{entry.description}</p>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
};

export default MediaDetail;