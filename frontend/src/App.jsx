import MainRoute from './Router/MainRoute'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { setAuthToken } from './utils/api'

function App() {
  useEffect(() => {
    // Check for existing token on app load and restore login session
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      // Restore authentication from localStorage
      setAuthToken(token)
      console.log(' User session restored from localStorage')
    }
  }, [])

  return (
    <BrowserRouter>
      <MainRoute />
      <Toaster position='top-right' />
    </BrowserRouter>
  )
}

export default App
