import { useNavigate } from 'react-router-dom'
import '../Style/DashboardAppointments.css'

function DashboardAppointments({ appointments, loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="card appointments-card">
        <div className="card-header">
          <h2>My Appointments</h2>
        </div>
        <div className="loading-state">Loading appointments...</div>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="card appointments-card">
        <div className="card-header">
          <h2>My Appointments</h2>
        </div>
        <div className="empty-state">No appointments booked yet.</div>
      </div>
    )
  }

  return (
    <div className="card appointments-card">
      <div className="card-header">
        <h2>My Appointments</h2>
      </div>
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
                <td className={`status-${appt.status || 'pending'}`}>
                  {(appt.status || 'pending').toUpperCase()}
                </td>
                <td>
                  <button 
                    className="primary-btn"
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
    </div>
  )
}

export default DashboardAppointments
