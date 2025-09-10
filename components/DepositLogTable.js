// components/DepositLogTable.js
import { useState, useEffect } from 'react';

export default function DepositLogTable() {
  const [depositLog, setDepositLog] = useState([]);

  useEffect(() => {
    fetchDepositLog();
  }, []);

  const fetchDepositLog = async () => {
    try {
      const res = await fetch('/api/depositLog');
      if (res.ok) {
        const data = await res.json();
        setDepositLog(data);
      } else {
        console.error("Error fetching deposit log");
      }
    } catch (error) {
      console.error("Error fetching deposit log:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Deposit Log</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          {depositLog.map((entry, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b text-center">
                {new Date(entry.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {parseFloat(entry.amount).toFixed(2)}
              </td>
            </tr>
          ))}
          {depositLog.length === 0 && (
            <tr>
              <td colSpan="2" className="py-4 text-center">
                No deposits recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

