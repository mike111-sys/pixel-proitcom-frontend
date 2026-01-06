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
  price: number | null;
  original_price: number | null;
  is_on_sale: boolean;
  features: Array<{
    feature_name: string;
    feature_value: string;
  }>;
}

interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
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
  const [loadingSubcategories, setLoadingSubcategories] = useState(false); // Add this
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category_id: 0,
    subcategory_id: 0,
    stock_quantity: 0,
    is_featured: false,
    is_new: false,
    price: null,
    original_price: null,
    is_on_sale: true,
    features: []
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>>([]);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);
  const [newPrimaryImageIndex, setNewPrimaryImageIndex] = useState<number>(0);
const [primaryImageId, setPrimaryImageId] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;


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
      setLoadingSubcategories(false); // Ensure loading is false when no category selected
    }
  }, [product.category_id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId: number) => {
    try {
      setLoadingSubcategories(true); // Start loading
      const response = await axios.get(`${API_URL}/api/subcategories/category/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]); // Clear subcategories on error
    } finally {
      setLoadingSubcategories(false); // End loading
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      const productData = response.data.product;
      setProduct({
        name: productData.name,
        description: productData.description,
        category_id: productData.category_id,
        subcategory_id: productData.subcategory_id || 0,
        stock_quantity: productData.stock_quantity,
        is_featured: productData.is_featured,
        is_new: productData.is_new,
        price: productData.price,
        original_price: productData.original_price,
        is_on_sale: productData.is_on_sale,
        features: productData.features || []
      });
  
      if (productData.images) {
        const images: ProductImage[] = productData.images;
      
        setExistingImages(images);
      
        const primaryImg = images.find((img: ProductImage) => img.is_primary);
        if (primaryImg) {
          setPrimaryImageId(primaryImg.id);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
  
    setImageFiles(prev => [...prev, ...files]);
  
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
  };
  
  const removeImage = (index: number) => {
    // If removing what was marked as primary for new images, reassign
    if (index === newPrimaryImageIndex && imagePreviews.length > 1) {
      setNewPrimaryImageIndex(0); // Set first remaining image as primary
    }
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (id: number) => {
    // If deleting the primary image, reassign primary to the first remaining image
    if (id === primaryImageId && existingImages.length > 1) {
      const remainingImages = existingImages.filter(img => img.id !== id);
      if (remainingImages.length > 0) {
        setPrimaryImageId(remainingImages[0].id);
      }
    }
    
    setExistingImages(prev => prev.filter(img => img.id !== id));
    setDeletedImages(prev => [...prev, id]);
  };

  const setImageAsPrimary = (id: number) => {
    setPrimaryImageId(id);
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

// Add this validation function
const validateForm = () => {
  // Check for at least one image
  if (existingImages.length === 0 && imageFiles.length === 0) {
    alert('Please upload at least one image for the product.');
    return false;
  }
  
  // Check product name
  if (!product.name || product.name.trim() === '') {
    alert('Product name is required.');
    return false;
  }
  
  // Check price
  if (!product.price || product.price <= 0) {
    alert('Please enter a valid price.');
    return false;
  }
  
  return true;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('name', product.name || '');
    formData.append('description', product.description || '');
    formData.append('category_id', product.category_id?.toString() || '0');
    formData.append('subcategory_id', product.subcategory_id?.toString() || '0');
    formData.append('stock_quantity', product.stock_quantity?.toString() || '0');
    formData.append('price', product.price?.toString() || '');
    formData.append('original_price', product.original_price?.toString() || '');
    formData.append('is_on_sale', '1');
    formData.append('is_featured', product.is_featured ? '1' : '0');
    formData.append('is_new', product.is_new ? '1' : '0');

    // Append multiple images
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    // Append deleted images if any
    if (deletedImages.length > 0) {
      formData.append('deleted_images', JSON.stringify(deletedImages));
    }

    // For editing: Determine primary image
    if (isEditing) {
      if (primaryImageId !== null && primaryImageId > 0) {
        // Existing image marked as primary (ID is positive)
        formData.append('primary_image_id', primaryImageId.toString());
      } else if (primaryImageId !== null && primaryImageId < 0) {
        // New image marked as primary (negative ID)
        // Convert negative ID to index: -1 -> 0, -2 -> 1, etc.
        const newIndex = Math.abs(primaryImageId) - 1;
        formData.append('new_primary_image_index', newIndex.toString());
      }
    } else {
      // For new products: first image is primary by default
      if (imageFiles.length > 0) {
        formData.append('new_primary_image_index', '0');
      }
    }

    if (product.features) {
      formData.append('features', JSON.stringify(product.features));
    }

    if (isEditing) {
      await axios.put(`${API_URL}/api/products/${id}`, formData);
    } else {
      if (imageFiles.length === 0) {
        alert('Please upload at least one image for the product.');
        setLoading(false);
        return;
      }
      await axios.post(`${API_URL}/api/products`, formData);
    }

    onSuccess();
    navigate('/admin/products');
  } catch (error) {
    console.error('Error saving product:', error);
  } finally {
    setLoading(false);
  }
};


  // Simple spinner component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
  </div>
);

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

          {/* Subcategory Selection */}
{product.category_id ? (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Subcategory *
    </label>
    <div className="flex space-x-2">
      {loadingSubcategories ? (
        <div className="flex-1 flex items-center justify-center p-2 border border-gray-300 rounded-lg">
          <Spinner />
        </div>
      ) : (
        <>
          <select
            required
            value={product.subcategory_id || ''}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                subcategory_id: parseInt(e.target.value),
              }))
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>

          {/* Add Subcategory Button */}
          <button
            type="button"
            onClick={() => navigate('/admin/categories/subcategories/add')}
            className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaPlus className="mr-1" /> Add
          </button>
        </>
      )}
    </div>
  </div>
) : (
  <div className="flex items-center space-x-2">
    <p className="text-sm text-red-600">
      Select a category first to see subcategories
    </p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Current Price in Ksh *
    </label>
    <input
      type="number"
      step="0.01"
      min="0"
      required
      value={product.price || ''}
      onChange={(e) => setProduct(prev => ({ 
        ...prev, 
        price: e.target.value ? parseFloat(e.target.value) : null,
        // Automatically set is_on_sale to true when price is entered
        is_on_sale: true
      }))}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Original Price in Ksh (Optional)
    </label>
    <input
      type="number"
      step="0.01"
      min="0"
      value={product.original_price || ''}
      onChange={(e) => setProduct(prev => ({ 
        ...prev, 
        original_price: e.target.value ? parseFloat(e.target.value) : null,
        // Always on sale when original price exists
        is_on_sale: true
      }))}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <p className="text-xs text-gray-500 mt-1">
      If provided, shows as strikethrough price. Leave empty for regular pricing.
    </p>
  </div>
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

        {/* Multiple Images Upload */}
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Product Images (Upload multiple)
    </label>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImagesChange}
      className="w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <p className="text-xs text-gray-500 mt-1">
      You can select multiple images. First image will be set as primary.
    </p>
  </div>

 {/* Existing Images */}
{existingImages.length > 0 && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Existing Images (Click to set as primary)
    </label>
    <div className="grid grid-cols-4 gap-2">
      {existingImages.map((img) => (
        <div 
          key={img.id} 
          className={`relative cursor-pointer ${primaryImageId === img.id ? 'ring-2 ring-purple-600' : ''}`}
          onClick={() => setImageAsPrimary(img.id)}
        >
          <img
            src={img.image_url}
            alt={`Product ${img.id}`}
            className="w-full h-24 object-cover rounded-lg border border-gray-300"
          />
          {primaryImageId === img.id ? (
            <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              Primary
            </span>
          ) : (
            <span className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-70">
              Set Primary
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the primary click
              removeExistingImage(img.id);
            }}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
          >
            <FaTrash size={12} />
          </button>
        </div>
      ))}
    </div>
    <p className="text-xs text-gray-500 mt-1">
      Click on an image to set it as primary (shown first on product page)
    </p>
  </div>
)}

 {/* New Images Preview */}
{imagePreviews.length > 0 && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      New Images ({imagePreviews.length}) - Click to set as primary
    </label>
    <div className="grid grid-cols-4 gap-2">
    {imagePreviews.map((preview, index) => (
  <div
    key={index}
    className={`relative cursor-pointer ${
      (isEditing && primaryImageId === -(index + 1))
        ? 'ring-2 ring-purple-600'
        : ''
    }`}
    onClick={() => {
      if (isEditing) {
        // For editing: set new image as primary using negative IDs
        setPrimaryImageId(-(index + 1));
      } else {
        // For new products: set primary normally
        setNewPrimaryImageIndex(index);
      }
    }}
  >
    <img
      src={preview}
      alt={`Preview ${index + 1}`}
      className="w-full h-24 object-contain rounded-lg border border-gray-300"
    />

    <span
      className={`absolute top-1 left-1 text-xs px-2 py-1 rounded ${
        (isEditing && primaryImageId === -(index + 1))
          ? 'bg-purple-600 text-white'
          : 'bg-gray-600 text-white opacity-70'
      }`}
    >
      {(isEditing && primaryImageId === -(index + 1)) ? 'New Primary' : 'Set as Primary'}
    </span>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        removeImage(index);
      }}
      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
    >
      <FaTrash size={12} />
    </button>
  </div>
))}
    </div>
    <p className="text-xs text-gray-500 mt-1">
  {isEditing ? (
    <>Click on any image (existing or new) to set it as primary. New images will only become primary after saving.</>
  ) : (
    <>First image is automatically set as primary. Click to change primary image.</>
  )}
</p>
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
              className="flex cursor-pointer items-center text-purple-600 hover:text-purple-700"
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
                  className="px-3 cursor-pointer py-2 text-red-600 hover:text-red-700"
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
            className="bg-purple-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 