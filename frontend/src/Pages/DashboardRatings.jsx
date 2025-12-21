import { useNavigate } from 'react-router-dom'
import '../Style/DashboardRatings.css'

function DashboardRatings({ ratings, loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="card ratings-card">
        <div className="card-header">
          <h2>User Reviews & Ratings</h2>
          <button 
            className="card-link"
            onClick={() => navigate('/ratingreview')}
          >
            View All / Leave a Review →
          </button>
        </div>
        <div className="loading-state">Loading reviews...</div>
      </div>
    )
  }

  if (ratings.length === 0) {
    return (
      <div className="card ratings-card">
        <div className="card-header">
          <h2>User Reviews & Ratings</h2>
          <button 
            className="card-link"
            onClick={() => navigate('/ratingreview')}
          >
            View All / Leave a Review →
          </button>
        </div>
        <div className="empty-state">
          No reviews yet. <button 
            onClick={() => navigate('/ratingreview')}
            className="link-btn"
          >
            Be the first to review!
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card ratings-card">
      <div className="card-header">
        <h2>User Reviews & Ratings</h2>
        <button 
          className="card-link"
          onClick={() => navigate('/ratingreview')}
        >
          View All / Leave a Review →
        </button>
      </div>
      <div className="ratings-list">
        {ratings.slice(0, 3).map((review) => (
          <div key={review._id} className="rating-item">
            <div className="rating-header">
              <h4 className="rating-user">{review.userName}</h4>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? 'filled' : 'empty'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="rating-comment">{review.comment}</p>
            <small className="rating-date">
              {new Date(review.submittedAt).toLocaleDateString()}
            </small>
          </div>
        ))}
        {ratings.length > 3 && (
          <button 
            onClick={() => navigate('/ratingreview')}
            className="view-all-btn"
          >
            View All {ratings.length} Reviews
          </button>
        )}
      </div>
    </div>
  )
}

export default DashboardRatings
