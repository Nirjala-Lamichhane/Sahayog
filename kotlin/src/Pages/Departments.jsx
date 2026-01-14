import React, { useState } from 'react';
import '../Style/Departments.css';

function Departments() {
  // State to track which department is selected (for modal)
  const [selectedDept, setSelectedDept] = useState(null);

  // List of all departments
  const departments = [
    {
      id: 1,
      name: "Cardiology",
      icon: "❤️",
      description: "Expert care for all heart-related conditions with state-of-the-art cardiac facilities.",
      services: ["Heart Disease Treatment", "Cardiac Surgery", "ECG & Echo", "Angioplasty"],
      doctors: 15,
      beds: 15
    },
    {
      id: 2,
      name: "Neurology",
      icon: "🧠",
      description: "Specialized treatment for brain and nervous system disorders by leading neurologists.",
      services: ["Stroke Management", "Epilepsy Care", "Neurosurgery", "Headache Clinic"],
      doctors: 12,
      beds: 10
    },
    {
      id: 3,
      name: "Orthopedics",
      icon: "🦴",
      description: "Comprehensive bone and joint care including sports medicine and trauma care.",
      services: ["Joint Replacement", "Sports Injuries", "Spine Surgery", "Trauma Care"],
      doctors: 18,
      beds: 25
    },
    {
      id: 4,
      name: "Pediatrics",
      icon: "👶",
      description: "Dedicated care for infants, children, and adolescents by experienced pediatricians.",
      services: ["Child Healthcare", "Vaccinations", "Growth Monitoring", "Neonatal Care"],
      doctors: 20,
      beds: 22
    },
    {
      id: 5,
      name: "Oncology",
      icon: "🎗️",
      description: "Advanced cancer treatment with chemotherapy, radiation, and immunotherapy options.",
      services: ["Chemotherapy", "Radiation Therapy", "Cancer Surgery", "Palliative Care"],
      doctors: 10,
      beds: 13
    },
    {
      id: 6,
      name: "Obstetrics & Gynecology",
      icon: "🤰",
      description: "Complete women's health services from prenatal care to gynecological surgeries.",
      services: ["Maternity Care", "High-Risk Pregnancy", "Gynecology Surgery", "Fertility Treatment"],
      doctors: 16,
      beds: 10
    },
    {
      id: 7,
      name: "General Surgery",
      icon: "⚕️",
      description: "Wide range of surgical procedures performed by experienced general surgeons.",
      services: ["Laparoscopic Surgery", "Hernia Repair", "Gallbladder Surgery", "Appendectomy"],
      doctors: 14,
      beds: 7
    },
    {
      id: 8,
      name: "Dermatology",
      icon: "🩺",
      description: "Expert skin care and treatment for all dermatological conditions.",
      services: ["Skin Treatment", "Cosmetic Procedures", "Hair Care", "Laser Therapy"],
      doctors: 8,
      beds: 9
    },
    {
      id: 9,
      name: "ENT",
      icon: "👂",
      description: "Specialized care for ear, nose, and throat conditions with modern diagnostic tools.",
      services: ["Hearing Tests", "Sinus Treatment", "Throat Surgery", "Voice Disorders"],
      doctors: 10,
      beds: 20
    }
  ];

  return (
    <div className="departments-page">
      
      {/* Hero section */}
      <div className="hero">
        <h1>Our Departments</h1>
        <p>Specialized medical care across multiple departments</p>
      </div>

      {/* Departments grid */}
      <div className="container">
        <div className="departments-grid">
          {departments.map((dept) => (
            <div 
              key={dept.id} 
              className="dept-card"
              onClick={() => setSelectedDept(dept)}
            >
              <div className="dept-icon">{dept.icon}</div>
              <h3>{dept.name}</h3>
              <p>{dept.description}</p>
              
              <div className="dept-stats">
                <div>
                  <span>{dept.doctors}</span> Doctors
                </div>
                <div>
                  <span>{dept.beds}</span> Beds
                </div>
              </div>

              <button className="view-details-btn">
                View Details
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Shows when a department is clicked */}
      {selectedDept && (
        <div className="modal-overlay" onClick={() => setSelectedDept(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal header */}
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon">{selectedDept.icon}</div>
                <h2>{selectedDept.name}</h2>
              </div>
              <button className="close-btn" onClick={() => setSelectedDept(null)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="modal-description">{selectedDept.description}</p>

            {/* Services list */}
            <div className="services-section">
              <h3>Services Offered</h3>
              <div className="services-grid">
                {selectedDept.services.map((service, idx) => (
                  <div key={idx} className="service-item">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats box */}
            <div className="stats-box">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{selectedDept.doctors}</div>
                  <div className="stat-label">Expert Doctors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{selectedDept.beds}</div>
                  <div className="stat-label">Available Beds</div>
                </div>
              </div>
            </div>

            {/* Book appointment button */}
            <button className="book-btn">
              Book Appointment
            </button>
          </div>
        </div>
      )}

      {/* Features section */}
      <div className="features-section">
        <div className="container">
          <h2>Why Choose Our Departments</h2>
          <div className="features-grid">
            
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3>Expert Specialists</h3>
              <p>Over 150 highly qualified doctors across all departments</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3>Advanced Technology</h3>
              <p>State-of-the-art equipment and modern facilities</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>24/7 Availability</h3>
              <p>Round-the-clock emergency and critical care services</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Departments;