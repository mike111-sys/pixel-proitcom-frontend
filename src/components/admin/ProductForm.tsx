import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  subcategory_id?: number;
  stock_quantity: number;
  is_featured: boolean;
  is_new: boolean;
  features: Array<{
    feature_name: string;
    feature_value: string;
  }>;
}

interface ProductFormProps {
  onSuccess: () => void;
}

const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category_id: 0,
    subcategory_id: 0,
    stock_quantity: 0,
    is_featured: false,
    is_new: false,
    features: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditing = !!id;

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product.category_id) {
      fetchSubcategories(product.category_id);
    } else {
      setSubcategories([]);
    }
  }, [product.category_id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/subcategories/category/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      const productData = response.data.product;
      setProduct({
        name: productData.name,
        description: productData.description,
        category_id: productData.category_id,
        subcategory_id: productData.subcategory_id || 0,
        stock_quantity: productData.stock_quantity,
        is_featured: productData.is_featured,
        is_new: productData.is_new,
        features: productData.features || []
      });
      if (productData.image_url) {
        setImagePreview(productData.image_url);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
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

  const addFeature = () => {
    setProduct(prev => ({
      ...prev,
      features: [...(prev.features || []), { feature_name: '', feature_value: '' }]
    }));
  };

  const updateFeature = (index: number, field: 'feature_name' | 'feature_value', value: string) => {
    setProduct(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const removeFeature = (index: number) => {
    setProduct(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', product.name || '');
      formData.append('description', product.description || '');
      formData.append('category_id', product.category_id?.toString() || '0');
      formData.append('subcategory_id', product.subcategory_id?.toString() || '0');
      formData.append('stock_quantity', product.stock_quantity?.toString() || '0');
      formData.append('is_featured', product.is_featured?.toString() || 'false');
      formData.append('is_new', product.is_new?.toString() || 'false');

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (product.features) {
        formData.append('features', JSON.stringify(product.features));
      }

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/products', formData);
      }

      onSuccess();
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          to="/admin/products"
          className="flex items-center text-purple-600 hover:text-purple-700 mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={product.name}
                onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={product.description}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={product.category_id}
                onChange={(e) => setProduct(prev => ({ ...prev, category_id: parseInt(e.target.value), subcategory_id: 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={product.subcategory_id}
                  onChange={(e) => setProduct(prev => ({ ...prev, subcategory_id: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={0}>Select a subcategory (optional)</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={product.stock_quantity}
                onChange={(e) => setProduct(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  onChange={(e) => setProduct(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={product.is_new}
                  onChange={(e) => setProduct(prev => ({ ...prev, is_new: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">New Product</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
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
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Product Features</h3>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <FaPlus className="mr-2" />
              Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {product.features?.map((feature, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Feature name"
                  value={feature.feature_name}
                  onChange={(e) => updateFeature(index, 'feature_name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Feature value"
                  value={feature.feature_value}
                  onChange={(e) => updateFeature(index, 'feature_value', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 