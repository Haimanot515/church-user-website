import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import { Rich } from "./RichTextView";

// Home-page carousel for videos and audio. Same frame, arrows, dots,
// title and description as the Photos section (it reuses the
// .photo-carousel / .photo-arrow / .photo-dots classes from Home.css).
//
// Usage:  <HomeMediaCarousel type="video" />   <HomeMediaCarousel type="audio" />

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

const MEDIA_BOX = {
  width: "100%",
  aspectRatio: "16/9",
  borderRadius: "8px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
};

const HomeMediaCarousel = ({ type = "video" }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const key = type === "audio" ? "home.audios" : "home.videos";
  const isAudio = type === "audio";

  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/media/type/${type}`);
        const list = mapItems(res.data);
        const seen = new Set(list.map((m) => m.id));
        try {
          const all = await API.get("/media");
          mapItems(all.data)
            .filter((m) => m.mediaType === type)
            .forEach((m) => { if (!seen.has(m.id)) { seen.add(m.id); list.push(m); } });
        } catch (e) { /* ignore */ }
        if (cancelled) return;
        setItems(list);
        setIndex(0);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || t(`${key}.errorDefault`, `Failed to load ${type}s`));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, type]);

  const prev = () => items.length > 1 && setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => items.length > 1 && setIndex((i) => (i + 1) % items.length);
  const current = items[index];
  const goToDetail = () => current?.id && navigate(`/media/${current.id}`);

  return (
    <section style={{ background: "#ffffff", position: "relative", overflow: "hidden" }}>
      <div className="wrapper photo-wrapper" style={{ maxWidth: "1000px" }}>
        <h3 className="display" style={{ marginBottom: "44px", fontSize: "2.8rem", fontWeight: 700, textAlign: "center", color: "var(--navy-deep)" }}>
          {t(`${key}.heading`, isAudio ? "Audio" : "Videos")}
        </h3>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {loading ? (
          <div className="loading-spinner-wrap"><div className="loading-spinner" /></div>
        ) : items.length === 0 ? (
          <p style={{ textAlign: "center" }}>{t(`${key}.none`, isAudio ? "No audio found." : "No videos found.")}</p>
        ) : (
          <div className="photo-carousel">
            <div className="photo-carousel-frame">
              <div className="photo-image-wrap" style={{ position: "relative" }}>
                <button type="button" className="photo-arrow left" aria-label={t(`${key}.prevAriaLabel`, "Previous")} onClick={prev} disabled={items.length < 2}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1, width: "100%" }}>
                  {isAudio ? (
                    <div
                      style={{
                        ...MEDIA_BOX,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: "0 5% 6%",
                        boxSizing: "border-box",
                        background: current.thumbnail
                          ? `center / cover no-repeat url("${current.thumbnail}")`
                          : "linear-gradient(135deg, var(--navy) 0%, var(--navy-deep) 100%)",
                      }}
                    >
                      {!current.thumbnail && (
                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)" }}>
                          <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                      )}
                      <audio key={current.id || index} src={current.mediaUrl} controls preload="metadata" style={{ width: "100%" }} />
                    </div>
                  ) : (
                    <video
                      key={current.id || index}
                      src={current.mediaUrl}
                      poster={current.thumbnail || undefined}
                      controls
                      preload="metadata"
                      playsInline
                      style={{ ...MEDIA_BOX, objectFit: "contain", backgroundColor: "#000", display: "block" }}
                    />
                  )}
                </div>

                <button type="button" className="photo-arrow right" aria-label={t(`${key}.nextAriaLabel`, "Next")} onClick={next} disabled={items.length < 2}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div style={{ marginTop: "26px", textAlign: "center", cursor: current?.id ? "pointer" : "default" }} onClick={goToDetail}>
                <h3 style={{ fontSize: "2.6rem", margin: "0 0 15px 0", fontFamily: "Georgia, serif", lineHeight: "1.1", fontWeight: "800", color: "#c1440e" }}>
                  <Rich html={current?.title} />
                </h3>
                <div style={{ fontSize: "1.3rem", color: "#333", margin: "0 auto", lineHeight: "1.6", maxWidth: "620px" }}>
                  <Rich html={current?.description} words={50} unwrapLinks={false} />
                </div>
              </div>
              <p style={{ textAlign: "center", margin: "10px 0 0", fontSize: "14px", color: "#666" }}>{index + 1} / {items.length}</p>
              <div className="photo-dots">
                {items.map((_, i) => (
                  <span key={i} className={`photo-dot${i === index ? " active" : ""}`} onClick={() => setIndex(i)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeMediaCarousel;
