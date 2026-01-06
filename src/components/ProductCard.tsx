import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image_url: string;
    rating: number;
    total_ratings: number;
    category_name: string;
    subcategory_name?: string;
    price: number;
    original_price?: number;
    is_on_sale?: boolean;
    stock_quantity: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
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
    setImageLoaded(true); // Still show the placeholder
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (!product.original_price || !product.price || product.original_price <= product.price) {
      return 0;
    }
    const discount = ((product.original_price - product.price) / product.original_price) * 100;
    return Math.round(discount); // Round to nearest whole number
  };

  const discountPercentage = calculateDiscountPercentage();


  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <div className="w-full h-48 bg-white overflow-hidden flex items-center justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FaStar className="text-yellow-500 text-4xl animate-spin" />
              </div>
            )}
            <img
              ref={imgRef}
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          
          {/* Category badge - left side */}
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            {product.subcategory_name || product.category_name}
          </div>
          
          {/* OFF badge - right side (only show if discount exists) */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
  {product.name}
</h3>

          
        
          
          {/* Price Display */}
          <div className="flex items-center justify-between mt-3">
            {product.price ? (
              <div className="flex items-center space-x-2">
                {product.original_price ? (
                  <>
                    <span className="text-xl font-bold text-gray-900">
                      Ksh {product.price.toFixed(2)}
                    </span>
                    <span className="text-base text-gray-500 line-through">
                      Ksh {product.original_price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    Ksh {product.price.toFixed(2)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500">Price N/A</span>
            )}
          </div>

          {/* Stock Quantity */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Availability:</span>
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
            </div>
            
            {/* Optional: Stock progress bar */}
            {product.stock_quantity > 0 && (
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    product.stock_quantity > 10 
                      ? 'bg-green-500' 
                      : product.stock_quantity > 5 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (product.stock_quantity / 100) * 100)}%` 
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;