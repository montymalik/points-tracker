// components/CombinedChart.js
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip);

export default function CombinedChart({ videoGames, generalSpending, charity, savings }) {
  const data = {
    labels: ['Video Games', 'General Spending', 'Charity'],
    datasets: [
      {
        type: 'bar',
        label: 'Category Amount',
        data: [videoGames, generalSpending, charity],
        backgroundColor: ['#3B82F6', '#3B82F6', '#3B82F6'],
      },
      {
        type: 'line',
        label: 'Savings',
        data: [savings, savings, savings],
        borderColor: '#10B981',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Chart type="bar" data={data} options={options} />;
}

