import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// =====================================================
// ENGLISH
// =====================================================

import enNavbar from "../locales/en/navbar.json";
import enFooter from "../locales/en/footer.json";
import enHome from "../locales/en/home.json";
import enAbout from "../locales/en/about.json";
import enBlog from "../locales/en/blog.json";
import enTravel from "../locales/en/travel.json";
import enContact from "../locales/en/contact.json";
import enServices from "../locales/en/services.json";
import enChurch from "../locales/en/church.json";
import enChurchSupport from "../locales/en/churchsupport.json";
import enSermon from "../locales/en/sermon.json";
import enMedia from "../locales/en/media.json";
import enBook from "../locales/en/book.json";
import enForm from "../locales/en/form.json";
import enLogin from "../locales/en/login.json";
import enVerify from "../locales/en/verify.json";
import enMeta from "../locales/en/meta.json";

// =====================================================
// AMHARIC
// =====================================================

import amNavbar from "../locales/am/navbar.json";
import amFooter from "../locales/am/footer.json";
import amHome from "../locales/am/home.json";
import amAbout from "../locales/am/about.json";
import amBlog from "../locales/am/blog.json";
import amTravel from "../locales/am/travel.json";
import amContact from "../locales/am/contact.json";
import amServices from "../locales/am/services.json";
import amChurch from "../locales/am/church.json";
import amChurchSupport from "../locales/am/churchsupport.json";
import amSermon from "../locales/am/sermon.json";
import amMedia from "../locales/am/media.json";
import amBook from "../locales/am/book.json";
import amForm from "../locales/am/form.json";
import amLogin from "../locales/am/login.json";
import amVerify from "../locales/am/verify.json";
import amMeta from "../locales/am/meta.json";

// =====================================================
// ITALIAN
// =====================================================

import itNavbar from "../locales/it/navbar.json";
import itFooter from "../locales/it/footer.json";
import itHome from "../locales/it/home.json";
import itAbout from "../locales/it/about.json";
import itBlog from "../locales/it/blog.json";
import itTravel from "../locales/it/travel.json";
import itContact from "../locales/it/contact.json";
import itServices from "../locales/it/services.json";
import itChurch from "../locales/it/church.json";
import itChurchSupport from "../locales/it/churchsupport.json";
import itSermon from "../locales/it/sermon.json";
import itMedia from "../locales/it/media.json";
import itBook from "../locales/it/book.json";
import itForm from "../locales/it/form.json";
import itLogin from "../locales/it/login.json";
import itVerify from "../locales/it/verify.json";
import itMeta from "../locales/it/meta.json";

// =====================================================
// INITIALIZE I18N
// =====================================================

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      // =================================================
      // ENGLISH
      // =================================================
      en: {
        translation: {
          navbar: enNavbar,
          footer: enFooter,
          home: enHome,
          about: enAbout,
          blog: enBlog,
          travel: enTravel,
          contact: enContact,
          services: enServices,
          church: enChurch,
          churchSupport: enChurchSupport,
          sermon: enSermon,
          media: enMedia,
          book: enBook,
          form: enForm,
          login: enLogin,
          verify: enVerify,
          meta: enMeta,
        },
      },

      // =================================================
      // AMHARIC
      // =================================================
      am: {
        translation: {
          navbar: amNavbar,
          footer: amFooter,
          home: amHome,
          about: amAbout,
          blog: amBlog,
          travel: amTravel,
          contact: amContact,
          services: amServices,
          church: amChurch,
          churchSupport: amChurchSupport,
          sermon: amSermon,
          media: amMedia,
          book: amBook,
          form: amForm,
          login: amLogin,
          verify: amVerify,
          meta: amMeta,
        },
      },

      // =================================================
      // ITALIAN
      // =================================================
      it: {
        translation: {
          navbar: itNavbar,
          footer: itFooter,
          home: itHome,
          about: itAbout,
          blog: itBlog,
          travel: itTravel,
          contact: itContact,
          services: itServices,
          church: itChurch,
          churchSupport: itChurchSupport,
          sermon: itSermon,
          media: itMedia,
          book: itBook,
          form: itForm,
          login: itLogin,
          verify: itVerify,
          meta: itMeta,
        },
      },
    },

    // ===================================================
    // DEFAULT LANGUAGE
    // ===================================================

    fallbackLng: "en",

    supportedLngs: ["en", "am", "it"],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;