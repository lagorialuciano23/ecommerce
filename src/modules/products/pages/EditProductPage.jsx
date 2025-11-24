import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsService } from '../services/productsService';
import ProductsForm from '../components/ProductsForm'; // Reutilizamos el form

// Helper para mapear PascalCase (API) a camelCase (Form)
const mapApiToForm = (product) => {
  return {
    id: product.Id, // Mantenemos el Id para el 'update'
    sku: product.Sku,
    internalCode: product.InternalCode,
    name: product.Name,
    description: product.Description,
    currentUnitPrice: product.CurrentUnitPrice,
    stockQuantity: product.StockQuantity,
    imageUrl: product.ImageUrl,
    isActive: product.IsActive,
  };
};

export default function EditProductPage() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Efecto para cargar los datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const product = await productsService.getById(id);

        // Mapeamos los datos al formato que espera el formulario
        setProductData(mapApiToForm(product));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Callback de éxito para el formulario
  const handleSuccess = () => {
    setShowSuccess(true);
    // Redirigimos al listado después de 2 segundos
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/admin/products');
    }, 2000);
  };

  // --- Renderizado ---

  if (isLoading) {
    return <p className="text-center text-white">Cargando producto...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto p-4 rounded">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Editar Producto
        </h1>

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            ¡Producto actualizado exitosamente!
          </div>
        )}

        {/* Renderizamos el formulario pasándole los datos del producto */}
        {productData && (
          <ProductsForm
            onSuccess={handleSuccess}
            productToEdit={productData}
          />
        )}
      </div>
    </div>
  );
}