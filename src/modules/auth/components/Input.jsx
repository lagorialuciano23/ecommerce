import React from 'react';
import { Link } from 'react-router-dom';

export default function Input({
  label,
  id,
  name,
  type = 'text',
  register,
  validationRules,
  errors,
  autoComplete,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-white mb-2">{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        // 1. Registra el input con react-hook-form
        {...register(name, validationRules)}
      />
      {/* 2. Muestra el error dinámicamente usando el 'name'
           (errors['user'] o errors['password'])
      */}
      {errors[name] && (
        <p className='text-red-500 pt-2 text-sm'>{errors[name].message}</p>
      )}
    </div>
  );
}