import { useState } from "react";
import "./DailyReadingPage.css";

// oldest first, newest last; same fields as the Misbak table
const misbaks = [
  // placeholder days, delete them and add real ones
  {
    date: "23/01/2019",
    title: "የዕለቱ ምስባክ",
    verse: "መዝሙር",
    body: "ምስባክ እዚህ ይገባል",
    meaning: "ትርጉም እዚህ ይገባል",
  },
  {
    date: "24/01/2019",
    title: "የዕለቱ ምስባክ",
    verse: "መዝሙር",
    body: "ምስባክ እዚህ ይገባል",
    meaning: "ትርጉም እዚህ ይገባል",
  },
  {
    date: "25/01/2019",
    title: "የዕለቱ ምስባክ",
    verse: "መዝሙር 138:7-8",
    body: "ወአይቴ እጐይይ እምቅድመ ገጽከ\nእመኒ ዐረጉ ውስተ ሰማይ ህየኒ አንተ\nወእመኒ ወረድኩ ውስተ ቀላይ ህየኒ ሀሎከ",
    meaning: "ከፊትህስ ወዴት እሸሻለሁ?\nወደ ሰማይ ብወጣ፥ አንተ በዚያ ነህ፤\nወደ ሲኦልም ብወርድ፥ በዚያ አለህ።",
  },
];

// one paragraph per line
const lines = (text) => text.split("\n").filter(Boolean);

export default function DailyReadingPage() {
  // start on the newest misbak
  const [index, setIndex] = useState(misbaks.length - 1);
  const misbak = misbaks[index];

  const hasPrev = index > 0;
  const hasNext = index < misbaks.length - 1;

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
          onClick={() => setIndex(index - 1)}
          disabled={!hasPrev}
          aria-label="ቀዳሚ ምስባክ"
          title="ቀዳሚ"
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

        <article
          key={misbak.date}
          className="misbak"
          aria-labelledby="misbak-verse"
        >
          <h1 className="misbak__tag">
            {misbak.title}
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
            {lines(misbak.body).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <h3 className="misbak__sub">ትርጉም</h3>

          <div className="misbak__body">
            {lines(misbak.meaning).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>

        <button
          type="button"
          className="daily__arrow daily__arrow--next"
          onClick={() => setIndex(index + 1)}
          disabled={!hasNext}
          aria-label="ቀጣይ ምስባክ"
          title="ቀጣይ"
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

        <p className="daily__date">{misbak.date}</p>
      </div>
    </main>
  );
}
