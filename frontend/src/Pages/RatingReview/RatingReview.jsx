import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../Style/RatingReview.css'
import { FaStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { dashboardAPI } from '../../utils/api'

function RatingReview() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [approvedReviews, setApprovedReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Load approved reviews on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.email) {
      navigate('/login')
      return
    }

    const loadReviews = async () => {
      try {
        const response = await dashboardAPI.getUserApprovedRatings()
        setApprovedReviews(response.data || [])
      } catch (error) {
        console.error('Error loading reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating || !comment) {
      toast.error('Please give rating and review')
      return
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.email) {
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      await dashboardAPI.submitRating({
        userName: user.name || 'Anonymous',
        rating,
        comment,
      })
      toast.success('Review submitted! Awaiting admin approval.')
      setRating(0)
      setComment('')
    } catch (error) {
      toast.error(error.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='review-web-container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className='page-title'>Ratings & Reviews</h2>
        <button className='ghost-link' onClick={() => navigate('/dashboard')} style={{ fontSize: '14px', padding: '10px 20px', display: 'none' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Review Form */}
      <div className='review-form-card'>
        <h3>Give Your Feedback</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Your review will be approved by admin before appearing publicly</p>

        <div className='star-row'>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={rating >= star ? 'star active' : 'star'}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          placeholder='Write your review...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      {/* Review List - Only Approved */}
      <div className='review-list-card'>
        <h3>Approved Reviews</h3>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading reviews...</p>
        ) : approvedReviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No approved reviews yet. Be the first to review!</p>
        ) : (
          <table className='review-table'>
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {approvedReviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.userName}</td>
                  <td>
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </td>
                  <td>{review.comment}</td>
                  <td>{new Date(review.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RatingReview
