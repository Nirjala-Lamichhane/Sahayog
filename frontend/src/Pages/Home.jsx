import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Home.css";
import logo from "../Assets/logo.png";


function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="home-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* LOGO */}
          <div className="logo-section">
            <img
              src={logo}
              alt="Sahayog Logo"
              className="logo-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/160x60?text=Sahayog";
              }}
            />
          </div>

          {/* HAMBURGER (MOBILE ONLY) */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          {/* NAV LINKS */}
          <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
            <a href="./home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="./about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="./services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="./departments" onClick={() => setIsMenuOpen(false)}>Departments</a>
            <a href="./contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </div>

          {/* RIGHT BUTTONS (DESKTOP ONLY) */}
          <div className="nav-buttons">
            <a href="tel:9864078413" className="phone-link">
              ☎️ <span>9864078413</span>
            </a>
            <button
              className="login-btn-nav"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
            <button
              className="signup-btn-nav"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="trust-badge">
              🏥 Trusted by 50,000+ Patients
            </div>

            <h1 className="hero-title">
              Modern Healthcare Needs
              <br />
              Modern <span className="underline-text">Solutions</span>
            </h1>

            <p className="hero-description">
              Sahayog bridges the gap between you and quality healthcare.
              Experience seamless hospital management, expert consultations,
              and personalized care – all at your fingertips.
            </p>

            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/signup")}
              >
                Book Appointment →
              </button>
              <button className="btn-secondary">Explore Services</button>
            </div>

            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">+</div>
                <div>
                  <h3>200+</h3>
                  <p>Expert Doctors</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">•</div>
                <div>
                  <h3>24/7</h3>
                  <p>Available</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🛡️</div>
                <div>
                  <h3>100%</h3>
                  <p>Trusted</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-decoration">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="Healthcare professional"
                className="hero-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500x600?text=Healthcare";
                }}
              />
              <div className="image-gradient-overlay"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
