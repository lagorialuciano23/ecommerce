import React from 'react';

/**
 * Un componente <select> reutilizable para formularios,
 * integrado con React Hook Form.
 */
export default function AuthSelect({
  label,
  id,
  name,
  register,
  validationRules,
  errors,
  options,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-white mb-2">{label}</label>
      <select
        id={id}
        className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        // 1. Registra el select con react-hook-form
        {...register(name, validationRules)}
      >
        {/* 2. Mapea las opciones pasadas como props */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* 3. Muestra el error dinámicamente */}
      {errors[name] && (
        <p className='text-red-500 pt-2 text-sm'>{errors[name].message}</p>
      )}
    </div>
  );
}