import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api.jsx";

const RELATED_LIMIT = 3;

const StoryDetail = () => {
  const { slug: id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedPage, setRelatedPage] = useState(1);
  const [relatedTotalPages, setRelatedTotalPages] = useState(1);

  // === Fetch the single story chapter by id ===
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");
        setPost(null);

        const res = await API.get(`/church-story/${id}`);
        const postData = Array.isArray(res.data) ? res.data[0] : res.data.story || res.data;
        setPost(postData || null);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load this chapter");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      // No id in the route params — surface this instead of hanging on "Loading..." forever
      console.error("StoryDetail: no 'id' route param found. Check that the route is defined as '/about/story/:id'.");
      setError("This story couldn't be loaded (missing id in the URL).");
      setLoading(false);
    }
    window.scrollTo(0, 0);
  }, [id]);

  // === Reset related-chapters paging whenever we land on a new chapter ===
  useEffect(() => {
    setRelatedPage(1);
  }, [post?._id]);

  // === Fetch a page of related chapters ===
  useEffect(() => {
    if (!post) return;

    const fetchRelated = async (pageNum) => {
      try {
        setRelatedLoading(true);

        const res = await API.get("/church-story", {
          params: {
            page: pageNum,
            limit: RELATED_LIMIT + 1,
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.stories;
        const filtered = (postsData || []).filter((p) => p._id !== post._id).slice(0, RELATED_LIMIT);
        setRelated(filtered);
        setRelatedTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated(relatedPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?._id, relatedPage]);

  const goToRelatedPage = (page) => {
    if (page < 1 || page > relatedTotalPages) return;
    setRelatedPage(page);
  };

  const arrowButtonStyle = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: "-22px",
    transform: "translateY(-50%)",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid #eee",
    background: "#fff",
    color: "var(--navy-deep)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    zIndex: 2,
  });

  // === Field helpers for the story shape (range/leader/desc instead of category/author/content) ===
  const getRange = (p) => p.range || "";

  const getLeaderName = (p) => p.leader || "Harbor Light Church";

  const getReadTime = (p) => {
    const words = (p.desc || p.description || "").split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  // === Body content may come as one big string; split on blank lines into paragraphs ===
  const renderBody = (p) => {
    const raw = p.desc || p.description || "";
    const paragraphs = raw.split(/\n\s*\n/).filter(Boolean);
    if (paragraphs.length === 0) return null;

    return paragraphs.map((para, i) => (
      <p key={i} className="desc" style={{ marginBottom: "22px" }}>
        {para}
      </p>
    ));
  };

  // === Same fixed top-left back button used on Detail / PromotionDetail / HeroDetail ===
  const BackButton = () => (
    <Link to="/about" aria-label="Back to Our Story" className="story-back-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  // === Same responsive breakpoint pattern used in PromotionDetail.css / HeroDetail, inlined here ===
  const responsiveStyles = `
    .story-back-btn {
      position: fixed;
      top: 24px;
      left: 24px;
      z-index: 10;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #ddd;
      color: var(--navy-deep);
      box-shadow: 0 6px 16px rgba(0,0,0,0.1);
      text-decoration: none;
    }
    .story-back-btn:hover {
      background: #f5f5f5;
    }

    .story-hero-section {
      padding-top: 80px;
    }
    .story-title {
      font-size: 2.6rem;
    }
    .story-byline {
      font-size: 1rem;
    }
    .story-featured-image {
      aspect-ratio: 16/9;
    }
    .story-body p {
      font-size: 1.1rem;
    }
    .story-related-heading {
      font-size: 2.2rem;
    }
    .story-related-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 26px;
    }
    .story-related-card-title {
      font-size: 1.3rem;
    }
    .story-newsletter-heading {
      font-size: 1.6rem;
    }

    /* --- Laptops / small desktops (max-width: 1024px) ----------------------- */
    @media (max-width: 1024px) {
      .story-title { font-size: 2.3rem; }
      .story-body p { font-size: 1.05rem; }
    }

    /* --- Tablets (max-width: 900px) ------------------------------------------ */
    @media (max-width: 900px) {
      .story-related-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* --- Tablets portrait / large phones (max-width: 768px) ------------------ */
    @media (max-width: 768px) {
      .story-hero-section { padding-top: 66px; }
      .story-title { font-size: 2rem; }
      .story-byline { font-size: 0.95rem; }
      .story-body p { font-size: 1rem; }
      .story-related-heading { font-size: 1.8rem; }
      .story-back-btn { top: 18px; left: 18px; width: 36px; height: 36px; }
    }

    /* --- Large phones (max-width: 600px) -------------------------------------- */
    @media (max-width: 600px) {
      .story-title { font-size: 1.7rem; }
      .story-body p { font-size: 0.95rem; line-height: 1.6; }
      .story-related-grid { grid-template-columns: 1fr; gap: 18px; }
      .story-related-card-title { font-size: 1.1rem; }
      .story-newsletter-heading { font-size: 1.35rem; }
    }

    /* --- Standard phones (max-width: 480px) ------------------------------------ */
    @media (max-width: 480px) {
      .story-hero-section { padding-top: 56px; }
      .story-title { font-size: 1.5rem; }
      .story-related-heading { font-size: 1.5rem; }
      .story-back-btn { top: 14px; left: 14px; width: 32px; height: 32px; }
    }

    /* --- Small phones (max-width: 380px) ---------------------------------------- */
    @media (max-width: 380px) {
      .story-title { font-size: 1.3rem; }
      .story-body p { font-size: 0.9rem; }
    }
  `;

  if (loading) {
    return (
      <div className="church-portal">
        <style>{responsiveStyles}</style>
        <BackButton />
        <section className="hero-blog">
          <div className="wrapper">
            <p style={{ textAlign: "center" }}>Loading chapter...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="church-portal">
        <style>{responsiveStyles}</style>
        <BackButton />
        <section className="hero-blog">
          <div className="wrapper" style={{ textAlign: "center" }}>
            <p style={{ color: "red" }}>{error || "Chapter not found."}</p>
            <Link to="/about" className="read-more">
              Back to Our Story
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="church-portal">
      <style>{responsiveStyles}</style>
      <BackButton />

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
      </div>

      {/* HERO */}
      <section className="hero-blog story-hero-section">
        <div className="wrapper" style={{ maxWidth: "820px" }}>
          <div className="post-meta" style={{ marginBottom: "18px" }}>
            <span className="tag">{getRange(post)}</span>
            <span className="dot" />
            <span className="meta-plain">{post.leaderRole}</span>
            <span className="dot" />
            <span className="meta-plain">{getReadTime(post)}</span>
          </div>

          <h1 className="display story-title">{post.title}</h1>
          <p className="byline story-byline">By {getLeaderName(post)}</p>
        </div>
      </section>

      {/* FEATURED IMAGE */}
      {(post.photo || post.imageUrl) && (
        <section style={{ background: "#ffffff" }}>
          <div className="wrapper" style={{ maxWidth: "980px" }}>
            <img
              src={post.photo || post.imageUrl}
              alt={post.title}
              className="story-featured-image"
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "10px",
                boxShadow: "0 16px 30px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        </section>
      )}

      {/* BODY */}
      <section style={{ background: "#ffffff" }} className="story-body">
        <div className="wrapper" style={{ maxWidth: "760px" }}>
          {renderBody(post)}
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

      {/* RELATED CHAPTERS */}
      {!relatedLoading && related.length > 0 && (
        <section style={{ background: "#ffffff" }}>
          <div className="wrapper">
            <h3 className="display story-related-heading" style={{ marginBottom: "34px", textAlign: "center" }}>
              More of Our Story
            </h3>

            <div style={{ position: "relative" }}>
              {relatedPage > 1 && (
                <button
                  onClick={() => goToRelatedPage(relatedPage - 1)}
                  aria-label="Previous"
                  style={arrowButtonStyle("left")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              <div className="story-related-grid">
                {related.map((p) => (
                  <Link
                    key={p._id}
                    to={`/about/story/${p._id}`}
                    className="card"
                    style={{ textDecoration: "none", color: "inherit", overflow: "hidden", display: "block" }}
                  >
                    <img
                      src={p.photo || p.imageUrl}
                      alt={p.title}
                      style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ padding: "16px" }}>
                      <span className="tag">{getRange(p)}</span>
                      <h4 className="story-related-card-title" style={{ margin: "10px 0 0 0" }}>{p.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>

              {relatedPage < relatedTotalPages && (
                <button
                  onClick={() => goToRelatedPage(relatedPage + 1)}
                  aria-label="Next"
                  style={arrowButtonStyle("right")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="wrapper" style={{ maxWidth: "600px" }}>
          <h3 className="display story-newsletter-heading">Never miss a post — delivered every Monday.</h3>
          <p>One email a week: a new post, a verse, and this week's prayer requests</p>
          <div className="newsletter-form">
            <input type="email" placeholder="you@email.com" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoryDetail;