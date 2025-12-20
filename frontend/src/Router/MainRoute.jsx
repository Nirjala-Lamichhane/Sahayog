import React, { lazy, Suspense } from 'react'
import Home from '../Pages/Home'
import About from '../Pages/About'
import Contact from '../Pages/Contact'
import Departments from '../Pages/Departments'
import Services from '../Pages/Services'
import Dashboard from '../Pages/Dashboard'
import Login from '../Pages/Login/Login'
import { Routes, Route } from 'react-router-dom'
import SignUp from '../Pages/SignUp/SignUp'
import ForgetPassword from '../Pages/ForgetPassword/ForgetPassword'

// Lazy load components for code splitting and better performance
const TransactionHistory = lazy(() => import('../Pages/TransactionHistory'))
const RatingReview = lazy(() => import('../Pages/RatingReview/RatingReview'))
const BookAppointment = lazy(() => import('../Pages/BookAppointment'))
const BookAppointmentDetail = lazy(() => import('../Pages/BookAppointmentDetail'))
const AdminDashboard = lazy(() => import('../Pages/AdminDashboard'))
const ViewReports = lazy(() => import('../Pages/ViewReports'))
const MyReports = lazy(() => import('../Pages/MyReports'))
const Notifications = lazy(() => import('../Pages/Notifications'))
const BookCabin = lazy(() => import('../Pages/BookCabin'))
const UserProfile = lazy(() => import('../Pages/UserProfile'))
const CabinPayment = lazy(() => import('../Pages/CabinPayment'))
const AmbulancePayment = lazy(() => import('../Pages/AmbulancePayment'))
const AmbulanceBookingList = lazy(() => import('../Pages/AmbulanceBookingList'))
const PaymentMethod = lazy(() => import('../Pages/PaymentMethod'))

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif'
  }}>
    ⏳ Loading...
  </div>
)

function MainRoute() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/departments' element={<Departments />} />
        <Route path='/services' element={<Services />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route 
          path='/profile' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <UserProfile />
            </Suspense>
          } 
        />
        <Route 
          path='/reports' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ViewReports />
            </Suspense>
          } 
        />
        <Route 
          path='/myreports' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <MyReports />
            </Suspense>
          } 
        />
        <Route 
          path='/transactionhistory' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <TransactionHistory />
            </Suspense>
          } 
        />
        <Route 
          path='/ratingreview' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RatingReview />
            </Suspense>
          } 
        />
        <Route 
          path='/bookcabin' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BookCabin />
            </Suspense>
          } 
        />
        <Route 
          path='/book-appointment' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BookAppointment />
            </Suspense>
          } 
        />
        <Route 
          path='/appointment-detail' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BookAppointmentDetail />
            </Suspense>
          } 
        />
        <Route 
          path='/cabin-payment' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CabinPayment />
            </Suspense>
          } 
        />
        <Route 
          path='/ambulance-payment' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AmbulancePayment />
            </Suspense>
          } 
        />
        <Route 
          path='/ambulance-bookings' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AmbulanceBookingList />
            </Suspense>
          } 
        />
        <Route 
          path='/admin' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboard />
            </Suspense>
          } 
        />
        <Route 
          path='/notifications' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Notifications />
            </Suspense>
          } 
        />
        <Route 
          path='/payment-method' 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PaymentMethod />
            </Suspense>
          } 
        />
      </Routes>
    </>
  )
}

export default MainRoute
