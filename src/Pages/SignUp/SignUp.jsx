import { useState, useRef } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/SignUp.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import sahayogLogo from '../../Assets/logo.png'
import googleLogo from '../../Assets/google_logo.webp'
import { GoogleLogin } from '@react-oauth/google'

function SignUp() {
  const navigate = useNavigate()
  const googleBtnRef = useRef(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ================= EMAIL SIGNUP =================
  const handleSignUp = async () => {
    if (!firstName || !lastName || !contact || !email || !password) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await api.post('/api/auth/signup', {
        firstName,
        lastName,
        contact,
        email,
        password,
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  // ================= GOOGLE SIGNUP =================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/api/auth/google', {
        token: credentialResponse.credential,
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setError('Google signup failed')
    }
  }

  return (
    <div className='container'>
      <form className='signup-form' onSubmit={(e) => e.preventDefault()}>
        <div className='title'>Sign up to get started</div>

        <div className='logo'>
          <img src={sahayogLogo} alt='Sahayog Logo' />
        </div>

        <CustomTextField
          label='First Name'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <CustomTextField
          label='Last Name'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <CustomTextField
          label='Contact Number'
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        <CustomTextField
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className='password-wrapper'>
          <CustomTextField
            label='Password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className='eye-icon'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className='error-text'>{error}</p>}

        <button
          type='button'
          onClick={handleSignUp}
          disabled={loading}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {/* ================= GOOGLE SIGNUP ================= */}
        <div className='google-logo'>
          <p>OR</p>

          <div style={{ display: 'none' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              ref={googleBtnRef}
            />
          </div>

          <button
            type='button'
            className='google-img'
            onClick={() => {
              document.querySelector('div[role=button]')?.click()
            }}
          >
            <img src={googleLogo} alt='Google' />
            Sign up with Google
          </button>
        </div>

        <p className='text'>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  )
}

export default SignUp
