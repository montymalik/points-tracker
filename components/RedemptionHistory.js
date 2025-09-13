// components/RedemptionHistory.js - Enhanced Version
import { useState, useEffect } from 'react';

export default function RedemptionHistory() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('all');

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

  // Get unique months from redemptions for filtering
  const getAvailableMonths = () => {
    const months = new Set();
    redemptions.forEach(redemption => {
      const date = new Date(redemption.redeemedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  // Filter redemptions based on selected month
  const getFilteredRedemptions = () => {
    if (selectedMonth === 'all') {
      return redemptions;
    }
    
    return redemptions.filter(redemption => {
      const date = new Date(redemption.redeemedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthKey === selectedMonth;
    });
  };

  // Calculate statistics
  const getStats = () => {
    const filtered = getFilteredRedemptions();
    const totalPointsSpent = filtered.reduce((sum, r) => sum + r.pointsSpent, 0);
    const totalRedemptions = filtered.length;
    const avgPointsPerRedemption = totalRedemptions > 0 ? Math.round(totalPointsSpent / totalRedemptions) : 0;
    
    return {
      totalPointsSpent,
      totalRedemptions,
      avgPointsPerRedemption,
    };
  };

  const formatMonthLabel = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading redemption history...</div>
      </div>
    );
  }

  const filteredRedemptions = getFilteredRedemptions();
  const stats = getStats();
  const availableMonths = getAvailableMonths();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">Redemption History</h2>
        
        {/* Month Filter */}
        {availableMonths.length > 0 && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            {availableMonths.map(month => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Statistics Cards */}
      {redemptions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600 text-sm font-medium">Total Points Spent</div>
            <div className="text-red-800 text-2xl font-bold">{stats.totalPointsSpent}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-600 text-sm font-medium">Total Redemptions</div>
            <div className="text-blue-800 text-2xl font-bold">{stats.totalRedemptions}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-purple-600 text-sm font-medium">Avg Points/Redemption</div>
            <div className="text-purple-800 text-2xl font-bold">{stats.avgPointsPerRedemption}</div>
          </div>
        </div>
      )}
      
      {filteredRedemptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {selectedMonth === 'all' 
            ? "No rewards redeemed yet. Start earning points to unlock rewards!"
            : `No rewards redeemed in ${formatMonthLabel(selectedMonth)}.`
          }
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRedemptions.map((redemption) => (
            <div
              key={redemption.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">🎁</span>
                  </div>
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
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-gray-500">
                        {new Date(redemption.redeemedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(redemption.redeemedDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="font-bold text-red-600 text-lg">-{redemption.pointsSpent}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
