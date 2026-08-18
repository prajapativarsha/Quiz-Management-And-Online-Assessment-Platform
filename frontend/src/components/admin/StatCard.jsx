export default function StatCard({ title, value, color = "bg-blue-500" }) {
  // Map standard tailwind bg colors to softer badge backgrounds
  const badgeStyles = {
    "bg-blue-500": "bg-blue-50",
    "bg-green-500": "bg-green-50",
    "bg-purple-500": "bg-purple-50",
    "bg-yellow-500": "bg-amber-50",
    "bg-red-500": "bg-red-50",
  };
  
  const activeBadge = badgeStyles[color] || "bg-gray-50";

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* Left accent border */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-center justify-between pl-2">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeBadge}`}>
          <div className={`w-3.5 h-3.5 rounded-full ${color} shadow-sm`} />
        </div>
      </div>
    </div>
  );
}
