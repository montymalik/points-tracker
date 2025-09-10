// components/WithdrawForm.js
import { useState } from 'react';

export default function WithdrawForm({ onWithdraw }) {
  const [videoGamesAmount, setVideoGamesAmount] = useState("");
  const [generalSpendingAmount, setGeneralSpendingAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onWithdraw({ videoGamesAmount, generalSpendingAmount });
    setVideoGamesAmount("");
    setGeneralSpendingAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="videoWithdraw" className="block text-sm font-semibold text-gray-600">
          Withdraw from Video Games ($)
        </label>
        <input
          id="videoWithdraw"
          type="number"
          step="0.01"
          value={videoGamesAmount}
          onChange={(e) => setVideoGamesAmount(e.target.value)}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="generalWithdraw" className="block text-sm font-semibold text-gray-600">
          Withdraw from General Spending ($)
        </label>
        <input
          id="generalWithdraw"
          type="number"
          step="0.01"
          value={generalSpendingAmount}
          onChange={(e) => setGeneralSpendingAmount(e.target.value)}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200">
        Withdraw
      </button>
    </form>
  );
}

