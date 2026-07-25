import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api.jsx";
import "./Blog.css";

const RELATED_LIMIT = 3;

const Detail = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedPage, setRelatedPage] = useState(1);
  const [relatedTotalPages, setRelatedTotalPages] = useState(1);

  // === Fetch the single post by id ===
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");
        setPost(null);

        const res = await API.get(`/posts/${id}`);
        const postData = Array.isArray(res.data) ? res.data[0] : res.data.post || res.data;
        setPost(postData || null);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load this post");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  // === Reset related-posts paging whenever we land on a new post ===
  useEffect(() => {
    setRelatedPage(1);
  }, [post?._id]);

  // === Fetch a page of related posts once we know the post's category ===
  useEffect(() => {
    if (!post) return;

    const fetchRelated = async (pageNum) => {
      try {
        setRelatedLoading(true);
        const category = getCategoryName(post);

        const res = await API.get("/posts", {
          params: {
            page: pageNum,
            limit: RELATED_LIMIT + 1,
            ...(category && category !== "General" ? { category } : {}),
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.posts;
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

  const pageButtonStyle = (disabled) => ({
    padding: "8px 16px",
    background: disabled ? "#e5e7eb" : "#2563eb",
    color: disabled ? "#999" : "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  });

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

  // === Same field helpers used in Blog.jsx, kept local since no shared utils file exists yet ===
  const getCategoryName = (p) =>
    typeof p.category === "object" && p.category !== null
      ? p.category.name
      : p.category || "General";

  const getAuthorName = (p) =>
    typeof p.author === "object" && p.author !== null
      ? p.author.name
      : p.author || "Harbor Light Church";

  const getFormattedDate = (p) =>
    p.publishedAt || p.createdAt
      ? new Date(p.publishedAt || p.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const getReadTime = (p) => {
    const words = (p.content || p.description || "").split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  // === Body content may come as one big string; split on blank lines into paragraphs ===
  const renderBody = (p) => {
    const raw = p.content || p.description || "";
    const paragraphs = raw.split(/\n\s*\n/).filter(Boolean);
    if (paragraphs.length === 0) return null;

    return paragraphs.map((para, i) => (
      <p key={i} className="desc" style={{ marginBottom: "22px" }}>
        {para}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="church-portal">
        <section className="hero-blog">
          <div className="wrapper">
            <p style={{ textAlign: "center" }}>Loading post...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="church-portal">
        <section className="hero-blog">
          <div className="wrapper" style={{ textAlign: "center" }}>
            <p style={{ color: "red" }}>{error || "Post not found."}</p>
            <Link to="/projects" className="read-more">
              Back to all posts
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="church-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
      </div>

      {/* BACK */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #eee" }}>
        <div className="wrapper" style={{ maxWidth: "820px", padding: "18px 20px" }}>
          <Link
            to="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              border: "1px solid #ddd",
              borderRadius: "30px",
              color: "var(--navy-deep)",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              background: "#fff",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="hero-blog">
        <div className="wrapper" style={{ maxWidth: "820px" }}>
          <div className="post-meta" style={{ marginBottom: "18px" }}>
            <span className="tag">{getCategoryName(post)}</span>
            <span className="dot" />
            <span className="meta-plain">{getFormattedDate(post)}</span>
            <span className="dot" />
            <span className="meta-plain">{getReadTime(post)}</span>
          </div>

          <h1 className="display">{post.title}</h1>
          <p className="byline">By {getAuthorName(post)}</p>
        </div>
      </section>

      {/* FEATURED IMAGE */}
      {post.imageUrl && (
        <section style={{ background: "#ffffff" }}>
          <div className="wrapper" style={{ maxWidth: "980px" }}>
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                borderRadius: "10px",
                boxShadow: "0 16px 30px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        </section>
      )}

      {/* BODY */}
      <section style={{ background: "#ffffff" }}>
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

      {/* RELATED POSTS */}
      {!relatedLoading && related.length > 0 && (
        <section style={{ background: "#ffffff" }}>
          <div className="wrapper">
            <h3 className="display" style={{ marginBottom: "34px", fontSize: "2.2rem", textAlign: "center" }}>
              You Might Also Like
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "26px" }}>
                {related.map((p) => (
                  <Link
                    key={p._id}
                    to={`/projects/${p._id}`}
                    className="card"
                    style={{ textDecoration: "none", color: "inherit", overflow: "hidden", display: "block" }}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ padding: "16px" }}>
                      <span className="tag">{getCategoryName(p)}</span>
                      <h4 style={{ fontSize: "1.3rem", margin: "10px 0 0 0" }}>{p.title}</h4>
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
          <h3 className="display">Never miss a post — delivered every Monday.</h3>
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

export default Detail;