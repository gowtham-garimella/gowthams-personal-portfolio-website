import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Briefcase, Code, Award, BookOpen, LogOut, Upload, Plus, Trash2, Edit2, X, Medal } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/portfolio');
      setData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const currentTab = location.pathname.split('/').pop() || 'profile';

  if (!data) return <div className="loader"></div>;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar glass" style={{ margin: '1rem', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Panel</h3>
        <Link to="/admin/profile" className={`admin-nav-item ${currentTab === 'profile' ? 'active' : ''}`}><User size={20} /> Profile Info</Link>
        <Link to="/admin/experience" className={`admin-nav-item ${currentTab === 'experience' ? 'active' : ''}`}><Briefcase size={20} /> Experience</Link>
        <Link to="/admin/projects" className={`admin-nav-item ${currentTab === 'projects' ? 'active' : ''}`}><Code size={20} /> Projects</Link>
        <Link to="/admin/skills" className={`admin-nav-item ${currentTab === 'skills' ? 'active' : ''}`}><Award size={20} /> Skills</Link>
        <Link to="/admin/education" className={`admin-nav-item ${currentTab === 'education' ? 'active' : ''}`}><BookOpen size={20} /> Education</Link>
        <Link to="/admin/certifications" className={`admin-nav-item ${currentTab === 'certifications' ? 'active' : ''}`}><Medal size={20} /> Certifications</Link>
        
        <div style={{ flex: 1 }}></div>
        <a href="/" target="_blank" className="btn-secondary" style={{ textAlign: 'center', marginBottom: '1rem' }}>View Live Site</a>
        <button onClick={handleLogout} className="admin-nav-item" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', width: '100%' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<ProfileForm profile={data.profile} token={token} onUpdate={fetchData} />} />
          <Route path="/profile" element={<ProfileForm profile={data.profile} token={token} onUpdate={fetchData} />} />
          <Route path="/experience" element={<ListManager table="experience" items={data.experience} token={token} onUpdate={fetchData} fields={['company', 'role', 'start_date', 'end_date', 'description']} />} />
          <Route path="/projects" element={<ListManager table="projects" items={data.projects} token={token} onUpdate={fetchData} fields={['title', 'description', 'tech_stack', 'github_url', 'demo_url']} />} />
          <Route path="/skills" element={<ListManager table="skills" items={data.skills} token={token} onUpdate={fetchData} fields={['name', 'category', 'proficiency']} />} />
          <Route path="/education" element={<ListManager table="education" items={data.education} token={token} onUpdate={fetchData} fields={['institution', 'degree', 'start_date', 'end_date', 'description']} />} />
          <Route path="/certifications" element={<ListManager table="certifications" items={data.certifications} token={token} onUpdate={fetchData} fields={['title', 'issuer', 'date', 'url']} />} />
        </Routes>
      </div>
    </div>
  );
};

// Sub-components for forms

const ProfileForm = ({ profile, token, onUpdate }) => {
  const [formData, setFormData] = useState(profile || {});
  const [msg, setMsg] = useState('');
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('Profile updated successfully!');
      onUpdate();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error updating profile');
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    try {
      await axios.post(`http://localhost:8000/api/upload/avatar`, data, { headers: { Authorization: `Bearer ${token}` } });
      onUpdate();
      setMsg(`Avatar uploaded successfully!`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(`Error uploading Avatar`);
    }
    e.target.value = '';
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    try {
      await axios.post(`http://localhost:8000/api/upload/resume`, data, { headers: { Authorization: `Bearer ${token}` } });
      onUpdate();
      setMsg(`Resume uploaded successfully!`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(`Error uploading Resume`);
    }
    e.target.value = '';
  };





  return (
    <div className="glass" style={{ padding: '2rem', position: 'relative' }}>


      <h2 style={{ marginBottom: '2rem', textAlign: 'left' }}>Profile Information</h2>
      {msg && <div style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>{msg}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', flex: 1, textAlign: 'center' }}>
          <h4>Profile Picture</h4>
          {profile?.avatar_url && <img src={`http://localhost:8000${profile.avatar_url}`} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', margin: '1rem auto' }} />}
          <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Upload size={16} /> {profile?.avatar_url ? 'Update Photo' : 'Upload Photo'}
            <input type="file" hidden onChange={uploadAvatar} accept="image/*" />
          </label>
        </div>
        <div className="glass" style={{ padding: '1.5rem', flex: 1, textAlign: 'center' }}>
          <h4>Resume / CV</h4>
          {profile?.resume_url && <a href={`http://localhost:8000${profile.resume_url}`} target="_blank" rel="noreferrer" style={{ display: 'block', margin: '1rem 0', color: 'var(--accent-color)' }}>View Current Resume</a>}
          <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Upload size={16} /> {profile?.resume_url ? 'Update Resume PDF' : 'Upload Resume PDF'}
            <input type="file" hidden onChange={uploadResume} accept=".pdf,.doc,.docx" />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group"><label className="form-label">Name</label><input type="text" name="name" className="form-input" value={formData.name || ''} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">Professional Title</label><input type="text" name="title" className="form-input" value={formData.title || ''} onChange={handleChange} /></div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Bio</label><textarea name="bio" className="form-input" value={formData.bio || ''} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">Email</label><input type="email" name="email" className="form-input" value={formData.email || ''} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">Phone</label><input type="text" name="phone" className="form-input" value={formData.phone || ''} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">GitHub URL</label><input type="url" name="github" className="form-input" value={formData.github || ''} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">LinkedIn URL</label><input type="url" name="linkedin" className="form-input" value={formData.linkedin || ''} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">Twitter/X URL</label><input type="url" name="twitter" className="form-input" value={formData.twitter || ''} onChange={handleChange} /></div>
        <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>Save Profile Details</button>
      </form>
    </div>
  );
};

const ListManager = ({ table, items, token, onUpdate, fields }) => {
  const [formData, setFormData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/${table}/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`http://localhost:8000/api/${table}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setFormData({});
      setIsAdding(false);
      setEditingId(null);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    }
  };

  const handleEditClick = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setFormData({});
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/${table}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'left', margin: 0, textTransform: 'capitalize' }}>Manage {table}</h2>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={18}/> Add New</button>}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            <button type="button" onClick={handleCancel} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={20}/></button>
          </div>
          {fields.map(field => (
            <div key={field} className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{field.replace('_', ' ')}</label>
              {field === 'description' ? 
                <textarea className="form-input" value={formData[field] || ''} onChange={e => setFormData({...formData, [field]: e.target.value})} required={field!=='end_date'} /> :
                <input type={field.includes('url') ? 'url' : field === 'proficiency' ? 'number' : 'text'} className="form-input" value={formData[field] || ''} onChange={e => setFormData({...formData, [field]: e.target.value})} required={field!=='end_date'} />
              }
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary">{editingId ? 'Update Item' : 'Save Item'}</button>
            <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items && items.length > 0 ? items.map(item => (
          <div key={item.id} className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.title || item.role || item.name || item.degree}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.company || item.institution || item.tech_stack || item.category}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEditClick(item)} className="btn-secondary" style={{ padding: '0.5rem' }}>
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )) : <p>No items found. Add one above.</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
