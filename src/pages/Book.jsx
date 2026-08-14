import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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

// Forces a real file download instead of the browser navigating to /
// opening the file. Using the `download` attribute on an <a> only
// works when the file is same-origin; since media files are usually
// served from a different host/CDN, we fetch the bytes as a blob and
// download from that instead, which works regardless of origin.
const handleDownload = async (url, title) => {
  if (!url) return;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const ext = (url.split(".").pop() || "").split("?")[0];
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = ext ? `${title || "download"}.${ext}` : title || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    // Fallback: if fetching as a blob fails (e.g. CORS blocked at the
    // network level), open the file in a new tab so the user can at
    // least save it manually from there.
    window.open(url, "_blank", "noopener,noreferrer");
  }
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

// Reusable inline loading spinner — same markup/classes as Home.jsx and
// Media.jsx's Spinner, shown while data is being fetched from the
// backend so the user never sees hardcoded frontend placeholder
// content before the real data arrives.
const Spinner = ({ light }) => (
  <div className="loading-spinner-wrap">
    <div className={`loading-spinner${light ? " light" : ""}`} />
  </div>
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

const BookCard = ({ book, t }) => {
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
            {t("book.card.readOnline")}
          </a>
          <button
            type="button"
            className="catalog-card-btn catalog-card-btn-outline"
            onClick={() => handleDownload(book.mediaUrl, book.title)}
          >
            <DownloadIcon />
            {t("book.card.download")}
          </button>
        </div>
      </div>
    </div>
  );
};

const Book = () => {
  const { t } = useTranslation();

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
      setError(err.response?.data?.message || t("book.errors.default"));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

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

  return (
    <div className="book-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <section className="book-hero">
        <div className="wrapper">
          <span className="eyebrow">{t("book.hero.eyebrow")}</span>
          <h1 className="display">{t("book.hero.title")}</h1>
          <p>{t("book.hero.description")}</p>

          <div className="book-search-wrap">
            <input
              className="book-search-input"
              type="text"
              placeholder={t("book.hero.searchPlaceholder")}
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
          {loading && <Spinner />}

          {!loading && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}

          {!loading && !error && (
            <>
              {categories.length > 0 && (
                <div className="catalog-filters">
                  <button
                    className={"filter-tab" + (activeCategory === "all" ? " active" : "")}
                    onClick={() => {
                      setActiveCategory("all");
                      setVisibleCount(PAGE_SIZE);
                    }}
                  >
                    {t("book.filters.all")} <span className="filter-count">{bookItems.length}</span>
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

              <div className="catalog-toolbar">
                <p className="catalog-result-count">
                  {filtered.length} {filtered.length === 1 ? t("book.common.title") : t("book.common.titles")}
                  {activeCategory !== "all" ? ` ${t("book.common.inCategory", { category: activeCategory })}` : ""}
                </p>
                <select
                  className="catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">{t("book.sort.newest")}</option>
                  <option value="title">{t("book.sort.title")}</option>
                  <option value="author">{t("book.sort.author")}</option>
                </select>
              </div>

              {filtered.length === 0 && (
                <p style={{ textAlign: "center" }}>{t("book.common.none")}</p>
              )}

              {filtered.length > 0 && (
                <>
                  <div className="book-catalog-grid">
                    {visible.map((b, i) => (
                      <BookCard key={b._id || i} book={b} t={t} />
                    ))}
                  </div>

                  {filtered.length > visibleCount && (
                    <div className="load-more-wrap">
                      <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                        {t("book.common.loadMore")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default Book;