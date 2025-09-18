import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Quote, User } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

type Testimonial = {
  id: number;
  name: string;
  email: string;
  content: string;
  created_at: string;
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API}/api/testimonials`);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        console.log('Fetched testimonials:', data); // Debug log
        setTestimonials(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const
      }
    }
  };

  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 relative overflow-hidden">
        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-30"
          style={{ zIndex: 0 }}
        />
        <div className="relative z-10 text-center py-12 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-yellow-200">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Testimonials</h2>
          <p className="text-sm text-gray-600">Fetching client feedback...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 relative overflow-hidden">
        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-30"
          style={{ zIndex: 0 }}
        />
        <div className="relative z-10 text-center py-12 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-yellow-200">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Testimonials</h2>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-yellow-600 text-white rounded-full font-medium hover:bg-yellow-700 transition-colors duration-200 text-sm"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 relative overflow-hidden">
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
        style={{ zIndex: 0 }}
      />

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-16 right-8 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-48 left-8 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-28 h-28 bg-yellow-300 rounded-full mix-blend-multiply blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-xs font-medium border border-yellow-200 mb-4"
          >
            <Quote className="w-3 h-3 text-yellow-600" />
            Client Feedback
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3"
          >
            What Our
            <span className="block bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
              Clients Say
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base text-gray-700 leading-relaxed max-w-xl mx-auto"
          >
            Hear from those who’ve been satisfied by our services and products.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-yellow-200 shadow-md"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Testimonials Yet</h3>
            <p className="text-sm text-gray-600">Check back later for client feedback.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative bg-white rounded-lg shadow-md border border-gray-200 p-5 min-h-[220px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Quote className="w-5 h-5 text-yellow-300 absolute top-3 right-3" />
                <div className="mb-4 flex-grow">
                  <p className="text-sm text-gray-700 italic line-clamp-4">"{testimonial.content}"</p>
                </div>
                <div className="flex items-center mt-auto">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-yellow-100 rounded-full flex items-center justify-center mr-2">
                    <User className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-500 mt-3"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;