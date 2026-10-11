import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api.jsx";
import RichTextView, { stripHtml } from "../components/RichTextView";
import "./Blog.css";
import "./Detail.css";
import "./PromotionDetail.css";
import Spinner from "../components/Spinner";

const PromotionDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [otherPromotions, setOtherPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/promotions");
        const list = Array.isArray(res.data) ? res.data : res.data.promotions;
        // PostgreSQL/Prisma returns `id`, not MongoDB `_id`
        const match = (list || []).find((p) => p.id === id);
        setPromotion(match || null);
        setOtherPromotions((list || []).filter((p) => p.id !== id));
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || t("common.errors.promotion"));
      } finally {
        setLoading(false);
      }
    };
    fetchPromotion();
  }, [id]);

  // === Same fixed top-left back button used on the Detail page ===
  const BackButton = () => (
    <Link to="/" aria-label={t("common.goBack")} className="detail-back-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );

  if (loading) {
    return (
      <div className="church-portal">
        <BackButton />
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="church-portal">
        <BackButton />
        <div className="wrapper" style={{ padding: "80px 0", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error || t("common.errors.promotionNotFound")}</p>
          <Link to="/" style={{ color: "var(--gold, #b8860b)" }}>{t("common.backTo.home")}</Link>
        </div>
      </div>
    );
  }

  const image = promotion.image || promotion.photo || promotion.photoUrl || promotion.imageUrl;

  return (
    <div className="church-portal">
      <BackButton />

      <section className="promo-hero-section">
        <div className="wrapper" style={{ maxWidth: "900px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#d32f2f", textTransform: "uppercase", marginBottom: "16px", display: "block" }}>
            {t("common.labels.sponsoredContent")}
          </span>

          {image && (
            <img loading="lazy" decoding="async"
              src={image}
              alt={stripHtml(promotion.title) || t("common.labels.sponsoredContent")}
              className="promo-hero-image"
            />
          )}

          <h1 className="promo-title">
            {stripHtml(promotion.title)}
          </h1>

          <RichTextView className="promo-description" html={promotion.description} />

          {promotion.link && (
            <button
              className="promo-visit-btn"
              onClick={() => window.open(promotion.link, "_blank", "noopener,noreferrer")}
            >
              {t("common.labels.visitSponsor")}
            </button>
          )}
        </div>
      </section>

      {otherPromotions.length > 0 && (
        <section className="promo-more-section">
          <div className="wrapper" style={{ maxWidth: "1080px" }}>
            <h3 className="promo-more-heading">
              {t("common.related.morePromotions")}
            </h3>
            <div className="promo-more-grid">
              {otherPromotions.map((p) => {
                const thumb = p.image || p.photo || p.photoUrl || p.imageUrl;
                return (
                  <div
                    key={p.id}
                    className="promo-more-card"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate(`/promotions/${p.id}`);
                    }}
                  >
                    {thumb && (
                      <img loading="lazy" decoding="async"
                        src={thumb}
                        alt={stripHtml(p.title) || t("common.labels.sponsoredContent")}
                        className="promo-more-thumb"
                      />
                    )}
                    <div className="promo-more-card-body">
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#d32f2f", textTransform: "uppercase" }}>
                        {t("common.labels.sponsored")}
                      </span>
                      <h4 className="promo-more-card-title">
                        {stripHtml(p.title)}
                      </h4>
                      <p className="promo-more-card-desc">
                        {stripHtml(p.description)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PromotionDetail;