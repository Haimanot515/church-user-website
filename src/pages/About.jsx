import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";

const CHURCH_NAME = "Ethiopian Orthodox Tewahedo Church – Debre Selam Abune Gebre Menfes Kidus Church, Udine";

const ChurchAboutPage = () => {
  const categories = ["Home", "Reflections", "Sermons", "Journal", "Books I'm Reading", "Family", "Prayer", "Archive", "About Us", "Contact"];

  const [activeChapter, setActiveChapter] = useState(0);
  const [visibleStoryCount, setVisibleStoryCount] = useState(10);
  const [activeFaith, setActiveFaith] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // === ADDED: About/Hero content fetched from /about ===
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutRes = await API.get("/about");
        const aboutData = Array.isArray(aboutRes.data) ? aboutRes.data : [aboutRes.data];
        const latest = aboutData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setAbout(latest);
      } catch (err) { console.error("Error:", err); }
    };
    fetchAbout();
  }, []);

  // === ADDED: Leadership Team / Special Thanks / Testimonials fetched from /church-persons ===
  const [leaders, setLeaders] = useState([]);
  const [thanksList, setThanksList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);

  useEffect(() => {
    const fetchChurchPersons = async (category, setter) => {
      try {
        const res = await API.get("/church-persons", { params: { category } });
        const data = Array.isArray(res.data) ? res.data : [];
        setter(data);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
      }
    };

    fetchChurchPersons("leader", setLeaders);
    fetchChurchPersons("specialThanks", setThanksList);
    fetchChurchPersons("testimony", setTestimonialsList);
  }, []);

  const history = [
    {
      year: "1979",
      range: "1979 – 1987",
      title: "A Handful of Families",
      desc: `${CHURCH_NAME} began as a Bible study of six families meeting in a living room, with nothing but a shared conviction that Scripture belonged at the center of ordinary life. Within two years the living room had outgrown itself, and the group began renting a hall on Sundays.`,
      leader: "Pastor Abebe Kassahun",
      leaderRole: "Founding Pastor",
      servedBy: "Founding families: the Kassahun, Tadesse, and Worku households",
      photo: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80"
    },
    {
      year: "1988",
      range: "1987 – 1999",
      title: "Our First Sanctuary",
      desc: "After nine years of meeting in rented halls and homes, the congregation raised enough to buy a small plot. Built almost entirely through member fundraising and volunteer labor over eighteen months, the new sanctuary sat eighty people on its first Sunday.",
      leader: "Pastor Girma Tesfaye",
      leaderRole: "Senior Pastor",
      servedBy: "Building committee led by elders Simeon Tesfaye and Almaz Fikru",
      photo: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?auto=format&fit=crop&w=900&q=80"
    },
    {
      year: "2001",
      range: "1999 – 2012",
      title: "A Season of Growth",
      desc: "New leadership, a growing neighborhood, and a renewed commitment to discipleship brought the congregation past three hundred members for the first time, and the church added a second Sunday service to make room.",
      leader: "Pastor Solomon Haile",
      leaderRole: "Senior Pastor",
      servedBy: "A newly formed board of elders and the first paid ministry staff",
      photo: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=80"
    },
    {
      year: "2010",
      range: "2010 – 2013",
      title: "Opening Our Doors Wider",
      desc: "Under Pastor Haile's continued leadership, the congregation launched its first community outreach programs — a food pantry, tutoring for local children, and a counseling ministry — extending the church's work beyond Sunday mornings and into the neighborhood.",
      leader: "Pastor Solomon Haile",
      leaderRole: "Senior Pastor",
      servedBy: "Outreach volunteers and the newly formed Community Ministries team",
      photo: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80"
    },
    {
      year: "2020",
      range: "2012 – Present",
      title: "Weathering a Difficult Year",
      desc: "Like churches everywhere, the congregation learned to gather differently in 2020, checking in on the elderly and isolated members and discovering that community could stretch further than anyone expected.",
      leader: "Senior Pastor (current)",
      leaderRole: "Senior Pastor",
      servedBy: "The pastoral care team and dozens of members who kept in touch by phone",
      photo: "https://images.unsplash.com/photo-1523803326055-13445f07c5ba?auto=format&fit=crop&w=900&q=80"
    },
    {
      year: "2026",
      range: "2012 – Present",
      title: "Still Building",
      desc: `Forty-seven years in, ${CHURCH_NAME} is still learning what it means to be a church for this particular community, in this particular season — carried forward by the same conviction that started it all.`,
      leader: "Senior Pastor (current)",
      leaderRole: "Senior Pastor",
      servedBy: "The current pastoral staff, elders, and every ministry team serving today",
      photo: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=900&q=80"
    }
  ];

  const location = {
    city: "Udine, Italy",
    address: `${CHURCH_NAME}`,
    note: "Our doors are open most mornings, and our office team is usually reachable from the small building behind the sanctuary.",
    serviceTimes: ["Sunday — 9:00 & 11:00 AM", "Wednesday Prayer — 6:30 PM"]
  };

  // === ADDED: Advanced About-page sections ===

  const missionVision = [
    { label: "Our Mission", value: "To help this community know Christ and grow together in faith, one ordinary week at a time." },
    { label: "Our Vision", value: "A church so rooted in this community that no one nearby has to face hardship, doubt, or celebration alone." }
  ];

  const faithPoints = [
    { title: "Scripture", desc: "We believe the Bible is God's word, trustworthy and sufficient for how we understand faith and life." },
    { title: "The Trinity", desc: "We believe in one God who exists eternally as Father, Son, and Holy Spirit." },
    { title: "Salvation by Grace", desc: "We believe people are reconciled to God by grace through faith, not by works, through the death and resurrection of Jesus." },
    { title: "The Church", desc: "We believe the church is God's family on earth, called to worship together, serve one another, and reach out to the world." }
  ];

  const faqs = [
    { q: "What should I expect as a first-time visitor?", a: "A warm welcome, a seat wherever you like, and no pressure to sign anything or stand up and introduce yourself." },
    { q: "Is there a program for kids during the service?", a: "Yes — supervised check-in and age-appropriate programming run alongside both Sunday services." },
    { q: "Where can I park?", a: "Street parking is available nearby, with additional overflow parking behind the sanctuary." },
    { q: "Do I need to be a member to join a small group?", a: "Not at all. Small groups are open to anyone, whether you're visiting for the first time or have been here for years." }
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
          display: flex; flex-direction: column; gap: 18px; align-items: center; text-align: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 26px;
        }
        .thanks-photo {
          width: 140px; height: 140px; border-radius: 12px; object-fit: cover;
          flex-shrink: 0; border: 3px solid var(--gold);
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

        /* UNIFIED BODY TEXT (matches "Why We Write" pull-quote treatment) */
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

        /* BADGE */
        .badge {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem; letter-spacing: 0.06em;
          padding: 8px 16px; border-radius: 20px;
          background: rgba(207,159,63,0.14);
          border: 1px solid rgba(207,159,63,0.4);
          color: var(--gold);
          margin-bottom: 20px;
        }

        /* ACCORDION (Statement of Faith / FAQ) */
        .accordion-item { border-bottom: 1px solid rgba(28,58,82,0.14); }
        .accordion-item:first-child { border-top: 1px solid rgba(28,58,82,0.14); }
        .accordion-head {
          width: 100%; text-align: left; background: none; border: none; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 4px; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700;
          color: var(--navy-deep);
        }
        .accordion-icon { font-family: 'IBM Plex Mono', monospace; color: var(--gold); font-size: 1.2rem; flex-shrink: 0; margin-left: 20px; }
        .accordion-body { padding: 0 4px 24px 4px; max-width: 640px; }

        /* SIMPLE LIST CARDS (Small Groups / Volunteer / Sermons) */
        .list-card {
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;
          padding: 20px 24px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .list-card + .list-card { margin-top: 12px; }
        .list-card-title { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.3rem; color: #ffffff; }
        .list-card-meta { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--gold); }

        /* TESTIMONIALS */
        .testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        @media (max-width: 800px) { .testimonial-grid { grid-template-columns: 1fr; } }
        .testimonial-card { padding: 30px; border-radius: 12px; }
        .testimonial-photo {
          width: 96px; height: 96px;
          object-fit: cover;
          border-radius: 10px;
          border: 2px solid var(--gold);
          margin-bottom: 18px;
          display: block;
        }
        .testimonial-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--deep-red); margin: 2px 0 0 0;
        }

        /* LANGUAGE TOGGLE */
        .lang-toggle { display: inline-flex; border-radius: 20px; border: 1.5px solid rgba(255,255,255,0.3); overflow: hidden; margin-bottom: 24px; }
        .lang-btn { font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; padding: 8px 16px; background: transparent; border: none; color: #eaf3f8; cursor: pointer; }
        .lang-btn.active { background: var(--gold); color: var(--navy-deep); font-weight: 700; }

        /* CTA BAND */
        .cta-band { text-align: center; }

        /* ABOUT-STYLE PHOTO + TEXT LAYOUT (for Our Story) */
        .about-section {
          width: 100%;
          background: #ffffff;
          padding: 90px 0;
        }
        .about-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .about-item {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
          gap: 50px;
          margin-bottom: 60px;
        }
        .about-photo-side { flex: 0 1 380px; position: relative; }
        .about-img-wrapper { position: relative; z-index: 2; }
        .about-image {
          width: 100%;
          height: 450px;
          border-radius: 20px;
          object-fit: cover;
          object-position: center;
          box-shadow: 0 25px 50px -12px rgba(15,36,56,0.25);
          display: block;
          border: 4px solid #fff;
        }
        .about-art-accent {
          position: absolute;
          top: 20px; left: 20px;
          width: 100%; height: 100%;
          background: var(--sky-mid);
          border-radius: 20px;
          z-index: 1;
          border: 1px solid rgba(28,58,82,0.14);
        }
        .about-art-accent::after {
          content: '';
          position: absolute;
          bottom: -14px; right: -14px;
          width: 70px; height: 70px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.18;
        }
        .about-text-side { flex: 1.2 1 450px; padding-top: 10px; }
        .about-label {
          font-family: 'IBM Plex Mono', monospace;
          color: var(--deep-red);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.82rem;
        }
        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem;
          color: var(--navy-deep);
          margin: 16px 0;
          font-weight: 700;
          line-height: 1.1;
        }
        .about-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--slate);
          margin-bottom: 26px;
        }
        .about-tags { display: flex; gap: 10px; flex-wrap: wrap; }
        .about-tag {
          background: var(--sky-low);
          border: 1px solid rgba(28,58,82,0.16);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--navy);
          font-weight: 700;
        }
        .load-more-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--navy-deep);
          background: transparent;
          border: 1.5px solid var(--navy-deep);
          padding: 12px 30px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .load-more-btn:hover { background: var(--navy-deep); color: #eaf3f8; }
        @media (max-width: 900px) {
          .about-item { flex-direction: column; align-items: center; text-align: center; }
          .about-photo-side { flex: 0 1 100%; width: 100%; max-width: 450px; }
          .about-description { text-align: center; }
          .about-tags { justify-content: center; }
          .about-title { font-size: 2.2rem; }
        }
        @media (max-width: 480px) {
          .about-image { height: 350px; }
          .about-title { font-size: 1.8rem; }
        }
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
              {about?.title || (activeLang === 'am' ? "ቤተክርስቲያን፣ ከህንፃ በላይ" : "A Church, Not Just a Building")}
            </h1>
            <p style={{ fontSize: '1.35rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
              {about?.description || (activeLang === 'am'
                ? `ላለፉት አምስት አስርት ዓመታት ገደማ፣ ${CHURCH_NAME} እምነት መልስ ከማግኘት ይልቅ መገኘት እንደሆነ የተማረ ማህበረሰብ ነው።`
                : `For nearly five decades, ${CHURCH_NAME} has been a community learning that faith is less about having answers and more about showing up — for God, for each other, and for our neighborhood. This is where we tell that story, honestly.`)}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Read Our Story Below
              </button>
              <button style={{ backgroundColor: 'transparent', color: '#eaf3f8', border: '1.5px solid #eaf3f8', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Say Hello
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 340px', minWidth: '280px' }}>
            <img
              src={about?.image || "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=80"}
              alt={about?.title || `${CHURCH_NAME} sanctuary`}
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)' }}
            />
            {about?.churchLeader && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <p className="display" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>
                  {about.churchLeader}
                </p>
                <p className="eyebrow" style={{ fontSize: '0.72rem', margin: 0 }}>
                  {activeLang === 'am' ? "የቤተ ክርስቲያን መሪ" : "Church Leader"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section style={{ background: 'var(--navy-deep)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="wrapper">
          <div className="fact-grid">
            {missionVision.map((m, i) => (
              <div className="fact-item" key={i}>
                <p className="fact-label">{m.label}</p>
                <p className="fact-value">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 50px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            Our Church Story
          </h2>
          {history.slice(0, visibleStoryCount).map((item, i) => (
            <div key={i} className="about-item">

              {/* PHOTO SIDE */}
              <div className="about-photo-side">
                {item.photo && (
                  <div className="about-img-wrapper">
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="about-image"
                    />
                  </div>
                )}
                <div className="about-art-accent"></div>
              </div>

              {/* TEXT SIDE */}
              <div className="about-text-side">
                <span className="about-label">
                  {item.leaderRole} · Led {item.range}
                </span>

                <h2 className="about-title">
                  {item.title}
                </h2>
                <div className="about-description">
                  <p>{item.desc}</p>
                </div>
                <div className="about-tags">
                  <div className="about-tag">{item.leader}</div>
                  <div className="about-tag">{item.range}</div>
                  <div className="about-tag">{item.servedBy}</div>
                </div>
              </div>
            </div>
          ))}

          {visibleStoryCount < history.length && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button className="load-more-btn" onClick={() => setVisibleStoryCount(c => c + 10)}>
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* STATEMENT OF FAITH + WHY WE WRITE (combined) */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h3 className="eyebrow" style={{ marginBottom: '30px', fontSize: '0.85rem', textAlign: 'center' }}>What We Believe</h3>
          <div>
            {faithPoints.map((f, i) => (
              <div className="accordion-item" key={i}>
                <button className="accordion-head" onClick={() => setActiveFaith(activeFaith === i ? -1 : i)}>
                  {f.title}
                  <span className="accordion-icon">{activeFaith === i ? '−' : '+'}</span>
                </button>
                {activeFaith === i && (
                  <div className="accordion-body">
                    <p className="body-copy">{f.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="eyebrow" style={{ margin: '70px 0 30px 0', fontSize: '0.85rem', textAlign: 'center' }}>Why We Write This Blog</h3>
          <p className="display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.5, margin: 0 }}>
            "We gather on Sundays, but a service only holds so much. This is where we put the rest —
            the doubts we don't always voice out loud, the small mercies we'd otherwise forget, and
            the ordinary texture of trying to be a church for this community, in this season."
          </p>
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <div className="cross-bg" style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <section>
          <div className="wrapper" style={{ maxWidth: '760px' }}>
            <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 44px 0', color: '#ffffff', textAlign: 'center' }}>
              Leadership Team

            </h2>
            <div className="thanks-grid">
              {leaders.map((p) => (
                <div className="thanks-card" key={p._id}>
                  <img
                    className="thanks-photo"
                    src={(p.photos && p.photos[0]) || `https://ui-avatars.com/api/?name=${p.name}&background=0f2438&color=fff`}
                    alt={p.name}
                  />
                  <div>
                    <h4 className="display" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2px 0', color: '#ffffff' }}>{p.name}</h4>
                    <span className="eyebrow" style={{ fontSize: '0.75rem' }}>{p.role || p.title}</span>
                    <p className="body-copy on-red" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', marginTop: '10px' }}>{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            In Their Own Words
          </h2>
          <div className="testimonial-grid">
            {testimonialsList.map((t) => (
              <div className="card testimonial-card" key={t._id}>
                <img
                  className="testimonial-photo"
                  src={(t.photos && t.photos[0]) || `https://ui-avatars.com/api/?name=${t.name}&background=0070f3&color=fff`}
                  alt={t.name}
                />
                <p className="body-copy" style={{ fontSize: '1.3rem', marginBottom: '18px' }}>"{t.message}"</p>
                <p style={{ fontWeight: 700, margin: 0, color: 'var(--navy-deep)' }}>{t.name}</p>
                <p className="testimonial-title">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 30px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            Common Questions
          </h2>
          <div>
            {faqs.map((f, i) => (
              <div className="accordion-item" key={i}>
                <button className="accordion-head" onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}>
                  {f.q}
                  <span className="accordion-icon">{activeFaq === i ? '−' : '+'}</span>
                </button>
                {activeFaq === i && (
                  <div className="accordion-body">
                    <p className="body-copy" style={{ fontSize: '1.2rem' }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL THANKS (testimonial-style cards) */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)', textAlign: 'center' }}>
            Special Thanks
          </h2>
          <div className="testimonial-grid">
            {thanksList.map((p) => (
              <div className="card testimonial-card" key={p._id}>
                <img
                  className="testimonial-photo"
                  src={(p.photos && p.photos[0]) || `https://ui-avatars.com/api/?name=${p.name}&background=7a1010&color=fff`}
                  alt={p.name}
                />
                <p className="body-copy" style={{ fontSize: '1.3rem', marginBottom: '18px' }}>{p.description}</p>
                <p style={{ fontWeight: 700, margin: 0, color: 'var(--navy-deep)' }}>{p.name}</p>
                <p className="testimonial-title">{p.role || p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT */}
      <div style={{ background: 'var(--navy-deep)' }}>
        <section>
          <div className="wrapper">
            <div className="location-grid">
              <div>
                <h3 className="eyebrow" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>Visit Us</h3>
                <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 700, margin: '0 0 18px 0', color: '#ffffff' }}>{location.address}</h2>
                <p className="body-copy on-dark" style={{ fontSize: '1.2rem', marginBottom: '26px' }}>{location.note}</p>
                <div>
                  {location.serviceTimes.map((t, i) => (
                    <div className="service-time-row" key={i}>
                      <span style={{ color: '#ffffff' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="map-frame">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
                  alt={`Map area near ${CHURCH_NAME}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SUPPORT THE CHURCH */}
      <div style={{ background: 'var(--deep-red)' }}>
        <section>
          <div className="wrapper" style={{ maxWidth: '760px', textAlign: 'center' }}>
            <h3 className="eyebrow" style={{ marginBottom: '18px', fontSize: '0.85rem' }}>Give Online or In Person</h3>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, margin: '0 0 20px 0', color: '#ffffff' }}>
              Support the Church
            </h2>
            <p className="body-copy on-red" style={{ margin: '0 auto 34px auto', maxWidth: '600px' }}>
              Whatever you're able to give helps keep this church's doors — and its outreach to the community — open. You can give in person on Sunday, or send your gift directly using the details below.
            </p>
            <div style={{ display: 'inline-block', textAlign: 'left', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '28px 34px' }}>
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>Bank Transfer</p>
              <p style={{ color: '#ffffff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.15rem', fontWeight: 600, margin: '0 0 20px 0' }}>
                Account Name: {CHURCH_NAME}<br />
                Account Number: 1000 4522 3390 112
              </p>
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>Online Giving</p>
              <p style={{ color: '#ffffff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
                Merchant Name: {CHURCH_NAME}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* GIVE / GET INVOLVED CTA */}
      <div style={{ background: 'var(--deep-red)' }}>
        <section className="cta-band">
          <div className="wrapper" style={{ maxWidth: '640px' }}>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, margin: '0 0 18px 0', color: '#ffffff' }}>
              Give or Get Involved
            </h2>
            <p className="body-copy on-red" style={{ margin: '0 auto 30px auto', maxWidth: '520px' }}>
              Whether it's your time, your gifts, or your generosity, there's a place for it here.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Give
              </button>
              <button style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1.5px solid #ffffff', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}>
                Volunteer
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default ChurchAboutPage;