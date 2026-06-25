import { Link } from 'react-router-dom';
import { ExternalLink, Share2, MessageCircle, Banknote, Truck, Sparkles, Clock } from 'lucide-react';

const Footer = () => {
  const openFacebook = () => window.open('https://www.facebook.com/share/1HNaPjeuLq/', '_blank');

  const socialLinks = [
    { icon: ExternalLink, label: 'Facebook', onClick: openFacebook },
    { icon: Share2, label: 'Instagram', onClick: () => {} },
    { icon: MessageCircle, label: 'WhatsApp', onClick: () => {} },
  ];

  const quickLinks = [
    { to: '/home', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/custom-order', label: 'Custom Orders' },
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
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #7A5C47 0%, #6B4E3D 45%, #5C4033 100%)', color: '#F5EDE4' }}>
      <div className="h-1 flex">
        {['#C4A882','#B8956A','#A67C52','#8B6F5E','#7A5C47'].map(c => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#E8D5C0' }}>Imo Crafts</h3>
            <p className="mb-6 leading-relaxed max-w-md text-sm" style={{ color: '#D4C4B0' }}>
              Handmade with love. We create unique, personalized craft items for every special occasion — birthdays, weddings, and more.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-white/10 bg-white/[0.08] hover:bg-white/[0.18]"
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#E8D5C0' }}>Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="text-sm transition-colors hover:text-[#F5EDE4]" style={{ color: '#C9B8A5' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#E8D5C0' }}>Information</h4>
            <div className="flex flex-col gap-3">
              {infoItems.map(({ icon: Icon, text }) => (
                <p key={text} className="text-sm flex items-center gap-2.5" style={{ color: '#C9B8A5' }}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Icon size={14} />
                  </span>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: '#A89584' }}>
          <p>© 2026 Imo Crafts. All rights reserved. Handmade with love in Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
