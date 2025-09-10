// pages/withdraw.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Withdraw() {
  const [videoGamesAmount, setVideoGamesAmount] = useState('');
  const [generalSpendingAmount, setGeneralSpendingAmount] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const videoGames = parseFloat(videoGamesAmount) || 0;
    const generalSpending = parseFloat(generalSpendingAmount) || 0;
    
    if (videoGames <= 0 && generalSpending <= 0) {
      setMessage('Please enter an amount for at least one category.');
      return;
    }

    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoGames,
        generalSpending,
      }),
    });

    if (res.ok) {
      setMessage('Withdrawal successful!');
      router.push('/');
    } else {
      const errorData = await res.json();
      setMessage('Error: ' + errorData.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Withdraw Money</h1>
      <form onSubmit={handleWithdraw}>
        <div>
          <label>Video Games Withdrawal:</label>
          <input
            type="number"
            step="0.01"
            value={videoGamesAmount}
            onChange={(e) => setVideoGamesAmount(e.target.value)}
          />
        </div>
        <div>
          <label>General Spending Withdrawal:</label>
          <input
            type="number"
            step="0.01"
            value={generalSpendingAmount}
            onChange={(e) => setGeneralSpendingAmount(e.target.value)}
          />
        </div>
        <button type="submit">Withdraw</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

