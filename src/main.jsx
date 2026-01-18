import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='336644738936-p9gfobke4pg9esg6vecokquvchk03ofl.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
