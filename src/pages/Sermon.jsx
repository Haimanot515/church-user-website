import React, { useEffect, useRef, useState } from "react";
import API from "../api/api";
import "./Sermon.css";

/**
 * Sermons are now fetched from the Media API (`/media/type/video`,
 * same endpoint the public Media page uses) instead of a hardcoded
 * YouTube list. Each media doc's uploaded file is played with a plain
 * HTML5 <video> element rather than the YouTube iframe API — there's no
 * YouTube video ID for self-hosted uploads.
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
  const videoRef = useRef(null);
  const videoHeroRef = useRef(null);
  const seekBarRef = useRef(null);

  const [sermons, setSermons] = useState([]);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const [error, setError] = useState("");

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

  const currentSermon = sermons[sermonIndex];

  // Fetch sermon videos from the Media API on mount
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoadingSermons(true);
        const res = await API.get("/media/type/video");
        const items = res.data
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
        setSermons(items);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load sermons");
      } finally {
        setLoadingSermons(false);
      }
    };
    fetchSermons();
  }, []);

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

  const campuses = [
    {
      name: "Harbor Light — Downtown",
      role: "Lead Pastor",
      address: "214 Wharf Street, Addis Ababa",
      service: "Sundays · 9:00 & 11:00 AM",
      img: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80",
      alt: "Downtown church sanctuary filled with light"
    },
    {
      name: "Harbor Light — Eastside",
      role: "Preaching Pastor, 2nd Sunday",
      address: "88 Founders Road, Addis Ababa",
      service: "Sundays · 10:00 AM",
      img: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=900&q=80",
      alt: "Small chapel with wooden pews"
    },
    {
      name: "Harbor Light — Riverside",
      role: "Founding Pastor",
      address: "12 Mill Lane, Addis Ababa",
      service: "Sundays · 8:30 AM",
      img: "https://images.unsplash.com/photo-1465378552210-6900a2e5a4c0?auto=format&fit=crop&w=900&q=80",
      alt: "Riverside chapel exterior at dusk"
    }
  ];

  return (
    <div className="shepherd-page">
      <section className={`video-hero${expanded ? " expanded" : ""}`} ref={videoHeroRef}>
        {loadingSermons ? (
          <div className="video-closed-panel">
            <span className="eyebrow">Loading sermons...</span>
          </div>
        ) : error ? (
          <div className="video-closed-panel">
            <span className="eyebrow" style={{ color: "#f87171" }}>{error}</span>
          </div>
        ) : sermons.length === 0 ? (
          <div className="video-closed-panel">
            <span className="eyebrow">No sermons in this category yet</span>
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
              aria-label={videoClosed ? "Play video" : "Pause video"}
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
                  aria-label="Previous sermon"
                  disabled={!ready}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="nav-arrow next"
                  onClick={(e) => { e.stopPropagation(); goToSermon(sermonIndex + 1); }}
                  aria-label="Next sermon"
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
                  aria-label={expanded ? "Narrow video" : "Widen video"}
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

                <button className="mute-btn" onClick={(e) => { e.stopPropagation(); toggleMute(); }} aria-label={muted ? "Unmute video" : "Mute video"} disabled={!ready}>
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
         
          <h1 className="display">Preaching the Word, wherever the church gathers</h1>
          <p>Priest James Whitfield brings the same message across three congregations each week — this is what it looks like to shepherd more than one flock.</p>
         
        </div>
      </section>

      <section className="sermons-section">
        <div className="wrapper">
          <div className="sermons-head">
            <h2 className="display">Catch up on past sermons</h2>
          </div>

          {loadingSermons && <p style={{ textAlign: "center" }}>Loading sermons...</p>}
          {!loadingSermons && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}
          {!loadingSermons && !error && sermons.length === 0 && (
            <p style={{ textAlign: "center" }}>No sermons found.</p>
          )}

          {!loadingSermons && !error && sermons.length > 0 && (
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
                    {i === sermonIndex && !videoClosed && <div className="sermon-now-playing">Now Playing</div>}
                    <h3>{s.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="campuses-section">
        <div className="wrapper">
          <div className="campuses-head">
            <h2 className="display">The churches I serve</h2>
            <p>Every Sunday, Priest James moves between three congregations — each with its own rhythm, but the same commitment to the Word.</p>
          </div>

          <div className="campus-grid">
            {campuses.map((c) => (
              <div className="campus-card" key={c.name}>
                <img src={c.img} alt={c.alt} />
                <div className="campus-card-body">
                  <div className="campus-role">{c.role}</div>
                  <h3>{c.name}</h3>
                  <div className="campus-line"><strong>Address:</strong> {c.address}</div>
                  <div className="campus-line"><strong>Service:</strong> {c.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermon;