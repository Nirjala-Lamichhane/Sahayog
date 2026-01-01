import React from 'react'
import Login from '../Pages/Login/Login'
import { Routes, Route } from 'react-router-dom'
import SignUp from '../Pages/SignUp/SignUp'
import ForgetPassword from '../Pages/ForgetPassword/ForgetPassword'
import TransactionHistory from '../Pages/TransactionHistory/TransactionHistory'
import RatingReview from '../Pages/RatingReview/RatingReview'

function MainRoute() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/transactionhistory' element={<TransactionHistory />} />
        <Route path='/ratingreview' element={<RatingReview />} />
      </Routes>
    </>
  )
}

export default MainRoute
