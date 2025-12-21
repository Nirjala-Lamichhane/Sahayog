import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBed, FaCrown, FaHeartbeat, FaCheck, FaSpinner, FaUser, FaCalendar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import '../Style/CabinBooking.css'
import { dashboardAPI } from '../utils/api'

const CABIN_TYPES = {
  'Private Cabin': {
    icon: <FaBed style={{ fontSize: '24px', color: '#2ecc71' }} />,
    price: 'NPR 5,000/night',
    features: ['Private room', 'Attached bathroom', 'Nurse call button', 'WiFi', 'TV', 'Room service'],
  },
  'Deluxe Cabin': {
    icon: <FaCrown style={{ fontSize: '24px', color: '#f39c12' }} />,
    price: 'NPR 8,000/night',
    features: ['Premium room', 'Luxury amenities', 'Air conditioning', 'Attached bathroom', 'WiFi', 'Living area'],
  },
  'ICU Bed': {
    icon: <FaHeartbeat style={{ fontSize: '24px', color: '#e74c3c' }} />,
    price: 'NPR 3,000/night',
    features: ['Medical monitoring', 'Ventilation support', 'Emergency equipment', 'Nurse on call', 'Vitals tracking'],
  },
  'Shared Ward': {
    icon: <FaBed style={{ fontSize: '24px', color: '#3498db' }} />,
    price: 'NPR 1,500/night',
    features: ['Shared room', 'Basic amenities', 'Bathroom access', 'Medical care', 'Meals included'],
  },
}

function BookCabin() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [selectedCabin, setSelectedCabin] = useState(null)
  const [availability, setAvailability] = useState(true)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const [form, setForm] = useState({
    fullName: user.name || '',
    age: '',
    contact: '',
    address: '',
    cabinType: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfAttendants: '1',
    reasonForStay: '',
    specialPreferences: '',
  })

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('Please log in to book a cabin')
      navigate('/login')
    }
  }, [navigate])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSelectCabin = (cabinType) => {
    setSelectedCabin(cabinType)
    updateField('cabinType', cabinType)
    setStep(2)
  }

  const checkAvailability = async () => {
    if (!form.checkInDate || !form.checkOutDate || !form.cabinType) {
      toast.error('Please fill in check-in, check-out dates, and select cabin type')
      return
    }

    setCheckingAvailability(true)
    try {
      const result = await dashboardAPI.checkCabinAvailability(
        form.cabinType,
        form.checkInDate,
        form.checkOutDate
      )
      setAvailability(result.available)
      if (result.available) {
        toast.success('Cabin is available for selected dates!')
      } else {
        toast.error('Cabin is not available for these dates. Please choose different dates.')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to check availability')
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !form.fullName ||
      !form.age ||
      !form.contact ||
      !form.address ||
      !form.cabinType ||
      !form.checkInDate ||
      !form.checkOutDate
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!availability) {
      toast.error('Please check availability first')
      return
    }

    setSaving(true)
    try {
      const result = await dashboardAPI.bookCabin({
        fullName: form.fullName,
        age: parseInt(form.age, 10),
        contact: form.contact,
        address: form.address,
        cabinType: form.cabinType,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        numberOfAttendants: parseInt(form.numberOfAttendants, 10) || 1,
        reasonForStay: form.reasonForStay,
        specialPreferences: form.specialPreferences,
      })
      
      toast.success('Cabin booking created! Proceeding to payment...')
      
      // Calculate cabin cost
      const days = calculateStayDays()
      const prices = {
        'Private Cabin': 5000,
        'Deluxe Cabin': 8000,
        'ICU Bed': 3000,
        'Shared Ward': 1500,
      }
      const pricePerDay = prices[form.cabinType] || 0
      const subtotal = pricePerDay * days
      const serviceCharge = Math.round(subtotal * 0.1) // 10% service charge
      const tax = Math.round(subtotal * 0.06) // 6% tax
      const grandTotal = subtotal + serviceCharge + tax
      
      // Navigate to payment with cabin booking details
      const cabinPaymentData = {
        service: form.cabinType,
        cabinType: form.cabinType,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        numberOfNights: days,
        pricePerNight: pricePerDay,
        subtotal: `NPR ${subtotal.toLocaleString()}`,
        serviceCharge: `NPR ${serviceCharge.toLocaleString()}`,
        tax: `NPR ${tax.toLocaleString()}`,
        grandTotal: `NPR ${grandTotal.toLocaleString()}`,
        bookingId: result.id || result._id || result.data?.id || result.data?._id,
        bookingType: 'cabin'
      };
      
      localStorage.setItem('pendingCabinBookingDetails', JSON.stringify(cabinPaymentData))
      navigate('/payment-method', {
        state: {
          appointmentDetails: cabinPaymentData
        }
      })
    } catch (err) {
      toast.error(err.message || 'Could not submit cabin booking')
    } finally {
      setSaving(false)
    }
  }

  const calculateStayDays = () => {
    if (!form.checkInDate || !form.checkOutDate) return 0
    const checkIn = new Date(form.checkInDate)
    const checkOut = new Date(form.checkOutDate)
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }

  const calculateCost = () => {
    const prices = {
      'Private Cabin': 5000,
      'Deluxe Cabin': 8000,
      'ICU Bed': 3000,
      'Shared Ward': 1500,
    }
    const pricePerDay = prices[form.cabinType] || 0
    const days = calculateStayDays()
    return pricePerDay * days
  }

  return (
    <div className="cabin-booking-page">
      <div className="cabin-header">
        <div className="header-content">
          <h1>🏥 Book Your Cabin</h1>
          <p>Reserve a comfortable cabin for your stay with us. All cabins include medical care and 24/7 support.</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-back-cabin" style={{display: 'none'}}>
          ← Back to Dashboard
        </button>
      </div>

      {step === 1 && (
        <div className="cabin-selection-section">
          <div className="section-header">
            <h2>Step 1: Select Your Cabin Type</h2>
            <p>Choose the cabin type that best suits your medical needs</p>
          </div>

          <div className="cabin-grid">
            {Object.entries(CABIN_TYPES).map(([cabinType, details]) => (
              <div
                key={cabinType}
                className={`cabin-option-card ${selectedCabin === cabinType ? 'selected' : ''}`}
                onClick={() => handleSelectCabin(cabinType)}
              >
                <div className="cabin-option-icon">{details.icon}</div>
                <h3>{cabinType}</h3>
                <p className="cabin-price">{details.price}</p>
                <ul className="cabin-features">
                  {details.features.map((feature, idx) => (
                    <li key={idx}><FaCheck style={{ marginRight: '8px', color: '#2ecc71' }} />{feature}</li>
                  ))}
                </ul>
                <button className="cabin-select-btn">
                  {selectedCabin === cabinType ? <><FaCheck style={{ marginRight: '5px' }} /> Selected</> : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="cabin-form-section">
          <div className="section-header">
            <h2>Step 2: Your Information</h2>
            <p>Please provide your details for the cabin booking</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => updateField('age', e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                value={form.contact}
                onChange={(e) => updateField('contact', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="form-group">
              <label>Check-In Date *</label>
              <input
                type="date"
                value={form.checkInDate}
                onChange={(e) => updateField('checkInDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Check-Out Date *</label>
              <input
                type="date"
                value={form.checkOutDate}
                onChange={(e) => updateField('checkOutDate', e.target.value)}
                min={form.checkInDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Attendants</label>
              <select value={form.numberOfAttendants} onChange={(e) => updateField('numberOfAttendants', e.target.value)}>
                <option value="1">1 Attendant</option>
                <option value="2">2 Attendants</option>
                <option value="3">3 Attendants</option>
                <option value="4">4+ Attendants</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Reason for Stay</label>
              <textarea
                value={form.reasonForStay}
                onChange={(e) => updateField('reasonForStay', e.target.value)}
                placeholder="Brief description of your medical condition or reason for stay"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label>Special Preferences or Requirements</label>
              <textarea
                value={form.specialPreferences}
                onChange={(e) => updateField('specialPreferences', e.target.value)}
                placeholder="Any special needs, dietary restrictions, or preferences"
                rows="3"
              />
            </div>
          </div>

          <div className="availability-check">
            <button
              type="button"
              onClick={checkAvailability}
              disabled={checkingAvailability || !form.checkInDate || !form.checkOutDate}
              className="btn-check-availability"
            >
              {checkingAvailability ? <><FaSpinner style={{ marginRight: '5px', animation: 'spin 1s linear infinite' }} /> Checking...</> : <><FaCheck style={{ marginRight: '5px' }} /> Check Availability</>}
            </button>
            {availability && (
              <span className="availability-status available"><FaCheck style={{ marginRight: '5px' }} /> Cabin is available</span>
            )}
            {!availability && form.checkInDate && form.checkOutDate && (
              <span className="availability-status unavailable">✗ Not available - choose different dates</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={!availability}
              className="btn-primary"
            >
              Next: Review Booking →
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="cabin-confirmation-section">
          <div className="section-header">
            <h2>Step 3: Confirm Your Booking</h2>
            <p>Please review your booking details before submission</p>
          </div>

          <div className="confirmation-card">
            <div className="confirmation-section">
              <h3>🏥 Cabin Details</h3>
              <div className="confirmation-grid">
                <div className="confirmation-item">
                  <span className="label">Cabin Type</span>
                  <span className="value">{form.cabinType}</span>
                </div>
                <div className="confirmation-item">
                  <span className="label">Price per Night</span>
                  <span className="value">
                    {form.cabinType === 'Private Cabin' && 'NPR 5,000'}
                    {form.cabinType === 'Deluxe Cabin' && 'NPR 8,000'}
                    {form.cabinType === 'ICU Bed' && 'NPR 3,000'}
                    {form.cabinType === 'Shared Ward' && 'NPR 1,500'}
                  </span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h3><FaUser style={{ marginRight: '8px' }} /> Guest Information</h3>
              <div className="confirmation-grid">
                <div className="confirmation-item">
                  <span className="label">Name</span>
                  <span className="value">{form.fullName}</span>
                </div>
                <div className="confirmation-item">
                  <span className="label">Age</span>
                  <span className="value">{form.age} years</span>
                </div>
                <div className="confirmation-item">
                  <span className="label">Contact</span>
                  <span className="value">{form.contact}</span>
                </div>
                <div className="confirmation-item">
                  <span className="label">Address</span>
                  <span className="value">{form.address}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h3><FaCalendar style={{ marginRight: '8px' }} /> Stay Details</h3>
              <div className="confirmation-grid">
                <div className="confirmation-item">
                  <span className="label">Check-In</span>
                  <span className="value">{new Date(form.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="confirmation-item">
                  <span className="label">Check-Out</span>
                  <span className="value">{new Date(form.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="confirmation-item">
                  <span className="label">Number of Nights</span>
                  <span className="value">{calculateStayDays()} night(s)</span>
                </div>
                <div className="confirmation-item">
                  <span className="label">Attendants</span>
                  <span className="value">{form.numberOfAttendants}</span>
                </div>
              </div>
            </div>

            {(form.reasonForStay || form.specialPreferences) && (
              <div className="confirmation-section">
                <h3>📝 Additional Information</h3>
                {form.reasonForStay && (
                  <div className="additional-info">
                    <strong>Reason for Stay:</strong>
                    <p>{form.reasonForStay}</p>
                  </div>
                )}
                {form.specialPreferences && (
                  <div className="additional-info">
                    <strong>Special Preferences:</strong>
                    <p>{form.specialPreferences}</p>
                  </div>
                )}
              </div>
            )}

            <div className="cost-summary">
              <div className="cost-row">
                <span>Nightly Rate:</span>
                <span className="cost-value">
                  {form.cabinType === 'Private Cabin' && 'NPR 5,000'}
                  {form.cabinType === 'Deluxe Cabin' && 'NPR 8,000'}
                  {form.cabinType === 'ICU Bed' && 'NPR 3,000'}
                  {form.cabinType === 'Shared Ward' && 'NPR 1,500'}
                </span>
              </div>
              <div className="cost-row">
                <span>Number of Nights:</span>
                <span className="cost-value">{calculateStayDays()}</span>
              </div>
              <div className="cost-row total">
                <span>Total Estimated Cost:</span>
                <span className="cost-value">NPR {calculateCost().toLocaleString()}</span>
              </div>
              <p className="cost-note">* Final cost may vary based on additional services. This is an estimate.</p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary"
            >
              ← Back to Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary btn-large"
            >
              {saving ? <><FaSpinner style={{ marginRight: '5px', animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><FaCheck style={{ marginRight: '5px' }} /> Confirm and Book</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookCabin