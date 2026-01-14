import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Home.css'; // CSS path remains correct
import logo from '../assets/logo.png'; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="logo-section">
            <img 
              src={logo} 
              alt="Sahayog Logo" 
              className="logo-img" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/160x60?text=Logo"; 
              }}
            />
          </div>

          {/* Navigation Menu */}
          <div className="nav-menu">
            <a href="./home">Home</a>
            <a href="./about">About</a>
            <a href="./services">Services</a>
            <a href="./departments">Departments</a>
            <a href="./contact">Contact</a>
          </div>

          {/* Right Side Buttons */}
          <div className="nav-buttons">
            <a href="tel:1800-123-4567" className="phone-link">
              ☎️ <span>9864078413</span>
            </a>
            <button
              className="login-btn-nav"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button
              className="signup-btn-nav"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          {/* Left Content */}
          <div className="hero-content">
            {/* Trust Badge */}
            <div className="trust-badge">
              <span className="badge-icon">🏥</span>
              <span>Trusted by 50,000+ Patients</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title">
              Modern Healthcare Needs
              <br />
              Modern <span className="underline-text">Solutions</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              Sahayog bridges the gap between you and quality healthcare. 
              Experience seamless hospital management, expert consultations, 
              and personalized care – all at your fingertips.
            </p>

            {/* Call to Action Buttons */}
            <div className="cta-buttons">
              <button className="btn-primary">
                Book Appointment →
              </button>
              <button className="btn-secondary">
                Explore Services
              </button>
            </div>

            {/* Statistics */}
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>200+</h3>
                  <p>Expert Doctors</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>24/7</h3>
                  <p>Available</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🛡️</div>
                <div className="stat-info">
                  <h3>100%</h3>
                  <p>Trusted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Decorative Circles */}
          <div className="hero-decoration">
            <div className="circle-large"></div>
            <div className="circle-small"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;