import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsService } from '../services/productsService';
import ProductCard from '../components/ProductCard'; // ¡Reutilizamos la card pública!

export default function ProductDetailPage() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usamos el servicio que ya existe
        const response = await productsService.getById(id);

        // Verificamos si el producto está activo
        if (!response.IsActive) {
          throw new Error('Este producto no está disponible.');
        }

        setProduct(response);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-white">Cargando producto...</p>;
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-900 bg-opacity-50 rounded-lg max-w-md mx-auto">
          <p className="text-lg text-red-300">Error:</p>
          <p className="text-white">{error}</p>
        </div>
      );
    }

    if (!product) {
      return <p className="text-center text-white">Producto no encontrado.</p>;
    }

    // Renderizamos la card pública, pero más grande
    return (
      <div className="max-w-md mx-auto">
        <ProductCard product={product} />
      </div>
    );
  };

  return (
    <div className="container mx-auto text-white">
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-400 hover:text-blue-300"
        >
          &larr; Volver al Catálogo
        </Link>
      </div>

      {renderContent()}
    </div>
  );
}