import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, LogOut, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/custom-order', label: 'Custom Orders' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `text-sm font-medium transition-colors relative py-1 ${
      isActive(path)
        ? 'text-[#8B4513]'
        : 'text-gray-600 hover:text-[#8B4513]'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8DDD0] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center h-[72px] gap-4">
          <Link to="/home" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="Imo Crafts"
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div>
              <span className="text-xl font-bold text-[#8B4513] group-hover:text-[#6B3410] transition-colors">
                Imo Crafts
              </span>
              <p className="text-[11px] text-gray-400 leading-none mt-0.5">Handmade with Love</p>
            </div>
          </Link>

          <div className="flex items-center gap-7">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={linkClass(to)}>
                {label}
                {isActive(to) && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#8B4513]" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2.5 bg-[#FAF6F1] border border-[#E8DDD0] rounded-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#C4A882] focus:bg-white w-52 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B4513] transition-colors"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF6F1] border border-[#E8DDD0] text-gray-600 hover:text-[#8B4513] hover:border-[#C4A882] transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#8B4513] text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2 pl-1 border-l border-[#E8DDD0]">
              <span className="hidden xl:flex items-center gap-1.5 text-xs text-gray-500 max-w-[120px] truncate">
                <User size={14} />
                {user?.displayName || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF6F1] border border-[#E8DDD0] text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-between h-16">
          <Link to="/home" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Imo Crafts"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <span className="text-lg font-bold text-[#8B4513]">Imo Crafts</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#8B4513] text-white text-[10px] font-semibold rounded-full min-w-[16px] h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-gray-600 hover:text-[#8B4513] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-5 border-t border-[#E8DDD0]">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-[#FAF6F1] text-[#8B4513]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <form onSubmit={handleSearch} className="mt-2 px-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-[#FAF6F1] border border-[#E8DDD0] rounded-full text-sm focus:outline-none focus:border-[#C4A882]"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                  </button>
                </div>
              </form>
              <button
                onClick={handleLogout}
                className="mt-2 mx-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// chore: update 4 - 2026-06-13T03:53:35
