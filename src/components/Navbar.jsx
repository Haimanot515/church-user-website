import React, { useState, useEffect } from "react";
import Login from "../pages/Login";
import Form from "../pages/Registration/Form";
import Verify from "../pages/Registration/Verify";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import "./Navbar.css";

// Crown of thorns logo
const ThornCrownLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="4" />
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 50 + 30 * Math.cos(angle);
      const y1 = 50 + 30 * Math.sin(angle);
      const x2 = 50 + 42 * Math.cos(angle);
      const y2 = 50 + 42 * Math.sin(angle);

      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    })}
    <line x1="50" y1="30" x2="50" y2="70" stroke="#fff" strokeWidth="4" />
    <line x1="38" y1="42" x2="62" y2="42" stroke="#fff" strokeWidth="4" />
  </svg>
);

const Navbar = ({ loggedIn, isAdmin, setLoggedIn, setIsAdmin }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      closeModals();
    }
  }, [loggedIn]);

  const closeMenu = () => setIsMenuOpen(false);

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowVerify(false);
  };

  const openLogin = () => { closeModals(); setShowLogin(true); };
  const openRegister = () => { closeModals(); setShowRegister(true); };
  const openVerify = () => { closeModals(); setShowVerify(true); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsAdmin(false);
    closeModals();
    closeMenu();
    navigate("/");
  };

  const handleNavClick = (e) => {
    if (!loggedIn) {
      e.preventDefault();
      e.stopPropagation();
      openLogin();
    }
    closeMenu();
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/home" className="navbar-logo" onClick={closeMenu}>
          <ThornCrownLogo />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-content ${isMenuOpen ? "active" : ""}`}>

          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/projects" onClick={closeMenu}>Blogs</Link>
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/cv" onClick={closeMenu}>Church</Link>
          <Link to="/skill" onClick={closeMenu}>Sermon</Link>


          <Link to="/testimonials" onClick={closeMenu}>Travel</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <Link to="/media" onClick={closeMenu}>Media</Link>
          <Link to="/book" onClick={closeMenu}>Books</Link>

          {/* Auth section */}
          {loggedIn ? (
            <>
              {(isAdmin === true || isAdmin === "true") && (
                <Link to="/admin/users/view" onClick={closeMenu}>Admin</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={openLogin}>Login</button>
              <button onClick={openRegister}>Register</button>
            </>
          )}
        </div>
      </nav>

      {isMenuOpen && (
        <div
          className="nav-backdrop"
          onClick={closeMenu}
        />
      )}

      {/* MODALS */}
      {(showLogin || showRegister || showVerify) && (
        <div className="overlay" onClick={closeModals}>
          <div className="auth-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} className="close-btn-style">
              <FaTimes />
            </button>
            {showLogin && (
              <Login
                setLoggedIn={setLoggedIn}
                setIsAdmin={setIsAdmin}
                closeModal={closeModals}
                switchToRegister={openRegister}
              />
            )}
            {showRegister && (
              <Form
                closeModal={closeModals}
                switchToLogin={openLogin}
                switchToVerify={openVerify}
              />
            )}
            {showVerify && (
              <Verify
                setLoggedIn={setLoggedIn}
                setIsAdmin={setIsAdmin}
                closeModal={closeModals}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;