// components/MonthlyFlowChart.js
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MonthlyFlowChart({ monthlyData }) {
  // Build the labels from the month names
  const labels = monthlyData.map((data) => data.month);

  const data = {
    labels,
    datasets: [
      {
        label: 'Video Games Inflow',
        data: monthlyData.map((data) => data.videoGamesInflow),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // green-ish
      },
      {
        label: 'Video Games Outflow',
        data: monthlyData.map((data) => data.videoGamesOutflow),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // red-ish
      },
      {
        label: 'General Spending Inflow',
        data: monthlyData.map((data) => data.generalSpendingInflow),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-ish
      },
      {
        label: 'General Spending Outflow',
        data: monthlyData.map((data) => data.generalSpendingOutflow),
        backgroundColor: 'rgba(251, 113, 133, 0.7)', // pink-ish
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Monthly Inflows and Outflows (Video Games & General Spending)',
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
}

