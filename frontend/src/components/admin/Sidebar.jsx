import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/quizzes", label: "Quizzes" }, 
  { to: "/admin/categories", label: "Categories" }, 
  { to: "/admin/questions", label: "Questions" },
  { to: "/leaderboard", label: "Leaderboard" }, 
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out 
        md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-wide">Admin Panel</h1>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setIsOpen(false)} // Auto-close on mobile after clicking
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50" 
                  : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}