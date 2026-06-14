import { useState } from 'react';
import { Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const openFacebook = () => window.open('https://www.facebook.com/share/1HNaPjeuLq/', '_blank');

  const faqs = [
    { q: 'How do I place an order?', a: 'Browse our shop, add items to cart, and checkout with your delivery details.' },
    { q: 'What is Cash on Delivery?', a: 'You pay when you receive your order. No online payment required.' },
    { q: 'How long does delivery take?', a: 'Typically 3-7 business days depending on your location.' },
    { q: 'Can I request a custom design?', a: 'Yes! Use our Custom Order page to submit your requirements.' },
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '64px 0' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
            💬 Get in Touch
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.7' }}>
            Have a question or want to place a custom order? We would love to hear from you!
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>

            {/* Left - Contact Info & FAQ */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '32px' }}>Get in Touch</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#FFF3E0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} color="#8B4513" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Phone / WhatsApp</div>
                    <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Available Mon - Sat, 9AM - 6PM</div>
                  </div>
                </div>

                <div
                  onClick={openFacebook}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer' }}
                >
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#FFF3E0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px' }}>
                    📘
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Facebook</div>
                    <div style={{ color: '#8B4513', fontSize: '14px' }}>Imo Crafts Facebook Page ↗</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#FFF3E0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} color="#8B4513" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Delivery</div>
                    <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Island-wide delivery across Sri Lanka</div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>FAQ</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px', marginBottom: '6px' }}>{faq.q}</div>
                    <div style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.6' }}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Contact Form */}
            <div>
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '28px' }}>Send a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Name *</label>
                      <input
                        type="text" name="name" value={formData.name}
                        onChange={handleChange} required placeholder="Your name"
                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Phone *</label>
                      <input
                        type="tel" name="phone" value={formData.phone}
                        onChange={handleChange} required placeholder="07X XXX XXXX"
                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Email</label>
                      <input
                        type="email" name="email" value={formData.email}
                        onChange={handleChange} placeholder="your@email.com"
                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Message *</label>
                      <textarea
                        name="message" value={formData.message}
                        onChange={handleChange} required placeholder="Your message..."
                        rows={5}
                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ width: '100%', background: 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '14px', borderRadius: '999px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' }}
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
// chore: update 33 - 2026-06-14T21:05:04
