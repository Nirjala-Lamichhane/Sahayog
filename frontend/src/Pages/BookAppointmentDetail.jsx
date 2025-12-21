import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "../Style/BookAppointmentDetail.css";
import toast from "react-hot-toast";
import { dashboardAPI } from "../utils/api";

const BookAppointmentDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [appointment, setAppointment] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const containerRef = useRef(null);

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    
    // Load approved reviews
    const loadReviews = async () => {
      try {
        const res = await dashboardAPI.getUserApprovedRatings();
        setApprovedReviews(res.data || []);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [token, navigate]);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const id = searchParams.get("id");
        if (id) {
          const res = await dashboardAPI.getAppointmentById(id);
          setAppointment(res.data);
          return;
        }

        // Fallback to most recent appointment
        const res = await dashboardAPI.getAppointments();
        const list = res.data || [];
        if (list.length === 0) {
          toast.error("No appointments found. Please book one first.");
          navigate("/book-appointment");
          return;
        }
        // latest by booking date
        const sorted = [...list].sort(
          (a, b) => new Date(b.bookingDate || b.createdAt) - new Date(a.bookingDate || a.createdAt)
        );
        setAppointment(sorted[0]);
      } catch (err) {
        toast.error(err.message || "Unable to load appointment");
        navigate("/book-appointment");
      } finally {
        setLoading(false);
      }
    };

    if (!appointment) {
      loadAppointment();
    } else {
      setLoading(false);
    }
  }, [appointment, navigate, searchParams]);

  const handleReschedule = () => {
    setIsEditing(true);
    setEditData({
      preferredDate: appointment.preferredDate,
      preferredTime: appointment.preferredTime,
      fullName: appointment.fullName,
      age: appointment.age,
      address: appointment.address,
      contact: appointment.contact,
      department: appointment.department,
      doctor: appointment.doctor,
      notes: appointment.notes,
    });
  };

  const handleSaveChanges = async () => {
    if (!editData.preferredDate || !editData.preferredTime) {
      toast.error("Please select date and time");
      return;
    }

    setIsSaving(true);
    try {
      const res = await dashboardAPI.updateAppointment(appointment._id, editData);
      setAppointment(res.data);
      setIsEditing(false);
      toast.success("Appointment updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update appointment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
      return;
    }

    setIsSaving(true);
    try {
      await dashboardAPI.cancelAppointment(appointment._id);
      toast.success("Appointment cancelled successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to cancel appointment");
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-refresh appointment details to show latest status from admin
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (appointment?._id) {
          const res = await dashboardAPI.getAppointmentById(appointment._id);
          setAppointment(res.data);
        }
      } catch (err) {
        // Silent fail on auto-refresh
      }
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [appointment?._id]);

  if (loading) {
    return <div className="appointment-loading">Loading appointment details...</div>;
  }

  if (!appointment) {
    return <div className="appointment-loading">No appointment found. Please book one first.</div>;
  }

  const status = appointment.status || "pending";
  const bookingDate = appointment.bookingDate || appointment.createdAt;
  const statusCopy = {
    pending: "Awaiting admin confirmation",
    confirmed: "Confirmed by admin",
    cancelled: "Cancelled",
  };
  const statusMessage = statusCopy[status] || "Pending";

  return (
    <div
      className="appointment-detail-container"
      ref={containerRef}
    >
      <div className="appointment-header">
        <h1>Appointment Details</h1>
        <p className="header-note">Review your booking and upcoming steps</p>
      </div>

      <div className="appointment-card" onClick={(e) => e.stopPropagation()}>
        <div className="status-badge" data-status={status}>
          {status.toUpperCase()}
        </div>

        <div className="detail-section">
          <h2>Patient Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Full Name</label>
              <p>{appointment.fullName}</p>
            </div>
            <div className="detail-item">
              <label>Age</label>
              <p>{appointment.age} years</p>
            </div>
            <div className="detail-item">
              <label>Contact Number</label>
              <p>{appointment.contact}</p>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <p>{appointment.address}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Appointment Details</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Department</label>
              <p>{appointment.department}</p>
            </div>
            <div className="detail-item">
              <label>Doctor</label>
              <p>{appointment.doctor}</p>
            </div>
            <div className="detail-item">
              <label>Preferred Date</label>
              <p>{appointment.preferredDate}</p>
            </div>
            <div className="detail-item">
              <label>Preferred Time</label>
              <p>{appointment.preferredTime}</p>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div className="detail-section">
            <h2>Additional Notes</h2>
            <p className="notes-text">{appointment.notes}</p>
          </div>
        )}

        <div className="detail-section">
          <h2>Booking Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Booking Date</label>
              <p>
                {bookingDate
                  ? new Date(bookingDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div className="detail-item">
              <label>Confirmation Status</label>
              <p className={`status-chip ${status}`}>{statusMessage}</p>
            </div>
            {appointment.confirmedDate && (
              <div className="detail-item">
                <label>Confirmed On</label>
                <p>
                  {new Date(appointment.confirmedDate).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          {!isEditing ? (
            <>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  const appointmentPaymentData = {
                    service: appointment.department || 'Medical Consultation',
                    doctor: appointment.doctor || 'General Practitioner',
                    date: appointment.preferredDate || new Date().toISOString().split('T')[0],
                    time: appointment.preferredTime || '10:00 AM',
                    total: 'NPR 1,500',
                    serviceCharge: 'NPR 500',
                    tax: 'NPR 300',
                    grandTotal: 'NPR 2,300',
                    bookingId: appointment.id || appointment._id,
                    bookingType: 'appointment'
                  };
                  console.log('✓ Navigating to payment with details:', appointmentPaymentData);
                  // Also save to localStorage as backup
                  localStorage.setItem('pendingAppointmentDetails', JSON.stringify(appointmentPaymentData));
                  navigate('/payment-method', {
                    state: {
                      appointmentDetails: appointmentPaymentData
                    }
                  });
                }}
              >
                Proceed to Payment
              </button>
              <button className="btn btn-secondary" onClick={handleReschedule} disabled={isSaving}>
                Reschedule
              </button>
              <button className="btn btn-danger" onClick={handleCancel} disabled={isSaving}>
                Cancel Appointment
              </button>
            </>
          ) : (
            <div className="edit-form">
              <h3>Edit Appointment</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={editData.preferredDate}
                    onChange={(e) => setEditData({ ...editData, preferredDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={editData.preferredTime}
                    onChange={(e) => setEditData({ ...editData, preferredTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="tel"
                  value={editData.contact}
                  onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={editData.department}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <input
                  type="text"
                  value={editData.doctor}
                  onChange={(e) => setEditData({ ...editData, doctor: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approved Reviews Section */}
      <div className="reviews-section" onClick={(e) => e.stopPropagation()}>
        <h2>What Other Users Say</h2>
        {reviewsLoading ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Loading reviews...</p>
        ) : approvedReviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            No reviews yet. Be the first to share your feedback!
          </p>
        ) : (
          <div className="reviews-grid">
            {approvedReviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <h4>{review.userName}</h4>
                  <div className="review-stars">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="review-text">{review.comment}</p>
                <small className="review-date">
                  {new Date(review.submittedAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="info-box" onClick={(e) => e.stopPropagation()}>
        <h3>ℹ️ Important Information</h3>
        <ul>
          <li>Please arrive 15 minutes before your scheduled appointment time</li>
          <li>Bring valid ID and health insurance card if applicable</li>
          <li>For cancellations, please notify us at least 24 hours in advance</li>
          <li>Contact our support team at <strong>+977-1-XXXXXX</strong> for any queries</li>
        </ul>
      </div>
    </div>
  );
};

export default BookAppointmentDetail;
