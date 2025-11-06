import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { FaStar } from "react-icons/fa";


const API = import.meta.env.VITE_API_URL;

type Blog = {
  id: number;
  title: string;
  cover_image: string | null;
  created_at: string;
};

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch blogs
  useEffect(() => {
    fetch(`${API}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched blogs:', data); // Debug log
        setBlogs(data);
      })
      .catch(err => console.error('Error fetching blogs:', err));
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden py-12">
 

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-1.5  bg-yellow-100 text-green-800 px-4 py-2 rounded-full text-xs font-medium border border-green-200 mb-4"
          >
            <Sparkles className="w-3 h-3 text-yellow-600" />
            Innovations & Trends
          </motion.div>

          {/* Main Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4"
          >
            Latest
            <span className="block bg-gradient-to-r text-yellow-500 bg-clip-text">
              Blog Page
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto"
          >
Discover the latest insights, tips, and updates on electronic gadgets. 
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer min-h-[260px] max-h-[320px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                {/* Image Container */}
                <div className="h-36 bg-gradient-to-br from-green-100 to-yellow-100 p-2 relative overflow-hidden flex items-center justify-center">
  {!loadedImages[blog.id] && (
    <div className="absolute inset-0 flex items-center justify-center">
      <FaStar className="text-yellow-500 text-3xl animate-spin" />
    </div>
  )}

  {blog.cover_image ? (
    <img
      loading="lazy"
      src={`${API}/api/uploads/blog-images/${blog.cover_image}`}
      alt={blog.title}
      className={`w-full h-full object-contain rounded-md transition-opacity duration-300 ${
        loadedImages[blog.id] ? "opacity-100" : "opacity-0"
      }`}
      onLoad={() =>
        setLoadedImages((prev) => ({ ...prev, [blog.id]: true }))
      }
      onError={(e) => {
        e.currentTarget.style.display = "none";
        const parent = e.currentTarget.parentElement;
        if (parent) {
          const placeholder = document.createElement("div");
          placeholder.className =
            "w-full h-full bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center rounded-md flex-col text-green-600 font-medium";
          placeholder.innerHTML = `
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM6.5 17.5l3.5-4.5 2.5 3.01L16.5 11l4.5 6.5H6.5z"/>
            </svg>
            <span class="mt-1 text-xs">Blog Page</span>
          `;
          parent.appendChild(placeholder);
        }
      }}
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center rounded-md flex-col text-green-600 font-medium">
      <BookOpen className="w-6 h-6" />
      <span className="mt-1 text-xs">Blog Page</span>
    </div>
  )}
</div>


                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-green-500" />
                    <span>
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium text-green-600">
                      View Blog
                    </span>
                    <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-500 to-yellow-500"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center py-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-sm mx-auto border border-green-200 shadow-md">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Coming Soon!</h3>
              <p className="text-gray-600 text-base leading-relaxed">
              Our blog keeps you informed on new arrivals, product reviews, buying guides, and tech trends. Stay ahead and make smarter choices when shopping for your favorite gadgets.              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-green-600 font-medium text-sm">
                <Sparkles className="w-3 h-3" />
                Stay tuned for amazing content
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;