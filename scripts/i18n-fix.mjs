#!/usr/bin/env node
// One-shot i18n gap fixer. Run from project root:  node scripts/i18n-fix.mjs [srcDir]
// - adds missing keys (en / am / it) to the locale JSON files (never overwrites existing keys)
// - registers 2 new namespaces (common, misbak) in src/i18n/index.js
// - replaces hardcoded UI strings in the page/component files with t("...") calls
// Safe to re-run: already-patched code and existing keys are skipped.
import fs from "fs";
import path from "path";

const SRC = path.resolve(process.argv[2] || "src");
const R = (p) => path.join(SRC, p);
const read = (p) => fs.readFileSync(R(p), "utf8");
const write = (p, s) => fs.writeFileSync(R(p), s);

// ====================================================================
// 1. TRANSLATIONS   L(english, amharic, italian)
// ====================================================================
const L = (en, am, it) => ({ __l: true, en, am, it });
const NEW = {
  // ---------- brand-new namespace: common ----------
  common: {
    goBack: L("Go back", "ወደ ኋላ ተመለስ", "Torna indietro"),
    loading: L("Loading", "በመጫን ላይ", "Caricamento"),
    loadingMore: L("Loading...", "በመጫን ላይ...", "Caricamento..."),
    loadMore: L("Load More", "ተጨማሪ ጫን", "Carica altro"),
    notFound: L("Not found.", "አልተገኘም።", "Non trovato."),
    seek: L("Seek", "ወደ ቦታው ዝለል", "Vai al punto"),
    previous: L("Previous", "ቀዳሚ", "Precedente"),
    next: L("Next", "ቀጣይ", "Successivo"),
    page404: L("404 - Page Not Found", "404 - ገጹ አልተገኘም", "404 - Pagina non trovata"),
    postCategories: L("Post categories", "የጽሑፍ ምድቦች", "Categorie dei post"),
    play: L("Play", "አጫውት", "Riproduci"),
    pause: L("Pause", "ለአፍታ አቁም", "Pausa"),
    mute: L("Mute", "ድምፅ አጥፋ", "Disattiva audio"),
    unmute: L("Unmute", "ድምፅ አብራ", "Attiva audio"),
    download: L("Download", "አውርድ", "Scarica"),
    downloadAudio: L("Download audio", "ኦዲዮውን አውርድ", "Scarica audio"),
    openDocument: L("Open Document", "ሰነዱን ክፈት", "Apri documento"),
    moreOptions: L("More options", "ተጨማሪ አማራጮች", "Altre opzioni"),
    closePlayer: L("Close player", "ማጫወቻውን ዝጋ", "Chiudi il lettore"),
    changeSpeed: L("Change playback speed", "የማጫወት ፍጥነት ቀይር", "Cambia velocità di riproduzione"),
    backTo: {
      about: L("Back to About", "ወደ ስለ እኛ ተመለስ", "Torna a Chi siamo"),
      churches: L("Back to Churches", "ወደ አብያተ ክርስቲያናት ተመለስ", "Torna alle chiese"),
      home: L("Back to Home", "ወደ መነሻ ገጽ ተመለስ", "Torna alla home"),
      media: L("Back to Media", "ወደ ሚዲያ ተመለስ", "Torna ai media"),
      services: L("Back to Services", "ወደ አገልግሎቶች ተመለስ", "Torna ai servizi"),
      story: L("Back to Our Story", "ወደ ታሪካችን ተመለስ", "Torna alla nostra storia"),
      posts: L("Back to all posts", "ወደ ሁሉም ጽሑፎች ተመለስ", "Torna a tutti i post"),
    },
    related: {
      youMayAlsoLike: L("You May Also Like", "እነዚህንም ሊወዱ ይችላሉ", "Potrebbe interessarti anche"),
      moreOfStory: L("More of Our Story", "ተጨማሪ የታሪካችን ክፍሎች", "Altro dalla nostra storia"),
      morePromotions: L("More Promotions", "ተጨማሪ ማስታወቂያዎች", "Altre promozioni"),
    },
    errors: {
      entry: L("Failed to load this entry", "ይህን ግቤት መጫን አልተቻለም።", "Impossibile caricare questa voce"),
      church: L("Failed to load this church", "ይህን ቤተ ክርስቲያን መጫን አልተቻለም።", "Impossibile caricare questa chiesa"),
      chapter: L("Failed to load this chapter", "ይህን ምዕራፍ መጫን አልተቻለም።", "Impossibile caricare questo capitolo"),
      post: L("Failed to load this post", "ይህን ጽሑፍ መጫን አልተቻለም።", "Impossibile caricare questo post"),
      item: L("Failed to load this item", "ይህን ንጥል መጫን አልተቻለም።", "Impossibile caricare questo elemento"),
      promotion: L("Failed to load this promotion", "ይህን ማስታወቂያ መጫን አልተቻለም።", "Impossibile caricare questa promozione"),
      service: L("Failed to load this service", "ይህን አገልግሎት መጫን አልተቻለም።", "Impossibile caricare questo servizio"),
      storyMissingId: L("This story couldn't be loaded (missing id in the URL).", "ይህ ታሪክ መጫን አልቻለም (በአድራሻው ውስጥ መለያ ቁጥር የለም)።", "Impossibile caricare questa storia (ID mancante nell'URL)."),
      chapterNotFound: L("Chapter not found.", "ምዕራፉ አልተገኘም።", "Capitolo non trovato."),
      postNotFound: L("Post not found.", "ጽሑፉ አልተገኘም።", "Post non trovato."),
      promotionNotFound: L("Promotion not found.", "ማስታወቂያው አልተገኘም።", "Promozione non trovata."),
    },
    labels: {
      primary: L("Primary", "ዋና", "Principale"),
      featured: L("Featured", "ተመራጭ", "In evidenza"),
      address: L("Address:", "አድራሻ፡", "Indirizzo:"),
      service: L("Service:", "አገልግሎት፡", "Servizio:"),
      getDirections: L("Get Directions", "አቅጣጫ አሳየኝ", "Indicazioni stradali"),
      fromThePriest: L("From the Priest", "ከካህኑ", "Dal sacerdote"),
      priest: L("Priest", "ካህን", "Sacerdote"),
      churchHero: L("Church hero", "የቤተ ክርስቲያን ዋና ምስል", "Immagine principale della chiesa"),
      featuredService: L("Featured Service", "ተመራጭ አገልግሎት", "Servizio in evidenza"),
      serviceAlt: L("Service", "አገልግሎት", "Servizio"),
      sponsoredContent: L("Sponsored Content", "በስፖንሰር የቀረበ ይዘት", "Contenuto sponsorizzato"),
      sponsored: L("Sponsored", "ስፖንሰር የተደረገ", "Sponsorizzato"),
      visitSponsor: L("Visit Sponsor", "ስፖንሰሩን ይጎብኙ", "Visita lo sponsor"),
      general: L("General", "አጠቃላይ", "Generale"),
      leader: L("Leader", "መሪ", "Responsabile"),
    },
    person: {
      leadershipTeam: L("Leadership Team", "የአመራር ቡድን", "Team di guida"),
      specialThanks: L("Special Thanks", "ልዩ ምስጋና", "Ringraziamenti speciali"),
      testimony: L("Testimony", "ምስክርነት", "Testimonianza"),
      churchFamily: L("Church Family", "የቤተ ክርስቲያን ቤተሰብ", "Famiglia della chiesa"),
    },
    mediaEyebrow: {
      video: L("Watch", "ይመልከቱ", "Guarda"),
      photo: L("Look Back", "ወደ ኋላ ተመልከቱ", "Uno sguardo indietro"),
      audio: L("Listen", "ያዳምጡ", "Ascolta"),
      document: L("Read", "ያንብቡ", "Leggi"),
      default: L("Media", "ሚዲያ", "Media"),
    },
  },
  // ---------- brand-new namespace: misbak (Daily Misbak page) ----------
  misbak: {
    meaning: L("Meaning", "ትርጉም", "Significato"),
    prevAria: L("Previous misbak", "ቀዳሚ ምስባክ", "Misbak precedente"),
    nextAria: L("Next misbak", "ቀጣይ ምስባክ", "Misbak successivo"),
  },
};

