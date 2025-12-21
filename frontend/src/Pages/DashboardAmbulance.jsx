import '../Style/DashboardAmbulance.css'

function DashboardAmbulance({ ambulanceRequests, loading }) {
  if (loading) {
    return (
      <div className="card ambulance-card">
        <div className="card-header">
          <h2>Ambulance Service Requests</h2>
        </div>
        <div className="loading-state">Loading ambulance requests...</div>
      </div>
    )
  }

  if (ambulanceRequests.length === 0) {
    return (
      <div className="card ambulance-card">
        <div className="card-header">
          <h2>Ambulance Service Requests</h2>
        </div>
        <div className="empty-state">No ambulance requests made yet.</div>
      </div>
    )
  }

  return (
    <div className="card ambulance-card">
      <div className="card-header">
        <h2>Ambulance Service Requests</h2>
      </div>
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
                <td className={`status-${req.status || 'pending'}`}>
                  {(req.status || 'pending').toUpperCase()}
                </td>
                <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>{req.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardAmbulance
