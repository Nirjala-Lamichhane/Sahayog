import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaAmbulance } from 'react-icons/fa'
import { dashboardAPI } from '../../utils/api'
import './Ambulance.css'

function Ambulance({ isOpen, onClose, userInfo }) {
  const navigate = useNavigate()
  // Request form state
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropLocation, setDropLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)


  useEffect(() => {
    if (userInfo && isOpen) {
      setFullName(userInfo.name || userInfo.firstName || '')
      setContact(userInfo.phone || userInfo.email || '')
    }
  }, [userInfo, isOpen])

  const handleRequestSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to request an ambulance')
      onClose()
      navigate('/login')
      return
    }

    if (!fullName.trim() || !contact.trim() || !pickupLocation.trim() || !dropLocation.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setRequestLoading(true)

    try {
      const payload = {
        fullName: fullName.trim(),
        contact: contact.trim(),
        pickupLocation: pickupLocation.trim(),
        dropLocation: dropLocation.trim(),
        reason: notes.trim() || 'Emergency ambulance required',
        ambulanceType: 'basic',
      }

      const result = await dashboardAPI.requestAmbulance(payload)
      toast.success('Ambulance request submitted! Admin will confirm the service.')
      onClose()
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
      setRequestLoading(false)
    }
  }


  if (!isOpen) return null

  return (
    <div className="ambulance-modal-overlay" onClick={onClose}>
      <div className="ambulance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ambulance-header">
          <h2><FaAmbulance style={{ marginRight: '10px' }} /> Request Ambulance</h2>
          <button className="ambulance-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleRequestSubmit} className="ambulance-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={requestLoading}
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
                disabled={requestLoading}
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
                disabled={requestLoading}
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
                disabled={requestLoading}
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the emergency or medical condition..."
                rows="3"
                disabled={requestLoading}
              />
            </div>

          <div className="form-actions">
            <button type="submit" disabled={requestLoading} className="btn-submit">
              {requestLoading ? 'Processing...' : 'Send Request to Admin'}
            </button>
            <button type="button" onClick={onClose} disabled={requestLoading} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Ambulance