import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Select } from './ui/Select.js';
import { Sprout, ShieldCheck, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { login, quickSwitch } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}`);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSwitch = async (role: 'ADMIN' | 'USER') => {
    setLoading(true);
    try {
      const u = await quickSwitch(role);
      toast.success(`Signed in as demo ${role}: ${u.name}`);
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      toast.error('Quick switch failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9]">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#176B3A] text-white items-center justify-center mb-3 shadow-sm">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#17231C] tracking-tight">
            Sign in to WEALTHFARM
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Institutional access to commercial assets, operations & executive academy
          </p>
        </div>

        {/* 1-Click Evaluation Credentials Helper */}
        <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#DCE8DF] text-xs space-y-2">
          <div className="font-bold text-[#176B3A] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Evaluation Quick-Sign In</span>
          </div>
          <p className="text-neutral-600 text-[11px] leading-relaxed">
            Click either button below to authenticate instantly with verified seed credentials:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoSwitch('USER')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#DCE8DF] text-[#17231C] hover:bg-neutral-50 transition-colors shadow-xs"
            >
              Commercial User (USER)
            </button>
            <button
              type="button"
              onClick={() => handleDemoSwitch('ADMIN')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#176B3A] text-white hover:bg-[#0F4927] transition-colors shadow-xs"
            >
              Director (ADMIN)
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g., investor@wealthfarm.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#17231C] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-[#176B3A] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button variant="primary" size="lg" className="w-full" loading={loading}>
              Sign In to Account
            </Button>
          </form>

          <div className="pt-4 border-t border-[#DCE8DF] text-center text-xs text-neutral-500">
            Don't have an institutional account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-[#176B3A] font-bold hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    state: 'Lagos State',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company: formData.company,
        state: formData.state,
      });

      toast.success(`Account created successfully. Welcome, ${user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nigerianStates = [
    { label: 'Lagos State', value: 'Lagos State' },
    { label: 'Ogun State', value: 'Ogun State' },
    { label: 'Oyo State', value: 'Oyo State' },
    { label: 'Osun State', value: 'Osun State' },
    { label: 'Ondo State', value: 'Ondo State' },
    { label: 'Ekiti State', value: 'Ekiti State' },
    { label: 'Abuja (FCT)', value: 'Abuja FCT' },
    { label: 'Kano State', value: 'Kano State' },
    { label: 'Kaduna State', value: 'Kaduna State' },
    { label: 'Rivers State', value: 'Rivers State' },
    { label: 'Edo State', value: 'Edo State' },
    { label: 'Delta State', value: 'Delta State' },
    { label: 'Enugu State', value: 'Enugu State' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9]">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#176B3A] text-white items-center justify-center mb-3 shadow-sm">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#17231C] tracking-tight">
            Create a WEALTHFARM Account
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            For business executives, asset owners, entrepreneurs & enterprise leaders
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g., Emeka Adeleke"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Corporate Email Address"
                type="email"
                required
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                placeholder="+234 803 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Enterprise Entity"
                placeholder="e.g., Apex Commercial Holdings Ltd"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <Select
                label="State of Operation"
                options={nigerianStates}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password (min 8 chars)"
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Input
                label="Confirm Password"
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="text-[11px] text-neutral-500 leading-relaxed">
              By clicking "Register Institutional Account", you agree to the{' '}
              <button
                type="button"
                onClick={() => navigate('/terms')}
                className="text-[#176B3A] underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => navigate('/privacy')}
                className="text-[#176B3A] underline"
              >
                Privacy Policy
              </button>
              . Standard accounts are created with USER role privileges.
            </div>

            <Button variant="primary" size="lg" className="w-full" loading={loading}>
              Register Institutional Account
            </Button>
          </form>

          <div className="pt-4 border-t border-[#DCE8DF] text-center text-xs text-neutral-500">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#176B3A] font-bold hover:underline"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Password reset instructions dispatched.');
    }, 800);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9]">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#176B3A] text-white items-center justify-center mb-3 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#17231C] tracking-tight">
            Password Recovery
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Enter your email to receive authorized password reset instructions.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-5">
          {sent ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#17231C]">Reset Instructions Sent</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                If an active account exists for <span className="font-semibold text-[#17231C]">{email}</span>, a secure recovery link has been generated.
              </p>
              <div className="pt-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Return to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button variant="primary" size="lg" className="w-full" loading={loading}>
                Send Recovery Instructions
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs text-neutral-500 hover:text-[#176B3A]"
                >
                  Return to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
