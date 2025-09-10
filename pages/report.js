// pages/report.js
import { useState, useEffect } from 'react';

export default function Report() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    let url = '/api/transactions';
    const params = [];
    if (month) params.push(`month=${month}`);
    if (year) params.push(`year=${year}`);
    if (params.length) url += '?' + params.join('&');

    const res = await fetch(url);
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Monthly Spending Report</h1>
      <form onSubmit={handleFilter}>
        <label>
          Month (1-12):
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
          />
        </label>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <button type="submit">Filter</button>
      </form>
      <h2>Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Total Amount</th>
              <th>Video Games</th>
              <th>General Spending</th>
              <th>Charity</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td>{tx.type}</td>
                <td>${tx.amount.toFixed(2)}</td>
                <td>{tx.videoGames ? `$${tx.videoGames.toFixed(2)}` : '-'}</td>
                <td>{tx.generalSpending ? `$${tx.generalSpending.toFixed(2)}` : '-'}</td>
                <td>{tx.charity ? `$${tx.charity.toFixed(2)}` : '-'}</td>
                <td>{tx.savings ? `$${tx.savings.toFixed(2)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

