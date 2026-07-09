import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Star, Package, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
        toast.success('Account created! Welcome to Imo Crafts');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
      }
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error?.code === 'auth/email-already-in-use'
        ? 'This email is already registered'
        : error?.code === 'auth/weak-password'
          ? 'Password must be at least 6 characters'
          : 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { toast.error('Please enter your email address first'); return; }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.code === 'auth/user-not-found' ? 'No account found with this email' : 'Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  const features = [
    { icon: Package, text: 'Handmade with love' },
    { icon: Truck, text: 'Island-wide delivery' },
    { icon: Star, text: 'Custom orders available' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ===== LEFT - Customer Brand Panel ===== */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #FFF8F0 0%, #FFE0B2 40%, #FFCCAA 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #F59E0B, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #EA580C, transparent)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Imo Crafts" className="w-12 h-12 rounded-2xl object-cover shadow-md" />
            <div>
              <h1 className="text-xl font-bold text-[#7C3E00]">Imo Crafts</h1>
              <p className="text-[#B45309] text-xs font-medium uppercase tracking-widest mt-0.5">Handmade Gifts</p>
            </div>
          </div>

          {/* Center content */}
          <div className="py-10">
            <div className="inline-flex items-center gap-2 bg-white/60 text-[#92400E] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/40">
              <Sparkles size={13} /> Handcrafted with Love in Sri Lanka
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-[#7C3E00] leading-tight mb-5">
              Shop beautiful<br />handmade crafts
            </h2>
            <p className="text-[#92400E]/80 text-base leading-relaxed max-w-sm mb-8">
              Personalized gifts and custom decorations for every special occasion — made just for you.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-3">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2.5 w-fit border border-white/40">
                  <Icon size={16} className="text-[#D97706]" />
                  <span className="text-sm font-medium text-[#7C3E00]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#B45309]/50 text-xs">© 2026 Imo Crafts. All rights reserved.</p>
        </div>
      </div>

      {/* ===== RIGHT - Form Panel ===== */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 bg-white">
        <div className="w-full max-w-[420px]">

          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <img src={logo} alt="Imo Crafts" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="text-base font-bold text-[#7C3E00]">Imo Crafts</h1>
              <p className="text-gray-400 text-xs">Handmade Gifts</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-gray-500 mt-1.5 text-sm">
              {isRegister ? 'Join Imo Crafts to start shopping' : 'Sign in to continue shopping'}
            </p>
          </div>

          {/* Login / Register tabs */}
          <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-xl mb-7">
            <button type="button" onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isRegister ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Login
            </button>
            <button type="button" onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isRegister ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full name</label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100 transition-all overflow-hidden">
                  <span className="w-11 flex items-center justify-center text-gray-400 shrink-0"><User size={17} /></span>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"
                    className="flex-1 py-3 pr-4 bg-transparent border-0 outline-none text-gray-800 text-sm placeholder:text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email address</label>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100 transition-all overflow-hidden">
                <span className="w-11 flex items-center justify-center text-gray-400 shrink-0"><Mail size={17} /></span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@email.com"
                  className="flex-1 py-3 pr-4 bg-transparent border-0 outline-none text-gray-800 text-sm placeholder:text-gray-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                {!isRegister && (
                  <button type="button" onClick={handleForgotPassword} disabled={resetLoading}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium disabled:opacity-60 transition-colors">
                    {resetLoading ? 'Sending...' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100 transition-all overflow-hidden">
                <span className="w-11 flex items-center justify-center text-gray-400 shrink-0"><Lock size={17} /></span>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  required autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder={isRegister ? 'Min. 6 characters' : 'Enter your password'} minLength={6}
                  className="flex-1 py-3 bg-transparent border-0 outline-none text-gray-800 text-sm placeholder:text-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="w-11 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold text-sm mt-2 transition-all disabled:opacity-60 hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #D97706, #B45309)' }}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Please wait...</span>
              ) : (
                <>{isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={17} /></>
              )}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-400">or</span></div>
            </div>

            <Link to="/home"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
              Continue as Guest →
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
