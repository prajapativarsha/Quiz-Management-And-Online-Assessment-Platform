import { useState } from "react";
import Sidebar from "../components/admin/Sidebar.jsx";
import Topbar from "../components/admin/Topbar.jsx";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Topbar 
          user={user} 
          logout={logout} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}