import { useNavigate } from 'react-router-dom';

export default function Topbar({ user, logout, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-8 z-10">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button (Mobile Only) */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
          Welcome back, <span className="text-indigo-600">{user?.name || 'Admin'}</span>
        </h2>
      </div>

      <button 
        onClick={handleLogout}
        className="px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 shrink-0"
      >
        Logout
      </button>
    </header>
  );
}