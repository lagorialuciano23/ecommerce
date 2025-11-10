export default function StatCard({ title, value, bgColor, textColor }) {
  return (
    <div
      className={`flex flex-col justify-center items-center rounded-2xl shadow-md p-6 ${bgColor} ${textColor}`}
    >
      <p className="text-sm font-semibold tracking-wide">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}