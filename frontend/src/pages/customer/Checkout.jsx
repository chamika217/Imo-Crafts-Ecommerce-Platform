import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    notes: '',
  });

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale',
    'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
    'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya', 'Trincomalee',
    'Batticaloa', 'Ampara', 'Kurunegala', 'Puttalam', 'Anuradhapura',
    'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerInfo: formData,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes,
          image: item.images?.[0] || '',
        })),
        subtotal: cartTotal,
        deliveryFee: 0,
        total: cartTotal,
        paymentMethod: 'COD',
      };

      const res = await axios.post(`${API_URL}/orders`, orderData);
      clearCart();
      navigate('/order-success', { state: { orderId: res.data.id } });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Delivery Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="07X XXX XXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Full delivery address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-700"></div>
                <span className="text-gray-700">Cash on Delivery (COD)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Pay when you receive your order</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 text-white py-4 rounded-full font-medium hover:bg-amber-800 transition-colors mt-6 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.name} x{item.quantity}</span>
                  <span className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-700">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
// chore: update 51 - 2026-06-15T12:20:23
