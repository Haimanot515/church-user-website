import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api.jsx";
import "./Travel.css";

const TRAVEL_ITEM_LIMIT = 10;

const Travel = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeTrip, setActiveTrip] = useState(0);

  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState("");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(1);

  useEffect(() => {
    const fetchTravelPosts = async (pageNum) => {
      try {
        setUpcomingLoading(true);
        setUpcomingError("");

        const res = await API.get("/posts", {
          params: {
            category: "Travel",
            limit: TRAVEL_ITEM_LIMIT,
            page: pageNum,
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        const pages = Array.isArray(res.data) ? 1 : (res.data.totalPages || 1);

        setUpcomingTrips((prev) => (pageNum === 1 ? (postsData || []) : [...prev, ...(postsData || [])]));
        setUpcomingTotalPages(pages);
      } catch (err) {
        console.log(err);
        setUpcomingError(err.response?.data?.message || "Failed to load travel posts");
      } finally {
        setUpcomingLoading(false);
      }
    };
    fetchTravelPosts(upcomingPage);
  }, [upcomingPage]);

  const handleLoadMoreTrips = () => {
    if (upcomingPage < upcomingTotalPages) setUpcomingPage((p) => p + 1);
  };

  const getFormattedDate = (post) =>
    post.publishedAt || post.createdAt
      ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "";

  const quickFacts = [
    { label: "Countries Visited", value: "14, and counting" },
    { label: "Favorite Trip So Far", value: "Kenya, mission year, 2019" },
    { label: "Next Departure", value: "Scotland sabbatical — September" },
    { label: "Packing Philosophy", value: "One bag, always. No exceptions." },
    { label: "Travel Companion", value: "Usually my wife, sometimes the whole family" },
    { label: "Souvenir Of Choice", value: "A local hymn book or prayer written by hand" }
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
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

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

      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)' }}>
            A few trips already on the calendar
          </h2>

          {upcomingError && <p style={{ color: 'red' }}>{upcomingError}</p>}

          {upcomingLoading ? (
            <p>Loading trips...</p>
          ) : upcomingTrips.length === 0 ? (
            <p>No travel posts found.</p>
          ) : (
            <div className="upcoming-grid">
              {upcomingTrips.map((t) => (
                <Link
                  className="upcoming-card"
                  key={t._id}
                  to={`/projects/${t._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src={t.imageUrl} alt={t.title} />
                  <div className="upcoming-card-body">
                    <span className="upcoming-card-date">{getFormattedDate(t)}</span>
                    <h4 className="upcoming-card-title">{t.title}</h4>
                    <p className="upcoming-card-desc">{t.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {upcomingPage < upcomingTotalPages && (
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button
                onClick={handleLoadMoreTrips}
                disabled={upcomingLoading}
                style={{
                  backgroundColor: upcomingLoading ? '#ccc' : '#7a1010',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  fontSize: '1.05rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  cursor: upcomingLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => { if (!upcomingLoading) e.target.style.backgroundColor = '#5c0c0c'; }}
                onMouseOut={(e) => { if (!upcomingLoading) e.target.style.backgroundColor = '#7a1010'; }}
              >
                {upcomingLoading ? 'Loading...' : 'Load More Trips'}
              </button>
            </div>
          )}
        </div>
      </section>

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

      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <p className="pull-quote display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.5 }}>
            "Every trip I've taken has taught me the same lesson from a different angle: God was already
            there before I arrived, and He'll stay long after I've gone home."
          </p>
          <p style={{ marginTop: '26px', fontSize: '1.1rem', color: '#3d5a6c' }}>— Daniel</p>
        </div>
      </section>

      
    </div>
  );
};

export default Travel;