import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCheck, FaTimes, FaStar, FaStethoscope } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { notificationAPI } from '../utils/api'
import '../Style/Notifications.css'

function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.email) {
      navigate('/login')
      return
    }

    loadNotifications()
  }, [navigate])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationAPI.getNotifications()
      setNotifications(response.data || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif))
      )
    } catch (error) {
      toast.error(error.message || 'Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error(error.message || 'Failed to mark all as read')
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId))
      toast.success('Notification deleted')
    } catch (error) {
      toast.error(error.message || 'Failed to delete notification')
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete all notifications?')) return
    try {
      await notificationAPI.deleteAllNotifications()
      setNotifications([])
      toast.success('All notifications deleted')
    } catch (error) {
      toast.error(error.message || 'Failed to delete notifications')
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'booking_approved':
        return <FaCheck style={{ color: '#2ecc71' }} />
      case 'booking_rejected':
        return <FaTimes style={{ color: '#e74c3c' }} />
      case 'review_approved':
        return <FaStar style={{ color: '#f39c12' }} />
      case 'report_added':
        return <FaStethoscope style={{ color: '#3498db' }} />
      case 'cabin_booking_submitted':
        return '🏥'
      case 'cabin_booking_approved':
        return '🏨'
      case 'cabin_booking_rejected':
        return '⚠'
      default:
        return '•'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking_approved':
        return '#4CAF50'
      case 'booking_rejected':
        return '#f44336'
      case 'review_approved':
        return '#2196F3'
      case 'report_added':
        return '#0ea5e9'
      case 'cabin_booking_submitted':
        return '#f59e0b'
      case 'cabin_booking_approved':
        return '#22c55e'
      case 'cabin_booking_rejected':
        return '#ef4444'
      default:
        return '#666'
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className='notifications-container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className='page-title'>
          Notifications {unreadCount > 0 && <span className='unread-badge'>{unreadCount}</span>}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {unreadCount > 0 && (
            <button className='btn-secondary' onClick={handleMarkAllAsRead} style={{ fontSize: '14px', padding: '10px 15px' }}>
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button className='btn-danger' onClick={handleDeleteAll} style={{ fontSize: '14px', padding: '10px 15px' }}>
              Delete all
            </button>
          )}
          <button className='ghost-link' onClick={() => navigate('/dashboard')} style={{ fontSize: '14px', padding: '10px 20px', display: 'none' }}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>No notifications yet</p>
          <p style={{ fontSize: '14px' }}>You'll receive notifications when admin approves or rejects your bookings</p>
        </div>
      ) : (
        <div className='notifications-list'>
          {notifications.map((notif) => (
            <div key={notif._id} className={`notification-card ${notif.read ? 'read' : 'unread'}`}>
              <div className='notification-icon' style={{ color: getTypeColor(notif.type) }}>
                {getTypeIcon(notif.type)}
              </div>
              <div className='notification-content'>
                <h4 style={{ margin: '0 0 4px 0' }}>{notif.title}</h4>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{notif.message}</p>
                <small style={{ color: '#999', fontSize: '12px' }}>
                  {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                </small>
              </div>
              <button
                className='btn-icon'
                onClick={() => handleDelete(notif._id)}
                title='Delete notification'
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '5px',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
