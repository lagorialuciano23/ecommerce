
export default function DashboardHome() {
  return (
    <div className="grid grid-rows-2 lg:grid-rows-3 gap-6">
      <div className="bg-blue-200 p-6 text-blue-900 rounded-xl shadow">Productos actuales: 0</div>
      <div className="bg-green-200 p-6 text-green-900 rounded-xl shadow">Ordenes actuales: 0</div>
      <div className="bg-orange-200 p-6 text-orange-900 rounded-xl shadow">Usuarios actuales: 0</div>
    </div>
  );
}