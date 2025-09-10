// pages/savings.js
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SavingsGraph() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch('/api/transactions');
      const transactions = await res.json();
      // Filter to get only deposit transactions that add to savings.
      const depositTransactions = transactions.filter((tx) => tx.savings && tx.savings > 0);
      // Sort transactions by date
      depositTransactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      let cumulative = 0;
      const labels = [];
      const savingsData = [];
      depositTransactions.forEach((tx) => {
        cumulative += tx.savings;
        labels.push(new Date(tx.createdAt).toLocaleDateString());
        savingsData.push(cumulative);
      });
      
      setData({
        labels,
        datasets: [
          {
            label: 'Cumulative Savings',
            data: savingsData,
            fill: false,
            borderColor: 'green',
          },
        ],
      });
    };
    fetchTransactions();
  }, []);

  if (!data) return <div>Loading graph...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Savings Over Time</h1>
      <Line data={data} />
    </div>
  );
}

