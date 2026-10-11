import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const loaders = {
  en: () => import("../locales/en/index.js"),
  am: () => import("../locales/am/index.js"),
  it: () => import("../locales/it/index.js"),
};

const keyAliases = { churchsupport: "churchSupport" };

const lazyBackend = {
  type: "backend",
  init() {},
  read(lng, ns, callback) {
    const load = loaders[lng];
    if (!load) {
      callback(null, {});
      return;
    }
    load()
      .then((mod) => {
        const out = {};
        Object.entries(mod.default).forEach(([name, value]) => {
          out[keyAliases[name] || name] = value;
        });
        callback(null, out);
      })
      .catch((err) => callback(err, null));
  },
};

i18n
  .use(lazyBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "am", "it"],
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

const originalChangeLanguage = i18n.changeLanguage.bind(i18n);

i18n.changeLanguage = async (lng, callback) => {
  if (lng) await i18n.loadLanguages(lng);
  return originalChangeLanguage(lng, callback);
};

export default i18n;
