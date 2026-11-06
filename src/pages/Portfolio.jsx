import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  ExternalLink, 
  Download, 
  FileText, 
  FileCheck, 
  Menu, 
  X, 
  Play, 
  Sparkles,
  Terminal,
  Database,
  Cpu,
  Code,
  Layers,
  Lock,
  ArrowUpRight
} from 'lucide-react';

// ========================================================
// 1. ADVANCED ANIMATED BACKGROUND: INTERACTIVE NEURAL MESH
// ========================================================
const InteractiveNeuralBg = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic Nodes
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 70);
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 0.8,
      color: Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, '
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes to each other
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const alpha = 0.15 * (1 - dist / 125);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Connect nodes to mouse cursor
        const mdx = n1.x - mouseRef.current.x;
        const mdy = n1.y - mouseRef.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          const malpha = 0.35 * (1 - mdist / 160);
          ctx.strokeStyle = `rgba(168, 85, 247, ${malpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }

        // Move nodes
        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0) n1.x = width;
        if (n1.x > width) n1.x = 0;
        if (n1.y < 0) n1.y = height;
        if (n1.y > height) n1.y = 0;

        // Draw node dot with glow
        ctx.fillStyle = `${n1.color}0.7)`;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

// ========================================================
// 2. 3D FLOATING SOFTWARE DEV & AI GLYPHS IN BACKGROUND
// ========================================================
const FloatingTechGlyphs = () => {
  const glyphs = [
    { id: 1, type: 'icon', icon: <Terminal size={64} />, top: '12%', left: '10%', duration: 22, color: 'rgba(0, 240, 255, 0.22)' },
    { id: 2, type: 'text', text: '< />', top: '38%', left: '6%', duration: 26, color: 'rgba(168, 85, 247, 0.25)' },
    { id: 3, type: 'icon', icon: <Database size={70} />, top: '75%', left: '14%', duration: 20, color: 'rgba(16, 185, 129, 0.22)' },
    { id: 4, type: 'text', text: '{ }', top: '22%', right: '12%', duration: 24, color: 'rgba(236, 72, 153, 0.25)' },
    { id: 5, type: 'icon', icon: <Cpu size={80} />, top: '55%', right: '8%', duration: 28, color: 'rgba(0, 240, 255, 0.22)' },
    { id: 6, type: 'text', text: '0101', top: '82%', right: '18%', duration: 23, color: 'rgba(245, 158, 11, 0.22)' },
    { id: 7, type: 'text', text: 'AI // ML', top: '8%', right: '28%', duration: 30, color: 'rgba(168, 85, 247, 0.25)' },
    { id: 8, type: 'icon', icon: <Code size={68} />, top: '65%', left: '45%', duration: 25, color: 'rgba(56, 189, 248, 0.2)' },
    { id: 9, type: 'text', text: '=>', top: '92%', left: '35%', duration: 21, color: 'rgba(0, 240, 255, 0.25)' },
    { id: 10, type: 'icon', icon: <Layers size={62} />, top: '42%', left: '85%', duration: 27, color: 'rgba(168, 85, 247, 0.2)' }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Deep Space Glowing Nebulae */}
      <div style={{
        position: 'absolute', top: '5%', left: '5%', width: '45vw', height: '45vw',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.055) 0%, transparent 65%)',
        borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', right: '5%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 65%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '45%', left: '35%', width: '35vw', height: '35vw',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.035) 0%, transparent 60%)',
        borderRadius: '50%', filter: 'blur(45px)', pointerEvents: 'none'
      }} />

      {/* Floating 3D Elements */}
      {glyphs.map((item) => (
        <motion.div
          key={item.id}
          animate={{
            y: [0, -45, 45, 0],
            x: [0, 30, -30, 0],
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360],
            rotateZ: [0, 90, 0],
            opacity: [0.25, 0.7, 0.25]
          }}
          transition={{ duration: item.duration, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
            fontSize: '3rem',
            fontFamily: 'var(--font-pixel)',
            fontWeight: 'bold',
            color: item.color,
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform, opacity',
            filter: `drop-shadow(0 0 12px ${item.color})`
          }}
        >
          {item.type === 'icon' ? item.icon : item.text}
        </motion.div>
      ))}
    </div>
  );
};

// ========================================================
// 3. ADVANCED 3D INTERACTIVE HOLOGRAPHIC PORTRAIT
// ========================================================
const ThreeDPhoto = ({ src = "/images/gowtham.jpg", alt = "G.S.G.R. Gowtham" }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 180, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 180, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["16deg", "-16deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-16deg", "16deg"]);
  const glareOpacity = useTransform(mouseY, [-0.5, 0.5], [0.4, 0.05]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      style={{ 
        perspective: '1200px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '1.5rem 0'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          cursor: 'pointer'
        }}
        animate={{
          y: [0, -14, 0],
          rotateZ: [0, 0.8, -0.8, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 6.5,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.04 }}
      >
        {/* Holographic Glowing 3D Backplate */}
        <div style={{
          position: 'absolute',
          inset: -14,
          border: '1px solid rgba(0, 240, 255, 0.4)',
          borderRadius: '8px',
          transform: 'translateZ(-25px)',
          pointerEvents: 'none',
          boxShadow: '0 0 35px rgba(0, 240, 255, 0.18)'
        }}>
          {/* Corner Crosshairs */}
          <span style={{ position: 'absolute', top: -7, left: -6, color: '#00f0ff', fontSize: '12px', fontFamily: 'var(--font-pixel)' }}>+</span>
          <span style={{ position: 'absolute', top: -7, right: -6, color: '#00f0ff', fontSize: '12px', fontFamily: 'var(--font-pixel)' }}>+</span>
          <span style={{ position: 'absolute', bottom: -7, left: -6, color: '#a855f7', fontSize: '12px', fontFamily: 'var(--font-pixel)' }}>+</span>
          <span style={{ position: 'absolute', bottom: -7, right: -6, color: '#a855f7', fontSize: '12px', fontFamily: 'var(--font-pixel)' }}>+</span>
        </div>

        {/* Main Photo Container with High-Res Image */}
        <div style={{
          width: 'clamp(260px, 26vw, 360px)',
          aspectRatio: '1 / 1',
          position: 'relative',
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 240, 255, 0.5)',
          background: '#000000',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 240, 255, 0.2)'
        }}>
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'contrast(1.05) brightness(1.02)'
            }}
          />

          {/* Holographic Scanning Laser Line */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #00f0ff, #a855f7, transparent)',
              boxShadow: '0 0 16px #00f0ff, 0 0 8px #a855f7',
              pointerEvents: 'none'
            }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: 'linear' }}
          />

          {/* Interactive Light Glare Effect */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(0,240,255,0.3) 0%, transparent 65%)',
              opacity: glareOpacity,
              pointerEvents: 'none',
              mixBlendMode: 'screen'
            }}
          />

          {/* Inner Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 35px rgba(0, 0, 0, 0.6)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* 3D Floating Tag: Top Right (AI / SOFTWARE ENG) */}
        <motion.div
          style={{
            position: 'absolute',
            top: -16,
            right: -16,
            transform: 'translateZ(50px)',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            backdropFilter: 'blur(10px)',
            padding: '0.45rem 0.9rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(16, 185, 129, 0.25)'
          }}
        >
          <span className="play-dot" style={{ backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span className="font-pixel" style={{ fontSize: '0.82rem', color: '#34d399', letterSpacing: '0.08em', fontWeight: 600 }}>
            AI / SOFTWARE ENG
          </span>
        </motion.div>

        {/* 3D Floating Tag: Bottom Left (G.S.G.R. GOWTHAM) */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: -16,
            left: -14,
            transform: 'translateZ(40px)',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(0, 240, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            padding: '0.45rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(0, 240, 255, 0.2)'
          }}
        >
          <span className="font-pixel" style={{ fontSize: '0.88rem', color: '#00f0ff', letterSpacing: '0.1em', fontWeight: 600 }}>
            [ G.S.G.R. GOWTHAM ]
          </span>
        </motion.div>

        {/* 3D Floating Tag: Bottom Right (EDITION 2026) */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: -16,
            right: -12,
            transform: 'translateZ(30px)',
            background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
            color: '#000000',
            padding: '0.3rem 0.7rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-pixel)',
            letterSpacing: '0.08em',
            boxShadow: '0 8px 20px rgba(0, 240, 255, 0.4)'
          }}
        >
          PORTFOLIO 2026
        </motion.div>
      </motion.div>
    </div>
  );
};

// Fallback & exact database inventory data (100% Zero Content Loss)
const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    id: 1,
    name: "G.S.G.R.GOWTHAM",
    title: "Software Developer / AI Devloper",
    bio: "Welcome to my dynamic portfolio. Update this in the admin dashboard.",
    email: "gowthamgarimella19@gmail.com",
    phone: "9110722141",
    github: "https://github.com/gowtham-garimella",
    linkedin: "https://www.linkedin.com/in/gowtham-ganesh-b1905b265/",
    twitter: null,
    resume_url: "/api/uploads/1779014651321-272459355.pdf",
    avatar_url: "/images/gowtham.jpg",
    background_url: "/uploads/1778918062910-724308724.png"
  },
  experience: [
    {
      id: 1,
      company: "codsoft",
      role: "web devlopment intern",
      start_date: "1-12-23",
      end_date: "31-12-23",
      description: "learned to creat. websites with 3d animations and interactive websites"
    }
  ],
  projects: [
    {
      id: 1,
      title: "banking-management-system-using-python",
      description: "This project is made using libraries like pickel and os and this project contains the functions :\n\nCreat account\nclose account\ncheck balance\ndeposite amount\nwithdraw amount\ntype of account\nsteps in running this project are:\n\nthe system should contain python\nopen the main.py in vs code\nrun the file\nyou will get the output",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/banking-management-system-using-python.git",
      github_url: "https://github.com/gowtham-garimella/banking-management-system-using-python.git",
      tech_stack: "python"
    },
    {
      id: 2,
      title: "AI-Smart-Surveillance-System-YOLOv8-Real-Time-Dashboard-",
      description: "AI Smart Surveillance System\n\nAn AI-powered surveillance system that detects objects in video streams, triggers alerts, and visualizes results in a dashboard-style interface.\n\n⸱\n\n🚀 Features\n\n🎥 Video input via MP4 or YouTube link\n🤖 Real-time object detection using YOLOv8\n🚨 Smart alert system (person, car, etc.)\n⚡ Frame skipping for performance optimization\n📊 Detection statistics & logs\n🧾 CSV log export\n🖥️ Dashboard-style UI inside Google Colab\n⸱\n\n🧠 Tech Stack\n\nPython\n\nOpenCV\n\nYOLOv8 (Ultralytics)\n\nPandas\n\nyt-dlp (YouTube downloader)\n\nFFmpeg (video compression)\n\nAI-Surveillance-System/ ├── surveillance.ipynb ├── README.md ├── output.mp4 ├── detection_logs.csv\n\nHow to Run (Google Colab)\n\nOpen Google Colab\nCopy the notebook code\nRun all cells\nEnter a video link (MP4 or YouTube)",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/AI-Smart-Surveillance-System-YOLOv8-Real-Time-Dashboard-.git",
      github_url: "https://github.com/gowtham-garimella/AI-Smart-Surveillance-System-YOLOv8-Real-Time-Dashboard-.git",
      tech_stack: "AI, yolo python ,opencv,pandas"
    },
    {
      id: 3,
      title: "AI-Synthetic-Data-Generation",
      description: "This project generates synthetic data using CTGAN (Generative AI) and evaluates its quality using machine learning models.\n\nIt compares original vs synthetic data and checks if synthetic data can be used reliably for training ML models.\n\n",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/AI-Synthetic-Data-Generation.git",
      github_url: "https://github.com/gowtham-garimella/AI-Synthetic-Data-Generation.git",
      tech_stack: "Python Pandas, NumPy Scikit-learn Matplotlib SDV (CTGAN)"
    },
    {
      id: 4,
      title: "AI-Synthetic-Data-Generation",
      description: "This project implements a Hybrid Drift Detection System (HAD-Drift) that detects data drift in streaming data using a combination of:\n\nAutoencoder (Deep Learning)\nKL Divergence (Statistical Method)\nPSI – Population Stability Index\nThe goal is to improve robustness and accuracy compared to single-method drift detection techniques.",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/HAD-Drift-Detection-System.git",
      github_url: "https://github.com/gowtham-garimella/HAD-Drift-Detection-System.git",
      tech_stack: "Python TensorFlow / Keras Scikit-learn Pandas, NumPy Matplotlib, Seaborn SciPy"
    },
    {
      id: 8,
      title: "bank management system",
      description: "This project is made using libraries like pickel and os and this project contains the functions :\n\nCreat account\nclose account\ncheck balance\ndeposite amount\nwithdraw amount\ntype of account\nsteps in running this project are:\n\nthe system should contain python\nopen the main.py in vs code\nrun the file\nyou will get the output",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/banking-management-system-using-python.git",
      github_url: "https://github.com/gowtham-garimella/banking-management-system-using-python.git",
      tech_stack: "python"
    }
  ],
  skills: [
    { id: 1, name: "html", category: "intermediate", proficiency: 80 },
    { id: 2, name: "css ", category: "full stack", proficiency: 80 },
    { id: 3, name: "java script ", category: "full stack", proficiency: 70 },
    { id: 4, name: "react .js ", category: "full stack devlopment ", proficiency: 70 },
    { id: 5, name: "python ", category: "full stack devlopment ", proficiency: 85 },
    { id: 6, name: "SQL", category: "full stack. denlopment ", proficiency: 70 },
    { id: 7, name: "flutter", category: "flutter delopment ", proficiency: 60 },
    { id: 8, name: "artifical intlegence", category: "ai", proficiency: 85 },
    { id: 9, name: "machine learning ", category: "ai / ml", proficiency: 75 },
    { id: 10, name: "deep learning ", category: "machine learning ", proficiency: 70 }
  ],
  education: [
    {
      id: 1,
      institution: "SRM INSTITUTE OF SCIENCE AND TECHNOLOGY",
      degree: "B.Tech",
      start_date: "1-september-2021",
      end_date: "31-may-2025",
      description: "IT Graduate (2021–2025) from SRM Institute of Science and Technology | Skilled in Web Development, DSA & Algorithm Analysis | Passionate about software development and problem solving."
    },
    {
      id: 2,
      institution: "GITAM INSTITUTE OF SCIENCE AND TECHNOLOGY",
      degree: "M.Tech",
      start_date: "1-june-2026",
      end_date: null,
      description: "M.Tech student at GITAM Institute of Science with knowledge in Agile Software Development, Machine Learning, Deep Learning, and Soft Computing. Interested in AI-driven solutions, software engineering, and modern web technologies. Passionate about continuous learning, problem-solving, and building impactful applications."
    },
    {
      id: 3,
      institution: "BHASHYAM High school ",
      degree: "10",
      start_date: "2018",
      end_date: "2019",
      description: "."
    },
    {
      id: 4,
      institution: "sri chaitanya jr college ",
      degree: "12",
      start_date: "2019",
      end_date: "2021",
      description: "completed my 11 and 12 in MPC stream "
    }
  ],
  certifications: [],
  research_papers: []
};

const Portfolio = () => {
  const [data, setData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Fetch dynamic database data if available
    axios.get('/api/portfolio')
      .then(res => {
        if (res.data && res.data.profile) {
          setData(prev => ({
            ...res.data,
            profile: {
              ...res.data.profile,
              avatar_url: res.data.profile.avatar_url || "/images/gowtham.jpg"
            }
          }));
        }
      })
      .catch(err => {
        console.warn("Using offline portfolio dataset (API unreachable):", err.message);
      });
  }, []);

  const { profile, experience, projects, skills, education, certifications, research_papers } = data;

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const userAvatar = profile.avatar_url || "/images/gowtham.jpg";

  return (
    <div className="portfolio-wrapper" style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', position: 'relative' }}>
      
      {/* 1. Animated Neural Mesh & 3D Floating Tech Glyphs in Black Background */}
      <InteractiveNeuralBg />
      <FloatingTechGlyphs />

      {/* Main Foreground Canvas */}
      <div className="portfolio-canvas">
        <div className="site-container">

          {/* ========================================================
              HERO VIEWPORT (Single-Viewport Desktop Composition)
              ======================================================== */}
          <section id="hero" className="hero-viewport">

            {/* A. Top Navigation */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative', zIndex: 30 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                <a href="#hero" style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                  <span className="font-inter" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.15em', color: '#ffffff' }}>
                    G.S.G.R.
                  </span>
                  <span className="font-pixel gradient-text-cyber" style={{ fontSize: '1.35rem', letterSpacing: '0.08em' }}>
                    GOWTHAM
                  </span>
                </a>
              </div>

              {/* Desktop Nav Links */}
              <nav style={{ display: 'none', gap: '2.2rem', alignItems: 'center' }} className="desktop-nav">
                <a href="#projects" className="nav-link font-pixel">PROJECTS</a>
                <a href="#experience" className="nav-link font-pixel">EXPERIENCE</a>
                <a href="#education" className="nav-link font-pixel">EDUCATION</a>
                <a href="#skills" className="nav-link font-pixel">SKILLS</a>
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noreferrer" className="nav-link font-pixel" style={{ color: '#ec4899', opacity: 0.9 }}>
                    RESUME ↗
                  </a>
                )}
                <a href="#contact" className="nav-link font-pixel">CONTACT</a>
                
                {/* Prominent Admin Login Button */}
                <Link to="/admin/login" className="nav-link-admin font-pixel">
                  <Lock size={12} />
                  <span>ADMIN LOGIN</span>
                </Link>
              </nav>

              {/* Mobile Hamburger Button */}
              <button 
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="mobile-menu-btn"
                aria-label="Open Navigation Menu"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: '1px solid rgba(0, 240, 255, 0.4)', backdropFilter: 'blur(8px)', background: 'rgba(0, 240, 255, 0.08)' }}
              >
                <span className="font-pixel" style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: '#00f0ff' }}>MENU</span>
                <Menu size={18} color="#00f0ff" />
              </button>
            </header>

            {/* B. Four-Column Metadata Grid with Vibrant Colored Tags */}
            <div className="metadata-grid" style={{ marginTop: '2rem' }}>
              {/* Column 1: Identity */}
              <div className="metadata-col">
                <span className="metadata-tag font-pixel" style={{ color: '#00f0ff' }}>// 01 IDENTITY</span>
                <span className="metadata-title font-inter gradient-text-cyber">{profile.name}</span>
                <p className="metadata-desc font-inter">
                  Software & AI Developer based in India. Engineering high-performance web systems, 3D interactive graphics, and deep learning architectures.
                </p>
              </div>

              {/* Column 2: Discipline / Role */}
              <div className="metadata-col">
                <span className="metadata-tag font-pixel" style={{ color: '#a855f7' }}>// 02 DISCIPLINE</span>
                <span className="metadata-title font-inter" style={{ color: '#c084fc' }}>{profile.title}</span>
                <p className="metadata-desc font-inter">
                  Full-stack engineering, Computer Vision with YOLOv8, Generative AI (CTGAN synthetic data), and Statistical Drift Detection.
                </p>
              </div>

              {/* Column 3: Capabilities */}
              <div className="metadata-col">
                <span className="metadata-tag font-pixel" style={{ color: '#10b981' }}>// 03 CAPABILITIES</span>
                <span className="metadata-title font-inter" style={{ color: '#34d399' }}>CORE STACK</span>
                <p className="metadata-desc font-inter">
                  <span style={{ color: '#38bdf8' }}>Python</span> · <span style={{ color: '#a855f7' }}>AI/ML</span> · <span style={{ color: '#00f0ff' }}>React.js</span> · <span style={{ color: '#ec4899' }}>Deep Learning</span> · <span style={{ color: '#10b981' }}>YOLOv8</span> · <span style={{ color: '#f59e0b' }}>SQL</span> · <span style={{ color: '#38bdf8' }}>Flutter</span>
                </p>
              </div>

              {/* Column 4: Communication & External Links */}
              <div className="metadata-col">
                <span className="metadata-tag font-pixel" style={{ color: '#fb7185' }}>// 04 CONNECT</span>
                <span className="metadata-title font-inter" style={{ color: '#f472b6' }}>COMMUNICATION</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.2rem' }}>
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="font-inter" style={{ fontSize: '0.85rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <span className="font-inter" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      +91 {profile.phone}
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: '0.9rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    {profile.github && (
                      <a href={profile.github} target="_blank" rel="noreferrer" className="font-pixel" style={{ fontSize: '0.85rem', color: '#00f0ff' }}>
                        [ GITHUB ↗ ]
                      </a>
                    )}
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noreferrer" className="font-pixel" style={{ fontSize: '0.85rem', color: '#a855f7' }}>
                        [ LINKEDIN ↗ ]
                      </a>
                    )}
                    {profile.resume_url && (
                      <a href={profile.resume_url} target="_blank" rel="noreferrer" className="font-pixel" style={{ fontSize: '0.85rem', color: '#ec4899' }}>
                        [ RESUME PDF ↗ ]
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* C. Flexible Spacer */}
            <div style={{ flex: '1 1 auto', minHeight: '2.5rem' }} />

            {/* D. Hero Composition with Vibrant Colors in Words & 3D Animated Portrait */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              <div className="hero-grid-layout" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.2fr 0.8fr', 
                alignItems: 'center', 
                gap: '3rem' 
              }}>
                {/* Left: Oversized Typography with Attractive Colors */}
                <div>
                  <h1 className="hero-headline">
                    <div style={{ display: 'block' }}>
                      <span style={{ color: '#ffffff' }}>G.S.G.R. </span>
                      <span className="basis-word gradient-text-cyber">GOWTHAM</span>
                    </div>
                    <div style={{ display: 'block' }}>
                      <span style={{ color: '#ffffff' }}>SOFTWARE </span>
                      <span className="basis-word gradient-text-emerald">DEVELOPER</span>
                    </div>
                    <div style={{ display: 'block' }}>
                      <span style={{ color: '#c084fc' }}>& AI </span>
                      <span className="basis-word gradient-text-fuchsia">ENGINEER</span>
                    </div>
                  </h1>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.75rem', alignItems: 'flex-start' }}>
                    <p className="font-inter" style={{ maxWidth: '520px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.65' }}>
                      Specializing in scalable web systems, real-time AI object detection (YOLOv8), CTGAN synthetic data generation, and interactive digital experiences.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button 
                        type="button"
                        onClick={() => setShowreelOpen(true)}
                        className="btn-showreel"
                      >
                        <span className="play-dot" />
                        <span className="font-pixel" style={{ fontSize: '0.95rem' }}>PROJECT SHOWREEL</span>
                        <Play size={12} fill="#00f0ff" />
                      </button>

                      <a 
                        href="#projects" 
                        className="btn-editorial-solid"
                        style={{ padding: '0.55rem 1.35rem', borderRadius: '9999px', fontSize: '0.78rem' }}
                      >
                        EXPLORE WORK ↓
                      </a>

                      <Link
                        to="/admin/login"
                        className="btn-editorial"
                        style={{ padding: '0.55rem 1.25rem', borderRadius: '9999px', fontSize: '0.78rem', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
                      >
                        <Lock size={12} /> ADMIN LOGIN
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right: 3D Animated Interactive Floating Picture */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ThreeDPhoto src={userAvatar} alt={profile.name} />
                </div>
              </div>

              {/* E. Minimal Footer Strip */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingTop: '1.25rem', 
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <span className="font-inter">
                  &copy; {new Date().getFullYear()} <span style={{ color: '#00f0ff' }}>{profile.name}</span>. ALL RIGHTS RESERVED.
                </span>

                <span className="font-pixel" style={{ letterSpacing: '0.1em', color: '#10b981' }}>
                  LOC: INDIA &nbsp;·&nbsp; STATUS: AVAILABLE FOR WORK
                </span>

                <Link 
                  to="/admin/login" 
                  className="font-pixel"
                  style={{ color: '#a855f7', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Lock size={12} /> [ ADMIN PORTAL ]
                </Link>
              </div>

            </div>

          </section>


          {/* ========================================================
              SECTION 1: PROJECTS (Colorful Badges & Preserved Data)
              ======================================================== */}
          {projects && projects.length > 0 && (
            <section id="projects" className="editorial-section">
              <div className="section-label-row">
                <span className="section-num font-pixel" style={{ color: '#00f0ff' }}>// 01 FEATURED REPOSITORIES & SYSTEMS</span>
                <h2 className="section-title">
                  PROJECTS <span className="gradient-text-cyber font-pixel" style={{ fontSize: '2rem' }}>({projects.length})</span>
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {projects.map((proj, idx) => {
                  const projectNumber = String(idx + 1).padStart(2, '0');
                  const stackColors = ['#00f0ff', '#10b981', '#a855f7', '#f59e0b', '#ec4899'];
                  const currentColor = stackColors[idx % stackColors.length];

                  return (
                    <motion.div 
                      key={proj.id || idx}
                      className="project-card-editorial"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      {/* Number */}
                      <div className="font-pixel" style={{ fontSize: '1.6rem', color: currentColor, letterSpacing: '0.05em', fontWeight: 'bold' }}>
                        {projectNumber}
                      </div>

                      {/* Title & Tech */}
                      <div>
                        <h3 className="font-inter" style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', color: '#ffffff' }}>
                          {proj.title}
                        </h3>
                        {proj.tech_stack && (
                          <div className="font-pixel" style={{ fontSize: '0.85rem', color: currentColor, letterSpacing: '0.06em', marginTop: '0.25rem' }}>
                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: `${currentColor}15`, border: `1px solid ${currentColor}40` }}>
                              STACK: {proj.tech_stack}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <p className="font-inter" style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
                          {proj.description}
                        </p>
                        
                        {proj.image_url && (
                          <div style={{ marginTop: '1.25rem', border: '1px solid rgba(0, 240, 255, 0.3)', overflow: 'hidden', borderRadius: '4px' }}>
                            <img 
                              src={proj.image_url} 
                              alt={proj.title} 
                              style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }} 
                            />
                          </div>
                        )}
                      </div>

                      {/* Links */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                        {proj.github_url && (
                          <a 
                            href={proj.github_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-editorial"
                            style={{ width: '100%', borderColor: `${currentColor}50` }}
                          >
                            <Github size={14} color={currentColor} /> GITHUB
                          </a>
                        )}
                        {proj.demo_url && (
                          <a 
                            href={proj.demo_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-editorial-solid"
                            style={{ width: '100%' }}
                          >
                            <ExternalLink size={14} /> LIVE DEMO
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedProject(proj)}
                          className="font-pixel"
                          style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginTop: '0.25rem' }}
                        >
                          [ VIEW DETAILS ]
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}


          {/* ========================================================
              SECTION 2: WORK EXPERIENCE (100% Preserved)
              ======================================================== */}
          {experience && experience.length > 0 && (
            <section id="experience" className="editorial-section">
              <div className="section-label-row">
                <span className="section-num font-pixel" style={{ color: '#a855f7' }}>// 02 CAREER & PROFESSIONAL TRAJECTORY</span>
                <h2 className="section-title">EXPERIENCE</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {experience.map((exp, idx) => (
                  <motion.div 
                    key={exp.id || idx}
                    style={{ 
                      borderTop: '1px solid rgba(255,255,255,0.15)', 
                      padding: '2.5rem 0',
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 2fr 1fr',
                      gap: '2rem'
                    }}
                    className="responsive-exp-grid"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <h3 className="font-inter gradient-text-cyber" style={{ fontSize: '1.45rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {exp.company}
                      </h3>
                      <div className="font-pixel" style={{ fontSize: '1.15rem', color: '#c084fc', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                        {exp.role}
                      </div>
                    </div>

                    <div>
                      <p className="font-inter" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
                        {exp.description}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="font-pixel" style={{ fontSize: '0.95rem', color: '#00f0ff', letterSpacing: '0.08em', padding: '0.3rem 0.75rem', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '4px', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
                        {exp.start_date} &mdash; {exp.end_date || 'Present'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}


          {/* ========================================================
              SECTION 3: EDUCATION & QUALIFICATIONS (100% Preserved)
              ======================================================== */}
          {education && education.length > 0 && (
            <section id="education" className="editorial-section">
              <div className="section-label-row">
                <span className="section-num font-pixel" style={{ color: '#10b981' }}>// 03 ACADEMIC FOUNDATIONS</span>
                <h2 className="section-title">EDUCATION</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {education.map((edu, idx) => (
                  <motion.div 
                    key={edu.id || idx}
                    style={{ 
                      borderTop: '1px solid rgba(255,255,255,0.15)', 
                      padding: '2.5rem 0',
                      display: 'grid',
                      gridTemplateColumns: '1.8fr 2.2fr 1fr',
                      gap: '2rem'
                    }}
                    className="responsive-edu-grid"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <div className="font-pixel gradient-text-emerald" style={{ fontSize: '1.35rem', letterSpacing: '0.04em' }}>
                        {edu.degree}
                      </div>
                      <h3 className="font-inter" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginTop: '0.35rem', textTransform: 'uppercase' }}>
                        {edu.institution}
                      </h3>
                    </div>

                    <div>
                      <p className="font-inter" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.65' }}>
                        {edu.description}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="font-pixel" style={{ fontSize: '0.9rem', color: '#10b981', letterSpacing: '0.08em', padding: '0.3rem 0.65rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        {edu.start_date} {edu.end_date ? `— ${edu.end_date}` : '— Present'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}


          {/* ========================================================
              SECTION 4: TECHNICAL SKILLS WITH COLORFUL METERS
              ======================================================== */}
          {skills && skills.length > 0 && (
            <section id="skills" className="editorial-section">
              <div className="section-label-row">
                <span className="section-num font-pixel" style={{ color: '#f59e0b' }}>// 04 TECHNICAL COMPETENCIES</span>
                <h2 className="section-title">SKILLS & PROFICIENCY</h2>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {skills.map((skill, idx) => {
                  const palette = [
                    { border: 'rgba(0, 240, 255, 0.3)', text: '#00f0ff', gradient: 'linear-gradient(90deg, #00f0ff, #38bdf8)' },
                    { border: 'rgba(168, 85, 247, 0.3)', text: '#c084fc', gradient: 'linear-gradient(90deg, #a855f7, #c084fc)' },
                    { border: 'rgba(16, 185, 129, 0.3)', text: '#34d399', gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
                    { border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
                    { border: 'rgba(236, 72, 153, 0.3)', text: '#f472b6', gradient: 'linear-gradient(90deg, #ec4899, #f472b6)' }
                  ];
                  const scheme = palette[idx % palette.length];

                  return (
                    <motion.div 
                      key={skill.id || idx}
                      style={{ 
                        border: `1px solid ${scheme.border}`, 
                        padding: '1.5rem',
                        background: 'rgba(8, 8, 12, 0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px ${scheme.text}10`
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.03, borderColor: scheme.text }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                          <span className="font-inter" style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff' }}>
                            {skill.name}
                          </span>
                          {skill.proficiency && (
                            <span className="font-pixel" style={{ fontSize: '1.25rem', color: scheme.text, fontWeight: 'bold' }}>
                              {skill.proficiency}%
                            </span>
                          )}
                        </div>
                        
                        {skill.category && (
                          <span className="font-pixel" style={{ fontSize: '0.82rem', color: scheme.text, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            CATEGORY: {skill.category}
                          </span>
                        )}
                      </div>

                      {/* Animated Gradient Progress Meter */}
                      {skill.proficiency && (
                        <div style={{ 
                          width: '100%', 
                          height: '4px', 
                          background: 'rgba(255,255,255,0.1)', 
                          borderRadius: '2px',
                          marginTop: '1.25rem',
                          overflow: 'hidden'
                        }}>
                          <motion.div 
                            style={{ 
                              width: `${skill.proficiency}%`, 
                              height: '100%', 
                              background: scheme.gradient,
                              boxShadow: `0 0 10px ${scheme.text}`
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}


          {/* ========================================================
              SECTION 5: RESEARCH PAPERS & CERTIFICATIONS
              ======================================================== */}
          {research_papers && research_papers.length > 0 && (
            <section id="research" className="editorial-section">
              <div className="section-label-row">
                <span className="section-num font-pixel" style={{ color: '#00f0ff' }}>// 05 ACADEMIC RESEARCH</span>
                <h2 className="section-title">RESEARCH PAPERS</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
                {research_papers.map((paper, idx) => (
                  <div key={paper.id || idx} style={{ border: '1px solid rgba(0, 240, 255, 0.3)', padding: '2rem', background: 'rgba(0,0,0,0.6)', borderRadius: '8px' }}>
                    <span className="font-pixel" style={{ fontSize: '0.85rem', color: '#00f0ff' }}>
                      {paper.journal_or_conference || 'PUBLICATION'} · {paper.publication_date}
                    </span>
                    <h3 className="font-inter" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.75rem 0', color: '#ffffff' }}>
                      {paper.title}
                    </h3>
                    {paper.authors && (
                      <p className="font-pixel" style={{ fontSize: '0.9rem', color: '#c084fc', marginBottom: '1rem' }}>
                        AUTHORS: {paper.authors}
                      </p>
                    )}
                    {paper.description && (
                      <p className="font-inter" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                        {paper.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {(paper.paper_download_url || paper.paper_url) && (
                        <a href={paper.paper_download_url || paper.paper_url} download target="_blank" rel="noreferrer" className="btn-editorial-solid">
                          <Download size={14} /> DOWNLOAD PAPER (PDF)
                        </a>
                      )}
                      {(paper.proof_download_url || paper.proof_url) && (
                        <a href={paper.proof_download_url || paper.proof_url} target="_blank" rel="noreferrer" className="btn-editorial">
                          <FileCheck size={14} /> VERIFICATION PROOF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section id="certifications" className="editorial-section">
              <div className="section-label-row">
                <span className="section-num font-pixel" style={{ color: '#a855f7' }}>// 06 VERIFIED CREDENTIALS</span>
                <h2 className="section-title">CERTIFICATIONS</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {certifications.map((cert, idx) => (
                  <div key={cert.id || idx} style={{ border: '1px solid rgba(168, 85, 247, 0.3)', padding: '1.75rem', background: 'rgba(0,0,0,0.6)', borderRadius: '8px' }}>
                    <h3 className="font-inter" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                      {cert.title}
                    </h3>
                    <p className="font-pixel" style={{ fontSize: '0.95rem', color: '#c084fc', marginTop: '0.25rem' }}>
                      ISSUER: {cert.issuer} · {cert.date}
                    </p>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noreferrer" className="btn-editorial" style={{ marginTop: '1.25rem' }}>
                        <ExternalLink size={14} /> VIEW CREDENTIAL
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}


          {/* ========================================================
              SECTION 6: CONTACT & GET IN TOUCH (100% Preserved)
              ======================================================== */}
          <section id="contact" className="editorial-section" style={{ paddingBottom: '7rem' }}>
            <div className="section-label-row">
              <span className="section-num font-pixel" style={{ color: '#ec4899' }}>// 05 REACH OUT & ENGAGE</span>
              <h2 className="section-title">CONTACT</h2>
            </div>

            <div style={{ 
              border: '1px solid rgba(0, 240, 255, 0.3)', 
              padding: '3rem', 
              background: 'rgba(8, 8, 14, 0.75)',
              backdropFilter: 'blur(16px)',
              borderRadius: '12px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '3rem',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(0, 240, 255, 0.1)'
            }} className="responsive-contact-box">
              
              {/* Avatar display with 3D Hover Effect */}
              <motion.div 
                whileHover={{ scale: 1.08, rotateY: 15, rotateX: -8 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                style={{ 
                  width: '170px', 
                  height: '170px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  border: '2px solid #00f0ff', 
                  flexShrink: 0,
                  boxShadow: '0 0 25px rgba(0, 240, 255, 0.4), 0 0 50px rgba(168, 85, 247, 0.25)',
                  perspective: '800px'
                }}
              >
                <img 
                  src={userAvatar} 
                  alt={profile.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </motion.div>

              <div>
                <div className="font-pixel gradient-text-cyber" style={{ fontSize: '1.35rem', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                  {profile.name}
                </div>
                <h3 className="font-inter" style={{ fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', color: '#ffffff' }}>
                  {profile.title}
                </h3>
                <p className="font-inter" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', maxWidth: '580px', lineHeight: '1.6', marginBottom: '2rem' }}>
                  Open to full-time engineering roles, AI research collaborations, and ambitious software projects. Reach out directly via email or phone.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="btn-editorial-solid">
                      <Mail size={14} /> {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="btn-editorial">
                      <Phone size={14} color="#00f0ff" /> +91 {profile.phone}
                    </a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noreferrer" className="btn-editorial">
                      <Github size={14} color="#a855f7" /> GITHUB
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-editorial">
                      <Linkedin size={14} color="#00f0ff" /> LINKEDIN
                    </a>
                  )}
                  {profile.resume_url && (
                    <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-editorial">
                      <Download size={14} color="#ec4899" /> DOWNLOAD RESUME
                    </a>
                  )}
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>


      {/* ========================================================
          10. FULLSCREEN ANIMATED MOBILE MENU
          ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.97)',
              backdropFilter: 'blur(20px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2.5rem 1.5rem'
            }}
          >
            {/* Top Bar of Mobile Menu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="font-pixel gradient-text-cyber" style={{ fontSize: '1.35rem', letterSpacing: '0.1em' }}>
                G.S.G.R. GOWTHAM
              </div>
              <button 
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '6px' }}
              >
                <span className="font-pixel" style={{ fontSize: '0.9rem', color: '#00f0ff' }}>CLOSE</span>
                <X size={18} color="#00f0ff" />
              </button>
            </div>

            {/* Navigation Destinations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', textAlign: 'center' }}>
              {[
                { name: 'HOME', id: 'hero', color: '#ffffff' },
                { name: 'PROJECTS', id: 'projects', color: '#00f0ff' },
                { name: 'EXPERIENCE', id: 'experience', color: '#a855f7' },
                { name: 'EDUCATION', id: 'education', color: '#10b981' },
                { name: 'SKILLS', id: 'skills', color: '#f59e0b' },
                { name: 'CONTACT', id: 'contact', color: '#ec4899' }
              ].map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                  className="font-inter"
                  style={{
                    fontSize: 'clamp(2rem, 7vw, 3.25rem)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    color: item.color
                  }}
                >
                  {item.name}
                </motion.button>
              ))}

              {/* Admin Portal Button in Mobile Menu */}
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ marginTop: '1.5rem', padding: '0.75rem 1.75rem' }}
              >
                <Lock size={16} /> ADMIN PORTAL LOGIN
              </Link>
            </div>

            {/* Bottom Info of Mobile Menu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              <span className="font-pixel" style={{ color: '#00f0ff' }}>{profile.email}</span>
              <span className="font-pixel" style={{ color: '#10b981' }}>// INDIA</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ========================================================
          PROJECT DETAILS MODAL
          ======================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              backdropFilter: 'blur(16px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '720px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                background: '#07070a',
                padding: '2.5rem',
                borderRadius: '12px',
                boxShadow: '0 0 50px rgba(0, 240, 255, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span className="font-pixel" style={{ fontSize: '0.85rem', color: '#00f0ff' }}>
                    // REPOSITORY BREAKDOWN
                  </span>
                  <h3 className="font-inter" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', color: '#ffffff' }}>
                    {selectedProject.title}
                  </h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedProject(null)} 
                  style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {selectedProject.tech_stack && (
                <div className="font-pixel" style={{ fontSize: '0.95rem', color: '#38bdf8', marginBottom: '1.5rem' }}>
                  STACK: {selectedProject.tech_stack}
                </div>
              )}

              <p className="font-inter" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                {selectedProject.description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {selectedProject.github_url && (
                  <a href={selectedProject.github_url} target="_blank" rel="noreferrer" className="btn-editorial">
                    <Github size={14} color="#00f0ff" /> VIEW ON GITHUB
                  </a>
                )}
                {selectedProject.demo_url && (
                  <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className="btn-editorial-solid">
                    <ExternalLink size={14} /> LIVE REPO / DEMO
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ========================================================
          SHOWREEL MODAL (Gowtham's Engineering Showcase)
          ======================================================== */}
      <AnimatePresence>
        {showreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '920px',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                background: '#07070a',
                padding: '2.5rem',
                borderRadius: '12px',
                position: 'relative',
                boxShadow: '0 0 60px rgba(0, 240, 255, 0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="play-dot" />
                  <span className="font-pixel gradient-text-cyber" style={{ fontSize: '1.15rem', letterSpacing: '0.1em' }}>
                    ENGINEERING SHOWCASE — G.S.G.R. GOWTHAM
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowreelOpen(false)} 
                  style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Showcase Reel Display */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                gap: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                {projects.slice(0, 3).map((proj, pIdx) => (
                  <div 
                    key={proj.id || pIdx} 
                    style={{ 
                      border: '1px solid rgba(0, 240, 255, 0.25)', 
                      padding: '1.35rem', 
                      background: 'rgba(0, 240, 255, 0.03)',
                      borderRadius: '8px'
                    }}
                  >
                    <span className="font-pixel" style={{ fontSize: '0.82rem', color: '#00f0ff' }}>
                      // 0{pIdx + 1} ACTIVE SYSTEM
                    </span>
                    <h4 className="font-inter" style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.5rem 0', color: '#ffffff', textTransform: 'uppercase' }}>
                      {proj.title}
                    </h4>
                    <p className="font-pixel" style={{ fontSize: '0.82rem', color: '#c084fc', marginBottom: '1rem' }}>
                      STACK: {proj.tech_stack}
                    </p>
                    <a 
                      href={proj.github_url || proj.demo_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-editorial" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                    >
                      VIEW REPO ↗
                    </a>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.25rem' }}>
                <p className="font-inter" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
                  Highlighting AI surveillance models, CTGAN synthetic data pipelines, and interactive full-stack applications.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowreelOpen(false);
                    scrollTo('projects');
                  }}
                  className="btn-editorial-solid"
                >
                  EXPLORE ALL PROJECTS ↗
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Inline CSS adjustments */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 960px) {
          .hero-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 900px) {
          .responsive-exp-grid, .responsive-edu-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .responsive-contact-box {
            grid-template-columns: 1fr !important;
            padding: 1.75rem !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>

    </div>
  );
};

export default Portfolio;
