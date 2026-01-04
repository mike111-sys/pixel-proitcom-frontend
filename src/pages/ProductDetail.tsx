import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaStar, FaStarHalfAlt, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  rating: number;
  total_ratings: number;
  category_name: string;
  stock_quantity: number;
  features: Array<{
    feature_name: string;
    feature_value: string;
  }>;
}

interface SimilarProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating: number;
  total_ratings: number;
  category_name: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);


  // Add state and ref for image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {

      const API_URL = import.meta.env.VITE_API_URL;


      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        
        setProduct(response.data.product);
        setSimilarProducts(response.data.similarProducts);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);


  // Check if image is already loaded
  useEffect(() => {
    const img = imgRef.current;
    
    if (img && img.complete) {
      setImageLoaded(true);
    }
  }, [product]);

  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder-product.jpg';
    setImageLoaded(true); // Still show the placeholder
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-lg" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-lg" />
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300 text-lg" />
      );
    }

    return stars;
  };

  const handleRatingSubmit = async () => {
    if (userRating === 0) return;

    const API_URL = import.meta.env.VITE_API_URL;


    try {
      await axios.post(`${API_URL}/api/products/${id}/rate`, {
        rating: userRating
      });
      
      // Refresh product data to show updated rating
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data.product);
      setUserRating(0);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:0713731333';
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        image_url: product.image_url
      }, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
            <Link
              to="/products"
              className="inline-flex items-center text-purple-600 hover:text-purple-700"
            >
              <FaArrowLeft className="mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-purple-600 hover:text-purple-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-full h-96 bg-white overflow-hidden flex items-center justify-center relative">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaStar className="text-yellow-500 text-7xl animate-spin" />
                </div>
              )}
              <img
                ref={imgRef}
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading='lazy'
              />
            </div>
          

          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">
                {(Number(product.rating) || 0).toFixed(1)} ({Number(product.total_ratings) || 0} ratings)
              </span>
            </div>

            {/* Category */}
            <div className="text-lg text-gray-600 mb-6">
              Category: <span className="font-semibold text-purple-600">{product.category_name}</span>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-800">Availability:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  (Number(product.stock_quantity) || 0) > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {(Number(product.stock_quantity) || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {(Number(product.stock_quantity) || 0) > 0 && (
                <button
                  onClick={handleCall}
                  className="w-full cursor-pointer bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <FaPhone className="mr-2" />
                  Call to Confirm: 0713731333
                </button>
              )}
            </div>

            {/* Add to Cart */}
            {(Number(product.stock_quantity) || 0) > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="text-gray-700 font-semibold">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Array.from({ length: Math.min(10, Number(product.stock_quantity) || 0) }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full cursor-pointer bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Rate Product */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rate this product</h3>
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`text-2xl ${
                      star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <button
                  onClick={handleRatingSubmit}
                  className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Submit Rating
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Features</h2>
            <div className="grid grid-cols-1 gap-4">
              {product.features.map((feature, index) => (
                <div key={index} className="flex justify-between py-2 gap-10 lg:gap-30 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">{feature.feature_name}:</span>
                  <span className="text-gray-600">{feature.feature_value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 