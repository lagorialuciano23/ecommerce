
export default function StatCard({ title, value, bgColor, textColor, icon: Icon }) {
  return (
    <div
      className={`flex flex-col justify-center items-center rounded-2xl shadow-md p-6 ${bgColor} ${textColor}`}
    >
      {Icon && (
        <div className="mb-3">
          <Icon className="w-10 h-10" strokeWidth={2} />
        </div>
      )}
      
      <p className="text-sm font-semibold tracking-wide text-center">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}