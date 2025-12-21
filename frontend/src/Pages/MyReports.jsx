import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaClipboard, FaFile } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { dashboardAPI } from '../utils/api'
import '../Style/MyReports.css'

function MyReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return '#10b981'
      case 'pending':
        return '#f59e0b'
      case 'attention required':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return '#ecfdf5'
      case 'pending':
        return '#fffbeb'
      case 'attention required':
        return '#fef2f2'
      default:
        return '#f9fafb'
    }
  }

  const handleDownload = (report) => {
    const content = `MEDICAL REPORT
=====================================
Report Type: ${report.department}
Visit Date: ${new Date(report.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Patient Name: ${report.patientName}
Doctor/Lab: ${report.doctorName || 'N/A'}

FINDINGS:
${report.findings}

PRESCRIPTION & RECOMMENDATIONS:
${report.prescription || 'N/A'}

NOTES:
${report.notes || 'N/A'}

Report Status: ${report.result || 'N/A'}
=====================================`

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `report-${report.department}-${report.visitDate}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Report downloaded successfully')
  }

  const handlePrint = (report) => {
    const printContent = `
      <html>
        <head>
          <title>${report.department} Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #0369a1; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #0369a1; }
            .section { margin: 20px 0; }
            .section h3 { color: #1f2937; border-left: 4px solid #0369a1; padding-left: 12px; margin: 15px 0 8px 0; }
            .content { background: #f9fafb; padding: 12px; border-radius: 6px; margin: 8px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
            .info-item { }
            .label { color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .value { color: #1f2937; font-weight: 500; margin-top: 4px; }
            .status { display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin: 10px 0; }
            .status-verified { background: #ecfdf5; color: #065f46; }
            .status-pending { background: #fffbeb; color: #92400e; }
            .status-attention { background: #fef2f2; color: #7f1d1d; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Report</h1>
            <p style="margin: 8px 0 0; color: #6b7280;">Healthcare Provider Report</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="label">Report Type</div>
              <div class="value">${report.department}</div>
            </div>
            <div class="info-item">
              <div class="label">Visit Date</div>
              <div class="value">${new Date(report.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="info-item">
              <div class="label">Patient Name</div>
              <div class="value">${report.patientName}</div>
            </div>
            <div class="info-item">
              <div class="label">Doctor/Lab Name</div>
              <div class="value">${report.doctorName || 'Healthcare Provider'}</div>
            </div>
          </div>

          <div class="section">
            <h3>Findings</h3>
            <div class="content">${report.findings}</div>
          </div>

          ${report.prescription ? `
            <div class="section">
              <h3>Prescription & Recommendations</h3>
              <div class="content">${report.prescription}</div>
            </div>
          ` : ''}

          ${report.notes ? `
            <div class="section">
              <h3>Additional Notes</h3>
              <div class="content">${report.notes}</div>
            </div>
          ` : ''}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is a confidential medical document. Please keep it secure and share only with healthcare professionals as needed.</p>
          </div>
        </body>
      </html>
    `
    const printWindow = window.open('', '', 'height=800,width=900')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const ReportModal = () => {
    if (!selectedReport) return null

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="report-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2>{selectedReport.department}</h2>
              <p className="modal-subtitle">Uploaded on {new Date(selectedReport.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
          </div>

          <div className="modal-body">
            {/* Report Metadata */}
            <div className="metadata-section">
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="metadata-label">Doctor/Lab Name</span>
                  <span className="metadata-value">{selectedReport.doctorName || 'Healthcare Provider'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Patient Name</span>
                  <span className="metadata-value">{selectedReport.patientName}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Report Status</span>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: getStatusBgColor(selectedReport.result),
                    color: getStatusColor(selectedReport.result),
                    fontWeight: 600,
                    fontSize: '13px',
                  }}>
                    {selectedReport.result || 'Pending'}
                  </div>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Test Type</span>
                  <span className="metadata-value">{selectedReport.testType || 'General Checkup'}</span>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {selectedReport.imageUrl && (
              <div className="image-section">
                <h3>Medical Report Image</h3>
                <div className="image-container">
                  <img
                    src={`http://127.0.0.1:5000${selectedReport.imageUrl}`}
                    alt="Medical Report"
                  />
                </div>
              </div>
            )}

            {/* Findings */}
            <div className="section">
              <h3>🔍 Findings</h3>
              <div className="content-box">
                {selectedReport.findings}
              </div>
            </div>

            {/* Prescription */}
            {selectedReport.prescription && (
              <div className="section">
                <h3>💊 Prescription & Recommendations</h3>
                <div className="content-box prescription-box">
                  {selectedReport.prescription}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {selectedReport.notes && (
              <div className="section">
                <h3>📝 Doctor's Notes</h3>
                <div className="content-box notes-box">
                  {selectedReport.notes}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              className="btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  handleDownload(selectedReport)
                }}
              >
                📥 Download
              </button>
              <button
                className="btn-success"
                onClick={() => {
                  handlePrint(selectedReport)
                }}
              >
                🖨️ Print
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="reports-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your medical reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reports-page">
      {/* Header Section */}
      <div className="reports-header">
        <div className="header-content">
          <h1><FaClipboard style={{ marginRight: '10px' }} /> My Medical Reports</h1>
          <p>Access all your medical reports securely. Only you can view your reports.</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-back" style={{display: 'none'}}>
          ← Back to Dashboard
        </button>
      </div>

      {/* User Info Card */}
      <div className="user-info-card">
        <div className="user-info-avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
        <div className="user-info-details">
          <h3>{user.name || 'User'}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {/* Reports Section */}
      <div className="reports-container">
        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FaFile style={{ fontSize: '48px', color: '#d1d5db' }} /></div>
            <h2>No Medical Reports Yet</h2>
            <p>Reports from your doctor will appear here once they are uploaded by our healthcare team.</p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
              Reports are private and only visible to you. They include findings, prescriptions, and doctor's notes.
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ marginTop: '20px' }}>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-card">
                {/* Card Header with Status Badge */}
                <div className="card-header-section">
                  <div className="card-title-section">
                    <h3 className="card-title">{report.department}</h3>
                    <span className="card-date">
                      {new Date(report.visitDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div
                    className="status-badge"
                    style={{
                      background: getStatusBgColor(report.result),
                      color: getStatusColor(report.result),
                    }}
                  >
                    {report.result || 'Pending'}
                  </div>
                </div>

                {/* Card Divider */}
                <div className="card-divider"></div>

                {/* Card Body */}
                <div className="card-body">
                  {/* Doctor/Lab Info */}
                  <div className="info-row">
                    <span className="info-label">👨‍⚕️ Doctor/Lab</span>
                    <span className="info-value">{report.doctorName || 'Healthcare Provider'}</span>
                  </div>

                  {/* Test Type */}
                  <div className="info-row">
                    <span className="info-label">🔬 Test Type</span>
                    <span className="info-value">{report.testType || 'General Checkup'}</span>
                  </div>

                  {/* Preview of Findings */}
                  <div className="findings-preview">
                    <span className="findings-label">Summary</span>
                    <p className="findings-text">
                      {report.findings.substring(0, 100)}
                      {report.findings.length > 100 ? '...' : ''}
                    </p>
                  </div>

                  {/* Image Indicator */}
                  {report.imageUrl && (
                    <div className="image-indicator">
                      🖼️ Medical image attached
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="card-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewReport(report)}
                  >
                    👁️ View Details
                  </button>
                  <button
                    className="action-btn download-btn"
                    onClick={() => handleDownload(report)}
                  >
                    ⬇️ Download
                  </button>
                  <button
                    className="action-btn print-btn"
                    onClick={() => handlePrint(report)}
                  >
                    🖨️ Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal />

      {/* Footer Note */}
      {reports.length > 0 && (
        <div className="footer-note">
          <p>🔒 Your medical reports are private and secure. Only you and authorized healthcare professionals can access them.</p>
        </div>
      )}
    </div>
  )
}

export default MyReports
