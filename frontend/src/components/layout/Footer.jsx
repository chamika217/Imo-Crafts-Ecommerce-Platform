import { Link } from 'react-router-dom';

const Footer = () => {
  const openFacebook = () => {
    window.open('https://www.facebook.com/share/1HNaPjeuLq/', '_blank');
  };

  const stripeColors = ['#C4A882', '#B8956A', '#A67C52', '#8B6F5E', '#7A5C47'];

  const socialLinks = [
    { emoji: '📘', label: 'Facebook', onClick: openFacebook },
    { emoji: '📸', label: 'Instagram' },
    { emoji: '💬', label: 'WhatsApp' },
  ];

  const quickLinks = [
    { to: '/home', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/custom-order', label: 'Custom Orders' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const infoItems = [
    { icon: '💵', text: 'Payment: Cash on Delivery' },
    { icon: '🚚', text: 'Island-wide Delivery' },
    { icon: '✨', text: 'Custom Orders Available' },
    { icon: '🕐', text: 'Mon - Sat: 9AM - 6PM' },
  ];

  return (
    <footer
      className="mt-16 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #7A5C47 0%, #6B4E3D 45%, #5C4033 100%)',
        color: '#F5EDE4',
      }}
    >
      <div className="flex h-1">
        {stripeColors.map((color) => (
          <div key={color} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#E8D5C0' }}>
              Imo Crafts
            </h3>
            <p className="mb-6 leading-relaxed max-w-md" style={{ color: '#D4C4B0' }}>
              Handmade with love. We create unique, personalized craft items
              for every special occasion.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ emoji, label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base transition-colors border border-white/10 bg-white/[0.08] hover:bg-white/[0.15]"
                >
                  <span>{emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#E8D5C0' }}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm transition-colors hover:text-[#F5EDE4]"
                  style={{ color: '#C9B8A5' }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#E8D5C0' }}>
              Information
            </h4>
            <div className="flex flex-col gap-3">
              {infoItems.map(({ icon, text }) => (
                <p
                  key={text}
                  className="text-sm flex items-center gap-2.5"
                  style={{ color: '#C9B8A5' }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {icon}
                  </span>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-sm"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: '#A89584',
          }}
        >
          <p>© 2026 Imo Crafts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// chore: update 148 - 2026-06-13T09:36:00
