import CustomTextField from '../../Components/CustomTextField/Input'
import '../../Style/ForgetPassword.css'
import { useNavigate } from 'react-router'
import sahayogLogo from '../../Assets/logo.png'

function ForgetPassword() {
  const navigate = useNavigate()

  return (
    <>
      <div className='container'>
        <form className='forget-form'>
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
          />

          <div className='reset-btn'>
            <button type='button'>Send Reset Link</button>
          </div>

          <div className='back-login'>
            <span onClick={() => navigate('/login')}>← Back to Login</span>
          </div>
        </form>
      </div>
    </>
  )
}

export default ForgetPassword
