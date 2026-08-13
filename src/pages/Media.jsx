import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import "./Media.css";

/**
 * Media page — one page, four sections, each laid out as a
 * functional 3-item grid, fetched from the backend (same API client
 * used in CreateMedia.jsx):
 *  1. Video  — grid of cards; click the play button to play inline,
 *              click the title to go to its detail page
 *  2. Photos — grid of cards; click a card to go to its detail page
 *  3. Audio  — grid of cards; click the play button to play inline,
 *              click the title to go to its detail page
 *  4. Books/PDFs — grid of cards; click a card to go to its detail page
 *
 * Video/Audio cards play inline where they are when the play button
 * is clicked. Clicking the title still redirects to /media/:id
 * (MediaDetail.jsx). Photo/Book cards are unchanged — the whole card
 * redirects to /media/:id.
 *
 * Each section shows 10 items at a time with its own "Load More" button
 * that reveals 10 more, and only appears once that section has more
 * than 10 items.
 *
 * Each of the four media types follows the same Accept-Language
 * fallback pattern used elsewhere on the site (Services, Church,
 * Sermon): try the active language first, and if that type comes back
 * empty, retry just that type with an explicit "en" header and flag
 * it so its section can show a small notice.
 *
 * Same outer shell as Home/Services (cloud layer, footer).
 * Styles live in Media.css (imported above).
 *
 * NEW: while the initial fetch is in flight, this shows the same
 * circular loading spinner used on Home.jsx instead of any hardcoded
 * placeholder text/content, so nothing but real backend data is ever
 * shown to the user.
 *
 * FIX: video playback now happens inline within the card (same
 * pattern as audio) instead of a fixed fullscreen overlay, so
 * clicking play no longer "widens"/takes over the screen — it plays
 * right where the thumbnail was, same footprint.
 *
 * FIX: audio cards now use the same three-dot (⋮) menu pattern as
 * video cards for downloading, replacing the old separate inline
 * download link/button.
 */
const PAGE_SIZE = 10;

