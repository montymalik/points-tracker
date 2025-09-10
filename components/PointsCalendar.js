// components/PointsCalendar.js
import { useState, useEffect } from 'react';

export default function PointsCalendar({ onDateSelect, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailyPoints, setDailyPoints] = useState({});
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchMonthlyPoints = async (month) => {
    try {
      setLoading(true);
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const res = await fetch(
        `/api/daily-points?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
      );
      
      if (res.ok) {
        const data = await res.json();
        const pointsMap = {};
        data.forEach(day => {
          pointsMap[day.date] = day.totalPoints;
        });
        setDailyPoints(pointsMap);
      }
    } catch (error) {
      console.error('Error fetching monthly points:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyPoints(currentMonth);
  }, [currentMonth]);

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
              return <div key={index} className="h-12"></div>;
            }

            const dateStr = formatDate(date);
            const points = dailyPoints[dateStr] || 0;
            const hasPoints = points > 0;

            return (
              <button
                key={index}
                onClick={() => onDateSelect(date)}
                className={`
                  h-12 flex flex-col items-center justify-center text-xs border rounded-lg transition-colors
                  ${isSelected(date) 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : isToday(date)
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : hasPoints
                    ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                <span className="font-medium">{date.getDate()}</span>
                {hasPoints && (
                  <span className={`text-xs ${isSelected(date) ? 'text-white' : 'text-green-600'}`}>
                    {points}pt
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Click a date to view tasks for that day
      </div>
    </div>
  );
}
