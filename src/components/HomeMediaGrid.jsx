import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import { Rich, stripHtml } from "./RichTextView";
import Spinner from "./Spinner";
import useInView from "../hooks/useInView";
import "./HomeMediaGrid.css";

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
      mediaUrl: getMediaUrl(m.mediaUrl || m.url || m.image || m.imageUrl),
      thumbnail: getMediaUrl(m.thumbnail),
    }))
    .filter((m) => m.mediaUrl);
};

const ROWS = 3;

const getColumns = () => {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 700) return 2;
  return 1;
};

const getVideoColumns = () => {
  if (typeof document === "undefined") return 3;
  const vw = document.documentElement.clientWidth;
  const pad = vw <= 600 ? 16 : vw <= 1024 ? 28 : 48;
  const gap = vw <= 600 ? 24 : vw <= 1024 ? 32 : 44;
  return Math.max(1, Math.floor((vw - pad * 2 + gap) / (340 + gap)));
};

const useColumns = (isAudio) => {
  const read = isAudio ? getColumns : getVideoColumns;
  const [cols, setCols] = useState(read);
  useEffect(() => {
    const onResize = () => setCols(read());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [read]);
  return cols;
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
  const isPhoto = type === "photo";
  const key = isAudio ? "home.audios" : isPhoto ? "home.photos" : "home.videos";
  const cols = useColumns(isAudio);
  const [sectionRef, seen] = useInView();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingId, setPlayingId] = useState(null);

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
        const addMore = (arr) => arr.forEach((m) => {
          if (!seen.has(m.id)) { seen.add(m.id); list.push(m); }
        });
        const minItems = isPhoto ? 2 : 1;
        if (list.length < minItems) try {
          const all = await API.get("/media");
          addMore(mapItems(all.data).filter((m) => m.mediaType === type));
        } catch (e) { }
        if (isPhoto && list.length < minItems) {
          const others = await Promise.all(["en", "am", "it"].map((l) =>
            API.get(`/media/type/${type}`, { headers: { "Accept-Language": l } })
              .then((r) => mapItems(r.data)).catch(() => [])));
          addMore(others.flat());
        }
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
  }, [i18n.language, type, seen]);

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

  const open = (m) => m?.id && navigate(`/media/${m.id}`);

  const renderVideoCard = (m, i) => {
    const id = m.id || i;
    const title = stripHtml(m.title);
    const isPlaying = playingId === id;
    return (
      <div key={id} className={`hm-card${isPlaying ? " active" : ""}`}>
        {isPlaying ? (
          <div className="hm-thumb-wrap">
            <video src={m.mediaUrl} controls autoPlay playsInline onEnded={() => setPlayingId(null)} />
          </div>
        ) : (
          <button type="button" className="hm-card-btn" aria-label={title} onClick={() => setPlayingId(id)}>
            <div className="hm-thumb-wrap">
              {m.thumbnail ? (
                <img loading="lazy" decoding="async" src={m.thumbnail} alt={title} />
              ) : (
                <div className="hm-thumb-fallback" />
              )}
              <div className="hm-play-badge">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.4" opacity="0.85" /><path d="M10 8.5L16 12L10 15.5V8.5Z" fill="currentColor" /></svg>
              </div>
            </div>
          </button>
        )}
        <Link to={`/media/${m.id}`} className="hm-card-body">
          {isPlaying && <div className="hm-now-playing">{t("sermon.sermons.nowPlaying", "Now playing")}</div>}
          <h3>{title}</h3>
        </Link>
      </div>
    );
  };

  const renderPhotoCard = (m, i) => {
    const id = m.id || i;
    const title = stripHtml(m.title);
    return (
      <Link key={id} to={`/media/${m.id}`} className="hm-card hm-photo-card">
        <div className="hm-thumb-wrap">
          <img loading="lazy" decoding="async" src={m.mediaUrl} alt={title} />
        </div>
        <div className="hm-card-body">
          <h3>{title}</h3>
        </div>
      </Link>
    );
  };

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
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className={isAudio ? "hm-audio-section" : `hm-video-section${isPhoto ? " hm-photo-section" : ""}`}
      style={isAudio ? { position: "relative", overflow: "hidden" } : undefined}
    >
      <div className={isAudio ? "wrapper photo-wrapper" : "hm-video-wrapper"} style={isAudio ? { maxWidth: "1200px" } : undefined}>
        <h3 className="display" style={{ marginBottom: "44px", fontSize: "2.8rem", fontWeight: 700, textAlign: "center", color: "var(--navy-deep)" }}>
          {t(`${key}.heading`, isAudio ? "Audio" : isPhoto ? "Photos" : "Videos")}
        </h3>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {loading ? (
          seen ? <Spinner /> : <div style={{ minHeight: 360 }} />
        ) : items.length === 0 ? (
          <p style={{ textAlign: "center" }}>{t(`${key}.none`, isAudio ? "No audio found." : isPhoto ? "No photos found." : "No videos found.")}</p>
        ) : !isAudio ? (
          <>
            <div className="hm-grid">{visible.map((m, i) => (isPhoto ? renderPhotoCard(m, i) : renderVideoCard(m, i)))}</div>
            <div className="hm-more-wrap">
              <Link to="/media" className="load-more-btn">{t(`${key}.more`, "More")}</Link>
            </div>
          </>
        ) : (
          <>
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
            <div
              style={{
                display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: cols === 3 ? "44px" : cols === 2 ? "32px" : "24px",
                alignItems: "start",
              }}
            >
              {visible.map((m, i) => renderCard(m, i))}
            </div>
            <div className="hm-more-wrap">
              <Link to="/media" className="load-more-btn">{t(`${key}.more`, "More")}</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HomeMediaGrid;
