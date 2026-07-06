import { useState } from 'react';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import { FacebookIcon } from '../../components/ui/SocialIcons';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const openFacebook = () => window.open('https://www.facebook.com/share/1HNaPjeuLq/', '_blank');

  const contactItems = [
    {
      icon: Phone,
      title: 'Phone / WhatsApp',
      desc: 'Available Mon - Sat, 9AM - 6PM',
      onClick: null,
    },
    {
      icon: FacebookIcon,
      title: 'Facebook',
      desc: 'Imo Crafts Facebook Page ↗',
      onClick: openFacebook,
      highlight: true,
    },
    {
      icon: MapPin,
      title: 'Delivery',
      desc: 'Island-wide delivery across Sri Lanka',
      onClick: null,
    },
  ];

  const faqs = [
    { q: 'How do I place an order?', a: 'Browse our shop, add items to cart, and checkout with your delivery details.' },
    { q: 'What is Cash on Delivery?', a: 'You pay when you receive your order. No online payment required.' },
    { q: 'How long does delivery take?', a: 'Typically 3-7 business days depending on your location.' },
    { q: 'Can I request a custom design?', a: 'Yes! Use our Custom Order page to submit your requirements.' },
  ];

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid #E5E7EB', borderRadius: '12px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <SEO
        title="Contact Us"
        description="Get in touch with Imo Crafts. Contact us for custom orders, inquiries, or support. We reply within 24 hours."
        url="/contact"
      />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '56px 0' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', marginBottom: '16px' }}>
            <MessageCircle size={14} /> Get in Touch
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
            Have a question or want to place a custom order? We would love to hear from you!
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 0', backgroundColor: '#F9FAFB' }}>
        <div className="page-container">
          {/* Responsive 2-col → 1-col on mobile */}
          <div className="grid-2-col" style={{ alignItems: 'start' }}>

            {/* Left - Contact Info & FAQ */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>Get in Touch</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                {contactItems.map(({ icon: Icon, title, desc, onClick, highlight }) => (
                  <div
                    key={title}
                    onClick={onClick || undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      backgroundColor: 'white', padding: '16px 20px',
                      borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      cursor: onClick ? 'pointer' : 'default',
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <div style={{
                      width: '44px', height: '44px', backgroundColor: '#FFF3E0',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, color: '#8B4513',
                    }}>
                      <Icon size={20} color="#8B4513" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px', marginBottom: '2px' }}>{title}</div>
                      <div style={{ color: highlight ? '#8B4513' : '#9CA3AF', fontSize: '13px' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ - accordion style */}
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>FAQ</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #F3F4F6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', padding: '14px 20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <span style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>{faq.q}</span>
                      <span style={{ color: '#8B4513', fontSize: '18px', flexShrink: 0, marginLeft: '8px' }}>{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '0 20px 14px', color: '#6B7280', fontSize: '13px', lineHeight: '1.6' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Contact Form */}
            <div>
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>Send a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Phone *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="07X XXX XXXX" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Message *</label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange}
                        required placeholder="Your message..." rows={5}
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ width: '100%', background: 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '14px', borderRadius: '999px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer', marginTop: '4px' }}
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
