import { useState } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/Login.css'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import sahayogLogo from '../../Assets/logo.png'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      // Save token (for protected routes later)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/dashboard') // change route if needed
    } catch (error) {
      setError('Server error. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className='title'>
          <p>Log in to your account</p>
        </div>

        <div className='logo'>
          <img src={sahayogLogo} alt='Sahayog Logo' />
        </div>

        <CustomTextField
          label='Username / Email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className='password-wrapper'>
          <CustomTextField
            label='Password'
            placeholder='Enter your password'
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

        <div
          className='forget-password'
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </div>

        <div className='login-btn'>
          <button type='button' onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className='text'>
          <p>OR</p>
          <p>
            Don&apos;t have an account?
            <span onClick={() => navigate('/signup')}> Sign Up</span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
