import { useEffect, useRef, useState } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/Login.css'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import sahayogLogo from '../../Assets/logo.png'
import healthcareIllustration from '../../Assets/healthcare-illustration.png'
import toast from 'react-hot-toast'
import { authAPI, ApiError, setAuthToken } from '../../utils/api'
import { validators } from '../../utils/validation'

function Login() {
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    const emailError = validators.email(email)
    if (emailError) newErrors.email = emailError
    const passwordError = validators.password(password)
    if (passwordError) newErrors.password = passwordError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        navigate('/home')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [navigate])

  const handleLogin = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const data = await authAPI.login(email, password)
      setAuthToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Logged in successfully')
      const destination = data.user?.role === 'admin' ? '/admin' : '/dashboard'
      navigate(destination)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error('Server error. Try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-left-panel'>
        <img src={healthcareIllustration} alt='Healthcare Illustration' className='auth-illustration' />
      </div>
      <div className='auth-right-panel'>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}
        >
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
          {errors.email && <p className='error-text'>{errors.email}</p>}

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

          {errors.password && <p className='error-text'>{errors.password}</p>}

          <div
            className='forget-password'
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </div>

          <div className='login-btn'>
            <button type='submit' disabled={loading}>
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
    </div>
  )
}

export default Login
