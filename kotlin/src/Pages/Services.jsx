import React from "react";
import "../Style/Services.css";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Emergency Care",
      description: "24/7 emergency medical services with rapid response teams and state-of-the-art facilities.",
      icon: "🚑",
      features: ["24/7 Availability", "Rapid Response", "Critical Care", "Trauma Unit"]
    },
    {
      id: 2,
      title: "Telemedicine",
      description: "Connect with expert doctors from the comfort of your home through secure video consultations.",
      icon: "💻",
      features: ["Video Consultations", "E-Prescriptions", "Follow-up Care", "Specialist Access"]
    },
    {
      id: 3,
      title: "Diagnostic Services",
      description: "Comprehensive diagnostic testing with advanced imaging and laboratory facilities.",
      icon: "🔬",
      features: ["X-Ray & MRI", "Blood Tests", "Pathology", "Radiology"]
    },
    {
      id: 4,
      title: "Surgery",
      description: "Advanced surgical procedures performed by experienced surgeons with cutting-edge technology.",
      icon: "⚕️",
      features: ["Minimally Invasive", "Robotic Surgery", "Day Care Surgery", "Post-Op Care"]
    },
    {
      id: 5,
      title: "Pharmacy Services",
      description: "Online and in-house pharmacy with home delivery of medications and prescriptions.",
      icon: "💊",
      features: ["Home Delivery", "Prescription Refills", "Medicine Consultation", "24/7 Access"]
    },
    {
      id: 6,
      title: "Health Checkups",
      description: "Comprehensive health screening packages tailored to your age and health needs.",
      icon: "📋",
      features: ["Full Body Checkup", "Cardiac Screening", "Diabetes Care", "Preventive Health"]
    }
  ];

  return (
    <div className="services-page">
      {/* Hero */}
      <div className="hero">
        <h1>Our Services</h1>
        <p>Comprehensive healthcare solutions designed for your wellbeing</p>
      </div>

      {/* Services */}
      <div className="container">
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <div className="features">
                {service.features.map((f, i) => (
                  <div key={i} className="feature-item">
                    ✓ {f}
                  </div>
                ))}
              </div>

              <button className="btn-main">Learn More</button>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="process-section">
        <h2>How It Works</h2>

        <div className="process-grid">
          {[
            { n: 1, t: "Book Appointment", d: "Choose your preferred service and schedule a convenient time slot." },
            { n: 2, t: "Consultation", d: "Connect with expert healthcare professionals for personalized care." },
            { n: 3, t: "Treatment Plan", d: "Receive a customized treatment plan tailored to your needs." },
            { n: 4, t: "Follow-up", d: "Continuous monitoring and support for your complete recovery." }
          ].map(step => (
            <div key={step.n} className="process-card">
              <div className="step-circle">{step.n}</div>
              <h4>{step.t}</h4>
              <p>{step.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Book your appointment today and experience quality healthcare</p>
        <button className="btn-light">Book Appointment Now →</button>
      </div>
    </div>
  );
}
