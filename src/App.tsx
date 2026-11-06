import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_125121_afb71ce9-9c64-4c54-90b5-c89c0764c052.png&w=1920&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_135737_0da59642-725b-451a-997b-b0283d95a42a.png&w=1280&q=85";

// Concentric arc definitions
const CX = -110;
const CY = 300;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const getPoint = (r: number, deg: number) => {
  const rad = toRad(deg);
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad)
  };
};

const ARCS_CONFIG = [
  {
    r: 330,
    startDeg: -92,
    endDeg: 16,
    dotDeg: -46,
    val: "10",
    suffix: "+",
    label: "YEARS REAL"
  },
  {
    r: 395,
    startDeg: -56,
    endDeg: 60,
    dotDeg: 2,
    val: "40",
    suffix: "+",
    label: "USE FORMS"
  },
  {
    r: 460,
    startDeg: -14,
    endDeg: 72,
    dotDeg: 44,
    val: "95",
    suffix: "%",
    label: "REPEAT MEMBERS"
  }
];

const ARCS_DATA = ARCS_CONFIG.map((arc, i) => {
  const p1 = getPoint(arc.r, arc.startDeg);
  const p2 = getPoint(arc.r, arc.endDeg);
  const pDot = getPoint(arc.r, arc.dotDeg);
  const deltaRad = Math.abs(toRad(arc.endDeg) - toRad(arc.startDeg));
  const arcLen = arc.r * deltaRad;

  const lineDelay = 0.4 + i * 0.22;
  const markDelay = lineDelay + 0.9;
  const ringDelay = markDelay + 0.3;
  const numberDelay = markDelay + 0.15;
  const labelDelay = markDelay + 0.3;

  return {
    ...arc,
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y,
    dotX: pDot.x,
    dotY: pDot.y,
    len: arcLen,
    lineDelay,
    markDelay,
    ringDelay,
    numberDelay,
    labelDelay
  };
});

