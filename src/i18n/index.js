import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import enNavbar from "../locales/en/navbar.json";
import enFooter from "../locales/en/footer.json";
import enHome from "../locales/en/home.json";
import enAbout from "../locales/en/about.json";
import enBlog from "../locales/en/blog.json";
import enTravel from "../locales/en/travel.json";
import enContact from "../locales/en/contact.json";
import enServices from "../locales/en/services.json";
import enChurch from "../locales/en/church.json";
import enSermon from "../locales/en/sermon.json";
import enMedia from "../locales/en/media.json";
import enBook from "../locales/en/book.json";

// Amharic
import amNavbar from "../locales/am/navbar.json";
import amFooter from "../locales/am/footer.json";
import amHome from "../locales/am/home.json";
import amAbout from "../locales/am/about.json";
import amBlog from "../locales/am/blog.json";
import amTravel from "../locales/am/travel.json";
import amContact from "../locales/am/contact.json";
import amServices from "../locales/am/services.json";
import amChurch from "../locales/am/church.json";
import amSermon from "../locales/am/sermon.json";
import amMedia from "../locales/am/media.json";
import amBook from "../locales/am/book.json";

// Italian
import itNavbar from "../locales/it/navbar.json";
import itFooter from "../locales/it/footer.json";
import itHome from "../locales/it/home.json";
import itAbout from "../locales/it/about.json";
import itBlog from "../locales/it/blog.json";
import itTravel from "../locales/it/travel.json";
import itContact from "../locales/it/contact.json";
import itServices from "../locales/it/services.json";
import itChurch from "../locales/it/church.json";
import itSermon from "../locales/it/sermon.json";
import itMedia from "../locales/it/media.json";
import itBook from "../locales/it/book.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
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
          sermon: enSermon,
          media: enMedia,
          book: enBook,
        },
      },

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
          sermon: amSermon,
          media: amMedia,
          book: amBook,
        },
      },

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
          sermon: itSermon,
          media: itMedia,
          book: itBook,
        },
      },
    },

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