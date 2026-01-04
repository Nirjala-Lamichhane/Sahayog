import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FaBell, FaAmbulance, FaCalendar, FaBed, FaClipboard, FaFile, FaCreditCard } from "react-icons/fa";
import "../Style/Dashboard.css";
import toast from "react-hot-toast";
import { dashboardAPI, notificationAPI } from "../utils/api";
import Ambulance from "../Features/Ambulance/Ambulance";

function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [ambulanceLoading, setAmbulanceLoading] = useState(true);
  const [approvedRatings, setApprovedRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        navigate("/login");
        return;
      }
      const user = JSON.parse(storedUser);
      setUserInfo(user);

      try {
        const dashboard = await dashboardAPI.getDashboard();
        if (dashboard?.user) {
          setUserInfo(dashboard.user);
        }
        const [apptRes, reminderRes, reportsRes, ambulanceRes, ratingsRes] = await Promise.all([
          dashboardAPI.getAppointments(),
          dashboardAPI.getReminders(),
          dashboardAPI.getReports().catch(() => ({ data: [] })),
          dashboardAPI.getUserAmbulanceRequests(),
          dashboardAPI.getUserApprovedRatings().catch(() => ({ data: [] })),
        ]);
        setAppointments(apptRes.data || []);
        setReminders(reminderRes.data || []);
        setReports(reportsRes.data || []);
        setAmbulanceRequests(ambulanceRes.data || []);
        setApprovedRatings(ratingsRes.data || []);
        
        // Load unread notifications count
        try {
          const notifRes = await notificationAPI.getUnreadCount();
          setUnreadNotifications(notifRes.data?.unreadCount || 0);
        } catch (error) {
          console.log('Could not load notification count');
        }
      } catch (error) {
        toast.error("Could not load dashboard data");
      } finally {
        setLoading(false);
        setAppointmentsLoading(false);
        setRemindersLoading(false);
        setReportsLoading(false);
        setAmbulanceLoading(false);
        setRatingsLoading(false);
      }
    };

    init();
  }, [navigate]);



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (!userInfo) {
    return null;
  }

  return (
    <main className="dashboard">
      <div className="dashboard-container">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="user-profile" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <div className="profile-avatar">
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3 className="profile-name">{userInfo.name || "User"}</h3>
            <p className="profile-email">{userInfo.email}</p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Click to edit</p>
          </div>

          <nav className="sidebar-menu">
            <button className="menu-item active">
              Dashboard
            </button>
            <button className="menu-item" onClick={() => navigate('/book-appointment')}>
              Book Appointment
            </button>
            <button className="menu-item" onClick={() => navigate('/bookcabin')}>
              Book Cabin/Bed
            </button>
            <button className="menu-item" onClick={() => navigate('/ambulance-bookings')}>
              My Ambulance Bookings
            </button>
            <button className="menu-item" onClick={() => navigate('/myreports')}>
              Medical Reports
            </button>
            <button className="menu-item" onClick={() => navigate('/payment-method')}>
              Transaction
            </button>
            <button className="menu-item" onClick={() => navigate('/transactionhistory')}>
              Transaction History
            </button>
            <button className="menu-item" onClick={() => navigate('/ratingreview')}>
              Ratings & Reviews
            </button>
            <button className="menu-item" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
              <FaBell style={{ marginRight: '8px' }} /> Notifications {unreadNotifications > 0 && <span style={{
                position: 'absolute',
                top: '5px',
                right: '8px',
                background: '#ff4757',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>{unreadNotifications}</span>}
              </button>
            <hr />
            <button className="menu-item logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </nav>
        </aside>

        <div className="dashboard-main">
          <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Welcome back, {userInfo.name}!</h1>
              <p>You're all set. Pick a task below to continue.</p>
            </div>
          </div>

          {/* ACTION CARDS */}
          <div className="action-cards">
            <div className="card card-emergency">
              <div className="card-icon"><FaAmbulance style={{ fontSize: '32px', color: '#e74c3c' }} /></div>
              <h3>Emergency Ambulance</h3>
              <p>Need immediate medical assistance?</p>
              <button className="card-btn" onClick={() => setIsAmbulanceModalOpen(true)}>
                Request Now
              </button>
            </div>

            <div className="card card-appointment">
              <div className="card-icon"><FaCalendar style={{ fontSize: '32px', color: '#3498db' }} /></div>
              <h3>Book Appointment</h3>
              <p>Schedule a visit with our doctors</p>
              <button className="card-btn" onClick={() => navigate('/book-appointment')}>
                Book Now
              </button>
            </div>

            <div className="card card-cabin">
              <div className="card-icon"><FaBed style={{ fontSize: '32px', color: '#2ecc71' }} /></div>
              <h3>Book Cabin/Bed</h3>
              <p>Reserve a private cabin or ICU bed</p>
              <button className="card-btn" onClick={() => navigate('/bookcabin')}>
                Book Cabin
              </button>
            </div>

            <div className="card card-details">
              <div className="card-icon"><FaClipboard style={{ fontSize: '32px', color: '#f39c12' }} /></div>
              <h3>Appointment Details</h3>
              <p>View your appointment information</p>
              <button className="card-btn" onClick={() => navigate('/appointment-detail')}>
                View Details
              </button>
            </div>

            <div className="card card-reports">
              <div className="card-icon"><FaFile style={{ fontSize: '32px', color: '#9b59b6' }} /></div>
              <h3>View Reports</h3>
              <p>Check your medical reports and documents</p>
              <button className="card-btn" onClick={() => navigate('/myreports')}>
                View Reports
              </button>
            </div>

            <div className="card card-transactions">
              <div className="card-icon"><FaCreditCard style={{ fontSize: '32px', color: '#1abc9c' }} /></div>
              <h3>Transaction History</h3>
              <p>View your payment history and invoices</p>
              <button className="card-btn" onClick={() => navigate('/transactionhistory')}>
                View History
              </button>
            </div>
          </div>

          {/* CALENDAR SECTION */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2>Appointment Calendar</h2>
            </div>
            <div className="calendar-container" style={{ padding: '20px' }}>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={reminders.map((r) => ({
                  title: r.title || 'Appointment',
                  start: r.date,
                }))}
                height="auto"
              />
            </div>
          </div>

          {/* REMINDERS */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2>Upcoming Reminders</h2>
            </div>
            {remindersLoading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading reminders...</div>
            ) : reminders.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No upcoming reminders.</div>
            ) : (
              <div style={{ padding: '20px' }}>
                {reminders.map((r) => (
                  <div
                    key={r._id || r.id}
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, marginBottom: '4px' }}>{r.title}</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                        {r.date} • {r.notes || 'No additional notes'}
                      </p>
                    </div>
                    <span style={{ fontSize: '24px' }}></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MY APPOINTMENTS */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2>My Appointments</h2>
            </div>
            {appointmentsLoading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No appointments booked yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Department</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td>{appt.fullName}</td>
                        <td>{appt.age}</td>
                        <td>{appt.department}</td>
                        <td>{appt.doctor}</td>
                        <td>{appt.preferredDate}</td>
                        <td>{appt.preferredTime}</td>
                        <td style={{ 
                          color: appt.status === 'confirmed' ? '#10b981' : appt.status === 'pending' ? '#f59e0b' : '#6b7280',
                          fontWeight: 700 
                        }}>
                          {(appt.status || 'pending').toUpperCase()}
                        </td>
                        <td>
                          <button 
                            className="primary-btn" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => navigate(`/appointment-detail?id=${appt._id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* AMBULANCE REQUESTS */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2>Ambulance Service Requests</h2>
            </div>
            {ambulanceLoading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading ambulance requests...</div>
            ) : ambulanceRequests.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No ambulance requests made yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Request Date</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambulanceRequests.map((req) => (
                      <tr key={req._id}>
                        <td>{req.name}</td>
                        <td>{req.email}</td>
                        <td style={{ 
                          color: req.status === 'approved' ? '#10b981' : req.status === 'pending' ? '#f59e0b' : '#ef4444',
                          fontWeight: 700 
                        }}>
                          {(req.status || 'pending').toUpperCase()}
                        </td>
                        <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>{req.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* MEDICAL REPORTS */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2>My Medical Reports</h2>
            </div>
            {reportsLoading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading reports...</div>
            ) : reports.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No reports available yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Test Type</th>
                      <th>Result</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.testType}</td>
                        <td style={{ fontWeight: 700, color: report.result === 'Normal' ? '#10b981' : '#f59e0b' }}>
                          {report.result}
                        </td>
                        <td>{report.doctorName}</td>
                        <td>{new Date(report.testDate).toLocaleDateString()}</td>
                        <td>{report.notes || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* USER RATINGS & REVIEWS */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2>User Reviews & Ratings</h2>
              <button 
                className="card-link" 
                onClick={() => navigate('/ratingreview')}
                style={{ fontSize: '14px', padding: '8px 16px', color: '#0d9488', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                View All / Leave a Review →
              </button>
            </div>
            {ratingsLoading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading reviews...</div>
            ) : approvedRatings.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                No reviews yet. <button onClick={() => navigate('/ratingreview')} style={{ color: '#0d9488', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Be the first to review!</button>
              </div>
            ) : (
              <div style={{ padding: '20px' }}>
                {approvedRatings.slice(0, 3).map((review) => (
                  <div
                    key={review._id}
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h4 style={{ margin: '0', fontWeight: 600, color: '#111827' }}>{review.userName}</h4>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {'★'.split('').map((_, i) => (
                          <span key={i} style={{ color: i < review.rating ? '#fbbf24' : '#d1d5db', fontSize: '16px' }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>{review.comment}</p>
                    <small style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
                {approvedRatings.length > 3 && (
                  <button 
                    onClick={() => navigate('/ratingreview')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginTop: '12px',
                      border: '1px solid #0d9488',
                      borderRadius: '6px',
                      background: 'white',
                      color: '#0d9488',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    View All {approvedRatings.length} Reviews
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AMBULANCE MODAL */}
      <Ambulance 
        isOpen={isAmbulanceModalOpen}
        onClose={() => setIsAmbulanceModalOpen(false)}
        userInfo={userInfo}
      />
    </main>
  );
}

export default Dashboard;
