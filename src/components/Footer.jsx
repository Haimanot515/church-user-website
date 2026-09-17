import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.jsx";
import { useTranslation } from "react-i18next";
import { FaArrowUp, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

const footerColumns = [
  {
    key: "visit",
    items: [
      {
        key: "location",
        to: "/contact#location",
      },
      {
        key: "directions",
        external: "directions",
      },
    ],
  },
  {
    key: "getInvolved",
    items: [
      {
        key: "volunteer",
        to: "/church-support#volunteer",
      },
      {
        key: "give",
        to: "/church-support#accounts",
      },
    ],
  },
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
    href: "#", // TODO: replace with the church's actual Facebook page URL
    label: "Facebook",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    key: "email",
    href: "mailto:info@example.com", // TODO: replace with the church's actual email address
    label: "Email",
    icon: <FaEnvelope aria-hidden="true" size={18} />,
  },
];

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Same source of truth as Contact.jsx's "Get Directions" link, so this
  // footer link opens the exact same Google Maps destination.
  const MAP_QUERY = t("contact.location.mapQuery", { defaultValue: "Udine, Italy" });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [navVisible, setNavVisible] = useState(false);

  const [footerCategories, setFooterCategories] = useState([
    { name: "All", slug: "all" },
  ]);
  const [footerCategoriesLoading, setFooterCategoriesLoading] =
    useState(true);
  const [footerCategoriesError, setFooterCategoriesError] = useState("");
  const [footerCategoriesFallback, setFooterCategoriesFallback] =
    useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 10) {
        setNavVisible(false);
      } else if (delta > 5) {
        setNavVisible(false);
      } else if (delta < -5) {
        setNavVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

        let raw = Array.isArray(res.data)
          ? res.data
          : res.data.categories;

        let cats = (raw || [])
          .map((c) =>
            c && c.name && c.slug
              ? { name: c.name, slug: c.slug }
              : null
          )
          .filter(Boolean);

        if (cats.length === 0) {
          res = await API.get("/categories", {
            headers: {
              "Accept-Language": "en",
            },
          });

          raw = Array.isArray(res.data)
            ? res.data
            : res.data.categories;

          cats = (raw || [])
            .map((c) =>
              c && c.name && c.slug
                ? { name: c.name, slug: c.slug }
                : null
            )
            .filter(Boolean);

          if (cats.length > 0) {
            setFooterCategoriesFallback(true);
          }
        }

        if (cats.length > 0) {
          setFooterCategories([
            { name: "All", slug: "all" },
            ...cats,
          ]);
        }
      } catch (err) {
        console.error(
          "Error fetching footer categories:",
          err
        );

        setFooterCategoriesError(
          err.response?.data?.message ||
            t(
              "footer.categoryNav.errorDefault",
              "Unable to load categories."
            )
        );
      } finally {
        setFooterCategoriesLoading(false);
      }
    };

    fetchFooterCategories();
  }, [t]);

  const handleFooterCategoryClick = (cat) => {
    navigate("/projects", {
      state: {
        categorySlug: cat.slug,
      },
    });
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
      const res = await API.post("/subscribers", {
        email,
      });

      setStatus("success");

      setFeedback(
        res.data?.msg ||
          t("footer.newsletter.successDefault")
      );

      setEmail("");
    } catch (err) {
      console.error("Subscribe request failed:", err);

      setStatus("error");

      setFeedback(
        err.response?.data?.msg ||
          t("footer.newsletter.errorDefault")
      );
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // If the link has a hash (e.g. "/church-support#accounts"), let the
  // target page's hash-scroll effect handle positioning — don't yank
  // the viewport back to the top of the page.
  const scrollToTopOnNavigate = (to) => {
    if (to && to.includes("#")) return;
    window.scrollTo(0, 0);
  };

  return (
    <footer className="site-footer">
      {/* Categories */}
      <div
        className="footer-categories-bar"
        aria-label={t("home.categoryNav.ariaLabel")}
      >
        {footerCategoriesLoading ? (
          <span className="footer-categories-loading" />
        ) : (
          footerCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className="footer-category-chip"
              onClick={() =>
                handleFooterCategoryClick(cat)
              }
            >
              {cat.slug === "all"
                ? t("home.categoryNav.all")
                : cat.name}
            </button>
          ))
        )}
      </div>

      {footerCategoriesError && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#ffb4b4",
            margin: "8px 0 0 0",
          }}
        >
          {footerCategoriesError}
        </p>
      )}

      {footerCategoriesFallback && !footerCategoriesError && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#a9c2d3",
            margin: "8px 0 0 0",
          }}
        >
          {t(
            "home.categoryNav.fallbackNotice",
            "Showing categories in English — none available in your selected language yet."
          )}
        </p>
      )}

      {/* Mobile Bottom Navigation */}
      <nav
        className={`footer-bottom-navbar${
          navVisible
            ? " footer-bottom-navbar--visible"
            : ""
        }`}
        aria-label={t("footer.mobileNav", "Quick actions")}
      >
        <Link
          to="/contact#contact-form"
          className="footer-contact-fab"
          aria-label={t("footer.contactFab", "Send us a message")}
        >
          <FaEnvelope aria-hidden="true" />

          <span
            className="footer-nav-label"
            aria-hidden="true"
          >
            {t("footer.contactFabShort", "Send")}
          </span>
        </Link>

        <button
          type="button"
          className="footer-back-to-top"
          onClick={scrollToTop}
          aria-label={t("footer.backToTop", "Back to top")}
        >
          <FaArrowUp aria-hidden="true" />

          <span
            className="footer-nav-label"
            aria-hidden="true"
          >
            {t("footer.backToTopShort", "Top")}
          </span>
        </button>
      </nav>

      {/* Newsletter */}
      <section
        style={{
          background:
            "linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)",
          color: "#eaf3f8",
        }}
      >
        <div
          className="wrapper"
          style={{
            maxWidth: "640px",
            textAlign: "center",
          }}
        >
          <h3
            className="display"
            style={{
              fontSize: "2.9rem",
              fontWeight: 700,
              margin: "18px 0 18px 0",
            }}
          >
            {t("footer.newsletter.heading")}
          </h3>

          <p
            style={{
              fontSize: "1.3rem",
              color: "#a9c2d3",
              marginBottom: "32px",
            }}
          >
            {t("footer.newsletter.subheading")}
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(
                "footer.newsletter.placeholder"
              )}
              disabled={status === "loading"}
              style={{
                padding: "15px 20px",
                fontSize: "1.1rem",
                border:
                  "1px solid rgba(255,255,255,0.2)",
                borderRadius: "30px",
                width: "280px",
                maxWidth: "80vw",
                background:
                  "rgba(255,255,255,0.08)",
                color: "#fff",
              }}
            />

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "var(--gold)",
                color: "var(--navy-deep)",
                border: "none",
                padding: "15px 32px",
                fontWeight: 700,
                borderRadius: "30px",
                cursor:
                  status === "loading"
                    ? "default"
                    : "pointer",
                fontSize: "1.05rem",
                opacity:
                  status === "loading"
                    ? 0.7
                    : 1,
              }}
            >
              {status === "loading"
                ? t(
                    "footer.newsletter.subscribingButton"
                  )
                : t(
                    "footer.newsletter.subscribeButton"
                  )}
            </button>
          </form>

          {feedback && (
            <p
              role="status"
              style={{
                marginTop: "16px",
                fontSize: "0.95rem",
                color:
                  status === "error"
                    ? "#ffb4b4"
                    : "#a9e3c3",
              }}
            >
              {feedback}
            </p>
          )}
        </div>
      </section>

      {/* Footer Content */}
      <div className="wrapper">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <h4 className="display footer-brand">
              {t("footer.brand.name")}
            </h4>

            <p className="footer-tagline">
              {t("footer.brand.tagline")}
            </p>
          </div>

          {/* Visit / Get Involved / Connect */}
          {footerColumns.map((col) => (
            <div key={col.key}>
              <h5 className="eyebrow footer-col-title">
                {t(
                  `footer.columns.${col.key}.title`
                )}
              </h5>

              {col.items.map((item) => (
                <p
                  key={item.key}
                  className="footer-link"
                >
                  {item.external === "directions" ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        MAP_QUERY
                      )}`}
                      className="footer-column-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t(
                        `footer.columns.${col.key}.items.${item.key}`
                      )}
                    </a>
                  ) : item.to ? (
                    <Link
                      to={item.to}
                      className="footer-column-link"
                      onClick={() =>
                        scrollToTopOnNavigate(item.to)
                      }
                    >
                      {t(
                        `footer.columns.${col.key}.items.${item.key}`
                      )}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="footer-column-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t(
                        `footer.columns.${col.key}.items.${item.key}`
                      )}
                    </a>
                  )}
                </p>
              ))}
            </div>
          ))}

          {/* Quick Links */}
          <div className="footer-quicklinks-col">
            <h5 className="eyebrow footer-col-title">
              {t(
                "footer.columns.quickLinks.title",
                "Quick Links"
              )}
            </h5>

            <ul className="footer-quicklinks">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.to}
                    className="footer-link footer-quicklink-item"
                    onClick={() =>
                      scrollToTopOnNavigate(link.to)
                    }
                  >
                    {t(`navbar.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="footer-social-viewport">
          <div className="footer-social-track footer-social-track--static">
            {socialLinks.map((s) => (
              <a
                key={s.key}
                href={s.href}
                className="footer-social-icon"
                aria-label={s.label}
                target={s.key === "email" ? undefined : "_blank"}
                rel={s.key === "email" ? undefined : "noopener noreferrer"}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="eyebrow footer-bottom-text">
            {t("footer.bottom.copyright")}
          </p>

          <p className="eyebrow footer-bottom-text">
            {t("footer.bottom.privacyPolicy")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;