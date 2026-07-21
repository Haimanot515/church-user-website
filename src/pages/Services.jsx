import React from "react";

/**
 * Services page — three core services:
 *  1. ኪዳን (Kidan)                 → "Kidan"
 *  2. ኪዳሴ (Kidase)                → "Divine Liturgy"
 *  3. የወንጌል ትምህርት መዝሙር (Yewongel Timihrt Mezmur) → "Gospel Teaching & Hymns"
 *
 * Uses the same outer shell as ChurchBlogPage.jsx (home page):
 * drifting cloud layer, sticky marquee nav bar, and site footer —
 * so this page reads as part of the same site.
 */
const Services = () => {
  const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

  const services = [
    {
      english: "Kidan",
      time: "Saturdays · 5:00 – 6:30 PM",
      desc:
        "A service of covenant prayer, held ahead of the Liturgy — a time of preparation, confession, and drawing near to God together as a congregation.",
      img: "https://images.unsplash.com/photo-1730751634426-b51669a83c85?auto=format&fit=crop&w=1000&q=80",
      alt: "Orthodox church walls covered in icon paintings",
    },
    {
      english: "Divine Liturgy",
      time: "Sundays & Feast Days · 6:00 – 9:00 AM",
      desc:
        "The central act of worship — the Eucharistic celebration handed down through the ancient liturgy of the church. The congregation gathers before dawn for prayer, Scripture, and Holy Communion.",
      img: "https://images.unsplash.com/photo-1602802490525-79e3e5062d1b?auto=format&fit=crop&w=1000&q=80",
      alt: "Orthodox icon of Christ on the iconostasis",
    },
    {
      english: "Gospel Teaching & Hymns",
      time: "Wednesdays · 4:00 – 6:00 PM",
      note: "Hymns are sung live by the congregation — no recordings.",
      desc:
        "A weekly gathering of Gospel study and sacred hymns — teaching from Scripture woven together with the singing of traditional hymns, open to the whole congregation.",
      img: "https://images.unsplash.com/photo-1594990375715-2d008aaaa31b?auto=format&fit=crop&w=1000&q=80",
      alt: "Blue and gold Orthodox cathedral interior",
    },
  ];

  return (
    <div className="services-portal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --navy: #1c3a52;
          --navy-deep: #0f2438;
          --slate: #3d5a6c;
          --gold: #cf9f3f;
          --white: #ffffff;
          --deep-red: #7a1010;
        }
        * { box-sizing: border-box; }
        .services-portal {
          font-family: 'Nunito Sans', sans-serif;
          background: #f3f8fa;
          color: var(--navy);
          position: relative;
        }
        .display { font-family: 'Cormorant Garamond', serif; }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold);
        }
        a { color: inherit; text-decoration: none; }
        .wrapper { max-width: 1080px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }

        /* Drifting cloud layer - same as home page */
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

        /* Sticky marquee nav bar - same as home page */
        .nav-bar {
          position: sticky; top: 0; z-index: 40;
          display: flex; align-items: center; gap: 26px;
          padding: 0 24px; height: 100px;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          overflow: hidden; white-space: nowrap;
        }
        .nav-brand {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 1.6rem;
          color: #eaf3f8; margin-right: 10px; flex-shrink: 0;
          position: relative; z-index: 2;
        }
        .nav-marquee-viewport {
          flex: 1; min-width: 0; overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
        }
        .nav-marquee-track {
          display: flex; align-items: center; gap: 26px;
          width: max-content;
          animation: navMarquee 32s linear infinite;
        }
        .nav-bar:hover .nav-marquee-track { animation-play-state: paused; }
        @keyframes navMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-marquee-track { animation: none; }
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

        .services-hero {
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          padding: 90px 0 70px 0;
          text-align: center;
        }
        .services-hero h1 {
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          font-weight: 700; color: #eaf3f8; margin: 16px 0 18px 0;
        }
        .services-hero p {
          font-size: 1.2rem; color: #a9c2d3; max-width: 560px;
          margin: 0 auto; line-height: 1.65;
        }

        .services-list { padding: 80px 0; }
        .service-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          padding: 56px 0;
        }
        .service-row:not(:last-child) { border-bottom: 1px solid rgba(28,58,82,0.12); }
        .service-row.reverse .service-img { order: 2; }
        .service-row.reverse .service-copy { order: 1; }

        .service-img img {
          width: 100%; aspect-ratio: 4/3; object-fit: cover;
          border-radius: 10px; box-shadow: 0 16px 30px rgba(15,36,56,0.18);
        }
        .service-copy .service-cross { margin-bottom: 18px; }
        .service-copy h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem; font-weight: 700;
          color: var(--navy-deep); margin: 0 0 12px 0;
        }
        .service-copy .time {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--gold); margin: 0 0 16px 0;
        }
        .service-copy p.desc {
          font-size: 1.08rem; line-height: 1.7; color: #33475a; margin: 0;
        }
        .service-copy p.note {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.82rem; color: var(--slate);
          margin: 0 0 14px 0; font-style: italic;
        }

        @media (max-width: 760px) {
          .service-row, .service-row.reverse { grid-template-columns: 1fr; }
          .service-row.reverse .service-img,
          .service-row.reverse .service-copy { order: initial; }
        }

        .services-cta {
          background: var(--deep-red);
          text-align: center;
          padding: 70px 0;
        }
        .services-cta h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 700; color: #fff; margin: 0 0 14px 0;
        }
        .services-cta p { color: rgba(255,255,255,0.85); font-size: 1.1rem; margin: 0; }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <section className="services-hero">
        <div className="wrapper">
          <h1 className="display">Our Services</h1>
          <p>From covenant prayer, to the sacred rhythm of the Liturgy, to the teaching and hymns that carry it through the week — every service is open to all.</p>
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

      <section className="services-list">
        <div className="wrapper">
          {services.map((s, i) => (
            <div className={`service-row${i % 2 === 1 ? " reverse" : ""}`} key={i}>
              <div className="service-img">
                <img src={s.img} alt={s.alt} />
              </div>
              <div className="service-copy">
                <svg className="service-cross" width="22" height="32" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="0" width="4" height="32" fill="var(--gold)" />
                  <rect x="1" y="12" width="20" height="4" fill="var(--gold)" />
                </svg>
                <h2>{s.english}</h2>
                <p className="time">{s.time}</p>
                {s.note && <p className="note">{s.note}</p>}
                <p className="desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="services-cta">
        <div className="wrapper">
          <h3 className="display">Come as you are.</h3>
          <p>All are welcome at Kidan, the Divine Liturgy, and Gospel Teaching & Hymns — no invitation needed.</p>
        </div>
      </section>

      {/* FOOTER - same as home page */}
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

export default Services;