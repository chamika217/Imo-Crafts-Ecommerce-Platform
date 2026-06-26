import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Tag, X, CheckCircle, CreditCard, Truck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const PAYHERE_MERCHANT_ID = import.meta.env.VITE_PAYHERE_MERCHANT_ID || '1228172'; // sandbox default

const Checkout = () => {
  const { cartItems, cartTotal, finalTotal, discountAmount, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await axios.post(`${API_URL}/promotions/validate`, {
        code: couponCode.trim(),
        orderTotal: cartTotal,
      });
      applyCoupon(res.data);
      toast.success(`Coupon applied! Rs. ${res.data.discountAmount.toLocaleString()} discount`);
      setCouponCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success('Coupon removed');
  };

  const sendConfirmationEmail = async (orderId, method) => {
    try {
      if (!formData.email) return;
      const itemsList = cartItems
        .map(item => `${item.name} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`)
        .join('\n');
      const discountLine = appliedCoupon
        ? `Discount (${appliedCoupon.couponCode}): - Rs. ${discountAmount.toLocaleString()}\n`
        : '';
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          customer_name: formData.name,
          customer_email: formData.email,
          order_id: orderId.slice(-8).toUpperCase(),
          order_items: itemsList,
          subtotal: `Rs. ${cartTotal.toLocaleString()}`,
          discount_line: discountLine,
          coupon_code: appliedCoupon?.couponCode || '',
          discount_amount: appliedCoupon ? `Rs. ${discountAmount.toLocaleString()}` : '',
          order_total: `Rs. ${finalTotal.toLocaleString()}`,
          delivery_address: formData.address,
          district: formData.district,
          phone: formData.phone,
          payment_method: method === 'CARD' ? 'Card Payment (PayHere)' : 'Cash on Delivery (COD)',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('Email send failed:', error);
    }
  };

  // Create order in DB first, then redirect to PayHere
  const handleCardPayment = async (orderData) => {
    // Save order with "Pending Payment" status
    const res = await axios.post(`${API_URL}/orders`, {
      ...orderData,
      paymentMethod: 'CARD',
      paymentStatus: 'Pending',
      orderStatus: 'Pending Payment',
    });

    const orderId = res.data.id;
    const merchantId = PAYHERE_MERCHANT_ID;
    const amountFormatted = finalTotal.toFixed(2);
    const currency = 'LKR';

    // Get hash from backend (keeps merchant secret server-side)
    const hashRes = await axios.post(`${API_URL}/payhere/hash`, {
      merchant_id: merchantId,
      order_id: orderId,
      amount: amountFormatted,
      currency,
    });
    const hash = hashRes.data.hash;

    // Build PayHere payment object
    const payment = {
      sandbox: true, // set false in production
      merchant_id: merchantId,
      return_url: `${window.location.origin}/order-success?orderId=${orderId}`,
      cancel_url: `${window.location.origin}/checkout`,
      notify_url: `${API_URL}/orders/payhere-notify`,
      order_id: orderId,
      items: cartItems.map(i => i.name).join(', '),
      amount: amountFormatted,
      currency,
      hash,
      first_name: formData.name.split(' ')[0],
      last_name: formData.name.split(' ').slice(1).join(' ') || '.',
      email: formData.email || 'noemail@imocrafts.lk',
      phone: formData.phone,
      address: formData.address,
      city: formData.district,
      country: 'Sri Lanka',
    };

    // PayHere callbacks
    window.payhere.onCompleted = async (paymentId) => {
      await axios.put(`${API_URL}/orders/${orderId}`, {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        transactionId: paymentId,
      });
      await sendConfirmationEmail(orderId, 'CARD');
      clearCart();
      navigate('/order-success', { state: { orderId } });
      toast.success('Payment successful! Order confirmed.');
    };

    window.payhere.onDismissed = () => {
      toast.error('Payment cancelled. Your order is saved - you can pay later.');
      navigate('/order-success', { state: { orderId, pending: true } });
    };

    window.payhere.onError = (error) => {
      console.error('PayHere error:', error);
      toast.error('Payment failed. Please try again or use Cash on Delivery.');
    };

    window.payhere.startPayment(payment);
    return orderId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    // Card payment requires email
    if (paymentMethod === 'CARD' && !formData.email) {
      toast.error('Email is required for card payment');
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
        discountAmount,
        couponCode: appliedCoupon?.couponCode || null,
        discountType: appliedCoupon?.discountType || null,
        deliveryFee: 0,
        total: finalTotal,
        paymentMethod,
      };

      if (paymentMethod === 'CARD') {
        // Check PayHere script loaded
        if (!window.payhere) {
          toast.error('Payment gateway not loaded. Please refresh and try again.');
          setLoading(false);
          return;
        }
        await handleCardPayment(orderData);
      } else {
        // COD flow
        const res = await axios.post(`${API_URL}/orders`, orderData);
        await sendConfirmationEmail(res.data.id, 'COD');
        clearCart();
        navigate('/order-success', { state: { orderId: res.data.id } });
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* PayHere script */}
      {typeof window !== 'undefined' && !document.getElementById('payhere-script') && (() => {
        const s = document.createElement('script');
        s.id = 'payhere-script';
        s.src = 'https://www.payhere.lk/lib/payhere.js';
        document.head.appendChild(s);
      })()}

      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '40px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827' }}>Checkout</h1>
          <p style={{ color: '#6B7280', marginTop: '8px' }}>Complete your order details below</p>
        </div>
      </section>

      <section style={{ padding: '40px 0', backgroundColor: '#F9FAFB' }}>
        <div className="page-container">
          <div className="grid-checkout">

            {/* Form */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '28px' }}>Delivery Information</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid-form-2" style={{ marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="07X XXX XXXX" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
                      Email {paymentMethod === 'CARD' ? '*' : '(for confirmation)'}
                    </label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      required={paymentMethod === 'CARD'}
                      placeholder="your@email.com" style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>District *</label>
                    <select name="district" value={formData.district} onChange={handleChange} required
                      style={{ ...inputStyle, backgroundColor: 'white' }}>
                      <option value="">Select District</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Delivery Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required placeholder="Full delivery address" rows={3}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Order Notes (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special instructions..." rows={2}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                </div>

                {/* Coupon Code */}
                <div style={{ backgroundColor: '#FAFAFA', borderRadius: '16px', padding: '20px', border: '1.5px solid #F3F4F6', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={16} color="#8B4513" /> Coupon Code
                  </h3>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '12px', padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} color="#16A34A" />
                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#166534', letterSpacing: '0.1em' }}>{appliedCoupon.couponCode}</span>
                        <span style={{ color: '#16A34A', fontSize: '13px' }}>— {appliedCoupon.title}</span>
                      </div>
                      <button type="button" onClick={handleRemoveCoupon} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                        placeholder="Enter coupon code"
                        style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.05em', boxSizing: 'border-box' }} />
                      <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                        style={{ padding: '12px 20px', backgroundColor: couponLoading || !couponCode.trim() ? '#D1D5DB' : '#8B4513', color: 'white', borderRadius: '12px', border: 'none', cursor: couponLoading || !couponCode.trim() ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '14px', fontSize: '15px' }}>Payment Method</h3>
                  <div className="grid-form-2" style={{ gap: '12px' }}>

                    {/* COD Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      style={{
                        padding: '16px', borderRadius: '16px', border: `2px solid ${paymentMethod === 'COD' ? '#8B4513' : '#E5E7EB'}`,
                        backgroundColor: paymentMethod === 'COD' ? '#FFF8F0' : 'white',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'COD' ? '#8B4513' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {paymentMethod === 'COD' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B4513' }} />}
                        </div>
                        <Truck size={18} color={paymentMethod === 'COD' ? '#8B4513' : '#9CA3AF'} />
                        <span style={{ fontWeight: '600', fontSize: '14px', color: paymentMethod === 'COD' ? '#8B4513' : '#374151' }}>Cash on Delivery</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, paddingLeft: '30px' }}>Pay when you receive your order</p>
                    </button>

                    {/* Card Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      style={{
                        padding: '16px', borderRadius: '16px', border: `2px solid ${paymentMethod === 'CARD' ? '#1D4ED8' : '#E5E7EB'}`,
                        backgroundColor: paymentMethod === 'CARD' ? '#EFF6FF' : 'white',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'CARD' ? '#1D4ED8' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {paymentMethod === 'CARD' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1D4ED8' }} />}
                        </div>
                        <CreditCard size={18} color={paymentMethod === 'CARD' ? '#1D4ED8' : '#9CA3AF'} />
                        <span style={{ fontWeight: '600', fontSize: '14px', color: paymentMethod === 'CARD' ? '#1D4ED8' : '#374151' }}>Card / Online Payment</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, paddingLeft: '30px' }}>Visa, Mastercard via PayHere</p>
                      {paymentMethod === 'CARD' && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', paddingLeft: '30px' }}>
                          {['VISA', 'MC', 'AMEX'].map(card => (
                            <span key={card} style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>{card}</span>
                          ))}
                        </div>
                      )}
                    </button>

                  </div>

                  {paymentMethod === 'CARD' && (
                    <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '12px 16px', marginTop: '12px', border: '1px solid #BFDBFE' }}>
                      <p style={{ color: '#1E40AF', fontSize: '13px', margin: 0 }}>
                        🔒 You will be redirected to PayHere secure payment page. Your card details are never stored on our server.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit" disabled={loading}
                  style={{
                    width: '100%',
                    background: loading ? '#D1D5DB' : paymentMethod === 'CARD'
                      ? 'linear-gradient(135deg, #1D4ED8, #2563EB)'
                      : 'linear-gradient(135deg, #8B4513, #A0522D)',
                    color: 'white', padding: '16px', borderRadius: '999px',
                    fontWeight: '600', fontSize: '16px', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  {loading ? 'Processing...' : paymentMethod === 'CARD' ? <><CreditCard size={18} /> Pay Now — Rs. {finalTotal.toLocaleString()}</> : 'Place Order'}
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

                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B7280' }}>
                    <span>Subtotal</span>
                    <span>Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#16A34A' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={13} /> {appliedCoupon.couponCode}</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', marginTop: '4px', paddingTop: '8px', borderTop: appliedCoupon ? '1px solid #F3F4F6' : 'none' }}>
                    <span>Total</span>
                    <span style={{ color: paymentMethod === 'CARD' ? '#1D4ED8' : '#8B4513' }}>Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>Delivery fee calculated upon confirmation</p>
                </div>

                {/* Payment badge */}
                <div style={{ backgroundColor: paymentMethod === 'CARD' ? '#EFF6FF' : '#F0FDF4', borderRadius: '12px', padding: '14px 16px', marginTop: '20px', border: `1px solid ${paymentMethod === 'CARD' ? '#BFDBFE' : '#BBF7D0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {paymentMethod === 'CARD'
                      ? <><CreditCard size={15} color="#1D4ED8" /><p style={{ color: '#1E40AF', fontSize: '13px', margin: 0 }}>Secure card payment via PayHere 🔒</p></>
                      : <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>💵 Pay cash when you receive your order</p>
                    }
                  </div>
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
