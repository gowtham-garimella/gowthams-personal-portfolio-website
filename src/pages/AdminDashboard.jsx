import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Briefcase, Code, Award, BookOpen, LogOut, Upload, Plus, Trash2, Edit2, X, Medal, FileText, Download, CheckCircle, ExternalLink, FileCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await axios.get('/api/auth/status');
        if (!res.data.isSetup) {
          localStorage.removeItem('adminToken');
          navigate('/admin/setup');
          return;
        }

        if (!token) {
          navigate('/admin/login');
          return;
        }

        fetchData();
      } catch (err) {
        console.error(err);
      }
    };

    checkAccess();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/portfolio');
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
        <Link to="/admin/research" className={`admin-nav-item ${currentTab === 'research' ? 'active' : ''}`}><FileText size={20} /> Research Papers</Link>
        
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
          <Route path="/research" element={<ResearchManager items={data.research_papers} token={token} onUpdate={fetchData} />} />
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
      await axios.post('/api/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
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
      await axios.post(`/api/upload/avatar`, data, { headers: { Authorization: `Bearer ${token}` } });
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
      await axios.post(`/api/upload/resume`, data, { headers: { Authorization: `Bearer ${token}` } });
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
          {profile?.avatar_url && <img src={profile.avatar_url} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', margin: '1rem auto' }} />}
          <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Upload size={16} /> {profile?.avatar_url ? 'Update Photo' : 'Upload Photo'}
            <input type="file" hidden onChange={uploadAvatar} accept="image/*" />
          </label>
        </div>
        <div className="glass" style={{ padding: '1.5rem', flex: 1, textAlign: 'center' }}>
          <h4>Resume / CV</h4>
          {profile?.resume_url && <a href={profile.resume_url} target="_blank" rel="noreferrer" style={{ display: 'block', margin: '1rem 0', color: 'var(--accent-color)' }}>View Current Resume</a>}
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
        await axios.put(`/api/${table}/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`/api/${table}`, formData, { headers: { Authorization: `Bearer ${token}` } });
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
      await axios.delete(`/api/${table}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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

const ResearchManager = ({ items, token, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingPaper, setUploadingPaper] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter a research paper title.');
      return;
    }
    if (!formData.paper_url) {
      alert('Please upload your research paper PDF or provide a paper document URL.');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`/api/research_papers/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`/api/research_papers`, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setFormData({});
      setIsAdding(false);
      setEditingId(null);
      setUploadError('');
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Error saving research paper');
    }
  };

  const handleEditClick = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(true);
    setUploadError('');
  };

  const handleCancel = () => {
    setFormData({});
    setIsAdding(false);
    setEditingId(null);
    setUploadError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this research paper?')) return;
    try {
      await axios.delete(`/api/research_papers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Error deleting research paper');
    }
  };

  const handlePaperUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPaper(true);
    setUploadError('');
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await axios.post('/api/upload/research', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({
        ...prev,
        paper_url: res.data.url,
        paper_filename: res.data.originalname || file.name
      }));
    } catch (err) {
      console.error(err);
      setUploadError('Failed to upload research paper PDF. Please try again.');
    } finally {
      setUploadingPaper(false);
    }
    e.target.value = '';
  };

  const handleProofUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingProof(true);
    setUploadError('');
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await axios.post('/api/upload/proof', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({
        ...prev,
        proof_url: res.data.url,
        proof_filename: res.data.originalname || file.name
      }));
    } catch (err) {
      console.error(err);
      setUploadError('Failed to upload publication proof file. Please try again.');
    } finally {
      setUploadingProof(false);
    }
    e.target.value = '';
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ textAlign: 'left', margin: 0 }}>Manage Research Papers</h2>
          <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>Add research publications, upload PDFs, and attach proof of publication.</p>
        </div>
        {!isAdding && (
          <button onClick={() => { setIsAdding(true); setFormData({}); setEditingId(null); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18}/> Add Research Paper
          </button>
        )}
      </div>

      {uploadError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {uploadError}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSave} className="glass" style={{ padding: '2rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Research Paper' : 'Add New Research Paper'}</h3>
            <button type="button" onClick={handleCancel} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={20}/></button>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Paper Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Deep Learning Approaches to Autonomous Navigation"
              value={formData.title || ''} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Authors / Contributors</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Gowtham Garimella, Dr. Jane Doe"
                value={formData.authors || ''} 
                onChange={e => setFormData({ ...formData, authors: e.target.value })} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Journal / Conference / Publisher</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. IEEE Transactions on AI / Springer / arXiv"
                value={formData.journal_or_conference || ''} 
                onChange={e => setFormData({ ...formData, journal_or_conference: e.target.value })} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Publication Date / Year</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. October 2025"
                value={formData.publication_date || ''} 
                onChange={e => setFormData({ ...formData, publication_date: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Abstract / Summary</label>
            <textarea 
              className="form-input" 
              rows={4}
              placeholder="Brief summary or abstract of the research paper..."
              value={formData.description || ''} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
            />
          </div>

          {/* Research Paper File Upload */}
          <div className="glass" style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--accent-color)" /> Research Paper PDF / Document *
            </h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Upload your research paper file (.pdf or .doc/.docx). This will be directly downloadable by everyone on your portfolio.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Upload size={16} /> {uploadingPaper ? 'Uploading...' : formData.paper_url ? 'Replace Paper File' : 'Upload Paper (PDF/DOC)'}
                <input type="file" hidden onChange={handlePaperUpload} accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
              </label>

              {formData.paper_filename && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} />
                  <span>{formData.paper_filename}</span>
                </div>
              )}

              {formData.paper_url && (
                <a href={formData.paper_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Download size={14} /> Preview Current File
                </a>
              )}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Or provide direct paper document URL</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="https://example.com/paper.pdf or /api/uploads/..."
                value={formData.paper_url || ''} 
                onChange={e => setFormData({ ...formData, paper_url: e.target.value })} 
              />
            </div>
          </div>

          {/* Proof of Research Publication */}
          <div className="glass" style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="#38bdf8" /> Proof of Research Publication
            </h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Upload publication certificate / acceptance letter (PDF or Image), or paste a link to the official publication / DOI.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Upload size={16} /> {uploadingProof ? 'Uploading...' : formData.proof_url ? 'Replace Proof File' : 'Upload Proof (PDF/Image)'}
                <input type="file" hidden onChange={handleProofUpload} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
              </label>

              {formData.proof_filename && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} />
                  <span>{formData.proof_filename}</span>
                </div>
              )}

              {formData.proof_url && (
                <a href={formData.proof_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ExternalLink size={14} /> View Proof
                </a>
              )}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Or paste Publication / DOI URL</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://doi.org/10.xxxx/... or https://ieeexplore.ieee.org/..."
                value={formData.proof_url || ''} 
                onChange={e => setFormData({ ...formData, proof_url: e.target.value })} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={uploadingPaper || uploadingProof}>
              {editingId ? 'Update Research Paper' : 'Save Research Paper'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {/* List of existing Research Papers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {items && items.length > 0 ? items.map(item => (
          <div key={item.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{item.title}</h4>
                {item.publication_date && (
                  <span style={{ fontSize: '0.8rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    {item.publication_date}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
                {item.authors && <span style={{ marginRight: '1rem' }}><strong>Authors:</strong> {item.authors}</span>}
                {item.journal_or_conference && <span><strong>Venue:</strong> {item.journal_or_conference}</span>}
              </p>

              {item.description && (
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem', maxWidth: '700px' }}>
                  {item.description.length > 150 ? item.description.slice(0, 150) + '...' : item.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {item.paper_download_url || item.paper_url ? (
                  <a href={item.paper_download_url || item.paper_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Download size={14} color="var(--accent-color)"/> Download Paper
                  </a>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>No PDF attached</span>
                )}

                {item.proof_download_url || item.proof_url ? (
                  <a href={item.proof_download_url || item.proof_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCheck size={14} color="#38bdf8"/> Proof of Publication
                  </a>
                ) : null}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEditClick(item)} className="btn-secondary" style={{ padding: '0.5rem' }} title="Edit">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem' }} title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )) : <p>No research papers found. Click "Add Research Paper" above to add your first paper.</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
