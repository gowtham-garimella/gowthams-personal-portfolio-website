import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Briefcase, Code, User, BookOpen, Terminal, Database, Cpu, Server, HardDrive, Monitor, Wifi, Layers, Box, Network, Medal } from 'lucide-react';

const BackgroundAnimation = () => {  // Software dev elements to float around
  const elements = [
    { id: 1, type: 'icon', icon: <Terminal size={80} color="rgba(139, 92, 246, 0.4)" />, top: '10%', left: '15%', duration: 25 },
    { id: 2, type: 'text', text: '< />', top: '40%', left: '5%', duration: 30, color: 'rgba(56, 189, 248, 0.3)' },
    { id: 3, type: 'icon', icon: <Database size={90} color="rgba(236, 72, 153, 0.3)" />, top: '70%', left: '20%', duration: 22 },
    { id: 4, type: 'text', text: '{ }', top: '20%', right: '15%', duration: 28, color: 'rgba(139, 92, 246, 0.3)' },
    { id: 5, type: 'icon', icon: <Cpu size={100} color="rgba(56, 189, 248, 0.3)" />, top: '50%', right: '10%', duration: 35 },
    { id: 6, type: 'text', text: '0101', top: '80%', right: '25%', duration: 24, color: 'rgba(236, 72, 153, 0.3)' },
    { id: 7, type: 'icon', icon: <Code size={85} color="rgba(139, 92, 246, 0.4)" />, top: '85%', left: '50%', duration: 20 },
    { id: 8, type: 'icon', icon: <Server size={75} color="rgba(56, 189, 248, 0.4)" />, top: '15%', left: '45%', duration: 28 },
    { id: 9, type: 'icon', icon: <HardDrive size={70} color="rgba(236, 72, 153, 0.3)" />, top: '35%', right: '30%', duration: 22 },
    { id: 10, type: 'icon', icon: <Network size={95} color="rgba(139, 92, 246, 0.4)" />, top: '60%', left: '40%', duration: 32 },
    { id: 11, type: 'icon', icon: <Layers size={80} color="rgba(56, 189, 248, 0.3)" />, top: '25%', left: '75%', duration: 26 },
    { id: 12, type: 'text', text: '=>', top: '5%', right: '40%', duration: 21, color: 'rgba(236, 72, 153, 0.3)' },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', perspective: '1200px', transformStyle: 'preserve-3d' }}>
      <div style={{
          position: 'absolute', top: '10%', left: '5%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', opacity: 0.8
        }} />
      <div style={{
          position: 'absolute', bottom: '-20%', right: '5%', width: '45vw', height: '45vw',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', opacity: 0.8
        }} />

      {elements.map((el) => (
        <motion.div
          key={el.id}
          animate={{
            y: [0, -80, 80, 0],
            x: [0, 50, -50, 0],
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360],
            rotateZ: [0, 90, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: el.duration, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: el.top,
            left: el.left,
            right: el.right,
            fontSize: '5rem',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            color: el.color,
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform, opacity'
          }}
        >
          {el.type === 'icon' ? el.icon : el.text}
        </motion.div>
      ))}
    </div>
  );
};

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/portfolio')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching portfolio data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader"></div>;
  if (!data || !data.profile) return <div className="container section"><h1>Portfolio not setup yet. Go to <a href="/admin/setup" style={{color: 'var(--accent-color)'}}>/admin/setup</a></h1></div>;

  const { profile, experience, projects, skills, education, certifications } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="portfolio">
      <BackgroundAnimation />
      
      {/* Hero Section */}
      <section className="section container">
        <motion.div 
          className="hero glass"
          style={{ padding: '4rem', marginTop: '4rem', background: 'rgba(10, 10, 10, 0.4)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {profile.avatar_url && (
              <motion.img 
                src={profile.avatar_url}
                alt="Avatar" 
                style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-color)' }}
                whileHover={{ scale: 1.05, rotate: 3 }}
              />
            )}
            <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', margin: '0' }}>{profile.name}</h1>
                <h2 style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', margin: '0', fontWeight: '500', borderLeft: '2px solid var(--accent-color)', paddingLeft: '1.5rem' }}>{profile.title}</h2>
              </div>
              <p style={{ maxWidth: '600px', margin: '0 0 2rem 0', fontSize: '1.1rem', lineHeight: '1.6' }}>{profile.bio}</p>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary"><Github /></a>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-secondary"><Linkedin /></a>}
                {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="btn-secondary"><Twitter /></a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="btn-secondary"><Mail /></a>}
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-primary">Download Resume</a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="section container">
          <h2><User style={{ display: 'inline', marginRight: '10px' }}/> Skills</h2>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {skills.map(skill => (
              <motion.div key={skill.id} variants={itemVariants} whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 92, 246, 0.2)' }} className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: '30px', background: 'rgba(10, 10, 10, 0.4)', transition: 'background-color 0.3s' }}>
                <span style={{ fontWeight: '500' }}>{skill.name}</span>
                {skill.proficiency && <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>{skill.proficiency}%</span>}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="section container">
          <h2><BookOpen style={{ display: 'inline', marginRight: '10px' }}/> Education</h2>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {education.map(edu => (
              <motion.div key={edu.id} variants={itemVariants} className="glass" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'rgba(10, 10, 10, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-color)' }}>{edu.degree}</h3>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>{edu.institution}</h4>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {edu.start_date} - {edu.end_date || 'Present'}
                  </div>
                </div>
                <p style={{ marginTop: '1rem' }}>{edu.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="section container">
          <h2><Briefcase style={{ display: 'inline', marginRight: '10px' }}/> Experience</h2>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {experience.map(exp => (
              <motion.div key={exp.id} variants={itemVariants} className="glass" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'rgba(10, 10, 10, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-color)' }}>{exp.role}</h3>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>{exp.company}</h4>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {exp.start_date} - {exp.end_date || 'Present'}
                  </div>
                </div>
                <p style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="section container">
          <h2><Code style={{ display: 'inline', marginRight: '10px' }}/> Projects</h2>
          <motion.div 
            variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
          >
            {projects.map(proj => (
              <motion.div key={proj.id} variants={itemVariants} whileHover={{ y: -10 }} className="glass" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(10, 10, 10, 0.4)' }}>
                {proj.image_url && <img src={proj.image_url} alt={proj.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{proj.title}</h3>
                  <p style={{ flex: 1, marginBottom: '1rem' }}>{proj.description}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginBottom: '1.5rem' }}>{proj.tech_stack}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}><Github size={18}/></a>}
                    {proj.demo_url && <a href={proj.demo_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '0.5rem 1rem' }}><ExternalLink size={18}/> Live</a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <section className="section container">
          <h2><Medal style={{ display: 'inline', marginRight: '10px' }}/> Certifications</h2>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {certifications.map(cert => (
              <motion.div key={cert.id} variants={itemVariants} className="glass" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'rgba(10, 10, 10, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-color)' }}>{cert.title}</h3>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>{cert.issuer}</h4>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {cert.date}
                  </div>
                </div>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem' }}>
                    <ExternalLink size={16}/> View Certificate
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Footer / Admin Link */}
      <footer style={{ textAlign: 'center', padding: '3rem 1rem', marginTop: '4rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ marginBottom: '1rem' }}>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <a 
          href="/admin/login" 
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, transition: 'opacity 0.2s', fontSize: '0.9rem' }} 
          onMouseOver={e => e.currentTarget.style.opacity = 1} 
          onMouseOut={e => e.currentTarget.style.opacity = 0.5}
        >
          <User size={14} /> Admin Portal
        </a>
      </footer>

    </div>
  );
};

export default Portfolio;
