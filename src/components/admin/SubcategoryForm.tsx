import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import * as ReactIcons from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

interface SubcategoryFormData {
  name: string;
  description: string;
  category_id: number;
  icon_name: string;
}

const SubcategoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState<SubcategoryFormData>({
    name: '',
    description: '',
    category_id: 0,
    icon_name: 'FaBox'
  });

  // Add this useEffect to handle category ID from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    if (categoryId && !isEditing) {
      setFormData(prev => ({ ...prev, category_id: parseInt(categoryId) }));
    }
  }, []);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCategories();
    
    if (isEditing) {
      fetchSubcategory();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
      
      // Set first category as default if not editing
      if (!isEditing && response.data.length > 0) {
        setFormData(prev => ({ ...prev, category_id: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchSubcategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subcategories/${id}`);
      const subcategory = response.data;
      setFormData({
        name: subcategory.name,
        description: subcategory.description || '',
        category_id: subcategory.category_id,
        icon_name: subcategory.icon_name || 'FaBox'
      });
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      setError('Failed to load subcategory');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/subcategories/${id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/subcategories`, formData);
      }
      
      onSuccess();
      navigate('/admin/categories');
    } catch (error: any) {
      console.error('Error saving subcategory:', error);
      setError(error.response?.data?.error || 'Failed to save subcategory');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Get all available React icons
  const iconOptions = Object.keys(ReactIcons)
    .filter(key => key.startsWith('Fa') && key !== 'Fa')
    .sort();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/categories')}
          className="flex items-center cursor-pointer text-purple-600 hover:text-purple-800 mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter subcategory name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <div className="flex items-center space-x-4">
              <select
                name="icon_name"
                value={formData.icon_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {iconOptions.map(icon => {
                  const IconComponent = (ReactIcons as any)[icon];
                  return (
                    <option key={icon} value={icon}>
                      {/* Show icon next to the name in the dropdown */}
                      {IconComponent ? (
                        <span className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-2 text-purple-600" />
                          {icon}
                        </span>
                      ) : (
                        icon
                      )}
                    </option>
                  );
                })}
              </select>
              <div className="flex-shrink-0">
                {(() => {
                  const IconComponent = (ReactIcons as any)[formData.icon_name];
                  return IconComponent ? (
                    <IconComponent className="w-6 h-6 text-purple-600" />
                  ) : (
                    <ReactIcons.FaBox className="w-6 h-6 text-purple-600" />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 cursor-pointer bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
          >
            <FaSave className="mr-2" />
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')} Subcategory
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubcategoryForm;