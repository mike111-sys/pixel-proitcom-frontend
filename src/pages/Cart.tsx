import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalSavings } = useCart();
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const subtotal = getTotalPrice();
  const savings = getTotalSavings();
  const grandTotal = subtotal;

  // Generate order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PP-${timestamp}-${random}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const orderId = generateOrderId();
      
      // Prepare order details
      const orderDetails = items.map(item => {
        const itemPrice = item.price || 0; // Default to 0 if null
        const itemTotal = itemPrice * item.quantity;
        const originalPrice = item.original_price || 0;
        const originalTotal = originalPrice * item.quantity;
        
        return `${item.name} 
        Quantity: ${item.quantity}
        Unit Price: ${item.price ? `Ksh ${item.price.toFixed(2)}` : 'Not set'}
        ${item.original_price && item.original_price > itemPrice ? `Original: Ksh ${item.original_price.toFixed(2)}` : ''}
        Item Total: Ksh ${itemTotal.toFixed(2)}
        ${item.original_price && item.original_price > itemPrice ? `Savings Made: Ksh ${(originalTotal - itemTotal).toFixed(2)}` : ''}`;
      }).join('\n\n');
      
      // Add summary
      const orderSummary = `
      ORDER SUMMARY:
      -------------
      Subtotal: Ksh ${subtotal.toFixed(2)}
      ${savings > 0 ? `Total Savings: Ksh ${savings.toFixed(2)}\n` : ''}
      GRAND TOTAL: Ksh ${grandTotal.toFixed(2)}
      `;
      
      const formData = {
        access_key: 'fbc808f0-e376-424c-bb16-9e14add75a5e',
        name: orderForm.name,
        email: orderForm.email,
        phone: orderForm.phone,
        address: orderForm.address,
        message: `Order ID: ${orderId}\n\nORDER DETAILS:\n${orderDetails}\n\n${orderSummary}\n\nAdditional Message: ${orderForm.message}`,
        subject: `New Order - ${orderId} - Ksh ${grandTotal.toFixed(2)}`
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setOrderForm({
          name: '',
          email: '',
          phone: '',
          address: '',
          message: ''
        });
      
        // Delay clearing cart so success message shows
        setTimeout(() => {
          clearCart();
        }, 3000);
      }
       else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

    if (items.length === 0 && submitStatus !== 'success') {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛒</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Add some products to your cart to get started!</p>
              <a
                href="/products"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      );
    }
    

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cart Items ({items.length})</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image_url || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    loading='lazy'
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  
                  <div className="text-sm text-gray-600">
  {item.price ? (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-900">
          Ksh {(item.price * item.quantity).toFixed(2)}
        </span>
        <span className="text-gray-500">
          (Ksh {item.price.toFixed(2)} × {item.quantity})
        </span>
      </div>
      {item.is_on_sale && item.original_price && item.original_price > item.price && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 line-through">
            Was: Ksh {(item.original_price * item.quantity).toFixed(2)}
          </span>
          <span className="text-xs text-green-600 font-semibold">
            Save Ksh {((item.original_price - item.price) * item.quantity).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  ) : (
    <span className="text-gray-400">Price not set</span>
  )}
</div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
  <div className="flex justify-between items-center">
    <span className="text-gray-600">Subtotal:</span>
    <span className="font-semibold text-gray-900">Ksh {subtotal.toFixed(2)}</span>
  </div>
  
  {savings > 0 && (
    <div className="flex justify-between items-center">
      <span className="text-green-600">Total Savings:</span>
      <span className="font-semibold text-green-600">-Ksh {savings.toFixed(2)}</span>
    </div>
  )}
  
  <div className="flex justify-between items-center pt-2 border-t">
    <span className="text-lg font-semibold text-gray-800">Total Items:</span>
    <span className="text-lg font-semibold text-purple-600">
      {items.reduce((total, item) => total + item.quantity, 0)}
    </span>
  </div>
  
  <div className="flex justify-between items-center pt-2 border-t">
    <span className="text-xl font-bold text-gray-900">Total Amount:</span>
    <span className="text-2xl font-bold text-purple-600">Ksh {grandTotal.toFixed(2)}</span>
  </div>
</div>
          </div>

         

          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Information (Cash On Delivery)</h2>
            
         

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={orderForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={orderForm.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={orderForm.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={orderForm.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your complete delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={orderForm.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 cursor-pointer text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
                </button>
              </div>
            </form>

            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <p className="font-semibold">Order submitted successfully!</p>
                <p className="text-sm">We'll contact you soon to confirm your order.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-semibold">Error submitting order</p>
                <p className="text-sm">Please try again or contact us directly.</p>
              </div>
            )}


            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-2">
                Call us directly for immediate assistance:
              </p>
              <a
                href="tel:0713731333"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
              >
                <FaPhone className="mr-2" />
                0713731333
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 