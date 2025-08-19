import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import * as ReactIcons from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  description: string;
  icon_name: string;
}

interface CategoryFormProps {
  onSuccess: () => void;
}

// List of available icons for categories
const availableIcons = [
  { name: 'FaBox', label: 'Box' },
  { name: 'FaMobile', label: 'Mobile' },
  { name: 'FaTshirt', label: 'T-Shirt' },
  { name: 'FaHome', label: 'Home' },
  { name: 'FaFutbol', label: 'Sports' },
  { name: 'FaBook', label: 'Book' },
  { name: 'FaCar', label: 'Car' },
  { name: 'FaLaptop', label: 'Laptop' },
  { name: 'FaHeadphones', label: 'Headphones' },
  { name: 'FaCamera', label: 'Camera' },
  { name: 'FaGamepad', label: 'Gaming' },
  { name: 'FaDumbbell', label: 'Fitness' },
  { name: 'FaUtensils', label: 'Food' },
  { name: 'FaBaby', label: 'Baby' },
  { name: 'FaHeart', label: 'Health' },
  { name: 'FaPalette', label: 'Art' },
  { name: 'FaMusic', label: 'Music' },
  { name: 'FaTools', label: 'Tools' },
  { name: 'FaGift', label: 'Gift' },
  { name: 'FaStar', label: 'Star' },
  { name: 'FaGem', label: 'Jewelry' },
  { name: 'FaLeaf', label: 'Nature' },
  { name: 'FaPlane', label: 'Travel' },
  { name: 'FaGraduationCap', label: 'Education' },
  { name: 'FaBriefcase', label: 'Business' },
  { name: 'FaCog', label: 'Technology' },
  { name: 'FaShoppingBag', label: 'Shopping' },
  { name: 'FaMedal', label: 'Awards' },
  { name: 'FaLightbulb', label: 'Ideas' },
  { name: 'FaRocket', label: 'Innovation' },
  { name: 'FaGlobe', label: 'World' },
  { name: 'FaClock', label: 'Time' },
  { name: 'FaMap', label: 'Location' },
  { name: 'FaPhone', label: 'Phone' },
  { name: 'FaEnvelope', label: 'Email' },
  { name: 'FaUser', label: 'User' },
  { name: 'FaUsers', label: 'Users' },
  { name: 'FaCrown', label: 'Premium' },
  { name: 'FaFire', label: 'Hot' },
  { name: 'FaSnowflake', label: 'Cold' },
  { name: 'FaSun', label: 'Sun' },
  { name: 'FaMoon', label: 'Night' },
  { name: 'FaCloud', label: 'Cloud' },
  { name: 'FaRainbow', label: 'Colorful' },
  { name: 'FaTree', label: 'Tree' },
  { name: 'FaSeedling', label: 'Plant' },
  { name: 'FaFish', label: 'Fish' },
  { name: 'FaDog', label: 'Dog' },
  { name: 'FaCat', label: 'Cat' },
  { name: 'FaHorse', label: 'Horse' },
  { name: 'FaBug', label: 'Bug' },
  { name: 'FaSpider', label: 'Spider' },
  { name: 'FaBatteryFull', label: 'Battery' },
  { name: 'FaWifi', label: 'WiFi' },
  { name: 'FaBluetooth', label: 'Bluetooth' },
  { name: 'FaSatellite', label: 'Satellite' },
  { name: 'FaSatelliteDish', label: 'Satellite Dish' },
  { name: 'FaMicrochip', label: 'Microchip' },
  { name: 'FaRobot', label: 'Robot' },
  { name: 'FaBrain', label: 'Brain' },
  { name: 'FaEye', label: 'Eye' },
  
  { name: 'FaHeartbeat', label: 'Heartbeat' },
  { name: 'FaLungs', label: 'Lungs' },
  { name: 'FaBone', label: 'Bone' },
  { name: 'FaTooth', label: 'Tooth' },
 
  { name: 'FaDna', label: 'DNA' },
  { name: 'FaAtom', label: 'Atom' },
  { name: 'FaVirus', label: 'Virus' },
  { name: 'FaBacteria', label: 'Bacteria' },
  { name: 'FaMicroscope', label: 'Microscope' },
  { name: 'FaThermometer', label: 'Thermometer' },
  { name: 'FaWeight', label: 'Weight' },
  { name: 'FaRuler', label: 'Ruler' },
  { name: 'FaCalculator', label: 'Calculator' },
  { name: 'FaCompass', label: 'Compass' },
  { name: 'FaMapMarker', label: 'Map Marker' },
  { name: 'FaFlag', label: 'Flag' },

  { name: 'FaBullseye', label: 'Bullseye' },
  { name: 'FaCrosshairs', label: 'Crosshairs' },
  
  { name: 'FaBinoculars', label: 'Binoculars' },
  { name: 'FaGlasses', label: 'Glasses' },

  { name: 'FaMask', label: 'Mask' },
  
  { name: 'FaRunning', label: 'Running' },
  { name: 'FaWalking', label: 'Walking' },
  { name: 'FaHiking', label: 'Hiking' },

  { name: 'FaSkiing', label: 'Skiing' },
  { name: 'FaSnowboarding', label: 'Snowboarding' },
  { name: 'FaSkating', label: 'Skating' },
  { name: 'FaBicycle', label: 'Bicycle' },
  { name: 'FaMotorcycle', label: 'Motorcycle' },
  { name: 'FaTruck', label: 'Truck' },
  { name: 'FaBus', label: 'Bus' },
  { name: 'FaTrain', label: 'Train' },
  { name: 'FaShip', label: 'Ship' },
  { name: 'FaHelicopter', label: 'Helicopter' },
  { name: 'FaRocket', label: 'Rocket' },

  { name: 'FaGhost', label: 'Ghost' },

  { name: 'FaDragon', label: 'Dragon' },
  { name: 'FaVine', label: 'Vine' }
];

const CategoryForm = ({ onSuccess }: CategoryFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    icon_name: 'FaBox'
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories/${id}`);
      const categoryData = response.data;
      setCategory({
        name: categoryData.name,
        description: categoryData.description,
        icon_name: categoryData.icon_name || 'FaBox'
      });
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name: category.name || '',
        description: category.description || '',
        icon_name: category.icon_name || 'FaBox'
      };

      if (isEditing) {
        await axios.put(`${API_URL}/api/categories/${id}`, categoryData);
      } else {
        await axios.post(`${API_URL}/api/categories`, categoryData);
      }

      onSuccess();
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (ReactIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <ReactIcons.FaBox className="w-6 h-6" />;
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
              Category Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconSelector(!showIconSelector)}
                className="w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {getIconComponent(category.icon_name || 'FaBox')}
                  <span>{category.icon_name || 'FaBox'}</span>
                </div>
                <span className="text-gray-400">▼</span>
              </button>

              {showIconSelector && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                  <div className="p-2">
                 
                    <div className="grid grid-cols-4 gap-2">
                      {availableIcons.map((icon) => {
                        const IconComponent = (ReactIcons as any)[icon.name];
                        return (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => {
                              setCategory(prev => ({ ...prev, icon_name: icon.name }));
                              setShowIconSelector(false);
                            }}
                            className={`p-2 cursor-pointer rounded-lg border hover:bg-gray-50 transition-colors ${
                              category.icon_name === icon.name ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                            }`}
                            title={icon.label}
                          >
                            {IconComponent ? <IconComponent className="w-5 h-5" /> : <ReactIcons.FaBox className="w-5 h-5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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