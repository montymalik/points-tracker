// components/TransactionForm.js

import { useState } from 'react';

export default function TransactionForm({ onSubmit }) {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('Video Games');
  const [transactionType, setTransactionType] = useState('Deposit');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount, category, transactionType });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">{transactionType} Money</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600" htmlFor="amount">
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Video Games">Video Games</option>
          <option value="General Spending">General Spending</option>
        </select>
      </div>

      <div className="mb-6 flex justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {transactionType}
        </button>
        <button
          type="button"
          onClick={() => setTransactionType(transactionType === 'Deposit' ? 'Withdraw' : 'Deposit')}
          className="text-blue-600 font-semibold"
        >
          Switch to {transactionType === 'Deposit' ? 'Withdraw' : 'Deposit'}
        </button>
      </div>
    </form>
  );
}

