import '../Style/DashboardReports.css'

function DashboardReports({ reports, loading }) {
  if (loading) {
    return (
      <div className="card reports-card">
        <div className="card-header">
          <h2>My Medical Reports</h2>
        </div>
        <div className="loading-state">Loading reports...</div>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="card reports-card">
        <div className="card-header">
          <h2>My Medical Reports</h2>
        </div>
        <div className="empty-state">No reports available yet.</div>
      </div>
    )
  }

  return (
    <div className="card reports-card">
      <div className="card-header">
        <h2>My Medical Reports</h2>
      </div>
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
                <td className={`result-${report.result.toLowerCase()}`}>
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
    </div>
  )
}

export default DashboardReports