// ---------- keys to ADD INSIDE existing namespaces ----------
const ADD = {
  navbar: {
    links: { dailyMisbak: L("Daily Misbak", "የዕለቱ ምስባክ", "Misbak del giorno") },
    language: { toggle: L("Change language", "ቋንቋ ቀይር", "Cambia lingua") },
    theme: {
      toggle: L("Toggle theme", "ገጽታ ቀይር", "Cambia tema"),
      dark: L("Dark mode", "ጨለማ ሁነታ", "Modalità scura"),
      light: L("Light mode", "ብርሃን ሁነታ", "Modalità chiara"),
    },
  },
  media: {
    audio: {
      play: L("Play", "አጫውት", "Riproduci"),
      pause: L("Pause", "ለአፍታ አቁም", "Pausa"),
      close: L("Close player", "ማጫወቻውን ዝጋ", "Chiudi il lettore"),
    },
  },
  home: {
    audios: {
      errorDefault: L("Failed to load audio.", "ኦዲዮን መጫን አልተቻለም።", "Impossibile caricare l'audio."),
      heading: L("Audio", "ኦዲዮ", "Audio"),
      none: L("No audio found.", "ምንም ኦዲዮ አልተገኘም።", "Nessun audio trovato."),
      prevAriaLabel: L("Previous", "ቀዳሚ", "Precedente"),
      nextAriaLabel: L("Next", "ቀጣይ", "Successivo"),
    },
    videos: {
      errorDefault: L("Failed to load videos.", "ቪዲዮዎችን መጫን አልተቻለም።", "Impossibile caricare i video."),
      heading: L("Videos", "ቪዲዮዎች", "Video"),
      none: L("No videos found.", "ምንም ቪዲዮ አልተገኘም።", "Nessun video trovato."),
      prevAriaLabel: L("Previous", "ቀዳሚ", "Precedente"),
      nextAriaLabel: L("Next", "ቀጣይ", "Successivo"),
    },
    categoryNav: { fallbackNotice: L("Showing categories in English — none available in your selected language yet.", "ምድቦች በእንግሊዝኛ እየታዩ ነው — በመረጡት ቋንቋ እስካሁን የሉም።", "Categorie mostrate in inglese: non ancora disponibili nella lingua selezionata.") },
    hero: { fallbackNotice: L("Showing hero content in English — none available in your selected language yet.", "የዋና ገጽ ይዘት በእንግሊዝኛ እየታየ ነው — በመረጡት ቋንቋ እስካሁን የለም።", "Contenuto principale mostrato in inglese: non ancora disponibile nella lingua selezionata.") },
    priest: { fallbackNotice: L("Showing this content in English — none available in your selected language yet.", "ይህ ይዘት በእንግሊዝኛ እየታየ ነው — በመረጡት ቋንቋ እስካሁን የለም።", "Contenuto mostrato in inglese: non ancora disponibile nella lingua selezionata.") },
    recommended: { fallbackNotice: L("Showing recommended posts in English.", "የሚመከሩ ጽሑፎች በእንግሊዝኛ እየታዩ ነው።", "Post consigliati mostrati in inglese.") },
    sermons: { fallbackNotice: L("No posts in your selected language yet — showing English instead.", "በመረጡት ቋንቋ እስካሁን ጽሑፍ የለም — በምትኩ እንግሊዝኛ እየታየ ነው።", "Ancora nessun post nella lingua selezionata: viene mostrato l'inglese.") },
    sponsored: { fallbackNotice: L("Showing this promotion in English.", "ይህ ማስታወቂያ በእንግሊዝኛ እየታየ ነው።", "Promozione mostrata in inglese.") },
    trending: { fallbackNotice: L("Showing trending posts in English.", "ተወዳጅ ጽሑፎች በእንግሊዝኛ እየታዩ ነው።", "Post di tendenza mostrati in inglese.") },
  },
  about: {
    teamLink: {
      heading: L("Meet Our Team", "ቡድናችንን ይተዋወቁ", "Conosci il nostro team"),
      button: L("View the team", "ቡድኑን ይመልከቱ", "Vedi il team"),
    },
    map: { linkLabel: L("Open in Google Maps", "በጎግል ካርታ ይክፈቱ", "Apri in Google Maps") },
  },
  contact: { faq: { fallbackNotice: L("Showing English content.", "የእንግሊዝኛ ይዘት እየታየ ነው።", "Contenuto mostrato in inglese.") } },
  travel: { faq: { fallbackNotice: L("Showing English content.", "የእንግሊዝኛ ይዘት እየታየ ነው።", "Contenuto mostrato in inglese.") } },
};

const pick = (node, lang) =>
  node && node.__l ? node[lang] : Object.fromEntries(Object.entries(node).map(([k, v]) => [k, pick(v, lang)]));
const mergeMissing = (target, add, trail = "") => {
  let added = 0;
  for (const [k, v] of Object.entries(add)) {
    if (v && typeof v === "object") {
      if (typeof target[k] !== "object" || target[k] === null) {
        if (target[k] !== undefined) continue; // existing non-object value: leave alone
        target[k] = {};
      }
      added += mergeMissing(target[k], v);
    } else if (target[k] === undefined) { target[k] = v; added++; }
  }
  return added;
};

let totalKeys = 0;
for (const lang of ["en", "am", "it"]) {
  for (const [ns, tree] of Object.entries(NEW)) {
    const file = `locales/${lang}/${ns}.json`;
    const cur = fs.existsSync(R(file)) ? JSON.parse(read(file)) : {};
    totalKeys += mergeMissing(cur, pick(tree, lang));
    write(file, JSON.stringify(cur, null, 2) + "\n");
  }
  for (const [ns, tree] of Object.entries(ADD)) {
    const file = `locales/${lang}/${ns}.json`;
    const cur = JSON.parse(read(file));
    totalKeys += mergeMissing(cur, pick(tree, lang));
    write(file, JSON.stringify(cur, null, 2) + "\n");
  }
}
console.log(`✔ locale files: ${totalKeys} keys added (en/am/it)`);

