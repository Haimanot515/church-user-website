import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Skill from "./pages/Skill";
import Testimonials from "./pages/Testimonials";
import CV from "./pages/Cv";
import Services from "./pages/Services";
import Media from "./pages/Media"

/* ADMIN */
import AdminNavbar from "./components/AdminNavbar";
import AdminUser from "./pages/admin/AdminUser";
import AdminProject from "./pages/admin/AdminProject";
import AdminMessages from "./pages/admin/AdminContacts/AdminMessage";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminLanding from "./pages/admin/AdminLanding";
import AdminHomeHero from "./pages/admin/AdminHomeHero";

import "./styles.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/skill" element={<Skill />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/cv" element={<CV />} />
          <Route path="/services" element={<Services />} />
          <Route path="/media" element={<Media />} />


        {/* Admin Pages (No Authentication) */}
        <Route path="/admin" element={<AdminNavbar />}>
          <Route path="landing/manage" element={<AdminLanding />} />

          <Route path="users/view" element={<AdminUser />} />
          <Route path="users/delete" element={<AdminUser />} />
          <Route path="users/update" element={<AdminUser />} />

          <Route path="projects/create" element={<AdminProject />} />
          <Route path="projects/view" element={<AdminProject />} />
          <Route path="projects/update" element={<AdminProject />} />
          <Route path="projects/delete" element={<AdminProject />} />

          <Route path="skills/create" element={<AdminSkills />} />
          <Route path="skills/view" element={<AdminSkills />} />

          <Route path="contacts/view" element={<AdminMessages />} />

          <Route path="about/create" element={<AdminAbout />} />

          <Route path="hero/create" element={<AdminHomeHero />} />
          <Route path="hero/update" element={<AdminHomeHero />} />
        </Route>

        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>

     
    </>
  );
}

export default App;