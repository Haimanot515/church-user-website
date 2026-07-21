import React, { useEffect, useRef, useState } from "react";

// 🔧 Swap these for your actual sermon videos — paste either the full
// YouTube URL or just the video ID (the part after "v=" or after youtu.be/)
// for each entry. Add/remove as many as you like.
const SERMONS = [
  { title: "This Week's Message", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE" },
  { title: "Last Week's Message", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw" },
  { title: "Two Weeks Ago", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
  { title: "Three Weeks Ago", url: "https://www.youtube.com/watch?v=eBGIQ7ZuuiU" },
  { title: "Four Weeks Ago", url: "https://www.youtube.com/watch?v=ZXsQAXx_ao0" },
  { title: "Five Weeks Ago", url: "https://www.youtube.com/watch?v=OPf0YbXqDm0" },
  { title: "Six Weeks Ago", url: "https://www.youtube.com/watch?v=tgbNymZ7vqY" },
  { title: "Seven Weeks Ago", url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ" },
  { title: "Eight Weeks Ago", url: "https://www.youtube.com/watch?v=60ItHLz5WEA" },
];

function extractYouTubeId(input) {
  const idMatch = input.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (idMatch) return idMatch[1];
  // already looks like a bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  return null;
}

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const PastorHeroPage = () => {
  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const progressTimer = useRef(null);
  const videoHeroRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [videoClosed, setVideoClosed] = useState(false);
  const [sermonIndex, setSermonIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const videoIds = SERMONS.map((s) => extractYouTubeId(s.url) || "M7lc1UVf-VE");
  const videoId = videoIds[sermonIndex];

  const startProgressTimer = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = setInterval(() => {
      const player = playerInstance.current;
      if (player && player.getCurrentTime) {
        setCurrentTime(player.getCurrentTime());
        setDuration(player.getDuration());
      }
    }, 500);
  };

  useEffect(() => {
    if (videoClosed) return;

    const createPlayer = () => {
      playerInstance.current = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: videoId, // required for loop:1 to work on a single video
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
            setReady(true);
            startProgressTimer();
          },
          onStateChange: (e) => {
            // manual loop safety-net in case playlist looping doesn't fire
            if (e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
      if (playerInstance.current && playerInstance.current.destroy) {
        playerInstance.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoClosed]);

  // switch clips without tearing down the whole player
  useEffect(() => {
    const player = playerInstance.current;
    if (player && player.loadVideoById && ready) {
      player.loadVideoById(videoId);
      if (muted) player.mute();
      setCurrentTime(0);
      setDuration(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sermonIndex]);

  const toggleMute = () => {
    const player = playerInstance.current;
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  const goToSermon = (nextIndex) => {
    const wrapped = (nextIndex + SERMONS.length) % SERMONS.length;
    setSermonIndex(wrapped);
  };

  const closeVideo = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    if (playerInstance.current && playerInstance.current.destroy) {
      playerInstance.current.destroy();
    }
    playerInstance.current = null;
    setReady(false);
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --navy: #1c3a52;
          --navy-deep: #0f2438;
          --slate: #3d5a6c;
          --gold: #cf9f3f;
          --deep-red: #7a1010;
          --rust: #c1440e;
          --cream: #f6f2ea;
        }

        * { box-sizing: border-box; }

        .shepherd-page {
          font-family: 'Nunito Sans', sans-serif;
          background: var(--cream);
          color: var(--navy);
          -webkit-font-smoothing: antialiased;
        }
        .display { font-family: 'Cormorant Garamond', serif; }
        .wrapper { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--gold);
        }

        /* ---- VIDEO HERO ---- */
        .video-hero {
          position: relative;
          width: 100%;
          height: 68vh;
          min-height: 440px;
          overflow: hidden;
          background: var(--navy-deep);
        }
        .yt-bg-wrap {
          position: absolute; inset: 0;
          overflow: hidden;
        }
        .yt-bg-wrap iframe {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          /* oversize + center-crop so a 16:9 embed fills any hero aspect ratio */
          width: 177.78vh; /* 100vh * (16/9) */
          height: 100vh;
          min-width: 100%;
          min-height: 56.25vw; /* 100vw * (9/16) */
        }
        .controls-overlay {
          position: absolute; inset: 0;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .controls-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }
        .tap-catcher {
          position: absolute; inset: 0;
          z-index: 1;
          background: transparent;
          cursor: pointer;
        }
        .mute-btn {
          position: absolute;
          bottom: 24px; right: 24px;
          z-index: 2;
          width: 46px; height: 46px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.35); background: rgba(15,36,56,0.55);
          color: #f3f6f8; cursor: pointer; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(2px);
        }
        .mute-btn svg { width: 18px; height: 18px; }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 50px; height: 50px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.35); background: rgba(15,36,56,0.55);
          color: #f3f6f8; cursor: pointer; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(2px);
        }
        .nav-arrow:hover { background: rgba(15,36,56,0.8); }
        .nav-arrow.prev { left: 24px; }
        .nav-arrow.next { right: 24px; }
        .nav-arrow svg { width: 20px; height: 20px; }

        .close-btn {
          position: absolute;
          top: 24px; right: 24px;
          z-index: 2;
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.35); background: rgba(15,36,56,0.55);
          color: #f3f6f8; cursor: pointer; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(2px);
        }
        .close-btn svg { width: 16px; height: 16px; }

        .playback-time {
          position: absolute;
          bottom: 24px; left: 24px;
          z-index: 2;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          color: #f3f6f8;
          background: rgba(15,36,56,0.55);
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.35);
          backdrop-filter: blur(2px);
        }

        .video-closed-panel {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px;
          height: 100%; width: 100%;
          color: #c7d6e0;
        }
        .video-closed-panel button.reopen-toggle-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--gold); color: var(--navy-deep); border: none;
          padding: 13px 26px; font-weight: 700; font-size: 0.95rem;
          border-radius: 4px; cursor: pointer;
        }
        .video-closed-panel button.reopen-toggle-btn svg { width: 18px; height: 18px; }

        /* ---- HERO TEXT (below video) ---- */
        .hero-text-section {
          background: var(--navy-deep);
          padding: 56px 24px 64px 24px;
        }
        .hero-text-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .hero-text-inner .eyebrow { color: var(--gold); }
        .hero-text-inner h1 {
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 700; line-height: 1.08;
          color: #f3f6f8; margin: 16px 0 18px 0;
          max-width: 780px;
        }
        .hero-text-inner p {
          font-size: 1.2rem; color: #c7d6e0; max-width: 620px; line-height: 1.6; margin: 0 0 30px 0;
        }
        .hero-actions { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .watch-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--gold); color: var(--navy-deep); border: none;
          padding: 15px 30px; font-weight: 700; font-size: 1rem;
          border-radius: 4px; cursor: pointer; letter-spacing: 0.02em;
        }

        /* ---- MORE SERMONS GRID ---- */
        .sermons-section { padding: 72px 0 90px 0; }
        .sermons-head { max-width: 620px; margin: 0 0 36px 0; }
        .sermons-head h2 {
          font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 700; margin: 12px 0 0 0; color: var(--navy-deep);
        }
        .sermons-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px;
        }
        @media (max-width: 860px) { .sermons-grid { grid-template-columns: 1fr; } }

        .sermon-card {
          background: #ffffff; border-radius: 8px; overflow: hidden;
          box-shadow: 0 10px 24px rgba(15,36,56,0.08);
          cursor: pointer; border: 2px solid transparent;
          text-align: left; padding: 0; font: inherit; color: inherit;
          transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .sermon-card:hover {
          box-shadow: 0 14px 30px rgba(15,36,56,0.14);
          transform: translateY(-2px);
        }
        .sermon-card.active { border-color: var(--gold); }
        .sermon-thumb-wrap {
          position: relative;
          width: 100%; aspect-ratio: 16/9;
          background: var(--navy-deep);
          overflow: hidden;
        }
        .sermon-thumb-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .sermon-play-badge {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(15,36,56,0.25);
        }
        .sermon-play-badge svg {
          width: 44px; height: 44px;
          color: #f6f2ea;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
        }
        .sermon-card-body { padding: 16px 18px 20px 18px; }
        .sermon-now-playing {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--rust); font-weight: 500; margin-bottom: 6px;
        }
        .sermon-card h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 700;
          color: var(--navy-deep); margin: 0; line-height: 1.2;
        }

        /* ---- CHURCHES SERVED ---- */
        .campuses-section { padding: 100px 0; }
        .campuses-head { text-align: center; max-width: 620px; margin: 0 auto 60px auto; }
        .campuses-head h2 {
          font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin: 14px 0 16px 0; color: var(--navy-deep);
        }
        .campuses-head p { font-size: 1.1rem; color: var(--slate); line-height: 1.6; }

        .campus-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;
        }
        @media (max-width: 860px) { .campus-grid { grid-template-columns: 1fr; } }

        .campus-card {
          background: #ffffff; border-radius: 8px; overflow: hidden;
          box-shadow: 0 10px 24px rgba(15,36,56,0.08);
        }
        .campus-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .campus-card-body { padding: 22px 24px 26px 24px; }
        .campus-role {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--rust); font-weight: 500; margin-bottom: 8px;
        }
        .campus-card h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 700;
          color: var(--navy-deep); margin: 0 0 10px 0; line-height: 1.15;
        }
        .campus-line {
          display: flex; align-items: baseline; gap: 8px; font-size: 0.92rem; color: var(--slate);
          margin-bottom: 4px;
        }
        .campus-line strong { color: var(--navy); font-weight: 700; }
      `}</style>

      <section className="video-hero" ref={videoHeroRef}>
        {!videoClosed ? (
          <>
            <div className="yt-bg-wrap">
              <div ref={playerRef} />
            </div>
            <div className="tap-catcher" onClick={toggleControls} />

            <div className={`controls-overlay${showControls ? " visible" : ""}`} onClick={toggleControls}>
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

              <button className="close-btn" onClick={(e) => { e.stopPropagation(); toggleVideo(); }} aria-label="Close video">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>

              <div className="playback-time" onClick={(e) => e.stopPropagation()}>{formatTime(currentTime)} / {formatTime(duration)}</div>

              <button className="mute-btn" onClick={(e) => { e.stopPropagation(); toggleMute(); }} aria-label={muted ? "Unmute video" : "Mute video"} disabled={!ready}>
                {muted ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V15H8L13 20V4L8 9H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M17 8L21 16M21 8L17 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V15H8L13 20V4L8 9H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16.5 8.5C17.5 9.5 18 10.7 18 12C18 13.3 17.5 14.5 16.5 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="video-closed-panel">
            <span className="eyebrow">Video closed</span>
            <button className="reopen-toggle-btn" onClick={toggleVideo} aria-label="Open video">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>
              Watch the sermon
            </button>
          </div>
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
          <div className="sermons-grid">
            {SERMONS.map((s, i) => (
              <button
                key={s.title}
                className={`sermon-card${i === sermonIndex && !videoClosed ? " active" : ""}`}
                onClick={() => selectSermonFromGrid(i)}
              >
                <div className="sermon-thumb-wrap">
                  <img src={`https://img.youtube.com/vi/${videoIds[i]}/hqdefault.jpg`} alt={s.title} />
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

export default PastorHeroPage;