// ====================================================================
// 2. REGISTER new namespaces in i18n/index.js
// ====================================================================
{
  let s = read("i18n/index.js");
  if (!s.includes("enCommon")) {
    for (const [lang, Cap] of [["en", "En"], ["am", "Am"], ["it", "It"]]) {
      s = s.replace(
        `import ${lang}Meta from "../locales/${lang}/meta.json";`,
        `import ${lang}Meta from "../locales/${lang}/meta.json";\nimport ${lang}Common from "../locales/${lang}/common.json";\nimport ${lang}Misbak from "../locales/${lang}/misbak.json";`
      );
      s = s.replace(`meta: ${lang}Meta,`, `meta: ${lang}Meta,\n          common: ${lang}Common,\n          misbak: ${lang}Misbak,`);
    }
    write("i18n/index.js", s);
    console.log("✔ i18n/index.js: registered namespaces common + misbak");
  } else console.log("• i18n/index.js already registered");
}

// ====================================================================
// 3. CODE PATCHES
// ====================================================================
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const IMPORT = `import { useTranslation } from "react-i18next";\n`;
const HOOK = `const { t } = useTranslation();`;
let patched = 0, warnings = [];

function patch(file, { hookAfter, items = [], raw = [] }) {
  if (!fs.existsSync(R(file))) return warnings.push(`${file}: file not found`);
  let s = read(file); const orig = s;
  for (const [type, phrase, key, extra] of items) {
    const call = `t("${key}")`;
    const p = esc(phrase);
    let n = 0;
    const sub = (re, rep) => { s = s.replace(re, (...a) => { n++; return typeof rep === "function" ? rep(...a) : rep; }); };
    if (type === "a") sub(new RegExp(`\\b(aria-label|title|alt|placeholder)="${p}"`, "g"), (_, attr) => `${attr}={${call}}`);
    if (type === "q") sub(new RegExp(`"${p}"`, "g"), call);
    if (type === "t") {
      sub(new RegExp(`(>)(\\s*)${p}(\\s*)(?=<)`, "g"), (_, g, a, b) => `${g}${a}{${call}}${b}`);
      sub(new RegExp(`(\\n[ \\t]+)${p}([ \\t]*\\n)`, "g"), (_, a, b) => `${a}{${call}}${b}`);
    }
    if (n === 0 && !s.includes(call)) warnings.push(`${file}: "${phrase}" not found (already localized or text changed)`);
  }
  for (const [from, to] of raw) {
    if (s.includes(from)) s = s.split(from).join(to);
    else if (!s.includes(to)) warnings.push(`${file}: raw pattern not found: ${from.slice(0, 50)}`);
  }
  if (s !== orig && !/useTranslation/.test(orig)) s = IMPORT + s;
  if (hookAfter && !/const \{ t(, i18n)? \} = useTranslation\(\)/.test(s.split(hookAfter)[1]?.slice(0, 400) || "")) {
    if (s.includes(hookAfter) && s !== orig) s = s.replace(hookAfter, `${hookAfter}\n  ${HOOK}`);
    else if (!s.includes(hookAfter)) warnings.push(`${file}: hook anchor not found: ${hookAfter}`);
  }
  if (s !== orig) { write(file, s); patched++; console.log(`✔ patched ${file}`); }
}

