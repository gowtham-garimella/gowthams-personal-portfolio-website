import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  ExternalLink, 
  Download, 
  FileText, 
  Menu, 
  X, 
  Terminal, 
  Database, 
  Cpu, 
  Code, 
  Layers, 
  Lock, 
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  Eye,
  Server,
  Activity,
  Box
} from 'lucide-react';

// ========================================================
// 1. 3D INTERACTIVE MAGNETIC PORTRAIT
// ========================================================
const MagneticPortrait = ({ src, name, title }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 200, damping: 22 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 22 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-14deg", "14deg"]);
  const glareOpacity = useTransform(mouseY, [-0.5, 0.5], [0.35, 0.05]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative flex justify-center items-center py-6 select-none"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -12, 0],
          rotateZ: [0, 0.5, -0.5, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.03 }}
        className="relative cursor-pointer"
      >
        {/* Holographic Glowing 3D Backplate */}
        <div 
          className="absolute -inset-4 border border-cyan-500/30 rounded-2xl pointer-events-none"
          style={{
            transform: 'translateZ(-30px)',
            boxShadow: '0 0 50px rgba(0, 240, 255, 0.15)'
          }}
        >
          <span className="absolute -top-2 -left-2 text-cyan-400 font-mono text-xs">+</span>
          <span className="absolute -top-2 -right-2 text-cyan-400 font-mono text-xs">+</span>
          <span className="absolute -bottom-2 -left-2 text-purple-400 font-mono text-xs">+</span>
          <span className="absolute -bottom-2 -right-2 text-purple-400 font-mono text-xs">+</span>
        </div>

        {/* Portrait Image Container */}
        <div 
          className="relative w-[280px] sm:w-[340px] md:w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl"
          style={{
            boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 35px rgba(182, 0, 168, 0.25)'
          }}
        >
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover filter contrast-[1.04] brightness-[1.02]"
            onError={(e) => {
              e.target.src = "/images/gowtham.jpg";
            }}
          />

          {/* Holographic Scanning Laser */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none"
            style={{ boxShadow: '0 0 12px #00f0ff' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
          />

          {/* Dynamic Light Glare */}
          <motion.div
            className="absolute inset-0 bg-radial-at-center from-cyan-400/20 to-transparent pointer-events-none mix-blend-screen"
            style={{ opacity: glareOpacity }}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.7)] pointer-events-none" />
        </div>

        {/* 3D Floating Badge: Top Right */}
        <motion.div
          style={{ transform: 'translateZ(50px)' }}
          className="absolute -top-4 -right-4 bg-black/85 backdrop-blur-md border border-emerald-500/40 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[11px] font-semibold text-emerald-300 tracking-wider">
            AI / SOFTWARE ENG
          </span>
        </motion.div>

        {/* 3D Floating Badge: Bottom Left */}
        <motion.div
          style={{ transform: 'translateZ(45px)' }}
          className="absolute -bottom-4 -left-3 bg-black/90 backdrop-blur-md border border-cyan-500/40 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl"
        >
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">
            [ {name} ]
          </span>
        </motion.div>

        {/* 3D Floating Badge: Bottom Right */}
        <motion.div
          style={{ transform: 'translateZ(35px)' }}
          className="absolute -bottom-4 -right-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-black px-3 py-1 rounded-lg text-[11px] font-black tracking-wider uppercase shadow-lg"
        >
          EDITION 2026
        </motion.div>
      </motion.div>
    </div>
  );
};

// ========================================================
// 2. SCROLL REVEAL TEXT COMPONENT
// ========================================================
const ScrollRevealParagraph = ({ text }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.45"]
  });

  const words = text.split(" ");

  return (
    <p ref={containerRef} className="flex flex-wrap gap-x-2 gap-y-1.5 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-light text-center justify-center max-w-5xl mx-auto">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [6, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block transition-colors">
      {children}
    </motion.span>
  );
};