const NAV_LINKS = [
  { name: "Module", active: true },
  { name: "Case Records", active: false },
  { name: "Biotech", active: false },
  { name: "Tiers", active: false },
  { name: "Live Demo", active: false }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden canvas for generating the spotlight mask
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);
  const patternRef = useRef<SVGPatternElement | null>(null);

  // Mouse positions for smoothing (starts offscreen at -999, -999)
  const targetMouse = useRef({ x: -999, y: -999 });
  const smoothMouse = useRef({ x: -999, y: -999 });
  const gridOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const render = () => {
      // 1. Smooth cursor lerp
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * 0.1;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * 0.1;

      // 2. Parallax grid offset: target = (norm - 0.5) * 16px, eased at 0.06 lerp
      const normX = targetMouse.current.x >= 0 ? targetMouse.current.x / window.innerWidth : 0.5;
      const normY = targetMouse.current.y >= 0 ? targetMouse.current.y / window.innerHeight : 0.5;
      const targetGridX = (normX - 0.5) * 16;
      const targetGridY = (normY - 0.5) * 16;

      gridOffset.current.x += (targetGridX - gridOffset.current.x) * 0.06;
      gridOffset.current.y += (targetGridY - gridOffset.current.y) * 0.06;

      if (patternRef.current) {
        patternRef.current.setAttribute('x', gridOffset.current.x.toFixed(2));
        patternRef.current.setAttribute('y', gridOffset.current.y.toFixed(2));
      }

      // 3. Render radial spotlight mask (radius 260px)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sx = smoothMouse.current.x;
      const sy = smoothMouse.current.y;

      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 260);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.4, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.75)');
      grad.addColorStop(0.75, 'rgba(0, 0, 0, 0.4)');
      grad.addColorStop(0.88, 'rgba(0, 0, 0, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, 260, 0, Math.PI * 2);
      ctx.fill();

      // Apply mask to the reveal image layer
      if (revealRef.current) {
        const maskUrl = canvas.toDataURL();
        revealRef.current.style.maskImage = `url(${maskUrl})`;
        revealRef.current.style.webkitMaskImage = `url(${maskUrl})`;
        revealRef.current.style.maskSize = '100% 100%';
        revealRef.current.style.webkitMaskSize = '100% 100%';
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-white tracking-[-0.02em] select-none"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Hidden canvas for spotlight mask */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:justify-center p-4 sm:p-5">
        {/* Desktop (md+): ONE centered pill */}
        <div className="hidden md:flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full pl-3 pr-2 py-2 nav-drop shadow-2xl">
          {/* Logo SVG */}
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 256 256" 
            fill="white" 
            className="flex-shrink-0"
            aria-label="Cyberpunk Angular Logo"
          >
            <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
          </svg>

          {/* Links */}
          {NAV_LINKS.map((link, idx) => (
            <button
              key={idx}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                link.active 
                  ? "text-white hover:bg-white/10" 
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.name}
            </button>
          ))}

          {/* Connect CTA */}
          <button className="bg-white text-gray-900 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-100 transition-colors ml-1">
            Connect
          </button>
        </div>

        {/* Mobile (<md): Logo pill (left) & Hamburger pill (right) */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="bg-black/60 backdrop-blur-md rounded-full p-2.5 flex items-center justify-center nav-drop shadow-lg">
            <svg width="22" height="22" viewBox="0 0 256 256" fill="white">
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className="bg-black/60 backdrop-blur-md rounded-full p-2.5 flex items-center justify-center text-white nav-drop shadow-lg"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="fixed top-0 left-0 right-0 z-40 pt-16 pb-6 px-5 shadow-lg bg-white flex flex-col md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            {NAV_LINKS.map((link, idx) => (
              <button
                key={idx}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 border-b border-gray-100 text-left text-base font-medium transition-colors ${
                  link.active ? "text-gray-900 font-semibold" : "text-gray-800 hover:text-black"
                }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 bg-gray-900 text-white text-center py-3 rounded-full font-semibold hover:bg-black transition-colors text-sm"
            >
              Connect
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION (100dvh, relative overflow-hidden) */}
      <section className="h-[100dvh] relative overflow-hidden bg-black">
        
        {/* Layer 1: Grid background (z-0) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-10"
          aria-hidden="true"
        >
          <defs>
            <pattern 
              ref={patternRef}
              id="hero-grid" 
              width="48" 
              height="48" 
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
            >
              <path 
                d="M 48 0 L 0 0 0 48" 
                fill="none" 
                stroke="#64748b" 
                strokeWidth="0.6" 
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Layer 2: Base image (z-10) with Ken Burns animation */}
        <div 
          className="absolute inset-0 w-full h-full bg-center bg-cover ken-burns z-10 pointer-events-none"
          style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
        />

        {/* Layer 3: Cursor spotlight reveal layer (z-30) */}
        <div 
          ref={revealRef}
          className="absolute inset-0 w-full h-full bg-center bg-cover z-30 pointer-events-none transition-opacity duration-300"
          style={{ backgroundImage: `url("${BG_IMAGE_2}")` }}
        />

        {/* Layer 4: Stats on fading circular arcs (z-50, hidden below sm) */}
        <div className="absolute inset-y-0 right-0 pointer-events-none z-50 hidden sm:block h-full">
          <svg 
            viewBox="0 0 380 700" 
            preserveAspectRatio="xMaxYMid meet" 
            className="h-full w-auto"
            aria-hidden="true"
          >
            <defs>
              {ARCS_DATA.map((arc, i) => (
                <linearGradient
                  key={`arc-grad-${i}`}
                  id={`arc-grad-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={arc.x1}
                  y1={arc.y1}
                  x2={arc.x2}
                  y2={arc.y2}
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="22%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="85%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>

            {ARCS_DATA.map((arc, i) => (
              <g key={`arc-group-${i}`}>
                {/* Arc stroke line */}
                <path
                  d={`M ${arc.x1.toFixed(2)} ${arc.y1.toFixed(2)} A ${arc.r} ${arc.r} 0 0 1 ${arc.x2.toFixed(2)} ${arc.y2.toFixed(2)}`}
                  fill="none"
                  stroke={`url(#arc-grad-${i})`}
                  strokeWidth="1.1"
                  className="arc-line"
                  style={{
                    '--len': `${arc.len.toFixed(2)}px`,
                    animationDelay: `${arc.lineDelay}s`
                  } as React.CSSProperties}
                />

                {/* Outer pulsing ring at dot */}
                <circle
                  cx={arc.dotX.toFixed(2)}
                  cy={arc.dotY.toFixed(2)}
                  r="7"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  className="arc-ring"
                  style={{
                    animationDelay: `${arc.ringDelay}s`
                  }}
                />

                {/* Center dot */}
                <circle
                  cx={arc.dotX.toFixed(2)}
                  cy={arc.dotY.toFixed(2)}
                  r="3.4"
                  fill="white"
                  className="arc-dot"
                  style={{
                    animationDelay: `${arc.markDelay}s`
                  }}
                />

                {/* Number & Suffix */}
                <text
                  x={(arc.dotX + 16).toFixed(2)}
                  y={(arc.dotY + 4).toFixed(2)}
                  fill="white"
                  fontSize="32"
                  fontWeight="400"
                  className="arc-text font-helvetica-neue"
                  style={{ animationDelay: `${arc.numberDelay}s` }}
                >
                  {arc.val}
                  <tspan fontSize="19" dy="-10" letterSpacing="-1px">
                    {arc.suffix}
                  </tspan>
                </text>

                {/* Label */}
                <text
                  x={(arc.dotX + 18).toFixed(2)}
                  y={(arc.dotY + 22).toFixed(2)}
                  fill="white"
                  fillOpacity="0.8"
                  fontSize="8.5"
                  fontWeight="600"
                  letterSpacing="2px"
                  className="arc-text font-helvetica-neue uppercase"
                  style={{ animationDelay: `${arc.labelDelay}s` }}
                >
                  {arc.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Layer 5: Hero text block (z-50) */}
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8 md:left-12 max-w-[300px] sm:max-w-md z-50 flex flex-col items-start gap-4 sm:gap-5">
          {/* Eyebrow */}
          <div 
            className="hero-rise text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-white/90"
            style={{ animationDelay: '0.15s' }}
          >
            Gateway to your <span className="italic">augmented self</span>
          </div>

          {/* H1 */}
          <h1 
            className="hero-rise text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.08em] text-white font-normal"
            style={{ animationDelay: '0.3s' }}
          >
            A window<br />of coming<br />enhancements
          </h1>

          {/* Paragraph */}
          <p 
            className="hero-rise text-sm sm:text-base text-white/90 leading-relaxed font-normal"
            style={{ animationDelay: '0.5s' }}
          >
            A future where carbon fiber, titanium, and human instinct align. Not machine. Not human. Something wonderfully poised between.
          </p>

          {/* CTA "Reserve Now" Button */}
          <div 
            className="hero-rise pt-1 sm:pt-2"
            style={{ animationDelay: '0.7s' }}
          >
            <button className="group relative overflow-hidden bg-white px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-black/20 hover:scale-[1.04] active:scale-95 transition-transform duration-200 cursor-pointer">
              <span className="relative z-10 text-gray-950 font-semibold text-sm sm:text-base tracking-[-0.02em]">
                Reserve Now
              </span>
              {/* Shine sweep animation */}
              <span 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" 
              />
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}
