import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaArrowRight, FaPhone } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';

interface Product {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  price: number | null;
  total_ratings: number;
  category_name: string;
  stock_quantity: number;
  original_price?: number | null;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {

      const API_URL = import.meta.env.VITE_API_URL;


      try {
        const [featuredRes, newRes] = await Promise.all([
          axios.get(`${API_URL}/api/products/featured`),
          axios.get(`${API_URL}/api/products/new`)
        ]);

        setFeaturedProducts(featuredRes.data);
        setNewProducts(newRes.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCall = () => {
    window.location.href = 'tel:0713731333';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-500 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg font-semibold max-w-2xl mx-auto">
              Discover our handpicked selection of premium products that our customers love
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  price: product.price ?? 0,
                  stock_quantity: product.stock_quantity ?? 0,
                  original_price: product.original_price ?? undefined,
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>No featured products available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
            >
              View All Products
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-500 mb-4">New Arrivals</h2>
            <p className="text-gray-600 text-lg font-semibold max-w-2xl mx-auto">
              Check out our latest products that just arrived
            </p>
          </div>

          {newProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  price: product.price ?? 0,
                  stock_quantity: product.stock_quantity ?? 0,
                  original_price: product.original_price ?? undefined,
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>No new products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

     {/* Call to Action */}
     <section className="py-16 bg-gradient-to-r from-yellow-100 to-yellow-200 text-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl mb-8 text-gray-600">
            Call us directly for personalized assistance and product inquiries
          </p>
          <button
            onClick={handleCall}
            className="bg-white cursor-pointer text-gray-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <FaPhone className="mr-2" />
            Call 0713731333 / 0737713333
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;