// ========================================================
// 3. DEFAULT ZERO-CONTENT-LOSS PORTFOLIO DATASET
// ========================================================
const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    id: 1,
    name: "G.S.G.R. GOWTHAM",
    title: "Software Developer & AI Engineer",
    bio: "IT Graduate from SRM Institute of Science and Technology & M.Tech scholar at GITAM Institute of Science. Specialized in building scalable full-stack web architectures, real-time computer vision systems (YOLOv8), CTGAN synthetic data generation, and modern interactive digital applications.",
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
      company: "CodSoft",
      role: "Web Development Intern",
      start_date: "01-12-2023",
      end_date: "31-12-2023",
      description: "Engineered responsive modern web interfaces with interactive 3D animations, component-driven layouts, and seamless user experiences."
    }
  ],
  projects: [
    {
      id: 1,
      title: "AI Smart Surveillance System (YOLOv8 Real-Time Dashboard)",
      category: "Computer Vision & AI",
      description: "An AI-powered real-time surveillance platform detecting objects, persons, and vehicles in live video streams. Features frame-skipping optimizations, statistical telemetry dashboards, automated threat alerts, and CSV logging.",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/AI-Smart-Surveillance-System-YOLOv8-Real-Time-Dashboard-.git",
      github_url: "https://github.com/gowtham-garimella/AI-Smart-Surveillance-System-YOLOv8-Real-Time-Dashboard-.git",
      tech_stack: "Python, YOLOv8, OpenCV, Pandas, yt-dlp, FFmpeg"
    },
    {
      id: 2,
      title: "AI Synthetic Data Generation (CTGAN)",
      category: "Generative AI & Privacy",
      description: "Generates high-fidelity synthetic tabular datasets using Conditional GANs (CTGAN). Evaluates statistical fidelity, privacy guarantees, and comparative machine learning model utility between original and synthetic distributions.",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/AI-Synthetic-Data-Generation.git",
      github_url: "https://github.com/gowtham-garimella/AI-Synthetic-Data-Generation.git",
      tech_stack: "Python, SDV (CTGAN), Scikit-Learn, Pandas, NumPy, Matplotlib"
    },
    {
      id: 3,
      title: "Hybrid Data Drift Detection System (HAD-Drift)",
      category: "Deep Learning & MLOps",
      description: "Detects real-time distribution drift in production streaming pipelines by integrating Autoencoders (Deep Learning reconstruction error), KL Divergence, and Population Stability Index (PSI) for maximum resilience.",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/HAD-Drift-Detection-System.git",
      github_url: "https://github.com/gowtham-garimella/HAD-Drift-Detection-System.git",
      tech_stack: "Python, TensorFlow / Keras, Scikit-Learn, SciPy, Pandas, Seaborn"
    },
    {
      id: 4,
      title: "Banking Management System",
      category: "Systems & Software Dev",
      description: "Robust command-line and modular banking engine utilizing serialization (Pickle) and OS routines. Handles account creation, closing, transactions, deposits, withdrawals, and ledger reconciliation.",
      image_url: null,
      demo_url: "https://github.com/gowtham-garimella/banking-management-system-using-python.git",
      github_url: "https://github.com/gowtham-garimella/banking-management-system-using-python.git",
      tech_stack: "Python, Pickle, OS, File Systems, CLI"
    }
  ],
  skills: [
    { id: 1, name: "Python", category: "Full-Stack & AI", proficiency: 85 },
    { id: 2, name: "React.js", category: "Frontend Engineering", proficiency: 75 },
    { id: 3, name: "Artificial Intelligence & ML", category: "AI / ML", proficiency: 85 },
    { id: 4, name: "Deep Learning & Computer Vision (YOLOv8)", category: "Deep Learning", proficiency: 75 },
    { id: 5, name: "SQL & Relational Databases", category: "Backend & Data", proficiency: 75 },
    { id: 6, name: "JavaScript & Modern Web (ES6+)", category: "Frontend Engineering", proficiency: 75 },
    { id: 7, name: "HTML5 & Tailwind CSS", category: "Frontend UI/UX", proficiency: 85 },
    { id: 8, name: "Flutter Cross-Platform", category: "Mobile Development", proficiency: 65 }
  ],
  education: [
    {
      id: 1,
      institution: "SRM INSTITUTE OF SCIENCE AND TECHNOLOGY",
      degree: "B.Tech in Information Technology",
      start_date: "Sept 2021",
      end_date: "May 2025",
      description: "IT Graduate (2021–2025) skilled in Web Development, Data Structures, Algorithms & Analysis, and software engineering methodologies."
    },
    {
      id: 2,
      institution: "GITAM INSTITUTE OF SCIENCE AND TECHNOLOGY",
      degree: "M.Tech",
      start_date: "June 2026",
      end_date: "Present",
      description: "Advanced studies in Agile Software Engineering, Deep Learning, Generative AI models, and Soft Computing architectures."
    },
    {
      id: 3,
      institution: "SRI CHAITANYA JR COLLEGE",
      degree: "Intermediate (MPC Stream - Mathematics, Physics, Chemistry)",
      start_date: "2019",
      end_date: "2021",
      description: "Completed higher secondary education with strong analytical and mathematical fundamentals."
    },
    {
      id: 4,
      institution: "BHASHYAM HIGH SCHOOL",
      degree: "Secondary School Certificate (Class 10)",
      start_date: "2018",
      end_date: "2019",
      description: "Core secondary school foundations."
    }
  ],
  certifications: [],
  research_papers: []
};

