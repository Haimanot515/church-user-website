import React, { useState, useRef } from "react";

/**
 * Media page — one page, three sections, each laid out as a
 * functional 3-item grid:
 *  1. Video  — grid of 3 cards; click a card to play it inline
 *  2. Photos — grid of 3 cards; click a card to open it in a lightbox
 *  3. Audio  — grid of 3 cards; click play on a card to listen
 *              (playing one card pauses any other that's playing)
 * Same outer shell as Home/Services (cloud layer, marquee nav, footer).
 */
const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

const videoItems = [
  { title: "Hope in Hard Seasons — Week 3", img: "https://images.unsplash.com/photo-1594990375715-2d008aaaa31b?auto=format&fit=crop&w=700&q=80", alt: "Blue and gold Orthodox cathedral interior", youtubeId: "YBJE7mJfEYk" },
  { title: "Worship Team at Rehearsal", img: "https://images.unsplash.com/photo-1739061749940-124120c10264?auto=format&fit=crop&w=700&q=80", alt: "Priest holding a cross during service", youtubeId: "Y_O0yIoz8Hs" },
  { title: "Youth Retreat Recap", img: "https://images.unsplash.com/photo-1649105703438-0992d6844823?auto=format&fit=crop&w=700&q=80", alt: "Priest standing in front of a cross", youtubeId: "YBJE7mJfEYk" },
  { title: "Living Waters — A Study Through John", img: "https://images.unsplash.com/photo-1627573897879-1eff66f2c228?auto=format&fit=crop&w=700&q=80", alt: "Low angle view of Orthodox cathedral interior", youtubeId: "Y_O0yIoz8Hs" },
  { title: "Faith of Our Fathers", img: "https://images.unsplash.com/photo-1730751634426-b51669a83c85?auto=format&fit=crop&w=700&q=80", alt: "Orthodox church walls covered in icon paintings", youtubeId: "YBJE7mJfEYk" },
  { title: "Missions Update: Stories from the Field", img: "https://images.unsplash.com/photo-1612005660287-62b37fad2eb5?auto=format&fit=crop&w=700&q=80", alt: "Orthodox cross atop a church dome", youtubeId: "Y_O0yIoz8Hs" },
  { title: "Joey's Journey: A Testimony", img: "https://images.unsplash.com/photo-1602802490525-79e3e5062d1b?auto=format&fit=crop&w=700&q=80", alt: "Orthodox icon of Christ on the iconostasis", youtubeId: "YBJE7mJfEYk" },
  { title: "Come As You Are", img: "https://images.unsplash.com/photo-1731440650603-a931e574c943?auto=format&fit=crop&w=700&q=80", alt: "Painted ceiling icon inside an Orthodox church", youtubeId: "Y_O0yIoz8Hs" },
  { title: "The Divine Liturgy Explained", img: "https://images.unsplash.com/photo-1764231479915-62f744d20939?auto=format&fit=crop&w=700&q=80", alt: "Interior of a grand, ornate Orthodox church with detailed flooring", youtubeId: "YBJE7mJfEYk" },
];

const photoItems = [
  { title: "Hope in Hard Seasons", desc: "Finding steadiness in Scripture when life feels uncertain.", img: "https://images.unsplash.com/photo-1594990375715-2d008aaaa31b?auto=format&fit=crop&w=1000&q=80", alt: "Blue and gold Orthodox cathedral interior" },
  { title: "The Divine Liturgy", desc: "Understanding the rhythm and meaning behind our weekly worship.", img: "https://images.unsplash.com/photo-1764231479915-62f744d20939?auto=format&fit=crop&w=1000&q=80", alt: "Interior of a grand, ornate Orthodox church with detailed flooring" },
  { title: "Icons and Prayer", desc: "How sacred images draw us deeper into stillness and worship.", img: "https://images.unsplash.com/photo-1780259034206-d6d579b5378b?auto=format&fit=crop&w=1000&q=80", alt: "Ancient stone wall with a religious icon and vaulted ceiling" },
  { title: "Living Waters", desc: "A study through John, on thirst, grace, and being made new.", img: "https://images.unsplash.com/photo-1627573897879-1eff66f2c228?auto=format&fit=crop&w=1000&q=80", alt: "Low angle view of Orthodox cathedral interior" },
  { title: "Faith of Our Fathers", desc: "Lessons from the patriarchs on trust and obedience.", img: "https://images.unsplash.com/photo-1730751634426-b51669a83c85?auto=format&fit=crop&w=1000&q=80", alt: "Orthodox church walls covered in icon paintings" },
  { title: "Come As You Are", desc: "Welcome, belonging, and the open table of the Gospel.", img: "https://images.unsplash.com/photo-1731440650603-a931e574c943?auto=format&fit=crop&w=1000&q=80", alt: "Painted ceiling icon inside an Orthodox church" },
  { title: "Guardian Angel", desc: "Watching over each step of our journey.", img: "https://images.unsplash.com/photo-1565074497050-01d0fdab0472?auto=format&fit=crop&w=1000&q=80", alt: "Small angel figurine" },
  { title: "Community Outreach", desc: "Serving our neighbors near the water's edge.", img: "https://images.unsplash.com/photo-1619371620133-1c4b489a0569?auto=format&fit=crop&w=1000&q=80", alt: "Orthodox church building near water" },
  { title: "Prayer Circle", desc: "Gathering in candlelight for weekly intercession.", img: "https://images.unsplash.com/photo-1601231656153-73aa7f115365?auto=format&fit=crop&w=1000&q=80", alt: "Gold candle holder with lit prayer candles" },
];

// Royalty-free sample tracks stand in for real hymn/sermon-audio recordings.
const audioItems = [
  { title: "Opening Hymn — Morning Prayer", artist: "Worship Team", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Sermon Audio — Hope in Hard Seasons", artist: "Sunday Message", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Closing Hymn — Living Waters", artist: "Worship Team", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Processional Hymn", artist: "Worship Team", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Sermon Audio — Living Waters", artist: "Sunday Message", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "Communion Hymn", artist: "Worship Team", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { title: "Sermon Audio — Faith of Our Fathers", artist: "Sunday Message", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { title: "Evening Prayer Hymn", artist: "Worship Team", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { title: "Sermon Audio — Come As You Are", artist: "Sunday Message", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
];

const VideoSection = () => {
  const [playingIndex, setPlayingIndex] = useState(null);
  return (
    <div className="media-section">
      <span className="eyebrow">Watch</span>
      <h2 className="display">Video</h2>
      <p className="section-intro">Sermons and worship moments from our church family.</p>
      <div className="media-grid">
        {videoItems.map((v, i) => (
          <div className="grid-card video-card" key={i}>
            {playingIndex === i ? (
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                  title={v.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <button className="video-thumb-btn" onClick={() => setPlayingIndex(i)} aria-label={`Play ${v.title}`}>
                <img src={v.img} alt={v.alt} />
                <span className="play-overlay">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </button>
            )}
            <p className="grid-card-title">{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PhotoSection = () => {
  const [lightbox, setLightbox] = useState(null);
  const showPrev = () => setLightbox((i) => (i === 0 ? photoItems.length - 1 : i - 1));
  const showNext = () => setLightbox((i) => (i === photoItems.length - 1 ? 0 : i + 1));

  return (
    <div className="media-section">
      <span className="eyebrow">Look Back</span>
      <h2 className="display">Photos</h2>
      <p className="section-intro">A look inside our worship and life together.</p>
      <div className="media-grid">
        {photoItems.map((p, i) => (
          <button className="grid-card photo-card" key={i} onClick={() => setLightbox(i)}>
            <img src={p.img} alt={p.alt} />
            <p className="grid-card-title">{p.title}</p>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
            <img src={photoItems[lightbox].img} alt={photoItems[lightbox].alt} />
            <div className="lightbox-caption">
              <h3>{photoItems[lightbox].title}</h3>
              <p>{photoItems[lightbox].desc}</p>
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

const AudioSection = () => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRefs = useRef([]);

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
        {audioItems.map((t, i) => (
          <div className="grid-card audio-card" key={i}>
            <button className="audio-play-btn" onClick={() => toggleTrack(i)} aria-label={playingIndex === i ? "Pause" : "Play"}>
              {playingIndex === i ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <p className="grid-card-title">{t.title}</p>
            <p className="audio-artist">{t.artist}</p>
            <audio
              ref={(el) => (audioRefs.current[i] = el)}
              src={t.src}
              onEnded={() => setPlayingIndex(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const MediaPage = () => {
  return (
    <div className="media-portal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --navy: #1c3a52; --navy-deep: #0f2438; --slate: #3d5a6c;
          --gold: #cf9f3f; --deep-red: #7a1010;
        }
        * { box-sizing: border-box; }
        .media-portal { font-family: 'Nunito Sans', sans-serif; background: #f3f8fa; color: var(--navy); position: relative; }
        .display { font-family: 'Cormorant Garamond', serif; }
        .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); }
        a { color: inherit; text-decoration: none; }
        .wrapper { max-width: 1080px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }

        .cloud-layer { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .cloud { position: absolute; background: rgba(255,255,255,0.75); border-radius: 100px; filter: blur(1px); }
        .cloud::before, .cloud::after { content: ''; position: absolute; background: inherit; border-radius: 100px; }
        .cloud-a { width: 180px; height: 55px; top: 8%; left: -10%; animation: drift 70s linear infinite; }
        .cloud-a::before { width: 90px; height: 90px; top: -45px; left: 25px; }
        .cloud-a::after { width: 70px; height: 70px; top: -30px; left: 90px; }
        .cloud-b { width: 130px; height: 40px; top: 22%; left: -15%; animation: drift 95s linear infinite; animation-delay: -20s; opacity: 0.6; }
        .cloud-b::before { width: 65px; height: 65px; top: -32px; left: 18px; }
        .cloud-b::after { width: 50px; height: 50px; top: -22px; left: 65px; }
        .cloud-c { width: 220px; height: 60px; top: 4%; left: -20%; animation: drift 120s linear infinite; animation-delay: -50s; opacity: 0.5; }
        .cloud-c::before { width: 100px; height: 100px; top: -50px; left: 30px; }
        .cloud-c::after { width: 80px; height: 80px; top: -35px; left: 110px; }
        @keyframes drift { from { transform: translateX(0); } to { transform: translateX(160vw); } }
        @media (prefers-reduced-motion: reduce) { .cloud { animation: none !important; } }

        .nav-bar { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 26px; padding: 0 24px; height: 100px;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%); border-bottom: 1px solid rgba(255,255,255,0.12);
          overflow: hidden; white-space: nowrap; }
        .nav-marquee-viewport { flex: 1; min-width: 0; overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%); }
        .nav-marquee-track { display: flex; align-items: center; gap: 26px; width: max-content; animation: navMarquee 32s linear infinite; }
        .nav-bar:hover .nav-marquee-track { animation-play-state: paused; }
        @keyframes navMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .nav-marquee-track { animation: none; } }
        .nav-item { font-size: 1.05rem; font-weight: 700; color: #ffffff; cursor: pointer; flex-shrink: 0; position: relative; padding: 4px 0; transition: color 0.2s ease; }
        .nav-item:hover { color: var(--gold); }
        .nav-item::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px; background: var(--gold); transition: width 0.25s ease; }
        .nav-item:hover::after { width: 100%; }

        .media-hero { background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%); padding: 90px 0 70px 0; text-align: center; }
        .media-hero h1 { font-size: clamp(2.6rem, 6vw, 4.2rem); font-weight: 700; color: #eaf3f8; margin: 16px 0 18px 0; }
        .media-hero p { font-size: 1.2rem; color: #a9c2d3; max-width: 560px; margin: 0 auto; line-height: 1.65; }

        .media-sections { padding: 80px 0; }
        .media-section:not(:last-child) { margin-bottom: 90px; padding-bottom: 80px; border-bottom: 1px solid rgba(28,58,82,0.12); }
        .media-section h2 { font-size: 2.6rem; font-weight: 700; color: var(--navy-deep); margin: 8px 0 10px 0; }
        .section-intro { font-size: 1.1rem; color: var(--slate); margin: 0 0 34px 0; max-width: 620px; }

        /* Shared 3-column grid */
        .media-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
        @media (max-width: 800px) { .media-grid { grid-template-columns: 1fr; } }
        .grid-card {
          background: #fff; border: 1px solid rgba(28,58,82,0.12); border-radius: 10px;
          overflow: hidden; text-align: left; cursor: pointer; padding: 0; font-family: inherit;
          box-shadow: 0 8px 18px rgba(15,36,56,0.06);
        }
        .grid-card-title { font-size: 0.98rem; font-weight: 700; color: var(--navy-deep); margin: 0; padding: 14px 16px; line-height: 1.35; }

        /* Video cards */
        .video-thumb-btn { position: relative; display: block; width: 100%; border: none; padding: 0; cursor: pointer; background: none; }
        .video-thumb-btn img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .play-overlay {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(15,36,56,0.35); color: #fff; transition: background 0.2s ease;
        }
        .video-thumb-btn:hover .play-overlay { background: rgba(15,36,56,0.55); }
        .video-embed { position: relative; aspect-ratio: 16/9; background: #000; }
        .video-embed iframe { width: 100%; height: 100%; position: absolute; inset: 0; border: none; }

        /* Photo cards */
        .photo-card { display: block; }
        .photo-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }

        /* Audio cards */
        .audio-card { padding: 22px 18px 18px 18px; cursor: default; text-align: center; }
        .audio-card .grid-card-title { padding: 14px 0 4px 0; text-align: center; }
        .audio-artist { font-size: 0.85rem; color: var(--slate); margin: 0; text-align: center; font-family: 'IBM Plex Mono', monospace; }
        .audio-play-btn {
          width: 52px; height: 52px; border-radius: 50%; background: var(--gold); color: var(--navy-deep);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; margin: 0 auto;
        }

        /* Lightbox */
        .lightbox {
          position: fixed; inset: 0; z-index: 100; background: rgba(15,36,56,0.85);
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .lightbox-inner { position: relative; max-width: 800px; width: 100%; background: #fff; border-radius: 10px; overflow: hidden; }
        .lightbox-inner img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .lightbox-caption { padding: 20px 24px; text-align: center; }
        .lightbox-caption h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 700; color: var(--navy-deep); margin: 0 0 8px 0; }
        .lightbox-caption p { font-size: 1rem; color: #33475a; margin: 0; }
        .lightbox-close {
          position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 50%;
          background: rgba(15,36,56,0.6); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .lightbox-nav {
          position: absolute; top: 40%; width: 40px; height: 40px; border-radius: 50%;
          background: rgba(15,36,56,0.55); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .lightbox-nav.left { left: 14px; }
        .lightbox-nav.right { right: 14px; }
      `}</style>

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
          <VideoSection />
          <PhotoSection />
          <AudioSection />
        </div>
      </section>

      <footer style={{ background: 'var(--navy-deep)', color: '#89a3b5', padding: '60px 0 30px 0', borderBottom: '6px solid var(--deep-red)' }}>
        <div className="wrapper">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '38px', marginBottom: '44px' }}>
            <div>
              <h4 className="display" style={{ color: '#eaf3f8', fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>Harbor Light Church</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Sunday services at 9:00 & 11:00 AM. All are welcome, always.</p>
            </div>
            {[
              { title: "Visit", items: ["Service Times", "Directions", "What to Expect"] },
              { title: "Get Involved", items: ["Ministries", "Volunteer", "Give", "Missions"] },
              { title: "Connect", items: ["Facebook", "Instagram", "YouTube"] }
            ].map((col, i) => (
              <div key={i}>
                <h5 className="eyebrow" style={{ color: '#eaf3f8', marginBottom: '12px', fontSize: '0.85rem' }}>{col.title}</h5>
                {col.items.map((s, j) => (
                  <p key={j} style={{ fontSize: '1.1rem', margin: '8px 0', cursor: 'pointer' }}>{s}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <p className="eyebrow" style={{ margin: 0, fontSize: '0.85rem' }}>© 2026 Harbor Light Church</p>
            <p className="eyebrow" style={{ margin: 0, fontSize: '0.85rem' }}>Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MediaPage;