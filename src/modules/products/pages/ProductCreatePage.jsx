import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { productsService } from '../services/productsService';

// Reutilizamos los componentes de 'auth'
import AuthInput from '../../auth/components/Input';
import AuthSubmitButton from '../../auth/components/Button';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange', // Validar al cambiar
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Usamos el servicio de productos que ya mapea los datos
      await productsService.create(data);

      // ¡Éxito! Navegamos de vuelta al listado
      navigate('/admin/products');

    } catch (error) {
      setApiError(error.message);
      console.error('Error al crear el producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="mb-4">
        <Link
          to="/admin/products" //
          className="inline-block rounded-md bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700 transition"
        >
          &larr; Volver al Listado
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>

      {/* Usamos el mismo estilo de formulario que en Login */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-xl
          flex flex-col
          p-6 md:p-8
          gap-4 md:gap-8
          w-full
          md:max-w-lg mx-auto
          shadow-xl border border-white border-opacity-20'
      >

        {/* --- CAMPOS DEL PRODUCTO --- */}

        <AuthInput
          label="Nombre del Producto"
          id="name"
          name="name"
          register={register}
          errors={errors}
          validationRules={{
            required: 'El nombre es obligatorio',
          }}
        />

        <AuthInput
          label="SKU"
          id="sku"
          name="sku"
          register={register}
          errors={errors}
          validationRules={{
            required: 'El SKU es obligatorio',
          }}
        />

        <AuthInput
          label="Código Interno"
          id="internalCode"
          name="internalCode"
          register={register}
          errors={errors}
          validationRules={{
            required: 'El código interno es obligatorio',
          }}
        />

        <AuthInput
          label="Descripción"
          id="description"
          name="description"
          register={register}
          errors={errors}
          validationRules={{
            required: 'La descripción es obligatoria',
          }}
        />

        <AuthInput
          label="Precio (ej: 150.99)"
          id="currentUnitPrice"
          name="currentUnitPrice"
          type="number"
          step="0.01" // Para permitir decimales
          register={register}
          errors={errors}
          validationRules={{
            required: 'El precio es obligatorio',
            valueAsNumber: true,
            min: { value: 0.01, message: 'El precio debe ser mayor a 0' },
          }}
        />

        <AuthInput
          label="Stock"
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          register={register}
          errors={errors}
          validationRules={{
            required: 'El stock es obligatorio',
            valueAsNumber: true,
            min: { value: 0, message: 'El stock no puede ser negativo' },
          }}
        />

        {/* --- FIN DE CAMPOS --- */}

        {apiError && (
          <p className='text-red-400 p-2 bg-red-900 bg-opacity-50 rounded-lg text-center text-sm'>
            {apiError}
          </p>
        )}

        <AuthSubmitButton isLoading={isLoading} isValid={isValid} text="Crear Producto" />

      </form>
    </div>
  );
}