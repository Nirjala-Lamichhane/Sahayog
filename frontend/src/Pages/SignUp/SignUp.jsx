import { useEffect, useRef, useState } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/Login.css'
import '../../Style/SignUp.css'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import sahayogLogo from '../../Assets/logo.png'
import healthcareIllustration from '../../Assets/healthcare-illustration.png'
import toast from 'react-hot-toast'
import { authAPI, ApiError, setAuthToken } from '../../utils/api'
import { validators } from '../../utils/validation'

function SignUp() {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    const nameError = validators.name(formData.name)
    if (nameError) newErrors.name = nameError
    const emailError = validators.email(formData.email)
    if (emailError) newErrors.email = emailError
    const passwordError = validators.password(formData.password)
    if (passwordError) newErrors.password = passwordError
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const data = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      setAuthToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Account created!')
      navigate('/dashboard')
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        navigate('/home')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [navigate])

  return (
    <div className='auth-container'>
      <div className='auth-left-panel'>
        <img src={healthcareIllustration} alt='Healthcare Illustration' className='auth-illustration' />
      </div>
      <div className='auth-right-panel'>
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className='title'>
            <p>Sign up to get started</p>
          </div>
          <div className='logo'>
            <img src={sahayogLogo} alt='Sahayog Logo' />
          </div>

          <CustomTextField
            label='Full Name'
            placeholder='Enter your name'
            value={formData.name}
            onChange={handleChange('name')}
          />
          {errors.name && <p className='error-text'>{errors.name}</p>}

          <CustomTextField
            label='Username/Email'
            placeholder='Enter Your Email Address'
            value={formData.email}
            onChange={handleChange('email')}
          />
          {errors.email && <p className='error-text'>{errors.email}</p>}

          <div className='password-wrapper'>
            <CustomTextField
              label='Password'
              placeholder='Enter Your Password'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
            />

            <span
              className='eye-icon'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className='error-text'>{errors.password}</p>}

          <div className='password-wrapper'>
            <CustomTextField
              label='Confirm Password'
              placeholder='Re-enter your password'
              type={showConfirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
            />
            <span
              className='eye-icon'
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && <p className='error-text'>{errors.confirmPassword}</p>}

          <div className='login-btn'>
            <button type='button' onClick={handleSignUp} disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>

          <div className='text'>
            <p>OR</p>
            <p>
              Already have an account ?
              <span onClick={() => navigate('/login')}> Login</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