const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;
  const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/uploads/${mediaUrl}`;
  return `${base}${path}`;
};

// Forces a real file download instead of the browser navigating to /
// opening the file. Using the `download` attribute on an <a> only
// works when the file is same-origin; since media files are usually
// served from a different host/CDN, we fetch the bytes as a blob and
// download from that instead, which works regardless of origin.
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
    // Fallback: if fetching as a blob fails (e.g. CORS blocked at the
    // network level), open the file in a new tab so the user can at
    // least save it manually from there.
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

const mapItems = (data) =>
  (data || [])
    .filter((m) => m.status === "published")
    .map((m) => ({
      ...m,
      mediaUrl: getMediaUrl(m.mediaUrl),
      thumbnail: getMediaUrl(m.thumbnail),
    }));

// Reusable inline loading spinner — same markup/classes as Home.jsx's
// Spinner, shown while data is being fetched from the backend so the
// user never sees hardcoded frontend placeholder content before the
// real data arrives.
const Spinner = ({ light }) => (
  <div className="loading-spinner-wrap">
    <div className={`loading-spinner${light ? " light" : ""}`} />
  </div>
);

const VideoSection = ({ items, fallback, t }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Tracks which video is currently playing inline (by id), so the
  // play button plays the video right where it is instead of
  // navigating away or taking over the screen.
  const [playingId, setPlayingId] = useState(null);
  // Tracks which card's three-dot (⋮) menu is currently open, so only
  // one menu shows at a time.
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close any open menu when clicking anywhere else on the page.
  useEffect(() => {
    if (openMenuId === null) return undefined;
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [openMenuId]);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">{t("media.video.eyebrow")}</span>
      <h2 className="display">{t("media.video.title")}</h2>
      <p className="section-intro">{t("media.video.intro")}</p>
      {fallback && (
        <p style={{ fontSize: "0.85rem", color: "#888" }}>{t("media.common.fallbackNotice")}</p>
      )}
      <div className="media-grid">
        {visible.map((v, i) => {
          const id = v._id || i;
          const isPlaying = playingId === id;
          return (
            <div className="grid-card video-card" style={{ position: "relative" }} key={id}>
              {isPlaying ? (
                <video
                  className="video-thumb-btn"
                  src={v.mediaUrl}
                  controls
                  autoPlay
                  onEnded={() => setPlayingId(null)}
                />
              ) : (
                <button
                  type="button"
                  className="video-thumb-btn"
                  aria-label={t("media.video.openAria", { title: v.title })}
                  onClick={() => setPlayingId(id)}
                >
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} />
                  ) : (
                    <div className="video-thumb-placeholder" />
                  )}
                  <span className="play-overlay">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </button>
              )}
              <Link to={`/media/${v._id}`}>
                <p className="grid-card-title">{v.title}</p>
              </Link>
              <button
                type="button"
                className="video-menu-btn"
                aria-label={t("media.common.moreOptions")}
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
                  setOpenMenuId((cur) => (cur === id ? null : id));
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="12" cy="19" r="1.7" />
                </svg>
              </button>
              {openMenuId === id && (
                <div
                  className="video-menu-dropdown"
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
                    className="video-menu-item"
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
                      handleDownload(v.mediaUrl, v.title);
                      setOpenMenuId(null);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3v12" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    {t("media.common.download")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {items.length > visibleCount && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            {t("media.common.loadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

const PhotoSection = ({ items, fallback, t }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">{t("media.photo.eyebrow")}</span>
      <h2 className="display">{t("media.photo.title")}</h2>
      <p className="section-intro">{t("media.photo.intro")}</p>
      {fallback && (
        <p style={{ fontSize: "0.85rem", color: "#888" }}>{t("media.common.fallbackNotice")}</p>
      )}
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
            {t("media.common.loadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

const AudioSection = ({ items, fallback, t }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Tracks which audio track is currently playing inline (by id), so
  // the play button plays the audio right where it is instead of
  // navigating away.
  const [playingId, setPlayingId] = useState(null);
  // Tracks which card's three-dot (⋮) menu is currently open, so only
  // one menu shows at a time — same pattern as VideoSection.
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close any open menu when clicking anywhere else on the page.
  useEffect(() => {
    if (openMenuId === null) return undefined;
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [openMenuId]);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">{t("media.audio.eyebrow")}</span>
      <h2 className="display">{t("media.audio.title")}</h2>
      <p className="section-intro">{t("media.audio.intro")}</p>
      {fallback && (
        <p style={{ fontSize: "0.85rem", color: "#888" }}>{t("media.common.fallbackNotice")}</p>
      )}
      <div className="media-grid">
        {visible.map((a, i) => {
          const id = a._id || i;
          const isPlaying = playingId === id;
          return (
            <div className="grid-card audio-card" style={{ position: "relative" }} key={id}>
              {isPlaying ? (
                <audio
                  className="audio-play-btn"
                  src={a.mediaUrl}
                  controls
                  autoPlay
                  onEnded={() => setPlayingId(null)}
                />
              ) : (
                <button
                  type="button"
                  className="audio-play-btn"
                  aria-label={t("media.video.openAria", { title: a.title })}
                  onClick={() => setPlayingId(id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </button>
              )}
              <Link to={`/media/${a._id}`}>
                <p className="grid-card-title">{a.title}</p>
              </Link>
              <p className="audio-artist">{a.description}</p>
              <button
                type="button"
                className="audio-menu-btn"
                aria-label={t("media.common.moreOptions")}
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
                  setOpenMenuId((cur) => (cur === id ? null : id));
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="12" cy="19" r="1.7" />
                </svg>
              </button>
              {openMenuId === id && (
                <div
                  className="audio-menu-dropdown"
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
                    className="audio-menu-item"
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
                      handleDownload(a.mediaUrl, a.title);
                      setOpenMenuId(null);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3v12" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    {t("media.common.download")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {items.length > visibleCount && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            {t("media.common.loadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

const BookSection = ({ items, fallback, t }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;
  const visible = items.slice(0, visibleCount);

  return (
    <div className="media-section">
      <span className="eyebrow">{t("media.book.eyebrow")}</span>
      <h2 className="display">{t("media.book.title")}</h2>
      <p className="section-intro">{t("media.book.intro")}</p>
      {fallback && (
        <p style={{ fontSize: "0.85rem", color: "#888" }}>{t("media.common.fallbackNotice")}</p>
      )}
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
            {t("media.common.loadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

const Media = () => {
  const { t } = useTranslation();

  const [videoItems, setVideoItems] = useState([]);
  const [photoItems, setPhotoItems] = useState([]);
  const [audioItems, setAudioItems] = useState([]);
  const [bookItems, setBookItems] = useState([]);

  const [videoFallback, setVideoFallback] = useState(false);
  const [photoFallback, setPhotoFallback] = useState(false);
  const [audioFallback, setAudioFallback] = useState(false);
  const [bookFallback, setBookFallback] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches one media type, and if the active-language response comes
  // back with no published items, retries the same endpoint with an
  // explicit "en" header. Returns { items, usedFallback }.
  const fetchTypeWithFallback = async (type) => {
    let res = await API.get(`/media/type/${type}`);
    let items = mapItems(res.data);

    if (items.length === 0) {
      res = await API.get(`/media/type/${type}`, {
        headers: { "Accept-Language": "en" },
      });
      items = mapItems(res.data);
      if (items.length > 0) return { items, usedFallback: true };
    }

    return { items, usedFallback: false };
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const [video, photo, audio, book] = await Promise.all([
        fetchTypeWithFallback("video"),
        fetchTypeWithFallback("photo"),
        fetchTypeWithFallback("audio"),
        fetchTypeWithFallback("document"),
      ]);

      setVideoItems(video.items);
      setVideoFallback(video.usedFallback);

      setPhotoItems(photo.items);
      setPhotoFallback(photo.usedFallback);

      setAudioItems(audio.items);
      setAudioFallback(audio.usedFallback);

      setBookItems(book.items);
      setBookFallback(book.usedFallback);
    } catch (err) {
      setError(err.response?.data?.message || t("media.errors.mediaDefault"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return (
    <div className="media-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <section className="media-hero">
        <div className="wrapper">
          <span className="eyebrow">{t("media.hero.eyebrow")}</span>
          <h1 className="display">{t("media.hero.title")}</h1>
          <p>{t("media.hero.description")}</p>
        </div>
      </section>

      <section className="media-sections">
        <div className="wrapper">
          {/* NEW: circular spinner (same as Home.jsx) while the initial
              fetch is in flight — replaces the old plain-text
              "Loading..." message, no placeholder content shown. */}
          {loading && <Spinner />}
          {!loading && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}
          {!loading && !error && videoItems.length === 0 && photoItems.length === 0 && audioItems.length === 0 && bookItems.length === 0 && (
            <p style={{ textAlign: "center" }}>{t("media.common.none")}</p>
          )}
          {!loading && !error && (
            <>
              <VideoSection items={videoItems} fallback={videoFallback} t={t} />
              <PhotoSection items={photoItems} fallback={photoFallback} t={t} />
              <AudioSection items={audioItems} fallback={audioFallback} t={t} />
              <BookSection items={bookItems} fallback={bookFallback} t={t} />
            </>
          )}
        </div>
      </section>


    </div>
  );
};

export default Media;