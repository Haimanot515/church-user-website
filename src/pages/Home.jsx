import React, { useState, useEffect, useRef } from "react";
import API from "../api/api.jsx";
import "./Home.css";

const POSTS_PER_PAGE = 10;

const Home = () => {
  const [data, setData] = useState(null);
  const [hero, setHero] = useState(null);
  const [priest, setPriest] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState("");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photosError, setPhotosError] = useState("");
  const [photosPage, setPhotosPage] = useState(1);
  const [photosTotalPages, setPhotosTotalPages] = useState(1);
  const [showSponsored, setShowSponsored] = useState(true);

  // === CHANGED: promotion now comes from the backend instead of being hardcoded ===
  const [promotion, setPromotion] = useState(null);
  const [promotionLoading, setPromotionLoading] = useState(true);

  // === ADDED: Current Sermon Series (category = Sermons, paginated) ===
  const [sermons, setSermons] = useState([]);
  const [sermonsLoading, setSermonsLoading] = useState(true);
  const [sermonsError, setSermonsError] = useState("");
  const [sermonsPage, setSermonsPage] = useState(1);
  const [sermonsTotalPages, setSermonsTotalPages] = useState(1);

  // === ADDED: Trending posts (all posts, no category filter) ===
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState("");
  const [trendingPage, setTrendingPage] = useState(1);
  const [trendingTotalPages, setTrendingTotalPages] = useState(1);

  // === ADDED: Recommended posts (all posts, no category filter) ===
  const [recommended, setRecommended] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState("");
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [recommendedTotalPages, setRecommendedTotalPages] = useState(1);

  // === ADDED: shared helper to cap description text at a word limit ===
  const truncateWords = (text, limit) => {
    if (!text) return text;
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "…";
  };

  const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

  const showPrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex((i) => i - 1);
    } else if (photosPage > 1) {
      setPhotosPage((p) => p - 1);
      setPhotoIndex(0);
    }
  };

  const showNextPhoto = () => {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex((i) => i + 1);
    } else if (photosPage < photosTotalPages) {
      setPhotosPage((p) => p + 1);
      setPhotoIndex(0);
    }
  };

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

  // === ADDED: fetch Hero title/image from /homeheros ===
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const heroRes = await API.get("/homeheros");
        const heroData = Array.isArray(heroRes.data) ? heroRes.data[0] : heroRes.data;
        setHero(heroData);
      } catch (err) { console.error("Error:", err); }
    };
    fetchHero();
  }, []);

  // === ADDED: fetch About the Priest from /about ===
  useEffect(() => {
    const fetchPriest = async () => {
      try {
        const aboutRes = await API.get("/about");
        const aboutData = Array.isArray(aboutRes.data) ? aboutRes.data : [aboutRes.data];
        const latest = aboutData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setPriest(latest);
      } catch (err) { console.error("Error:", err); }
    };
    fetchPriest();
  }, []);

  // === ADDED: fetch What People Say from /testimonials ===
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        setTestimonialsError("");
        const res = await API.get("/testimonials");
        const testimonialsData = Array.isArray(res.data) ? res.data : res.data.testimonials;
        setTestimonials(testimonialsData || []);
      } catch (err) {
        console.log(err);
        setTestimonialsError(err.response?.data?.message || "Failed to load testimonials");
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // === CHANGED: /promotions/latest is now a real route on the backend
  // (routes/promotion.js), so fetch it directly instead of sorting client-side ===
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setPromotionLoading(true);
        const res = await API.get("/promotions/latest");
        const latest = Array.isArray(res.data) ? res.data[0] : res.data;
        setPromotion(latest || null);
      } catch (err) {
        console.log(err);
        setPromotion(null);
      } finally {
        setPromotionLoading(false);
      }
    };
    fetchPromotion();
  }, []);

  // === ADDED: fetch Photos from /media/type/photo, paginated (limit 10) ===
  useEffect(() => {
    const fetchPhotos = async (page) => {
      try {
        setPhotosLoading(true);
        setPhotosError("");

        const res = await API.get("/media/type/photo", {
          params: {
            page,
            limit: 10,
          },
        });

        const mediaData = Array.isArray(res.data) ? res.data : res.data.media;
        setPhotos(mediaData || []);
        setPhotosTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        setPhotosError(err.response?.data?.message || "Failed to load photos");
      } finally {
        setPhotosLoading(false);
      }
    };
    fetchPhotos(photosPage);
  }, [photosPage]);

  // === ADDED: fetch Current Sermon Series — same pattern as GetPost.jsx ===
  useEffect(() => {
    const fetchSermons = async (page) => {
      try {
        setSermonsLoading(true);
        setSermonsError("");

        const res = await API.get("/posts", {
          params: {
            page,
            limit: POSTS_PER_PAGE,
            category: "Sermons",
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        setSermons(postsData || []);
        setSermonsTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        setSermonsError(err.response?.data?.message || "Failed to load sermon series");
      } finally {
        setSermonsLoading(false);
      }
    };
    fetchSermons(sermonsPage);
  }, [sermonsPage]);

  // === ADDED: fetch Trending — same pattern as GetPost.jsx ===
  useEffect(() => {
    const fetchTrending = async (page) => {
      try {
        setTrendingLoading(true);
        setTrendingError("");

        const res = await API.get("/posts/trending", {
          params: {
            page,
            limit: POSTS_PER_PAGE,
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        setTrending(postsData || []);
        setTrendingTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        setTrendingError(err.response?.data?.message || "Failed to load trending posts");
      } finally {
        setTrendingLoading(false);
      }
    };
    fetchTrending(trendingPage);
  }, [trendingPage]);

  // === ADDED: fetch Recommended — same pattern as GetPost.jsx ===
  useEffect(() => {
    const fetchRecommended = async (page) => {
      try {
        setRecommendedLoading(true);
        setRecommendedError("");

        const res = await API.get("/posts/recommended", {
          params: {
            page,
            limit: POSTS_PER_PAGE,
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        setRecommended(postsData || []);
        setRecommendedTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        setRecommendedError(err.response?.data?.message || "Failed to load recommended posts");
      } finally {
        setRecommendedLoading(false);
      }
    };
    fetchRecommended(recommendedPage);
  }, [recommendedPage]);

  // === ADDED: pagination handlers — same goToPage pattern as GetPost.jsx ===
  const goToSermonsPage = (page) => {
    if (page < 1 || page > sermonsTotalPages) return;
    setSermonsPage(page);
  };

  const goToTrendingPage = (page) => {
    if (page < 1 || page > trendingTotalPages) return;
    setTrendingPage(page);
  };

  const goToRecommendedPage = (page) => {
    if (page < 1 || page > recommendedTotalPages) return;
    setRecommendedPage(page);
  };

  // === ADDED: same pageButtonStyle as GetPost.jsx ===
  const pageButtonStyle = (disabled) => ({
    padding: "8px 16px",
    background: disabled ? "#e5e7eb" : "#2563eb",
    color: disabled ? "#999" : "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  // === CHANGED: only render sponsored block once loading is done AND a promotion actually exists ===
  const shouldShowSponsored = showSponsored && !promotionLoading && !!promotion;

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      {/* SPONSORED — now driven by /promotions/latest, hidden entirely if there's no promotion */}
      {shouldShowSponsored && (
      <div className="sponsored-wrap">
        <div className="cross-string left">
          <div className="string-line" />
          <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="0" width="4" height="40" fill="var(--gold)" />
            <rect x="2" y="14" width="24" height="4" fill="var(--gold)" />
          </svg>
          <div className="string-line" />
        </div>
        <div className="cross-string right">
          <div className="string-line" />
          <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="0" width="4" height="40" fill="var(--gold)" />
            <rect x="2" y="14" width="24" height="4" fill="var(--gold)" />
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
          <div className="sponsored-tag-wrap">
            <span className="sponsored-ad-label">Ad</span>
            <button
              className="sponsored-close"
              aria-label="Close sponsored content"
              onClick={() => setShowSponsored(false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#d32f2f', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
            Sponsored Content
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center', width: '100%' }}>
            <img
              src={promotion?.image || promotion?.photo || promotion?.photoUrl || promotion?.imageUrl}
              alt={promotion?.title || "Sponsored content"}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px' }}
            />
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: '0 0 15px 0', fontFamily: 'Georgia, serif' }}>
                {promotion?.title}
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: '0 0 20px 0' }}>
                {truncateWords(promotion?.description, 50)}
              </p>
              <button
                onClick={() => promotion?.link && window.open(promotion.link, "_blank", "noopener,noreferrer")}
                style={{
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
      )}

      {/* HERO */}
      <section style={{ padding: '100px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ display: 'flex', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '320px' }}>
            <h1 className="display" style={{ fontSize: 'clamp(1rem, 6vw, 3rem)', fontWeight: 700, lineHeight: 1.08, margin: '0 0 26px 0', color: '#eaf3f8' }}>
              {hero?.title || "Rooted in grace, reaching toward the light"}
            </h1>
            <p style={{ fontSize: '1.4rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
              {truncateWords(hero?.description, 50) || "Reflections, sermon notes, and stories from our congregation as we walk through Scripture together, week by week."}
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
          <div style={{ flex: '0 0 480px', minWidth: '320px' }}>
            <img
              src={hero?.image || "https://images.unsplash.com/photo-1602802490525-79e3e5062d1b?auto=format&fit=crop&w=900&q=80"}
              alt={hero?.title || "Orthodox icon of Christ on the iconostasis"}
              style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)' }}
            />
          </div>
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

      {/* SERMON SERIES - fetched from /posts, category = Sermons, paginated */}
      <section style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div className="hanging-cross left">
          <div className="hang-string" />
          <svg width="46" height="64" viewBox="0 0 46 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="0" width="8" height="64" fill="var(--gold)" />
            <rect x="4" y="20" width="38" height="8" fill="var(--gold)" />
          </svg>
        </div>
        <div className="hanging-cross right">
          <div className="hang-string" />
          <svg width="46" height="64" viewBox="0 0 46 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="0" width="8" height="64" fill="var(--gold)" />
            <rect x="4" y="20" width="38" height="8" fill="var(--gold)" />
          </svg>
        </div>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h3 className="display" style={{ marginBottom: '44px', fontSize: '2.8rem', fontWeight: 700, textAlign: 'center', color: 'var(--navy-deep)' }}>Current Sermon Series</h3>

          {sermonsError && <p style={{ color: 'red', textAlign: 'center' }}>{sermonsError}</p>}

          {sermonsLoading ? (
            <p style={{ textAlign: 'center' }}>Loading sermon series...</p>
          ) : sermons.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No sermons found.</p>
          ) : (
            sermons.map((item, index, arr) => (
              <React.Fragment key={item._id}>
                <div style={{
                  padding: '50px 0',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '40px',
                  alignItems: 'start'
                }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  />
                  <div style={{ marginTop: '-5px' }}>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 15px 0', fontFamily: 'Georgia, serif', lineHeight: '1', fontWeight: '600', color: '#c1440e' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '1.5rem', color: '#333', margin: 0, lineHeight: '1.6' }}>
                      {truncateWords(item.description, 37)}
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
                      <rect x="1" y="12" width="20" height="4" fill="var(--gold)" />
                    </svg>
                    <svg width="16" height="24" viewBox="0 0 16 24" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="0" width="4" height="24" fill="var(--gold)" opacity="0.7" />
                      <rect x="0" y="5" width="16" height="4" fill="var(--gold)" opacity="0.7" />
                    </svg>
                    <span className="h-string" />
                  </div>
                )}
              </React.Fragment>
            ))
          )}

          {sermonsTotalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
              <button
                onClick={() => goToSermonsPage(sermonsPage - 1)}
                disabled={sermonsPage === 1}
                style={pageButtonStyle(sermonsPage === 1)}
              >
                Prev
              </button>
              <span style={{ fontSize: '14px', color: '#444' }}>
                Page {sermonsPage} of {sermonsTotalPages}
              </span>
              <button
                onClick={() => goToSermonsPage(sermonsPage + 1)}
                disabled={sermonsPage === sermonsTotalPages}
                style={pageButtonStyle(sermonsPage === sermonsTotalPages)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ANGEL DIVIDER (Trending) - fetched from /posts, isTrending=true, paginated */}
      <section className="angel-divider">
        <div className="wrapper">
          <h3 className="display" style={{ marginBottom: '38px', fontSize: '2.8rem', fontWeight: 700, textAlign: 'center', color: '#ffffff' }}>Trending</h3>

          {trendingError && <p style={{ color: '#ffb3b3', textAlign: 'center' }}>{trendingError}</p>}

          <div className="angel-carousel">
            <button className="angel-arrow left" aria-label="Scroll left" onClick={() => scrollAngels(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="angel-grid" ref={angelScrollRef}>
              {trendingLoading ? (
                <p style={{ color: '#fff' }}>Loading trending posts...</p>
              ) : trending.length === 0 ? (
                <p style={{ color: '#fff' }}>No trending posts found.</p>
              ) : (
                trending.map((post) => (
                  <div
                    key={post._id}
                    className="angel-box"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                    role="img"
                    aria-label={post.title}
                  >
                    <div className="angel-box-overlay">
                      <h4>{post.title}</h4>
                      <p>{truncateWords(post.description, 50)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="angel-arrow right" aria-label="Scroll right" onClick={() => scrollAngels(1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {trendingTotalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
              <button
                onClick={() => goToTrendingPage(trendingPage - 1)}
                disabled={trendingPage === 1}
                style={pageButtonStyle(trendingPage === 1)}
              >
                Prev
              </button>
              <span style={{ fontSize: '14px', color: '#fff' }}>
                Page {trendingPage} of {trendingTotalPages}
              </span>
              <button
                onClick={() => goToTrendingPage(trendingPage + 1)}
                disabled={trendingPage === trendingTotalPages}
                style={pageButtonStyle(trendingPage === trendingTotalPages)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MINISTRIES GRID (Recommended) - fetched from /posts, isRecommended=true, paginated */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper">
          <h3 className="display" style={{ marginBottom: '38px', fontSize: '2.8rem', fontWeight: 700, textAlign: 'center', color: 'var(--navy-deep)' }}>Recommended</h3>

          {recommendedError && <p style={{ color: 'red', textAlign: 'center' }}>{recommendedError}</p>}

          {recommendedLoading ? (
            <p style={{ textAlign: 'center' }}>Loading recommended posts...</p>
          ) : recommended.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No recommended posts found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '26px' }}>
              {recommended.map((post) => (
                <div key={post._id} className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.25s ease', background: '#ffffff', backdropFilter: 'none' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', filter: 'brightness(1.25) saturate(1.1)' }} />
                  <div style={{ padding: '18px' }}>
                    <h4 className="display" style={{ fontSize: '2rem', fontWeight: 600, margin: '0 0 8px 0', color: '#a80070' }}>{post.title}</h4>
                    <p style={{ fontSize: '1.6rem', color: '#000000', margin: 0 }}>{truncateWords(post.description, 20)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recommendedTotalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
              <button
                onClick={() => goToRecommendedPage(recommendedPage - 1)}
                disabled={recommendedPage === 1}
                style={pageButtonStyle(recommendedPage === 1)}
              >
                Prev
              </button>
              <span style={{ fontSize: '14px', color: '#444' }}>
                Page {recommendedPage} of {recommendedTotalPages}
              </span>
              <button
                onClick={() => goToRecommendedPage(recommendedPage + 1)}
                disabled={recommendedPage === recommendedTotalPages}
                style={pageButtonStyle(recommendedPage === recommendedTotalPages)}
              >
                Next
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

        {/* ABOUT THE Priest */}
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
              src={priest?.image || "https://images.unsplash.com/photo-1776454660072-222a8bdf122e?auto=format&fit=crop&w=400&q=80"}
              alt={priest?.title || "Priest in ornate robes holding a ceremonial staff"}
              style={{ width: '260px', height: '320px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '4px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
            />
            <div style={{ flex: 1, minWidth: '260px' }}>
              <span className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>From the Priest</span>
              <h3 className="display" style={{ fontSize: '2.4rem', fontWeight: 700, margin: '12px 0 14px 0', color: '#ffffff' }}>
                {priest?.title || "Walking together, one Sunday at a time"}
              </h3>
              <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, margin: 0 }}>
                {truncateWords(priest?.description, 50) || "Twenty years in ministry has taught me that faith grows best in community. This page is where we share what God is teaching us — through sermons, testimonies, and the everyday life of our church family."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* TESTIMONIES */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1080px' }}>
          <h3 className="display" style={{ fontSize: '2.6rem', fontWeight: 700, marginBottom: '44px', textAlign: 'center', color: 'var(--navy-deep)' }}>
            What People Say About the Author
          </h3>
          {testimonialsError && <p style={{ color: 'red', textAlign: 'center' }}>{testimonialsError}</p>}

          {testimonialsLoading ? (
            <p style={{ textAlign: 'center' }}>Loading testimonies...</p>
          ) : testimonials.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No testimonies found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              {testimonials.map((t, i) => (
                <div key={t._id || i} style={{ borderTop: '2px solid var(--gold)', paddingTop: '28px', textAlign: 'center' }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold)', margin: '0 auto 18px auto', display: 'block' }}
                  />
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--navy)' }}>{t.name}</p>
                  <p className="eyebrow" style={{ marginTop: '2px', marginBottom: '16px', fontSize: '0.8rem' }}>{t.role}</p>
                  <p className="display" style={{ fontSize: '1.4rem', fontStyle: 'italic', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.55, margin: 0 }}>
                    "{truncateWords(t.quote, 50)}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION DIVIDER: Testimonies -> Video */}
      <div className="section-cross-divider">
        <span className="h-string" />
        <svg width="18" height="26" viewBox="0 0 18 26" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="0" width="4" height="26" fill="var(--gold)" opacity="0.6" />
          <rect x="0" y="6" width="18" height="4" fill="var(--gold)" opacity="0.6" />
        </svg>
        <svg width="26" height="38" viewBox="0 0 26 38" xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="0" width="4" height="38" fill="var(--gold)" />
          <rect x="2" y="9" width="22" height="4" fill="var(--gold)" />
        </svg>
        <svg width="18" height="26" viewBox="0 0 18 26" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="0" width="4" height="26" fill="var(--gold)" opacity="0.6" />
          <rect x="0" y="6" width="18" height="4" fill="var(--gold)" opacity="0.6" />
        </svg>
        <span className="h-string" />
      </div>

      {/* PHOTO GALLERY */}
      <section style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h3 className="display" style={{ marginBottom: '44px', fontSize: '2.8rem', fontWeight: 700, textAlign: 'center', color: 'var(--navy-deep)' }}>Photos</h3>
          {photosError && <p style={{ color: 'red', textAlign: 'center' }}>{photosError}</p>}

          {photosLoading ? (
            <p style={{ textAlign: 'center' }}>Loading photos...</p>
          ) : photos.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No photos found.</p>
          ) : (
            <div className="photo-carousel">
              <button className="photo-arrow left" aria-label="Previous photo" onClick={showPrevPhoto} disabled={photoIndex === 0 && photosPage === 1}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="photo-carousel-frame">
                <img
                  src={photos[photoIndex]?.imageUrl}
                  alt={photos[photoIndex]?.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain', backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                />
                <div style={{ marginTop: '26px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.6rem', margin: '0 0 15px 0', fontFamily: 'Georgia, serif', lineHeight: '1.1', fontWeight: '800', color: '#c1440e' }}>
                    {photos[photoIndex]?.title}
                  </h3>
                  <p style={{ fontSize: '1.3rem', color: '#333', margin: '0 auto', lineHeight: '1.6', maxWidth: '620px' }}>
                    {truncateWords(photos[photoIndex]?.description, 50)}
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
                {photosTotalPages > 1 && (
                  <p style={{ textAlign: 'center', fontSize: '14px', color: '#444', marginTop: '15px' }}>
                    Page {photosPage} of {photosTotalPages}
                  </p>
                )}
              </div>
              <button className="photo-arrow right" aria-label="Next photo" onClick={showNextPhoto} disabled={photoIndex === photos.length - 1 && photosPage === photosTotalPages}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* WEEKLY DEVOTIONAL SIGNUP */}
      <section style={{ background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)', color: '#eaf3f8' }}>
        <div className="wrapper" style={{ maxWidth: '640px', textAlign: 'center' }}>
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

    </div>
  );
};

export default Home;