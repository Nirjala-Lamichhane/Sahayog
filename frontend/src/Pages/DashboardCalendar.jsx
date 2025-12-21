import '../Style/DashboardCalendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function DashboardCalendar({ reminders }) {
  return (
    <div className="card calendar-card">
      <div className="card-header">
        <h2>Appointment Calendar</h2>
      </div>
      <div className="calendar-container">
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
  )
}

export default DashboardCalendar
