import React, { useState, useEffect, useMemo } from "react";
import API from "../api/api";
import "./Book.css";

const PAGE_SIZE = 12;

const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;
  const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const path = mediaUrl.startsWith("/") ? mediaUrl : `/uploads/${mediaUrl}`;
  return `${base}${path}`;
};

// Cloudinary lets you force a real download (instead of opening inline)
// by inserting an fl_attachment flag into the URL, optionally with a
// clean filename. Falls back to the plain URL for non-Cloudinary links.
const getDownloadUrl = (url, filename) => {
  if (!url) return url;
  if (!/\/upload\//.test(url)) return url;

  const safeName = (filename || "document")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "_") || "document";

  return url.replace("/upload/", `/upload/fl_attachment:${safeName}/`);
};

const BookIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z" />
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  </svg>
);

const DownloadIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v12" strokeLinecap="round" />
    <path d="M7 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 19h16" strokeLinecap="round" />
  </svg>
);

// Reusable cover image with graceful fallback to BookIcon
// if the thumbnail URL is missing or fails to load.
const Cover = ({ src, alt, iconSize }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <BookIcon size={iconSize} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
};

const BookCard = ({ book }) => {
  const downloadUrl = getDownloadUrl(book.mediaUrl, book.title);

  return (
    <div className="catalog-card">
      <div className="catalog-cover">
        <Cover src={book.thumbnail} alt={book.title} iconSize={36} />
      </div>

      <div className="catalog-card-body">
        <div className="catalog-card-text">
          <p className="catalog-card-title">{book.title}</p>
          {book.authorName && <p className="catalog-card-author">{book.authorName}</p>}

          {(book.categoryName || book.languageName) && (
            <div className="catalog-card-tags">
              {book.categoryName && <span className="tag tag-category tag-sm">{book.categoryName}</span>}
              {book.languageName && <span className="tag tag-language tag-sm">{book.languageName}</span>}
            </div>
          )}

          {book.description && <p className="catalog-card-desc">{book.description}</p>}
        </div>

        <div className="catalog-card-actions">
          <a
            className="catalog-card-btn"
            href={book.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Online
          </a>
          <a
            className="catalog-card-btn catalog-card-btn-outline"
            href={downloadUrl}
            download
          >
            <DownloadIcon />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

const Book = () => {
  const [bookItems, setBookItems] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/media/type/document");

      const mapped = res.data
        .filter((m) => m.status === "published")
        .map((m) => ({
          ...m,
          mediaUrl: getMediaUrl(m.mediaUrl),
          thumbnail: getMediaUrl(m.thumbnail),
          authorName: m.author && typeof m.author === "object" ? m.author.name : "",
          categoryName: m.category && typeof m.category === "object" ? m.category.name : "",
          languageName: m.language && typeof m.language === "object" ? m.language.name : "",
        }));

      setBookItems(mapped);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategoryList(res.data || []);
    } catch (err) {
      // Non-fatal: fall back to categories derived from loaded books
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // Category tabs come from the backend category list (so every
  // category shows up, even ones with zero published books right
  // now), with live counts computed from the loaded books.
  const categories = useMemo(() => {
    const counts = new Map();
    bookItems.forEach((b) => {
      if (b.categoryName) {
        counts.set(b.categoryName, (counts.get(b.categoryName) || 0) + 1);
      }
    });

    if (categoryList.length > 0) {
      return categoryList
        .map((c) => [c.name, counts.get(c.name) || 0])
        .sort((a, b) => a[0].localeCompare(b[0]));
    }

    // Fallback: derive from whatever categories appear in loaded books
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [categoryList, bookItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = bookItems.filter((b) => {
      const matchesQuery =
        !q ||
        (b.title || "").toLowerCase().includes(q) ||
        (b.description || "").toLowerCase().includes(q) ||
        (b.authorName || "").toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || b.categoryName === activeCategory;

      return matchesQuery && matchesCategory;
    });

    if (sortBy === "title") {
      list = [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "author") {
      list = [...list].sort((a, b) => (a.authorName || "").localeCompare(b.authorName || ""));
    }
    // "newest" relies on the backend's default createdAt desc order — no re-sort needed.

    return list;
  }, [bookItems, query, activeCategory, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  const footerColumns = [
    { title: "Visit", items: ["Service Times", "Directions", "What to Expect"] },
    { title: "Get Involved", items: ["Ministries", "Volunteer", "Give", "Missions"] },
    { title: "Connect", items: ["Facebook", "Instagram", "YouTube"] },
  ];

  return (
    <div className="book-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <section className="book-hero">
        <div className="wrapper">
          <span className="eyebrow">Library</span>
          <h1 className="display">Books and PDFs</h1>
          <p>Study guides, booklets, and reading materials from our church family. Read online or download to keep.</p>

          <div className="book-search-wrap">
            <input
              className="book-search-input"
              type="text"
              placeholder="Search by title, author, or topic"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </div>
        </div>
      </section>

      <section className="book-catalog">
        <div className="wrapper">
          {loading && (
            <p style={{ textAlign: "center" }}>Loading catalog...</p>
          )}

          {!loading && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}

          {!loading && !error && (
            <>
              {/* Category filter tabs */}
              {categories.length > 0 && (
                <div className="catalog-filters">
                  <button
                    className={"filter-tab" + (activeCategory === "all" ? " active" : "")}
                    onClick={() => {
                      setActiveCategory("all");
                      setVisibleCount(PAGE_SIZE);
                    }}
                  >
                    All <span className="filter-count">{bookItems.length}</span>
                  </button>
                  {categories.map(([name, count]) => (
                    <button
                      key={name}
                      className={"filter-tab" + (activeCategory === name ? " active" : "")}
                      onClick={() => {
                        setActiveCategory(name);
                        setVisibleCount(PAGE_SIZE);
                      }}
                    >
                      {name} <span className="filter-count">{count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Result count + sort */}
              <div className="catalog-toolbar">
                <p className="catalog-result-count">
                  {filtered.length} {filtered.length === 1 ? "title" : "titles"}
                  {activeCategory !== "all" ? ` in ${activeCategory}` : ""}
                </p>
                <select
                  className="catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                </select>
              </div>

              {filtered.length === 0 && (
                <p style={{ textAlign: "center" }}>No books found.</p>
              )}

              {filtered.length > 0 && (
                <>
                  <div className="book-catalog-grid">
                    {visible.map((b, i) => (
                      <BookCard key={b._id || i} book={b} />
                    ))}
                  </div>

                  {filtered.length > visibleCount && (
                    <div className="load-more-wrap">
                      <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="book-footer">
        <div className="wrapper">
          <div className="footer-grid">
            <div>
              <h4 className="display footer-brand">Harbor Light Church</h4>
              <p className="footer-tagline">Sunday services at 9:00 and 11:00 AM. All are welcome, always.</p>
            </div>
            {footerColumns.map((col, i) => (
              <div key={i}>
                <h5 className="eyebrow footer-col-title">{col.title}</h5>
                {col.items.map((s, j) => (
                  <p key={j} className="footer-col-item">{s}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p className="eyebrow">© 2026 Harbor Light Church</p>
            <p className="eyebrow">Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Book;