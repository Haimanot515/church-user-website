import React, { useEffect, useState } from "react";

const ChurchPage = () => {
  const [showConstructionAd, setShowConstructionAd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConstructionAd(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismissConstructionAd = () => setShowConstructionAd(false);

  // TODO: replace with your real details — this is the church you currently serve at
  const currentChurch = {
    name: "Harbor Light — Eastside",
    role: "Where I Serve Now",
    pastorRole: "Associate Pastor",
    address: "88 Founders Road, Addis Ababa",
    service: "Sundays · 10:00 AM",
    phone: "+251 11 555 0142",
    email: "eastside@harborlight.church",
    since: "Serving since 2021",
    description:
      "Eastside is home for me — a growing congregation where I lead worship, teach midweek study, and walk alongside families throughout the week. If you're new, I'd love to meet you after the 10:00 AM service.",
    img: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=1200&q=80",
    alt: "Small chapel with wooden pews where I currently serve"
  };

  const posts = [
    {
      tag: "Heritage",
      title: "Ethiopia's Ancient Faith",
      excerpt:
        "Long before most of Europe had heard the Gospel, the Kingdom of Aksum had already made Christianity its state religion under King Ezana in the 4th century — making Ethiopia one of the very first Christian nations on earth.",
      img: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80",
      alt: "Sunlight streaming through a church interior"
    },
    {
      tag: "Architecture",
      title: "The Rock-Hewn Churches of Lalibela",
      excerpt:
        "Carved directly out of solid volcanic rock in the 12th and 13th centuries, the eleven monolithic churches of Lalibela remain one of the most extraordinary feats of faith and craftsmanship in Christian history.",
      img: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=900&q=80",
      alt: "Small stone chapel interior"
    },
    {
      tag: "Community",
      title: "Faith in the Highlands Today",
      excerpt:
        "From the drumbeats of Timkat to the bonfires of Meskel, the rhythms of the Ethiopian church calendar still shape daily life — knitting together generations of believers in cities and highland villages alike.",
      img: "https://images.unsplash.com/photo-1465378552210-6900a2e5a4c0?auto=format&fit=crop&w=900&q=80",
      alt: "Chapel exterior at dusk"
    },
    {
      tag: "Language & Liturgy",
      title: "The Ge'ez Tongue of Worship",
      excerpt:
        "Ge'ez, an ancient Semitic language no longer spoken day to day, still carries the liturgy of the Ethiopian Orthodox Tewahedo Church — its chants and manuscripts preserving a living link to the earliest centuries of the faith.",
      img: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&w=900&q=80",
      alt: "Old manuscript pages"
    },
    {
      tag: "Pilgrimage",
      title: "Walking the Path to Aksum",
      excerpt:
        "Each year, pilgrims travel on foot for days to reach Aksum, believed by many to hold the Ark of the Covenant — a journey of endurance that mirrors the deeper spiritual pilgrimage at the heart of the faith.",
      img: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=900&q=80",
      alt: "Pilgrims walking a highland road"
    },
    {
      tag: "Festival",
      title: "Timkat: Ethiopia's Epiphany",
      excerpt:
        "Every January, streets fill with color as replicas of the Ark are carried in procession to be blessed near water — a three-day celebration of baptism and renewal that draws entire communities together.",
      img: "https://images.unsplash.com/photo-1508261303786-0aa5d5d4de10?auto=format&fit=crop&w=900&q=80",
      alt: "Colorful festival procession"
    },
    {
      tag: "Art & Craft",
      title: "Icons Painted in Devotion",
      excerpt:
        "Ethiopian religious art, with its bold color and distinctive large eyes, has developed its own visual language over centuries — icons that serve not as decoration but as windows into prayer.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
      alt: "Traditional religious icon painting"
    },
    {
      tag: "Legacy",
      title: "Monasteries of Lake Tana",
      excerpt:
        "Scattered across the islands of Lake Tana, centuries-old monasteries hold some of Ethiopia's oldest religious manuscripts and paintings, tended quietly by monks who continue a tradition unbroken for generations.",
      img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
      alt: "Monastery on a lake island"
    }
  ];

  const campuses = [
    {
      name: "Harbor Light — Downtown",
      role: "Sunday Service",
      address: "214 Wharf Street, Addis Ababa",
      service: "Sundays · 9:00 & 11:00 AM",
      img: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80",
      alt: "Downtown church sanctuary filled with light"
    },
    {
      name: "Harbor Light — Eastside",
      role: "Sunday Service",
      address: "88 Founders Road, Addis Ababa",
      service: "Sundays · 10:00 AM",
      img: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=900&q=80",
      alt: "Small chapel with wooden pews"
    },
    {
      name: "Harbor Light — Riverside",
      role: "Sunday Service",
      address: "12 Mill Lane, Addis Ababa",
      service: "Sundays · 8:30 AM",
      img: "https://images.unsplash.com/photo-1465378552210-6900a2e5a4c0?auto=format&fit=crop&w=900&q=80",
      alt: "Riverside chapel exterior at dusk"
    }
  ];

  return (
    <div className="church-page">
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

        .church-page {
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

        /* ---- IMAGE HERO ---- */
        .church-hero {
          position: relative;
          width: 100%;
          height: 78vh;
          min-height: 500px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }
        .church-hero img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .church-hero::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(15,36,56,0.10) 0%, rgba(15,36,56,0.30) 50%, rgba(15,36,56,0.90) 100%);
        }
        .church-hero-content {
          position: relative; z-index: 2;
          width: 100%;
          padding: 0 24px 68px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .church-hero-content .eyebrow { color: var(--gold); }
        .church-hero-content h1 {
          font-size: clamp(2.6rem, 5.6vw, 4.4rem);
          font-weight: 700; line-height: 1.08;
          color: #f3f6f8; margin: 16px 0 18px 0;
          max-width: 760px;
        }
        .church-hero-content p {
          font-size: 1.2rem; color: #c7d6e0; max-width: 560px; line-height: 1.6; margin: 0 0 28px 0;
        }
        .hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--gold); color: var(--navy-deep); border: none;
          padding: 15px 30px; font-weight: 700; font-size: 1rem;
          border-radius: 4px; cursor: pointer; letter-spacing: 0.02em;
        }

        /* ---- WHERE I SERVE NOW ---- */
        .serve-now-section { padding: 90px 0 0 0; }
        .serve-now-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(15,36,56,0.10);
        }
        @media (max-width: 780px) {
          .serve-now-card { grid-template-columns: 1fr; }
        }
        .serve-now-img-wrap { position: relative; min-height: 320px; }
        .serve-now-img-wrap img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
        }
        .serve-now-badge {
          position: absolute; top: 18px; left: 18px;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; letter-spacing: 0.1em;
          text-transform: uppercase; font-weight: 600;
          background: var(--gold); color: var(--navy-deep);
          padding: 6px 12px; border-radius: 20px;
        }
        .serve-now-body {
          padding: 40px 42px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .serve-now-role {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--rust); font-weight: 500; margin-bottom: 10px;
        }
        .serve-now-body h2 {
          font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700;
          color: var(--navy-deep); margin: 0 0 6px 0; line-height: 1.15;
        }
        .serve-now-since {
          font-size: 0.86rem; color: var(--slate); margin-bottom: 18px; font-style: italic;
        }
        .serve-now-desc {
          font-size: 1rem; color: var(--slate); line-height: 1.65; margin: 0 0 22px 0;
        }
        .serve-now-details {
          display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;
        }
        .serve-now-line {
          display: flex; align-items: baseline; gap: 8px; font-size: 0.94rem; color: var(--slate);
        }
        .serve-now-line strong { color: var(--navy); font-weight: 700; min-width: 84px; display: inline-block; }
        .serve-now-cta {
          align-self: flex-start;
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--navy-deep); color: #f3f6f8; border: none;
          padding: 13px 26px; font-weight: 700; font-size: 0.92rem;
          border-radius: 4px; cursor: pointer; letter-spacing: 0.02em;
        }

        /* ---- CHURCHES WE SERVE ---- */
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

        /* ---- BLOG ---- */
        .blog-section { padding: 100px 0; }
        .blog-head { max-width: 680px; margin: 0 auto 56px auto; text-align: center; }
        .blog-head h2 {
          font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin: 14px 0 16px 0; color: var(--navy-deep);
        }
        .blog-head p { font-size: 1.1rem; color: var(--slate); line-height: 1.6; }

        .blog-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;
        }
        @media (max-width: 860px) { .blog-grid { grid-template-columns: 1fr; } }

        .blog-card {
          background: #ffffff; border-radius: 8px; overflow: hidden;
          box-shadow: 0 10px 24px rgba(15,36,56,0.08);
        }
        .blog-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .blog-card-body { padding: 22px 24px 26px 24px; }
        .blog-tag {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--rust); font-weight: 500; margin-bottom: 8px;
        }
        .blog-card h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.55rem; font-weight: 700;
          color: var(--navy-deep); margin: 0 0 10px 0; line-height: 1.2;
        }
        .blog-card p { font-size: 0.96rem; color: var(--slate); line-height: 1.55; margin: 0 0 16px 0; }
        .read-more {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.76rem; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--navy-deep); font-weight: 500;
          background: none; border: none; padding: 0; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .read-more svg { width: 13px; height: 13px; }

        /* ---- CONSTRUCTION AD (full width, white, overlay inside hero) ---- */
        .construction-ad {
          position: fixed;
          z-index: 30;
          left: 24px;
          right: 24px;
          top: 65px;
          bottom: 24px;
          width: auto;
          max-width: none;
          margin: 0;
          background: #ffffff;
          border: 1px solid rgba(15,36,56,0.10);
          border-radius: 10px;
          box-shadow: 0 20px 44px rgba(0,0,0,0.35);
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px);
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.4s ease;
          display: flex;
          align-items: stretch;
        }
        .construction-ad.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .construction-ad-img-wrap { position: relative; width: 380px; flex: 0 0 380px; height: 100%; }
        .construction-ad-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .construction-ad-badge {
          position: absolute; top: 12px; left: 12px;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; letter-spacing: 0.09em;
          text-transform: uppercase; font-weight: 600;
          background: var(--rust); color: #f6f2ea;
          padding: 5px 11px; border-radius: 20px;
        }
        .construction-ad-close {
          position: absolute; top: 16px; right: 16px;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(15,36,56,0.18); background: #ffffff;
          color: var(--navy-deep); cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(15,36,56,0.2);
          z-index: 4;
        }
        .construction-ad-close svg { width: 15px; height: 15px; }

        .construction-ad-body {
          padding: 32px 40px;
          flex: 1;
          display: flex; flex-direction: column; justify-content: center;
        }
        .construction-ad-body h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 700;
          color: var(--navy-deep); margin: 10px 0 12px 0; line-height: 1.18;
        }
        .construction-ad-body p {
          font-size: 0.98rem; color: var(--slate); line-height: 1.6; margin: 0 0 20px 0; max-width: 420px;
        }
        .ad-progress-label {
          display: flex; justify-content: space-between; align-items: baseline;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: var(--slate);
          margin-bottom: 6px;
        }
        .ad-progress-label strong { color: var(--rust); font-size: 0.78rem; }
        .ad-progress-track {
          width: 100%; height: 6px; border-radius: 4px;
          background: rgba(15,36,56,0.10); overflow: hidden; margin-bottom: 16px;
        }
        .ad-progress-fill { height: 100%; border-radius: 4px; background: var(--gold); }

        .construction-ad-support-btn {
          align-self: flex-start;
          background: var(--navy-deep); color: #f3f6f8; border: none;
          padding: 11px 22px; font-weight: 700; font-size: 0.88rem;
          border-radius: 4px; cursor: pointer; letter-spacing: 0.02em;
        }
        @media (max-width: 640px) {
          .construction-ad { flex-direction: column; left: 16px; right: 16px; top: 65px; bottom: 16px; }
          .construction-ad-img-wrap { width: 100%; flex-basis: auto; height: 40%; }
          .construction-ad-body { padding: 20px 22px; }
        }
      `}</style>

      <section className="church-hero">
        <img
          src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=80"
          alt="A beautiful church filled with light"
        />
        <div className="church-hero-content">
          <span className="eyebrow">Our Church</span>
          <h1 className="display">A living faith, rooted in ancient soil.</h1>
          <p>From the highlands of Aksum to the halls we gather in today, our story is part of one of the oldest continuous Christian traditions on earth.</p>
          <button className="hero-cta">Read Our Story</button>
        </div>
      </section>

      {showConstructionAd && (
        <div style={{ background: 'var(--navy-deep)', padding: '1px 24px 40px 24px' }}>
          <div className="construction-ad visible">
            <div className="construction-ad-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80"
                alt="Church building under construction"
              />
              <span className="construction-ad-badge">Under Construction</span>
            </div>
            <button className="construction-ad-close" onClick={dismissConstructionAd} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="construction-ad-body">
              <span className="eyebrow">Building For Tomorrow</span>
              <h3>A new home for a growing church</h3>
              <p>Our Eastside campus has outgrown its walls — help us build a larger sanctuary for the families joining us each week.</p>
              <div className="ad-progress-label">
                <span>Progress</span>
                <strong>62% complete</strong>
              </div>
              <div className="ad-progress-track">
                <div className="ad-progress-fill" style={{ width: "62%" }} />
              </div>
              <button className="construction-ad-support-btn">Support the Build</button>
            </div>
          </div>
        </div>
      )}

      <section className="serve-now-section">
        <div className="wrapper">
          <div className="serve-now-card">
            <div className="serve-now-img-wrap">
              <img src={currentChurch.img} alt={currentChurch.alt} />
              <span className="serve-now-badge">{currentChurch.role}</span>
            </div>
            <div className="serve-now-body">
              <span className="serve-now-role">{currentChurch.pastorRole}</span>
              <h2 className="display">{currentChurch.name}</h2>
              <div className="serve-now-since">{currentChurch.since}</div>
              <p className="serve-now-desc">{currentChurch.description}</p>
              <div className="serve-now-details">
                <div className="serve-now-line"><strong>Address:</strong> {currentChurch.address}</div>
                <div className="serve-now-line"><strong>Service:</strong> {currentChurch.service}</div>
                <div className="serve-now-line"><strong>Phone:</strong> {currentChurch.phone}</div>
                <div className="serve-now-line"><strong>Email:</strong> {currentChurch.email}</div>
              </div>
              <button className="serve-now-cta">
                Visit This Campus
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="campuses-section">
        <div className="wrapper">
          <div className="campuses-head">
            <span className="eyebrow">Where We Gather</span>
            <h2 className="display">The churches it serves</h2>
            <p>One community, gathered every Sunday across three campuses — each with its own rhythm, but the same commitment to the Word.</p>
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

      <section className="blog-section">
        <div className="wrapper">
          <div className="blog-head">
            <span className="eyebrow">From the Journal</span>
            <h2 className="display">The church in Ethiopia</h2>
            <p>A closer look at the history, architecture, and living traditions that shape our faith community.</p>
          </div>

          <div className="blog-grid">
            {posts.map((p) => (
              <div className="blog-card" key={p.title}>
                <img src={p.img} alt={p.alt} />
                <div className="blog-card-body">
                  <div className="blog-tag">{p.tag}</div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <button className="read-more">
                    Read more
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChurchPage;