import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import toast from 'react-hot-toast';

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
    if (!email.trim()) {
      toast.error('Please enter your email address first');
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error('Failed to send reset email. Try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand Panel */}
      <div
        className="hidden lg:flex lg:w-[44%] relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #4A3228 0%, #7A4E2D 40%, #9A5B2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
          <div></div>
          <div className="py-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-amber-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={13} /> Handcrafted with Love in Sri Lanka
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-5">
              Discover unique<br />handmade crafts
            </h2>
            <p className="text-amber-100/75 text-base leading-relaxed max-w-sm">
              Sign in to browse our shop, place orders, and request custom handmade gifts for every occasion.
            </p>
          </div>
          <p className="text-amber-200/40 text-xs">© 2026 Imo Crafts. All rights reserved.</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 relative flex items-center justify-center px-5 py-10 sm:px-8 bg-[#F7F2EC]">
        <div className="relative w-full max-w-[440px]">

          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}>
              <Sparkles size={18} />
            </span>
            <div>
              <h1 className="text-lg font-bold text-[#5C4033]">Imo Crafts</h1>
              <p className="text-[#A89584] text-xs font-medium">Handmade Gifts</p>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] shadow-[0_8px_40px_rgba(92,64,51,0.10)] border border-[#E8DDD0]/80 overflow-hidden">
            <div className="px-8 py-9 sm:px-10 sm:py-10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2D2018]">
                  {isRegister ? 'Create account' : 'Welcome back'}
                </h2>
                <p className="text-[#A89584] mt-2 text-sm">
                  {isRegister ? 'Join Imo Crafts to start shopping' : 'Sign in to continue to the shop'}
                </p>
              </div>

              {/* Login / Register toggle */}
              <div className="flex gap-2 p-1 bg-[#FAF6F1] rounded-xl mb-6 border border-[#E8DDD0]">
                <button type="button" onClick={() => setIsRegister(false)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${!isRegister ? 'bg-white text-[#8B4513] shadow-sm' : 'text-[#A89584]'}`}>
                  Login
                </button>
                <button type="button" onClick={() => setIsRegister(true)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${isRegister ? 'bg-white text-[#8B4513] shadow-sm' : 'text-[#A89584]'}`}>
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name (register only) */}
                {isRegister && (
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold text-[#5C4033] mb-2 block">Full name</label>
                    <div className="login-field flex items-center w-full rounded-xl border border-[#E0D5C8] bg-[#FAF6F1] focus-within:border-[#C4A882] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C4A882]/20 transition-all overflow-hidden">
                      <span className="flex items-center justify-center w-11 shrink-0 text-[#B5A08C]"><User size={17} strokeWidth={2} /></span>
                      <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"
                        className="login-input min-w-0 flex-1 py-3 pr-4 bg-transparent border-0 outline-none text-[#2D2018] text-sm placeholder:text-[#C4B5A5]" />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-[#5C4033] mb-2 block">Email address</label>
                  <div className="login-field flex items-center w-full rounded-xl border border-[#E0D5C8] bg-[#FAF6F1] focus-within:border-[#C4A882] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C4A882]/20 transition-all overflow-hidden">
                    <span className="flex items-center justify-center w-11 shrink-0 text-[#B5A08C]"><Mail size={17} strokeWidth={2} /></span>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@email.com"
                      className="login-input min-w-0 flex-1 py-3 pr-4 bg-transparent border-0 outline-none text-[#2D2018] text-sm placeholder:text-[#C4B5A5]" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="text-sm font-semibold text-[#5C4033]">Password</label>
                    {!isRegister && (
                      <button type="button" onClick={handleForgotPassword} disabled={resetLoading}
                        className="text-xs text-[#8B4513] hover:text-[#6B3410] font-medium transition-colors disabled:opacity-60">
                        {resetLoading ? 'Sending...' : 'Forgot password?'}
                      </button>
                    )}
                  </div>
                  <div className="login-field flex items-center w-full rounded-xl border border-[#E0D5C8] bg-[#FAF6F1] focus-within:border-[#C4A882] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C4A882]/20 transition-all overflow-hidden">
                    <span className="flex items-center justify-center w-11 shrink-0 text-[#B5A08C]"><Lock size={17} strokeWidth={2} /></span>
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} required
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      placeholder={isRegister ? 'Min. 6 characters' : 'Enter your password'}
                      minLength={6}
                      className="login-input min-w-0 flex-1 py-3 bg-transparent border-0 outline-none text-[#2D2018] text-sm placeholder:text-[#C4B5A5]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center justify-center w-11 shrink-0 text-[#B5A08C] hover:text-[#8B4513] transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #7A4E2D 0%, #9A5B2E 100%)' }}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Please wait...
                      </span>
                    ) : (
                      <>{isRegister ? 'Create Account' : 'Sign In'}<ArrowRight size={17} strokeWidth={2.5} /></>
                    )}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8DDD0]" /></div>
                    <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-[#A89584]">or</span></div>
                  </div>

                  <Link to="/home"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm border-2 border-[#E8DDD0] text-[#8B4513] hover:bg-[#FFF8F0] transition-colors">
                    Continue as Guest →
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
