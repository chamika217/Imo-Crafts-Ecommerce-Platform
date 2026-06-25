import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Sparkles, Star, Gift, PartyPopper, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';

const features = [
  { icon: Gift, title: 'Handmade Gifts', desc: 'Unique crafts for every special occasion' },
  { icon: Truck, title: 'Island-wide Delivery', desc: 'We deliver across Sri Lanka' },
  { icon: Shield, title: 'Cash on Delivery', desc: 'Pay safely when you receive' },
  { icon: Sparkles, title: 'Custom Orders', desc: 'Personalized designs just for you' },
];

const categories = [
  { icon: Gift, name: 'Handmade Gifts' },
  { icon: PartyPopper, name: 'Event & Party' },
  { icon: HomeIcon, name: 'Home Decor' },
  { icon: Sparkles, name: 'Custom Orders' },
];

const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F2EC] text-[#8B4513]">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEO
        title="Handmade Crafts & Gifts Sri Lanka"
        description="Discover beautifully handmade crafts, personalized gifts, and custom decorations. Made with love, delivered island-wide across Sri Lanka."
        url="/"
      />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8DDD0]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}
            >
              <Gift size={18} />
            </span>
            <span className="text-xl font-bold text-[#8B4513]">Imo Crafts</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#8B4513] transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E0] to-[#FFE0B2] py-20 md:py-28">
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#92400E] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={14} /> Handcrafted with Love in Sri Lanka
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Unique Handmade
              <span className="block text-[#8B4513]">Crafts & Gifts</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
              Discover beautifully crafted handmade items, personalized gifts, and custom
              decorations for every special occasion.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-[#8B4513]/25 hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}
              >
                Start Shopping <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] px-8 py-3.5 rounded-full font-semibold hover:bg-[#8B4513] hover:text-white transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="flex justify-center gap-10 md:gap-16 mt-16 flex-wrap">
            {[
              { value: '500+', label: 'Happy Customers' },
              { value: '1000+', label: 'Orders Delivered' },
              { value: '50+', label: 'Craft Designs' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-[#8B4513]">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories preview */}
      <section className="py-16 md:py-20 bg-[#FAF6F1]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Offer</h2>
            <p className="text-gray-400">Handmade items for every occasion</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {categories.map(({ icon: Icon, name }) => (
              <div key={name} className="bg-white rounded-2xl p-6 md:p-8 text-center border border-[#E8DDD0] shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#FFF3E0] text-[#8B4513] flex items-center justify-center">
                  <Icon size={22} />
                </div>
                <p className="font-semibold text-gray-800 text-sm">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Imo Crafts?</h2>
            <p className="text-gray-400">Quality handmade products you can trust</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-[#FAF6F1] border border-[#E8DDD0] text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FFF3E0] text-[#8B4513] flex items-center justify-center">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-[#FAF6F1]">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-lg text-gray-600 italic leading-relaxed mb-4">
            &ldquo;Beautiful handmade crafts with amazing quality. Delivery was fast and packaging was lovely!&rdquo;
          </p>
          <p className="text-sm font-medium text-[#8B4513]">— Happy Customer, Colombo</p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to explore our crafts?
          </h2>
          <p className="text-amber-100 mb-8 max-w-md mx-auto">
            Create your account and start shopping handmade gifts today.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-[#8B4513] px-8 py-3.5 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#E8DDD0] bg-white">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}>
              <Gift size={16} />
            </div>
            <span className="font-bold text-[#8B4513]">Imo Crafts</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Imo Crafts. All rights reserved.</p>
          <Link to="/login" className="text-sm text-[#8B4513] font-medium hover:underline">
            Login / Register
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
