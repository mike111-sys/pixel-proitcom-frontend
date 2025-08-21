import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CategoryForm from './CategoryForm';
import SubcategoryForm from './SubcategoryForm';
import * as ReactIcons from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  display_order: number;
}

interface Subcategory {
  id: number;
  name: string;
  description: string;
  category_id: number;
  icon_name: string;
  category_name?: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/subcategories`)
      ]);
      setCategories(categoriesRes.data);
      setSubcategories(subcategoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all its subcategories.')) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`);
        fetchData();
      } catch (error: any) {
        console.error('Error deleting category:', error);
        alert(error.response?.data?.error || 'Error deleting category');
      }
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await axios.delete(`${API_URL}/api/subcategories/${id}`);
        fetchData();
      } catch (error: any) {
        console.error('Error deleting subcategory:', error);
        alert(error.response?.data?.error || 'Error deleting subcategory');
      }
    }
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
      <Route path="/" element={
        <CategoryList 
          categories={categories} 
          subcategories={subcategories}
          expandedCategories={expandedCategories}
          onDeleteCategory={handleDeleteCategory}
          onDeleteSubcategory={handleDeleteSubcategory}
          onToggleCategory={toggleCategory}
          onRefresh={fetchData} 
        />
      } />
      <Route path="/add" element={<CategoryForm onSuccess={fetchData} />} />
      <Route path="/edit/:id" element={<CategoryForm onSuccess={fetchData} />} />
      <Route path="/subcategories/add" element={<SubcategoryForm onSuccess={fetchData} />} />
      <Route path="/subcategories/edit/:id" element={<SubcategoryForm onSuccess={fetchData} />} />
    </Routes>
  );
};

const CategoryList = ({ 
  categories, 
  subcategories,
  expandedCategories,
  onDeleteCategory,
  onDeleteSubcategory,
  onToggleCategory
}: { 
  categories: Category[]; 
  subcategories: Subcategory[];
  expandedCategories: number[];
  onDeleteCategory: (id: number) => void;
  onDeleteSubcategory: (id: number) => void;
  onToggleCategory: (id: number) => void;
  onRefresh: () => void;
}) => {
  const getSubcategoriesByCategory = (categoryId: number) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Category Management</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/admin/categories/add"
            className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto mb-2 sm:mb-0"
          >
            <FaPlus className="mr-2" />
            Add Category
          </Link>
          <Link
            to="/admin/categories/subcategories/add"
            className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto"
          >
            <FaPlus className="mr-2" />
            Add Subcategory
          </Link>
        </div>
      </div>

      {/* Categories with subcategories */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        {categories.map((category) => {
          const categorySubcategories = getSubcategoriesByCategory(category.id);
          const isExpanded = expandedCategories.includes(category.id);
          
          return (
            <div key={category.id} className="border-b border-gray-200 last:border-b-0">
            
            {/* Header */}
<div className="flex items-center justify-between p-4 hover:bg-gray-50">
  <div 
    className="flex items-center cursor-pointer flex-grow"
    onClick={() => onToggleCategory(category.id)}
  >
    {(() => {
      const IconComponent = (ReactIcons as any)[category.icon_name];
      return IconComponent ? (
        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-3" />
      ) : (
        <ReactIcons.FaBox className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-3" />
      );
    })()}
    <div>
      <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
    </div>
  </div>
  


  <div className="flex items-center space-x-2">
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
      {categorySubcategories.length} subcategories
    </span>
    
 {/* Display order */}
 <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
    Order: {category.display_order}
  </span>


    {/* Edit and Delete buttons for category */}
    <div className="flex space-x-2 ml-2">
      <Link
        to={`/admin/categories/edit/${category.id}`}
        className="text-blue-600 hover:text-blue-800"
        title="Edit Category"
      >
        <FaEdit className="w-4 h-4" />
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the expand/collapse
          onDeleteCategory(category.id);
        }}
        className="text-red-600 cursor-pointer hover:text-red-800"
        title="Delete Category"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
    
  </div>
</div>

              {/* Subcategories */}
              {isExpanded && (
                <div className="bg-gray-50 p-4">
                  <div className="mb-2 flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Subcategories</h4>
                    <Link
                      to={`/admin/categories/subcategories/add?category=${category.id}`}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      + Add Subcategory
                    </Link>
                  </div>
                  
                  {categorySubcategories.length > 0 ? (
                    <div className="space-y-2">
                      {categorySubcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center justify-between bg-white p-3 rounded border">
                          <div className="flex items-center">
                            {(() => {
                              const IconComponent = (ReactIcons as any)[subcategory.icon_name];
                              return IconComponent ? (
                                <IconComponent className="w-4 h-4 text-green-600 mr-2" />
                              ) : (
                                <ReactIcons.FaBox className="w-4 h-4 text-green-600 mr-2" />
                              );
                            })()}
                            <span className="text-sm">{subcategory.name}</span>
                            {subcategory.description && (
                              <span className="text-xs text-gray-500 ml-2">- {subcategory.description}</span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/admin/categories/subcategories/edit/${subcategory.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => onDeleteSubcategory(subcategory.id)}
                              className="text-red-600 cursor-pointer hover:text-red-800 text-sm"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No subcategories found</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All Subcategories Table (for larger screens) */}
      <div className=" sm:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">All Subcategories</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subcategory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
        
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subcategories.map((subcategory) => (
                <tr key={subcategory.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {(() => {
                        const IconComponent = (ReactIcons as any)[subcategory.icon_name];
                        return IconComponent ? (
                          <IconComponent className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <ReactIcons.FaBox className="w-4 h-4 text-green-600 mr-2" />
                        );
                      })()}
                      <div className="text-sm font-medium text-gray-900">{subcategory.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subcategory.category_name}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        to={`/admin/categories/subcategories/edit/${subcategory.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => onDeleteSubcategory(subcategory.id)}
                        className="text-red-600 cursor-pointer hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;