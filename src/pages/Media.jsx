import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "./Media.css";

/**
 * Media page — one page, four sections, each laid out as a
 * functional 3-item grid, fetched from the backend (same API client
 * used in CreateMedia.jsx):
 *  1. Video  — grid of cards; click a card to go to its detail page
 *  2. Photos — grid of cards; click a card to go to its detail page
 *  3. Audio  — grid of cards; click a card to go to its detail page
 *  4. Books/PDFs — grid of cards; click a card to go to its detail page
 *
 * Every card now redirects to /media/:id (MediaDetail.jsx), where
 * the actual video/photo/audio/document is played or opened.
 *
 * Each section shows 10 items at a time with its own "Load More" button
 * that reveals 10 more, and only appears once that section has more
 * than 10 items.
 *
 * Same outer shell as Home/Services (cloud layer, footer).
 * Styles live in Media.css (imported above).
 */
const PAGE_SIZE = 10;

const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;
  const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/uploads/${mediaUrl}`;
  return `${base}${path}`;
};

const VideoSection = ({ items }) => {
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
          <Link className="grid-card video-card" to={`/media/${v._id}`} key={v._id || i}>
            <div className="video-thumb-btn" aria-label={"Open " + v.title}>
              {v.thumbnail ? (
                <img src={v.thumbnail} alt={v.title} />
              ) : (
                <div className="video-thumb-placeholder" />
              )}
              <span className="play-overlay">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </div>
            <p className="grid-card-title">{v.title}</p>
          </Link>
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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">Look Back</span>
      <h2 className="display">Photos</h2>
      <p className="section-intro">A look inside our worship and life together.</p>
      <div className="media-grid">
        {visible.map((p, i) => (
          <Link className="grid-card photo-card" to={`/media/${p._id}`} key={p._id || i}>
            <img src={p.mediaUrl} alt={p.title} />
            <p className="grid-card-title">{p.title}</p>
          </Link>
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

const AudioSection = ({ items }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">Listen</span>
      <h2 className="display">Audio</h2>
      <p className="section-intro">Hymns and sermon recordings you can listen to anytime.</p>
      <div className="media-grid">
        {visible.map((t, i) => (
          <Link className="grid-card audio-card" to={`/media/${t._id}`} key={t._id || i}>
            <div className="audio-play-btn" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <p className="grid-card-title">{t.title}</p>
            <p className="audio-artist">{t.description}</p>
          </Link>
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

const BookSection = ({ items }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">Read</span>
      <h2 className="display">Books and PDFs</h2>
      <p className="section-intro">Study guides, booklets, and reading materials to download or read online.</p>
      <div className="media-grid">
        {visible.map((b, i) => (
          <Link className="grid-card book-card" to={`/media/${b._id}`} key={b._id || i}>
            <div className="book-cover">
              {b.thumbnail ? (
                <img src={b.thumbnail} alt={b.title} />
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z" />
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                </svg>
              )}
            </div>
            <p className="grid-card-title">{b.title}</p>
            <p className="book-meta">{b.description}</p>
          </Link>
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
  const [bookItems, setBookItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const [videoRes, photoRes, audioRes, bookRes] = await Promise.all([
        API.get("/media/type/video"),
        API.get("/media/type/photo"),
        API.get("/media/type/audio"),
        API.get("/media/type/document"),
      ]);

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
      setBookItems(mapItems(bookRes.data));
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
          <h1 className="display">Video, Photos, Audio and Books</h1>
          <p>Everything to watch, look back on, listen to, and read - all in one place.</p>
        </div>
      </section>

      <section className="media-sections">
        <div className="wrapper">
          {loading && <p style={{ textAlign: "center" }}>Loading media...</p>}
          {!loading && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}
          {!loading && !error && videoItems.length === 0 && photoItems.length === 0 && audioItems.length === 0 && bookItems.length === 0 && (
            <p style={{ textAlign: "center" }}>No media found.</p>
          )}
          {!loading && !error && (
            <>
              <VideoSection items={videoItems} />
              <PhotoSection items={photoItems} />
              <AudioSection items={audioItems} />
              <BookSection items={bookItems} />
            </>
          )}
        </div>
      </section>

     
    </div>
  );
};

export default Media;