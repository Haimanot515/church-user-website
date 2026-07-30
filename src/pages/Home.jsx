import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.jsx";
import "./Home.css";

const POSTS_PER_PAGE = 10;

const Home = () => {
  const navigate = useNavigate();
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

  const [promotion, setPromotion] = useState(null);
  const [promotionLoading, setPromotionLoading] = useState(true);

  const [sermons, setSermons] = useState([]);
  const [sermonsLoading, setSermonsLoading] = useState(true);
  const [sermonsError, setSermonsError] = useState("");
  const [sermonsPage, setSermonsPage] = useState(1);
  const [sermonsTotalPages, setSermonsTotalPages] = useState(1);

  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState("");
  const [trendingPage, setTrendingPage] = useState(1);
  const [trendingTotalPages, setTrendingTotalPages] = useState(1);

  const [recommended, setRecommended] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState("");
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [recommendedTotalPages, setRecommendedTotalPages] = useState(1);

  const truncateWords = (text, limit) => {
    if (!text) return text;
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "…";
  };

  // "All" is always first, so users can clear the category filter
  const [categories, setCategories] = useState(["All"]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // default to "All" so the initial render shows every post, no filter
  const [activeCategory, setActiveCategory] = useState("All");

  // ---------- Inlined category nav bar state/refs (formerly CategoryNav.jsx) ----------
  const catNavBarRef = useRef(null); // the sticky <nav> itself — used to measure its height so scrolling to a section doesn't leave it hidden underneath the sticky bar
  const catViewportRef = useRef(null); // clipped outer window
  const catTrackRef = useRef(null); // the moving inner element
  const catPosRef = useRef(0); // current translateX, always in (-half, 0]
  const catHalfRef = useRef(0); // width of one copy of the list
  const catDrag = useRef({ active: false, moved: false, startX: 0, startPos: 0, downCat: null });
  const catPaused = useRef(false);
  const catResumeTimeout = useRef(null);

  const canLoopCategories = categories.length > 1;
  const catLoopItems = canLoopCategories ? [...categories, ...categories] : categories;

  const applyCatTransform = () => {
    if (catTrackRef.current) {
      catTrackRef.current.style.transform = `translateX(${catPosRef.current}px)`;
    }
  };

  const wrapCatPos = (pos) => {
    const half = catHalfRef.current;
    if (half <= 0) return 0;
    let p = pos % half;
    if (p > 0) p -= half;
    return p;
  };

  // Drives the endless-loop drift + measures/re-measures the track.
  useEffect(() => {
    const track = catTrackRef.current;
    if (!track || !canLoopCategories) return;

    // Measure once layout has settled.
    catHalfRef.current = track.scrollWidth / 2;
    catPosRef.current = 0;
    applyCatTransform();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId;
    const SPEED = 0.45; // px per frame, gentle drift

    const tick = () => {
      if (!prefersReduced && !catDrag.current.active && !catPaused.current) {
        catPosRef.current = wrapCatPos(catPosRef.current - SPEED);
        applyCatTransform();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      catHalfRef.current = track.scrollWidth / 2;
      catPosRef.current = wrapCatPos(catPosRef.current);
      applyCatTransform();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const pauseCatAutoScroll = () => {
    catPaused.current = true;
    clearTimeout(catResumeTimeout.current);
  };
  const scheduleCatResume = () => {
    clearTimeout(catResumeTimeout.current);
    catResumeTimeout.current = setTimeout(() => {
      catPaused.current = false;
    }, 2200);
  };
  useEffect(() => () => clearTimeout(catResumeTimeout.current), []);

  const startCatDrag = (e) => {
    // Capture which category (if any) sits under the pointer right now.
    // We can't rely on the span's own onClick firing later, because
    // setPointerCapture below redirects the pointerup (and the click the
    // browser synthesizes from it) to the track div, not to the span —
    // so a plain tap on a category was silently swallowed. Grabbing the
    // category here, and firing selection manually from endCatDrag,
    // sidesteps that entirely.
    const itemEl = e.target.closest?.(".cat-nav-item");
    catDrag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startPos: catPosRef.current,
      downCat: itemEl ? itemEl.dataset.cat : null,
    };
    pauseCatAutoScroll();
    // Pointer capture keeps move/up events firing on this element even if
    // the pointer drifts outside its (fairly thin) bounds mid-drag — on
    // mouse, touch, or pen alike — so a fast or slightly-off-axis drag
    // never gets cut short before reaching the edges.
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const moveCatDrag = (e) => {
    if (!catDrag.current.active) return;
    const delta = e.clientX - catDrag.current.startX;
    if (Math.abs(delta) > 4) catDrag.current.moved = true;
    catPosRef.current = wrapCatPos(catDrag.current.startPos + delta);
    applyCatTransform();
  };
  const endCatDrag = (e) => {
    if (!catDrag.current.active) return;
    catDrag.current.active = false;
    if (e?.currentTarget?.releasePointerCapture && e?.pointerId != null) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // no-op: pointer may already be released
      }
    }
    // Fire the selection here instead of via the span's onClick — this is
    // the event that actually reaches us reliably.
    if (!catDrag.current.moved && catDrag.current.downCat) {
      handleCategoryClick(catDrag.current.downCat);
    }
    catDrag.current.moved = false;
    catDrag.current.downCat = null;
    scheduleCatResume();
  };
  // ---------- End inlined category nav bar logic ----------

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
  const sermonSectionRef = useRef(null);
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

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        setTestimonialsError("");
        const res = await API.get("/church-persons", { params: { category: "testimony" } });
        const testimonialsData = Array.isArray(res.data) ? res.data : [];
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

  // "All" fetches every post with no category filter, same limit as every category
  useEffect(() => {
    const fetchSermons = async (page) => {
      try {
        setSermonsLoading(true);
        setSermonsError("");

        const res = await API.get("/posts", {
          params: {
            page,
            limit: POSTS_PER_PAGE,
            ...(activeCategory && activeCategory !== "All" ? { category: activeCategory } : {}),
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        // Append on "Load More" (page > 1), replace on first load / category switch
        setSermons((prev) => (page === 1 ? (postsData || []) : [...prev, ...(postsData || [])]));
        setSermonsTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        setSermonsError(err.response?.data?.message || "Failed to load sermon series");
      } finally {
        setSermonsLoading(false);
      }
    };
    fetchSermons(sermonsPage);
  }, [sermonsPage, activeCategory]);

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

  // prepend "All" (UI-only, never comes from the DB) before the fetched names
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const res = await API.get("/categories");
        const raw = Array.isArray(res.data) ? res.data : res.data.categories;

        const names = (raw || [])
          .map((c) => (typeof c === "string" ? c : c?.name))
          .filter(Boolean);

        if (names.length > 0) {
          setCategories(["All", ...names]);
        }
      } catch (err) {
        console.log(err);
        setCategoriesError(err.response?.data?.message || "Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // FIX: plain scrollIntoView({block:"start"}) does move the page, but it
  // aligns the section's top edge with the very top of the viewport — right
  // where the sticky .cat-nav-bar sits. So the section moved, but its own
  // top (the first post) ended up hidden underneath that sticky bar,
  // making it look like nothing happened, especially when scrolling up
  // from the bottom of the page. This measures the sticky bar's actual
  // height and scrolls just far enough that the first post lands right
  // below it instead — and it runs the same way regardless of where the
  // page is currently scrolled to.
  const scrollToSermons = () => {
    if (!sermonSectionRef.current) return;
    const navHeight = catNavBarRef.current?.getBoundingClientRect().height || 0;
    const targetY =
      sermonSectionRef.current.getBoundingClientRect().top +
      window.scrollY -
      navHeight -
      12; // small breathing room below the bar
    window.scrollTo({ top: Math.max(targetY, 0), behavior: "smooth" });
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setSermonsPage(1);
    scrollToSermons();
  };

  const handleLoadMoreSermons = () => {
    if (sermonsPage < sermonsTotalPages) setSermonsPage((p) => p + 1);
  };

  const goToTrendingPage = (page) => {
    if (page < 1 || page > trendingTotalPages) return;
    setTrendingPage(page);
  };

  const goToRecommendedPage = (page) => {
    if (page < 1 || page > recommendedTotalPages) return;
    setRecommendedPage(page);
  };

  const pageButtonStyle = (disabled) => ({
    padding: "8px 16px",
    background: disabled ? "#e5e7eb" : "#2563eb",
    color: disabled ? "#999" : "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const shouldShowSponsored = showSponsored && !promotionLoading && !!promotion;

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

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
          <div className="sponsored-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center', width: '100%' }}>
            <img
              src={promotion?.image || promotion?.photo || promotion?.photoUrl || promotion?.imageUrl}
              alt={promotion?.title || "Sponsored content"}
              onClick={() => promotion?._id && navigate(`/promotions/${promotion._id}`)}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px', cursor: promotion?._id ? 'pointer' : 'default' }}
            />
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: '0 0 15px 0', fontFamily: 'Georgia, serif' }}>
                {promotion?.title}
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: '0 0 20px 0' }}>
                {truncateWords(promotion?.description, 50)}
              </p>
              <button
                onClick={() => {
                  if (promotion?._id) {
                    navigate(`/promotions/${promotion._id}`);
                  } else if (promotion?.link) {
                    window.open(promotion.link, "_blank", "noopener,noreferrer");
                  }
                }}
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

      <section style={{ padding: '100px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ display: 'flex', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '320px' }}>
            <Link to={`/homeheros/${hero?._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <h1 className="display" style={{ fontSize: 'clamp(1rem, 6vw, 3rem)', fontWeight: 700, lineHeight: 1.08, margin: '0 0 26px 0', color: '#eaf3f8' }}>
                {hero?.title || "Rooted in grace, reaching toward the light"}
              </h1>
              <p style={{ fontSize: '1.4rem', color: '#a9c2d3', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
                {truncateWords(hero?.description, 50) || "Reflections, sermon notes, and stories from our congregation as we walk through Scripture together, week by week."}
              </p>
            </Link>
            <div className="hero-cta-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                className="hero-cta-btn"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate('/skill');
                }}
                style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}
              >
                Watch Latest Sermon
              </button>
              <button
                className="hero-cta-btn"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate('/contact');
                }}
                style={{ backgroundColor: 'transparent', color: '#eaf3f8', border: '1.5px solid #eaf3f8', padding: '15px 34px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', borderRadius: '30px' }}
              >
                Plan a Visit
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 480px', minWidth: '320px' }}>
            <Link to={`/homeheros/${hero?._id}`}>
              <img
                src={hero?.image || "https://images.unsplash.com/photo-1602802490525-79e3e5062d1b?auto=format&fit=crop&w=900&q=80"}
                alt={hero?.title || "Orthodox icon of Christ on the iconostasis"}
                style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 40px rgba(15,36,56,0.35)' }}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* NAV — inlined (formerly <CategoryNav />) */}
      <nav className="cat-nav-bar" aria-label="Post categories" ref={catNavBarRef}>
        <div
          className="cat-nav-track"
          ref={catViewportRef}
          onPointerDown={startCatDrag}
          onPointerMove={moveCatDrag}
          onPointerUp={endCatDrag}
          onPointerCancel={endCatDrag}
        >
          <div className="cat-nav-scroll" ref={catTrackRef}>
            {catLoopItems.map((cat, i) => (
              <span
                key={`${cat}-${i}`}
                data-cat={cat}
                className={`cat-nav-item${cat === activeCategory ? " active" : ""}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </nav>

      <section ref={sermonSectionRef} style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
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

          {sermonsLoading && sermons.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Loading sermon series...</p>
          ) : sermons.length === 0 ? (
            <p style={{ textAlign: 'center' }}>
              {activeCategory === "All"
                ? "No sermons found."
                : `No Posts found in "${activeCategory}".`}
            </p>
          ) : (
            sermons.map((item, index, arr) => (
              <React.Fragment key={item._id}>
                <Link to={`/projects/${item._id}`} className="sermon-item-grid" style={{
                  padding: '50px 0',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '40px',
                  alignItems: 'start',
                  textDecoration: 'none',
                  color: 'inherit'
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
                </Link>
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

          {sermonsPage < sermonsTotalPages && (
            <div className="load-more-wrap">
              <button className="load-more-btn" onClick={handleLoadMoreSermons} disabled={sermonsLoading}>
                {sermonsLoading ? "Loading..." : "Load More Posts"}
              </button>
            </div>
          )}
        </div>
      </section>

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
                  <Link
                    key={post._id}
                    to={`/projects/${post._id}`}
                    className="angel-box"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                    role="img"
                    aria-label={post.title}
                  >
                    <div className="angel-box-overlay">
                      <h4>{post.title}</h4>
                      <p>{truncateWords(post.description, 50)}</p>
                    </div>
                  </Link>
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

      <section style={{ background: '#ffffff' }}>
        <div className="wrapper">
          <h3 className="display" style={{ marginBottom: '38px', fontSize: '2.8rem', fontWeight: 700, textAlign: 'center', color: 'var(--navy-deep)' }}>Recommended</h3>

          {recommendedError && <p style={{ color: 'red', textAlign: 'center' }}>{recommendedError}</p>}

          {recommendedLoading ? (
            <p style={{ textAlign: 'center' }}>Loading recommended posts...</p>
          ) : recommended.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No recommended posts found.</p>
          ) : (
            <div className="recommended-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '26px' }}>
              {recommended.map((post) => (
                <Link key={post._id} to={`/projects/${post._id}`} className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.25s ease', background: '#ffffff', backdropFilter: 'none', display: 'block', textDecoration: 'none', color: 'inherit' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', filter: 'brightness(1.25) saturate(1.1)' }} />
                  <div style={{ padding: '18px' }}>
                    <h4 className="display" style={{ fontSize: '2rem', fontWeight: 600, margin: '0 0 8px 0', color: '#a80070' }}>{post.title}</h4>
                    <p style={{ fontSize: '1.6rem', color: '#000000', margin: 0 }}>{truncateWords(post.description, 20)}</p>
                  </div>
                </Link>
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
            <h3 className="display" style={{ fontSize: 'clamp(2rem,  4vw, 3.8rem)', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Come as you are<br/>There's a place for you here.
            </h3>
          </div>
        </section>

        <section>
          <Link to={`/about/${priest?._id}`} style={{
            maxWidth: '880px',
            display: 'flex',
            gap: '50px',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '40px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '12px',
            backdropFilter: 'blur(6px)',
            textDecoration: 'none',
            color: 'inherit'
          }} className="wrapper" >
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
                {truncateWords(priest?.description, 70) || "Twenty years in ministry has taught me that faith grows best in community. This page is where we share what God is teaching us — through sermons, testimonies, and the everyday life of our church family."}
              </p>
            </div>
          </Link>
        </section>
      </div>

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
            <div className="home-testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              {testimonials.map((t, i) => (
                <div key={t._id || i} style={{ borderTop: '2px solid var(--gold)', paddingTop: '28px', textAlign: 'center' }}>
                  <img
                    src={(t.photos && t.photos[0]) || `https://ui-avatars.com/api/?name=${t.name}&background=0070f3&color=fff`}
                    alt={t.name}
                    style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold)', margin: '0 auto 18px auto', display: 'block' }}
                  />
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--navy)' }}>{t.name}</p>
                  <p className="eyebrow" style={{ marginTop: '2px', marginBottom: '16px', fontSize: '0.8rem' }}>{t.role || t.title}</p>
                  <p className="display" style={{ fontSize: '1.4rem', fontStyle: 'italic', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.55, margin: 0 }}>
                    "{truncateWords(t.message || t.description, 50)}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
                  src={photos[photoIndex]?.mediaUrl}
                  alt={photos[photoIndex]?.title}
                  onClick={() => photos[photoIndex]?._id && navigate(`/projects/${photos[photoIndex]._id}`)}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain', backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: photos[photoIndex]?._id ? 'pointer' : 'default' }}
                />
                <div
                  style={{ marginTop: '26px', textAlign: 'center', cursor: photos[photoIndex]?._id ? 'pointer' : 'default' }}
                  onClick={() => photos[photoIndex]?._id && navigate(`/projects/${photos[photoIndex]._id}`)}
                >
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

    </div>
  );
};

export default Home;