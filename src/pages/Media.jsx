import React, { useState, useRef, useEffect } from "react";
import API from "../api/api";
import "./Media.css";

/**
 * Media page — one page, three sections, each laid out as a
 * functional 3-item grid, fetched from the backend (same API client
 * used in CreateMedia.jsx):
 *  1. Video  — grid of cards; click a card to play it inline
 *  2. Photos — grid of cards; click a card to open it in a lightbox
 *  3. Audio  — grid of cards; click play on a card to listen
 *              (playing one card pauses any other that's playing)
 *
 * Each section shows 10 items at a time with its own "Load More" button
 * that reveals 10 more, and only appears once that section has more
 * than 10 items.
 *
 * Same outer shell as Home/Services (cloud layer, marquee nav, footer).
 * Styles live in Media.css (imported above).
 */
const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

const PAGE_SIZE = 10;

// Turns whatever the API sends back for a media file (a full URL, or just a
// filename/relative path saved from an upload) into a usable src.
const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl; // already a full URL
  const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/uploads/${mediaUrl}`;
  return `${base}${path}`;
};

const VideoSection = ({ items }) => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">Watch</span>
      <h2 className="display">Video</h2>
      <p className="section-intro">Sermons and worship moments from our church family.</p>
      <div className="media-grid">
        {visible.map((v, i) => (
          <div className="grid-card video-card" key={v._id || i}>
            {playingIndex === i ? (
              <div className="video-embed">
                <video src={v.mediaUrl} controls autoPlay />
              </div>
            ) : (
              <button className="video-thumb-btn" onClick={() => setPlayingIndex(i)} aria-label={`Play ${v.title}`}>
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} />
                ) : (
                  <div className="video-thumb-placeholder" />
                )}
                <span className="play-overlay">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </button>
            )}
            <p className="grid-card-title">{v.title}</p>
          </div>
        ))}
      </div>
      {items.length > visibleCount && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

const PhotoSection = ({ items }) => {
  const [lightbox, setLightbox] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  const showPrev = () => setLightbox((i) => (i === 0 ? visible.length - 1 : i - 1));
  const showNext = () => setLightbox((i) => (i === visible.length - 1 ? 0 : i + 1));

  return (
    <div className="media-section">
      <span className="eyebrow">Look Back</span>
      <h2 className="display">Photos</h2>
      <p className="section-intro">A look inside our worship and life together.</p>
      <div className="media-grid">
        {visible.map((p, i) => (
          <button className="grid-card photo-card" key={p._id || i} onClick={() => setLightbox(i)}>
            <img src={p.mediaUrl} alt={p.title} />
            <p className="grid-card-title">{p.title}</p>
          </button>
        ))}
      </div>

      {items.length > visibleCount && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load More
          </button>
        </div>
      )}

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
            <img src={visible[lightbox].mediaUrl} alt={visible[lightbox].title} />
            <div className="lightbox-caption">
              <h3>{visible[lightbox].title}</h3>
              <p>{visible[lightbox].description}</p>
            </div>
            <button className="lightbox-nav left" onClick={showPrev} aria-label="Previous photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className="lightbox-nav right" onClick={showNext} aria-label="Next photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AudioSection = ({ items }) => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const audioRefs = useRef([]);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  const toggleTrack = (i) => {
    const el = audioRefs.current[i];
    if (!el) return;
    if (playingIndex === i) {
      el.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null && audioRefs.current[playingIndex]) {
        audioRefs.current[playingIndex].pause();
      }
      el.currentTime = 0;
      el.play();
      setPlayingIndex(i);
    }
  };

  return (
    <div className="media-section">
      <span className="eyebrow">Listen</span>
      <h2 className="display">Audio</h2>
      <p className="section-intro">Hymns and sermon recordings you can listen to anytime.</p>
      <div className="media-grid">
        {visible.map((t, i) => (
          <div className="grid-card audio-card" key={t._id || i}>
            <button className="audio-play-btn" onClick={() => toggleTrack(i)} aria-label={playingIndex === i ? "Pause" : "Play"}>
              {playingIndex === i ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <p className="grid-card-title">{t.title}</p>
            <p className="audio-artist">{t.description}</p>
            <audio
              ref={(el) => (audioRefs.current[i] = el)}
              src={t.mediaUrl}
              onEnded={() => setPlayingIndex(null)}
            />
          </div>
        ))}
      </div>
      {items.length > visibleCount && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

const Media = () => {
  const [videoItems, setVideoItems] = useState([]);
  const [photoItems, setPhotoItems] = useState([]);
  const [audioItems, setAudioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const [videoRes, photoRes, audioRes] = await Promise.all([
        API.get("/media/type/video"),
        API.get("/media/type/photo"),
        API.get("/media/type/audio"),
      ]);

      // Public page: only show published items, resolve mediaUrl/thumbnail
      const mapItems = (data) =>
        data
          .filter((m) => m.status === "published")
          .map((m) => ({
            ...m,
            mediaUrl: getMediaUrl(m.mediaUrl),
            thumbnail: getMediaUrl(m.thumbnail),
          }));

      setVideoItems(mapItems(videoRes.data));
      setPhotoItems(mapItems(photoRes.data));
      setAudioItems(mapItems(audioRes.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const footerColumns = [
    { title: "Visit", items: ["Service Times", "Directions", "What to Expect"] },
    { title: "Get Involved", items: ["Ministries", "Volunteer", "Give", "Missions"] },
    { title: "Connect", items: ["Facebook", "Instagram", "YouTube"] },
  ];

  return (
    <div className="media-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <section className="media-hero">
        <div className="wrapper">
          <span className="eyebrow">Media</span>
          <h1 className="display">Video, Photos & Audio</h1>
          <p>Everything to watch, look back on, and listen to — all in one place.</p>
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

      <section className="media-sections">
        <div className="wrapper">
          {loading && <p style={{ textAlign: "center" }}>Loading media...</p>}
          {!loading && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}
          {!loading && !error && videoItems.length === 0 && photoItems.length === 0 && audioItems.length === 0 && (
            <p style={{ textAlign: "center" }}>No media found.</p>
          )}
          {!loading && !error && (
            <>
              <VideoSection items={videoItems} />
              <PhotoSection items={photoItems} />
              <AudioSection items={audioItems} />
            </>
          )}
        </div>
      </section>

      <footer className="media-footer">
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

export default Media;