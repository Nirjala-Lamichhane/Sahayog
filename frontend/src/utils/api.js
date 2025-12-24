import axios from 'axios'

/* =========================
   Custom API Error
========================= */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

/* =========================
   Normalize IDs (_id <-> id)
========================= */
const normalizeIds = (data) => {
  if (!data) return data

  if (Array.isArray(data)) {
    return data.map(item => normalizeIds(item))
  }

  if (typeof data === 'object') {
    const obj = { ...data }

    if (obj.id && !obj._id) obj._id = obj.id
    if (obj._id && !obj.id) obj.id = obj._id

    Object.keys(obj).forEach(key => {
      if (
        obj[key] &&
        typeof obj[key] === 'object' &&
        key !== 'password' &&
        key !== 'token'
      ) {
        obj[key] = normalizeIds(obj[key])
      }
    })

    return obj
  }

  return data
}

/* =========================
   Axios Instance
========================= */
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

/* =========================
   Attach JWT Automatically
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/* =========================
   Normalize Response IDs
========================= */
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = normalizeIds(response.data)
      if (response.data.data) {
        response.data.data = normalizeIds(response.data.data)
      }
    }
    return response
  },
  (error) => Promise.reject(error)
)

/* =========================
   AUTH API
========================= */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common.Authorization
    localStorage.removeItem('token')
  }
}

