import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/BookAppointment.css";
import toast from "react-hot-toast";
import { dashboardAPI } from "../utils/api";

const BookAppointment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    age: "",
    address: "",
    contact: "",
    department: "General",
    doctor: "Available Doctor",
    preferredDate: "",
    preferredTime: "10:00 AM",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const doctorOptions = {
    General: ["Available Doctor", "Dr. Aashish Shrestha", "Dr. Meera KC"],
    Cardiology: ["Dr. Rajesh Kumar", "Dr. Sunita Lama"],
    Dentistry: ["Dr. Priya Sharma", "Dr. Nabin Karki"],
    Dermatology: ["Dr. Ritu Bhandari", "Dr. Karan Joshi"],
    Neurology: ["Dr. Anil Pradhan", "Dr. Manisha Bhatt"],
    Orthopedics: ["Dr. Suresh Rana", "Dr. Kriti Malla"],
    Pediatrics: ["Dr. Binita Shrestha", "Dr. Rahul Nepal"],
    Psychiatry: ["Dr. Kabita Rai", "Dr. Aayush Adhikari"],
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData((prev) => ({
      ...prev,
      preferredDate: tomorrow.toISOString().split("T")[0],
    }));

    const loadAppointments = async () => {
      try {
        const res = await dashboardAPI.getAppointments();
        setAppointments(res.data || []);
      } catch (err) {
        toast.error(err.message || "Could not load your bookings");
      } finally {
        setAppointmentsLoading(false);
      }
    };

    loadAppointments();
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^(\+977|977|0)?[0-9]{9,10}$/.test(formData.contact.replace(/[-\s]/g, ""))) {
      newErrors.contact = "Please enter a valid phone number";
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "department") {
        const firstDoctor = doctorOptions[value]?.[0] || "Available Doctor";
        next.doctor = firstDoctor;
      }
    return next;
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const response = await dashboardAPI.bookAppointment(formData);

      if (response.success) {
        toast.success("Appointment booked successfully!");
        setAppointments((prev) => [response.data, ...prev]);
        const appointmentId = response.data.id || response.data._id;
        navigate(`/appointment-detail?id=${appointmentId}`, { state: response.data });
      } else {
        toast.error(response.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "General",
    "Cardiology",
    "Dentistry",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
  ];

  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
  ];

  return (
    <div className="book-appointment-container">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'none' }}>
          ← Back to Dashboard
        </button>
      </div>
      <div className="appointment-header">

      </div>

      <div className="appointment-form-wrapper">
        <form className="appointment-form" onSubmit={handleBook}>
          <div className="form-section">
            <h2>Patient Information</h2>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "error" : ""}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? "error" : ""}
                  min="1"
                  max="150"
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact">Contact Number *</label>
                <input
                  id="contact"
                  type="tel"
                  name="contact"
                  placeholder="+977 XXXXXXXXX"
                  value={formData.contact}
                  onChange={handleChange}
                  className={errors.contact ? "error" : ""}
                />
                {errors.contact && <span className="error-message">{errors.contact}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder="Enter your complete address (e.g., 123 Main St, Kathmandu)"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "error" : ""}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Appointment Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="doctor">Doctor</label>
                <select
                  id="doctor"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                >
                  {(doctorOptions[formData.department] || ["Available Doctor"]).map((doc) => (
                    <option key={doc} value={doc}>
                      {doc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredDate">Preferred Date *</label>
                <input
                  id="preferredDate"
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className={errors.preferredDate ? "error" : ""}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.preferredDate && (
                  <span className="error-message">{errors.preferredDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="preferredTime">Preferred Time</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Describe your symptoms or reason for visit (optional)"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Booking Appointment..." : "Book Appointment"}
          </button>
        </form>

        <div className="appointment-info">
          <div className="info-card">
            <h3>What to Bring</h3>
            <ul>
              <li>Valid ID or passport</li>
              <li>Health insurance card (if applicable)</li>
              <li>Medical records (if available)</li>
              <li>List of current medications</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Important Notes</h3>
            <ul>
              <li>Arrive 15 minutes before appointment</li>
              <li>Cancellations require 24-hour notice</li>
              <li>Confirm appointment via SMS/Email</li>
              <li>Call support for rescheduling</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Contact Support</h3>
            <p>
              <strong>Hotline:</strong> +977-1-XXXXXX
            </p>
            <p>
              <strong>Email:</strong> support@sahayog.com
            </p>
            <p>
              <strong>Hours:</strong> 9 AM - 6 PM (Mon-Sat)
            </p>
          </div>
        </div>
      </div>

      <div className="booking-details-section">
        <div className="booking-details-header">
          <div>
            <p className="eyebrow">Booking Detail</p>
            <h2>Track your appointments</h2>
            <p className="muted-text">See what you just booked and its current status.</p>
          </div>
          <button className="ghost-link" onClick={() => navigate("/dashboard")} style={{display: 'none'}}>Back to dashboard</button>
        </div>

        <div className="booking-cards">
          {appointmentsLoading ? (
            <div className="booking-card skeleton">Loading your appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="booking-card empty">No bookings yet. Schedule your first appointment above.</div>
          ) : (
            appointments.map((appt) => (
              <div className="booking-card" key={appt._id}>
                <div className="booking-card-top">
                  <div>
                    <p className="eyebrow">{appt.department}</p>
                    <h3>{appt.doctor || "Available Doctor"}</h3>
                    <p className="muted-text">{appt.fullName}</p>
                  </div>
                  <span className={`status-chip ${appt.status || "pending"}`}>
                    {(appt.status || "pending").toUpperCase()}
                  </span>
                </div>
                <div className="booking-card-grid">
                  <div>
                    <p className="label">Date</p>
                    <p>{appt.preferredDate}</p>
                  </div>
                  <div>
                    <p className="label">Time</p>
                    <p>{appt.preferredTime}</p>
                  </div>
                  <div>
                    <p className="label">Contact</p>
                    <p>{appt.contact}</p>
                  </div>
                  <div>
                    <p className="label">Booked On</p>
                    <p>{appt.bookingDate ? new Date(appt.bookingDate).toLocaleDateString("en-US") : "—"}</p>
                  </div>
                </div>
                <div className="booking-card-actions">
                  <button className="ghost-link" onClick={() => navigate("/appointment-detail", { state: appt })}>
                    View details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
