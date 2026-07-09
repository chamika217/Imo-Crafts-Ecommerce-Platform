import { Link } from 'react-router-dom';
import { Banknote, Truck, Sparkles, Clock, ArrowRight, Heart, Mail, Phone, MapPin, Gift, PartyPopper, Home as HomeIcon } from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../ui/SocialIcons';

const Footer = () => {
  const openFacebook = () => window.open('https://www.facebook.com/share/1HNaPjeuLq/', '_blank');

  const quickLinks = [
    { to: '/home', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/custom-order', label: 'Custom Orders' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const categories = [
    { icon: Gift, label: 'Handmade Gifts', to: '/shop?category=handmade-gifts' },
    { icon: PartyPopper, label: 'Event & Party', to: '/shop?category=event-crafts' },
    { icon: HomeIcon, label: 'Home Decor', to: '/shop?category=home-decor' },
    { icon: Sparkles, label: 'Custom Orders', to: '/shop?category=custom-orders' },
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@imocrafts.lk' },
    { icon: Phone, label: 'Phone', value: '+94 7X XXX XXXX' },
    { icon: MapPin, label: 'Location', value: 'Sri Lanka' },
  ];

  const infoItems = [
    { icon: Banknote, text: 'Cash on Delivery' },
    { icon: Truck, text: 'Island-wide Delivery' },
    { icon: Sparkles, text: 'Custom Orders' },
    { icon: Clock, text: 'Mon - Sat: 9AM - 6PM' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #6B4E3D 0%, #5C4033 50%, #4A3228 100%)', color: '#F5EDE4' }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.06) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      {/* Top stripe */}
      <div className="h-1 flex">
        {['#D4A574','#C4956A','#B8856A','#A67C52','#8B6F5E'].map(c => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* CTA strip */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
        <div className="page-container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm" style={{ color: '#E8D5C0' }}>Looking for something special?</p>
              <p className="text-xs mt-0.5" style={{ color: '#B0978A' }}>Place a custom order — handcrafted just for you</p>
            </div>
            <Link to="/custom-order"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #C4956A, #A67C52)', color: 'white' }}>
              Custom Order <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="page-container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1 - Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #C4956A, #8B6F5E)' }}>
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <div>
                <h3 className="font-bold text-base" style={{ color: '#E8D5C0' }}>Imo Crafts</h3>
                <p className="text-xs" style={{ color: '#B0978A' }}>Handmade with Love</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5" style={{ color: '#C4B0A0', maxWidth: '240px' }}>
              Handmade with love in Sri Lanka. Every piece tells a story — crafted with care for your most special moments.
            </p>

            {/* Social */}
            <div className="flex gap-2.5 mb-5">
              {[
                { icon: FacebookIcon, label: 'Facebook', onClick: openFacebook },
                { icon: InstagramIcon, label: 'Instagram', onClick: () => {} },
                { icon: WhatsAppIcon, label: 'WhatsApp', onClick: () => {} },
              ].map(({ icon: Icon, label, onClick }) => (
                <button key={label} onClick={onClick} aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)' }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {['Handmade', 'COD', 'Island-wide'].map(b => (
                <span key={b} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.07)', color: '#C4B0A0', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest" style={{ color: '#D4A574' }}>Quick Links</h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map(({ to, label }) => (
                <Link key={to} to={to}
                  className="text-sm flex items-center gap-2 group transition-colors hover:text-white"
                  style={{ color: '#C4B0A0' }}>
                  <span className="w-1 h-1 rounded-full bg-current opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 - Categories */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest" style={{ color: '#D4A574' }}>Categories</h4>
            <div className="flex flex-col gap-3">
              {categories.map(({ icon: Icon, label, to }) => (
                <Link key={label} to={to}
                  className="text-sm flex items-center gap-2.5 group transition-colors hover:text-white"
                  style={{ color: '#C4B0A0' }}>
                  <Icon size={14} className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 - Contact + Info */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest" style={{ color: '#D4A574' }}>Contact Us</h4>
            <div className="flex flex-col gap-3 mb-6">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.2)' }}>
                    <Icon size={13} style={{ color: '#D4A574' }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: '#8B7A70' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: '#C4B0A0' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: '#D4A574' }}>Hours</p>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#C4B0A0' }}>
                <Clock size={13} style={{ color: '#D4A574' }} />
                Mon - Sat: 9AM - 6PM
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: '#8B7A70' }}>© 2026 Imo Crafts. All rights reserved.</p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#8B7A70' }}>
            Made with <Heart size={11} className="text-red-400" fill="currentColor" /> in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
