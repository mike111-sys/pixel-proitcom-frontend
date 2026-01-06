import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaStar, FaPhone, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string; // Keep for backward compatibility
  rating: number;
  total_ratings: number;
  category_name: string;
  stock_quantity: number;
  price: number | null;
  original_price: number | null;
  is_on_sale: boolean;
  features: Array<{
    feature_name: string;
    feature_value: string;
  }>;
  images?: Array<{ // Add this
    id: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
}


interface SimilarProduct {
  id: number;
  name: string;
  price: number | null;
  original_price: number | null;
  is_on_sale: boolean;
  image_url: string;
  rating: number;
  total_ratings: number;
  category_name: string;
  stock_quantity: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [currentImage, setCurrentImage] = useState('');


// Add this useEffect to set initial current image
useEffect(() => {
  if (product) {
    if (product.images && product.images.length > 0) {
      // Find primary image or use first image
      const primaryImage = product.images.find(img => img.is_primary);
      setCurrentImage(primaryImage ? primaryImage.image_url : product.images[0].image_url);
    } else if (product.image_url) {
      setCurrentImage(product.image_url);
      setCurrentImageIndex(0);
    }
  }
}, [product]);

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

const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/placeholder-product.jpg';
};

  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder-product.jpg';
    setImageLoaded(true); // Still show the placeholder
  };




  const handleCall = () => {
    window.location.href = 'tel:0713731333';
  };

  const handleAddToCart = () => {
    if (product) {
      // Use current image or first available image
      const cartImage = currentImage || 
                       (product.images && product.images[0]?.image_url) || 
                       product.image_url;
      
      addToCart({
        id: product.id,
        name: product.name,
        image_url: cartImage,
        price: product.price,
        original_price: product.original_price,
        is_on_sale: product.is_on_sale
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
          {/* Product Images Gallery */}
<div className="bg-white rounded-lg shadow-md p-6">
  {/* Main Image */}
  <div className="w-full h-96 bg-white overflow-hidden flex items-center justify-center relative mb-4">
    {!imageLoaded && (
      <div className="absolute inset-0 flex items-center justify-center">
        <FaStar className="text-yellow-500 text-7xl animate-spin" />
      </div>
    )}
    <img
      ref={imgRef}
      src={currentImage || product.image_url || '/placeholder-product.jpg'}
      alt={product.name}
      className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={handleImageLoad}
      onError={handleImageError}
      loading='lazy'
    />
    
    {/* Navigation arrows if multiple images */}
    {product.images && product.images.length > 1 && (
      <>
        <button
          onClick={() => {
            if (product.images) {
              const newIndex = currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1;
              setCurrentImageIndex(newIndex);
              setCurrentImage(product.images[newIndex].image_url);
              setImageLoaded(false);
            }
          }}
          className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={() => {
            if (product.images) {
              const newIndex = currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1;
              setCurrentImageIndex(newIndex);
              setCurrentImage(product.images[newIndex].image_url);
              setImageLoaded(false);
            }
          }}
          className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
        >
          <FaArrowRight />
        </button>
      </>
    )}
  </div>
  
  {/* Thumbnail Gallery */}
  {product.images && product.images.length > 1 && (
    <div className="flex space-x-2 overflow-x-auto py-2 px-1">
      {product.images.map((img, index) => (
        <button
          key={img.id}
          onClick={() => {
            setCurrentImageIndex(index);
            setCurrentImage(img.image_url);
            setImageLoaded(false);
          }}
          className={`flex-shrink-0 cursor-pointer w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
            currentImage === img.image_url 
              ? 'border-purple-600 ring-2 ring-purple-300' 
              : 'border-gray-300 hover:border-purple-400'
          }`}
        >
          <img
            src={img.image_url}
            alt={`${product.name} ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleThumbnailError}
          />
        </button>
      ))}
    </div>
  )}
</div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
        

            {/* Category */}
            <div className="text-lg text-gray-600 mb-6">
              Category: <span className="font-semibold text-purple-600">{product.category_name}</span>
            </div>

            <span className={`font-medium ${
                product.stock_quantity > 10 
                  ? 'text-green-600' 
                  : product.stock_quantity > 0 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}>
                {product.stock_quantity > 0 
                  ? `${product.stock_quantity} units left` 
                  : 'Out of stock'}
              </span>

{/* Price */}
<div className="mb-6 mt-3">
  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
    {product.price ? (
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Current Price */}
        <span className="text-lg sm:text-2xl">
          Ksh {product.price.toFixed(2)}
        </span>

        {/* Original Price & Discount */}
        {product.is_on_sale && product.original_price && product.original_price > product.price && (
          <>
            <span className="text-sm sm:text-xl text-gray-500 line-through">
              Ksh {product.original_price.toFixed(2)}
            </span>
            <span className="text-xs sm:text-sm font-semibold bg-red-100 text-red-800 px-2 py-1 rounded-full whitespace-nowrap">
              SAVE Ksh {(product.original_price - product.price).toFixed(2)}
            </span>
          </>
        )}
      </div>
    ) : (
      <span className="text-gray-500 text-base sm:text-lg">Price not available</span>
    )}
  </div>

  {/* Sale Badge */}
  {product.is_on_sale && product.original_price && (
    <div className="text-xs sm:text-sm md:text-base text-green-600 font-semibold">
      ✓ On Sale - Limited Time Offer
    </div>
  )}
</div>


         {/* Availability */}
<div className="mb-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
    <span className="text-lg font-semibold text-gray-800">Availability:</span>
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold text-center sm:text-left ${
        (Number(product.stock_quantity) || 0) > 0
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {(Number(product.stock_quantity) || 0) > 0 ? 'In Stock' : 'Out of Stock'}
    </span>
  </div>

  {(Number(product.stock_quantity) || 0) > 0 && (
    <button
      onClick={handleCall}
      className="w-full sm:w-auto cursor-pointer bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
    >
      <FaPhone className="mr-2" />
      Call to Confirm: 0713731333
    </button>
  )}
</div>

{/* Description */}
<div className="mb-6">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Description</h3>
  <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
    {product.description}
  </p>
</div>

{/* Add to Cart */}
{(Number(product.stock_quantity) || 0) > 0 && (
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 gap-2 sm:gap-0">
      <label className="text-gray-700 font-semibold">Quantity:</label>
      <select
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {Array.from({ length: Math.min(10, Number(product.stock_quantity) || 0) }, (_, i) => i + 1).map(
          (num) => (
            <option key={num} value={num}>
              {num}
            </option>
          )
        )}
      </select>
    </div>
    <button
      onClick={handleAddToCart}
      className="w-full sm:w-auto cursor-pointer bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
    >
      Add to Cart
    </button>
  </div>
)}

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
                <ProductCard key={product.id} product={{
                  ...product,
                  price: product.price ?? 0,             
                  original_price: product.original_price ?? undefined, 
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 