import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import "./Blog.css";

const POSTS_PER_PAGE = 10;

const Blog = () => {
  const { t } = useTranslation();

  // === Fetched posts state ===
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // NEW: true when the posts currently shown came from the English
  // fallback because the active language had none
  const [postsFallback, setPostsFallback] = useState(false);

  // Category list comes entirely from the backend (fetched below); "All"
  // is the only UI-only entry, prepended so people can clear the filter.
  const [categories, setCategories] = useState(["All"]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  // NEW: true when the category list currently shown came from the
  // English fallback because the active language had none
  const [categoriesFallback, setCategoriesFallback] = useState(false);

  // === which category is currently selected in the nav ===
  const [activeCategory, setActiveCategory] = useState("All");

  // ---------- Inlined category nav bar state/refs (formerly CategoryNav.jsx) ----------
  const catNavBarRef = useRef(null); // the sticky <nav> itself — measured for its height so scrolling to the post list doesn't leave the first post hidden underneath it
  const catViewportRef = useRef(null); // clipped outer window
  const catTrackRef = useRef(null); // the moving inner element
  const catPosRef = useRef(0); // current translateX, always in (-half, 0]
  const catHalfRef = useRef(0); // width of one copy of the list
  const catDrag = useRef({ active: false, moved: false, startX: 0, startPos: 0, downCat: null });
  const catPaused = useRef(false);
  const catResumeTimeout = useRef(null);

  // Ref on the first post's wrapper — the actual scroll target
  const postsSectionRef = useRef(null);

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

  // Scroll so the first post lands just below the sticky category bar. A
  // plain scrollIntoView({block:"start"}) would put the post list's top
  // edge flush with the very top of the viewport — right where the sticky
  // bar sits — which hides the first post underneath it instead of
  // revealing it, especially noticeable when scrolling up from the bottom
  // of the page. This measures the bar's real height first and always
  // runs, regardless of where the page currently sits.
  const scrollToFirstPost = () => {
    if (!postsSectionRef.current) return;
    const navHeight = catNavBarRef.current?.getBoundingClientRect().height || 0;
    const targetY =
      postsSectionRef.current.getBoundingClientRect().top +
      window.scrollY -
      navHeight -
      12; // small breathing room below the bar
    window.scrollTo({ top: Math.max(targetY, 0), behavior: "smooth" });
  };

  // === Fetch posts, filtered by activeCategory when it isn't "All" —
  // same Accept-Language fallback pattern as ChurchAboutPage's
  // fetchChurchPersons/fetchHistory: try the active language first, and
  // only on a fresh load (page 1) that comes back empty, retry with an
  // explicit "en" header and flag it. A "Load More" click on page > 1
  // never silently switches language. ===
  const fetchPosts = async (pageNum) => {
    try {
      setLoading(true);
      setError("");
      if (pageNum === 1) setPostsFallback(false);

      const params = {
        page: pageNum,
        limit: POSTS_PER_PAGE,
        ...(activeCategory && activeCategory !== "All" ? { category: activeCategory } : {}),
      };

      let res = await API.get("/posts", { params });
      let postsData = Array.isArray(res.data) ? res.data : res.data.posts;
      let pages = Array.isArray(res.data) ? 1 : (res.data.totalPages || 1);

      if (pageNum === 1 && (!postsData || postsData.length === 0)) {
        res = await API.get("/posts", {
          params,
          headers: { "Accept-Language": "en" },
        });
        postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        pages = Array.isArray(res.data) ? 1 : (res.data.totalPages || 1);
        if (postsData && postsData.length > 0) setPostsFallback(true);
      }

      // Append on "Load More" (page > 1), replace on first load / reset
      setPosts((prev) => (pageNum === 1 ? (postsData || []) : [...prev, ...(postsData || [])]));
      setTotalPages(pages);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || t("blog.posts.errorDefault"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeCategory, t]);

  const handleLoadMore = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  // === Switching category resets back to page 1 so the fetch above starts fresh ===
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    scrollToFirstPost();
  };

  // === Fetch categories from backend, same Accept-Language fallback
  // pattern as fetchChurchPersons ===
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");
        setCategoriesFallback(false);

        let res = await API.get("/categories");
        let raw = Array.isArray(res.data) ? res.data : res.data.categories;
        let names = (raw || [])
          .map((c) => (typeof c === "string" ? c : c?.name))
          .filter(Boolean);

        if (names.length === 0) {
          res = await API.get("/categories", {
            headers: { "Accept-Language": "en" },
          });
          raw = Array.isArray(res.data) ? res.data : res.data.categories;
          names = (raw || [])
            .map((c) => (typeof c === "string" ? c : c?.name))
            .filter(Boolean);
          if (names.length > 0) setCategoriesFallback(true);
        }

        if (names.length > 0) {
          setCategories(["All", ...names]);
        }
      } catch (err) {
        console.log(err);
        setCategoriesError(err.response?.data?.message || t("blog.categoryNav.errorDefault"));
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [t]);

  // === Helpers to safely read populated fields ===
  const getCategoryName = (post) =>
    typeof post.category === "object" && post.category !== null
      ? post.category.name
      : post.category || t("blog.posts.defaultCategory");

  const getAuthorName = (post) =>
    typeof post.author === "object" && post.author !== null
      ? post.author.name
      : post.author || t("blog.posts.defaultAuthor");

  const getFormattedDate = (post) =>
    post.publishedAt || post.createdAt
      ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const getReadTime = (post) => {
    const words = (post.content || post.description || "").split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} ${t("blog.posts.readTimeSuffix")}`;
  };

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
      </div>

      <section className="hero-blog">
        <div className="wrapper">
          <h1 className="display">{t("blog.hero.title")}</h1>
          <p>{t("blog.hero.description")}</p>
        </div>
      </section>

      {/* NAV — inlined (formerly <CategoryNav />) */}
      <nav className="cat-nav-bar" aria-label={t("blog.categoryNav.ariaLabel")} ref={catNavBarRef}>
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

      {/* note shown when the category list fell back to English */}
      {categoriesFallback && (
        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", margin: "10px 0 0 0" }}>
          {t("blog.categoryNav.fallbackNotice")}
        </p>
      )}
      {categoriesError && (
        <p style={{ color: "red", textAlign: "center", margin: "10px 0 0 0" }}>{categoriesError}</p>
      )}

      <section className="blog-list-section" ref={postsSectionRef}>
        <div className="wrapper">
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          {/* note shown when the posts fell back to English */}
          {postsFallback && (
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "24px" }}>
              {t("blog.posts.fallbackNotice")}
            </p>
          )}

          {loading && posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>{t("blog.posts.loading")}</p>
          ) : posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>{t("blog.posts.none")}</p>
          ) : (
            posts.map((post, index) => (
              <React.Fragment key={post._id || index}>
                <div className={`post-row${index % 2 === 1 ? " reverse" : ""}`}>
                  <Link to={`/projects/${post._id}`} className="post-media">
                    <img src={post.imageUrl} alt={post.title} />
                  </Link>
                  <div className="post-copy">
                    <div className="post-meta">
                      <span className="tag">{getCategoryName(post)}</span>
                      <span className="dot" />
                      <span className="meta-plain">{getFormattedDate(post)}</span>
                      <span className="dot" />
                      <span className="meta-plain">{getReadTime(post)}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p className="desc">{post.description}</p>
                    <p className="byline">By {getAuthorName(post)}</p>
                    <Link to={`/projects/${post._id}`} className="read-more">
                      {t("blog.posts.readMoreButton")}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
                {index < posts.length - 1 && (
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
            ))
          )}

          {page < totalPages && (
            <div className="load-more-wrap">
              <button className="load-more-btn" onClick={handleLoadMore} disabled={loading}>
                {loading ? t("blog.posts.loadingMoreButton") : t("blog.posts.loadMoreButton")}
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Blog;