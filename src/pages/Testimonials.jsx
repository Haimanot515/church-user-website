import React, { useState } from "react";

const PastorTravelPage = () => {
  const categories = ["Home", "Reflections", "Sermons", "Journal", "Books I'm Reading", "Family", "Travel", "Prayer", "Archive", "About Me", "Contact"];

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTrip, setActiveTrip] = useState(0);

  const quickFacts = [
    { label: "Countries Visited", value: "14, and counting" },
    { label: "Favorite Trip So Far", value: "Kenya, mission year, 2019" },
    { label: "Next Departure", value: "Scotland sabbatical — September" },
    { label: "Packing Philosophy", value: "One bag, always. No exceptions." },
    { label: "Travel Companion", value: "Usually my wife, sometimes the whole family" },
    { label: "Souvenir Of Choice", value: "A local hymn book or prayer written by hand" }
  ];

  const upcomingTrips = [
    {
      img: "https://images.unsplash.com/photo-1500881308878-4bf1d5872c3e?auto=format&fit=crop&w=900&q=80",
      alt: "Rolling green hills and a stone path in the Scottish countryside",
      title: "Scotland Sabbatical",
      date: "September 2026",
      desc: "A month away to rest and read on Iona again, this time with Miriam. No sermon to prepare, no meetings to run — just the sea, some old books, and a chapel that's been praying longer than either of us has been alive."
    },
    {
      img: "https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&w=900&q=80",
      alt: "Colorful hillside houses in a Central American town",
      title: "Guatemala Mission Trip",
      date: "Spring 2027",
      desc: "A team from the congregation is heading out to partner with a church we've supported for years, finishing a classroom addition and running a week of vacation Bible school alongside the local families."
    },
    {
      img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
      alt: "Coastal cliffs and whitewashed buildings in Portugal",
      title: "Family Trip: Portugal",
      date: "Summer 2027",
      desc: "Half vacation, half education, like always. The kids picked this one — they want to see the tile work in Porto and the coastline everyone keeps telling us about."
    },
    {
      img: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=80",
      alt: "Ancient stone obelisks against a clear sky in Ethiopia",
      title: "Day Pilgrimage: Axum",
      date: "October 2026",
      desc: "One of those trips that needs no suitcase. A few of us are driving up for the day to walk among the stelae and pray somewhere history has been praying for a very long time."
    }
  ];

  const travelKinds = [
    { title: "Mission Trips", value: "Short-term, team-based", desc: "A week or two, usually with a team from Harbor Light, building something, teaching something, or simply being present somewhere that needed us." },
    { title: "Sabbatical Travel", value: "Longer, slower, solo or with Miriam", desc: "Every few years the elders send me away for a month to rest, read, and remember why I started doing this in the first place." },
    { title: "Family Trips", value: "The kids come too", desc: "Half vacation, half education. We try to see one thing that matters to history and one thing that matters to nobody but us." },
    { title: "Day Pilgrimages", value: "No suitcase required", desc: "A drive to an old monastery, a border town, a place with one good story — gone before dinner, changed a little by evening." }
  ];

  const trips = [
    {
      place: "Kericho, Kenya",
      year: "2019",
      title: "The year the church built a well",
      body: "We went for two weeks to help finish a well that had stalled for lack of funds. We stayed for the better part of a year. I learned more about patience from the pace of that project than from any seminary course, and I still think about the sound of that pump the first morning it worked."
    },
    {
      place: "Isle of Iona, Scotland",
      year: "2022",
      title: "Four weeks of almost nothing",
      body: "My first real sabbatical. No sermon to write, no meetings to run. Mostly I walked, read old prayer books, and sat with people who'd been praying in that same small chapel for fifty years. I came home slower, and it took months for that to wear off — which was the point."
    },
    {
      place: "Lalibela, Ethiopia",
      year: "2023",
      title: "A pilgrimage closer to home",
      body: "You don't always need a passport to be changed. The rock-hewn churches here are a four-hour drive from my own front door, and I'd never made the trip until my youngest asked why. We went the next month, candles and all."
    },
    {
      place: "Chiang Rai, Thailand",
      year: "2024",
      title: "A team, a school, a language I didn't speak",
      body: "Ten days building bunk beds for a children's home with six people from our congregation who'd never left Ethiopia before. Watching them fall in love with a place that shares almost nothing with home was, quietly, one of my favorite trips to lead rather than take."
    }
  ];

  const faqs = [
    { q: "Do you take members of the congregation on these trips?", a: "Yes, most of them. Mission trips especially are almost always a team — I'll post an open call here and in the bulletin a few months ahead of each one." },
    { q: "How do you decide where to go for a mission trip?", a: "Usually a relationship comes first — a partner church, a missionary we already support, a need someone brought to us directly. We try not to go somewhere just because it sounded meaningful on paper." },
    { q: "Can I request prayer for my own upcoming trip?", a: "Please do. Send it through the contact page or mention it Wednesday night — travel prayers are some of my favorites to pray, oddly specific as they usually are." },
    { q: "Do you ever just travel for rest, with no ministry attached?", a: "I try to, though I'm not always good at it. Sabbatical travel is meant to be exactly that, and I'm learning — slowly — to let a trip be only for rest without turning it into a project." }
  ];

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
        .display { font-family: 'Cormorant Garamond', serif; }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold);
        }
        a { color: inherit; text-decoration: none; }

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
        .nav-brand { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.6rem; color: #eaf3f8; margin-right: 10px; flex-shrink: 0; }
        .nav-item { font-size: 1.05rem; font-weight: 700; color: #ffffff; cursor: pointer; flex-shrink: 0; position: relative; padding: 4px 0; transition: color 0.2s ease; }
        .nav-item:hover { color: var(--gold); }
        .nav-item::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px; background: var(--gold); transition: width 0.25s ease; }
        .nav-item:hover::after { width: 100%; }
        .nav-item.active { color: var(--gold); }
        .nav-item.active::after { width: 100%; }

        .card { background: rgba(255,255,255,0.7); border: 1px solid rgba(28,58,82,0.10); border-radius: 12px; backdrop-filter: blur(6px); }

        .fixed-cross {
          position: absolute; top: 26px;
          display: flex; flex-direction: column; align-items: center;
          z-index: 3; pointer-events: none;
        }
        .fixed-cross.left { left: 4%; }
        .fixed-cross.right { right: 4%; }
        .fixed-cross svg { filter: drop-shadow(0 6px 10px rgba(15,36,56,0.25)); }
        @media (max-width: 900px) { .fixed-cross { display: none; } }

        .fact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(255,255,255,0.14); border-radius: 12px; overflow: hidden; }
        .fact-item { background: rgba(255,255,255,0.06); padding: 26px 28px; }
        .fact-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin: 0 0 8px 0; }
        .fact-value { font-size: 1.15rem; color: #eaf3f8; margin: 0; line-height: 1.4; }
        @media (max-width: 600px) { .fact-grid { grid-template-columns: 1fr; } }

        .pull-quote { border-left: 4px solid var(--gold); padding-left: 30px; margin: 0; }

        /* UPCOMING TRIPS GRID */
        .upcoming-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
        @media (max-width: 650px) { .upcoming-grid { grid-template-columns: 1fr; } }
        .upcoming-card {
          overflow: hidden;
          transition: transform 0.25s ease;
        }
        .upcoming-card:hover { transform: translateY(-4px); }
        .upcoming-card img {
          width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block;
          border-radius: 8px; box-shadow: 0 12px 26px rgba(15,36,56,0.14);
        }
        .upcoming-card-body { padding: 22px 4px 0 4px; }
        .upcoming-card-date {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 8px;
        }
        .upcoming-card-title {
          font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 700;
          color: var(--navy-deep); margin: 0 0 12px 0; line-height: 1.15;
        }
        .upcoming-card-desc { font-size: 1.02rem; color: #3d5a6c; line-height: 1.65; margin: 0; }

        /* TRAVEL KIND GRID */
        .reach-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
        @media (max-width: 650px) { .reach-grid { grid-template-columns: 1fr; } }
        .reach-card {
          padding: 32px;
          border-radius: 12px;
          background: rgba(255,255,255,0.7);
          border-left: 3px solid var(--gold);
          border-top: 1px solid rgba(28,58,82,0.1);
          border-right: 1px solid rgba(28,58,82,0.1);
          border-bottom: 1px solid rgba(28,58,82,0.1);
        }
        .reach-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem; font-weight: 500; color: var(--navy);
          margin: 6px 0 12px 0; word-break: break-word;
        }

        /* TRIP LOG */
        .trip-layout { display: grid; grid-template-columns: 260px 1fr; gap: 46px; }
        @media (max-width: 800px) { .trip-layout { grid-template-columns: 1fr; } }
        .trip-list { display: flex; flex-direction: column; gap: 2px; }
        .trip-tab {
          text-align: left; background: rgba(255,255,255,0.04); border: none;
          border-left: 3px solid transparent; padding: 16px 18px; cursor: pointer;
          color: rgba(234,243,248,0.65); font-family: 'Nunito Sans', sans-serif;
        }
        .trip-tab.active { background: rgba(255,255,255,0.09); border-left: 3px solid var(--gold); color: #eaf3f8; }
        .trip-tab-place { font-weight: 700; font-size: 1.05rem; display: block; }
        .trip-tab-year { font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; color: var(--gold); }
        .trip-detail-title { font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 700; color: #eaf3f8; margin: 0 0 16px 0; }
        .trip-detail-body { font-size: 1.08rem; line-height: 1.75; color: rgba(234,243,248,0.82); max-width: 600px; }

        /* FAQ */
        .faq-item { border-bottom: 1px solid rgba(28,58,82,0.14); }
        .faq-item:first-child { border-top: 1px solid rgba(28,58,82,0.14); }
        .faq-question {
          width: 100%; text-align: left; background: none; border: none; cursor: pointer;
          padding: 24px 0; display: flex; justify-content: space-between; align-items: center;
          gap: 20px; font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700;
          color: var(--navy-deep);
        }
        .faq-toggle {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          border: 1.5px solid var(--gold); color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-family: 'IBM Plex Mono', monospace;
        }
        .faq-answer { padding: 0 0 26px 0; font-size: 1.05rem; color: #3d5a6c; line-height: 1.65; max-width: 640px; }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

  

      {/* HERO IMAGE */}
      <div
        className="hero-image"
        style={{
          width: '100%',
          height: 'clamp(320px, 52vw, 620px)',
          backgroundImage: "url('https://images.unsplash.com/photo-1698350876380-0c7c97a3c1e4?fm=jpg&q=80&w=2400&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* HERO TEXT */}
      <section style={{ padding: '70px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 26px 0', color: '#eaf3f8' }}>
            Notes from wherever the road led this time
          </h1>
          <p style={{ fontSize: '1.35rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '0', maxWidth: '560px' }}>
            Mission trips, sabbaticals, and the occasional family detour — this is where I keep the
            stories that didn't fit in a sermon. Scroll for the trip log, or jump to what's coming up next.
          </p>
        </div>
      </section>
    {/* NAV */}
      <nav className="nav-bar">
        <span className="nav-brand">Daniel&nbsp;Worku</span>
        {categories.map(cat => <span key={cat} className="nav-item">{cat}</span>)}
      </nav>
      {/* WHAT'S COMING UP NEXT */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)' }}>
            A few trips already on the calendar
          </h2>
          <div className="upcoming-grid">
            {upcomingTrips.map((t, i) => (
              <div className="upcoming-card" key={i}>
                <img src={t.img} alt={t.alt} />
                <div className="upcoming-card-body">
                  <span className="upcoming-card-date">{t.date}</span>
                  <h4 className="upcoming-card-title">{t.title}</h4>
                  <p className="upcoming-card-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK FACTS BAND */}
      <div style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <section style={{ padding: '64px 0' }}>
          <div className="wrapper">
            <h3 className="eyebrow" style={{ marginBottom: '28px', fontSize: '0.85rem' }}>Before You Read</h3>
            <div className="fact-grid">
              {quickFacts.map((f, i) => (
                <div className="fact-item" key={i}>
                  <p className="fact-label">{f.label}</p>
                  <p className="fact-value">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* WAYS I TRAVEL */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)' }}>
            Four kinds of trip, four different reasons
          </h2>
          <div className="reach-grid">
            {travelKinds.map((m, i) => (
              <div className="reach-card" key={i}>
                <h4 className="display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--navy-deep)' }}>{m.title}</h4>
                <p className="reach-value">{m.value}</p>
                <p style={{ fontSize: '1rem', color: '#3d5a6c', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRIP LOG */}
      <div style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <div className="fixed-cross left">
          <svg width="46" height="64" viewBox="0 0 46 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="0" width="8" height="64" fill="var(--gold)" />
            <rect x="4" y="12" width="38" height="8" fill="var(--gold)" />
            <rect x="9" y="38" width="28" height="8" fill="var(--gold)" />
          </svg>
        </div>
        <section>
          <div className="wrapper">
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 40px 0', color: '#ffffff' }}>
              A few places I keep coming back to, in memory if not in person
            </h2>
            <div className="trip-layout">
              <div className="trip-list">
                {trips.map((t, i) => (
                  <button
                    key={i}
                    className={`trip-tab${activeTrip === i ? " active" : ""}`}
                    onClick={() => setActiveTrip(i)}
                  >
                    <span className="trip-tab-place">{t.place}</span>
                    <span className="trip-tab-year">{t.year}</span>
                  </button>
                ))}
              </div>
              <div>
                <h4 className="display trip-detail-title">{trips[activeTrip].title}</h4>
                <p className="trip-detail-body">{trips[activeTrip].body}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--navy-deep)' }}>
            A Few Common Questions

          </h2>
          <div>
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq-toggle">{openFaq === i ? "–" : "+"}</span>
                </button>
                {openFaq === i && <p className="faq-answer">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <p className="pull-quote display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.5 }}>
            "Every trip I've taken has taught me the same lesson from a different angle: God was already
            there before I arrived, and He'll stay long after I've gone home."
          </p>
          <p style={{ marginTop: '26px', fontSize: '1.1rem', color: '#3d5a6c' }}>— Daniel</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--navy-deep)', color: '#89a3b5', padding: '60px 0 30px 0', borderBottom: '6px solid var(--deep-red)' }}>
        <div className="wrapper">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '38px', marginBottom: '44px' }}>
            <div>
              <h4 className="display" style={{ color: '#eaf3f8', fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>Daniel Worku</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Pastor at Harbor Light Church. Writing about faith, family, and the ordinary work of ministry.</p>
            </div>
            {[
              { title: "Read", items: ["Latest Posts", "Journal", "Sermon Notes", "Archive"] },
              { title: "About", items: ["My Story", "Family", "Books I Recommend"] },
              { title: "Connect", items: ["Email Me", "Instagram", "YouTube"] }
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
            <p className="eyebrow" style={{ margin: 0, fontSize: '0.85rem' }}>© 2026 Daniel Worku</p>
            <p className="eyebrow" style={{ margin: 0, fontSize: '0.85rem' }}>Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PastorTravelPage;