export const authAPI = {
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Login failed',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  signup: async (payload) => {
    try {
      const res = await api.post('/auth/signup', payload)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Signup failed',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Password reset failed',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  verifyResetCode: async (email, code) => {
    try {
      const res = await api.post('/auth/verify-reset-code', { email, code })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Code verification failed',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  resetPassword: async (email, code, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', { email, code, newPassword })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Password reset failed',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },
}

/* =========================
   DASHBOARD / USER API
========================= */
export const dashboardAPI = {
  getDashboard: async () => {
    try {
      const res = await api.get('/dashboard/data')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load dashboard',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 🏥 Appointments */
  bookAppointment: async (payload) => {
    try {
      const res = await api.post('/appointments/book', payload)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to book appointment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getAppointments: async () => {
    try {
      const res = await api.get('/appointments/my-appointments')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load appointments',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getAppointmentById: async (appointmentId) => {
    try {
      const res = await api.get(`/appointments/${appointmentId}`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load appointment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  updateAppointment: async (appointmentId, updates) => {
    try {
      const res = await api.put(`/appointments/${appointmentId}`, updates)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to update appointment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      const res = await api.delete(`/appointments/${appointmentId}`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to cancel appointment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 📄 Reports */
  getReports: async () => {
    try {
      const res = await api.get('/dashboard/reports')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load reports',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 🔔 Reminders */
  getReminders: async () => {
    try {
      const res = await api.get('/dashboard/reminders')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load reminders',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 🚑 Ambulance */
  requestAmbulance: async (payload) => {
    try {
      const res = await api.post('/ambulance/request', payload)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to request ambulance'
      const status = err.response?.status || 0
      if (status === 401) throw new ApiError('Please login to request ambulance', 401, err.response?.data)
      if (status === 403) throw new ApiError('Not authorized to request ambulance', 403, err.response?.data)
      throw new ApiError(errorMsg, status, err.response?.data || null)
    }
  },

  getUserAmbulanceRequests: async () => {
    try {
      const res = await api.get('/ambulance/my-requests')
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to load ambulance requests'
      const status = err.response?.status || 0
      if (status === 401) throw new ApiError('Please login to view ambulance requests', 401, err.response?.data)
      if (status === 403) throw new ApiError('Not authorized to view ambulance requests', 403, err.response?.data)
      throw new ApiError(errorMsg, status, err.response?.data || null)
    }
  },

  /* 🛏️ Cabin */
  bookCabin: async (cabinData) => {
    try {
      const res = await api.post('/dashboard/book-cabin', cabinData)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to book cabin',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getCabinBookings: async () => {
    try {
      const res = await api.get('/dashboard/cabin-bookings')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load cabin bookings',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  checkCabinAvailability: async (cabinType, checkInDate, checkOutDate) => {
    try {
      const res = await api.post('/dashboard/check-cabin-availability', {
        cabinType,
        checkInDate,
        checkOutDate,
      })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to check availability',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* ⭐ Ratings */
  submitRating: async (payload) => {
    try {
      const res = await api.post('/dashboard/submit-rating', payload)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to submit rating',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getUserApprovedRatings: async () => {
    try {
      const res = await api.get('/dashboard/approved-ratings')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load approved ratings',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },
}

/* =========================
   ADMIN API
========================= */
export const adminAPI = {
  /* � Appointments */
  getAppointments: async () => {
    try {
      const res = await api.get('/admin/appointments')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load appointments',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  confirmAppointment: async (appointmentId) => {
    try {
      const res = await api.put(`/admin/appointments/${appointmentId}/confirm`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to confirm appointment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  updateAppointment: async (appointmentId, updates) => {
    try {
      const res = await api.put(`/admin/appointments/${appointmentId}`, updates)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to update appointment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  deleteAppointment: async (appointmentId) => {
    try {
      const res = await api.delete(`/admin/appointments/${appointmentId}`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to delete appointment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 📄 Reports */
  getReports: async () => {
    try {
      const res = await api.get('/admin/reports')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load reports',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  createReport: async (payload) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
      const res = await api.post('/admin/reports', payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to create report',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  updateReport: async (reportId, updates) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && updates instanceof FormData
      const res = await api.put(`/admin/reports/${reportId}`, updates, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to update report',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  deleteReport: async (reportId) => {
    try {
      const res = await api.delete(`/admin/reports/${reportId}`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to delete report',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 👥 Users */
  getUsers: async () => {
    try {
      const res = await api.get('/admin/users')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load users',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  updateUser: async (userId, updates) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, updates)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to update user',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await api.delete(`/admin/users/${userId}`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to delete user',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 🚑 Ambulance - Admin/Dashboard */
  getAmbulanceRequests: async () => {
    try {
      const res = await api.get('/ambulance')
      return res.data
    } catch (err) {
      const status = err.response?.status || 0
      if (status === 401) return { success: false, data: [], message: 'Please login' }
      if (status === 403) return { success: false, data: [], message: 'Admin access required' }
      console.log('Failed to load ambulance requests:', err.response?.data?.message || err.message)
      return { success: false, data: [] }
    }
  },

  getPendingAmbulanceRequests: async () => {
    try {
      const res = await api.get('/ambulance/pending')
      return res.data
    } catch (err) {
      const status = err.response?.status || 0
      if (status === 401) return { success: false, data: [], message: 'Please login' }
      if (status === 403) return { success: false, data: [], message: 'Admin access required' }
      console.log('Failed to load pending ambulance requests:', err.response?.data?.message || err.message)
      return { success: false, data: [] }
    }
  },

  approveAmbulanceRequest: async (id) => {
    try {
      const res = await api.put(`/ambulance/${id}/approve`)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to approve ambulance request'
      const status = err.response?.status || 0
      if (status === 401) throw new ApiError('Please login to approve requests', 401, err.response?.data)
      if (status === 403) throw new ApiError('Admin access required', 403, err.response?.data)
      if (status === 404) throw new ApiError('Ambulance request not found', 404, err.response?.data)
      throw new ApiError(errorMsg, status, err.response?.data || null)
    }
  },

  rejectAmbulanceRequest: async (id) => {
    try {
      const res = await api.put(`/ambulance/${id}/reject`)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reject ambulance request'
      const status = err.response?.status || 0
      if (status === 401) throw new ApiError('Please login to reject requests', 401, err.response?.data)
      if (status === 403) throw new ApiError('Admin access required', 403, err.response?.data)
      if (status === 404) throw new ApiError('Ambulance request not found', 404, err.response?.data)
      throw new ApiError(errorMsg, status, err.response?.data || null)
    }
  },

  completeAmbulanceRequest: async (id) => {
    try {
      const res = await api.put(`/ambulance/${id}/complete`)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to complete ambulance request'
      const status = err.response?.status || 0
      if (status === 401) throw new ApiError('Please login to complete requests', 401, err.response?.data)
      if (status === 403) throw new ApiError('Admin access required', 403, err.response?.data)
      if (status === 404) throw new ApiError('Ambulance request not found', 404, err.response?.data)
      throw new ApiError(errorMsg, status, err.response?.data || null)
    }
  },

  /* 🛏️ Cabin Bookings */
  getCabinBookings: async () => {
    try {
      const res = await api.get('/admin/cabin-bookings')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load cabin bookings',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getPendingCabinBookings: async () => {
    try {
      const res = await api.get('/admin/cabin-bookings/pending')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load pending cabin bookings',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  approveCabinBooking: async (bookingId) => {
    try {
      const res = await api.put(`/admin/cabin-bookings/${bookingId}/approve`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to approve cabin booking',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  rejectCabinBooking: async (bookingId) => {
    try {
      const res = await api.put(`/admin/cabin-bookings/${bookingId}/reject`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to reject cabin booking',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* ⭐ Ratings */
  getApprovedRatings: async () => {
    try {
      const res = await api.get('/admin/ratings/approved')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load approved ratings',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getPendingRatings: async () => {
    try {
      const res = await api.get('/admin/ratings/pending')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load pending ratings',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  approveRating: async (id) => {
    try {
      const res = await api.put(`/admin/ratings/${id}/approve`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to approve rating',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  rejectRating: async (id) => {
    try {
      const res = await api.put(`/admin/ratings/${id}/reject`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to reject rating',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  /* 💰 Transactions */
  getAllTransactions: async () => {
    try {
      const res = await api.get('/admin/transactions')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load transactions',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getPendingTransactions: async () => {
    try {
      const res = await api.get('/admin/transactions/pending')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load pending transactions',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  approveTransaction: async (transactionId) => {
    try {
      const res = await api.put(`/admin/transactions/${transactionId}/approve`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to approve transaction',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  completeTransaction: async (transactionId) => {
    try {
      const res = await api.put(`/admin/transactions/${transactionId}/complete`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to complete transaction',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },
}

/* =========================
   PAYMENT API
========================= */
export const paymentAPI = {
  validatePaymentAmount: async (type, checkInDate, checkOutDate, distance) => {
    try {
      const res = await api.post('/payment/validate', {
        type,
        checkInDate,
        checkOutDate,
        distance,
      })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to validate amount',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  processCabinPayment: async (cabinBookingId, amount, paymentMethod) => {
    try {
      const res = await api.post('/payment/cabin', {
        cabinBookingId,
        amount,
        paymentMethod,
      })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to process payment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  processAmbulancePayment: async (ambulanceRequestId, amount, paymentMethod, distance) => {
    try {
      const res = await api.post('/payment/ambulance', {
        ambulanceRequestId,
        amount,
        paymentMethod,
        distance,
      })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to process payment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  processAppointmentPayment: async (appointmentId, amount, paymentMethod, service) => {
    try {
      const res = await api.post('/payment/appointment', {
        appointmentId,
        amount,
        paymentMethod,
        service,
      })
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to process payment',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getPaymentHistory: async () => {
    try {
      const res = await api.get('/payment/history')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load payment history',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },
}

/* =========================
   NOTIFICATION API
========================= */
export const notificationAPI = {
  getNotifications: async () => {
    try {
      const res = await api.get('/notifications')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load notifications',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  getUnreadCount: async () => {
    try {
      const res = await api.get('/notifications/unread')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to get unread count',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const res = await api.put(`/notifications/${notificationId}/read`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to mark as read',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  markAllAsRead: async () => {
    try {
      const res = await api.put('/notifications/read-all')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to mark all as read',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const res = await api.delete(`/notifications/${notificationId}`)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to delete notification',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  deleteAllNotifications: async () => {
    try {
      const res = await api.delete('/notifications')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to delete notifications',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },
}

/* =========================
   USER API
========================= */
export const userAPI = {
  getUserProfile: async () => {
    try {
      const res = await api.get('/user/profile')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to load profile',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const res = await api.put('/user/profile', profileData)
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to update profile',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },

  deleteUserProfile: async () => {
    try {
      const res = await api.delete('/user/profile')
      return res.data
    } catch (err) {
      throw new ApiError(
        err.response?.data?.message || 'Failed to delete profile',
        err.response?.status || 0,
        err.response?.data || null
      )
    }
  },
}

export default api
