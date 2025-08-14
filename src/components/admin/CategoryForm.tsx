import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

interface CategoryFormProps {
  onSuccess: () => void;
}

const CategoryForm = ({ onSuccess }: CategoryFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/categories/${id}`);
      const categoryData = response.data;
      setCategory({
        name: categoryData.name,
        description: categoryData.description
      });
      if (categoryData.image_url) {
        setImagePreview(categoryData.image_url);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', category.name || '');
      formData.append('description', category.description || '');

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/categories/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/categories', formData);
      }

      onSuccess();
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          to="/admin/categories"
          className="flex items-center text-purple-600 hover:text-purple-700 mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Categories
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={category.name}
              onChange={(e) => setCategory(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={category.description}
              onChange={(e) => setCategory(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm; 