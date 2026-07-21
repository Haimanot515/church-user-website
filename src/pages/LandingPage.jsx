import React, { useState, useEffect, useRef } from "react";
import API from "../api/api.jsx";

const ChurchBlogPage = () => {
  const [data, setData] = useState(null);
  const [showMoreMinistries, setShowMoreMinistries] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

  const photos = [
    { title: "Hope in Hard Seasons", desc: "Finding steadiness in Scripture when life feels uncertain.", img: "https://images.unsplash.com/photo-1594990375715-2d008aaaa31b?auto=format&fit=crop&w=1200&q=80", alt: "Blue and gold Orthodox cathedral interior" },
    { title: "Living Waters", desc: "A study through John, on thirst, grace, and being made new.", img: "https://images.unsplash.com/photo-1627573897879-1eff66f2c228?auto=format&fit=crop&w=1200&q=80", alt: "Low angle view of Orthodox cathedral interior" },
    { title: "Faith of Our Fathers", desc: "Lessons from the patriarchs on trust and obedience.", img: "https://images.unsplash.com/photo-1730751634426-b51669a83c85?auto=format&fit=crop&w=1200&q=80", alt: "Orthodox church walls covered in icon paintings" },
    { title: "Come As You Are", desc: "Welcome, belonging, and the open table of the Gospel.", img: "https://images.unsplash.com/photo-1731440650603-a931e574c943?auto=format&fit=crop&w=1200&q=80", alt: "Painted ceiling icon inside an Orthodox church" },
    { title: "The Divine Liturgy", desc: "Understanding the rhythm and meaning behind our weekly worship.", img: "https://images.unsplash.com/photo-1764231479915-62f744d20939?auto=format&fit=crop&w=1200&q=80", alt: "Interior of a grand, ornate Orthodox church with detailed flooring" },
    { title: "Icons and Prayer", desc: "How sacred images draw us deeper into stillness and worship.", img: "https://images.unsplash.com/photo-1780259034206-d6d579b5378b?auto=format&fit=crop&w=1200&q=80", alt: "Ancient stone wall with a religious icon and vaulted ceiling" }
  ];

  const showPrevPhoto = () => setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const showNextPhoto = () => setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  const angelScrollRef = useRef(null);
  const scrollAngels = (direction) => {
    if (angelScrollRef.current) {
      const amount = angelScrollRef.current.clientWidth * 0.8;
      angelScrollRef.current.scrollBy({ left: direction * amount, behavior: 'smooth' });
    }
  };

  const videos = [
    {
      title: "Joey's Journey: A Testimony of Coming Home",
      tag: "NOW PLAYING",
      img: "https://images.unsplash.com/photo-1594990375715-2d008aaaa31b?auto=format&fit=crop&w=900&q=80",
      alt: "Blue and gold Orthodox cathedral interior",
      youtubeId: "YBJE7mJfEYk"
    },
    {
      title: "Sunday Highlights: Hope in Hard Seasons, Week 3",
      img: "https://images.unsplash.com/photo-1627573897879-1eff66f2c228?auto=format&fit=crop&w=200&q=80",
      alt: "Low angle view of Orthodox cathedral interior",
      youtubeId: "Y_O0yIoz8Hs"
    },
    {
      title: "Behind the Scenes: Our Worship Team at Rehearsal",
      img: "https://images.unsplash.com/photo-1739061749940-124120c10264?auto=format&fit=crop&w=200&q=80",
      alt: "Priest holding a cross during service",
      youtubeId: "YBJE7mJfEYk"
    },
    {
      title: "Youth Retreat Recap: Faith, Fire Pits & Fellowship",
      img: "https://images.unsplash.com/photo-1649105703438-0992d6844823?auto=format&fit=crop&w=200&q=80",
      alt: "Priest standing in front of a cross",
      youtubeId: "Y_O0yIoz8Hs"
    },
    {
      title: "Missions Update: Stories from the Field",
      img: "https://images.unsplash.com/photo-1612005660287-62b37fad2eb5?auto=format&fit=crop&w=200&q=80",
      alt: "Orthodox cross atop a church dome",
      youtubeId: "YBJE7mJfEYk"
    }
  ];

  const [activeVideoId, setActiveVideoId] = useState(videos[0].youtubeId);
  const [activeVideoTitle, setActiveVideoTitle] = useState(videos[0].title);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await API.get("/landingheros");
        setData(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (err) { console.error("Error:", err); }
    };
    fetchContent();
  }, []);

  return (
    <div className="church-portal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --sky-top: #a9d3e8;
          --sky-mid: #d5eaf3;
          --sky-low: #f3f8fa;
          --navy: #1c3a52;
          --navy-deep: #0f2438;
          --slate: #3d5a6c;
          --gold: #cf9f3f;
          --white: #ffffff;
          --deep-red: #7a1010;
        }

        * { box-sizing: border-box; }

        .church-portal {
          font-family: 'Nunito Sans', sans-serif;
          background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 40%, var(--sky-low) 100%);
          color: var(--navy);
          -webkit-font-smoothing: antialiased;
        }
        .wrapper { max-width: 1180px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }
        .display {
          font-family: 'Cormorant Garamond', serif;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold);
        }
        a { color: inherit; text-decoration: none; }

        /* Drifting cloud layer - decorative, behind content */
        .cloud-layer { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .cloud {
          position: absolute; background: rgba(255,255,255,0.75);
          border-radius: 100px; filter: blur(1px);
        }
        .cloud::before, .cloud::after {
          content: ''; position: absolute; background: inherit; border-radius: 100px;
        }
        .cloud-a { width: 180px; height: 55px; top: 8%; left: -10%; animation: drift 70s linear infinite; }
        .cloud-a::before { width: 90px; height: 90px; top: -45px; left: 25px; }
        .cloud-a::after { width: 70px; height: 70px; top: -30px; left: 90px; }
        .cloud-b { width: 130px; height: 40px; top: 22%; left: -15%; animation: drift 95s linear infinite; animation-delay: -20s; opacity: 0.6; }
        .cloud-b::before { width: 65px; height: 65px; top: -32px; left: 18px; }
        .cloud-b::after { width: 50px; height: 50px; top: -22px; left: 65px; }
        .cloud-c { width: 220px; height: 60px; top: 4%; left: -20%; animation: drift 120s linear infinite; animation-delay: -50s; opacity: 0.5; }
        .cloud-c::before { width: 100px; height: 100px; top: -50px; left: 30px; }
        .cloud-c::after { width: 80px; height: 80px; top: -35px; left: 110px; }
        @keyframes drift {
          from { transform: translateX(0); }
          to { transform: translateX(160vw); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cloud { animation: none !important; }
        }

        section { padding: 90px 0; position: relative; z-index: 1; }

        .nav-bar {
          position: sticky; top: 0; z-index: 40;
          display: flex; align-items: center; gap: 26px;
          padding: 0 24px; height: 100px;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          overflow-x: auto; white-space: nowrap; scrollbar-width: none;
        }
        .nav-bar::-webkit-scrollbar { display: none; }
        .nav-brand {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 1.6rem;
          color: #eaf3f8; margin-right: 10px; flex-shrink: 0;
        }
        .nav-item {
          font-size: 1.05rem; font-weight: 700;
          color: #ffffff; cursor: pointer; flex-shrink: 0;
          position: relative; padding: 4px 0;
          transition: color 0.2s ease;
        }
        .nav-item:hover { color: var(--gold); }
        .nav-item::after {
          content: ''; position: absolute; left: 0; bottom: -2px;
          width: 0; height: 2px; background: var(--gold);
          transition: width 0.25s ease;
        }
        .nav-item:hover::after { width: 100%; }

        .card {
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(28,58,82,0.10);
          border-radius: 12px;
          backdrop-filter: blur(6px);
        }

        .sponsored-wrap {
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          padding: 0 24px 0 24px;
          position: relative;
        }
        .cross-string {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
          pointer-events: none;
        }
        .cross-string.left { left: 4%; }
        .cross-string.right { right: 4%; }
        .cross-string .string-line {
          flex: 1;
          width: 2px;
          background: linear-gradient(180deg, rgba(207,159,63,0) 0%, rgba(207,159,63,0.6) 15%, rgba(207,159,63,0.6) 85%, rgba(207,159,63,0) 100%);
        }
        .cross-string svg { flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        @media (max-width: 900px) {
          .cross-string { display: none; }
        }
        .sermon-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 34px;
          padding: 6px 0;
        }
        .sermon-divider .h-string {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, rgba(207,159,63,0) 0%, rgba(207,159,63,0.55) 50%, rgba(207,159,63,0) 100%);
          max-width: 220px;
        }
        .sermon-divider svg { flex-shrink: 0; }

        .hanging-cross {
          position: absolute;
          top: 0;
          width: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: top center;
          animation: swing 4.5s ease-in-out infinite;
          z-index: 3;
          pointer-events: none;
        }
        .hanging-cross.left { left: 2%; }
        .hanging-cross.right { right: 2%; animation-delay: -2.3s; }
        .hanging-cross .hang-string {
          width: 2px;
          height: 70px;
          background: linear-gradient(180deg, rgba(28,58,82,0.5), rgba(28,58,82,0.15));
        }
        .hanging-cross svg { filter: drop-shadow(0 6px 10px rgba(15,36,56,0.25)); }
        @keyframes swing {
          0%, 100% { transform: rotate(-9deg); }
          50% { transform: rotate(9deg); }
        }
        @media (max-width: 900px) {
          .hanging-cross { display: none; }
        }

        .cross-bg {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Crect x='36' y='14' width='8' height='52'/%3E%3Crect x='18' y='30' width='44' height='8'/%3E%3C/g%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 80px 80px;
        }

        .cross-track {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          pointer-events: none;
          z-index: 0;
        }
        .cross-track.left { left: 3%; }
        .cross-track.right { right: 3%; }
        .wave-cross {
          animation: waveMotion 3.2s ease-in-out infinite;
        }
        @keyframes waveMotion {
          0%   { transform: translateX(-14px) scaleX(0.85); }
          50%  { transform: translateX(14px) scaleX(1.2); }
          100% { transform: translateX(-14px) scaleX(0.85); }
        }
        @media (max-width: 900px) {
          .cross-track { display: none; }
        }

        .angel-divider {
          background: var(--deep-red);
          padding: 50px 0;
        }
        .angel-carousel {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .angel-grid {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          flex: 1;
          min-width: 0;
        }
        .angel-grid::-webkit-scrollbar { display: none; }
        .angel-box {
          position: relative;
          flex: 0 0 auto;
          width: 240px;
          aspect-ratio: 1 / 1;
          border-radius: 10px;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          box-shadow: 0 10px 24px rgba(0,0,0,0.3);
        }
        .angel-box-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 18px;
          background: linear-gradient(180deg, rgba(15,10,10,0) 40%, rgba(15,10,10,0.85) 100%);
        }
        .angel-box-overlay h4 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
        }
        .angel-box-overlay p {
          font-size: 0.9rem;
          line-height: 1.4;
          color: rgba(255,255,255,0.85);
          margin: 0;
        }
        .angel-arrow {
          flex-shrink: 0;
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .angel-arrow:hover {
          background: var(--gold);
          color: var(--navy-deep);
          transform: translateY(-2px);
        }
        @media (max-width: 700px) {
          .angel-box { width: 180px; }
          .angel-arrow { width: 38px; height: 38px; }
        }

        /* PHOTO CAROUSEL */
        .photo-carousel {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .photo-carousel-frame { flex: 1; min-width: 0; }
        .photo-arrow {
          flex-shrink: 0;
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 1.5px solid rgba(28,58,82,0.18);
          background: #ffffff;
          color: var(--navy-deep);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(15,36,56,0.12);
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .photo-arrow:hover {
          background: var(--gold);
          color: var(--navy-deep);
          transform: translateY(-2px);
        }
        .photo-arrow.left { margin-right: 4px; }
        .photo-arrow.right { margin-left: 4px; }
        @media (max-width: 700px) {
          .photo-carousel { gap: 10px; }
          .photo-arrow { width: 40px; height: 40px; }
        }
        .photo-dots {
          display: flex; justify-content: center; gap: 9px;
          margin-top: 22px;
        }
        .photo-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: rgba(28,58,82,0.25);
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .photo-dot.active {
          background: var(--gold);
          transform: scale(1.2);
        }

        /* VIDEO SECTION */
        .video-section { background: #ffffff; }
        .video-heading {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 40px;
        }
        .video-heading h3 {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700; font-size: 1.5rem;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--navy-deep); margin: 0; white-space: nowrap;
        }
        .video-heading .rule { flex: 1; height: 5px; background: var(--navy-deep); }
        .video-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 44px;
          align-items: start;
        }
        @media (max-width: 800px) {
          .video-grid { grid-template-columns: 1fr; }
        }
        .video-player {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 16/10;
        }
        .video-player img {
          width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.9;
        }
        .video-badge {
          position: absolute; top: 20px; left: 20px;
          font-family: 'Cormorant Garamond', serif;
          color: #fff;
        }
        .video-badge .brand { font-weight: 700; font-size: 1.4rem; display: block; }
        .video-badge .series {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gold); display: block; margin-top: 4px;
        }
        .video-close {
          position: absolute; top: 16px; right: 20px;
          color: #fff; font-size: 1.3rem; cursor: pointer;
          background: none; border: none; line-height: 1;
        }
        .video-mute {
          position: absolute; bottom: 20px; left: 20px;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,0,0.5); border: none; color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .video-list-scroll {
          max-height: 420px;
          overflow-y: auto;
          padding-right: 6px;
        }
        .video-list-scroll::-webkit-scrollbar { width: 6px; }
        .video-list-scroll::-webkit-scrollbar-track { background: transparent; }
        .video-list-scroll::-webkit-scrollbar-thumb {
          background: rgba(28,58,82,0.25);
          border-radius: 10px;
        }
        .video-list-item {
          display: flex; gap: 16px; align-items: flex-start;
          padding: 16px 0; border-bottom: 1px solid rgba(28,58,82,0.14);
          cursor: pointer;
        }
        .video-list-item:first-child { padding-top: 0; }
        .video-thumb-wrap {
          position: relative; flex-shrink: 0;
          width: 96px; height: 64px; border-radius: 3px; overflow: hidden;
        }
        .video-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .now-playing-tag {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(15,36,56,0.85);
          color: #6ee7b7;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.06em;
          text-align: center; padding: 2px 0;
        }
        .video-list-item p {
          font-size: 0.98rem; font-weight: 700; line-height: 1.35;
          margin: 0; color: var(--navy-deep);
        }
        .video-view-all {
          text-align: center; margin-top: 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--navy-deep);
          border-top: 2px solid var(--navy-deep);
          padding-top: 16px; cursor: pointer;
        }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      {/* NAV */}
      <nav className="nav-bar">
        <span className="nav-brand">Harbor&nbsp;Light&nbsp;Church</span>
        {categories.map(cat => <span key={cat} className="nav-item">{cat}</span>)}
      </nav>

      {/* SPONSORED - original image and text style, outer background now matches hero */}
      <div className="sponsored-wrap">
        {/* Decorative vertical crosses connected by a string, framing the ad on both sides */}
        <div className="cross-string left">
          <div className="string-line" />
          <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="0" width="4" height="40" fill="var(--gold)" />
            <rect x="2" y="8" width="24" height="4" fill="var(--gold)" />
            <rect x="5" y="24" width="18" height="4" fill="var(--gold)" />
          </svg>
          <div className="string-line" />
        </div>
        <div className="cross-string right">
          <div className="string-line" />
          <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="0" width="4" height="40" fill="var(--gold)" />
            <rect x="2" y="8" width="24" height="4" fill="var(--gold)" />
            <rect x="5" y="24" width="18" height="4" fill="var(--gold)" />
          </svg>
          <div className="string-line" />
        </div>
        <div className="sponsored-block" style={{
          margin: '-30px auto 0 auto',
          maxWidth: '1000px',
          minHeight: '480px',
          border: '1px solid #eee',
          padding: '40px',
          background: '#fff',
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 16px 30px rgba(15,36,56,0.25)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#d32f2f', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
            Sponsored Content
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center', width: '100%' }}>
            <img
              src="https://images.unsplash.com/photo-1600876625357-7c980b1bc59b?auto=format&fit=crop&w=900&q=80"
              alt="Golden and white Orthodox church exterior"
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px' }}
            />
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: '0 0 15px 0', fontFamily: 'Georgia, serif' }}>
                Drive Your Business Forward with Industry-Leading Insights
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: '0 0 20px 0' }}>
                Unlock exclusive strategies and data-driven reports designed to give you a competitive edge in 2026.
              </p>
              <button style={{
                backgroundColor: '#d32f2f',
                color: '#fff',
                border: 'none',
                padding: '12px 30px',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }} onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}>
                Open
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section style={{ padding: '100px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ display: 'flex', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '320px' }}>
            <span className="eyebrow" style={{ marginBottom: '20px', display: 'block', fontSize: '0.85rem' }}>A Community of Faith</span>
            <h1 className="display" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.08, margin: '0 0 26px 0', color: '#eaf3f8' }}>
              Rooted in grace, reaching toward the light.
            </h1>
            <p style={{ fontSize: '1.4rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
              Reflections, sermon notes, and stories from our congregation as we walk through Scripture together, week by week.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Watch Latest Sermon
              </button>
              <button style={{ backgroundColor: 'transparent', color: '#eaf3f8', border: '1.5px solid #eaf3f8', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Plan a Visit
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 340px', minWidth: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1602802490525-79e3e5062d1b?auto=format&fit=crop&w=900&q=80"
              alt="Orthodox icon of Christ on the iconostasis"
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)' }}
            />
          </div>
        </div>
      </section>

      {/* SERMON SERIES */}
      <section style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div className="hanging-cross left">
          <div className="hang-string" />
          <svg width="46" height="64" viewBox="0 0 46 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="0" width="8" height="64" fill="var(--gold)" />
            <rect x="4" y="12" width="38" height="8" fill="var(--gold)" />
            <rect x="9" y="38" width="28" height="8" fill="var(--gold)" />
          </svg>
        </div>
        <div className="hanging-cross right">
          <div className="hang-string" />
          <svg width="46" height="64" viewBox="0 0 46 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="0" width="8" height="64" fill="var(--gold)" />
            <rect x="4" y="12" width="38" height="8" fill="var(--gold)" />
            <rect x="9" y="38" width="28" height="8" fill="var(--gold)" />
          </svg>
        </div>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h3 className="eyebrow" style={{ marginBottom: '44px', fontSize: '0.85rem' }}>Current Sermon Series</h3>
          {[
            { title: "Hope in Hard Seasons", desc: "Finding steadiness in Scripture when life feels uncertain.", img: "https://images.unsplash.com/photo-1594990375715-2d008aaaa31b?auto=format&fit=crop&w=800&q=80", alt: "Blue and gold Orthodox cathedral interior" },
            { title: "Living Waters", desc: "A study through John, on thirst, grace, and being made new.", img: "https://images.unsplash.com/photo-1627573897879-1eff66f2c228?auto=format&fit=crop&w=800&q=80", alt: "Low angle view of Orthodox cathedral interior" },
            { title: "Faith of Our Fathers", desc: "Lessons from the patriarchs on trust and obedience.", img: "https://images.unsplash.com/photo-1730751634426-b51669a83c85?auto=format&fit=crop&w=800&q=80", alt: "Orthodox church walls covered in icon paintings" },
            { title: "Come As You Are", desc: "Welcome, belonging, and the open table of the Gospel.", img: "https://images.unsplash.com/photo-1731440650603-a931e574c943?auto=format&fit=crop&w=800&q=80", alt: "Painted ceiling icon inside an Orthodox church" },
            { title: "The Divine Liturgy", desc: "Understanding the rhythm and meaning behind our weekly worship.", img: "https://images.unsplash.com/photo-1764231479915-62f744d20939?auto=format&fit=crop&w=800&q=80", alt: "Interior of a grand, ornate Orthodox church with detailed flooring" },
            { title: "Icons and Prayer", desc: "How sacred images draw us deeper into stillness and worship.", img: "https://images.unsplash.com/photo-1780259034206-d6d579b5378b?auto=format&fit=crop&w=800&q=80", alt: "Ancient stone wall with a religious icon and vaulted ceiling" }
          ].map((item, index, arr) => (
            <React.Fragment key={index}>
              <div style={{
                padding: '50px 0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                alignItems: 'start'
              }}>
                <img
                  src={item.img}
                  alt={item.alt}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                />
                <div style={{ marginTop: '-5px' }}>
                  <h3 style={{ fontSize: '2.8rem', margin: '0 0 15px 0', fontFamily: 'Georgia, serif', lineHeight: '1.1', fontWeight: '800', color: '#c1440e' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '1.5rem', color: '#333', margin: 0, lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
              {index < arr.length - 1 && (
                <div className="sermon-divider">
                  <span className="h-string" />
                  <svg width="16" height="24" viewBox="0 0 16 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="0" width="4" height="24" fill="var(--gold)" opacity="0.7" />
                    <rect x="0" y="5" width="16" height="4" fill="var(--gold)" opacity="0.7" />
                  </svg>
                  <svg width="22" height="32" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="0" width="4" height="32" fill="var(--gold)" />
                    <rect x="1" y="7" width="20" height="4" fill="var(--gold)" />
                    <rect x="4" y="19" width="14" height="4" fill="var(--gold)" />
                  </svg>
                  <svg width="16" height="24" viewBox="0 0 16 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="0" width="4" height="24" fill="var(--gold)" opacity="0.7" />
                    <rect x="0" y="5" width="16" height="4" fill="var(--gold)" opacity="0.7" />
                  </svg>
                  <span className="h-string" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section className="video-section">
        <div className="wrapper">
          <div className="video-heading">
            <h3>Video</h3>
            <div className="rule" />
          </div>
          <div className="video-grid">
            <div className="video-player">
              <iframe
                key={activeVideoId}
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title={activeVideoTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, border: 'none' }}
              />
            </div>
            <div>
              <div className="video-list-scroll">
                {videos.map((v, i) => (
                  <div
                    className="video-list-item"
                    key={i}
                    onClick={() => { setActiveVideoId(v.youtubeId); setActiveVideoTitle(v.title); }}
                  >
                    <div className="video-thumb-wrap">
                      <img src={v.img} alt={v.alt} />
                      {v.youtubeId === activeVideoId && <span className="now-playing-tag">NOW PLAYING</span>}
                    </div>
                    <p>{v.title}</p>
                  </div>
                ))}
              </div>
              <div className="video-view-all">View All Videos</div>
            </div>
          </div>
        </div>
      </section>

      {/* ANGEL DIVIDER */}
      <section className="angel-divider">
        <div className="wrapper">
          <div className="angel-carousel">
            <button className="angel-arrow left" aria-label="Scroll left" onClick={() => scrollAngels(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="angel-grid" ref={angelScrollRef}>
              {[
                { name: "Guardian Angel", desc: "Watching over each step of our journey.", img: "https://images.unsplash.com/photo-1565074497050-01d0fdab0472?auto=format&fit=crop&w=500&q=80", alt: "Small angel figurine" },
                { name: "Archangel Gabriel", desc: "The messenger of God's good news.", img: "https://images.unsplash.com/photo-1573823252145-4df9430b057a?auto=format&fit=crop&w=500&q=80", alt: "Angel statue in gray robe" },
                { name: "Archangel Michael", desc: "Defender of the faithful in every battle.", img: "https://images.unsplash.com/photo-1556658083-367f69a1d55a?auto=format&fit=crop&w=500&q=80", alt: "Angel statue holding a cross" },
                { name: "Archangel Raphael", desc: "Bringer of healing and gentle guidance.", img: "https://images.unsplash.com/photo-1610633706070-fec011042351?auto=format&fit=crop&w=500&q=80", alt: "Angel statue holding a staff" }
              ].map((a, i) => (
                <div
                  key={i}
                  className="angel-box"
                  style={{ backgroundImage: `url(${a.img})` }}
                  role="img"
                  aria-label={a.alt}
                >
                  <div className="angel-box-overlay">
                    <h4>{a.name}</h4>
                    <p>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="angel-arrow right" aria-label="Scroll right" onClick={() => scrollAngels(1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* MINISTRIES GRID */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper">
          <h3 className="eyebrow" style={{ marginBottom: '38px', fontSize: '0.85rem' }}>Ministries & Groups</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '26px' }}>
            {[
              { img: "https://images.unsplash.com/photo-1649105703438-0992d6844823?auto=format&fit=crop&w=600&q=80", title: "Youth Ministry", alt: "Priest standing in front of a cross" },
              { img: "https://images.unsplash.com/photo-1739061749940-124120c10264?auto=format&fit=crop&w=600&q=80", title: "Worship Team", alt: "Priest holding a cross during service" },
              { img: "https://images.unsplash.com/photo-1619371620133-1c4b489a0569?auto=format&fit=crop&w=600&q=80", title: "Community Outreach", alt: "Orthodox church building near water" },
              { img: "https://images.unsplash.com/photo-1601231656153-73aa7f115365?auto=format&fit=crop&w=600&q=80", title: "Prayer Circle", alt: "Gold candle holder with lit prayer candles" },
              { img: "https://images.unsplash.com/photo-1520276580290-de2e2ceb31b8?auto=format&fit=crop&w=600&q=80", title: "Bible Study Groups", alt: "Person in white vestment holding a rod" },
              { img: "https://images.unsplash.com/photo-1612005660287-62b37fad2eb5?auto=format&fit=crop&w=600&q=80", title: "Missions Team", alt: "Orthodox cross atop a church dome" },
              ...(showMoreMinistries ? [
                { img: "https://images.unsplash.com/photo-1764231479915-62f744d20939?auto=format&fit=crop&w=600&q=80", title: "Choir & Chanters", alt: "Ornate Orthodox church interior with detailed flooring" },
                { img: "https://images.unsplash.com/photo-1780259034206-d6d579b5378b?auto=format&fit=crop&w=600&q=80", title: "Icon Study Group", alt: "Ancient stone wall with religious icon and vaulted ceiling" },
                { img: "https://images.unsplash.com/photo-1621164871985-9bacd7a1eb87?auto=format&fit=crop&w=600&q=80", title: "Women's Fellowship", alt: "Painting of Christ and the Virgin Mary" }
              ] : [])
            ].map((item, index) => (
              <div key={index} className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.25s ease', background: '#ffffff', backdropFilter: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <img src={item.img} alt={item.alt} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', filter: 'brightness(1.25) saturate(1.1)' }} />
                <div style={{ padding: '18px' }}>
                  <h4 className="display" style={{ fontSize: '2.1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#a80070' }}>{item.title}</h4>
                  <p style={{ fontSize: '1.6rem', color: '#000000', margin: 0 }}>Gathering weekly — all are welcome.</p>
                </div>
              </div>
            ))}
          </div>
          {!showMoreMinistries && (
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button
                onClick={() => setShowMoreMinistries(true)}
                style={{
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA + ABOUT THE PASTOR + TESTIMONIES share the same deep red background */}
      <div className="cross-bg" style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <div className="cross-track left">
          {Array.from({ length: 8 }).map((_, i) => (
            <svg key={i} className="wave-cross" width="26" height="38" viewBox="0 0 26 38" xmlns="http://www.w3.org/2000/svg"
              style={{ animationDelay: `${i * 0.22}s` }}>
              <rect x="11" y="0" width="4" height="38" fill="rgba(255,255,255,0.18)" />
              <rect x="2" y="9" width="22" height="4" fill="rgba(255,255,255,0.18)" />
            </svg>
          ))}
        </div>
        <div className="cross-track right">
          {Array.from({ length: 8 }).map((_, i) => (
            <svg key={i} className="wave-cross" width="26" height="38" viewBox="0 0 26 38" xmlns="http://www.w3.org/2000/svg"
              style={{ animationDelay: `${i * 0.22 + 0.4}s` }}>
              <rect x="11" y="0" width="4" height="38" fill="rgba(255,255,255,0.18)" />
              <rect x="2" y="9" width="22" height="4" fill="rgba(255,255,255,0.18)" />
            </svg>
          ))}
        </div>
        <section style={{ textAlign: 'center' }}>
          <div className="wrapper">
            <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Come as you are. There's a place for you here.
            </h2>
          </div>
        </section>

        {/* ABOUT THE PASTOR */}
        <section>
          <div className="wrapper" style={{
            maxWidth: '880px',
            display: 'flex',
            gap: '50px',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '40px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '12px',
            backdropFilter: 'blur(6px)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1776454660072-222a8bdf122e?auto=format&fit=crop&w=400&q=80"
              alt="Priest in ornate robes holding a ceremonial staff"
              style={{ width: '260px', height: '320px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '4px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
            />
            <div style={{ flex: 1, minWidth: '260px' }}>
              <span className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>From the Pastor</span>
              <h3 className="display" style={{ fontSize: '2.4rem', fontWeight: 700, margin: '12px 0 14px 0', color: '#ffffff' }}>
                Walking together, one Sunday at a time
              </h3>
              <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, margin: 0 }}>
                Twenty years in ministry has taught me that faith grows best in community. This page is where we share
                what God is teaching us — through sermons, testimonies, and the everyday life of our church family.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* TESTIMONIES */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1080px' }}>
          <h3 className="display" style={{ fontSize: '2.6rem', fontWeight: 700, marginBottom: '44px', textAlign: 'center', color: 'var(--navy-deep)' }}>
            Testimonies from Our Church Family
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { quote: "This church walked with my family through our hardest year. We are forever grateful.", name: "Selam T.", role: "Member since 2019" },
              { quote: "I found a home here, not just a service to attend.", name: "Biniam K.", role: "Youth Ministry" },
              { quote: "The prayer circle carried me when I couldn't pray for myself.", name: "Marta A.", role: "Member since 2021" }
            ].map((t, i) => (
              <div key={i} style={{ borderTop: '2px solid var(--gold)', paddingTop: '20px' }}>
                <p className="display" style={{ fontSize: '1.55rem', fontStyle: 'italic', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.55, marginBottom: '18px' }}>
                  "{t.quote}"
                </p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--navy)' }}>{t.name}</p>
                <p className="eyebrow" style={{ marginTop: '2px', fontSize: '0.8rem' }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h3 className="eyebrow" style={{ marginBottom: '44px', fontSize: '0.85rem' }}>Photos</h3>
          <div className="photo-carousel">
            <button className="photo-arrow left" aria-label="Previous photo" onClick={showPrevPhoto}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="photo-carousel-frame">
              <img
                src={photos[photoIndex].img}
                alt={photos[photoIndex].alt}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              />
              <div style={{ marginTop: '26px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.6rem', margin: '0 0 15px 0', fontFamily: 'Georgia, serif', lineHeight: '1.1', fontWeight: '800', color: '#c1440e' }}>
                  {photos[photoIndex].title}
                </h3>
                <p style={{ fontSize: '1.3rem', color: '#333', margin: '0 auto', lineHeight: '1.6', maxWidth: '620px' }}>
                  {photos[photoIndex].desc}
                </p>
              </div>
              <div className="photo-dots">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={`photo-dot${i === photoIndex ? ' active' : ''}`}
                    onClick={() => setPhotoIndex(i)}
                  />
                ))}
              </div>
            </div>
            <button className="photo-arrow right" aria-label="Next photo" onClick={showNextPhoto}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* WEEKLY DEVOTIONAL SIGNUP */}
      <section style={{ background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)', color: '#eaf3f8' }}>
        <div className="wrapper" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <span className="eyebrow" style={{ fontSize: '0.85rem' }}>Weekly Devotional</span>
          <h3 className="display" style={{ fontSize: '2.9rem', fontWeight: 700, margin: '18px 0 18px 0' }}>
            A short reflection, delivered every Monday.
          </h3>
          <p style={{ fontSize: '1.3rem', color: '#a9c2d3', marginBottom: '32px' }}>
            One email a week — a verse, a short reflection, and this week's prayer requests.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="you@email.com"
              style={{ padding: '15px 20px', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', width: '280px', maxWidth: '80vw', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            />
            <button style={{ background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 32px', fontWeight: 700, borderRadius: '30px', cursor: 'pointer', fontSize: '1.05rem' }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

export default ChurchBlogPage;