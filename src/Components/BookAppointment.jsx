import React, { useState } from "react";
import "../Styles/BookAppointment.css";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    address: "",
    contact: "",
  });

  const handleBack = () => {
    navigate("/"); // Back to Home
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBook = () => {
    // Navigate to details page with state
    navigate("/appointment-detail", { state: formData });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="left">
          <span
            className="back-arrow"
            onClick={handleBack}
            style={{ cursor: "pointer" }}
          >
            ←
          </span>
          <h2>Details For Booking Doctor</h2>
        </div>
      </div>

      <div className="appointment-wrapper">
        <div className="form-card">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="First and Last Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contact"
              placeholder="+977"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <button className="book-btn" onClick={handleBook}>
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
