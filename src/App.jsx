import { useTranslation } from "react-i18next";
import React, { useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Spinner from "./components/Spinner";

import Home from "./pages/Home";

import useDocumentMeta from "./hooks/useDocumentMeta";

import "./styles.css";

const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Skill = lazy(() => import("./pages/Sermon"));
const Testimonials = lazy(() => import("./pages/Travel"));
const Church = lazy(() => import("./pages/Church"));
const ChurchSupport = lazy(() => import("./pages/ChurchSupport"));
const ChurchTeamsPage = lazy(() => import("./pages/ChurchTeamsPage"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Media = lazy(() => import("./pages/Media"));
const Book = lazy(() => import("./pages/Book"));
const Detail = lazy(() => import("./pages/Detail"));
const PromotionDetail = lazy(() => import("./pages/PromotionDetail"));
const AboutDetail = lazy(() => import("./pages/AboutDetail"));
const HeroDetail = lazy(() => import("./pages/HeroDetail"));
const StoryDetail = lazy(() => import("./pages/ChurchStoryDetails"));
const MediaDetail = lazy(() => import("./pages/MediaDetail"));
const ChurchDetail = lazy(() => import("./pages/ChurchDetail"));
const PersonDetail = lazy(() => import("./pages/PersonDetail"));
const DailyReadingPage = lazy(() => import("./pages/DailyReadingPage"));

function App() {
  const { t } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useDocumentMeta();

  return (
    <>
      <Navbar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />

      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/testimonials" element={<Testimonials />} />

          <Route path="/cv" element={<Church />} />
          <Route path="/church-support" element={<ChurchSupport />} />
          <Route path="/church-teams" element={<ChurchTeamsPage />} />

          <Route path="/daily-misbak" element={<DailyReadingPage />} />

          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          <Route path="/media" element={<Media />} />
          <Route path="/book" element={<Book />} />

          <Route path="/projects/:id" element={<Detail />} />
          <Route path="/promotions/:id" element={<PromotionDetail />} />
          <Route path="/about/:id" element={<AboutDetail />} />
          <Route path="/homeheros/:id" element={<HeroDetail />} />
          <Route path="/about/story/:slug" element={<StoryDetail />} />
          <Route path="/media/:id" element={<MediaDetail />} />
          <Route path="/churches/:id" element={<ChurchDetail />} />
          <Route path="/church-persons/:id" element={<PersonDetail />} />

          <Route path="*" element={<h2>{t("common.page404")}</h2>} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;
