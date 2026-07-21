import React, { useState } from "react";

const ChurchBlogListPage = () => {
  const [visibleCount, setVisibleCount] = useState(5);

  const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

  const posts = [
    {
      category: "Sermons",
      date: "July 12, 2026",
      readTime: "6 min read",
      title: "Hope in Hard Seasons",
      desc: "Finding steadiness in Scripture when life feels uncertain — a look at the Psalms of lament and why the Bible makes room for our questions.",
      img: "https://images.unsplash.com/photo-1594990375715-2d008aaaa31b?auto=format&fit=crop&w=1000&q=80",
      alt: "Blue and gold Orthodox cathedral interior",
      author: "Pastor James Whitfield"
    },
    {
      category: "Sermons",
      date: "July 5, 2026",
      readTime: "5 min read",
      title: "Living Waters",
      desc: "A study through the Gospel of John on thirst, grace, and being made new — what it means to drink from a well that never runs dry.",
      img: "https://images.unsplash.com/photo-1627573897879-1eff66f2c228?auto=format&fit=crop&w=1000&q=80",
      alt: "Low angle view of Orthodox cathedral interior",
      author: "Pastor James Whitfield"
    },
    {
      category: "Testimonies",
      date: "June 28, 2026",
      readTime: "4 min read",
      title: "Joey's Journey: Coming Home",
      desc: "After eight years away from any church, Joey found his way back to the pews last spring. This is his story, in his own words.",
      img: "https://images.unsplash.com/photo-1730751634426-b51669a83c85?auto=format&fit=crop&w=1000&q=80",
      alt: "Orthodox church walls covered in icon paintings",
      author: "Joey R."
    },
    {
      category: "Missions",
      date: "June 21, 2026",
      readTime: "7 min read",
      title: "Letters from the Field",
      desc: "Notes from our mission team's spring trip — what they built, who they met, and what they learned about the church beyond our walls.",
      img: "https://images.unsplash.com/photo-1612005660287-62b37fad2eb5?auto=format&fit=crop&w=1000&q=80",
      alt: "Orthodox cross atop a church dome",
      author: "Missions Team"
    },
    {
      category: "Youth",
      date: "June 14, 2026",
      readTime: "3 min read",
      title: "Retreat Recap: Faith, Fire Pits & Fellowship",
      desc: "Forty students, three days, and a lot of late-night conversation around the fire. Here's what happened at this year's youth retreat.",
      img: "https://images.unsplash.com/photo-1649105703438-0992d6844823?auto=format&fit=crop&w=1000&q=80",
      alt: "Priest standing in front of a cross",
      author: "Youth Ministry"
    },
    {
      category: "Prayer",
      date: "June 7, 2026",
      readTime: "4 min read",
      title: "The Discipline of Praying Together",
      desc: "Why our Wednesday prayer circle has quietly become the heartbeat of the church, and how it started with just three people.",
      img: "https://images.unsplash.com/photo-1601231656153-73aa7f115365?auto=format&fit=crop&w=1000&q=80",
      alt: "Gold candle holder with lit prayer candles",
      author: "Marta A."
    },
    {
      category: "Sermons",
      date: "May 31, 2026",
      readTime: "6 min read",
      title: "Come As You Are",
      desc: "Welcome, belonging, and the open table of the Gospel — reflecting on what it costs a church to mean it when it says everyone's invited.",
      img: "https://images.unsplash.com/photo-1731440650603-a931e574c943?auto=format&fit=crop&w=1000&q=80",
      alt: "Painted ceiling icon inside an Orthodox church",
      author: "Pastor James Whitfield"
    },
    {
      category: "Sermons",
      date: "May 24, 2026",
      readTime: "5 min read",
      title: "The Divine Liturgy",
      desc: "Understanding the rhythm and meaning behind our weekly worship, and why the order of service is a story, not just a schedule.",
      img: "https://images.unsplash.com/photo-1764231479915-62f744d20939?auto=format&fit=crop&w=1000&q=80",
      alt: "Interior of a grand, ornate Orthodox church with detailed flooring",
      author: "Pastor James Whitfield"
    }
  ];

  const shownPosts = posts.slice(0, visibleCount);

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
          --rust: #c1440e;
        }

        * { box-sizing: border-box; }

        .church-portal {
          font-family: 'Nunito Sans', sans-serif;
          background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 40%, var(--sky-low) 100%);
          color: var(--navy);
          -webkit-font-smoothing: antialiased;
        }
        .wrapper { max-width: 1000px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }
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

        .hero-blog {
          padding: 80px 0 60px 0;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          text-align: center;
        }
        .hero-blog h1 {
          font-size: clamp(3.4rem, 7.2vw, 5.4rem);
          font-weight: 700; line-height: 1.08; margin: 18px 0 20px 0; color: #eaf3f8;
        }
        .hero-blog p { font-size: 1.7rem; color: #a9c2d3; max-width: 720px; margin: 0 auto; line-height: 1.6; }

        .blog-list-section { background: #ffffff; }
        .post-row {
          padding: 56px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          align-items: center;
        }
        .post-row.reverse .post-media { order: 2; }
        .post-row.reverse .post-copy { order: 1; }
        @media (max-width: 760px) {
          .post-row, .post-row.reverse { grid-template-columns: 1fr; }
          .post-row.reverse .post-media, .post-row.reverse .post-copy { order: unset; }
        }
        .post-media img {
          width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 8px;
          box-shadow: 0 12px 26px rgba(15,36,56,0.14);
        }
        .post-meta {
          display: flex; align-items: center; gap: 14px; margin-bottom: 14px;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .post-meta .tag { color: var(--gold); font-weight: 700; }
        .post-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: var(--slate); }
        .post-meta .meta-plain { color: var(--slate); text-transform: none; letter-spacing: normal; font-family: 'Nunito Sans', sans-serif; font-size: 0.9rem; }
        .post-copy h3 {
          font-size: 2.4rem; margin: 0 0 14px 0; font-family: 'Cormorant Garamond', serif;
          line-height: 1.1; font-weight: 800; color: var(--rust);
        }
        .post-copy p.desc { font-size: 1.28rem; color: #333; margin: 0 0 18px 0; line-height: 1.6; }
        .post-copy .byline { font-size: 0.95rem; color: var(--navy); font-weight: 700; margin-bottom: 16px; }
        .read-more {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--navy-deep);
          border-bottom: 2px solid var(--gold); padding-bottom: 4px; cursor: pointer; width: fit-content;
        }

        .row-divider {
          display: flex; align-items: center; justify-content: center; gap: 26px;
        }
        .row-divider .h-string {
          flex: 1; height: 2px; max-width: 220px;
          background: linear-gradient(90deg, rgba(207,159,63,0) 0%, rgba(207,159,63,0.5) 50%, rgba(207,159,63,0) 100%);
        }

        .load-more-wrap { text-align: center; margin-top: 20px; }
        .load-more-btn {
          background: var(--deep-red); color: #fff; border: none;
          padding: 13px 34px; font-size: 1rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.04em; border-radius: 4px; cursor: pointer; transition: background 0.25s ease;
        }
        .load-more-btn:hover { background: #5c0c0c; }

        .newsletter-section {
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          color: #eaf3f8; text-align: center;
        }
        .newsletter-section h3 { font-size: 2.4rem; font-weight: 700; margin: 16px 0; }
        .newsletter-section p { font-size: 1.15rem; color: #a9c2d3; margin-bottom: 28px; }
        .newsletter-form { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .newsletter-form input {
          padding: 14px 18px; font-size: 1.05rem; border-radius: 30px; width: 270px; max-width: 80vw;
          border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff;
        }
        .newsletter-form button {
          background: var(--gold); color: var(--navy-deep); border: none;
          padding: 14px 30px; font-weight: 700; border-radius: 30px; cursor: pointer; font-size: 1rem;
        }

        footer { background: var(--navy-deep); color: #89a3b5; padding: 50px 0 26px 0; border-bottom: 6px solid var(--deep-red); }
        footer .eyebrow { font-size: 0.78rem; }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
      </div>

    
      <section className="hero-blog">
        <div className="wrapper">
          <h1 className="display">Stories, reflections, and updates from Harbor Light</h1>
          <p>Sermon notes, testimonies, and news from the life of our congregation — written by our pastors and by the people who make up our church</p>
        </div>
      </section>
  {/* NAV */}
      <nav className="nav-bar">
        <span className="nav-brand">Harbor&nbsp;Light&nbsp;Church</span>
        {categories.map(cat => <span key={cat} className="nav-item">{cat}</span>)}
      </nav>

      <section className="blog-list-section">
        <div className="wrapper">
          {shownPosts.map((post, index) => (
            <React.Fragment key={index}>
              <div className={`post-row${index % 2 === 1 ? " reverse" : ""}`}>
                <div className="post-media">
                  <img src={post.img} alt={post.alt} />
                </div>
                <div className="post-copy">
                  <div className="post-meta">
                    <span className="tag">{post.category}</span>
                    <span className="dot" />
                    <span className="meta-plain">{post.date}</span>
                    <span className="dot" />
                    <span className="meta-plain">{post.readTime}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="desc">{post.desc}</p>
                  <p className="byline">By {post.author}</p>
                  <span className="read-more">
                    Read Full Post
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
              {index < shownPosts.length - 1 && (
                <div className="row-divider">
                  <span className="h-string" />
                  <svg width="18" height="26" viewBox="0 0 18 26" xmlns="http://www.w3.org/2000/svg">
                    <rect x="7" y="0" width="4" height="26" fill="var(--gold)" opacity="0.75" />
                    <rect x="0" y="6" width="18" height="4" fill="var(--gold)" opacity="0.75" />
                  </svg>
                  <span className="h-string" />
                </div>
              )}
            </React.Fragment>
          ))}

          {visibleCount < posts.length && (
            <div className="load-more-wrap">
              <button className="load-more-btn" onClick={() => setVisibleCount(v => v + 3)}>
                Load More Posts
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="newsletter-section">
        <div className="wrapper" style={{ maxWidth: "600px" }}>
          <h3 className="display">Never miss a post — delivered every Monday.</h3>
          <p>One email a week: a new post, a verse, and this week's prayer requests</p>
          <div className="newsletter-form">
            <input type="email" placeholder="you@email.com" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrapper" style={{ textAlign: "center" }}>
          <p className="eyebrow">© 2026 Harbor Light Church</p>
        </div>
      </footer>
    </div>
  );
};

export default ChurchBlogListPage;