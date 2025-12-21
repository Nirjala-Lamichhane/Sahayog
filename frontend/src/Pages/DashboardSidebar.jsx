import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dashboardAPI } from '../utils/api'
import '../Style/DashboardSidebar.css'

function DashboardSidebar({ userInfo, unreadNotifications, onLogout }) {
  const navigate = useNavigate()

  return (
    <aside className="dashboard-sidebar">
      <div className="user-profile" onClick={() => navigate('/profile')}>
        <div className="profile-avatar">
          <span>{userInfo?.name?.charAt(0).toUpperCase() || 'U'}</span>
        </div>
        <h3 className="profile-name">{userInfo?.name || 'User'}</h3>
        <p className="profile-email">{userInfo?.email}</p>
      </div>

      <nav className="sidebar-menu">
        <button className="menu-item active">
          <span>📊 Dashboard</span>
        </button>
        <button className="menu-item" onClick={() => navigate('/profile')}>
          <span>👤 Profile</span>
        </button>
        <button className="menu-item" onClick={() => navigate('/notifications')}>
          <span>🔔 Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}</span>
        </button>
        <button className="menu-item" onClick={() => navigate('/transactionhistory')}>
          <span>💳 Transactions</span>
        </button>
        <button className="menu-item" onClick={() => navigate('/myreports')}>
          <span>📄 My Reports</span>
        </button>
        <button className="menu-item" onClick={() => navigate('/ratingreview')}>
          <span>⭐ Reviews</span>
        </button>
        <button className="menu-item logout" onClick={onLogout}>
          <span>🚪 Logout</span>
        </button>
      </nav>
    </aside>
  )
}

export default DashboardSidebar
