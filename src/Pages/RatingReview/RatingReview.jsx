// import { useState } from 'react'
// import '../../Style/RatingReview.css'
// import { FaStar } from 'react-icons/fa'

// function RatingReview() {
//   const [rating, setRating] = useState(0)
//   const [review, setReview] = useState('')
//   const [hover, setHover] = useState(0)

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (!rating || !review) {
//       alert('Please provide rating and review')
//       return
//     }

//     console.log({ rating, review })
//     alert('Thank you for your feedback!')
//     setRating(0)
//     setReview('')
//   }

//   return (
//     <div className='review-container'>
//       <h2 className='review-title'>Rate Your Experience</h2>

//       <div className='review-card'>
//         {/* Rating */}
//         <div className='rating-stars'>
//           {[...Array(5)].map((_, index) => {
//             const starValue = index + 1
//             return (
//               <FaStar
//                 key={index}
//                 className='star'
//                 color={starValue <= (hover || rating) ? '#fbbf24' : '#d1d5db'}
//                 onClick={() => setRating(starValue)}
//                 onMouseEnter={() => setHover(starValue)}
//                 onMouseLeave={() => setHover(0)}
//               />
//             )
//           })}
//         </div>

//         {/* Review Text */}
//         <textarea
//           placeholder='Write your review here...'
//           value={review}
//           onChange={(e) => setReview(e.target.value)}
//         />

//         {/* Submit */}
//         <button onClick={handleSubmit}>Submit Review</button>
//       </div>
//     </div>
//   )
// }

// export default RatingReview
import { useState } from 'react'
import '../../Style/RatingReview.css'
import { FaStar } from 'react-icons/fa'

const dummyReviews = [
  {
    id: 1,
    name: 'Anup Thapa',
    rating: 5,
    comment: 'Excellent service and friendly staff.',
    date: '2025-11-25',
  },
  {
    id: 2,
    name: 'Patient User',
    rating: 4,
    comment: 'Doctor was helpful and professional.',
    date: '2025-11-24',
  },
]

function RatingReview() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating || !comment) {
      alert('Please give rating and review')
      return
    }

    alert('Review submitted successfully!')
    setRating(0)
    setComment('')
  }

  return (
    <div className='review-web-container'>
      <h2 className='page-title'>Ratings & Reviews</h2>

      {/* Review Form */}
      <div className='review-form-card'>
        <h3>Give Your Feedback</h3>

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

        <button onClick={handleSubmit}>Submit Review</button>
      </div>

      {/* Review List */}
      <div className='review-list-card'>
        <h3>All Reviews</h3>

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
            {dummyReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.name}</td>
                <td>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </td>
                <td>{review.comment}</td>
                <td>{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RatingReview
