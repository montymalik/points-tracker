// components/DailyTasks.js
import { useState, useEffect } from 'react';

export default function DailyTasks({ selectedDate = new Date(), onPointsUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayOfWeek = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchCompletions = async () => {
    try {
      const res = await fetch(`/api/task-completions?date=${formatDate(selectedDate)}`);
      if (res.ok) {
        const data = await res.json();
        const completedIds = new Set(data.map(completion => completion.taskId));
        setCompletedTasks(completedIds);
        
        const dailyTotal = data.reduce((sum, completion) => sum + completion.pointsEarned, 0);
        setTotalPoints(dailyTotal);
      }
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchCompletions()]);
      setLoading(false);
    };
    loadData();
  }, [selectedDate]);

  const handleTaskToggle = async (taskId, isCompleted) => {
    try {
      if (isCompleted) {
        // Complete task
        const res = await fetch('/api/task-completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, date: formatDate(selectedDate) }),
        });
        
        if (res.ok) {
          setCompletedTasks(prev => new Set([...prev, taskId]));
          const task = tasks.find(t => t.id === taskId);
          const newDailyTotal = totalPoints + task.points;
          setTotalPoints(newDailyTotal);
          
          // Notify parent component about points update
          if (onPointsUpdate) {
            onPointsUpdate(task.points);
          }
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to complete task');
        }
      } else {
        // Remove completion
        const res = await fetch('/api/task-completions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, date: formatDate(selectedDate) }),
        });
        
        if (res.ok) {
          setCompletedTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(taskId);
            return newSet;
          });
          const task = tasks.find(t => t.id === taskId);
          const newDailyTotal = totalPoints - task.points;
          setTotalPoints(newDailyTotal);
          
          // Notify parent component about points update
          if (onPointsUpdate) {
            onPointsUpdate(-task.points);
          }
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to remove task completion');
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  const isToday = formatDate(selectedDate) === formatDate(new Date());

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">
          Daily Tasks - {getDayOfWeek(selectedDate)}
        </h2>
        <p className="text-gray-600 mb-2">
          {selectedDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block">
          <span className="font-semibold">Daily Points: {totalPoints}</span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks available. Ask an administrator to add some tasks!
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isCompleted = completedTasks.has(task.id);
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                    disabled={!isToday}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <div>
                    <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.name}
                    </h3>
                    {task.description && (
                      <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                  +{task.points} pts
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isToday && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ You can only complete tasks for today. This is a past/future date view.
          </p>
        </div>
      )}
    </div>
  );
}
