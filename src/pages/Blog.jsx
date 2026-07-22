import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";
import "./Blog.css";

const POSTS_PER_PAGE = 10;

const Blog = () => {
  // === ADDED: fetched posts state (replaces hardcoded array) ===
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["Sermons", "Events", "Ministries", "Testimonies", "Missions", "Youth", "Prayer Requests", "Bible Study", "Music", "Outreach", "Give", "Community", "Media", "Contact"];

  // === ADDED: fetch all posts, irrespective of category — same pattern as GetPost.jsx ===
  useEffect(() => {
    const fetchPosts = async (pageNum) => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/posts", {
          params: {
            page: pageNum,
            limit: POSTS_PER_PAGE,
          },
        });

        const postsData = Array.isArray(res.data) ? res.data : res.data.posts;
        const pages = Array.isArray(res.data) ? 1 : (res.data.totalPages || 1);

        // Append on "Load More" (page > 1), replace on first load / reset
        setPosts((prev) => (pageNum === 1 ? (postsData || []) : [...prev, ...(postsData || [])]));
        setTotalPages(pages);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts(page);
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  // === ADDED: helpers to safely read populated fields ===
  const getCategoryName = (post) =>
    typeof post.category === "object" && post.category !== null
      ? post.category.name
      : post.category || "General";

  const getAuthorName = (post) =>
    typeof post.author === "object" && post.author !== null
      ? post.author.name
      : post.author || "Harbor Light Church";

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
    return `${minutes} min read`;
  };

  return (
    <div className="church-portal">
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
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          {loading && posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          ) : (
            posts.map((post, index) => (
              <React.Fragment key={post._id || index}>
                <div className={`post-row${index % 2 === 1 ? " reverse" : ""}`}>
                  <div className="post-media">
                    <img src={post.imageUrl} alt={post.title} />
                  </div>
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
                    <span className="read-more">
                      Read Full Post
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
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
                {loading ? "Loading..." : "Load More Posts"}
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

export default Blog;