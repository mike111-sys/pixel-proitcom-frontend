import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CategoryForm from './CategoryForm';
import * as ReactIcons from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  display_order: number;   // 👈 add this
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;


  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<CategoryList categories={categories} onDelete={handleDelete} onRefresh={fetchCategories} />} />
      <Route path="/add" element={<CategoryForm onSuccess={fetchCategories} />} />
      <Route path="/edit/:id" element={<CategoryForm onSuccess={fetchCategories} />} />
    </Routes>
  );
};

const CategoryList = ({ categories, onDelete,  }: { 
  categories: Category[]; 
  onDelete: (id: number) => void;
  onRefresh: () => void;
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Category Management</h2>
        <Link
          to="/admin/categories/add"
          className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto"
        >
          <FaPlus className="mr-2" />
          Add Category
        </Link>
      </div>

      {/* Table for larger screens */}
      <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Order
</th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {(() => {
                        const IconComponent = (ReactIcons as any)[category.icon_name];
                        return IconComponent ? (
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-3" />
                        ) : (
                          <ReactIcons.FaBox className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-3" />
                        );
                      })()}
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/categories/edit/${category.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => onDelete(category.id)}
                        className="text-red-600 cursor-pointer hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      
                    </div>
                    
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  {category.display_order}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card layout for smaller screens */}
      <div className="sm:hidden space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center mb-3">
              {(() => {
                const IconComponent = (ReactIcons as any)[category.icon_name];
                return IconComponent ? (
                  <IconComponent className="w-5 h-5 text-purple-600 mr-3" />
                ) : (
                  <ReactIcons.FaBox className="w-5 h-5 text-purple-600 mr-3" />
                );
              })()}
              <div>
                <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                <p className="text-xs text-gray-600 truncate">{category.description}</p>
                <p className="text-xs text-gray-500">Order: {category.display_order}</p>

              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/admin/categories/edit/${category.id}`}
                className="text-indigo-600 hover:text-indigo-900"
                title="Edit"
              >
                <FaEdit />
              </Link>
              <button
                onClick={() => onDelete(category.id)}
                className="text-red-600 cursor-pointer hover:text-red-900"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;