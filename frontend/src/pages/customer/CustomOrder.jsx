import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { ArrowRight, Sparkles, Zap, DollarSign, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const CustomOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    eventDate: '', description: '', budget: '', quantity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendInquiryEmail = async (inquiryData) => {
    try {
      if (!inquiryData.email) return;
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          customer_name: inquiryData.name,
          customer_email: inquiryData.email,
          order_id: 'CUSTOM-' + Date.now().toString().slice(-6),
          order_items: `Custom Order Inquiry\nDescription: ${inquiryData.description}\nQuantity: ${inquiryData.quantity || 'N/A'}\nBudget: ${inquiryData.budget ? 'Rs. ' + inquiryData.budget : 'N/A'}\nEvent Date: ${inquiryData.eventDate || 'N/A'}`,
          subtotal: inquiryData.budget ? `Rs. ${inquiryData.budget}` : 'TBD',
          discount_line: '', coupon_code: '', discount_amount: '',
          order_total: 'To be quoted',
          delivery_address: 'To be confirmed',
          district: 'To be confirmed',
          phone: inquiryData.phone,
          payment_method: 'To be confirmed',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('Inquiry email failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a custom order');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/inquiries`, {
        customerInfo: { name: formData.name, phone: formData.phone, email: formData.email },
        eventDate: formData.eventDate,
        description: formData.description,
        budget: formData.budget,
        quantity: formData.quantity,
      });
      await sendInquiryEmail(formData);
      toast.success('Your inquiry has been submitted! We will contact you soon.');
      setFormData({ name: '', phone: '', email: '', eventDate: '', description: '', budget: '', quantity: '' });
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '72px 0' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
            <Sparkles size={14} /> Personalized Just for You
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Custom Order Request</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
            Tell us about your custom craft requirements and we will get back to you with a quote!
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section style={{ padding: '64px 0', backgroundColor: '#F9FAFB' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>

          {/* Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: Zap, title: 'Quick Response', desc: 'We reply within 24 hours' },
              { icon: DollarSign, title: 'Fair Pricing', desc: 'Competitive craft prices' },
              { icon: Palette, title: 'Custom Design', desc: 'Unique designs for you' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FFF3E0', color: '#8B4513', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '13px', marginBottom: '4px' }}>{title}</div>
                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', marginBottom: '28px' }}>Tell Us About Your Order</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="07X XXX XXXX" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Event Date</label>
                  <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Budget (Rs.)</label>
                  <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="Your budget range" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Number of items" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Description *</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange} required rows={5}
                  placeholder="Describe your custom order requirements in detail..."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit" disabled={loading}
                style={{ width: '100%', background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '16px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? 'Submitting...' : <><span>Submit Inquiry</span> <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomOrder;