// ========================================================
// 4. MAIN PORTFOLIO COMPONENT
// ========================================================
export default function Portfolio() {
  const [data, setData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  useEffect(() => {
    // Attempt dynamic backend fetch with fallback to default
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

  const { profile, experience, projects, skills, education, certifications = [], research_papers = [] } = data;
  const userAvatar = profile.avatar_url || "/images/gowtham.jpg";

  // Real skills & services defined from actual technical capabilities
  const servicesList = [
    {
      number: "01",
      title: "FULL-STACK WEB DEVELOPMENT",
      description: "Architecting high-performance web systems using React.js, modern JavaScript, Tailwind CSS, and RESTful architectures. Focused on smooth interactions, clean code structure, and responsive mobile-first experiences."
    },
    {
      number: "02",
      title: "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING",
      description: "Designing end-to-end machine learning pipelines with Python, Scikit-Learn, Pandas, and NumPy. Generating synthetic tabular data with CTGAN (Generative AI) and testing distribution fidelity for privacy-compliant workflows."
    },
    {
      number: "03",
      title: "COMPUTER VISION & OBJECT DETECTION",
      description: "Building automated visual detection systems utilizing YOLOv8 and OpenCV. Video stream analysis, multi-class object tracking, frame optimization, automated alert triggers, and real-time dashboard telemetry."
    },
    {
      number: "04",
      title: "SOFTWARE ENGINEERING & DRIFT MONITORING",
      description: "Implementing resilient software architectures, relational SQL databases, and statistical data drift detection (HAD-Drift) combining Autoencoder reconstruction loss with KL Divergence and PSI metrics."
    },
    {
      number: "05",
      title: "MOBILE APP DEVELOPMENT",
      description: "Developing cross-platform mobile applications with Flutter, ensuring consistent multi-device UI fidelity, reactive state management, and seamless backend API synchronization."
    }
  ];

  // Visual showcase items built from real projects and expertise
  const marqueeRow1 = [
    { title: "YOLOv8 AI SURVEILLANCE", tag: "COMPUTER VISION", icon: <Cpu className="text-cyan-400" size={24} />, bg: "from-cyan-950/60 to-black" },
    { title: "CTGAN SYNTHETIC DATA", tag: "GENERATIVE AI", icon: <Sparkles className="text-purple-400" size={24} />, bg: "from-purple-950/60 to-black" },
    { title: "HAD-DRIFT DETECTION", tag: "DEEP LEARNING", icon: <Activity className="text-emerald-400" size={24} />, bg: "from-emerald-950/60 to-black" },
    { title: "REACT.JS FULL-STACK", tag: "WEB ARCHITECTURE", icon: <Code className="text-blue-400" size={24} />, bg: "from-blue-950/60 to-black" },
    { title: "PYTHON BANKING SYSTEM", tag: "SOFTWARE SYSTEMS", icon: <Terminal className="text-amber-400" size={24} />, bg: "from-amber-950/60 to-black" }
  ];

  const marqueeRow2 = [
    { title: "TENSORFLOW & KERAS", tag: "NEURAL NETWORKS", icon: <Layers className="text-fuchsia-400" size={24} />, bg: "from-fuchsia-950/60 to-black" },
    { title: "OPENCV VIDEO PIPELINES", tag: "STREAMING AI", icon: <Eye className="text-cyan-400" size={24} />, bg: "from-cyan-950/60 to-black" },
    { title: "SQL & RELATIONAL DB", tag: "DATA STORAGE", icon: <Database className="text-rose-400" size={24} />, bg: "from-rose-950/60 to-black" },
    { title: "FLUTTER MOBILE APPS", tag: "CROSS-PLATFORM", icon: <Box className="text-indigo-400" size={24} />, bg: "from-indigo-950/60 to-black" },
    { title: "SCIKIT-LEARN MODELING", tag: "PREDICTIVE ML", icon: <Server className="text-teal-400" size={24} />, bg: "from-teal-950/60 to-black" }
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit selection:bg-purple-600 selection:text-white">

      {/* ========================================================
          1. NAVIGATION (Fixed, z-50)
          ======================================================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-5 bg-[#0C0C0C]/80 backdrop-blur-lg border-b border-white/5 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            G.S.G.R.
          </span>
          <span className="text-xl font-extrabold tracking-wider text-gradient-silver">
            GOWTHAM
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#experience" className="hover:text-white transition-colors">Experience</a>
          <a href="#education" className="hover:text-white transition-colors">Education</a>
          
          {profile.resume_url && (
            <a 
              href={profile.resume_url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1"
            >
              Resume <ArrowUpRight size={14} />
            </a>
          )}

          <a href="#contact" className="hover:text-white transition-colors">Contact</a>

          {/* Admin Login Route Button */}
          <Link 
            to="/admin/login" 
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-xs font-semibold text-cyan-300 transition-all shadow-sm"
          >
            <Lock size={12} />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-between bg-[#0C0C0C] p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-xl font-black text-white">G.S.G.R. GOWTHAM</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/5 text-white"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-3xl font-bold uppercase tracking-tight py-8">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">About</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">Services</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">Projects</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">Experience</a>
            <a href="#education" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">Education</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">Contact</a>
            
            {profile.resume_url && (
              <a 
                href={profile.resume_url} 
                target="_blank" 
                rel="noreferrer" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-fuchsia-400 flex items-center gap-2"
              >
                Resume PDF <ArrowUpRight size={22} />
              </a>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <Link 
              to="/admin/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-cyan-300 font-semibold text-sm"
            >
              <Lock size={14} />
              <span>Admin Portal</span>
            </Link>
            <span className="text-xs text-white/40">Portfolio 2026</span>
          </div>
        </div>
      )}

      {/* ========================================================
          2. HERO SECTION (Full-Screen Hero Composition)
          ======================================================== */}
      <section id="hero" className="relative min-h-screen pt-28 pb-16 px-6 sm:px-10 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Ambient Backlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

        {/* Top Hero Headline */}
        <div className="w-full text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.4rem,8.5vw,7.8rem)] font-black uppercase tracking-[-0.03em] leading-[0.95] text-gradient-hero select-none"
          >
            {profile.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base md:text-xl font-medium tracking-[0.25em] text-cyan-400 uppercase mt-3"
          >
            {profile.title}
          </motion.div>
        </div>

        {/* Center: 3D Interactive Magnetic Portrait */}
        <div className="my-auto py-6 z-20">
          <MagneticPortrait 
            src={userAvatar}
            name={profile.name}
            title={profile.title}
          />
        </div>

        {/* Bottom Hero Bar: Bio & Contact Action */}
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-white/10 z-10 text-center md:text-left">
          <p className="text-sm sm:text-base text-white/70 max-w-xl font-light leading-relaxed">
            {profile.bio}
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full font-bold text-white text-sm tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl bg-gradient-contact"
            >
              Contact Me
            </a>
            
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full font-semibold text-white/80 text-sm tracking-wider uppercase border border-white/20 hover:border-white hover:text-white transition-colors flex items-center gap-2"
              >
                <Download size={15} /> Resume
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. MARQUEE / VISUAL SHOWCASE (Two-Row Opposite Scroll)
          ======================================================== */}
      <section className="py-20 overflow-hidden bg-black/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 mb-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold block mb-2">
            // Technical Specializations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Core Architectures & Tech Ecosystem
          </h2>
        </div>

        {/* Row 1: Leftward continuous scroll */}
        <div className="relative w-full overflow-hidden mb-5">
          <div className="animate-marquee-left flex gap-5">
            {[...marqueeRow1, ...marqueeRow1, ...marqueeRow1].map((item, idx) => (
              <div 
                key={`row1-${idx}`}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/10 bg-gradient-to-r ${item.bg} backdrop-blur-md min-w-[260px] sm:min-w-[310px] shadow-lg`}
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 block">
                    {item.tag}
                  </span>
                  <span className="text-base font-bold text-white tracking-wide">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Rightward continuous scroll */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-right flex gap-5">
            {[...marqueeRow2, ...marqueeRow2, ...marqueeRow2].map((item, idx) => (
              <div 
                key={`row2-${idx}`}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/10 bg-gradient-to-r ${item.bg} backdrop-blur-md min-w-[260px] sm:min-w-[310px] shadow-lg`}
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 block">
                    {item.tag}
                  </span>
                  <span className="text-base font-bold text-white tracking-wide">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. ABOUT SECTION (Full-Height Centered With 3D Floating Elements)
          ======================================================== */}
      <section id="about" className="relative min-h-screen py-32 px-6 sm:px-10 flex flex-col justify-center items-center overflow-hidden">
        
        {/* 4 Decorative 3D-Style Visual Perimeter Glyphs */}
        <div className="absolute top-16 left-8 md:left-20 animate-float-slow text-cyan-400/20 pointer-events-none">
          <Terminal size={70} />
        </div>
        <div className="absolute top-24 right-8 md:right-24 animate-float-slow text-purple-400/20 pointer-events-none" style={{ animationDelay: '1.5s' }}>
          <Cpu size={80} />
        </div>
        <div className="absolute bottom-20 left-10 md:left-24 animate-float-slow text-emerald-400/20 pointer-events-none" style={{ animationDelay: '3s' }}>
          <Database size={75} />
        </div>
        <div className="absolute bottom-24 right-10 md:right-20 animate-float-slow text-fuchsia-400/20 pointer-events-none" style={{ animationDelay: '4.5s' }}>
          <Layers size={70} />
        </div>

        {/* Section Header */}
        <div className="text-center mb-16 z-10">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold block mb-3">
            // Identity & Perspective
          </span>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black uppercase tracking-tight text-gradient-silver">
            ABOUT ME
          </h2>
        </div>

        {/* Scroll-Driven Character-by-Character Text Reveal */}
        <div className="z-10 px-4">
          <ScrollRevealParagraph 
            text="I am an IT Graduate from SRM Institute of Science and Technology and currently an M.Tech Scholar at GITAM. My passion lies in architecting high-performance web systems, real-time computer vision detection with YOLOv8, and generative synthetic data modeling. I merge deep mathematical problem solving with modern creative software engineering to build reliable, high-impact digital products."
          />
        </div>

        {/* Key Competency Badges */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-16 max-w-3xl z-10">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 hover:border-cyan-400/50 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-white">{skill.name}</span>
              <span className="text-white/40 text-[11px] font-mono">[{skill.proficiency}%]</span>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 z-10">
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full font-bold text-white text-sm tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl bg-gradient-contact"
          >
            Connect With Me
          </a>
        </div>
      </section>

      {/* ========================================================
          5. SERVICES SECTION (Premium White Background With Large Rounded Corners)
          ======================================================== */}
      <section id="services" className="relative rounded-t-[48px] md:rounded-t-[72px] bg-[#FFFFFF] text-[#0C0C0C] py-28 px-6 sm:px-12 lg:px-20 z-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[#7621B0] font-bold block mb-3">
              // Professional Offerings
            </span>
            <h2 className="text-[clamp(2.4rem,6vw,5.2rem)] font-black uppercase tracking-tight text-[#0C0C0C]">
              SERVICES & EXPERTISE
            </h2>
            <p className="text-sm sm:text-base text-[#0C0C0C]/70 max-w-2xl mx-auto mt-4 font-normal">
              Specialized engineering capabilities delivering robust, secure, and production-ready applications.
            </p>
          </div>

          {/* Vertical List of Services */}
          <div className="flex flex-col">
            {servicesList.map((service, index) => (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="py-10 sm:py-12 border-b border-black/10 flex flex-col md:flex-row md:items-start justify-between gap-6 group hover:bg-black/[0.02] transition-colors px-4 -mx-4 rounded-xl"
              >
                {/* Number & Title */}
                <div className="flex items-baseline gap-6 md:w-1/2">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-purple-700/60 group-hover:text-purple-700 transition-colors">
                    {service.number}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#0C0C0C] group-hover:translate-x-1 transition-transform">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:w-1/2">
                  <p className="text-base sm:text-lg text-[#0C0C0C]/80 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-16 border-t border-black/10 text-center">
            <div>
              <span className="text-4xl sm:text-5xl font-black text-[#0C0C0C] block">B.Tech</span>
              <span className="text-xs uppercase tracking-wider text-[#0C0C0C]/60 font-semibold mt-1 block">SRM Graduate</span>
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-black text-[#0C0C0C] block">M.Tech</span>
              <span className="text-xs uppercase tracking-wider text-[#0C0C0C]/60 font-semibold mt-1 block">GITAM Scholar</span>
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-black text-[#0C0C0C] block">4+</span>
              <span className="text-xs uppercase tracking-wider text-[#0C0C0C]/60 font-semibold mt-1 block">Core Projects</span>
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-black text-[#0C0C0C] block">100%</span>
              <span className="text-xs uppercase tracking-wider text-[#0C0C0C]/60 font-semibold mt-1 block">Code Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. PROJECTS SECTION (Dark Stacking Cards With Two-Column Composition)
          ======================================================== */}
      <section id="projects" className="relative rounded-t-[48px] md:rounded-t-[72px] -mt-12 bg-[#0C0C0C] text-[#D7E2EA] py-32 px-6 sm:px-12 lg:px-20 z-30 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-24">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold block mb-3">
              // Proven Implementations
            </span>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase tracking-tight text-gradient-silver">
              SELECTED PROJECTS
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mt-4 font-light">
              Explore deep learning models, computer vision dashboards, synthetic data engines, and systems software.
            </p>
          </div>

          {/* Sticky Stacking Project Cards */}
          <div className="flex flex-col gap-12 sm:gap-16">
            {projects.map((project, idx) => (
              <div 
                key={project.id || idx}
                className="sticky top-24 rounded-3xl p-8 sm:p-12 border border-white/10 bg-[#141416]/95 backdrop-blur-xl shadow-2xl transition-all duration-300"
                style={{
                  top: `calc(6rem + ${idx * 1.5}rem)`,
                  boxShadow: '0 30px 80px -20px rgba(0,0,0,0.9)'
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Metadata & Details */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl sm:text-4xl font-mono font-bold text-cyan-400">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-300 uppercase tracking-widest">
                        {project.category || "AI / Software Dev"}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tech_stack.split(',').map((tech, tIdx) => (
                        <span 
                          key={tIdx}
                          className="px-3 py-1 rounded-md bg-white/5 text-xs font-mono text-cyan-300 border border-cyan-500/20"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-4 pt-4 flex-wrap">
                      {project.github_url && (
                        <a 
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 border border-white/10"
                        >
                          <Github size={16} /> GitHub Repo
                        </a>
                      )}
                      {project.demo_url && (
                        <a 
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-3 rounded-full text-white font-semibold text-xs tracking-wider uppercase transition-transform hover:scale-105 shadow-md flex items-center gap-2 bg-gradient-contact"
                        >
                          <ExternalLink size={16} /> Live Project
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Visual Composition Card */}
                  <div className="lg:col-span-5">
                    {project.image_url ? (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-black shadow-xl group">
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-cyan-300">
                          <span>{project.category || "AI / Software"}</span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle size={13} /> Active
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/80 aspect-[4/3] flex flex-col justify-between p-6 shadow-inner">
                        {/* Terminal Chrome Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          </div>
                          <span className="text-[11px] font-mono text-white/40">project-spec.sh</span>
                        </div>

                        {/* Code / Visual Blueprint Simulation */}
                        <div className="font-mono text-xs text-white/80 space-y-2 py-4">
                          <p className="text-cyan-400">$ init --architecture=deep-learning</p>
                          <p className="text-white/60">&gt; Status: 200 OK verified</p>
                          <p className="text-white/60">&gt; Target: Real-time inferencing</p>
                          <p className="text-purple-400">&gt; Pipeline: Verified end-to-end</p>
                        </div>

                        {/* Bottom Live Status Pill */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                            <CheckCircle size={14} /> Production Ready
                          </span>
                          <span className="text-xs font-mono text-white/50">
                            v1.0.0
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. EXPERIENCE & EDUCATION SECTION
          ======================================================== */}
      <section id="experience" className="py-32 px-6 sm:px-12 lg:px-20 bg-[#0C0C0C] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Work Experience */}
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold block mb-3">
                // Industry Track
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mb-10">
                Work Experience
              </h2>

              <div className="space-y-8">
                {experience.map((exp) => (
                  <div 
                    key={exp.id}
                    className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white uppercase">{exp.company}</h3>
                      <span className="text-xs font-mono text-cyan-400">{exp.start_date} &mdash; {exp.end_date || "Present"}</span>
                    </div>
                    <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
                      {exp.role}
                    </div>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Academic Journey */}
            <div id="education">
              <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-semibold block mb-3">
                // Academic Foundation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mb-10">
                Education
              </h2>

              <div className="space-y-6">
                {education.map((edu) => (
                  <div 
                    key={edu.id}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white uppercase">{edu.institution}</h3>
                      <span className="text-xs font-mono text-purple-400">{edu.start_date} &mdash; {edu.end_date || "Present"}</span>
                    </div>
                    <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                      {edu.degree}
                    </div>
                    <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Certifications (if present) */}
              {certifications && certifications.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold block mb-3">
                    // Credentials & Honors
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white tracking-tight mb-6">
                    Certifications
                  </h3>
                  <div className="space-y-4">
                    {certifications.map((cert) => (
                      <a 
                        key={cert.id}
                        href={cert.url || "#"}
                        target={cert.url ? "_blank" : "_self"}
                        rel="noreferrer"
                        className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between group block"
                      >
                        <div>
                          <div className="text-sm font-bold text-white uppercase group-hover:text-cyan-400 transition-colors">
                            {cert.title}
                          </div>
                          <span className="text-xs font-semibold text-purple-400 uppercase mt-0.5 block">
                            {cert.issuer} {cert.date && `• ${cert.date}`}
                          </span>
                        </div>
                        {cert.url && <ArrowUpRight size={16} className="text-white/40 group-hover:text-cyan-400 transition-colors" />}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Papers (if present) */}
              {research_papers && research_papers.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold block mb-3">
                    // Published Work
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white tracking-tight mb-6">
                    Research Papers
                  </h3>
                  <div className="space-y-4">
                    {research_papers.map((paper) => (
                      <div key={paper.id} className="p-5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-white uppercase">{paper.title}</div>
                          {paper.description && <p className="text-xs text-white/60 mt-1">{paper.description}</p>}
                        </div>
                        {paper.pdf_url && (
                          <a 
                            href={paper.pdf_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 shrink-0"
                          >
                            <Download size={13} /> PDF
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          8. CONTACT SECTION (Gradient Contact Me Button & Full Details)
          ======================================================== */}
      <section id="contact" className="relative py-32 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-[#0C0C0C] to-black border-t border-white/10 overflow-hidden">
        
        {/* Glow Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold block mb-4">
            // Let's Collaborate
          </span>
          
          <h2 className="text-[clamp(2.4rem,7vw,6rem)] font-black uppercase tracking-tight text-white leading-tight">
            LET'S BUILD SOMETHING <br className="hidden sm:block" />
            <span className="text-gradient-silver">EXTRAORDINARY</span>
          </h2>

          <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto mt-6 font-light leading-relaxed">
            I am currently open to exciting software engineering, web development, and AI engineering opportunities. Feel free to reach out directly.
          </p>

          {/* Prominent Gradient Contact Button */}
          <div className="mt-12 flex justify-center">
            <a
              href={`mailto:${profile.email}`}
              className="px-12 py-5 rounded-full text-white font-extrabold text-base sm:text-lg tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 shadow-2xl bg-gradient-contact"
            >
              Contact Me Directly
            </a>
          </div>

          {/* Direct Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-20 text-left">
            
            {/* Email */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <Mail className="text-cyan-400 mb-3" size={24} />
              <span className="text-xs font-mono uppercase text-white/50 block">Email Address</span>
              <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-white hover:text-cyan-400 break-all transition-colors mt-1 block">
                {profile.email}
              </a>
            </div>

            {/* Phone */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <Phone className="text-purple-400 mb-3" size={24} />
              <span className="text-xs font-mono uppercase text-white/50 block">Phone Number</span>
              <a href={`tel:${profile.phone}`} className="text-sm font-semibold text-white hover:text-purple-400 transition-colors mt-1 block">
                +91 {profile.phone}
              </a>
            </div>

            {/* GitHub */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <Github className="text-emerald-400 mb-3" size={24} />
              <span className="text-xs font-mono uppercase text-white/50 block">Open Source</span>
              <a href={profile.github} target="_blank" rel="noreferrer" className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors mt-1 block">
                github.com/gowtham-garimella
              </a>
            </div>

            {/* LinkedIn */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <Linkedin className="text-blue-400 mb-3" size={24} />
              <span className="text-xs font-mono uppercase text-white/50 block">Professional Network</span>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors mt-1 block">
                linkedin.com/in/gowtham
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Footer Strip */}
        <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div>
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-white transition-colors">Back to top ↑</a>
            <Link to="/admin/login" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Lock size={12} /> Admin Portal
            </Link>
          </div>
        </footer>
      </section>

    </div>
  );
}
