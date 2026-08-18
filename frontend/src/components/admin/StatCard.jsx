export default function StatCard({ title, value, color = "bg-blue-500" }) {
  return (
    <div className="rounded-xl p-5 shadow bg-white flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`w-3 h-10 rounded ${color}`} />
    </div>
  );
}
