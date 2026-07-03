import { Link } from 'react-router-dom';
import { Banknote, Truck, Sparkles, Clock, ArrowRight, Heart } from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../ui/SocialIcons';

const Footer = () => {
  const openFacebook = () => window.open('https://www.facebook.com/share/1HNaPjeuLq/', '_blank');

  const socialLinks = [
    { icon: FacebookIcon, label: 'Facebook', onClick: openFacebook },
    { icon: InstagramIcon, label: 'Instagram', onClick: () => {} },
    { icon: WhatsAppIcon, label: 'WhatsApp', onClick: () => {} },
  ];

  const quickLinks = [
    { to: '/home', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/custom-order', label: 'Custom Orders' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const infoItems = [
    { icon: Banknote, text: 'Cash on Delivery' },
    { icon: Truck, text: 'Island-wide Delivery' },
    { icon: Sparkles, text: 'Custom Orders Available' },
    { icon: Clock, text: 'Mon - Sat: 9AM - 6PM' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #6B4E3D 0%, #5C4033 50%, #4A3228 100%)', color: '#F5EDE4' }}>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.06) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      {/* Top color stripe */}
      <div className="h-1 flex">
        {['#D4A574','#C4956A','#B8856A','#A67C52','#8B6F5E'].map(c => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* Newsletter CTA strip */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
        <div className="page-container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm" style={{ color: '#E8D5C0' }}>Looking for something special?</p>
              <p className="text-xs mt-0.5" style={{ color: '#B0978A' }}>Place a custom order — handcrafted just for you</p>
            </div>
            <Link
              to="/custom-order"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #C4956A, #A67C52)', color: 'white', whiteSpace: 'nowrap' }}
            >
              Custom Order <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C4956A, #8B6F5E)' }}>
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <h3 className="text-xl font-bold" style={{ color: '#E8D5C0' }}>Imo Crafts</h3>
            </div>
            <p className="mb-6 leading-relaxed text-sm" style={{ color: '#C4B0A0', maxWidth: '280px' }}>
              Handmade with love in Sri Lanka. Every piece tells a story — crafted with care for your most special moments.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mb-6">
              {socialLinks.map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,149,106,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex gap-2 flex-wrap">
              {['Handmade', 'COD', 'Island-wide'].map(badge => (
                <span key={badge} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.07)', color: '#C4B0A0', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest" style={{ color: '#D4A574' }}>Quick Links</h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map(({ to, label }) => (
                <Link
                  key={to} to={to}
                  className="text-sm flex items-center gap-2 group transition-all"
                  style={{ color: '#C4B0A0' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F5EDE4'}
                  onMouseLeave={e => e.currentTarget.style.color = '#C4B0A0'}
                >
                  <span className="w-1 h-1 rounded-full bg-current opacity-50 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-4">
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest" style={{ color: '#D4A574' }}>Information</h4>
            <div className="flex flex-col gap-3">
              {infoItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.2)' }}>
                    <Icon size={14} style={{ color: '#D4A574' }} />
                  </div>
                  <p className="text-sm" style={{ color: '#C4B0A0' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: '#8B7A70' }}>
            © 2026 Imo Crafts. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#8B7A70' }}>
            Made with <Heart size={11} className="text-red-400" fill="currentColor" /> in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
