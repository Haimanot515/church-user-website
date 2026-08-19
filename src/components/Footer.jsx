import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.jsx";
import { useTranslation } from "react-i18next";
import { FaArrowUp, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

const footerColumns = [
  { key: "visit", items: ["serviceTimes", "directions", "whatToExpect"] },
  { key: "getInvolved", items: ["ministries", "volunteer", "give", "missions"] },
  { key: "connect", items: ["facebook", "instagram", "youtube"] }
];

const quickLinks = [
  { to: "/about", key: "about" },
  { to: "/projects", key: "blogs" },
  { to: "/services", key: "services" },
  { to: "/cv", key: "church" },
  { to: "/skill", key: "sermon" },
  { to: "/testimonials", key: "travel" },
  { to: "/contact", key: "contact" },
  { to: "/media", key: "media" },
  { to: "/book", key: "books" },
];

const socialLinks = [
  {
    key: "facebook",
    href: "#",
    label: "Facebook",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    href: "#",
    label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
        <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37Z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "youtube",
    href: "#",
    label: "YouTube",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.75 15.5v-7l6.27 3.5-6.27 3.5Z" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    href: "#",
    label: "TikTok",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.6 2h-3.2v13.2a3.1 3.1 0 1 1-2.2-2.97V8.9a6.2 6.2 0 1 0 5.4 6.15V9.03a8.1 8.1 0 0 0 5 1.7V7.5a4.9 4.9 0 0 1-5-5.5Z" />
      </svg>
    ),
  },
  {
    key: "x",
    href: "#",
    label: "X",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-7.6 8.68L23.3 22h-6.9l-5.4-6.86L4.8 22H1.6l8.13-9.29L1 2h7.1l4.9 6.28L18.9 2Zm-1.2 18.2h1.7L7.4 3.7H5.6l12.1 16.5Z" />
      </svg>
    ),
  },
  {
    key: "whatsapp",
    href: "#",
    label: "WhatsApp",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.78 14.03c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.28-3.43-.72-2.9-1.2-4.77-4.15-4.92-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.4.27-.28.58-.35.78-.35.2 0 .4 0 .57.01.18.01.43-.07.68.52.24.6.82 2.06.9 2.2.07.15.12.32.02.52-.1.2-.15.32-.29.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.72.82 2.02.96.3.15.5.22.57.35.07.13.07.75-.17 1.44Z" />
      </svg>
    ),
  },
  {
    key: "telegram",
    href: "#",
    label: "Telegram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.94 3.68 18.6 20.02c-.25 1.1-.9 1.37-1.83.86l-5.05-3.73-2.44 2.36c-.27.27-.5.5-1.02.5l.36-5.16 9.4-8.5c.41-.36-.09-.56-.63-.2L6.6 12.8l-4.98-1.56c-1.08-.34-1.1-1.08.23-1.6L20.6 2.4c.9-.33 1.69.2 1.34 1.28Z" />
      </svg>
    ),
  },
 
  {
    key: "linkedin",
    href: "#",
    label: "LinkedIn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
 
 
];

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [feedback, setFeedback] = useState("");

  // Bottom nav bar visibility (mobile/tablet only — see .footer-bottom-navbar
  // in Footer.css). Hidden on initial page load / while at the very top of
  // the page. Hides while the user scrolls down, slides back in while
  // scrolling up — same pattern as LinkedIn's mobile bottom bar.
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 10) {
        setNavVisible(false); // back at the top — stay hidden
      } else if (delta > 5) {
        setNavVisible(false); // scrolling down
      } else if (delta < -5) {
        setNavVisible(true); // scrolling up
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Categories for the top-of-footer bar. Same source/fallback pattern as
  // Home's category nav (src/pages/Home.jsx, fetchCategories) and Blog's
  // (src/pages/Blog.jsx, fetchCategories) — each entry is { name, slug }.
  // slug is the language-independent key sent to the backend when
  // filtering; name is the translated label shown in the chip. Fetched
  // independently so the footer works even if Home/Blog haven't loaded
  // categories yet in this session. Re-fetches whenever the active
  // language (t) changes, and falls back to English if the active
  // language currently has zero categories — exactly like Home/Blog.
  const [footerCategories, setFooterCategories] = useState([{ name: "All", slug: "all" }]);
  const [footerCategoriesLoading, setFooterCategoriesLoading] = useState(true);
  const [footerCategoriesError, setFooterCategoriesError] = useState("");
  // true when the categories currently shown came from the English
  // fallback because the active language had none (mirrors Home/Blog)
  const [footerCategoriesFallback, setFooterCategoriesFallback] = useState(false);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback("");
      setStatus("idle");
    }, 5000);
    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const fetchFooterCategories = async () => {
      try {
        setFooterCategoriesLoading(true);
        setFooterCategoriesError("");
        setFooterCategoriesFallback(false);

        let res = await API.get("/categories");
        let raw = Array.isArray(res.data) ? res.data : res.data.categories;
        let cats = (raw || [])
          .map((c) => (c && c.name && c.slug ? { name: c.name, slug: c.slug } : null))
          .filter(Boolean);

        if (cats.length === 0) {
          res = await API.get("/categories", {
            headers: { "Accept-Language": "en" },
          });
          raw = Array.isArray(res.data) ? res.data : res.data.categories;
          cats = (raw || [])
            .map((c) => (c && c.name && c.slug ? { name: c.name, slug: c.slug } : null))
            .filter(Boolean);

          if (cats.length > 0) {
            setFooterCategoriesFallback(true);
          }
        }

        if (cats.length > 0) {
          setFooterCategories([{ name: "All", slug: "all" }, ...cats]);
        }
      } catch (err) {
        console.error("Error fetching footer categories:", err);
        setFooterCategoriesError(
          err.response?.data?.message ||
            t("footer.categoryNav.errorDefault", "Unable to load categories.")
        );
      } finally {
        setFooterCategoriesLoading(false);
      }
    };
    fetchFooterCategories();
  }, [t]);

  // Navigate to the Blog page with the chosen category's SLUG in router
  // state; Blog picks this up on mount via location.state.categorySlug,
  // applies the filter (sent to the backend as categorySlug, not the
  // translated name), and scrolls to the top of the post list once it's
  // loaded. Note: the Blog component (src/pages/Blog.jsx) is mounted at
  // "/projects" in App.jsx, not "/blog".
  const handleFooterCategoryClick = (cat) => {
    navigate("/projects", { state: { categorySlug: cat.slug } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setFeedback(t("footer.newsletter.errorEmpty"));
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await API.post("/subscribers", { email });
      setStatus("success");
      setFeedback(res.data?.msg || t("footer.newsletter.successDefault"));
      setEmail("");
    } catch (err) {
      console.error("Subscribe request failed:", err);
      setStatus("error");
      setFeedback(err.response?.data?.msg || t("footer.newsletter.errorDefault"));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTopOnNavigate = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="site-footer">
      {/* Categories bar — fills the strip at the top of the footer.
          Clicking a chip sends the user to Home already filtered to
          that category, scrolled to the sermons section. Same fetch/
          fallback logic as Home's category nav (see fetchFooterCategories
          above): retries in English if the active language has none, and
          re-fetches whenever the active language changes. */}
      <div className="footer-categories-bar" aria-label={t("home.categoryNav.ariaLabel")}>
        {footerCategoriesLoading ? (
          <span className="footer-categories-loading" />
        ) : (
          footerCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className="footer-category-chip"
              onClick={() => handleFooterCategoryClick(cat)}
            >
              {cat.slug === "all" ? t("home.categoryNav.all") : cat.name}
            </button>
          ))
        )}
      </div>

      {/* note shown when the categories request failed outright */}
      {footerCategoriesError && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#ffb4b4', margin: '8px 0 0 0' }}>
          {footerCategoriesError}
        </p>
      )}

      {/* note shown when categories fell back to English (mirrors Home) */}
      {footerCategoriesFallback && !footerCategoriesError && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#a9c2d3', margin: '8px 0 0 0' }}>
          {t("home.categoryNav.fallbackNotice", "Showing categories in English — none available in your selected language yet.")}
        </p>
      )}

      {/* Mobile/tablet bottom nav bar — houses both floating buttons.
          Hidden on desktop, where the two buttons stay as independent
          corner FABs (see Footer.css). Each button now shows a short
          text label ("Send" / "Top") stacked under its icon inside the
          bar; the label is aria-hidden since the button's own
          aria-label already announces the full action to screen
          readers. */}
      <nav
        className={`footer-bottom-navbar${navVisible ? " footer-bottom-navbar--visible" : ""}`}
        aria-label={t("footer.mobileNav", "Quick actions")}
      >
        <Link
          to="/contact#contact-form"
          className="footer-contact-fab"
          aria-label={t("footer.contactFab", "Send us a message")}
        >
          <FaEnvelope aria-hidden="true" />
          <span className="footer-nav-label" aria-hidden="true">
            {t("footer.contactFabShort", "Send")}
          </span>
          <span className="footer-fab-tooltip" aria-hidden="true">
            {t("footer.contactFab", "Send us a message")}
          </span>
          <span className="visually-hidden">{t("footer.contactFab", "Send us a message")}</span>
        </Link>

        <button
          type="button"
          className="footer-back-to-top"
          onClick={scrollToTop}
          aria-label={t("footer.backToTop", "Back to top")}
        >
          <FaArrowUp aria-hidden="true" />
          <span className="footer-nav-label" aria-hidden="true">
            {t("footer.backToTopShort", "Top")}
          </span>
          <span className="footer-fab-tooltip" aria-hidden="true">
            {t("footer.backToTop", "Back to top")}
          </span>
          <span className="visually-hidden">{t("footer.backToTop", "Back to top")}</span>
        </button>
      </nav>

      <section style={{ background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)', color: '#eaf3f8' }}>
        <div className="wrapper" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <h3 className="display" style={{ fontSize: '2.9rem', fontWeight: 700, margin: '18px 0 18px 0' }}>
            {t("footer.newsletter.heading")}
          </h3>
          <p style={{ fontSize: '1.3rem', color: '#a9c2d3', marginBottom: '32px' }}>
            {t("footer.newsletter.subheading")}
          </p>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.newsletter.placeholder")}
              disabled={status === "loading"}
              style={{ padding: '15px 20px', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', width: '280px', maxWidth: '80vw', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{ background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', padding: '15px 32px', fontWeight: 700, borderRadius: '30px', cursor: status === "loading" ? 'default' : 'pointer', fontSize: '1.05rem', opacity: status === "loading" ? 0.7 : 1 }}
            >
              {status === "loading" ? t("footer.newsletter.subscribingButton") : t("footer.newsletter.subscribeButton")}
            </button>
          </form>
          {feedback && (
            <p
              role="status"
              style={{
                marginTop: '16px',
                fontSize: '0.95rem',
                color: status === "error" ? '#ffb4b4' : '#a9e3c3',
              }}
            >
              {feedback}
            </p>
          )}
        </div>
      </section>

      <div className="wrapper">
        <div className="footer-grid">
          <div>
            <h4 className="display footer-brand">{t("footer.brand.name")}</h4>
            <p className="footer-tagline">{t("footer.brand.tagline")}</p>
          </div>
          {footerColumns.map((col, i) => (
            <div key={i}>
              <h5 className="eyebrow footer-col-title">{t(`footer.columns.${col.key}.title`)}</h5>
              {col.items.map((itemKey, j) => (
                <p key={j} className="footer-link">{t(`footer.columns.${col.key}.items.${itemKey}`)}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-quicklinks-col">
          <h5 className="eyebrow footer-col-title">{t("footer.columns.quickLinks.title", "Quick Links")}</h5>
          <ul className="footer-quicklinks">
            {quickLinks.map((link) => (
              <li key={link.key}>
                <Link
                  to={link.to}
                  className="footer-link footer-quicklink-item"
                  onClick={scrollToTopOnNavigate}
                >
                  {t(`navbar.links.${link.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-social-viewport">
          <div className="footer-social-track">
            {socialLinks.map((s) => (
              <a
                key={s.key}
                href={s.href}
                className="footer-social-icon"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
            {socialLinks.map((s) => (
              <a
                key={`${s.key}-dup`}
                href={s.href}
                className="footer-social-icon"
                aria-hidden="true"
                tabIndex={-1}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="eyebrow footer-bottom-text">{t("footer.bottom.copyright")}</p>
          <p className="eyebrow footer-bottom-text">{t("footer.bottom.privacyPolicy")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;