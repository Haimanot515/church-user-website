import React, { useState } from "react";

const PastorAboutMePage = () => {
  const categories = ["Home", "Reflections", "Sermons", "Journal", "Books I'm Reading", "Family", "Prayer", "Archive", "About Me", "Contact"];

  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    { year: "1979", title: "Born in Addis Ababa", desc: "The second of five children, raised in a home where Scripture was read at breakfast and questions were always welcome." },
    { year: "2001", title: "A Call I Tried to Ignore", desc: "I studied engineering, not theology. It took a quiet, persistent sense of calling — and a patient mentor — before I stopped resisting it." },
    { year: "2006", title: "Seminary and Selam", desc: "I met my wife, Selam, in my first year of seminary. She still edits every sermon before I preach it, and it always gets better." },
    { year: "2010", title: "First Church, First Funeral", desc: "My first assignment was a small congregation of forty. I buried my first parishioner three weeks in, and it changed how I read the Psalms." },
    { year: "2020", title: "Coming to Harbor Light", desc: "I've now pastored here longer than anywhere else. It's the closest thing to home a church has ever felt like." },
    { year: "2026", title: "Still Learning", desc: "Twenty-five years in, I preach less certainly and pray more honestly than I used to. I count that as growth." }
  ];

  const education = [
    { years: "1997 – 2001", degree: "B.Sc. in Civil Engineering", school: "Addis Ababa University", note: "Where I learned to build things that hold weight — a habit that never really left me." },
    { years: "2002 – 2006", degree: "M.Div., Master of Divinity", school: "Ethiopian Graduate School of Theology", note: "Four years of Greek, Hebrew, and slowly learning to ask better questions than I answer." },
    { years: "2013 – 2015", degree: "Certificate in Pastoral Counseling", school: "Nairobi Institute of Pastoral Studies", note: "Taken after realizing seminary hadn't prepared me for grief the way I needed." },
    { years: "2022", degree: "Sabbatical Study, Spiritual Formation", school: "Regent College, Vancouver", note: "Three months of silence, long walks, and rediscovering why I said yes to this in the first place." }
  ];


  const dreams = [
    { title: "A Sabbatical Year", desc: "To take a full year, someday, to write, rest, and simply be present with Selam and the kids without a Sunday looming." },
    { title: "A Book Worth Finishing", desc: "I have three unfinished manuscripts. I'd love to actually finish one — on grief, prayer, and the space between them." },
    { title: "A Church That Outlasts Me", desc: "My deepest hope isn't for a bigger congregation, but for a healthier one — one that thrives long after I'm gone." },
    { title: "To Plant One More Church", desc: "There's a neighborhood twenty minutes from here with no congregation at all. I think about it more than I say out loud." }
  ];

  const specialThanks = [
    { name: "Yohannes Bekele", role: "Associate Pastor", desc: "Preaches once a month so I can rest, and never once made it feel like a favor.", img: "https://images.unsplash.com/photo-1624224416603-c908080780b1?auto=format&fit=crop&w=300&q=80" },
    { name: "Simeon Tesfaye", role: "Church Elder", desc: "Has sat with me through every hard board meeting for the last decade.", img: "https://images.unsplash.com/photo-1549043671-1e4550948355?auto=format&fit=crop&w=300&q=80" },
    { name: "Hana Girma", role: "Ministry Assistant", desc: "Keeps the whole calendar straight so I can actually show up when it matters.", img: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?auto=format&fit=crop&w=300&q=80" },
    { name: "Meron Alemu", role: "Worship Leader", desc: "Turns Sunday mornings into something people actually want to wake up for.", img: "https://images.unsplash.com/photo-1569925444984-9e2e5fc3d1fb?auto=format&fit=crop&w=300&q=80" }
  ];

  const location = {
    city: "Addis Ababa, Ethiopia",
    address: "Harbor Light Church, Bole Road, Addis Ababa",
    note: "I write most mornings from a small office behind the sanctuary, or from a corner table at the coffee shop two doors down.",
    serviceTimes: ["Sunday — 9:00 & 11:00 AM", "Wednesday Prayer — 6:30 PM"]
  };

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

        .cross-track {
          position: absolute; top: 0; bottom: 0; width: 50px;
          display: flex; flex-direction: column; justify-content: space-around; align-items: center;
          pointer-events: none; z-index: 0;
        }
        .cross-track.left { left: 3%; }
        .cross-track.right { right: 3%; }
        .wave-cross { animation: waveMotion 3.2s ease-in-out infinite; }
        @keyframes waveMotion { 0% { transform: translateX(-14px) scaleX(0.85); } 50% { transform: translateX(14px) scaleX(1.2); } 100% { transform: translateX(-14px) scaleX(0.85); } }
        @media (max-width: 900px) { .cross-track { display: none; } }

        .chapter-rail { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; margin-bottom: 40px; padding-bottom: 4px; }
        .chapter-rail::-webkit-scrollbar { display: none; }
        .chapter-tab {
          flex-shrink: 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem; font-weight: 500;
          padding: 12px 20px;
          border-radius: 30px;
          border: 1.5px solid rgba(28,58,82,0.18);
          background: rgba(255,255,255,0.5);
          color: var(--navy);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .chapter-tab:hover { border-color: var(--gold); }
        .chapter-tab.active { background: var(--navy-deep); border-color: var(--navy-deep); color: #eaf3f8; }

        .fact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(255,255,255,0.14); border-radius: 12px; overflow: hidden; }
        .fact-item { background: rgba(255,255,255,0.06); padding: 26px 28px; }
        .fact-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin: 0 0 8px 0; }
        .fact-value { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 600; color: #eaf3f8; margin: 0; line-height: 1.5; }
        @media (max-width: 600px) { .fact-grid { grid-template-columns: 1fr; } }

        .pull-quote { border-left: 4px solid var(--gold); padding-left: 30px; margin: 0; }

        /* EDUCATION */
        .edu-row {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 30px;
          padding: 30px 0;
          border-bottom: 1px solid rgba(28,58,82,0.14);
        }
        .edu-row:first-child { padding-top: 0; }
        .edu-row:last-child { border-bottom: none; }
        .edu-years {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem; font-weight: 500; color: var(--gold);
          letter-spacing: 0.02em;
        }
        @media (max-width: 600px) { .edu-row { grid-template-columns: 1fr; gap: 6px; } }

        /* JOURNEY PATH */
        .journey-path { position: relative; }
        .journey-line {
          position: absolute; left: 21px; top: 12px; bottom: 12px; width: 2px;
          background: linear-gradient(180deg, var(--gold) 0%, rgba(207,159,63,0.15) 100%);
        }
        .journey-step { position: relative; padding: 0 0 46px 64px; }
        .journey-step:last-child { padding-bottom: 0; }
        .journey-marker {
          position: absolute; left: 0; top: 0;
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--navy-deep); color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.3rem;
          border: 2px solid var(--gold);
        }

        /* SPECIAL THANKS */
        .thanks-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 650px) { .thanks-grid { grid-template-columns: 1fr; } }
        .thanks-card {
          display: flex; gap: 18px; align-items: flex-start;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 26px;
        }
        .thanks-photo {
          width: 62px; height: 62px; border-radius: 50%; object-fit: cover;
          flex-shrink: 0; border: 2px solid var(--gold);
        }

        /* DREAM CARDS */
        .dream-card {
          padding: 32px;
          border-radius: 12px;
          background: rgba(255,255,255,0.7);
          border: 3px solid var(--deep-red);
        }
        .dream-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
        @media (max-width: 650px) { .dream-grid { grid-template-columns: 1fr; } }

        /* FAMILY PHOTO CARD */
        .photo-card {
          overflow: hidden;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid rgba(28,58,82,0.10);
          box-shadow: 0 10px 24px rgba(15,36,56,0.10);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .photo-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(15,36,56,0.16); }
        .photo-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .photo-card-body { padding: 18px 20px 22px 20px; }

        /* LOCATION */
        .location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 46px; align-items: center; }
        @media (max-width: 800px) { .location-grid { grid-template-columns: 1fr; } }
        .map-frame {
          width: 100%; aspect-ratio: 4/3; border-radius: 14px; overflow: hidden;
          box-shadow: 0 20px 40px rgba(15,36,56,0.2);
        }
        .service-time-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; border-bottom: 1px dashed rgba(255,255,255,0.2);
          font-size: 1.05rem;
        }
        .service-time-row:last-child { border-bottom: none; }

        /* UNIFIED BODY TEXT (matches "Why I Write" pull-quote treatment) */
        .body-copy {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 600;
          line-height: 1.5;
          color: var(--navy-deep);
          margin: 0;
        }
        .body-copy.on-dark { color: #ffffff; }
        .body-copy.on-red { color: rgba(255,255,255,0.9); }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

    

      {/* HERO */}
      <section style={{ padding: '100px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ display: 'flex', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '320px' }}>
            <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 26px 0', color: '#eaf3f8' }}>
              Priest. Father. Still figuring most of it out
            </h1>
            <p style={{ fontSize: '1.35rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
              I've spent twenty years learning that faith is less about having answers and more about
              showing up — for God, for my family, and for whoever's sitting across from me. This is
              where I write about that, honestly.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Read My Story Below
              </button>
              <button style={{ backgroundColor: 'transparent', color: '#eaf3f8', border: '1.5px solid #eaf3f8', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Say Hello
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 340px', minWidth: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1776454660072-222a8bdf122e?auto=format&fit=crop&w=900&q=80"
              alt="Priest in ornate robes holding a ceremonial staff"
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)' }}
            />
          </div>
        </div>
      </section>

      {/* MY STORY - CHAPTERS */}
      <section style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div className="wrapper" style={{ maxWidth: '860px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 40px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            The short version of a long journey
          </h2>
          <div className="chapter-rail">
            {chapters.map((c, i) => (
              <button key={i} className={`chapter-tab${i === activeChapter ? ' active' : ''}`} onClick={() => setActiveChapter(i)}>
                {c.year}
              </button>
            ))}
          </div>
          <div className="card" style={{ padding: '44px', background: 'var(--deep-red)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="eyebrow" style={{ fontSize: '0.85rem' }}>{chapters[activeChapter].year}</span>
            <h4 className="display" style={{ fontSize: '2.2rem', fontWeight: 700, margin: '12px 0 16px 0', color: '#ffffff' }}>
              {chapters[activeChapter].title}
            </h4>
            <p className="body-copy on-red" style={{ maxWidth: '640px' }}>
              {chapters[activeChapter].desc}
            </p>
          </div>
        </div>
      </section>

      {/* EDUCATION BACKGROUND */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '860px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            Educational Background
          </h2>
          <div>
            {education.map((e, i) => (
              <div className="edu-row" key={i}>
                <span className="edu-years">{e.years}</span>
                <div>
                  <h4 className="display" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--navy-deep)' }}>{e.degree}</h4>
                  <p className="body-copy" style={{ fontWeight: 700, margin: '0 0 8px 0' }}>{e.school}</p>
                  <p className="body-copy" style={{ maxWidth: '620px' }}>{e.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY I WRITE - PULL QUOTE */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h3 className="eyebrow" style={{ marginBottom: '30px', fontSize: '0.85rem', textAlign: 'center' }}>Why I Write This Blog</h3>
          <p className="pull-quote display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.5 }}>
            "I preach on Sundays, but a sermon only holds so much. This is where I put the rest —
            the doubts I don't voice from the pulpit, the small mercies I'd otherwise forget, and
            the ordinary texture of trying to follow Jesus while raising two kids and running a church."
          </p>
          <p style={{ marginTop: '26px', fontSize: '1.1rem', color: '#3d5a6c' }}>— Daniel</p>
        </div>
      </section>

      {/* DREAMS */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            Dreams & Hopes

          </h2>
          <div className="dream-grid">
            {dreams.map((d, i) => (
              <div className="dream-card" key={i}>
                <h4 className="display" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--navy-deep)' }}>{d.title}</h4>
                <p className="body-copy">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILY PHOTO STRIP */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h3 className="eyebrow" style={{ marginBottom: '38px', fontSize: '0.85rem', textAlign: 'center' }}>Family</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '26px', marginBottom: '26px' }}>
            {[
              { img: "https://images.unsplash.com/photo-1758691030490-fe1cb6c972ce?auto=format&fit=crop&w=600&q=80", title: "My Father, Girma", desc: "Taught me that faith and hard questions could sit at the same table.", alt: "Older man with a warm smile" },
              { img: "https://images.unsplash.com/photo-1692801439915-ef9194bf0951?auto=format&fit=crop&w=600&q=80", title: "My Mother, Tsehay", desc: "Read Scripture over breakfast every morning I can remember, and still does.", alt: "Older woman smiling warmly" }
            ].map((item, index) => (
              <div key={index} className="photo-card">
                <img src={item.img} alt={item.alt} />
                <div className="photo-card-body">
                  <h4 className="display" style={{ fontSize: '1.7rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--navy-deep)' }}>{item.title}</h4>
                  <p className="body-copy" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '26px' }}>
            {[
              { img: "https://images.unsplash.com/photo-1670301130983-d5e3fb519fe9?auto=format&fit=crop&w=600&q=80", title: "Selam", desc: "My wife of nineteen years, and my sharpest editor.", alt: "Woman smiling warmly at the camera" },
              { img: "https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=600&q=80", title: "Nardos, 14", desc: "Asks better theological questions than most seminarians.", alt: "Teenage girl smiling at the camera" },
              { img: "https://images.unsplash.com/photo-1678557856807-7ae6ff6893d1?auto=format&fit=crop&w=600&q=80", title: "Yonas, 11", desc: "Wants to be an astronaut. I've stopped arguing with that plan.", alt: "Young boy smiling at the camera" }
            ].map((item, index) => (
              <div key={index} className="photo-card">
                <img src={item.img} alt={item.alt} />
                <div className="photo-card-body">
                  <h4 className="display" style={{ fontSize: '1.7rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--navy-deep)' }}>{item.title}</h4>
                  <p className="body-copy" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL THANKS */}
      <div className="cross-bg" style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <section>
          <div className="wrapper" style={{ maxWidth: '760px' }}>
            <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 44px 0', color: '#ffffff', textAlign: 'center' }}>
              Special Thanks

            </h2>
            <div className="thanks-grid">
              {specialThanks.map((p, i) => (
                <div className="thanks-card" key={i}>
                  <img className="thanks-photo" src={p.img} alt={p.name} />
                  <div>
                    <h4 className="display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2px 0', color: '#ffffff' }}>{p.name}</h4>
                    <span className="eyebrow" style={{ fontSize: '0.75rem' }}>{p.role}</span>
                    <p className="body-copy on-red" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', marginTop: '10px' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* CONTACT CTA */}
      <section style={{ background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)', color: '#eaf3f8' }}>
        <div className="wrapper" style={{ maxWidth: '640px', textAlign: 'center' }}>

          <h3 className="display" style={{ fontSize: '2.7rem', fontWeight: 700, margin: '18px 0 18px 0' }}>
            I read every message myself
          </h3>
          <p className="body-copy on-dark" style={{ marginBottom: '32px' }}>
            If something I've written struck a chord — or if you just want to say hi — I'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="you@email.com"
              style={{ padding: '15px 20px', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', width: '280px', maxWidth: '80vw', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            />
            <button style={{ background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 32px', fontWeight: 700, borderRadius: '30px', cursor: 'pointer', fontSize: '1.05rem' }}>
              Send a Message
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--navy-deep)', color: '#89a3b5', padding: '60px 0 30px 0', borderBottom: '6px solid var(--deep-red)' }}>
        <div className="wrapper">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '38px', marginBottom: '44px' }}>
            <div>
              <h4 className="display" style={{ color: '#eaf3f8', fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>Daniel Worku</h4>
              <p className="body-copy on-dark" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>Pastor at Harbor Light Church. Writing about faith, family, and the ordinary work of ministry.</p>
            </div>
            {[
              { title: "Read", items: ["Latest Posts", "Journal", "Sermon Notes", "Archive"] },
              { title: "About", items: ["My Story", "Family", "Books I Recommend"] },
              { title: "Connect", items: ["Email Me", "Instagram", "YouTube"] }
            ].map((col, i) => (
              <div key={i}>
                <h5 className="eyebrow" style={{ color: '#eaf3f8', marginBottom: '12px', fontSize: '0.85rem' }}>{col.title}</h5>
                {col.items.map((s, j) => (
                  <p key={j} className="display" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#eaf3f8', margin: '8px 0', cursor: 'pointer' }}>{s}</p>
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

export default PastorAboutMePage;