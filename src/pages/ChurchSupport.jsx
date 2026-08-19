import React from "react";
import { useTranslation } from "react-i18next";
import "./ChurchSupport.css";

const ChurchSupport = () => {
  const { t } = useTranslation();

  // Static data — bank details are literal values, not translatable text,
  // same treatment Contact.jsx gives the map query / church name source.
  const accountNumbers = [
    {
      bank: "Commercial Bank of Ethiopia",
      accountName: "Debre Selam Abune Gebre Menfes Kidus Church",
      accountNumber: "1000 0000 0000",
    },
    {
      bank: "Awash Bank",
      accountName: "Debre Selam Abune Gebre Menfes Kidus Church",
      accountNumber: "2000 0000 0000",
    },
    {
      bank: "Dashen Bank",
      accountName: "Debre Selam Abune Gebre Menfes Kidus Church",
      accountNumber: "3000 0000 0000",
    },
  ];

  // Pulled from translation files with returnObjects, same pattern as
  // Contact.jsx's quickFacts / reachMethods / serviceTimes.
  const volunteerActivitiesRaw = t("churchSupport.volunteer.items", {
    returnObjects: true,
  });
  const volunteerActivities = Array.isArray(volunteerActivitiesRaw)
    ? volunteerActivitiesRaw
    : [];

  const supportWaysRaw = t("churchSupport.ways.items", {
    returnObjects: true,
  });
  const supportWays = Array.isArray(supportWaysRaw) ? supportWaysRaw : [];

  return (
    <main className="church-support-page">
      {/* HERO */}
      <section className="support-hero">
        <div className="support-container">
          <span className="support-eyebrow">
            {t("churchSupport.hero.eyebrow")}
          </span>

          <h1>{t("churchSupport.hero.title")}</h1>

          <p>{t("churchSupport.hero.description")}</p>
        </div>
      </section>

      {/* ACCOUNT NUMBERS */}
      <section className="support-section account-section">
        <div className="support-container">
          <div className="section-heading">
            <span className="support-eyebrow">
              {t("churchSupport.accounts.eyebrow")}
            </span>

            <h2>{t("churchSupport.accounts.title")}</h2>

            <p>{t("churchSupport.accounts.description")}</p>
          </div>

          <div className="account-table-wrapper">
            <table className="account-table">
              <thead>
                <tr>
                  <th>{t("churchSupport.accounts.table.number")}</th>
                  <th>{t("churchSupport.accounts.table.bank")}</th>
                  <th>{t("churchSupport.accounts.table.holder")}</th>
                  <th>{t("churchSupport.accounts.table.account")}</th>
                </tr>
              </thead>

              <tbody>
                {accountNumbers.map((account, index) => (
                  <tr key={account.accountNumber}>
                    <td data-label={t("churchSupport.accounts.table.number")}>
                      {index + 1}
                    </td>

                    <td data-label={t("churchSupport.accounts.table.bank")}>
                      <strong>{account.bank}</strong>
                    </td>

                    <td data-label={t("churchSupport.accounts.table.holder")}>
                      {account.accountName}
                    </td>

                    <td data-label={t("churchSupport.accounts.table.account")}>
                      <span className="account-number">
                        {account.accountNumber}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="account-note">
            <span className="note-icon">ℹ</span>

            <p>{t("churchSupport.accounts.note")}</p>
          </div>
        </div>
      </section>

      {/* VOLUNTEER ACTIVITIES */}
      <section className="support-section volunteer-section">
        <div className="support-container">
          <div className="section-heading light-heading">
            <span className="support-eyebrow">
              {t("churchSupport.volunteer.eyebrow")}
            </span>

            <h2>{t("churchSupport.volunteer.title")}</h2>

            <p>{t("churchSupport.volunteer.description")}</p>
          </div>

          <div className="volunteer-grid">
            {volunteerActivities.map((activity, i) => (
              <article className="volunteer-card" key={activity.title || i}>
                <div className="support-icon">{activity.icon}</div>

                <h3>{activity.title}</h3>

                <p>{activity.description}</p>

                <div className="card-line" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER WAYS TO SUPPORT */}
      <section className="support-section ways-section">
        <div className="support-container">
          <div className="section-heading">
            <span className="support-eyebrow">
              {t("churchSupport.ways.eyebrow")}
            </span>

            <h2>{t("churchSupport.ways.title")}</h2>

            <p>{t("churchSupport.ways.description")}</p>
          </div>

          <div className="ways-grid">
            {supportWays.map((way, i) => (
              <article className="way-card" key={way.title || i}>
                <div className="way-icon">{way.icon}</div>

                <div>
                  <h3>{way.title}</h3>
                  <p>{way.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="support-cta">
            <div>
              <span className="support-eyebrow">
                {t("churchSupport.cta.eyebrow")}
              </span>

              <h3>{t("churchSupport.cta.title")}</h3>

              <p>{t("churchSupport.cta.description")}</p>
            </div>

            <a href="/contact" className="support-contact-btn">
              {t("churchSupport.cta.contactButton")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChurchSupport;