// components/Rewards.js
import { useState, useEffect } from 'react';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const fetchPointsBalance = async () => {
    try {
      const res = await fetch('/api/points-balance');
      if (res.ok) {
        const data = await res.json();
        setPointsBalance(data.totalPoints);
      }
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRewards(), fetchPointsBalance()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRedeem = async (rewardId) => {
    try {
      const res = await fetch('/api/reward-redemptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });

      if (res.ok) {
        const reward = rewards.find(r => r.id === rewardId);
        setPointsBalance(prev => prev - reward.pointsCost);
        alert(`Successfully redeemed: ${reward.name}! 🎉`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward');
    }
  };

  const canAfford = (cost) => pointsBalance >= cost;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">Rewards Store</h2>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-block">
          <span className="font-semibold">Available Points: {pointsBalance}</span>
        </div>
      </div>

      {rewards.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rewards available. Ask an administrator to add some rewards!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const affordable = canAfford(reward.pointsCost);
            return (
              <div
                key={reward.id}
                className={`border rounded-lg p-4 transition-colors ${
                  affordable 
                    ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="mb-3">
                  <h3 className={`font-semibold text-lg ${affordable ? 'text-gray-900' : 'text-gray-500'}`}>
                    {reward.name}
                  </h3>
                  {reward.description && (
                    <p className={`text-sm ${affordable ? 'text-gray-600' : 'text-gray-400'}`}>
                      {reward.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-lg ${affordable ? 'text-blue-600' : 'text-gray-400'}`}>
                    {reward.pointsCost} pts
                  </span>
                  <button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={!affordable}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      affordable
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {affordable ? 'Redeem' : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
