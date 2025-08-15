import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
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
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 overflow-hidden">
            <img
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.jpg';
              }}
            />
          </div>
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
            {product.subcategory_name || product.category_name}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">
              ({product.total_ratings})
            </span>
          </div>
          
                    <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {product.subcategory_name ? `${product.category_name} > ${product.subcategory_name}` : product.category_name}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 