import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand Panel */}
      <div
        className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #4A3228 0%, #7A4E2D 40%, #9A5B2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Imo Crafts"
              className="w-12 h-12 rounded-2xl object-cover border border-white/15 shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Imo Crafts</h1>
              <p className="text-amber-200/60 text-xs font-medium uppercase tracking-widest mt-0.5">Admin Panel</p>
            </div>
          </div>

          <div className="py-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-amber-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={13} />
              Handcrafted with Love
            </div>
            <h2 className="text-[2rem] xl:text-4xl font-bold text-white leading-[1.2] mb-5">
              Manage your craft
              <br />
              business with ease
            </h2>
            <p className="text-amber-100/75 text-base leading-relaxed max-w-sm">
              Track orders, manage products, and grow your handmade creations — all in one place.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-sm">
              {[
                { value: '500+', label: 'Orders' },
                { value: '50+', label: 'Products' },
                { value: '100%', label: 'Handmade' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/8 border border-white/10 rounded-2xl px-4 py-3 text-center">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-amber-200/55 text-[11px] mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-amber-200/40 text-xs">© 2026 Imo Crafts. All rights reserved.</p>
        </div>
      </div>

      {/* Login Panel */}
      <div className="flex-1 relative flex items-center justify-center px-5 py-10 sm:px-8 bg-[#F7F2EC]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#E8C9A0]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#D4A574]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-[440px]">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img
              src={logo}
              alt="Imo Crafts"
              className="w-11 h-11 rounded-2xl object-cover shadow-md"
            />
            <div>
              <h1 className="text-lg font-bold text-[#5C4033]">Imo Crafts</h1>
              <p className="text-[#A89584] text-xs font-medium">Admin Panel</p>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] shadow-[0_8px_40px_rgba(92,64,51,0.10)] border border-[#E8DDD0]/80 overflow-hidden">
            <div className="px-8 py-9 sm:px-10 sm:py-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#2D2018]">Welcome back</h2>
                <p className="text-[#A89584] mt-2 text-sm leading-relaxed">
                  Sign in to your admin account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-[#5C4033] mb-2 block">
                    Email address
                  </label>
                  <div className="login-field flex items-center w-full rounded-xl border border-[#E0D5C8] bg-[#FAF6F1] focus-within:border-[#C4A882] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C4A882]/20 transition-all overflow-hidden">
                    <span className="flex items-center justify-center w-11 shrink-0 text-[#B5A08C]">
                      <Mail size={17} strokeWidth={2} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="admin@imocrafts.com"
                      className="login-input min-w-0 flex-1 py-3 pr-4 bg-transparent border-0 outline-none text-[#2D2018] text-sm placeholder:text-[#C4B5A5]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-semibold text-[#5C4033] mb-2 block">
                    Password
                  </label>
                  <div className="login-field flex items-center w-full rounded-xl border border-[#E0D5C8] bg-[#FAF6F1] focus-within:border-[#C4A882] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C4A882]/20 transition-all overflow-hidden">
                    <span className="flex items-center justify-center w-11 shrink-0 text-[#B5A08C]">
                      <Lock size={17} strokeWidth={2} />
                    </span>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="login-input min-w-0 flex-1 py-3 pr-4 bg-transparent border-0 outline-none text-[#2D2018] text-sm placeholder:text-[#C4B5A5]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-105"
                    style={{ background: 'linear-gradient(135deg, #7A4E2D 0%, #9A5B2E 100%)' }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <>
                        Sign In <ArrowRight size={17} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center text-[#B5A08C] text-xs mt-7 leading-relaxed">
            Secure admin access for authorized staff only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;