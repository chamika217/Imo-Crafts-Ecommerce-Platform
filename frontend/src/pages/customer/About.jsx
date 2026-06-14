import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from '../../assets/logo.png';

const About = () => {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '80px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
            🎨 Our Story
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>About Imo Crafts</h1>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: '1.7' }}>
            We are passionate about creating unique, handmade craft items that bring
            joy and warmth to every special occasion.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>Our Story</h2>
              <p style={{ color: '#6B7280', lineHeight: '1.8', marginBottom: '16px' }}>
                Imo Crafts was born from a love of handmade art and a desire to bring
                personalized, meaningful gifts to people across Sri Lanka. Every item
                we create is made with care, attention to detail, and a personal touch
                that makes it truly special.
              </p>
              <p style={{ color: '#6B7280', lineHeight: '1.8' }}>
                From birthday decorations to personalized gifts, wedding crafts to
                home decorations, we put our heart into every piece we create.
                Our mission is to make your special moments even more memorable
                with our unique handmade crafts.
              </p>
            </div>
            <div style={{ backgroundColor: '#FFF8F0', borderRadius: '24px', padding: '48px', textAlign: 'center' }}>
              <img src={logo} alt="Imo Crafts" style={{ width: '120px', height: '120px', borderRadius: '20px', objectFit: 'cover', margin: '0 auto 16px' }} />
              <p style={{ color: '#8B4513', fontWeight: '600', fontSize: '18px' }}>Handcrafted with Love</p>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '8px' }}>Since 2020, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '64px 0', background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
            {[
              { value: '500+', label: 'Happy Customers' },
              { value: '1000+', label: 'Orders Completed' },
              { value: '50+', label: 'Craft Designs' },
              { value: '25+', label: 'Districts Delivered' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '40px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ color: '#FDE68A', fontSize: '14px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>Why Choose Us</h2>
            <p style={{ color: '#9CA3AF' }}>What makes Imo Crafts special</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { emoji: '💝', title: 'Made with Love', desc: 'Every piece is handcrafted with care and passion.' },
              { emoji: '⭐', title: 'Premium Quality', desc: 'High quality materials for lasting beauty.' },
              { emoji: '🎯', title: 'Personalized', desc: 'Custom designs tailored to your needs.' },
              { emoji: '📦', title: 'Safe Delivery', desc: 'Carefully packed and delivered island-wide.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.emoji}</div>
                <h3 style={{ fontWeight: '700', color: '#1F2937', fontSize: '16px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>Ready to Order?</h2>
          <p style={{ color: '#6B7280', marginBottom: '32px', lineHeight: '1.7' }}>
            Browse our collection or place a custom order for your special occasion.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '14px 32px', borderRadius: '999px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Browse Shop <ArrowRight size={16} />
            </Link>
            <Link to="/custom-order" style={{ border: '2px solid #8B4513', color: '#8B4513', padding: '14px 32px', borderRadius: '999px', fontWeight: '600', textDecoration: 'none' }}>
              Custom Order
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
// chore: update 14 - 2026-06-14T15:06:44
