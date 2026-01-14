import React from 'react';
import '../Style/About.css';
// Removed local import - using a nice external image instead

function About() {
  return (
    <div className="about-page">

      {/* Top hero section */}
      <div className="hero">
        <h1>About Sahayog</h1>
        <p>Healthcare Trust - Bridging the gap to quality care</p>
      </div>

      {/* Mission section */}
      <div className="container">
        <div className="mission-grid">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At Sahayog Healthcare Trust, we are committed to making quality 
              healthcare accessible to everyone. Our mission is to bridge the gap 
              between patients and exceptional medical services through innovative 
              technology and compassionate care.
            </p>
            <p>
              We believe that every individual deserves access to world-class 
              healthcare facilities, expert medical consultations, and personalized 
              treatment plans - all at their fingertips.
            </p>
          </div>
          <div className="mission-image">
            <img
              src="https://www.shutterstock.com/image-photo/doctor-providing-compassionate-care-support-600nw-2688449473.jpg"
              alt="Compassionate doctor providing empathetic care and support to a patient, symbolizing accessible and innovative healthcare"
            />
          </div>
        </div>
      </div>

      {/* Core values section */}
      <div className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Compassion</h3>
              <p>
                We treat every patient with empathy, dignity, and respect, 
                ensuring they feel heard and cared for.
              </p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>
                We maintain the highest standards in medical care, technology, 
                and patient service delivery.
              </p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>
                We leverage cutting-edge technology to provide seamless, 
                efficient healthcare experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div>
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Patients Served</div>
          </div>
          <div>
            <div className="stat-number">200+</div>
            <div className="stat-label">Expert Doctors</div>
          </div>
          <div>
            <div className="stat-number">15+</div>
            <div className="stat-label">Departments</div>
          </div>
          <div>
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
        </div>
      </div>

      {/* Leadership team section */}
      <div className="container">
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px' }}>
          Our Leadership
        </h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-image">
              <img
                src="https://media.istockphoto.com/id/1555515663/photo/happy-portrait-group-and-doctors-for-healthcare-service-leadership-and-teamwork-in-hospital.jpg?s=612x612&w=0&k=20&c=TLjQ_2QSgCkG2GdfggIe9mMHuz28eD_zgjuwI9gw5KM="
                alt="Dr. Name 1 - Chief Medical Officer"
              />
            </div>
            <div className="team-info">
              <h3>Dr. Nischal</h3>
              <p className="team-role">Chief Medical Officer</p>
              <p className="team-bio">
                Leading healthcare innovation with over 20 years of experience 
                in medical administration and patient care.
              </p>
            </div>
          </div>

          <div className="team-card">
            <div className="team-image">
              <img
                src="https://media.istockphoto.com/id/1440001176/photo/administrator-with-medical-team.jpg?s=612x612&w=0&k=20&c=TwUTSZTb1HCu9J8r8hVEEInXKf1-GvIVsUhtlNYEho4="
                alt="Dr. Name 2 - Chief Medical Officer"
              />
            </div>
            <div className="team-info">
              <h3>Dr.Nishant</h3>
              <p className="team-role">Chief Medical Officer</p>
              <p className="team-bio">
                Leading healthcare innovation with over 20 years of experience 
                in medical administration and patient care.
              </p>
            </div>
          </div>

          <div className="team-card">
            <div className="team-image">
              <img
                src="https://cbx-prod.b-cdn.net/COLOURBOX62413009.jpg?width=800&height=800&quality=70"
                alt="Dr. Name 3 - Chief Medical Officer"
              />
            </div>
            <div className="team-info">
              <h3>Dr. Nirmala</h3>
              <p className="team-role">Chief Medical Officer</p>
              <p className="team-bio">
                Leading healthcare innovation with over 20 years of experience 
                in medical administration and patient care.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default About;