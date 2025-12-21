import '../Style/DashboardReminders.css'

function DashboardReminders({ reminders, loading }) {
  if (loading) {
    return (
      <div className="card reminders-card">
        <div className="card-header">
          <h2>Upcoming Reminders</h2>
        </div>
        <div className="loading-state">Loading reminders...</div>
      </div>
    )
  }

  if (reminders.length === 0) {
    return (
      <div className="card reminders-card">
        <div className="card-header">
          <h2>Upcoming Reminders</h2>
        </div>
        <div className="empty-state">No upcoming reminders.</div>
      </div>
    )
  }

  return (
    <div className="card reminders-card">
      <div className="card-header">
        <h2>Upcoming Reminders</h2>
      </div>
      <div className="reminders-list">
        {reminders.map((r) => (
          <div key={r._id || r.id} className="reminder-item">
            <div className="reminder-content">
              <h4 className="reminder-title">{r.title}</h4>
              <p className="reminder-meta">
                {r.date} • {r.notes || 'No additional notes'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardReminders
