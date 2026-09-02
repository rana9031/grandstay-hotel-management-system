import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Hotel, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { UserSession, HotelSettings } from '../types';
import { useToast } from '../context/ToastContext';

interface LoginViewProps {
  onLogin: (user: UserSession) => void;
  settings: HotelSettings;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, settings }) => {
  const [email, setEmail] = useState('admin@grandstay.com');
  const [password, setPassword] = useState('GrandStay2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { success, error } = useToast();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Authentication Error', 'Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let role = 'Hotel Administrator';
      let name = 'Jonathan Reynolds';
      let avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80';

      if (email.includes('reception') || email.includes('claire')) {
        role = 'Front Desk Executive';
        name = 'Claire Montgomery';
        avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80';
      } else if (email.includes('manager')) {
        role = 'Operations Director';
        name = 'Eleanor Vance';
        avatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80';
      }

      onLogin({
        isLoggedIn: true,
        name,
        email,
        role,
        avatar,
        rememberMe
      });
      success('Welcome back!', `Signed in successfully as ${name} (${role})`);
    }, 450);
  };

  const handleQuickFill = (demoEmail: string, demoRole: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword('GrandStay2026!');
    success('Demo Account Loaded', `Selected ${demoRole} - ${demoName}`);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      error('Missing Information', 'Please enter your registered staff email address.');
      return;
    }
    setForgotSubmitted(true);
    success('Reset Link Dispatched', `A password reset link was sent to ${forgotEmail}`);
    setTimeout(() => {
      setIsForgotPasswordOpen(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100">
      {/* Left Column: Visual Showcase with Hotel Atmosphere */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-slate-900 border-r border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-10000 hover:scale-100"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80")'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-serif font-bold text-2xl shadow-xl shadow-amber-900/40">
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-serif-heading">
              {settings.name}
            </h1>
            <p className="text-xs text-amber-400 font-medium tracking-widest uppercase">
              Management Portal
            </p>
          </div>
        </div>

        {/* Center Testimonial / Value prop */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>5-Star Hospitality Operations Suite</span>
          </div>
          <h2 className="text-3xl font-serif text-white font-semibold leading-snug">
            Streamlining reservations, guest experiences, and front-desk workflows.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time room occupancy management, express check-in/out, automated folio generation, and actionable financial reporting all in one intuitive platform.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
            <div>
              <p className="text-2xl font-bold text-white font-mono">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Frontend Client</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400 font-mono">0.2s</p>
              <p className="text-xs text-slate-400 mt-0.5">Instant Sync</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">24/7</p>
              <p className="text-xs text-slate-400 mt-0.5">Live Front Desk</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-6">
          <span>&copy; {new Date().getFullYear()} {settings.name}</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Enterprise Session Encryption
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          {/* Header Mobile Brand */}
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden inline-flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Hotel className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white font-serif-heading">GrandStay</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Staff & Admin Portal
            </h2>
            <p className="text-sm text-slate-400">
              Enter your authorized staff credentials to access the management dashboard.
            </p>
          </div>

          {/* Quick Demo Accounts Selection */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Quick Demo Profiles:</span>
              <span className="text-[11px] text-amber-400">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="demo-btn-admin"
                onClick={() => handleQuickFill('admin@grandstay.com', 'Hotel Administrator', 'Jonathan')}
                className="px-3 py-2 text-xs font-medium text-left bg-slate-800/80 hover:bg-amber-600/20 hover:border-amber-500/40 border border-slate-700 rounded-xl text-slate-200 transition-all flex flex-col"
              >
                <span className="font-semibold text-white">Hotel Admin</span>
                <span className="text-[10px] text-slate-400">Full Privileges</span>
              </button>
              <button
                type="button"
                id="demo-btn-reception"
                onClick={() => handleQuickFill('claire.reception@grandstay.com', 'Front Desk', 'Claire')}
                className="px-3 py-2 text-xs font-medium text-left bg-slate-800/80 hover:bg-amber-600/20 hover:border-amber-500/40 border border-slate-700 rounded-xl text-slate-200 transition-all flex flex-col"
              >
                <span className="font-semibold text-white">Front Desk</span>
                <span className="text-[10px] text-slate-400">Check-In / Out</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@grandstay.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  id="forgot-password-link-btn"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 bg-slate-900 border-slate-700 focus:ring-amber-500 focus:ring-offset-slate-950"
                />
                <span className="text-xs text-slate-300 font-medium">Keep me signed in</span>
              </label>
              <span className="text-xs text-slate-500">v2.4 LTS</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="pt-4 text-center">
            <p className="text-xs text-slate-500">
              Authorized hotel staff access only. Activity is monitored and logged for security.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1">Reset Staff Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your work email. A temporary recovery code and reset instructions will be provided.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Reset instructions dispatched! Check your work inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Staff Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@grandstay.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
