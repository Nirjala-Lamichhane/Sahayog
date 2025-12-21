import { useState } from 'react'
import toast from 'react-hot-toast'
import { adminAPI } from '../utils/api'
import '../Style/AdminDashboard.css'

const todayISO = () => new Date().toISOString().split('T')[0]

function AdminReports({ reports, setReports, users, appointments }) {
  const [showReportForm, setShowReportForm] = useState(false)
  const [editingReportId, setEditingReportId] = useState(null)
  const [savingReport, setSavingReport] = useState(false)
  const [imageFile, setImageFile] = useState(null)

  // Debug logging
  console.log('AdminReports - Total users:', users.length)
  console.log('AdminReports - Patients:', users.filter(u => u.role !== 'admin').length)
  console.log('AdminReports - Users data:', users)
  const [newReport, setNewReport] = useState({
    userId: '',
    patientName: '',
    department: '',
    testType: 'General Checkup',
    result: 'Normal',
    doctorName: 'Dr. Unknown',
    findings: '',
    prescription: '',
    notes: '',
    visitDate: todayISO(),
    testDate: todayISO(),
    appointmentId: '',
  })

  const resetReportForm = () => {
    setNewReport({
      userId: '',
      patientName: '',
      department: '',
      testType: 'General Checkup',
      result: 'Normal',
      doctorName: 'Dr. Unknown',
      findings: '',
      prescription: '',
      notes: '',
      visitDate: todayISO(),
      testDate: todayISO(),
      appointmentId: '',
    })
    setEditingReportId(null)
    setImageFile(null)
  }

  const handleSaveReport = async (e) => {
    e.preventDefault()
    if (!newReport.userId || !newReport.patientName || !newReport.department || !newReport.findings) {
      toast.error('Please fill required fields')
      return
    }

    setSavingReport(true)
    try {
      const form = new FormData()
      form.append('userId', String(newReport.userId))
      form.append('patientName', newReport.patientName)
      form.append('department', newReport.department)
      form.append('testType', newReport.testType)
      form.append('result', newReport.result)
      form.append('doctorName', newReport.doctorName)
      form.append('findings', newReport.findings)
      form.append('prescription', newReport.prescription)
      form.append('notes', newReport.notes)
      form.append('visitDate', newReport.visitDate)
      form.append('testDate', newReport.testDate)
      if (newReport.appointmentId) form.append('appointmentId', String(newReport.appointmentId))
      if (imageFile) form.append('image', imageFile)

      if (editingReportId) {
        const res = await adminAPI.updateReport(editingReportId, form)
        const updated = res.data
        setReports((prev) => prev.map((r) => (r._id === updated._id ? updated : r)))
        toast.success('Report updated')
      } else {
        const res = await adminAPI.createReport(form)
        const created = res.data
        setReports((prev) => [created, ...prev])
        toast.success('Report created')
      }
      resetReportForm()
      setShowReportForm(false)
    } catch (err) {
      toast.error(err.message || 'Unable to save report')
    } finally {
      setSavingReport(false)
    }
  }

  const handleEditReport = (report) => {
    setEditingReportId(report._id)
    setShowReportForm(true)
    setNewReport({
      userId: report.userId || '',
      patientName: report.patientName || '',
      department: report.department || '',
      testType: report.testType || 'General Checkup',
      result: report.result || 'Normal',
      doctorName: report.doctorName || 'Dr. Unknown',
      findings: report.findings || '',
      prescription: report.prescription || '',
      notes: report.notes || '',
      visitDate: report.visitDate ? report.visitDate.split('T')[0] : todayISO(),
      testDate: report.testDate ? report.testDate.split('T')[0] : todayISO(),
      appointmentId: report.appointmentId || '',
    })
    setImageFile(null)
  }

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this report?')) return
    try {
      await adminAPI.deleteReport(id)
      setReports((prev) => prev.filter((r) => r._id !== parseInt(id) && r._id !== id))
      toast.success('Report deleted')
    } catch (err) {
      toast.error(err.message || 'Unable to delete report')
    }
  }

  return (
    <>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Medical Reports ({reports.length})</h2>
          <button className="primary-btn" onClick={() => setShowReportForm((v) => !v)}>
            {showReportForm ? 'Close Form' : '+ Add Report'}
          </button>
        </div>

        {showReportForm && (
          <form onSubmit={handleSaveReport} style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Patient *</label>
                <select
                  value={newReport.userId}
                  onChange={(e) => {
                    const selectedUser = users.find((u) => u._id === e.target.value || u.id === e.target.value)
                    setNewReport({
                      ...newReport,
                      userId: e.target.value,
                      patientName: selectedUser?.name || '',
                    })
                  }}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                >
                  <option value="">Select patient</option>
                  {users.filter(u => u.role !== 'admin').length === 0 ? (
                    <option disabled>No patients available - Create user accounts first</option>
                  ) : (
                    users.filter(u => u.role !== 'admin').map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))
                  )}
                </select>
                {users.length > 0 && users.filter(u => u.role !== 'admin').length === 0 && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    No patient accounts found. Please sign up new users or check user roles.
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Department *</label>
                <select
                  value={newReport.department}
                  onChange={(e) => setNewReport({ ...newReport, department: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                >
                  <option value="">Select Department</option>
                  <option value="General">General</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dentistry">Dentistry</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Test Type *</label>
                <select
                  value={newReport.testType}
                  onChange={(e) => setNewReport({ ...newReport, testType: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                >
                  <option value="General Checkup">General Checkup</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="ECG">ECG</option>
                  <option value="Ultrasound">Ultrasound</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Result *</label>
                <select
                  value={newReport.result}
                  onChange={(e) => setNewReport({ ...newReport, result: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                  <option value="Critical">Critical</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Doctor Name *</label>
                <input
                  type="text"
                  value={newReport.doctorName}
                  onChange={(e) => setNewReport({ ...newReport, doctorName: e.target.value })}
                  placeholder="Dr. John Doe"
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Test Date *</label>
                <input
                  type="date"
                  value={newReport.testDate}
                  onChange={(e) => setNewReport({ ...newReport, testDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Visit Date *</label>
                <input
                  type="date"
                  value={newReport.visitDate}
                  onChange={(e) => setNewReport({ ...newReport, visitDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Link Appointment</label>
                <select
                  value={newReport.appointmentId}
                  onChange={(e) => setNewReport({ ...newReport, appointmentId: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                >
                  <option value="">Optional</option>
                  {appointments.map((a) => (
                    <option key={a._id} value={a._id}>
                      #{a._id} {a.fullName} - {a.preferredDate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Findings *</label>
              <textarea
                value={newReport.findings}
                onChange={(e) => setNewReport({ ...newReport, findings: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', minHeight: '90px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Attach Image (optional)</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                style={{ display: 'block' }}
              />
              {imageFile && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <button type="button" className="secondary-btn" onClick={() => setImageFile(null)}>Remove</button>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Prescription</label>
              <textarea
                value={newReport.prescription}
                onChange={(e) => setNewReport({ ...newReport, prescription: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', minHeight: '70px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Notes</label>
              <textarea
                value={newReport.notes}
                onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                placeholder="Additional notes or observations..."
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', minHeight: '70px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="primary-btn" type="submit" disabled={savingReport}>
                {savingReport ? 'Saving...' : editingReportId ? 'Update Report' : 'Create Report'}
              </button>
              {editingReportId && (
                <button type="button" className="secondary-btn" onClick={resetReportForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Report History</h2>
        </div>
        {reports.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No reports yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Test Type</th>
                  <th>Result</th>
                  <th>Image</th>
                  <th>Doctor</th>
                  <th>Test Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td>{r._id}</td>
                    <td>{r.patientName}</td>
                    <td>{r.testType || 'General Checkup'}</td>
                    <td style={{ 
                      fontWeight: 700, 
                      color: r.result === 'Normal' ? '#10b981' : r.result === 'Abnormal' ? '#f59e0b' : r.result === 'Critical' ? '#ef4444' : '#6b7280' 
                    }}>
                      {r.result || 'Pending'}
                    </td>
                    <td>{r.imageUrl ? <img src={`http://127.0.0.1:5000${r.imageUrl}`} alt="Report" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} /> : '-'}</td>
                    <td>{r.doctorName || 'Dr. Unknown'}</td>
                    <td>{r.testDate ? new Date(r.testDate).toLocaleDateString() : r.visitDate}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleEditReport(r)}>
                        Edit
                      </button>
                      <button className="danger-btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteReport(r._id)}>
                        Delete
                      </button>
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

export default AdminReports
