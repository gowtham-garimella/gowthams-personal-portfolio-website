import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminSetup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already setup
    axios.get('/api/auth/status')
      .then(res => {
        if (res.data.isSetup) {
          navigate('/admin/login');
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/setup', { username, password });
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Setup failed');
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Welcome to Your Portfolio</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Let's set up your admin account.</p>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              minLength="6"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Complete Setup</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
