import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../Style/PaymentMethod.css';
import { paymentAPI } from '../utils/api';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasShownError, setHasShownError] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // Initialize appointment details from location state or localStorage
  useEffect(() => {
    let details = location.state?.appointmentDetails;
    
    if (details) {
      console.log('✓ Received appointment details from navigation:', details);
      setAppointmentDetails(details);
      localStorage.setItem('pendingAppointmentDetails', JSON.stringify(details));
    } else {
      // Try to get from localStorage
      try {
        const stored = localStorage.getItem('pendingAppointmentDetails');
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('✓ Loaded appointment details from localStorage:', parsed);
          setAppointmentDetails(parsed);
        } else {
          console.warn('⚠️ No appointment details found in state or localStorage');
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }
  }, [location.state?.appointmentDetails]);

  // Load user data on mount - only check authentication
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.email) {
      toast.error('Please login first');
      setTimeout(() => navigate('/login'), 500);
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const paymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      icon: 'e',
      color: '#60bb46',
      description: 'Pay with eSewa wallet'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      icon: 'k',
      color: '#5c2d91',
      description: 'Pay with Khalti wallet'
    }
  ];

  // Load transaction history on mount
  useEffect(() => {
    const loadTransactionHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.email) {
          return;
        }

        const response = await paymentAPI.getPaymentHistory();
        const txnData = response?.data || response || [];
        setTransactions(Array.isArray(txnData) ? txnData : []);
      } catch (error) {
        console.error('Error loading transaction history:', error);
      }
    };

    loadTransactionHistory();
  }, []);

  // Extract numeric amount from formatted string
  const extractAmount = (amountStr) => {
    if (!amountStr) return 0;
    return parseInt(amountStr.replace(/[^\d]/g, '')) || 0;
  };

  const grandTotalAmount = appointmentDetails ? extractAmount(appointmentDetails.grandTotal) : 0;

  // Handle payment processing
  const handlePayNow = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!appointmentDetails) {
      toast.error('Booking details missing. Please complete a booking first.');
      navigate('/book-appointment');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user.email) {
        navigate('/login');
        return;
      }

      let response;

      // Process payment based on booking type
      if (appointmentDetails.bookingType === 'cabin') {
        if (!appointmentDetails.bookingId) {
          toast.error('Cabin booking ID is required');
          setLoading(false);
          return;
        }
        response = await paymentAPI.processCabinPayment(
          appointmentDetails.bookingId,
          grandTotalAmount,
          selectedMethod
        );
      } else if (appointmentDetails.bookingType === 'ambulance') {
        if (!appointmentDetails.bookingId) {
          toast.error('Ambulance request ID is required');
          setLoading(false);
          return;
        }
        response = await paymentAPI.processAmbulancePayment(
          appointmentDetails.bookingId,
          grandTotalAmount,
          selectedMethod,
          appointmentDetails.distance || 10
        );
      } else {
        // For regular appointments, process payment via API
        response = await paymentAPI.processAppointmentPayment(
          appointmentDetails.bookingId,
          grandTotalAmount,
          selectedMethod,
          appointmentDetails.service
        );
      }

      if (response.success) {
        toast.success('Payment processed successfully! 🎉');

        // Clear localStorage of appointment details after successful payment
        localStorage.removeItem('pendingAppointmentDetails');

        // Reload transaction history
        try {
          const historyResponse = await paymentAPI.getPaymentHistory();
          const txnData = historyResponse?.data || historyResponse || [];
          setTransactions(Array.isArray(txnData) ? txnData : []);
        } catch (error) {
          console.error('Error reloading transactions:', error);
        }

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard', {
            state: {
              paymentSuccess: true,
              bookingType: appointmentDetails.bookingType
            }
          });
        }, 2000);
      } else {
        toast.error(response.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading or error state if no appointment details
  if (!appointmentDetails || !currentUser) {
    return (
      <div className="payment-page">
        <header className="payment-header">
          <div className="header-content">
            <button className="back-button" onClick={handleBack}>←</button>
            <h1>Payment Method</h1>
          </div>
        </header>
        <main className="payment-content">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            fontSize: '18px',
            color: '#6b7280',
            gap: '20px'
          }}>
            <p>No booking details found.</p>
            <button
              onClick={() => navigate('/book-appointment')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0f766e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0d9488'}
            >
              Complete a Booking
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="payment-page">
      {/* Header */}
      <header className="payment-header">
        <div className="header-content">
          <button className="back-button" onClick={handleBack}>←</button>
          <h1>Payment Method</h1>
          <button
            className="menu-button"
            onClick={() => setShowTransactionHistory(!showTransactionHistory)}
            title="View transaction history"
          >
            📋
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="payment-content">
        {showTransactionHistory ? (
          // Transaction History View - Clean Card Layout
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 className="page-title">Transaction History</h2>
              <p style={{ color: '#6b7280', marginTop: '8px' }}>
                View all your payment transactions and booking details
              </p>
            </div>

            {transactions.length === 0 ? (
              <div className="booking-summary-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>No transactions yet</p>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
                  Your payment history will appear here
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {transactions.map((transaction, idx) => (
                  <div key={transaction._id || idx} className="booking-summary-card">
                    <div className="summary-title">
                      <h3 style={{ marginBottom: '4px' }}>
                        {transaction.description || 'Transaction'}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        {transaction.type?.replace('-', ' ').toUpperCase()}
                      </p>
                    </div>

                    <div className="booking-info">
                      {/* Booking Details */}
                      {transaction.bookingDetails && (
                        <>
                          {transaction.bookingDetails.service && (
                            <div className="info-row">
                              <span className="label">Service</span>
                              <span className="value">{transaction.bookingDetails.service}</span>
                            </div>
                          )}

                          {transaction.bookingDetails.cabinType && (
                            <div className="info-row">
                              <span className="label">Cabin Type</span>
                              <span className="value">{transaction.bookingDetails.cabinType}</span>
                            </div>
                          )}

                          {transaction.bookingDetails.checkInDate && (
                            <div className="info-row">
                              <span className="label">Check-in</span>
                              <span className="value">
                                {new Date(transaction.bookingDetails.checkInDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {transaction.bookingDetails.checkOutDate && (
                            <div className="info-row">
                              <span className="label">Check-out</span>
                              <span className="value">
                                {new Date(transaction.bookingDetails.checkOutDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {transaction.bookingDetails.pickupLocation && (
                            <div className="info-row">
                              <span className="label">Pickup Location</span>
                              <span className="value">{transaction.bookingDetails.pickupLocation}</span>
                            </div>
                          )}

                          {transaction.bookingDetails.destinationLocation && (
                            <div className="info-row">
                              <span className="label">Destination</span>
                              <span className="value">{transaction.bookingDetails.destinationLocation}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="info-divider"></div>

                      {/* Payment Info */}
                      <div className="info-row">
                        <span className="label">Amount Paid</span>
                        <span className="value amount">
                          NPR {transaction.amount?.toLocaleString() || '0'}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Payment Method</span>
                        <span className="value" style={{ textTransform: 'capitalize' }}>
                          {transaction.paymentMethod?.replace('-', ' ') || 'N/A'}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Date</span>
                        <span className="value">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Status</span>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          backgroundColor: '#f0fdfa',
                          color: '#0f766e',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '12px',
                          textTransform: 'capitalize',
                          border: '1px solid #99f6e4'
                        }}>
                          ✓ {transaction.status || 'completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowTransactionHistory(false)}
              className="view-history-btn"
              style={{
                marginTop: '32px',
                maxWidth: '600px',
                margin: '32px auto 0'
              }}
            >
              ← Back to Payment
            </button>
          </div>
        ) : (
          // Clean Payment Form View - Simplified
          <div className="payment-form-wrapper">
            {/* Payment Header */}
            <div className="payment-form-header">
              <h2>Complete Your Payment</h2>
              <p className="subtitle">Secure payment for your booking</p>
            </div>

            {/* Booking Summary - Clean and Simple */}
            <div className="booking-summary-card">
              <div className="summary-title">
                <h3>Booking Details</h3>
              </div>
              
              <div className="booking-info">
                <div className="info-row">
                  <span className="label">Booking Type</span>
                  <span className="value">
                    {appointmentDetails.bookingType?.charAt(0).toUpperCase() + appointmentDetails.bookingType?.slice(1) || 'Appointment'}
                  </span>
                </div>
                
                {appointmentDetails.service && (
                  <div className="info-row">
                    <span className="label">Service</span>
                    <span className="value">{appointmentDetails.service}</span>
                  </div>
                )}
                
                {appointmentDetails.doctor && (
                  <div className="info-row">
                    <span className="label">Doctor</span>
                    <span className="value">{appointmentDetails.doctor}</span>
                  </div>
                )}
                
                {appointmentDetails.date && (
                  <div className="info-row">
                    <span className="label">Date</span>
                    <span className="value">{appointmentDetails.date}</span>
                  </div>
                )}

                <div className="info-divider"></div>

                <div className="info-row">
                  <span className="label">Subtotal</span>
                  <span className="value amount">{appointmentDetails.total || 'NPR 0'}</span>
                </div>
                
                {appointmentDetails.serviceCharge && (
                  <div className="info-row">
                    <span className="label">Service Charge</span>
                    <span className="value amount">{appointmentDetails.serviceCharge}</span>
                  </div>
                )}
                
                {appointmentDetails.tax && (
                  <div className="info-row">
                    <span className="label">Tax</span>
                    <span className="value amount">{appointmentDetails.tax}</span>
                  </div>
                )}

                <div className="info-divider"></div>

                <div className="info-row total-row">
                  <span className="label">Total Amount</span>
                  <span className="value grand-total">{appointmentDetails.grandTotal || 'NPR 0'}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods-card">
              <h3>Select Payment Method</h3>
              <div className="payment-methods-grid">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`payment-method-option ${selectedMethod === method.id ? 'active' : ''}`}
                    onClick={() => !loading && setSelectedMethod(method.id)}
                    disabled={loading}
                  >
                    <div 
                      className="method-icon" 
                      style={{ backgroundColor: method.color }}
                    >
                      {method.icon.toUpperCase()}
                    </div>
                    <h4>{method.name}</h4>
                    <p>{method.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              className="pay-now-btn"
              disabled={!selectedMethod || loading}
              onClick={handlePayNow}
            >
              {loading ? (
                <>
                  <span style={{ marginRight: '8px' }}>⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span>💳</span>
                  Pay {appointmentDetails.grandTotal || 'Now'}
                </>
              )}
            </button>

            {/* View History Button */}
            <button
              className="view-history-btn"
              onClick={() => setShowTransactionHistory(true)}
              disabled={loading}
            >
              View Transaction History
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentMethod;