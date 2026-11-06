import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Key, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

const AdminLogin = () => {
  const [isSetup, setIsSetup] = useState(true);
  const [mode, setMode] = useState('login'); // 'login' or 'setup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
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
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'setup') {
      try {
        await axios.post('/api/auth/setup', { username, password });
        setSuccess('Admin created successfully! Now logging in...');
        // Automatically login right after setup
        const loginRes = await axios.post('/api/auth/login', { username, password });
        localStorage.setItem('adminToken', loginRes.data.token);
        setTimeout(() => navigate('/admin/dashboard'), 800);
      } catch (err) {
        setError(err.response?.data?.error || 'Setup failed');
      }
    } else {
      try {
        const res = await axios.post('/api/auth/login', { username, password });
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid username or password');
      }
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Return Link */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-pixel)',
            letterSpacing: '0.08em',
            padding: '0.4rem 0.8rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)'
          }}
          onMouseOver={e => e.currentTarget.style.color = '#00f0ff'}
          onMouseOut={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
        >
          <ArrowLeft size={16} /> RETURN TO PORTFOLIO
        </Link>
      </div>

      {/* Login / Setup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-neon"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.75rem 2.5rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(168,85,247,0.15))',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
          }}>
            {mode === 'setup' ? <ShieldCheck size={28} color="#00f0ff" /> : <Lock size={28} color="#a855f7" />}
          </div>

          <h2 className="font-inter" style={{ fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '0.35rem' }}>
            {mode === 'setup' ? 'Admin Initial Setup' : 'Admin Portal'}
          </h2>
          <p className="font-pixel" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.08em' }}>
            {mode === 'setup' 
              ? '// CREATE CREDENTIALS TO MANAGE PORTFOLIO' 
              : '// AUTHENTICATE TO ACCESS SECURE DASHBOARD'}
          </p>
        </div>

        {/* Mode Selector Tabs (If Setup is Already Done, allow switching) */}
        {isSetup && (
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '4px',
            marginBottom: '1.75rem'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-pixel)',
                letterSpacing: '0.08em',
                background: mode === 'login' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                color: mode === 'login' ? '#00f0ff' : 'rgba(255, 255, 255, 0.6)',
                border: mode === 'login' ? '1px solid rgba(0, 240, 255, 0.4)' : 'none',
                fontWeight: mode === 'login' ? 700 : 400
              }}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => { setMode('setup'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-pixel)',
                letterSpacing: '0.08em',
                background: mode === 'setup' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: mode === 'setup' ? '#c084fc' : 'rgba(255, 255, 255, 0.6)',
                border: mode === 'setup' ? '1px solid rgba(168, 85, 247, 0.4)' : 'none',
                fontWeight: mode === 'setup' ? 700 : 400
              }}
            >
              NEW SETUP
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}
          >
            {success}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} color="#00f0ff" />
              <span>USERNAME</span>
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter admin username"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={14} color="#a855f7" />
              <span>PASSWORD {mode === 'setup' && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(MIN 6 CHARS)</span>}</span>
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              minLength={mode === 'setup' ? 6 : undefined}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              marginTop: '1.5rem',
              padding: '0.9rem',
              fontSize: '0.95rem'
            }}
          >
            {mode === 'setup' ? 'COMPLETE SETUP & ENTER' : 'AUTHENTICATE & ENTER'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <span className="font-pixel" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
            SECURED BY JWT & BCRYPT ENCRYPTION
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
