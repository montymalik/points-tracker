// components/AdminRewards.js
import { useState, useEffect } from 'react';

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: ''
  });

  const fetchRewards = async () => {
    try {
      const res = await fetch('/api/rewards');
      if (res.ok) {
        const data = await res.json();
        setRewards(data);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.pointsCost) {
      alert('Name and points cost are required');
      return;
    }

    try {
      const url = '/api/rewards';
      const method = editingReward ? 'PUT' : 'POST';
      const body = editingReward 
        ? { ...formData, id: editingReward.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setFormData({ name: '', description: '', pointsCost: '' });
        setShowAddForm(false);
        setEditingReward(null);
        fetchRewards();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save reward');
      }
    } catch (error) {
      console.error('Error saving reward:', error);
      alert('Failed to save reward');
    }
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description || '',
      pointsCost: reward.pointsCost.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (rewardId) => {
    if (!confirm('Are you sure you want to delete this reward? This will also remove all redemption records.')) {
      return;
    }

    try {
      const res = await fetch('/api/rewards', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rewardId }),
      });

      if (res.ok) {
        fetchRewards();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete reward');
      }
    } catch (error) {
      console.error('Error deleting reward:', error);
      alert('Failed to delete reward');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', pointsCost: '' });
    setShowAddForm(false);
    setEditingReward(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Manage Rewards</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Add New Reward
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="text-lg font-medium mb-4">
            {editingReward ? 'Edit Reward' : 'Add New Reward'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Extra Screen Time"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional description"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points Cost *
              </label>
              <input
                type="number"
                value={formData.pointsCost}
                onChange={(e) => setFormData(prev => ({ ...prev, pointsCost: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 50"
                min="1"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {editingReward ? 'Update Reward' : 'Add Reward'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
          >
            <div>
              <h4 className="font-medium text-gray-900">{reward.name}</h4>
              {reward.description && (
                <p className="text-sm text-gray-600">{reward.description}</p>
              )}
              <span className="text-sm text-red-600 font-medium">{reward.pointsCost} points</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(reward)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(reward.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No rewards created yet. Add your first reward above!
        </div>
      )}
    </div>
  );
}
