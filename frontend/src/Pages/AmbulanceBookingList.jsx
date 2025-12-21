import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { dashboardAPI } from '../utils/api';
import '../Style/AmbulanceBookingList.css';

function AmbulanceBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getUserAmbulanceRequests();
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Failed to load ambulance bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id || booking.id);
    setEditForm({
      location: booking.location || '',
      notes: booking.notes || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    try {
      // For in-memory storage, update the local state
      const updatedBookings = bookings.map(b => 
        (b._id || b.id) === editingId 
          ? { ...b, location: editForm.location, notes: editForm.notes }
          : b
      );
      setBookings(updatedBookings);
      setEditingId(null);
      setEditForm(null);
      toast.success('Ambulance booking updated');
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ambulance booking?')) {
      return;
    }

    try {
      // For in-memory storage, update the local state
      const updatedBookings = bookings.filter(b => (b._id || b.id) !== id);
      setBookings(updatedBookings);
      toast.success('Ambulance booking deleted');
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: '#fff3cd', color: '#856404' },
      approved: { bg: '#d4edda', color: '#155724' },
      rejected: { bg: '#f8d7da', color: '#721c24' },
      completed: { bg: '#cce5ff', color: '#004085' },
    };

    const badge = badges[status] || badges.pending;
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '6px 12px',
          borderRadius: '20px',
          backgroundColor: badge.bg,
          color: badge.color,
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'capitalize',
        }}
      >
        {status || 'Pending'}
      </span>
    );
  };

  if (loading) {
    return <div className="ambulance-list-loading">Loading ambulance bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="ambulance-list-empty">
        <FaExclamationCircle style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
        <h3>No Ambulance Bookings</h3>
        <p>You haven't made any ambulance requests yet.</p>
      </div>
    );
  }

  return (
    <div className="ambulance-booking-list">
      <div className="list-header">
        <h2>My Ambulance Bookings</h2>
        <p>Manage your ambulance service requests</p>
      </div>

      <div className="bookings-container">
        {bookings.map((booking) => (
          <div key={booking._id || booking.id} className="booking-card">
            {editingId === (booking._id || booking.id) ? (
              <div className="edit-form">
                <h3>Edit Ambulance Booking</h3>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSaveEdit}>
                    Save Changes
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setEditingId(null);
                      setEditForm(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="booking-header">
                  <div>
                    <h3>Ambulance Service Request</h3>
                    <p className="booking-date">
                      {new Date(booking.createdAt || booking.requestDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span className="value">{booking.location || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Notes:</span>
                    <span className="value">{booking.notes || 'No additional notes'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Requested By:</span>
                    <span className="value">{booking.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Contact:</span>
                    <span className="value">{booking.email}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(booking)}
                  >
                    <FaEdit style={{ marginRight: '6px' }} /> Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(booking._id || booking.id)}
                  >
                    <FaTrash style={{ marginRight: '6px' }} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AmbulanceBookingList;
