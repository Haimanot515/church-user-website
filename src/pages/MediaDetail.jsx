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

// Same blob-based download used on Media.jsx — fetches the file as a
// blob so `download` works even when the file is served from a
// different origin (CDN), instead of the browser just navigating to it.
const handleDownload = async (url, title) => {
  if (!url) return;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const ext = (url.split(".").pop() || "").split("?")[0];
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = ext ? `${title || "download"}.${ext}` : title || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

const MediaDetail = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [relatedItems, setRelatedItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  // Close the three-dot menu when clicking anywhere else on the page
  // (same pattern as the video/audio cards on Media.jsx).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeMenu = () => setMenuOpen(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [menuOpen]);

  const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const formatTime = (secs) => {
    if (!Number.isFinite(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

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
        setError(err.response?.data?.message || "Failed to load this item");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await API.get("/media");
        const all = Array.isArray(res.data) ? res.data : res.data?.items || [];
        const currentId = String(id);
        const sameType = all.filter(
          (m) => (m._id || m.id) && String(m._id || m.id) !== currentId && m.mediaType === entry?.mediaType
        );
        const pool = sameType.length >= 3
          ? sameType
          : all.filter((m) => (m._id || m.id) && String(m._id || m.id) !== currentId);
        const picks = pool.slice(0, 4).map((m) => ({
          ...m,
          id: m._id || m.id,
          thumbnail: getMediaUrl(m.thumbnail || m.mediaUrl),
        }));
        setRelatedItems(picks);
      } catch (err) {
        setRelatedItems([]);
      }
    };
    if (entry) fetchRelated();
  }, [entry, id]);

  // Backup ticker: some audio sources fire `timeupdate` inconsistently
  // (throttled background tabs, certain streamed formats), so while
  // playing we also poll currentTime directly via requestAnimationFrame.
  useEffect(() => {
    const tick = () => {
      const el = audioRef.current;
      if (el) {
        setCurrentTime(el.currentTime);
        if (Number.isFinite(el.duration) && el.duration !== duration) {
          setDuration(el.duration);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      setAudioError("");
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setAudioError("Couldn't play audio. Try tapping play again.");
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e) => {
    const el = audioRef.current;
    if (!el) return;
    const value = Number(e.target.value);
    el.currentTime = value;
    setCurrentTime(value);
  };

  const cycleSpeed = () => {
    const el = audioRef.current;
    if (!el) return;
    const idx = SPEED_OPTIONS.indexOf(playbackRate);
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    el.playbackRate = next;
    setPlaybackRate(next);
  };

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    const next = !isMuted;
    el.muted = next;
    setIsMuted(next);
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
        </div>
      </section>

      <section className="media-detail-section">
        <div className="wrapper">
          <div className="media-detail-body">
            {(entry.mediaType === "video" || entry.mediaType === "photo") && (
              <div className="media-detail-media-wrap" style={{ position: "relative" }}>
                {entry.mediaType === "video" ? (
                  <div className="media-detail-video">
                    <video src={entry.mediaUrl} controls autoPlay />
                  </div>
                ) : (
                  <img src={entry.mediaUrl} alt={entry.title} className="media-detail-photo" />
                )}

                <button
                  type="button"
                  className="media-detail-menu-btn"
                  aria-label="More options"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((cur) => !cur);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.7" />
                    <circle cx="12" cy="12" r="1.7" />
                    <circle cx="12" cy="19" r="1.7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    className="media-detail-menu-dropdown"
                    style={{
                      position: "absolute",
                      top: 42,
                      right: 8,
                      background: "#fff",
                      borderRadius: 8,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                      overflow: "hidden",
                      zIndex: 3,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="media-detail-menu-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "8px 14px",
                        border: "none",
                        background: "transparent",
                        color: "#222",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onClick={() => {
                        handleDownload(entry.mediaUrl, entry.title);
                        setMenuOpen(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 3v12" />
                        <path d="M7 10l5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                      Download
                    </button>
                  </div>
                )}
              </div>
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
                <div className="media-detail-audio-progress">
                  <input
                    type="range"
                    min="0"
                    max={Number.isFinite(duration) ? duration : 0}
                    value={Number.isFinite(currentTime) ? currentTime : 0}
                    step="0.1"
                    onChange={handleSeek}
                    className="media-detail-audio-seek"
                    aria-label="Seek"
                  />
                  <div className="media-detail-audio-time">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="media-detail-audio-toolbar">
                  <button
                    type="button"
                    className="media-detail-mute-btn"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                      </svg>
                    )}
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    type="button"
                    className="media-detail-speed-btn"
                    onClick={cycleSpeed}
                    aria-label="Change playback speed"
                  >
                    {playbackRate}x
                  </button>
                  <button
                    type="button"
                    className="media-detail-download-btn"
                    onClick={() => handleDownload(entry.mediaUrl, entry.title)}
                    aria-label="Download audio"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    Download
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  src={entry.mediaUrl}
                  preload="auto"
                  muted={isMuted}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onLoadedMetadata={(e) => {
                    if (Number.isFinite(e.target.duration)) {
                      setDuration(e.target.duration);
                    }
                    e.target.playbackRate = playbackRate;
                  }}
                  onDurationChange={(e) => {
                    if (Number.isFinite(e.target.duration)) {
                      setDuration(e.target.duration);
                    }
                  }}
                  onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                  onError={() => {
                    setAudioError("This audio file couldn't be loaded.");
                  }}
                />
                {audioError && (
                  <p className="media-detail-audio-error">{audioError}</p>
                )}
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

            <h1 className="media-detail-title">{entry.title}</h1>

            {entry.description && (
              <p className="media-detail-description">{entry.description}</p>
            )}
          </div>

          {relatedItems.length > 0 && (
            <div className="media-detail-related">
              <h2 className="media-detail-related-heading">You May Also Like</h2>
              <div className="media-detail-related-grid">
                {relatedItems.map((item) => (
                  <Link
                    to={`/media/${item.id}`}
                    key={item.id}
                    className="media-detail-related-card"
                  >
                    <div className="media-detail-related-thumb">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} />
                      ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z" />
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        </svg>
                      )}
                    </div>
                    <span className="media-detail-related-title">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
};

export default MediaDetail;