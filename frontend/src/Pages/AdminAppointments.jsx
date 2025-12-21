import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { adminAPI } from '../utils/api'
import '../Style/AdminAppointments.css'

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  cancelled: '#ef4444',
  completed: '#0ea5e9',
}

function AdminAppointments({ appointments, setAppointments }) {
  const pendingAppointments = useMemo(
    () => appointments.filter((a) => (a.status || 'pending') === 'pending'),
    [appointments]
  )
  const confirmedAppointments = useMemo(
    () => appointments.filter((a) => ['confirmed', 'completed'].includes(a.status)),
    [appointments]
  )

  const handleConfirm = async (id) => {
    try {
      const res = await adminAPI.confirmAppointment(id)
      const updated = res.data
      const updatedId = updated.id || updated._id
      setAppointments((prev) => prev.map((a) => ((a.id || a._id) === updatedId ? updated : a)))
      toast.success('Appointment confirmed')
    } catch (err) {
      toast.error(err.message || 'Unable to confirm')
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment?')) return
    try {
      await adminAPI.deleteAppointment(id)
      setAppointments((prev) => prev.filter((a) => (a.id || a._id) !== parseInt(id) && (a.id || a._id) !== id))
      toast.success('Appointment deleted')
    } catch (err) {
      toast.error(err.message || 'Unable to delete appointment')
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>Pending Approvals ({pendingAppointments.length})</h2>
        </div>
        {pendingAppointments.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>All caught up.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Dept</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAppointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a._id}</td>
                    <td>{a.fullName}</td>
                    <td>{a.contact}</td>
                    <td>{a.department}</td>
                    <td>{a.doctor}</td>
                    <td>{a.preferredDate}</td>
                    <td>{a.preferredTime}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="primary-btn" onClick={() => handleConfirm(a._id)}>Confirm</button>
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
          <h2>Confirmed / Completed ({confirmedAppointments.length})</h2>
        </div>
        {confirmedAppointments.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Approve pending requests to see them here.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Dept</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedAppointments.map((a) => (
                  <tr key={a.id || a._id}>
                    <td>{a.id || a._id}</td>
                    <td>{a.fullName}</td>
                    <td>{a.department}</td>
                    <td>{a.doctor}</td>
                    <td>{a.preferredDate}</td>
                    <td>{a.preferredTime}</td>
                    <td style={{ color: statusColors[a.status] || '#111827', fontWeight: 700 }}>
                      {(a.status || 'confirmed').toUpperCase()}
                    </td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="danger-btn" onClick={() => handleDeleteAppointment(a.id || a._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminAppointments
