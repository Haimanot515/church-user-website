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
import Media from "./pages/Media";

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
        <Route path="/media" element={<Media />} />

        {/* 404 */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;