import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
