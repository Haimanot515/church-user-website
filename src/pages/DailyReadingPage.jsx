import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import API from "../api/api";
import Spinner from "../components/Spinner";
import "./DailyReadingPage.css";

// shown when the active language has no misbak for a day (Amharic is the original)
const FALLBACK_LANGUAGE = "am";

const lines = (text) => text.split("\n").filter(Boolean);

const fetchMisbak = async (path, lang) => {
  try {
    return { data: (await API.get(path)).data, fallback: false };
  } catch (err) {
    const canRetry = err.response?.status === 404 && lang !== FALLBACK_LANGUAGE;
    if (!canRetry) throw err;
  }
  const res = await API.get(path, { headers: { "Accept-Language": FALLBACK_LANGUAGE } });
  return { data: res.data, fallback: true };
};

export default function DailyReadingPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").split("-")[0].toLowerCase();
  const [state, setState] = useState({ status: "loading", misbak: null, fallback: false });
  const latest = useRef(0);

  // only the newest request may update the page, so quick arrow clicks can't race
  const load = useCallback(
    async (path) => {
      const id = ++latest.current;
      setState((s) => ({ ...s, status: "loading" }));
      try {
        const { data, fallback } = await fetchMisbak(path, lang);
        if (id === latest.current) setState({ status: "ready", misbak: data, fallback });
      } catch (err) {
        if (id !== latest.current) return;
        const status = err.response?.status === 404 ? "empty" : "error";
        setState({ status, misbak: null, fallback: false });
      }
    },
    [lang]
  );

  useEffect(() => {
    load("/misbak/today");
  }, [load]);

  const { status, misbak, fallback } = state;
  const busy = status === "loading";
  const hasPrev = !busy && Boolean(misbak?.prevDate);
  const hasNext = !busy && Boolean(misbak?.nextDate);

  return (
    <main className="daily">
      {["left", "right"].map((side) => (
        <div
          key={side}
          className={"daily__string daily__string--" + side}
          aria-hidden="true"
        >
          <span className="daily__line" />
          <svg width="28" height="40" viewBox="0 0 28 40">
            <rect x="12" y="0" width="4" height="40" fill="currentColor" />
            <rect x="2" y="14" width="24" height="4" fill="currentColor" />
          </svg>
          <span className="daily__line" />
        </div>
      ))}

      <div className="daily__stage">
        <button
          type="button"
          className="daily__arrow daily__arrow--prev"
          onClick={() => load("/misbak/date/" + misbak.prevDate)}
          disabled={!hasPrev}
          aria-label={t("misbak.prevAria")}
          title={t("common.previous")}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {misbak ? (
          <article
            key={misbak.date}
            className="misbak"
            aria-labelledby="misbak-verse"
          >
            <h1 className="misbak__tag">
              {t("navbar.links.dailyMisbak")}
              <svg
                className="misbak__quote"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M5 18v-5c0-3.5 1.8-5.8 5-6.5l.6 1.5C9 8.6 8.2 9.6 8 11h3v7H5Zm8 0v-5c0-3.5 1.8-5.8 5-6.5l.6 1.5c-1.6.6-2.4 1.6-2.6 3h3v7h-6Z"
                />
              </svg>
            </h1>

            <h2 id="misbak-verse" className="misbak__ref">
              {misbak.verse}
            </h2>

            <div className="misbak__body misbak__body--geez">
              {lines(misbak.body).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <h3 className="misbak__sub">{t("misbak.meaning")}</h3>

            <div className="misbak__body">
              {lines(misbak.meaning).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {fallback && <p className="misbak__notice">{t("misbak.fallbackNotice")}</p>}
          </article>
        ) : (
          !busy && (
            <p className="misbak__status" role="status">
              {t(status === "empty" ? "misbak.empty" : "misbak.error")}
            </p>
          )
        )}

        <button
          type="button"
          className="daily__arrow daily__arrow--next"
          onClick={() => load("/misbak/date/" + misbak.nextDate)}
          disabled={!hasNext}
          aria-label={t("misbak.nextAria")}
          title={t("common.next")}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {misbak && <p className="daily__date">{misbak.ethiopian.label}</p>}
      </div>

      {busy && <Spinner />}
    </main>
  );
}
