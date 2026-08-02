import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import "./Services.css";

/**
 * Public Services page.
 *
 * Services are now fetched from the backend (same API client/pattern used
 * in ManageServices.jsx) instead of a hardcoded array. Only services with
 * status "active" are shown to visitors.
 *
 * Uses the same outer shell as ChurchBlogPage.jsx (home page):
 * drifting cloud layer and site footer — so this page reads as part
 * of the same site.
 *
 * Styles live in Services.css (imported above) rather than an inline
 * <style> block.
 */
const Services = () => {
  const { t } = useTranslation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  // NEW: true when the services currently shown came from the English
  // fallback because the active language had none
  const [servicesFallback, setServicesFallback] = useState(false);

  // Reusable inline loading spinner — shown while a section's data is
  // being fetched from the backend, so no hardcoded frontend placeholder
  // content is ever visible before the real data arrives. Same
  // markup/classes as Home.jsx's Spinner, so it renders identically.
  const Spinner = ({ light }) => (
    <div className="loading-spinner-wrap">
      <div className={`loading-spinner${light ? " light" : ""}`} />
    </div>
  );

  // Turns whatever the API sends back for imageUrl (a full URL, or just a
  // filename/relative path saved from an upload) into a usable <img src>.
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl; // already a full URL
    const base = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");
    const path = imageUrl.startsWith("/") ? imageUrl : `/uploads/${imageUrl}`;
    return `${base}${path}`;
  };

  // === Fetch services, same Accept-Language fallback pattern used
  // elsewhere on the site (Blog, Travel, About): try the active language
  // first, and if it comes back with no active services, retry with an
  // explicit "en" header and flag it. ===
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      setServicesFallback(false);

      let res = await API.get("/services");
      let active = (res.data || [])
        .filter((s) => s.status === "active")
        .map((s) => ({ ...s, resolvedImageUrl: getImageUrl(s.imageUrl) }));

      if (active.length === 0) {
        res = await API.get("/services", {
          headers: { "Accept-Language": "en" },
        });
        active = (res.data || [])
          .filter((s) => s.status === "active")
          .map((s) => ({ ...s, resolvedImageUrl: getImageUrl(s.imageUrl) }));
        if (active.length > 0) setServicesFallback(true);
      }

      setServices(active);
    } catch (err) {
      setError(err.response?.data?.message || t("services.list.errorDefault"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const footerColumns = [
    { title: t("services.footer.visit.title"), items: t("services.footer.visit.items", { returnObjects: true }) },
    { title: t("services.footer.getInvolved.title"), items: t("services.footer.getInvolved.items", { returnObjects: true }) },
    { title: t("services.footer.connect.title"), items: t("services.footer.connect.items", { returnObjects: true }) },
  ];

  return (
    <div className="services-portal">
      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <section className="services-hero">
        <div className="wrapper">
          <h1 className="display">{t("services.hero.title")}</h1>
          <p>{t("services.hero.description")}</p>
        </div>
      </section>

      <section className="services-list">
        <div className="wrapper">
          {loading && <Spinner />}

          {!loading && error && (
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          )}

          {!loading && !error && servicesFallback && (
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "24px" }}>
              {t("services.list.fallbackNotice")}
            </p>
          )}

          {!loading && !error && services.length === 0 && (
            <p style={{ textAlign: "center" }}>{t("services.list.none")}</p>
          )}

          {!loading && !error && services.slice(0, visibleCount).map((s, i) => (
            <div className={`service-row${i % 2 === 1 ? " reverse" : ""}`} key={s._id || i}>
              <div className="service-img">
                {s.resolvedImageUrl ? (
                  <img src={s.resolvedImageUrl} alt={s.title} />
                ) : (
                  <div className="service-img-placeholder" aria-hidden="true" />
                )}
              </div>
              <div className="service-copy">
                <svg className="service-cross" width="22" height="32" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="0" width="4" height="32" fill="var(--gold)" />
                  <rect x="1" y="12" width="20" height="4" fill="var(--gold)" />
                </svg>
                <h2>{s.title}</h2>
                <p className="time">{s.schedule}{s.location ? ` · ${s.location}` : ""}</p>
                {s.isFeatured && <p className="note">{t("services.list.featuredNote")}</p>}
                <p className="desc">{s.description}</p>
              </div>
            </div>
          ))}

          {!loading && !error && services.length > visibleCount && (
            <div className="load-more-wrap">
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount((c) => c + 10)}
              >
                {t("services.list.loadMoreButton")}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="services-cta">
        <div className="wrapper">
          <h3 className="display">{t("services.cta.title")}</h3>
          <p>{t("services.cta.description")}</p>
        </div>
      </section>

    </div>
  );
};

export default Services;