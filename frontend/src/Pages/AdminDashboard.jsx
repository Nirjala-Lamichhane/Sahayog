import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Style/Dashboard.css'
import toast from 'react-hot-toast'
import { adminAPI } from '../utils/api'
import AdminReports from './AdminReports'

function AdminDashboard() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [ambulanceRequests, setAmbulanceRequests] = useState([])
  const [ratings, setRatings] = useState([])
  const [transactions, setTransactions] = useState([])
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [cabinBookings, setCabinBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!token || user.role !== 'admin') {
      toast.error('Admin access only')
      navigate('/login')
      return
    }

    loadAllData()
  }, [navigate])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [apptRes, ambulanceRes, ratingsRes, transactionsRes, userRes, reportRes, cabinRes] = await Promise.all([
        adminAPI.getAppointments().catch(err => { console.error('Appointments error:', err); return { data: [] } }),
        adminAPI.getAmbulanceRequests().catch(err => { console.error('Ambulance error:', err); return { data: [] } }),
        adminAPI.getPendingRatings().catch(err => { console.error('Ratings error:', err); return { data: [] } }),
        adminAPI.getAllTransactions().catch(err => { console.error('Transactions error:', err); return { data: [] } }),
        adminAPI.getUsers().catch(err => { console.error('Users error:', err); return { data: [] } }),
        adminAPI.getReports().catch(err => { console.error('Reports error:', err); return { data: [] } }),
        adminAPI.getCabinBookings().catch(err => { console.error('Cabin error:', err); return { data: [] } }),
      ])

      console.log('Admin Data Loaded:', { 
        appointments: apptRes.data, 
        ambulance: ambulanceRes.data,
        ratings: ratingsRes.data,
        transactions: transactionsRes.data,
        users: userRes.data,
        reports: reportRes.data,
        cabins: cabinRes.data
      })
      
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : [])
      
      // Handle ambulance data properly
      const ambulanceData = ambulanceRes.data || []
      console.log('Setting ambulance requests:', ambulanceData, 'Is array:', Array.isArray(ambulanceData))
      setAmbulanceRequests(Array.isArray(ambulanceData) ? ambulanceData : [])
      
      setRatings(Array.isArray(ratingsRes.data) ? ratingsRes.data : [])
      setTransactions(Array.isArray(transactionsRes.data) ? transactionsRes.data : [])
      
      const usersData = Array.isArray(userRes.data) ? userRes.data : []
      console.log('Loaded users:', usersData)
      console.log('Patients (non-admin):', usersData.filter(u => u.role !== 'admin'))
      setUsers(usersData)
      
      setReports(Array.isArray(reportRes.data) ? reportRes.data : [])
      setCabinBookings(Array.isArray(cabinRes.data) ? cabinRes.data : [])
    } catch (err) {
      console.error('Load all data error:', err)
      toast.error(err.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleConfirmAppointment = async (id) => {
    try {
      const res = await adminAPI.confirmAppointment(id)
      setAppointments((prev) => prev.map((a) => (a._id === res.data._id ? res.data : a)))
      toast.success('Appointment confirmed')
    } catch (err) {
      toast.error(err.message || 'Failed to confirm')
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment?')) return
    try {
      await adminAPI.deleteAppointment(id)
      setAppointments((prev) => prev.filter((a) => a._id !== id))
      toast.success('Deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const handleApproveAmbulance = async (id) => {
    try {
      const res = await adminAPI.approveAmbulanceRequest(id)
      setAmbulanceRequests((prev) => prev.map((r) => (r._id === res.data._id ? res.data : r)))
      toast.success('Ambulance request approved')
    } catch (err) {
      toast.error(err.message || 'Failed to approve')
    }
  }

  const handleRejectAmbulance = async (id) => {
    try {
      const res = await adminAPI.rejectAmbulanceRequest(id)
      setAmbulanceRequests((prev) => prev.map((r) => (r._id === res.data._id ? res.data : r)))
      toast.success('Ambulance request rejected')
    } catch (err) {
      toast.error(err.message || 'Failed to reject')
    }
  }

  const handleApproveRating = async (id) => {
    try {
      const res = await adminAPI.approveRating(id)
      setRatings((prev) => prev.filter((r) => r._id !== id))
      toast.success('Rating approved')
    } catch (err) {
      toast.error(err.message || 'Failed to approve')
    }
  }

  const handleRejectRating = async (id) => {
    try {
      await adminAPI.rejectRating(id)
      setRatings((prev) => prev.filter((r) => r._id !== id))
      toast.success('Rating rejected')
    } catch (err) {
      toast.error(err.message || 'Failed to reject')
    }
  }

  const handleApproveCabin = async (id) => {
    try {
      const res = await adminAPI.approveCabinBooking(id)
      setCabinBookings((prev) => prev.map((b) => (b._id === id || b.id === id ? res.data : b)))
      toast.success('Cabin booking approved')
    } catch (err) {
      toast.error(err.message || 'Failed to approve cabin booking')
    }
  }

  const handleRejectCabin = async (id) => {
    try {
      const res = await adminAPI.rejectCabinBooking(id)
      setCabinBookings((prev) => prev.map((b) => (b._id === id || b.id === id ? res.data : b)))
      toast.success('Cabin booking rejected')
    } catch (err) {
      toast.error(err.message || 'Failed to reject cabin booking')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await adminAPI.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u._id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  if (loading) return <div className="dashboard-loading">Loading...</div>

  const pendingAppointments = appointments.filter((a) => (a.status || 'pending') === 'pending')
  const confirmedAppointments = appointments.filter((a) => ['confirmed', 'completed'].includes(a.status))
  const pendingAmbulance = ambulanceRequests.filter((r) => r.status === 'pending')
  const approvedAmbulance = ambulanceRequests.filter((r) => r.status === 'approved')
  
  // Debug logging for ambulance data
  console.log('Ambulance requests state:', ambulanceRequests)
  console.log('Pending ambulance (filtered):', pendingAmbulance)
  console.log('Approved ambulance (filtered):', approvedAmbulance)
  const pendingTransactions = transactions.filter((t) => t.status === 'pending')
  const pendingCabins = cabinBookings.filter((b) => b.status === 'pending')
  const approvedCabins = cabinBookings.filter((b) => b.status === 'approved')

  return (
    <main className="dashboard">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <div className="profile-avatar">A</div>
            <h3 className="profile-name">Admin</h3>
            <p className="profile-email">admin@gmail.com</p>
          </div>
          <nav className="sidebar-menu">
            <button className={activeTab === 'appointments' ? 'menu-item active' : 'menu-item'} onClick={() => setActiveTab('appointments')}>
              Appointments {pendingAppointments.length > 0 && <span className="badge">{pendingAppointments.length}</span>}
            </button>
            <button className={activeTab === 'ambulance' ? 'menu-item active' : 'menu-item'} onClick={() => setActiveTab('ambulance')}>
              Ambulance {pendingAmbulance.length > 0 && <span className="badge">{pendingAmbulance.length}</span>}
            </button>
            <button className={activeTab === 'ratings' ? 'menu-item active' : 'menu-item'} onClick={() => setActiveTab('ratings')}>
              Reviews {ratings.length > 0 && <span className="badge">{ratings.length}</span>}
            </button>
            <button className={activeTab === 'transactions' ? 'menu-item active' : 'menu-item'} onClick={() => setActiveTab('transactions')}>
              Transactions {pendingTransactions.length > 0 && <span className="badge">{pendingTransactions.length}</span>}
            </button>
            <button className={activeTab === 'users' ? 'menu-item active' : 'menu-item'} onClick={() => setActiveTab('users')}>
              Users ({users.filter(u => u.role !== 'admin').length})
            </button>
            <button className={activeTab === 'reports' ? 'menu-item active' : 'menu-item'} onClick={() => setActiveTab('reports')}>
              Reports
            </button>
            <button className={activeTab === 'cabins' ? 'menu-item active' : 'menu-item'} onClick={() => setActiveTab('cabins')}>
              Cabins {pendingCabins.length > 0 && <span className="badge">{pendingCabins.length}</span>}
            </button>
            <hr />
            <button className="menu-item logout-btn" onClick={handleLogout}>Log Out</button>
          </nav>
        </aside>

        <div className="dashboard-main">
          <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Welcome, Admin</h1>
              <p>Manage appointments, ambulance requests, reviews, and transactions.</p>
            </div>
          </div>

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <>
              <div className="card">
                <div className="card-header">
                  <h2>Pending Appointments ({pendingAppointments.length})</h2>
                </div>
                {pendingAppointments.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No pending appointments</div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Age</th>
                          <th>Contact</th>
                          <th>Department</th>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAppointments.map((a) => (
                          <tr key={a._id}>
                            <td>{a.fullName}</td>
                            <td>{a.age}</td>
                            <td>{a.contact}</td>
                            <td>{a.department}</td>
                            <td>{a.doctor}</td>
                            <td>{a.preferredDate}</td>
                            <td>{a.preferredTime}</td>
                            <td style={{ display: 'flex', gap: '8px' }}>
                              <button className="primary-btn" onClick={() => handleConfirmAppointment(a._id)}>Confirm</button>
                              <button className="danger-btn" onClick={() => handleDeleteAppointment(a._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                  <h2>Confirmed Appointments ({confirmedAppointments.length})</h2>
                </div>
                {confirmedAppointments.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No confirmed appointments</div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Department</th>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {confirmedAppointments.map((a) => (
                          <tr key={a._id}>
                            <td>{a.fullName}</td>
                            <td>{a.department}</td>
                            <td>{a.doctor}</td>
                            <td>{a.preferredDate}</td>
                            <td>{a.preferredTime}</td>
                            <td style={{ color: '#10b981', fontWeight: 700 }}>{(a.status || 'confirmed').toUpperCase()}</td>
                            <td>
                              <button className="danger-btn" onClick={() => handleDeleteAppointment(a._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* AMBULANCE TAB */}
          {activeTab === 'ambulance' && (
            <>
              <div className="card" style={{ minHeight: 'auto' }}>
                <div className="card-header">
                  <h2>Pending Ambulance Requests ({pendingAmbulance.length})</h2>
                </div>
                {pendingAmbulance.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No pending requests</div>
                ) : (
                  <div className="table-responsive" style={{ minHeight: '100px', display: 'block', overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <table className="data-table" style={{ tableLayout: 'fixed', minWidth: '100%', width: '100%' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '12%' }}>Name</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '15%' }}>Email</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '15%' }}>Location</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '20%' }}>Notes</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '18%' }}>Requested Time</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '20%' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAmbulance.map((r, idx) => (
                          <tr key={r._id || idx} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: idx % 2 === 0 ? '#fafafa' : '#ffffff' }}>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.name || 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.email || 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.location || 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.notes || 'None'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.requestedAt ? new Date(r.requestedAt).toLocaleString() : 'N/A'}</td>
                            <td style={{ padding: '12px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button className="primary-btn" onClick={() => handleApproveAmbulance(r._id)} style={{ fontSize: '12px', padding: '6px 12px' }}>Approve</button>
                              <button className="danger-btn" onClick={() => handleRejectAmbulance(r._id)} style={{ fontSize: '12px', padding: '6px 12px' }}>Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card" style={{ marginTop: '24px', minHeight: 'auto' }}>
                <div className="card-header">
                  <h2>Approved Ambulance Requests ({approvedAmbulance.length})</h2>
                </div>
                {approvedAmbulance.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No approved requests</div>
                ) : (
                  <div className="table-responsive" style={{ minHeight: '100px', display: 'block', overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <table className="data-table" style={{ tableLayout: 'fixed', minWidth: '100%', width: '100%' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '12%' }}>Name</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '15%' }}>Email</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '15%' }}>Location</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '18%' }}>Requested Time</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '18%' }}>Approved Time</th>
                          <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151', width: '12%' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedAmbulance.map((r, idx) => (
                          <tr key={r._id || idx} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: idx % 2 === 0 ? '#fafafa' : '#ffffff' }}>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.name || 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.email || 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.location || 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.requestedAt ? new Date(r.requestedAt).toLocaleString() : 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{r.approvedAt ? new Date(r.approvedAt).toLocaleString() : 'N/A'}</td>
                            <td style={{ padding: '12px 12px', fontSize: '13px' }}>
                              <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Approved</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* RATINGS TAB */}
          {activeTab === 'ratings' && (
            <div className="card">
              <div className="card-header">
                <h2>Pending Reviews ({ratings.length})</h2>
              </div>
              {ratings.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No pending reviews</div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratings.map((r) => (
                        <tr key={r._id}>
                          <td>{r.userName}</td>
                          <td>{'★'.repeat(r.rating)}</td>
                          <td>{r.comment}</td>
                          <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                          <td style={{ display: 'flex', gap: '8px' }}>
                            <button className="primary-btn" onClick={() => handleApproveRating(r._id)}>Approve</button>
                            <button className="danger-btn" onClick={() => handleRejectRating(r._id)}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="card">
              <div className="card-header">
                <h2>All Transactions ({transactions.length})</h2>
              </div>
              {transactions.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No transactions</div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t._id}>
                          <td>{t.userName || t.user?.name || 'N/A'}</td>
                          <td>{t.type || t.bookingType || 'N/A'}</td>
                          <td>₹{t.amount}</td>
                          <td>{t.description || `Payment for ${t.bookingType || 'service'}`}</td>
                          <td style={{ color: t.status === 'paid' || t.status === 'completed' ? '#10b981' : t.status === 'pending' ? '#f59e0b' : '#6b7280', fontWeight: 700 }}>
                            {(t.status || 'pending').toUpperCase()}
                          </td>
                          <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="card">
              <div className="card-header">
                <h2>All Users ({users.length})</h2>
              </div>
              {users.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No users</div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td style={{ color: u.role === 'admin' ? '#f59e0b' : '#6b7280', fontWeight: 700 }}>{u.role.toUpperCase()}</td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            {u.role !== 'admin' && (
                              <button className="danger-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <AdminReports 
              reports={reports} 
              setReports={setReports} 
              users={users} 
              appointments={appointments} 
            />
          )}

          {/* CABINS TAB */}
          {activeTab === 'cabins' && (
            <>
              <div className="card">
                <div className="card-header">
                  <h2>Pending Cabin Bookings ({pendingCabins.length})</h2>
                </div>
                {pendingCabins.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No pending cabin bookings</div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Cabin</th>
                          <th>Attendants</th>
                          <th>Check-In</th>
                          <th>Check-Out</th>
                          <th>Reason</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingCabins.map((b) => (
                          <tr key={b._id || b.id}>
                            <td>{b.fullName}</td>
                            <td>{b.cabinType}</td>
                            <td>{b.numberOfAttendants}</td>
                            <td>{b.checkInDate}</td>
                            <td>{b.checkOutDate}</td>
                            <td>{b.reasonForStay || 'N/A'}</td>
                            <td style={{ display: 'flex', gap: '8px' }}>
                              <button className="primary-btn" onClick={() => handleApproveCabin(b._id || b.id)}>Approve</button>
                              <button className="danger-btn" onClick={() => handleRejectCabin(b._id || b.id)}>Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                  <h2>Approved Cabin Bookings ({approvedCabins.length})</h2>
                </div>
                {approvedCabins.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No approved cabin bookings</div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Cabin</th>
                          <th>Check-In</th>
                          <th>Check-Out</th>
                          <th>Status</th>
                          <th>Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedCabins.map((b) => (
                          <tr key={b._id || b.id}>
                            <td>{b.fullName}</td>
                            <td>{b.cabinType}</td>
                            <td>{b.checkInDate}</td>
                            <td>{b.checkOutDate}</td>
                            <td style={{ color: '#10b981', fontWeight: 700 }}>{(b.status || '').toUpperCase()}</td>
                            <td>{b.updatedAt ? new Date(b.updatedAt).toLocaleString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default AdminDashboard
