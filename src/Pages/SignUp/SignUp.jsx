import { useState } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/Login.css'
import '../../Style/SignUp.css'
import googleLogo from '../../Assets/google_logo.webp'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import sahayogLogo from '../../Assets/logo.png'

function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className='container'>
        <form>
          <div className='title'>
            <p>Sign up to get started</p>
          </div>
          <div className='logo'>
            <img src={sahayogLogo} alt='Sahayog Logo' />
          </div>

          <CustomTextField
            label='Username/Email'
            placeholder='Enter Your Email Address'
          />

          <div className='password-wrapper'>
            <CustomTextField
              label='Password'
              placeholder='Enter Your Password'
              type={showPassword ? 'text' : 'password'}
            />

            <span
              className='eye-icon'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className='google-logo'>
            <p>OR</p>

            <div className='google-img'>
              <p>
                Sign up with
                <img src={googleLogo} alt='google logo' />
              </p>
            </div>
          </div>

          <div className='login-btn'>
            <button type='button'>Sign up</button>
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
    </>
  )
}

export default SignUp
