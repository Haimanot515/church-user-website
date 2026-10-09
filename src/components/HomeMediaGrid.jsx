import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import { Rich, stripHtml } from "./RichTextView";
import Spinner from "./Spinner";
import useInView from "../hooks/useInView";

// Home-page grid for videos and audio.
// Shows the first set of items in a grid; the Next / Back arrows (same
// .photo-arrow buttons as the Photos section) move to the next / previous
// set. Everything else (heading, arrows, dots, colors) matches Photos.
//
// Usage:  <HomeMediaGrid type="video" />   <HomeMediaGrid type="audio" />

const getMediaUrl = (u) => {
  if (!u) return null;
  if (/^(https?:)?\/\//i.test(u) || /^(data|blob):/i.test(u)) return u;
  const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
  return `${base}${u.startsWith("/") ? u : `/uploads/${u}`}`;
};

const mapItems = (d) => {
  const arr = Array.isArray(d) ? d : d?.media || d?.items || d?.data || [];
  return arr
    .filter((m) => m.status !== "draft")
    .map((m) => ({
      ...m,
      mediaUrl: getMediaUrl(m.mediaUrl || m.url),
      thumbnail: getMediaUrl(m.thumbnail),
    }))
    .filter((m) => m.mediaUrl);
};

// Each set shows this many rows of cards.
const ROWS = 3;

// Cards per row: 3 on desktop, 2 on tablet, 1 on phones.
const getColumns = () => {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 700) return 2;
  return 1;
};

const useColumns = () => {
  const [cols, setCols] = useState(getColumns);
  useEffect(() => {
    const onResize = () => setCols(getColumns());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return cols;
};

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

const clamp = (extra) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  ...extra,
});

