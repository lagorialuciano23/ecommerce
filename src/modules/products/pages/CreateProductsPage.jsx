import ProductsForm from '../components/ProductsForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateProductsPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setShowSuccess(true);
    // Redirigir al listado después de 2 seg
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/admin/products');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Producto</h1>

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            ¡Producto creado exitosamente!
          </div>
        )}

        <ProductsForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}