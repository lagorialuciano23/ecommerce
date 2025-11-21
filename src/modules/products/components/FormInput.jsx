export default function FormInput({ id, label, type = 'text', register, error, validation = {}, inputProps = {} }) {
  const commonClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200";
  const errorClasses = "border-red-500 focus:ring-red-500";
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          {...register(id, validation)}
          className={`${commonClasses} min-h-[100px] ${error ? errorClasses : ''}`}
          {...inputProps}
        />
      ) : (
        <input
          id={id}
          type={type}
          {...register(id, validation)}
          className={`${commonClasses} ${error ? errorClasses : ''}`}
          {...inputProps}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}