const HomeMediaGrid = ({ type = "video" }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAudio = type === "audio";
  const key = isAudio ? "home.audios" : "home.videos";
  const cols = useColumns();
  const [sectionRef, seen] = useInView();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Same behaviour as the Media page: play inline, one ⋮ menu open at a time.
  const [playingId, setPlayingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (openMenuId === null) return undefined;
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [openMenuId]);

  useEffect(() => {
    if (!seen) return undefined;
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/media/type/${type}`);
        const list = mapItems(res.data);
        const seen = new Set(list.map((m) => m.id));
        if (list.length === 0) try {
          const all = await API.get("/media");
          mapItems(all.data)
            .filter((m) => m.mediaType === type)
            .forEach((m) => {
              if (!seen.has(m.id)) { seen.add(m.id); list.push(m); }
            });
        } catch (e) { /* ignore */ }
        if (cancelled) return;
        setItems(list);
        setPage(0);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || t(`${key}.errorDefault`, `Failed to load ${type}s`));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, type, seen]);

  // One shared <audio> element, same player logic as the Media page.
  const audioRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  const fmt = (n) => {
    if (!Number.isFinite(n)) return "0:00";
    const m = Math.floor(n / 60);
    const sec = Math.floor(n % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };
  const togglePlay = (id, url) => {
    const el = audioRef.current;
    if (!el) return;
    if (activeId === id) {
      if (el.paused) el.play().catch(() => {});
      else el.pause();
    } else {
      setActiveId(id);
      setTime(0);
      setDur(0);
      el.src = url;
      el.load();
      el.play().catch(() => {});
    }
  };
  const stopAudio = () => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    setActiveId(null);
    setIsPlaying(false);
    setTime(0);
    setDur(0);
  };
  const seekAudio = (e) => {
    const el = audioRef.current;
    const v = Number(e.target.value);
    if (el) el.currentTime = v;
    setTime(v);
  };

  const perPage = cols * ROWS;
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, pageCount - 1);
  const visible = items.slice(safePage * perPage, safePage * perPage + perPage);

  const prev = () => pageCount > 1 && setPage((safePage - 1 + pageCount) % pageCount);
  const next = () => pageCount > 1 && setPage((safePage + 1) % pageCount);
  const open = (m) => m?.id && navigate(`/media/${m.id}`);

  // Video card — same look and behaviour as the Media page video grid.
  const renderVideoCard = (m, i) => {
    const id = m.id || i;
    const title = stripHtml(m.title);
    const isPlaying = playingId === id;
    return (
      <div
        key={id}
        style={{
          position: "relative", minWidth: 0, background: "#fff", border: "1px solid rgba(28,58,82,0.12)",
          borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 18px rgba(15,36,56,0.06)", width: "100%",
          textAlign: "left", colorScheme: "light",
        }}
      >
        {isPlaying ? (
          <video
            src={m.mediaUrl}
            controls
            autoPlay
            playsInline
            onEnded={() => setPlayingId(null)}
            style={{ width: "100%", aspectRatio: "16/9", display: "block", background: "#000" }}
          />
        ) : (
          <button
            type="button"
            aria-label={title}
            onClick={() => setPlayingId(id)}
            style={{ position: "relative", display: "block", width: "100%", border: "none", padding: 0, cursor: "pointer", background: "none" }}
          >
            {m.thumbnail ? (
              <img loading="lazy" decoding="async" src={m.thumbnail} alt={title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-deep) 100%)" }} />
            )}
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,36,56,0.35)", color: "#fff" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}

        <Link to={`/media/${m.id}`} style={{ color: "inherit", textDecoration: "none" }}>
          <p style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--navy-deep)", margin: 0, padding: "14px 16px", lineHeight: 1.35 }}>{title}</p>
        </Link>

        <button
          type="button"
          aria-label={t("media.common.moreOptions", "More options")}
          style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}
          onClick={(e) => { e.stopPropagation(); setOpenMenuId((cur) => (cur === id ? null : id)); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" />
          </svg>
        </button>
        {openMenuId === id && (
          <div
            style={{ position: "absolute", top: 42, right: 8, background: "#fff", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.18)", overflow: "hidden", zIndex: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", border: "none", background: "transparent", color: "#222", fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap" }}
              onClick={() => { handleDownload(m.mediaUrl, title); setOpenMenuId(null); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" />
              </svg>
              {t("media.common.download", "Download")}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Audio card — same look and behaviour as the Media page audio grid.
  const renderCard = (m, i) => {
    const id = m.id || i;
    const title = stripHtml(m.title);
    const active = activeId === id;
    const playingNow = active && isPlaying;
    return (
      <div
        key={id}
        style={{
          position: "relative", minWidth: 0, background: "#7a1414", border: "1px solid #7a1414",
          borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 18px rgba(15,36,56,0.06)", width: "100%",
          padding: "22px 18px 18px 18px", boxSizing: "border-box", textAlign: "center", colorScheme: "light",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button
            type="button"
            aria-label={playingNow ? t("media.audio.pause", "Pause") : t("media.audio.play", "Play")}
            onClick={() => togglePlay(id, m.mediaUrl)}
            style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold)", color: "var(--navy-deep)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            {playingNow ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          {active && (
            <button
              type="button"
              aria-label={t("media.audio.close", "Close player")}
              onClick={stopAudio}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
            </button>
          )}
        </div>

        {active && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
            <input
              type="range"
              min="0"
              max={Number.isFinite(dur) && dur > 0 ? dur : 0}
              step="0.1"
              value={Number.isFinite(time) ? time : 0}
              onChange={seekAudio}
              aria-label={t("common.seek")}
              style={{ width: "100%", accentColor: "var(--gold, #cf9f3f)", cursor: "pointer" }}
            />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.85)", fontFamily: "'IBM Plex Mono', monospace", textAlign: "center" }}>{fmt(time)} / {fmt(dur)}</span>
          </div>
        )}

        <Link to={`/media/${m.id}`} style={{ color: "inherit", textDecoration: "none" }}>
          <p style={{ fontSize: "0.98rem", fontWeight: 700, color: "#ffffff", margin: 0, padding: "14px 0 4px 0", lineHeight: 1.35, textAlign: "center" }}>{title}</p>
        </Link>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.78)", margin: 0, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace" }}>{stripHtml(m.description)}</p>

        <button
          type="button"
          aria-label={t("media.common.moreOptions", "More options")}
          style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}
          onClick={(e) => { e.stopPropagation(); setOpenMenuId((cur) => (cur === id ? null : id)); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" />
          </svg>
        </button>
        {openMenuId === id && (
          <div
            style={{ position: "absolute", top: 42, right: 8, background: "#fff", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.18)", overflow: "hidden", zIndex: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", border: "none", background: "transparent", color: "#222", fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap" }}
              onClick={() => { handleDownload(m.mediaUrl, title); setOpenMenuId(null); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" />
              </svg>
              {t("media.common.download", "Download")}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section ref={sectionRef} style={{ background: "#ffffff", position: "relative", overflow: "hidden" }}>
      <div className="wrapper photo-wrapper" style={{ maxWidth: "1200px" }}>
        <h3 className="display" style={{ marginBottom: "44px", fontSize: "2.8rem", fontWeight: 700, textAlign: "center", color: "var(--navy-deep)" }}>
          {t(`${key}.heading`, isAudio ? "Audio" : "Videos")}
        </h3>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {loading ? (
          seen ? <Spinner /> : <div style={{ minHeight: 360 }} />
        ) : items.length === 0 ? (
          <p style={{ textAlign: "center" }}>{t(`${key}.none`, isAudio ? "No audio found." : "No videos found.")}</p>
        ) : (
          <div className="photo-carousel">
            <div className="photo-carousel-frame">
              {isAudio && (
                <audio
                  ref={audioRef}
                  preload="none"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={stopAudio}
                  onTimeUpdate={(e) => setTime(e.target.currentTime)}
                  onLoadedMetadata={(e) => setDur(e.target.duration)}
                  onDurationChange={(e) => setDur(e.target.duration)}
                />
              )}
              <div className="photo-image-wrap" style={{ position: "relative" }}>
                <button type="button" className="photo-arrow left" aria-label={t(`${key}.prevAriaLabel`, "Previous")} onClick={prev} disabled={pageCount < 2}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div
                  style={{
                    flex: 1, minWidth: 0, position: "relative", zIndex: 1, width: "100%",
                    display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    gap: cols === 3 ? "44px" : cols === 2 ? "32px" : "24px",
                    alignItems: "start",
                  }}
                >
                  {visible.map((m, i) => (isAudio ? renderCard(m, i) : renderVideoCard(m, i)))}
                </div>

                <button type="button" className="photo-arrow right" aria-label={t(`${key}.nextAriaLabel`, "Next")} onClick={next} disabled={pageCount < 2}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <p style={{ textAlign: "center", margin: "26px 0 0", fontSize: "14px", color: "#666" }}>{safePage + 1} / {pageCount}</p>
              <div className="photo-dots">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <span key={i} className={`photo-dot${i === safePage ? " active" : ""}`} onClick={() => setPage(i)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeMediaGrid;
