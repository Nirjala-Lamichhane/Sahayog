import React from 'react';
import '../Style/Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      
      {/* Hero section */}
      <div className="hero">
        <h1>Contact Us</h1>
        <p>We're here to help you with your healthcare needs</p>
      </div>

      {/* Contact info section */}
      <div className="container">
        <div className="contact-grid">

          {/* Contact Information - centered */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-card-content">
                <div className="info-icon">📞</div>
                <div className="info-text">
                  <h3>Phone</h3>
                  <p className="highlight">01-2345678</p>
                  <p>Mon-Fri: 8am - 8pm</p>
                  <p>Sat-Sun: 9am - 5pm</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-content">
                <div className="info-icon">✉️</div>
                <div className="info-text">
                  <h3>Email</h3>
                  <p className="highlight">info@sahayog.com</p>
                  <p>We usually reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-content">
                <div className="info-icon">📍</div>
                <div className="info-text">
                  <h3>Address</h3>
                  <p>Tarkeshwor City Hospital</p>
                  <p>Kathmandu District</p>
                  <p>Balaju,Sesmati</p>
                </div>
              </div>
            </div>

            <div className="emergency-card">
              <h3>Emergency?</h3>
              <p>For medical emergencies, please call:</p>
              <a href="tel:911" className="emergency-button">
                Call Emergency: 102
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* FAQ section just to make it more interactive */}
      <div className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>What are your visiting hours?</summary>
              <p>
                Our hospital is open 24/7 for emergencies. Regular visiting hours are 10 AM to 8 PM daily.
              </p>
            </details>
            <details className="faq-item">
              <summary>Do you accept insurance?</summary>
              <p>
                Yes, we accept most major insurance providers. Please contact us with your insurance details for verification.
              </p>
            </details>
            <details className="faq-item">
              <summary>How do I book an appointment?</summary>
              <p>
                You can book an appointment online, call us at 1800-123-4567, or visit our facility in person.
              </p>
            </details>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Contact;
