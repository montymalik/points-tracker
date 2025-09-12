// components/Header.js (Flexible Version)
export default function Header({ 
  pageType = 'home', // 'home' or 'points'
  onDashboardClick, 
  onDepositLogClick, 
  onSettingsClick 
}) {
  // Home page header (original functionality)
  const HomeHeader = () => (
    <header className="bg-blue-600 p-6 shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">Allowance Tracker</h1>
        <nav className="space-x-4">
          <button 
            onClick={onDashboardClick}
            className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
          >
            Spending
          </button>
          <button
            onClick={onDepositLogClick}
            className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
          >
            Deposit Log
          </button>
          <a
            href="/points"
            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200 inline-block"
          >
            Points System
          </a>
          <button
            onClick={onSettingsClick}
            className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  );

  // Points page header (simplified with only 2 buttons)
  const PointsHeader = () => (
    <header className="bg-blue-600 p-6 shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">Allowance Tracker</h1>
        <nav className="space-x-4">
          <a
            href="/"
            className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
          >
            Allowance
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSettingsClick && onSettingsClick(e);
            }}
            className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
            type="button"
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  );

  // Return the appropriate header based on pageType
  return pageType === 'points' ? <PointsHeader /> : <HomeHeader />;
}
