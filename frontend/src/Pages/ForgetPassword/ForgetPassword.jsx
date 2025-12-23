import { useState, useRef, useEffect } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/ForgetPassword.css'
import { useNavigate } from 'react-router'
import sahayogLogo from '../../Assets/logo.png'
import toast from 'react-hot-toast'
import { authAPI, ApiError } from '../../utils/api'
import { validators } from '../../utils/validation'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function ForgetPassword() {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        navigate('/login')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [navigate])

  const validateEmail = () => {
    const emailError = validators.email(email)
    if (emailError) {
      setErrors({ email: emailError })
      return false
    }
    setErrors({})
    return true
  }

  const validateCode = () => {
    if (!resetCode.trim()) {
      setErrors({ resetCode: 'Reset code is required' })
      return false
    }
    setErrors({})
    return true
  }

  const validateResetPassword = () => {
    const newErrors = {}
    const passwordError = validators.password(newPassword)
    if (passwordError) newErrors.newPassword = passwordError
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRequestReset = async (e) => {
    e.preventDefault()
    if (!validateEmail()) return

    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setStep('verify')
      toast.success('Reset code sent to your email')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error('Failed to send reset email. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (!validateCode()) return

    setLoading(true)
    try {
      await authAPI.verifyResetCode(email, resetCode)
      setStep('reset')
      toast.success('Code verified! Now reset your password.')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error('Invalid reset code. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!validateResetPassword()) return

    setLoading(true)
    try {
      await authAPI.resetPassword(email, resetCode, newPassword)
      toast.success('Password reset successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error('Failed to reset password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className='title'>
          <p>Reset Your Password</p>
        </div>
        <div className='logo'>
          <img src={sahayogLogo} alt='Sahayog Logo' />
        </div>

        {step === 'email' && (
          <>
            <p className='subtitle'>
              Enter your email address and we'll send you a password reset code.
            </p>

            <CustomTextField
              label='Email Address'
              placeholder='Enter your registered email'
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({})
              }}
            />
            {errors.email && <p className='error-text'>{errors.email}</p>}

            <div className='reset-btn'>
              <button 
                type='submit' 
                onClick={handleRequestReset}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <p className='subtitle'>
              We have sent a reset code to <strong>{email}</strong>. Please check your email and enter the code below.
            </p>

            <CustomTextField
              label='Reset Code'
              placeholder='Enter the 6-digit code from your email'
              value={resetCode}
              onChange={(e) => {
                setResetCode(e.target.value)
                if (errors.resetCode) setErrors({})
              }}
            />
            {errors.resetCode && <p className='error-text'>{errors.resetCode}</p>}

            <div className='reset-btn'>
              <button 
                type='submit' 
                onClick={handleVerifyCode}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>

            <div className='back-login'>
              <span onClick={() => {
                setStep('email')
                setResetCode('')
                setErrors({})
              }}> Change Email</span>
            </div>
          </>
        )}

        {step === 'reset' && (
          <>
            <p className='subtitle'>
              Create a new password for your account.
            </p>

            <div className='password-wrapper'>
              <CustomTextField
                label='New Password'
                placeholder='Enter new password'
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (errors.newPassword) setErrors({ ...errors, newPassword: '' })
                }}
              />
              <span
                className='eye-icon'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.newPassword && <p className='error-text'>{errors.newPassword}</p>}

            <div className='password-wrapper'>
              <CustomTextField
                label='Confirm Password'
                placeholder='Re-enter your password'
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                }}
              />
              <span
                className='eye-icon'
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && <p className='error-text'>{errors.confirmPassword}</p>}

            <div className='reset-btn'>
              <button 
                type='submit' 
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </>
        )}

        <div className='back-login'>
          <span onClick={() => navigate('/login')}> Back to Login</span>
        </div>
      </form>
    </div>
  )
}

export default ForgetPassword
