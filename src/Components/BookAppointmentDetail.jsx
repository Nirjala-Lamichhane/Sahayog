import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/BookAppointmentDetail.css";

const BookAppointmentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    // If no data, redirect back to booking page
    navigate("/book-appointment");
    return null;
  }

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-item">
          <strong>Full Name:</strong> {data.fullName}
        </div>
        <div className="detail-item">
          <strong>Age:</strong> {data.age}
        </div>
        <div className="detail-item">
          <strong>Address:</strong> {data.address}
        </div>
        <div className="detail-item">
          <strong>Contact:</strong> {data.contact}
        </div>
        <button className="home-btn" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default BookAppointmentDetail;
