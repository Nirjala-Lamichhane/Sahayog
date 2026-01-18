import { useState } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/ForgetPassword.css'
import { useNavigate } from 'react-router'
import sahayogLogo from '../../Assets/logo.png'
import api from '../../api/axios'

function ForgetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await api.post('/api/auth/forgot-password', { email })
      setMessage(res.data.message)
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message)
      } else {
        setError('Server error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <form className='forget-form' onSubmit={(e) => e.preventDefault()}>
        <div className='title'>
          <p>Forgot Password</p>
        </div>

        <div className='logo'>
          <img src={sahayogLogo} alt='Sahayog Logo' />
        </div>

        <p className='subtitle'>
          Enter your email address and we’ll send you a password reset link.
        </p>

        <CustomTextField
          label='Email Address'
          placeholder='Enter your registered email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className='error-text'>{error}</p>}
        {message && <p className='success-text'>{message}</p>}

        <div className='reset-btn'>
          <button
            type='button'
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <div className='back-login'>
          <span onClick={() => navigate('/login')}>← Back to Login</span>
        </div>
      </form>
    </div>
  )
}

export default ForgetPassword
