import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCreditCard, FaUniversity, FaMobileAlt, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { paymentAPI } from '../utils/api';
import '../Style/CabinPayment.css';

function CabinPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cabinBookingId] = useState(searchParams.get('bookingId'));
  const [cabinDetails, setCabinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount, setAmount] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        // Get cabin booking details from navigation state
        const storedBooking = localStorage.getItem('currentCabinBooking');
        if (storedBooking) {
          const booking = JSON.parse(storedBooking);
          setCabinDetails(booking);
          
          // Calculate amount
          const res = await paymentAPI.validatePaymentAmount(
            'cabin',
            booking.cabinType,
            booking.numberOfNights
          );
          setAmount(res.amount);
        } else {
          toast.error('No cabin booking found');
          navigate('/bookcabin');
        }
      } catch (error) {
        toast.error('Failed to load booking details');
        navigate('/bookcabin');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 13) {
      toast.error('Invalid card number');
      return false;
    }
    if (!cardDetails.cardName) {
      toast.error('Card holder name is required');
      return false;
    }
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      toast.error('Invalid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      toast.error('Invalid CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }

    setProcessing(true);
    try {
      const res = await paymentAPI.processCabinPayment(
        cabinBookingId,
        amount,
        paymentMethod
      );

      if (res.success) {
        localStorage.removeItem('currentCabinBooking');
        toast.success('Payment successful!');
        navigate('/transactionhistory');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-loading">Loading cabin details...</div>;
  }

  return (
    <div className="cabin-payment-container">
      <div className="cabin-payment-overlay" onClick={() => navigate('/bookcabin')} />
      
      <div className="cabin-payment-card">
        <div className="payment-header">
          <h2>Cabin Booking Payment</h2>
          <button className="close-btn" onClick={() => navigate('/bookcabin')}>×</button>
        </div>

        <div className="payment-content">
          {/* Booking Summary */}
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <label>Cabin Type</label>
                <p>{cabinDetails?.cabinType || 'Standard'}</p>
              </div>
              <div className="summary-item">
                <label>Check-in Date</label>
                <p>{new Date(cabinDetails?.checkInDate).toLocaleDateString()}</p>
              </div>
              <div className="summary-item">
                <label>Check-out Date</label>
                <p>{new Date(cabinDetails?.checkOutDate).toLocaleDateString()}</p>
              </div>
              <div className="summary-item">
                <label>Number of Nights</label>
                <p>{cabinDetails?.numberOfNights}</p>
              </div>
            </div>

            <div className="payment-amount">
              <div className="amount-row">
                <span>Subtotal:</span>
                <span>Rs. {amount}</span>
              </div>
              <div className="amount-row">
                <span>Tax (10%):</span>
                <span>Rs. {Math.round(amount * 0.1)}</span>
              </div>
              <div className="amount-row total">
                <span>Total Amount:</span>
                <span>Rs. {Math.round(amount * 1.1)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-method-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="radio-label"><FaCreditCard style={{ marginRight: '8px' }} /> Credit/Debit Card</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online-banking"
                  checked={paymentMethod === 'online-banking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="radio-label"><FaUniversity style={{ marginRight: '8px' }} /> Online Banking</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="radio-label"><FaMobileAlt style={{ marginRight: '8px' }} /> Digital Wallet</span>
              </label>
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === 'card' && (
            <div className="card-details-section">
              <h3>Card Details</h3>
              <form onSubmit={handlePayment}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    maxLength="19"
                    pattern="\d{13,19}"
                  />
                </div>

                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="John Doe"
                    value={cardDetails.cardName}
                    onChange={handleCardChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={handleCardChange}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="***"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      maxLength="4"
                    />
                  </div>
                </div>

                <button type="submit" className="pay-button" disabled={processing}>
                  {processing ? 'Processing...' : `Pay Rs. ${Math.round(amount * 1.1)}`}
                </button>
              </form>
            </div>
          )}

          {/* Other Payment Methods */}
          {paymentMethod !== 'card' && (
            <div className="other-payment-section">
              <h3>Proceed with {paymentMethod === 'online-banking' ? 'Online Banking' : 'Digital Wallet'}</h3>
              <p>You will be redirected to complete the payment securely.</p>
              <button className="pay-button" onClick={handlePayment} disabled={processing}>
                {processing ? 'Processing...' : `Pay Rs. ${Math.round(amount * 1.1)}`}
              </button>
            </div>
          )}
        </div>

        <div className="payment-footer">
          <p>🔒 Your payment is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}

export default CabinPayment;
