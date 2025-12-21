import toast from 'react-hot-toast'
import { adminAPI } from '../utils/api'
import '../Style/AdminUsers.css'

function AdminUsers({ users, setUsers }) {
  const handleUpdateUser = async (userId, updates, successMessage) => {
    try {
      const res = await adminAPI.updateUser(userId, updates)
      const updated = res.data
      const updatedId = updated.id || updated._id
      setUsers((prev) => prev.map((u) => ((u.id || u._id) === updatedId ? updated : u)))
      if (successMessage) toast.success(successMessage)
    } catch (err) {
      toast.error(err.message || 'Unable to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await adminAPI.deleteUser(userId)
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== parseInt(userId) && (u.id || u._id) !== userId))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.message || 'Unable to delete user')
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Manage Users ({users.length})</h2>
      </div>
      {users.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No users found.</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id || u._id}>
                  <td>{u.id || u._id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role || 'patient'}</td>
                  <td style={{ color: (u.status || 'active') === 'active' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {(u.status || 'active').toUpperCase()}
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="primary-btn"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() =>
                        handleUpdateUser(u.id || u._id, { status: (u.status || 'active') === 'active' ? 'inactive' : 'active' }, 'User status updated')
                      }
                    >
                      Toggle Status
                    </button>
                    <button
                      className="secondary-btn"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() =>
                        handleUpdateUser(u.id || u._id, { role: u.role === 'admin' ? 'patient' : 'admin' }, 'Role updated')
                      }
                    >
                      Toggle Role
                    </button>
                    <button className="danger-btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteUser(u.id || u._id)}>
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
  )
}

export default AdminUsers
