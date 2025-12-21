import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAmbulance, FaCreditCard, FaUniversity, FaMobileAlt, FaCheck, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { paymentAPI } from '../utils/api';
import '../Style/AmbulancePayment.css';

function AmbulancePayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [distance, setDistance] = useState(10);
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
        // Calculate amount based on distance
        const res = await paymentAPI.validatePaymentAmount(
          'ambulance',
          null,
          null,
          distance
        );
        setAmount(res.amount);
      } catch (error) {
        toast.error('Failed to calculate amount');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [distance]);

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
      const res = await paymentAPI.processAmbulancePayment(
        'ambulance-' + Date.now(),
        amount,
        paymentMethod,
        distance
      );

      if (res.success) {
        toast.success('Payment successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-loading">Calculating ambulance fare...</div>;
  }

  return (
    <div className="ambulance-payment-container">
      <div className="ambulance-payment-overlay" onClick={() => navigate('/dashboard')} />
      
      <div className="ambulance-payment-card">
        <div className="payment-header">
          <h2><FaAmbulance style={{ marginRight: '10px' }} /> Ambulance Service Payment</h2>
          <button className="close-btn" onClick={() => navigate('/dashboard')}>×</button>
        </div>

        <div className="payment-content">
          {/* Service Summary */}
          <div className="service-summary">
            <h3>Service Details</h3>
            
            <div className="service-info">
              <div className="info-item">
                <label>Service Type</label>
                <p>Emergency Ambulance Transportation</p>
              </div>
              <div className="info-item">
                <label>Distance (km)</label>
                <div className="distance-input">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value) || 10)}
                  />
                  <span>km</span>
                </div>
              </div>
            </div>

            <div className="pricing-breakdown">
              <h4>Fare Breakdown</h4>
              <div className="price-item">
                <span>Base Charge:</span>
                <span>Rs. 500</span>
              </div>
              <div className="price-item">
                <span>Distance Charge ({distance} km × Rs. 50/km):</span>
                <span>Rs. {distance * 50}</span>
              </div>
              <div className="price-item total">
                <span>Total Fare:</span>
                <span>Rs. {amount}</span>
              </div>
            </div>

            <div className="service-features">
              <h4>What's Included</h4>
              <ul>
                <li><FaCheck style={{ marginRight: '8px', color: '#2ecc71' }} /> Professional paramedical staff</li>
                <li><FaCheck style={{ marginRight: '8px', color: '#2ecc71' }} /> Advanced life support equipment</li>
                <li><FaCheck style={{ marginRight: '8px', color: '#2ecc71' }} /> 24/7 availability</li>
                <li><FaCheck style={{ marginRight: '8px', color: '#2ecc71' }} /> GPS tracking</li>
                <li><FaCheck style={{ marginRight: '8px', color: '#2ecc71' }} /> Hospital admission assistance</li>
              </ul>
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
                  {processing ? 'Processing...' : `Pay Rs. ${amount}`}
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
                {processing ? 'Processing...' : `Pay Rs. ${amount}`}
              </button>
            </div>
          )}
        </div>

        <div className="payment-footer">
          <p><FaAmbulance style={{ marginRight: '5px' }} /> Emergency? Call 102 • <FaLock style={{ marginRight: '5px' }} /> Secure Payment</p>
        </div>
      </div>
    </div>
  );
}

export default AmbulancePayment;
