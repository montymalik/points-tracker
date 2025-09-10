// pages/deposit.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleDeposit = async (e) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: depositAmount }),
    });

    if (res.ok) {
      setMessage('Deposit successful!');
      router.push('/');
    } else {
      const errorData = await res.json();
      setMessage('Error: ' + errorData.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Deposit Money</h1>
      <form onSubmit={handleDeposit}>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button type="submit">Deposit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

