// components/PointsCalendar.js - Enhanced Version
import { useState, useEffect } from 'react';

export default function PointsCalendar({ onDateSelect, selectedDate, pointsBalance }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchMonthlyData = async (month) => {
    try {
      setLoading(true);
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      // Fetch daily points earned from task completions
      const pointsRes = await fetch(
        `/api/daily-points?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
      );
      
      // Fetch reward redemptions for the month
      const redemptionsRes = await fetch('/api/reward-redemptions');
      
      if (pointsRes.ok && redemptionsRes.ok) {
        const pointsData = await pointsRes.json();
        const redemptionsData = await redemptionsRes.json();
        
        // Create a map of daily data
        const dataMap = {};
        
        // Add points earned data
        pointsData.forEach(day => {
          dataMap[day.date] = {
            ...dataMap[day.date],
            pointsEarned: day.totalPoints,
            completedTasks: day.completedTasks,
          };
        });
        
        // Add redemption data (filter by month)
        redemptionsData.forEach(redemption => {
          const redemptionDate = formatDate(new Date(redemption.redeemedDate));
          if (redemptionDate >= formatDate(startDate) && redemptionDate <= formatDate(endDate)) {
            if (!dataMap[redemptionDate]) {
              dataMap[redemptionDate] = {};
            }
            if (!dataMap[redemptionDate].redemptions) {
              dataMap[redemptionDate].redemptions = [];
            }
            dataMap[redemptionDate].redemptions.push({
              pointsSpent: redemption.pointsSpent,
              rewardName: redemption.reward ? redemption.reward.name : 'Deleted Reward',
            });
          }
        });
        
        setDailyData(dataMap);
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData(currentMonth);
  }, [currentMonth]);

  // Refetch data when pointsBalance changes (for real-time updates)
  useEffect(() => {
    const today = formatDate(new Date());
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Only refetch if today is in the current displayed month
    if (today >= formatDate(currentMonthStart) && today <= formatDate(currentMonthEnd)) {
      fetchMonthlyData(currentMonth);
    }
  }, [pointsBalance]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return formatDate(date) === formatDate(selectedDate);
  };

  const getDayData = (date) => {
    if (!date) return null;
    const dateStr = formatDate(date);
    return dailyData[dateStr] || {};
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading calendar...</div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-16"></div>;
            }

            const dayData = getDayData(date);
            const pointsEarned = dayData.pointsEarned || 0;
            const redemptions = dayData.redemptions || [];
            const hasActivity = pointsEarned > 0 || redemptions.length > 0;

            // Calculate total points spent on redemptions for this day
            const totalPointsSpent = redemptions.reduce((sum, r) => sum + r.pointsSpent, 0);

            return (
              <button
                key={index}
                onClick={() => onDateSelect(date)}
                className={`
                  h-16 flex flex-col items-center justify-center text-xs border rounded-lg transition-colors relative
                  ${isSelected(date) 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : isToday(date)
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : hasActivity
                    ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                <span className="font-medium">{date.getDate()}</span>
                
                {/* Points Earned */}
                {pointsEarned > 0 && (
                  <span className={`text-xs font-semibold ${
                    isSelected(date) ? 'text-white' : 'text-green-600'
                  }`}>
                    +{pointsEarned}
                  </span>
                )}
                
                {/* Redemptions Indicator */}
                {redemptions.length > 0 && (
                  <div className={`text-xs font-semibold ${
                    isSelected(date) ? 'text-white' : 'text-red-600'
                  }`}>
                    -{totalPointsSpent}
                  </div>
                )}
                
                {/* Activity indicator dots */}
                {hasActivity && (
                  <div className="absolute top-1 right-1 flex space-x-1">
                    {pointsEarned > 0 && (
                      <div className={`w-2 h-2 rounded-full ${
                        isSelected(date) ? 'bg-white' : 'bg-green-500'
                      }`}></div>
                    )}
                    {redemptions.length > 0 && (
                      <div className={`w-2 h-2 rounded-full ${
                        isSelected(date) ? 'bg-white' : 'bg-red-500'
                      }`}></div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Points Earned</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Rewards Redeemed</span>
          </div>
        </div>
        <div className="text-center mt-2">Click a date to view details</div>
      </div>
    </div>
  );
}
