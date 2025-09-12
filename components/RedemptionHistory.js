// components/RedemptionHistory.js
import { useState, useEffect } from 'react';

export default function RedemptionHistory() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRedemptions = async () => {
    try {
      const res = await fetch('/api/reward-redemptions');
      if (res.ok) {
        const data = await res.json();
        setRedemptions(data);
      }
    } catch (error) {
      console.error('Error fetching redemptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading redemption history...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Redemption History</h2>
      
      {redemptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rewards redeemed yet. Start earning points to unlock rewards!
        </div>
      ) : (
        <div className="space-y-4">
          {redemptions.map((redemption) => (
            <div
              key={redemption.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {redemption.reward ? redemption.reward.name : 'Deleted Reward'}
                  </h3>
                  {!redemption.reward && (
                    <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                {redemption.reward?.description && (
                  <p className="text-sm text-gray-600">{redemption.reward.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Redeemed on {new Date(redemption.redeemedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-red-600">-{redemption.pointsSpent} pts</span>
                <p className="text-xs text-gray-500">
                  {/* Show original points spent, not current reward cost */}
                  Original cost
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
