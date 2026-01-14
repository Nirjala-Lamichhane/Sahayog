import '../../Style/TransactionHistory.css'

const transactions = [
  {
    id: 1,
    amount: 'NPR 2,300',
    purpose: 'Doctor Visit',
    date: '2025/11/25',
    time: '9:45 AM',
  },
  {
    id: 2,
    amount: 'NPR 2,300',
    purpose: 'Doctor Visit',
    date: '2025/11/25',
    time: '9:45 AM',
  },
  {
    id: 3,
    amount: 'NPR 2,300',
    purpose: 'Doctor Visit',
    date: '2025/11/25',
    time: '9:45 AM',
  },
]

function TransactionHistory() {
  return (
    <div className='th-web-container'>
      <h2 className='page-title'>Transaction History</h2>

      <div className='th-web-card'>
        <input
          type='text'
          placeholder='Search transactions...'
          className='search-input'
        />

        <table className='transaction-table'>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className='amount success'>{tx.amount}</td>
                <td>{tx.purpose}</td>
                <td>{tx.date}</td>
                <td>{tx.time}</td>
                <td>
                  <span className='status received'>Received</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionHistory
