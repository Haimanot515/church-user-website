import React from "react";

const ChurchPage = () => {
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