const BACK_TOP = (route, cls) => [
  `const BackButton = () => (\n  <Link to="${route}" aria-label={t("common.goBack")} className="${cls}">`,
  `const BackButton = () => {\n  const { t } = useTranslation();\n  return (\n  <Link to="${route}" aria-label={t("common.goBack")} className="${cls}">`,
];
const goBack = ["a", "Go back", "common.goBack"];
const notFound = ["q", "Not found.", "common.notFound"];

patch("pages/AboutDetail.jsx", { hookAfter: "const AboutDetail = () => {", items: [goBack, ["q", "Failed to load this entry", "common.errors.entry"], notFound, ["t", "Back to About", "common.backTo.about"], ["t", "From the Priest", "common.labels.fromThePriest"], ["q", "Priest", "common.labels.priest"]] });
patch("pages/ChurchDetail.jsx", { hookAfter: "const ChurchDetail = () => {", items: [goBack, ["q", "Failed to load this church", "common.errors.church"], notFound, ["t", "Back to Churches", "common.backTo.churches"], ["t", "Primary", "common.labels.primary"], ["t", "Featured", "common.labels.featured"], ["t", "Address:", "common.labels.address"], ["t", "Service:", "common.labels.service"], ["t", "Get Directions", "common.labels.getDirections"]] });
patch("pages/ChurchStoryDetails.jsx", { hookAfter: "const StoryDetail = () => {", items: [["q", "Failed to load this chapter", "common.errors.chapter"], ["q", "This story couldn't be loaded (missing id in the URL).", "common.errors.storyMissingId"], ["a", "Back to Our Story", "common.backTo.story"], ["a", "Previous", "common.previous"], ["a", "Next", "common.next"], ["q", "Chapter not found.", "common.errors.chapterNotFound"], ["t", "Back to Our Story", "common.backTo.story"], ["t", "More of Our Story", "common.related.moreOfStory"]] });
patch("pages/HeroDetail.jsx", { hookAfter: "const HeroDetail = () => {", items: [goBack, ["q", "Failed to load this entry", "common.errors.entry"], notFound, ["t", "Back to Home", "common.backTo.home"], ["q", "Church hero", "common.labels.churchHero"]] });
patch("pages/PersonDetail.jsx", { hookAfter: "const PersonDetail = () => {", items: [goBack, ["q", "Failed to load this entry", "common.errors.entry"], notFound, ["t", "Back to About", "common.backTo.about"], ["q", "Church Family", "common.person.churchFamily"]], raw: [[`leader: "Leadership Team"`, `leader: t("common.person.leadershipTeam")`], [`specialThanks: "Special Thanks"`, `specialThanks: t("common.person.specialThanks")`], [`testimony: "Testimony"`, `testimony: t("common.person.testimony")`]] });
patch("pages/PromotionDetail.jsx", { hookAfter: "const PromotionDetail = () => {", items: [goBack, ["q", "Failed to load this promotion", "common.errors.promotion"], ["q", "Promotion not found.", "common.errors.promotionNotFound"], ["t", "Back to Home", "common.backTo.home"], ["t", "Sponsored Content", "common.labels.sponsoredContent"], ["q", "Sponsored content", "common.labels.sponsoredContent"], ["t", "Visit Sponsor", "common.labels.visitSponsor"], ["t", "More Promotions", "common.related.morePromotions"], ["t", "Sponsored", "common.labels.sponsored"]] });
patch("pages/ServiceDetail.jsx", { hookAfter: "const ServiceDetail = () => {", items: [goBack, ["q", "Failed to load this service", "common.errors.service"], notFound, ["t", "Back to Services", "common.backTo.services"], ["t", "Featured Service", "common.labels.featuredService"], ["t", "You may also like", "common.related.youMayAlsoLike"]], raw: [[`alt={plainTitle || "Service"}`, `alt={plainTitle || t("common.labels.serviceAlt")}`]] });
patch("pages/Detail.jsx", { hookAfter: "const Detail = () => {", items: [goBack, ["q", "Failed to load this post", "common.errors.post"], ["q", "Post not found.", "common.errors.postNotFound"], ["t", "Back to all posts", "common.backTo.posts"], ["t", "You Might Also Like", "common.related.youMayAlsoLike"], ], raw: [BACK_TOP("/projects", "detail-back-btn"), [`p.category || "General"`, `p.category || t("common.labels.general")`], [`relatedLoadingMore ? "Loading..." : "Load More"`, `relatedLoadingMore ? t("common.loadingMore") : t("common.loadMore")`]] });
patch("pages/MediaDetail.jsx", { hookAfter: "const MediaDetail = () => {", items: [goBack, ["q", "Failed to load this item", "common.errors.item"], notFound, ["t", "Back to Media", "common.backTo.media"], ["a", "More options", "common.moreOptions"], ["a", "Close player", "common.closePlayer"], ["a", "Seek", "common.seek"], ["a", "Change playback speed", "common.changeSpeed"], ["a", "Download audio", "common.downloadAudio"], ["t", "Download", "common.download"], ["t", "Open Document", "common.openDocument"], ["t", "You May Also Like", "common.related.youMayAlsoLike"]],
  raw: [BACK_TOP("/media", "media-detail-back-btn"),
    [`isPlaying ? "Pause" : "Play"`, `isPlaying ? t("common.pause") : t("common.play")`],
    [`isMuted ? "Unmute" : "Mute"`, `isMuted ? t("common.unmute") : t("common.mute")`],
    [`video: "Watch"`, `video: t("common.mediaEyebrow.video")`], [`photo: "Look Back"`, `photo: t("common.mediaEyebrow.photo")`],
    [`audio: "Listen"`, `audio: t("common.mediaEyebrow.audio")`], [`document: "Read"`, `document: t("common.mediaEyebrow.document")`],
    [`|| "Media"}`, `|| t("common.mediaEyebrow.default")}`]] });
