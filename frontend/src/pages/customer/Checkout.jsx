import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import emailjs from '@emailjs/browser';
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

  const sendConfirmationEmail = async (orderId) => {
    try {
      if (!formData.email) return;
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          customer_name: formData.name,
          customer_email: formData.email,
          order_id: orderId.slice(-8).toUpperCase(),
          order_total: cartTotal.toLocaleString(),
          delivery_address: formData.address,
          district: formData.district,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('Email send failed:', error);
    }
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
      await sendConfirmationEmail(res.data.id);
      clearCart();
      navigate('/order-success', { state: { orderId: res.data.id } });
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '40px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827' }}>Checkout</h1>
          <p style={{ color: '#6B7280', marginTop: '8px' }}>Complete your order details below</p>
        </div>
      </section>

      <section style={{ padding: '40px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '32px' }}>

            {/* Form */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '28px' }}>Delivery Information</h2>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} required placeholder="Your full name"
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Phone Number *</label>
                    <input
                      type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} required placeholder="07X XXX XXXX"
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Email (for confirmation) </label>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder="your@email.com"
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>District *</label>
                    <select
                      name="district" value={formData.district}
                      onChange={handleChange} required
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
                    >
                      <option value="">Select District</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Delivery Address *</label>
                    <textarea
                      name="address" value={formData.address}
                      onChange={handleChange} required placeholder="Full delivery address"
                      rows={3}
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Order Notes (Optional)</label>
                    <textarea
                      name="notes" value={formData.notes}
                      onChange={handleChange} placeholder="Any special instructions..."
                      rows={2}
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ backgroundColor: '#FFF8F0', borderRadius: '16px', padding: '20px', border: '1.5px solid #FFE0B2', marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '12px', fontSize: '15px' }}>Payment Method</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#8B4513', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>Cash on Delivery (COD)</div>
                      <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '2px' }}>Pay when you receive your order</div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  style={{ width: '100%', background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '16px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', position: 'sticky', top: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>Order Summary</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#6B7280' }}>{item.name} x{item.quantity}</span>
                      <span style={{ fontWeight: '500' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px' }}>
                    <span>Total</span>
                    <span style={{ color: '#8B4513' }}>Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '8px' }}>Delivery fee calculated upon confirmation</p>
                </div>

                <div style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '16px', marginTop: '20px', border: '1px solid #BBF7D0' }}>
                  <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>
                    📧 A confirmation email will be sent to your email address after placing the order.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;