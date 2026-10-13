import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import API from "../api/api";
import { stripHtml } from "../components/RichTextView";
import Spinner from "../components/Spinner";
import "./Church.css";

const LIMIT = 10;
const DESCRIPTION_CHARS = 800;

const clip = (text, max) => {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "...";
};

const Church = () => {
  const { t, i18n } = useTranslation();

  const [churches, setChurches] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    fetchChurches(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const readList = (res) => res.data.churches || res.data.data || res.data || [];

  const fetchChurches = async (nextPage) => {
    try {
      if (nextPage === 1) setLoading(true);
      else setLoadingMore(true);

      let res = await API.get(`/churches?page=${nextPage}&limit=${LIMIT}`);
      let list = readList(res);
      let totalPages = res.data.totalPages;
      let usedFallback = false;

      if (nextPage === 1 && list.length === 0) {
        res = await API.get(`/churches?page=${nextPage}&limit=${LIMIT}`, {
          headers: { "Accept-Language": "en" },
        });
        list = readList(res);
        totalPages = res.data.totalPages;
        usedFallback = list.length > 0;
      }

      setChurches((prev) => (nextPage === 1 ? list : [...prev, ...list]));
      setPage(nextPage);
      if (nextPage === 1) setFallback(usedFallback);
      setHasMore(totalPages != null ? nextPage < totalPages : list.length === LIMIT);
    } catch (err) {
      console.log(err);
      if (nextPage === 1) setChurches([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const scrollToChurches = () => {
    const el = document.getElementById("ethiopian-churches");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const staticItems = t("church.ethiopian.items", { returnObjects: true });
  const staticList = Array.isArray(staticItems) ? staticItems : [];

  const rows =
    churches.length > 0
      ? churches.map((c) => ({
          key: c.id,
          id: c.id,
          image: c.image || "",
          tag: stripHtml(c.address) || t("church.list.tagDefault"),
          name: stripHtml(c.churchName),
          text: clip(stripHtml(c.description || c.shortDescription), DESCRIPTION_CHARS),
        }))
      : staticList.map((item) => ({
          key: item.name,
          id: null,
          image: "",
          tag: item.region,
          place: item.location,
          name: item.name,
          text: item.description,
        }));

  return (
    <div className="church-page">
      <section className="church-hero">
        <div className="wrapper church-hero-inner">
          <div className="church-hero-text">
            <h1 className="display">{t("church.ethiopian.title")}</h1>
            <p>{t("church.ethiopian.description")}</p>
            <button className="hero-cta" onClick={scrollToChurches}>
              {t("church.hero.cta")}
            </button>
          </div>
          <div className="church-hero-media">
            <iframe
              className="ethiopia-map"
              title={t("church.hero.mapTitle")}
              src="https://www.openstreetmap.org/export/embed.html?bbox=32.5%2C3.0%2C48.5%2C15.2&layer=mapnik"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="ethiopia-section" id="ethiopian-churches">
        <div className="wrapper">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {fallback && (
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "24px" }}>
                  {t("church.list.fallbackNotice")}
                </p>
              )}
              <div className="ethiopia-list">
                {rows.map((row, index) => {
                  const media = row.image ? (
                    <img loading="lazy" decoding="async" src={row.image} alt={row.name} />
                  ) : (
                    <>
                      <span className="ethiopia-media-region">{row.tag}</span>
                      <span className="ethiopia-media-place">{row.place || row.name}</span>
                    </>
                  );
                  const mediaClass = `ethiopia-media${row.image ? " has-image" : ""}`;
                  return (
                    <div className={`ethiopia-row${index % 2 === 1 ? " reverse" : ""}`} key={row.key}>
                      {row.id ? (
                        <Link to={`/churches/${row.id}`} className={mediaClass}>
                          {media}
                        </Link>
                      ) : (
                        <div className={mediaClass}>{media}</div>
                      )}
                      <div className="ethiopia-copy">
                        <div className="blog-tag">{row.tag}</div>
                        <h3>{row.name}</h3>
                        <p>{row.text}</p>
                        {row.id && (
                          <Link className="read-more" to={`/churches/${row.id}`}>
                            {t("church.list.readMore")}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="ethiopia-more">
                  <button
                    className="load-more-btn"
                    onClick={() => !loadingMore && fetchChurches(page + 1)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? t("church.list.loadingMore") : t("church.list.loadMore")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Church;
