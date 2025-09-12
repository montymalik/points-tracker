// components/Header.js (Fixed Version)
export default function Header({ onDashboardClick, onDepositLogClick, onSettingsClick }) {
  const handleAdminClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Header Admin button clicked, calling onSettingsClick');
    if (onSettingsClick) {
      onSettingsClick(e);
    }
    return false;
  };

  return (
    <header className="bg-blue-600 p-6 shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">Allowance Tracker</h1>
        <nav className="space-x-4">
          <button 
            onClick={onDashboardClick}
            type="button"
            className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
          >
            Spending
          </button>
          <button
            onClick={onDepositLogClick}
            type="button"
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
            onClick={handleAdminClick}
            type="button"
            className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  );
}
