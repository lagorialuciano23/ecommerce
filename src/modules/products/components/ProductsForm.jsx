import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { productsService } from '../services/productsService';
import FormInput from './FormInput';

function ProductsForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // convertir los tipos de datos apropiadamente
      const productData = {
        sku: data.sku || null,
        internalCode: data.internalCode || null,
        name: data.name || null,
        description: data.description || null,
        currentUnitPrice: parseFloat(data.currentUnitPrice),
        stockQuantity: parseInt(data.stockQuantity, 10),
        imageUrl: data.imageUrl || null,
      };

      await productsService.create(productData);
      reset(); // uso para limpiar el form

      if (onSuccess) onSuccess();
    } catch (error) {
      setSubmitError(error.message || 'Error al crear el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <FormInput
        id="sku"
        label="SKU"
        register={register}
        error={errors.sku}
        validation={{ required: 'El SKU es requerido' }}
        inputProps={{ placeholder: 'SKU-...' }}
      />

      <FormInput
        id="imageUrl"
        label="URL de la Imagen (opcional)"
        register={register}
        error={errors.imageUrl}
        validation={{ pattern: {
          value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
          message: 'Por favor, ingresa una URL válida',
        },
        }}
        inputProps={{ placeholder: 'https://ejemplo.com/imagen.png' }}
      />

      <FormInput
        id="internalCode"
        label="Código Interno"
        register={register}
        error={errors.internalCode}
        inputProps={{ placeholder: 'INT-...' }}
      />

      <FormInput
        id="name"
        label="Nombre del Producto"
        register={register}
        error={errors.name}
        validation={{ required: 'El nombre es requerido' }}
      />

      <FormInput
        id="description"
        label="Descripción"
        type="textarea"
        register={register}
        error={errors.description}
      />

      <FormInput
        id="currentUnitPrice"
        label="Precio Unitario Actual"
        type="number"
        register={register}
        error={errors.currentUnitPrice}
        validation={{
          required: 'El precio es requerido',
          min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
        }}
        inputProps={{ step: '0.01', placeholder: '0.00' }}
      />

      <FormInput
        id="stockQuantity"
        label="Cantidad en Stock"
        type="number"
        register={register}
        error={errors.stockQuantity}
        validation={{
          required: 'La cantidad en stock es requerida',
          min: { value: 0, message: 'El stock no puede ser negativo' },
        }}
        inputProps={{ step: '1' }}
      />

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
      >
        {isSubmitting ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  );
}

export default ProductsForm;