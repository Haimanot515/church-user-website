import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import "./Sermon.css";

/**
 * Sermons are now fetched from the Media API (`/media/type/video`,
 * same endpoint the public Media page uses) instead of a hardcoded
 * YouTube list. Each media doc's uploaded file is played with a plain
 * HTML5 <video> element rather than the YouTube iframe API — there's no
 * YouTube video ID for self-hosted uploads.
 *
 * Both the sermons list and the campuses list follow the same
 * Accept-Language fallback pattern used elsewhere on the site
 * (Services, Church, Blog, Travel, About): try the active language
 * first, and if it comes back empty, retry with an explicit "en"
 * header and flag it so the UI can show a small notice.
 */

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Turns whatever the API sends back for a media file (a full URL, or just a
// filename/relative path saved from an upload) into a usable src.
const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl; // already a full URL
  const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/uploads/${mediaUrl}`;
  return `${base}${path}`;
};

// Only show videos tagged with this category — other video-type media
// (e.g. worship clips, testimonies) won't show up on the Sermons page.
// NOTE: `category` on the Media schema is a ref to the Category model, so
// this assumes your GET /media/type/video route populates it (e.g.
// `.populate("category", "name")`) so each item has `category.name`.
const SERMON_CATEGORY = "Sermons";

const Sermon = () => {
  const { t } = useTranslation();

  const videoRef = useRef(null);
  const videoHeroRef = useRef(null);
  const seekBarRef = useRef(null);

  const [sermons, setSermons] = useState([]);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const [error, setError] = useState("");
  const [sermonsFallback, setSermonsFallback] = useState(false);

  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [videoClosed, setVideoClosed] = useState(false);
  const [sermonIndex, setSermonIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  // Whether the video hero is shown in its "widened" (taller) layout or
  // the default "narrow" layout. Toggled from the expand/collapse icon.
  const [expanded, setExpanded] = useState(false);

  // --- "The churches I serve": GET /churches (Church table) ---
  const [campuses, setCampuses] = useState([]);
  const [campusesLoading, setCampusesLoading] = useState(true);
  const [campusesError, setCampusesError] = useState("");
  const [campusesFallback, setCampusesFallback] = useState(false);

  // Reusable inline loading spinner — shown while a section's data is
  // being fetched from the backend, so no hardcoded frontend placeholder
  // content is ever visible before the real data arrives. Same
  // markup/classes as Home.jsx's Spinner, so it renders identically.
  const Spinner = ({ light }) => (
    <div className="loading-spinner-wrap">
      <div className={`loading-spinner${light ? " light" : ""}`} />
    </div>
  );

  const currentSermon = sermons[sermonIndex];

  const filterSermons = (data) =>
    (data || [])
      .filter((m) => m.status === "published")
      .filter((m) => {
        const categoryName = typeof m.category === "string" ? m.category : m.category?.name;
        return (categoryName || "").toLowerCase() === SERMON_CATEGORY.toLowerCase();
      })
      .map((m) => ({
        ...m,
        mediaUrl: getMediaUrl(m.mediaUrl),
        thumbnail: getMediaUrl(m.thumbnail),
      }));

  // Fetch sermon videos from the Media API on mount (and whenever the
  // active language changes, so titles/descriptions come back localized).
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoadingSermons(true);
        setError("");
        setSermonsFallback(false);

        let res = await API.get("/media/type/video");
        let items = filterSermons(res.data);

        if (items.length === 0) {
          res = await API.get("/media/type/video", {
            headers: { "Accept-Language": "en" },
          });
          items = filterSermons(res.data);
          if (items.length > 0) setSermonsFallback(true);
        }

        setSermons(items);
      } catch (err) {
        setError(err.response?.data?.message || t("sermon.errors.sermonsDefault"));
      } finally {
        setLoadingSermons(false);
      }
    };
    fetchSermons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // Fetch churches from the Church table on mount (and on language change)
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        setCampusesLoading(true);
        setCampusesError("");
        setCampusesFallback(false);

        let res = await API.get("/churches");
        let data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          res = await API.get("/churches", {
            headers: { "Accept-Language": "en" },
          });
          data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) setCampusesFallback(true);
        }

        setCampuses(data);
      } catch (err) {
        setCampusesError(err.response?.data?.message || t("sermon.errors.campusesDefault"));
      } finally {
        setCampusesLoading(false);
      }
    };
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // Autoplay (muted) whenever the current sermon changes, as long as the panel is open
  useEffect(() => {
    const el = videoRef.current;
    if (!el || videoClosed || !currentSermon) return;
    setReady(false);
    setCurrentTime(0);
    setDuration(0);
    el.muted = muted;
    el.load();
    const playPromise = el.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sermonIndex, videoClosed, currentSermon]);

  const handleLoadedMetadata = () => {
    const el = videoRef.current;
    if (!el) return;
    setReady(true);
    setDuration(el.duration);
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime);
  };

  // Jump playback to wherever the person clicks on the progress track.
  const handleSeek = (e) => {
    const el = videoRef.current;
    const bar = seekBarRef.current;
    if (!el || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const nextTime = ratio * duration;
    el.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const goToSermon = (nextIndex) => {
    if (sermons.length === 0) return;
    const wrapped = (nextIndex + sermons.length) % sermons.length;
    setSermonIndex(wrapped);
  };

  const closeVideo = () => {
    const el = videoRef.current;
    if (el) el.pause();
    setVideoClosed(true);
  };

  const reopenVideo = () => {
    setVideoClosed(false);
  };

  const toggleVideo = () => {
    if (videoClosed) {
      reopenVideo();
    } else {
      closeVideo();
    }
  };

  const toggleControls = () => {
    setShowControls((v) => !v);
  };

  // Widen/narrow the video hero. Purely a layout toggle — doesn't touch
  // playback state.
  const toggleExpand = () => {
    setExpanded((v) => !v);
  };

  const selectSermonFromGrid = (index) => {
    setSermonIndex(index);
    if (videoClosed) setVideoClosed(false);
    if (videoHeroRef.current) {
      videoHeroRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="shepherd-page">
      <section className={`video-hero${expanded ? " expanded" : ""}`} ref={videoHeroRef}>
        {loadingSermons ? (
          <div className="video-closed-panel">
            <Spinner light />
          </div>
        ) : error ? (
          <div className="video-closed-panel">
            <span className="eyebrow" style={{ color: "#f87171" }}>{error}</span>
          </div>
        ) : sermons.length === 0 ? (
          <div className="video-closed-panel">
            <span className="eyebrow">{t("sermon.videoHero.empty")}</span>
          </div>
        ) : (
          <>
            {/* The video element (and its current frame) now stays mounted
                and visible whether playing or closed/paused — closing no
                longer swaps it out for a blank panel. Only the controls
                around it change. */}
            <div className="yt-bg-wrap">
              <video
                ref={videoRef}
                src={currentSermon?.mediaUrl}
                muted={muted}
                loop
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
              />
            </div>
            <div
              className="tap-catcher"
              onClick={videoClosed ? toggleVideo : toggleControls}
            />

            {/* Big centered play/pause toggle. While playing, it fades
                in/out together with the rest of the controls (tap the
                empty area to reveal it). While paused/closed it stays on
                screen over the still-visible last frame so the video can
                always be resumed with one click. */}
            <button
              className={`center-toggle-btn${(showControls || videoClosed) ? " visible" : ""}`}
              onClick={(e) => { e.stopPropagation(); toggleVideo(); }}
              aria-label={videoClosed ? t("sermon.videoHero.playAria") : t("sermon.videoHero.pauseAria")}
            >
              {videoClosed ? (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              )}
            </button>

            <div className={`controls-overlay${(showControls || videoClosed) ? " visible" : ""}`} onClick={videoClosed ? toggleVideo : toggleControls}>
                <button
                  className="nav-arrow prev"
                  onClick={(e) => { e.stopPropagation(); goToSermon(sermonIndex - 1); }}
                  aria-label={t("sermon.videoHero.prevAria")}
                  disabled={!ready}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="nav-arrow next"
                  onClick={(e) => { e.stopPropagation(); goToSermon(sermonIndex + 1); }}
                  aria-label={t("sermon.videoHero.nextAria")}
                  disabled={!ready}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                {/* Timer + progressive seek bar: shows elapsed/total time
                    and how far through the sermon playback currently is.
                    Click or drag anywhere on the track to jump there. */}
                <div className="progress-bar-row" onClick={(e) => e.stopPropagation()}>
                  <span className="time-label">{formatTime(currentTime)}</span>
                  <div
                    className="progress-bar-track"
                    ref={seekBarRef}
                    onClick={handleSeek}
                  >
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                    <div
                      className="progress-bar-handle"
                      style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="time-label">{formatTime(duration)}</span>
                </div>

                {/* Widen/narrow toggle for the video display area. Sits
                    top-right, always reachable while the controls overlay
                    is visible, and swaps its icon based on current state. */}
                <button
                  className="expand-btn"
                  onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
                  aria-label={expanded ? t("sermon.videoHero.narrowAria") : t("sermon.videoHero.widenAria")}
                  disabled={!ready}
                >
                  {expanded ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3H4V8M15 3H20V8M9 21H4V16M15 21H20V16M4 4L10 10M20 4L14 10M4 20L10 14M20 20L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 9V4H9M15 4H20V9M20 15V20H15M9 20H4V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                <button className="mute-btn" onClick={(e) => { e.stopPropagation(); toggleMute(); }} aria-label={muted ? t("sermon.videoHero.unmuteAria") : t("sermon.videoHero.muteAria")} disabled={!ready}>
                  {muted ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V15H8L13 20V4L8 9H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M17 8L21 16M21 8L17 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V15H8L13 20V4L8 9H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16.5 8.5C17.5 9.5 18 10.7 18 12C18 13.3 17.5 14.5 16.5 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  )}
                </button>
              </div>
          </>
        )}
      </section>

      <section className="hero-text-section">
        <div className="hero-text-inner">

          <h1 className="display">{t("sermon.heroText.title")}</h1>
          <p>{t("sermon.heroText.description")}</p>

        </div>
      </section>

      <section className="sermons-section">
        <div className="wrapper">
          <div className="sermons-head">
            <h2 className="display">{t("sermon.sermons.sectionTitle")}</h2>
          </div>

          {loadingSermons && <Spinner />}
          {!loadingSermons && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}
          {!loadingSermons && !error && sermons.length === 0 && (
            <p style={{ textAlign: "center" }}>{t("sermon.sermons.none")}</p>
          )}

          {!loadingSermons && !error && sermons.length > 0 && (
            <>
              {sermonsFallback && (
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "24px" }}>
                  {t("sermon.sermons.fallbackNotice")}
                </p>
              )}
              <div className="sermons-grid">
                {sermons.map((s, i) => (
                  <button
                    key={s._id || s.title}
                    className={`sermon-card${i === sermonIndex && !videoClosed ? " active" : ""}`}
                    onClick={() => selectSermonFromGrid(i)}
                  >
                    <div className="sermon-thumb-wrap">
                      {s.thumbnail ? (
                        <img src={s.thumbnail} alt={s.title} />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "16/9",
                            background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-deep) 100%)",
                          }}
                        />
                      )}
                      <div className="sermon-play-badge">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.4" opacity="0.85"/><path d="M10 8.5L16 12L10 15.5V8.5Z" fill="currentColor"/></svg>
                      </div>
                    </div>
                    <div className="sermon-card-body">
                      {i === sermonIndex && !videoClosed && (
                        <div className="sermon-now-playing">{t("sermon.sermons.nowPlaying")}</div>
                      )}
                      <h3>{s.title}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="campuses-section">
        <div className="wrapper">
          <div className="campuses-head">
            <h2 className="display">{t("sermon.campuses.sectionTitle")}</h2>
            <p>{t("sermon.campuses.description")}</p>
          </div>

          {campusesLoading ? (
            <Spinner />
          ) : campusesError ? (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{campusesError}</p>
          ) : campuses.length === 0 ? (
            <p style={{ textAlign: "center" }}>{t("sermon.campuses.none")}</p>
          ) : (
            <>
              {campusesFallback && (
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "24px" }}>
                  {t("sermon.campuses.fallbackNotice")}
                </p>
              )}
              <div className="campus-grid">
                {campuses.map((c) => (
                  <div className="campus-card" key={c._id}>
                    <img src={c.image || ""} alt={c.churchName} />
                    <div className="campus-card-body">
                      <div className="campus-role">
                        {c.isPrimary
                          ? t("sermon.campuses.tagPrimary")
                          : c.isFeatured
                          ? t("sermon.campuses.tagFeatured")
                          : ""}
                      </div>
                      <h3>{c.churchName}</h3>
                      <div className="campus-line">
                        <strong>{t("sermon.campuses.address")}</strong> {c.address}
                      </div>
                      <div className="campus-line">
                        <strong>{t("sermon.campuses.service")}</strong> {c.serviceDays} · {c.serviceTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sermon;