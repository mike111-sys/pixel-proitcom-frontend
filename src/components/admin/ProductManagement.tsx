import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar } from 'react-icons/fa';
import ProductForm from './ProductForm';

interface Product {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  total_ratings: number;
  category_name: string;
  stock_quantity: number;
  is_featured: boolean;
  is_new: boolean;
}


interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className: string;
}


const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;


  


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products?limit=100`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<ProductList products={products} onDelete={handleDelete} onRefresh={fetchProducts} />} />
      <Route path="/add" element={<ProductForm onSuccess={fetchProducts} />} />
      <Route path="/edit/:id" element={<ProductForm onSuccess={fetchProducts} />} />
    </Routes>
  );
};

const ProductList = ({ products, onDelete, }: { 
  products: Product[]; 
  onDelete: (id: number) => void;
  onRefresh: () => void;
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-xs sm:text-sm" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 text-xs sm:text-sm" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 text-xs sm:text-sm" />);
    }

    return stars;
  };

  const ImageWithLoader = ({ src, alt, className }: ImageWithLoaderProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
  
    useEffect(() => {
      const img = imgRef.current;
      if (img && img.complete) {
        setImageLoaded(true);
      }
    }, []);
  
    const handleImageLoad = () => {
      setImageLoaded(true);
    };
  
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = '/placeholder-product.jpg';
      setImageLoaded(true);
    };
  
    return (
      <div className="relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FaStar className="text-yellow-500 text-sm animate-spin" />
          </div>
        )}
        <img
          ref={imgRef}
          src={src || '/placeholder-product.jpg'}
          alt={alt}
          className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Product Management</h2>
        <Link
          to="/admin/products/add"
          className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto"
        >
          <FaPlus className="mr-2" />
          Add Product
        </Link>
      </div>

      {/* Table for larger screens */}
      <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                
<td className="px-4 sm:px-6 py-4 whitespace-nowrap">
  <div className="flex items-center">
    <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
      <ImageWithLoader
        src={product.image_url}
        alt={product.name}
        className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
      />
    </div>
    <div className="ml-3 sm:ml-4">
      <div className="text-sm font-medium text-gray-900">{product.name}</div>
    </div>
  </div>
</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category_name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.total_ratings})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock_quantity}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {product.is_featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                      {product.is_new && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 cursor-pointer hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card layout for smaller screens */}
      <div className="sm:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
           
<div className="flex items-center mb-3">
  <div className="h-12 w-12 rounded-lg overflow-hidden mr-3">
    <ImageWithLoader
      src={product.image_url}
      alt={product.name}
      className="h-12 w-12 object-cover"
    />
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
    <p className="text-xs text-gray-600">{product.category_name}</p>
  </div>
</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600">Rating</p>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">{renderStars(product.rating)}</div>
                  <span className="text-xs text-gray-600">({product.total_ratings})</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Stock</p>
                <p className="text-xs text-gray-900">{product.stock_quantity}</p>
              </div>
            </div>
            <div className="flex space-x-1 mb-3">
              {product.is_featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
              {product.is_new && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  New
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/product/${product.id}`}
                className="text-blue-600 hover:text-blue-900"
                title="View"
              >
                <FaEye />
              </Link>
              <Link
                to={`/admin/products/edit/${product.id}`}
                className="text-indigo-600 hover:text-indigo-900"
                title="Edit"
              >
                <FaEdit />
              </Link>
              <button
                onClick={() => onDelete(product.id)}
                className="text-red-600 cursor-pointer hover:text-red-900"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;