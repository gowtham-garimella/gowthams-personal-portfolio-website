import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Key, ArrowLeft, ShieldCheck, Eye, EyeOff, Check, RefreshCw } from 'lucide-react';

const AdminLogin = () => {
  const [isSetup, setIsSetup] = useState(true);
  const [mode, setMode] = useState('login'); // 'login' or 'setup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/auth/status')
      .then(res => {
        setIsSetup(res.data.isSetup);
        if (!res.data.isSetup) {
          setMode('setup');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Auth status fetch error:", err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (mode === 'setup') {
      try {
        const setupRes = await axios.post('/api/auth/setup', { username, password });
        setSuccess(setupRes.data.message || 'Admin account ready! Authenticating...');
        
        // Automatically login right after setup/reset
        const loginRes = await axios.post('/api/auth/login', { username, password });
        if (loginRes.data && loginRes.data.token) {
          localStorage.setItem('adminToken', loginRes.data.token);
          setTimeout(() => navigate('/admin/dashboard'), 600);
        } else {
          setMode('login');
          setSubmitting(false);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Setup / Password reset failed');
        setSubmitting(false);
      }
    } else {
      try {
        const res = await axios.post('/api/auth/login', { username, password });
        if (res.data && res.data.token) {
          localStorage.setItem('adminToken', res.data.token);
          setSuccess('Login successful! Redirecting to dashboard...');
          setTimeout(() => navigate('/admin/dashboard'), 500);
        } else {
          setError('No token received from server');
          setSubmitting(false);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid username or password. If you forgot your password, switch to the Reset / Setup tab above.');
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col justify-center items-center text-white">
        <div className="loader"></div>
        <p className="text-xs uppercase tracking-widest text-cyan-400 mt-4 font-mono">
          Connecting to Admin Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

      {/* Top Return Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-cyan-400/50 hover:bg-white/10 text-xs font-semibold tracking-wider transition-all shadow-md"
        >
          <ArrowLeft size={16} /> RETURN TO PORTFOLIO
        </Link>
      </div>

      {/* Login / Setup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-neon w-full max-w-md p-8 sm:p-10 relative z-10 shadow-2xl"
      >
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/40 inline-flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            {mode === 'setup' ? (
              <ShieldCheck size={28} className="text-cyan-400" />
            ) : (
              <Lock size={26} className="text-purple-400" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            {mode === 'setup' ? 'Admin Setup / Reset' : 'Admin Portal Login'}
          </h2>
          <p className="text-xs uppercase tracking-widest text-white/50 mt-1 font-mono">
            {mode === 'setup' 
              ? '// Create or Reset Credentials to Manage Portfolio' 
              : '// Authenticate to Access Secure Dashboard'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-black/60 border border-white/10 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              mode === 'login' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('setup'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              mode === 'setup' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {isSetup ? 'Reset Password' : 'New Setup'}
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/50 text-red-300 text-xs text-center mb-5 font-medium leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 text-xs text-center mb-5 font-medium leading-relaxed flex items-center justify-center gap-2">
            <Check size={16} /> {success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Input */}
          <div className="form-group text-left">
            <label className="form-label flex items-center gap-1.5 text-xs font-semibold text-white/90 uppercase tracking-wider mb-2">
              <User size={14} className="text-cyan-400" />
              <span>Username</span>
            </label>
            <input 
              type="text" 
              className="form-input text-white" 
              placeholder="e.g. gowtham or admin"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              autoFocus
              style={{
                color: '#ffffff',
                backgroundColor: 'rgba(20, 20, 26, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontSize: '1rem',
                caretColor: '#00f0ff'
              }}
            />
          </div>

          {/* Password Input with Visibility Toggle */}
          <div className="form-group text-left">
            <div className="flex items-center justify-between mb-2">
              <label className="form-label flex items-center gap-1.5 text-xs font-semibold text-white/90 uppercase tracking-wider mb-0">
                <Key size={14} className="text-purple-400" />
                <span>Password {mode === 'setup' && <span className="text-white/40 font-mono text-[10px]">(Min 6 chars)</span>}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/50 hover:text-cyan-300 transition-colors text-xs flex items-center gap-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input text-white pr-10" 
                placeholder="Enter passcode"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={mode === 'setup' ? 6 : undefined}
                style={{
                  color: '#ffffff',
                  backgroundColor: 'rgba(20, 20, 26, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontSize: '1rem',
                  caretColor: '#00f0ff'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full mt-4 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-white bg-gradient-contact shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'setup' ? (
              <span>Save Credentials & Enter</span>
            ) : (
              <span>Authenticate & Enter</span>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="text-center mt-6 pt-5 border-t border-white/10 text-[11px] font-mono text-white/40 tracking-wider">
          PROTECTED BY JWT TOKEN AUTH & BCRYPT
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
