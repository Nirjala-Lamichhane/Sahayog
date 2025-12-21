import '../Style/DashboardActions.css'

function DashboardActions({ onAmbulance, onBookAppointment, onViewReports, onTransactionHistory, onRatings }) {
  return (
    <div className="stats-grid" style={{ marginTop: '24px' }}>
      <div className="stat-card" onClick={onAmbulance} style={{ cursor: 'pointer' }}>
        <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
          
        </div>
        <h3>Emergency</h3>
        <p>Request Ambulance</p>
      </div>

      <div className="stat-card" onClick={onBookAppointment} style={{ cursor: 'pointer' }}>
        <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
          
        </div>
        <h3>Book</h3>
        <p>New Appointment</p>
      </div>

      <div className="stat-card" onClick={onViewReports} style={{ cursor: 'pointer' }}>
        <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
          
        </div>
        <h3>Reports</h3>
        <p>View Medical Records</p>
      </div>

      <div className="stat-card" onClick={onTransactionHistory} style={{ cursor: 'pointer' }}>
        <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
          
        </div>
        <h3>Transactions</h3>
        <p>Payment History</p>
      </div>

      <div className="stat-card" onClick={onRatings} style={{ cursor: 'pointer' }}>
        <div className="stat-icon" style={{ backgroundColor: '#e9d5ff' }}>
          
        </div>
        <h3>Feedback</h3>
        <p>Rate & Review</p>
      </div>
    </div>
  )
}

export default DashboardActions
