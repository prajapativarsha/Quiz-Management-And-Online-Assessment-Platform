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

export default function Sidebar() {
  return (
    <aside className="w-64 h-auto bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
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
