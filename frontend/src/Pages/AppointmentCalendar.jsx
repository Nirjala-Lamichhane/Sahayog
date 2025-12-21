import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useNavigate } from 'react-router-dom'
import '../Style/AppointmentCalendar.css'

function AppointmentCalendar({ reminders, remindersLoading }) {
  const navigate = useNavigate()
  
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'none' }}>
          ← Back to Dashboard
        </button>
      </div>
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2>Your Appointment Calendar</h2>
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
                <span style={{ fontSize: '24px' }}>•</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default AppointmentCalendar
