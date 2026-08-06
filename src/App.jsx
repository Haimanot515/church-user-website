import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Blog";
import Contact from "./pages/Contact";
import Skill from "./pages/Sermon";
import Testimonials from "./pages/Travel";
import Church from "./pages/Church";

import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Media from "./pages/Media";
import Book from "./pages/Book";
import Detail from "./pages/Detail";
import PromotionDetail from "./pages/PromotionDetail";
import AboutDetail from "./pages/AboutDetail";
import HeroDetail from "./pages/HeroDetail";
import StoryDetail from "./pages/ChurchStoryDetails";
import MediaDetail from "./pages/MediaDetail";
import ChurchDetail from "./pages/ChurchDetail";
import PersonDetail from "./pages/PersonDetail"; // NEW


import "./styles.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <>
      <Navbar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/skill" element={<Skill />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/cv" element={<Church />} />
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
        <Route path="/church-persons/:id" element={<PersonDetail />} /> {/* NEW */}

        {/* 404 */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;