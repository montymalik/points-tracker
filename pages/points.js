// pages/points.js - Final Working Version
import { useState, useEffect } from 'react';
import DailyTasks from '../components/DailyTasks';
import PointsCalendar from '../components/PointsCalendar';
import Rewards from '../components/Rewards';
import RedemptionHistory from '../components/RedemptionHistory';
import SettingsModal from '../components/SettingsModal';

export default function PointsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('tasks');
  const [pointsBalance, setPointsBalance] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
    fetchPointsBalance();
    const interval = setInterval(fetchPointsBalance, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentView('tasks');
  };

  const handlePointsUpdate = (pointsChange) => {
    setPointsBalance(prevBalance => {
      const newBalance = prevBalance + pointsChange;
      return Math.max(0, newBalance);
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tasks':
        return (
          <DailyTasks 
            selectedDate={selectedDate} 
            onPointsUpdate={handlePointsUpdate}
          />
        );
      case 'rewards':
        return (
          <Rewards 
            pointsBalance={pointsBalance}
            onPointsUpdate={handlePointsUpdate}
          />
        );
      case 'history':
        return <RedemptionHistory />;
      default:
        return (
          <DailyTasks 
            selectedDate={selectedDate} 
            onPointsUpdate={handlePointsUpdate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Points Page Header - Custom implementation to avoid Header component issues */}
      <header className="bg-blue-600 p-6 shadow-lg text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Allowance Tracker</h1>
          <nav className="space-x-4">
            <a
              href="/"
              className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              Spending
            </a>
            <a
              href="/"
              className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              Deposit Log
            </a>
            <span className="bg-purple-500 text-white py-2 px-4 rounded-lg">
              Points System
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSettingsModal(true);
              }}
              className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
              type="button"
            >
              Admin
            </button>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Settings Modal */}
        {showSettingsModal && (
          <SettingsModal
            currentValues={{
              videoGames: 0,
              generalSpending: 0,
              charity: 0,
              savings: 0,
            }}
            initialTab="tasks"
            onClose={() => setShowSettingsModal(false)}
            onSave={async () => {
              await fetchPointsBalance();
              setShowSettingsModal(false);
            }}
          />
        )}

        {/* Points Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Points System</h1>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl inline-block">
            <span className="text-2xl font-bold">Total Points: {pointsBalance}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-1 flex space-x-1">
            <button
              onClick={() => setCurrentView('tasks')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'tasks'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Daily Tasks
            </button>
            <button
              onClick={() => setCurrentView('rewards')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'rewards'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rewards Store
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Redemption History
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PointsCalendar 
              onDateSelect={handleDateSelect} 
              selectedDate={selectedDate} 
            />
            
            <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points:</span>
                  <span className="font-semibold text-blue-600">{pointsBalance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Date:</span>
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {renderCurrentView()}
          </div>
        </div>
      </main>
    </div>
  );
}
