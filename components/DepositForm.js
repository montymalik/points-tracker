// components/DepositForm.js
import { useState } from 'react';

export default function DepositForm({ onDeposit }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onDeposit(amount);
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="depositAmount" className="block text-sm font-semibold text-gray-600">
          Deposit Amount ($)
        </label>
        <input
          id="depositAmount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200">
        Deposit
      </button>
    </form>
  );
}

