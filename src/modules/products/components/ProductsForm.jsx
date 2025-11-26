import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';
import { productsService } from '../services/productsService';
import { productErrorMap } from '../helpers/productErrorMap';
import FormInput from './FormInput';

function ProductsForm({ onSuccess, productToEdit }) {
  //Determinar si estamos en modo "edición"
  const isEditMode = !!productToEdit;
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    //Usamos 'defaultValues' para poblar el formulario si estamos editando
    //Añadimos 'isActive: true' como default para el modo CREAR
    defaultValues: productToEdit || { isActive: true },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Usamos useEffect para poblar el formulario cuando los datos lleguen
  // Esto es clave si 'productToEdit' se carga de forma asíncrona
  useEffect(() => {
    if (isEditMode) {
      // 'reset' actualiza los valores del formulario
      reset(productToEdit);
    }
  }, [productToEdit, isEditMode, reset]);

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
        isActive: data.isActive,
      };

      //DEBUGGER
      console.log('Objeto enviado al backend:', productData);

      if (isEditMode) {
        // --- MODO EDICIÓN ---
        // Usamos el ID del producto original y el servicio de 'update'
        await productsService.update(productToEdit.id, productData);
      } else {
        // --- MODO CREACIÓN ---
        await productsService.create(productData);
        reset(); // Limpiar el form solo al crear
      }

      if (onSuccess) onSuccess(); // Llamar al callback de éxito
    } catch (error) {
      // 'error' ahora es el objeto { code, message } de Axios
      const friendlyMessage = productErrorMap[error.code] || error.message || 'Error al guardar el producto';

      setSubmitError(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white p-6 rounded-lg ">
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
        inputProps={{ step: '1', min: 0 }}
      />
      <div className="mb-4">
        <label htmlFor="isActive" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            id="isActive"
            type="checkbox"
            {...register('isActive')} // Registramos el checkbox
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          ¿Producto Activo?
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Si no está activo, no aparecerá en el catálogo público.
        </p>
      </div>
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      {/* Cambiamos el texto del botón según el modo */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
        w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800 
        disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
      >
        {isSubmitting
          ? (isEditMode ? 'Actualizando...' : 'Creando...')
          : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')
        }
      </button>
    </form>
  );
}

export default ProductsForm;