import { useState } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/Login.css'
import sahayogLogo from '../../Assets/logo.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!email || !password) {
      setError('Please fill all fields')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Invalid email address')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    setError('')
    return true
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <form onSubmit={(e) => e.preventDefault()} className='login-form'>
        <div className='logo'>
          <img src={sahayogLogo} alt='Sahayog Logo' />
        </div>
        <div className='title'>Log in to your account</div>

        <CustomTextField
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your registered email'
        />

        <div className='password-wrapper'>
          <CustomTextField
            label='Password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
          />
          <span
            className='eye-icon'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className='error-text'>{error}</p>}

        <div
          className='forget-password'
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </div>

        <div className='login-btn'>
          <button
            type='button'
            onClick={handleLogin}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className='text'>
          <p>
            Don't have an account?
            <span onClick={() => navigate('/signup')}> Sign Up</span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
