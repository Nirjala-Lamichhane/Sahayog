import { useEffect, useState } from 'react'
import '../Style/TransactionHistory.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { paymentAPI } from '../utils/api'

function TransactionHistory() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.email) {
          navigate('/login')
          return
        }
        
        const response = await paymentAPI.getPaymentHistory()
        console.log('Payment history response:', response)
        
        // Handle both response.data and direct array responses
        const txnData = response?.data || response || []
        setTransactions(Array.isArray(txnData) ? txnData : [])
        console.log('Transactions set to:', Array.isArray(txnData) ? txnData : [])
      } catch (error) {
        console.error('Transaction loading error:', error)
        toast.error('Failed to load transaction history')
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [navigate])

  const filteredTransactions = transactions.filter(t =>
    (t.description || `Payment for ${t.bookingType || 'service'}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.type || t.bookingType || '').toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  if (loading) {
    return (
      <div className='th-web-container' style={{
        background: 'linear-gradient(135deg, rgba(254, 252, 232, 0.95), rgba(219, 234, 254, 0.95))',
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <p>Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='th-web-container' style={{
      background: 'linear-gradient(135deg, rgba(254, 252, 232, 0.95), rgba(219, 234, 254, 0.95)), url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className='page-title'>My Transactions</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'none' }}>
          Back to Dashboard
        </button>
      </div>

      <div className='th-web-card'>
        <input
          type='text'
          placeholder='Search transactions...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-input'
        />

        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            <p>{transactions.length === 0 ? 'No transactions yet' : 'No transactions match your search'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', minHeight: '100px', display: 'block', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <table className='transaction-table' style={{ tableLayout: 'fixed', minWidth: '100%', width: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, fontSize: '14px', color: '#374151', width: '15%' }}>Description</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, fontSize: '14px', color: '#374151', width: '12%' }}>Type</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, fontSize: '14px', color: '#374151', width: '12%' }}>Amount</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, fontSize: '14px', color: '#374151', width: '18%' }}>Payment Method</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, fontSize: '14px', color: '#374151', width: '15%' }}>Date</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, fontSize: '14px', color: '#374151', width: '12%' }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction, idx) => (
                  <tr key={transaction._id || idx} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: idx % 2 === 0 ? '#fafafa' : '#ffffff' }}>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{transaction.description || `Payment for ${transaction.bookingType || 'service'}`}</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#4b5563', textTransform: 'capitalize', wordBreak: 'break-word' }}>{(transaction.type || transaction.bookingType || 'N/A').replace('-', ' ')}</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#10b981', fontWeight: 600, wordBreak: 'break-word' }}>NPR {transaction.amount?.toLocaleString() || '0'}</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#4b5563', textTransform: 'capitalize', wordBreak: 'break-word' }}>{transaction.paymentMethod?.replace('-', ' ') || 'N/A'}</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#4b5563', wordBreak: 'break-word' }}>{new Date(transaction.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', wordBreak: 'break-word' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', fontWeight: 500, textTransform: 'uppercase' }}>{(transaction.status || 'pending')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory
