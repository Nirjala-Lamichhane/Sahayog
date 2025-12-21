import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dashboardAPI } from '../utils/api'
import '../Style/AmbulanceModal.css'

function AmbulanceModal({ isOpen, onClose, userInfo }) {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropLocation, setDropLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ Sync userInfo into form when modal opens or userInfo updates
  useEffect(() => {
    if (userInfo) {
      setFullName(userInfo.name || userInfo.firstName || '')
      setContact(userInfo.phone || userInfo.email || '')
    }
  }, [userInfo])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to request an ambulance')
      onClose()
      navigate('/login')
      return
    }

    if (
      !fullName.trim() ||
      !contact.trim() ||
      !pickupLocation.trim() ||
      !dropLocation.trim()
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    const pickup = pickupLocation.trim()
    const drop = dropLocation.trim()

    setLoading(true)

    try {
      const payload = {
        fullName: fullName.trim(),
        contact: contact.trim(),
        pickupLocation: pickup,
        dropLocation: drop,
        reason: notes.trim() || 'Emergency ambulance required',
        ambulanceType: 'basic',
      }

      const result = await dashboardAPI.requestAmbulance(payload)

      toast.success('Ambulance request submitted successfully!')

      // 💰 Temporary pricing logic
      const distance = 10
      const pricePerKm = 50
      const subtotal = distance * pricePerKm
      const serviceCharge = Math.round(subtotal * 0.1)
      const tax = Math.round(subtotal * 0.06)
      const grandTotal = subtotal + serviceCharge + tax

      const ambulancePaymentData = {
        service: 'Ambulance Service',
        pickupLocation: pickup,
        destinationLocation: drop,
        distance,
        pricePerKm,
        subtotal: `NPR ${subtotal.toLocaleString()}`,
        serviceCharge: `NPR ${serviceCharge.toLocaleString()}`,
        tax: `NPR ${tax.toLocaleString()}`,
        grandTotal: `NPR ${grandTotal.toLocaleString()}`,
        bookingId: result.data?.data?.id || 'pending',
        bookingType: 'ambulance',
      }

      localStorage.setItem(
        'pendingAmbulanceBookingDetails',
        JSON.stringify(ambulancePaymentData)
      )

      onClose()
      navigate('/payment-method', {
        state: { appointmentDetails: ambulancePaymentData },
      })

      // Clear form AFTER navigation
      setPickupLocation('')
      setDropLocation('')
      setNotes('')
    } catch (error) {
      console.error('Ambulance request error:', error)

      if (error.status === 401) {
        toast.error('Please login to request an ambulance')
        navigate('/login')
      } else if (error.status === 403) {
        toast.error('Not authorized to request ambulance')
      } else {
        toast.error(error.message || 'Failed to submit ambulance request')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Ambulance</h2>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contact Number / Email *</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your phone number or email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Pickup Location *</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter your current location"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Drop-off Location *</label>
            <input
              type="text"
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              placeholder="Enter destination location"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the emergency or medical condition..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: loading ? '#999' : '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AmbulanceModal
