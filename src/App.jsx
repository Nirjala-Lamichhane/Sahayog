import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import Dashboard from './Pages/Home/Home'
import ForgetPassword from './Pages/ForgetPassword/ForgetPassword'
import ProtectedRoute from './Components/ProtectedRoute'
import TransactionHistory from './Pages/TransactionHistory/TransactionHistory'
import RatingReview from './Pages/RatingReview/RatingReview'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />

        {/* Protected Dashboard */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/transactionHistory' element={<TransactionHistory />} />
        <Route path='/ratingreview' element={<RatingReview />} />
      </Routes>
    </Router>
  )
}

export default App
