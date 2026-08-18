import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService.js";
import StatCard from "../../components/admin/StatCard.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
      <StatCard title="Students" value={stats.totalStudents} color="bg-green-500" />
      <StatCard title="Admins" value={stats.totalAdmins} color="bg-purple-500" />
      <StatCard title="Total Quizzes" value={stats.totalQuizzes} color="bg-yellow-500" />
      <StatCard title="Total Attempts" value={stats.totalAttempts} color="bg-red-500" />
    </div>
  );
}
