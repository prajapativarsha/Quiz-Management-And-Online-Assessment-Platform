import Sidebar from "../components/student/Sidebar.jsx";
import Topbar from "../components/student/Topbar.jsx";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function StudentLayout() {
    const {user , logout} = useAuth();
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar user={user} logout={logout} />
        <main className="p-6 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
