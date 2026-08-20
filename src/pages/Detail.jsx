import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api.jsx";
import "./Blog.css";
import "./Detail.css";

const RELATED_LIMIT = 3;

// Single source of truth for the back button — rendered once per
// return path so there's never a chance of two showing at once.
const BackButton = () => (
  <Link to="/projects" aria-label="Go back" className="detail-back-btn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>
);

const Detail = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedLoadingMore, setRelatedLoadingMore] = useState(false);
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
        if (pageNum === 1) setRelatedLoading(true);
        else setRelatedLoadingMore(true);

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

        // Page 1 replaces the list (new post landed on); later pages
        // append, since this is now "Load More" rather than Next/Back
        // pagination that swaps the visible set out.
        setRelated((prev) => (pageNum === 1 ? filtered : [...prev, ...filtered]));
        setRelatedTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        if (pageNum === 1) setRelated([]);
      } finally {
        setRelatedLoading(false);
        setRelatedLoadingMore(false);
      }
    };
    fetchRelated(relatedPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?._id, relatedPage]);

  const loadMoreRelated = () => {
    if (relatedPage >= relatedTotalPages || relatedLoadingMore) return;
    setRelatedPage((page) => page + 1);
  };

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
        <BackButton />
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
        <BackButton />
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

      {/* BACK — fixed top-left, transparent/frosted so it blends over the
          navbar/hero color instead of showing a separate white bar.
          Rendered once via BackButton, same as the loading/error states. */}
      <BackButton />

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

            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "26px" }}>
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
              <div style={{ textAlign: "center", marginTop: "34px" }}>
                <button
                  onClick={loadMoreRelated}
                  disabled={relatedLoadingMore}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "999px",
                    border: "1px solid var(--navy-deep, #1e293b)",
                    background: "transparent",
                    color: "var(--navy-deep, #1e293b)",
                    fontWeight: 600,
                    cursor: relatedLoadingMore ? "not-allowed" : "pointer",
                    opacity: relatedLoadingMore ? 0.6 : 1,
                  }}
                >
                  {relatedLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Detail;