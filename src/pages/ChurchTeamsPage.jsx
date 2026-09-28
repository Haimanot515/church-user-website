import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import { stripHtml, Rich } from "../components/RichTextView";
import "./ChurchTeamsPage.css";

const Spinner = ({ light }) => (
  <div className="teams-spinner-wrap">
    <div className={`teams-spinner${light ? " teams-spinner--light" : ""}`} />
  </div>
);

// One person card. variant is "leader" (red section) or "voice" (white cards)
const PersonCard = ({ person, variant, avatarBg, quote }) => (
  <Link
    to={`/church-persons/${person.id}`}
    className={`teams-card teams-card--${variant}`}
  >
    <img
      className="teams-photo"
      src={
        (person.photos && person.photos[0]) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(stripHtml(person.name))}&background=${avatarBg}&color=fff`
      }
      alt={stripHtml(person.name)}
    />
    <div className="teams-card-body">
      <h3 className="teams-name">{stripHtml(person.name)}</h3>
      <div className="teams-role"><Rich html={person.role} /></div>
      <div className="teams-text">
        <Rich html={person.description} words={35} quote={quote} />
      </div>
    </div>
  </Link>
);

const ChurchTeamsPage = () => {
  const { t, i18n } = useTranslation();

  // Leadership, testimonials and special thanks all come from /church-persons
  const [leaders, setLeaders] = useState([]);
  const [thanksList, setThanksList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [leadersFallback, setLeadersFallback] = useState(false);
  const [thanksFallback, setThanksFallback] = useState(false);
  const [testimonialsFallback, setTestimonialsFallback] = useState(false);
  const [leadersLoading, setLeadersLoading] = useState(true);
  const [thanksLoading, setThanksLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    const fetchChurchPersons = async (category, setter, setFallback, setLoading) => {
      try {
        setLoading(true);
        setFallback(false);

        let res = await API.get("/church-persons", { params: { category } });
        let data = Array.isArray(res.data) ? res.data : [];

        // Fall back to English when the active locale has no entries
        if (data.length === 0) {
          res = await API.get("/church-persons", {
            params: { category },
            headers: { "Accept-Language": "en" },
          });
          data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) setFallback(true);
        }

        setter(data);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchChurchPersons("leader", setLeaders, setLeadersFallback, setLeadersLoading);
    fetchChurchPersons("specialThanks", setThanksList, setThanksFallback, setThanksLoading);
    fetchChurchPersons("testimony", setTestimonialsList, setTestimonialsFallback, setTestimonialsLoading);
    // Refetch whenever the user switches language
  }, [i18n.language]);

  return (
    <div className="teams-page">
      {/* PAGE INTRO */}
      <header className="teams-hero">
        <div className="teams-container">
          <h1 className="teams-hero-title">{t("team.heading")}</h1>
        </div>
      </header>

      {/* LEADERSHIP TEAM */}
      <section className="teams-section teams-section--red">
        <div className="teams-container">
          <h2 className="teams-heading">{t("team.leadership.heading")}</h2>

          {leadersFallback && !leadersLoading && (
            <p className="teams-notice">{t("team.leadership.fallbackNotice")}</p>
          )}

          {leadersLoading ? (
            <Spinner light />
          ) : (
            <div className="teams-grid">
              {leaders.map((p) => (
                <PersonCard key={p.id} person={p} variant="leader" avatarBg="0f2438" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="teams-section teams-section--sky">
        <div className="teams-container">
          <h2 className="teams-heading">{t("team.testimonials.heading")}</h2>

          {testimonialsFallback && !testimonialsLoading && (
            <p className="teams-notice">{t("team.testimonials.fallbackNotice")}</p>
          )}

          {testimonialsLoading ? (
            <Spinner />
          ) : (
            <div className="teams-grid">
              {testimonialsList.map((p) => (
                <PersonCard key={p.id} person={p} variant="voice" avatarBg="1c3a52" quote />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SPECIAL THANKS */}
      <section className="teams-section teams-section--white">
        <div className="teams-container">
          <h2 className="teams-heading">{t("team.specialThanks.heading")}</h2>

          {thanksFallback && !thanksLoading && (
            <p className="teams-notice">{t("team.specialThanks.fallbackNotice")}</p>
          )}

          {thanksLoading ? (
            <Spinner />
          ) : (
            <div className="teams-grid">
              {thanksList.map((p) => (
                <PersonCard key={p.id} person={p} variant="voice" avatarBg="7a1010" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChurchTeamsPage;