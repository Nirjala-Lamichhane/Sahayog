import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Style/Dashboard.css'
import '../Style/ViewReports.css'
import toast from 'react-hot-toast'
import { dashboardAPI } from '../utils/api'

function ViewReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const fetchReports = async () => {
    try {
      const res = await dashboardAPI.getReports()
      setReports(res.data || [])
    } catch (error) {
      toast.error(error.message || 'Could not load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    fetchReports()
  }, [token, navigate])

  const handleDownload = (report) => {
    const content = `${report.department}\nVisit: ${report.visitDate}\nPatient: ${report.patientName}\n\nFindings:\n${report.findings}\n\nPrescription:\n${report.prescription || 'N/A'}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `report-${report.department}-${report.visitDate}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Report downloaded')
  }

  const handlePrint = (report) => {
    const printContent = `
      <h2>${report.department}</h2>
      <p>Date: ${report.visitDate}</p>
      <p>Patient: ${report.patientName}</p>
      <h3>Findings</h3>
      <p>${report.findings}</p>
      <h3>Prescription</h3>
      <p>${report.prescription || 'N/A'}</p>
    `
    const printWindow = window.open('', '', 'height=500,width=700')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return <div className="dashboard-loading">Loading reports...</div>
  }

  return (
    <main className="dashboard" style={{
      background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.95), rgba(254, 252, 232, 0.95)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'none' }}>
          ← Back to Dashboard
        </button>
      </div>
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <div className="profile-avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <h3 className="profile-name">{user.name || 'User'}</h3>
            <p className="profile-email">{user.email}</p>
          </div>

          <nav className="sidebar-menu">
            <button className="menu-item" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="menu-item" onClick={() => navigate('/bookcabin')}>Book Appointment</button>
            <button className="menu-item active">Reports</button>
            <button className="menu-item" onClick={() => navigate('/transactionhistory')}>Transactions</button>
            <button className="menu-item" onClick={() => navigate('/ratingreview')}>Ratings & Reviews</button>
            <hr />
            <button
              className="menu-item logout-btn"
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/')
              }}
            >
              Log Out
            </button>
          </nav>
        </aside>

        <div className="dashboard-main">
          <div className="welcome-section">
            <h1>Your Medical Reports</h1>
            <p>View, download, and print the reports added by the admin team.</p>
          </div>

          {reports.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
              <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No reports available</p>
              <p>Reports from your visits will appear here as soon as the admin adds them.</p>
              <button className="card-btn" style={{ marginTop: '20px' }} onClick={() => navigate('/bookcabin')}>
                Book an Appointment
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {reports.map((report) => (
                <div key={report._id} className="card" style={{ padding: '24px', borderLeft: '4px solid #0d9488' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ margin: '0 0 4px', color: '#1f2937' }}>{report.department}</h2>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                        {new Date(report.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      {report.appointmentId && (
                        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>Appointment #{report.appointmentId}</p>
                      )}
                    </div>
                    <span style={{ background: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                      AVAILABLE
                    </span>
                  </div>

                  {report.imageUrl && (
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ margin: '0 0 8px', color: '#374151', fontSize: '16px' }}>Medical History Image</h3>
                      <img
                        src={`http://127.0.0.1:5000${report.imageUrl}`}
                        alt="Report"
                        style={{ width: '100%', maxHeight: 360, objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px', color: '#374151', fontSize: '16px' }}>Findings</h3>
                    <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6, padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      {report.findings}
                    </p>
                  </div>

                  {report.prescription && (
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ margin: '0 0 8px', color: '#374151', fontSize: '16px' }}>Prescription & Recommendations</h3>
                      <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6, padding: '12px', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                        {report.prescription}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleDownload(report)}
                      style={{ padding: '10px 16px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handlePrint(report)}
                      style={{ padding: '10px 16px', background: '#f3e8ff', color: '#6b21a8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                    >
                      Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ViewReports