patch("pages/DailyReadingPage.jsx", { hookAfter: "export default function DailyReadingPage() {", items: [["a", "ቀዳሚ ምስባክ", "misbak.prevAria"], ["a", "ቀጣይ ምስባክ", "misbak.nextAria"], ["a", "ቀዳሚ", "common.previous"], ["a", "ቀጣይ", "common.next"], ["t", "ትርጉም", "misbak.meaning"]], raw: [["{misbak.title}", `{t("navbar.links.dailyMisbak")}`]] });
patch("App.jsx", { hookAfter: "function App() {", items: [["t", "404 - Page Not Found", "common.page404"]] });
patch("components/CategoryNav.jsx", { hookAfter: "export default function CategoryNav({ categories, activeCategory, onSelect }) {", items: [["a", "Post categories", "common.postCategories"]] });
patch("components/Spinner.jsx", { hookAfter: "const Spinner = () => {", items: [["a", "Loading", "common.loading"]] });
patch("components/HomeMediaGrid.jsx", { items: [["a", "Seek", "common.seek"]] });
patch("pages/Church.jsx", { raw: [[`|| "Leader"`, `|| t("common.labels.leader")`]] });
patch("pages/Media.jsx", { items: [["a", "Seek", "common.seek"]] });

// BACK_TOP leaves an unclosed "return (" — close it at the end of that BackButton
for (const f of ["pages/Detail.jsx", "pages/MediaDetail.jsx"]) {
  let s = read(f);
  const i = s.indexOf("const BackButton = () => {\n  const { t } = useTranslation();\n  return (");
  if (i >= 0) {
    const j = s.indexOf("</Link>\n);", i);
    if (j >= 0) { s = s.slice(0, j) + "</Link>\n  );\n};" + s.slice(j + "</Link>\n);".length); write(f, s); }
  }
}

console.log(`\nDone: ${patched} code files patched.`);
if (warnings.length) { console.log("\n⚠ Review these:"); warnings.forEach((w) => console.log("  - " + w)); }
console.log("\nNext: run  node scripts/i18n-audit.mjs src  to confirm, then  npm run dev  and switch EN / አማ / IT.");

