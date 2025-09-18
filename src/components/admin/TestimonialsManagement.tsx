// components/admin/TestimonialManagement.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, MessageSquare } from 'lucide-react';
import { FaTrash } from 'react-icons/fa';

type Testimonial = {
  id: number;
  name: string;
  email: string;
  content: string;
  created_at: string;
};

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/testimonials?limit=100`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/testimonials`, newTestimonial, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      const newTestimonialData = {
        ...response.data,
        created_at: new Date().toISOString()
      };
      setTestimonials(prev => [newTestimonialData, ...prev]);
      setNewTestimonial({ name: '', email: '', content: '' });
    } catch (error) {
      console.error('Error adding testimonial:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await axios.delete(`${API_URL}/api/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews Management</h2>
            <p className="text-sm text-gray-600">Add and manage client reviews</p>
          </div>
        </div>
      </div>

      {/* Add Testimonial Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter client name"
                required
                disabled={uploading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={newTestimonial.email}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, email: e.target.value })}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="client@example.com"
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Review Content</label>
          <textarea
            value={newTestimonial.content}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-32 resize-y"
            placeholder="What does your client say about your service? Share their experience, feedback, and results..."
            required
            disabled={uploading}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full cursor-pointer py-3 px-6 rounded-lg font-medium transition-colors ${
            uploading
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
        >
          {uploading ? 'Adding review...' : 'Add Review'}
        </button>
      </form>

      {/* Existing Testimonials */}
      <div>
        <h4 className="text-xl font-semibold mb-4 border-b-2 border-yellow-400 pb-2 inline-block">
          Existing Reviews ({testimonials.length})
        </h4>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-lg">
                    <User className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{testimonial.name}</h5>
                    {testimonial.email && (
                      <p className="text-sm text-gray-500 truncate">{testimonial.email}</p>
                    )}
                    <p className="text-gray-700 mt-2 leading-relaxed">"{testimonial.content}"</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTestimonial(testimonial.id)}
                className="ml-4 cursor-pointer flex-shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                title="Delete testimonial"
              >
                <FaTrash className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first client testimonial.</p>
          
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialManagement;