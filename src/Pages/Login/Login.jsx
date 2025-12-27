import { useState } from 'react'
import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/Login.css'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import sahayogLogo from '../../Assets/logo.png'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className='container'>
        <form>
          <div className='title'>
            <p>Log in to your account</p>
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

          <div
            className='forget-password'
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </div>

          <div className='login-btn'>
            <button type='button'>Login</button>
          </div>

          <div className='text'>
            <p>OR</p>
            <p>
              Don't have an account ?
              <span onClick={() => navigate('/signup')}> SignUp</span>
            </p>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login
