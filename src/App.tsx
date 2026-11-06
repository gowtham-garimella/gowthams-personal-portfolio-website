import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BG_IMAGE = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85";
const PORTRAIT_IMAGE = "https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png";

const NAV_LINKS = ["Story", "Jobs", "Message"];
const SOCIAL_LINKS = ["Instagram", "TikTok", "YouTube"];

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-cream font-hn select-none">
      {/* 1. Background image (full-bleed, behind everything, z-0 default) */}
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover anim-fade-in pointer-events-none"
      />

      {/* 2. Marquee name (z-10, behind cutout portrait) */}
      <div 
        className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden anim-fade-up pointer-events-none"
        style={{ animationDelay: '500ms' }}
      >
        <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] leading-none text-cream">
          <span className="pr-[6vw]">Marcus &mdash; Bennet&nbsp;</span>
          <span className="pr-[6vw]">Marcus &mdash; Bennet&nbsp;</span>
        </div>
      </div>

      {/* 3. Horizontal cream rule (z-10) */}
      <div 
        className="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream anim-line"
        style={{ animationDelay: '1200ms' }}
      />

      {/* 4. Desktop footer (sm:z-10) / Mobile footer */}
      <footer className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream">
        {/* Footer Left (3 lines) */}
        <div 
          className="flex flex-col anim-fade-up"
          style={{ animationDelay: '1400ms' }}
        >
          <span>Visuals Composer</span>
          <span>Digital Crafter</span>
          <span>Obsessed by The Office</span>
        </div>

        {/* Footer Right (2 lines right-aligned) */}
        <div 
          className="flex flex-col text-right anim-fade-up"
          style={{ animationDelay: '1550ms' }}
        >
          <span>A homage to</span>
          <span>Marcus Holloway</span>
        </div>
      </footer>

      {/* 5. Front portrait (cutout overlay, above marquee, z-20, pointer-events none) */}
      <img
        src={PORTRAIT_IMAGE}
        alt="Portrait"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-20 anim-rise-in"
        style={{ animationDelay: '300ms' }}
      />

      {/* 6. Header (z-30) */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        {/* Brand / logo link (top-left) */}
        <a 
          href="#" 
          className="font-hn text-lg tracking-wide text-cream anim-fade-up transition-opacity duration-300 hover:opacity-60"
          style={{ animationDelay: '800ms' }}
        >
          Marcus
        </a>

        {/* Desktop Right Cluster (hidden on mobile) */}
        <div className="hidden sm:flex items-start gap-16 lg:gap-24">
          {/* Year */}
          <div 
            className="text-sm font-hn text-cream anim-fade-up"
            style={{ animationDelay: '900ms' }}
          >
            2025
          </div>

          {/* Nav Column */}
          <nav className="flex flex-col gap-0.5 text-sm font-hn">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                className="text-cream anim-fade-up transition-opacity duration-300 hover:opacity-60"
                style={{ animationDelay: `${1000 + i * 80}ms` }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Social Column */}
          <div className="flex flex-col gap-0.5 text-sm font-hn">
            {SOCIAL_LINKS.map((social, i) => (
              <a
                key={social}
                href="#"
                className="text-cream anim-fade-up transition-opacity duration-300 hover:opacity-60"
                style={{ animationDelay: `${1150 + i * 80}ms` }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Hamburger Button (sm:hidden, z-50, 3 cream bars in h-10 w-10, bars in h-4 w-6) */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
          className="sm:hidden relative z-50 flex items-center justify-center h-10 w-10 anim-fade-up cursor-pointer -mr-2"
          style={{ animationDelay: '900ms' }}
        >
          <div className="relative h-4 w-6 flex flex-col justify-between">
            <span 
              className={`block h-[2px] w-full bg-cream transform transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isDrawerOpen ? 'translate-y-[7px] rotate-45' : 'translate-y-0 rotate-0'
              }`} 
            />
            <span 
              className={`block h-[2px] w-full bg-cream transition-opacity duration-300 ${
                isDrawerOpen ? 'opacity-0' : 'opacity-100'
              }`} 
            />
            <span 
              className={`block h-[2px] w-full bg-cream transform transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isDrawerOpen ? '-translate-y-[7px] -rotate-45' : 'translate-y-0 rotate-0'
              }`} 
            />
          </div>
        </button>
      </header>

      {/* 7. Mobile Drawer (sm:hidden, z-40) */}
      <div 
        className={`sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden={!isDrawerOpen}
      />

      <aside 
        className={`sm:hidden fixed right-0 top-0 bottom-0 h-full w-[80%] max-w-sm bg-[#141414] px-8 py-10 z-40 flex flex-col justify-between transform transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Close Button with Lucide X */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close navigation"
          className={`absolute right-6 top-6 z-50 text-cream transition-all duration-300 ${
            isDrawerOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0 pointer-events-none'
          }`}
          style={{ transitionDelay: isDrawerOpen ? '300ms' : '0ms' }}
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        {/* Drawer Content */}
        <div className="flex flex-col gap-12 mt-12">
          {/* Site Index Section */}
          <div className="flex flex-col gap-5">
            <span 
              className={`uppercase tracking-[0.2em] text-cream/50 text-xs font-hn transition-all duration-500 ${
                isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: isDrawerOpen ? '250ms' : '0ms' }}
            >
              Site Index
            </span>
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setIsDrawerOpen(false)}
                  className={`text-4xl text-cream font-hn transition-all duration-500 hover:opacity-60 ${
                    isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: isDrawerOpen ? `${300 + i * 80}ms` : '0ms' }}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Find Me Section */}
          <div className="flex flex-col gap-4">
            <span 
              className={`uppercase tracking-[0.2em] text-cream/50 text-xs font-hn transition-all duration-500 ${
                isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: isDrawerOpen ? '500ms' : '0ms' }}
            >
              Find Me
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {SOCIAL_LINKS.map((social, i) => (
                <a
                  key={social}
                  href="#"
                  onClick={() => setIsDrawerOpen(false)}
                  className={`text-sm text-cream font-hn transition-all duration-500 hover:opacity-60 ${
                    isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: isDrawerOpen ? `${550 + i * 60}ms` : '0ms' }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Homage Info */}
        <div 
          className={`flex flex-col text-xs text-cream/40 font-hn transition-all duration-500 ${
            isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: isDrawerOpen ? '700ms' : '0ms' }}
        >
          <span>Visuals Composer & Digital Crafter</span>
          <span>A homage to Marcus Holloway</span>
        </div>
      </aside>
    </main>
  );
}
