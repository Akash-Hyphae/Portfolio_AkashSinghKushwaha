import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, FileText, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenResume }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'dsa', label: 'DSA' },
    { id: 'experience', label: 'Experience' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080B14]/90 dark:bg-[#080B14]/90 bg-white/90 backdrop-blur-md border-b border-white/10 dark:border-white/10 border-slate-200/80 shadow-lg shadow-black/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-left font-bold text-lg tracking-tight text-white dark:text-white text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C5CFC] to-[#38BDF8] flex items-center justify-center text-white text-sm font-extrabold shadow-md shadow-[#7C5CFC]/20 group-hover:scale-105 transition-transform">
            AK
          </span>
          <span className="font-semibold text-base sm:text-lg">Akash Singh Kushwaha</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#A3AEC2] dark:text-[#A3AEC2] text-slate-600">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white dark:text-white text-slate-950 font-semibold'
                    : 'hover:text-white dark:hover:text-white hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7C5CFC] to-[#38BDF8] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + theme toggle & mobile button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-[#A3AEC2] hover:text-white dark:hover:text-white hover:text-slate-900 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onOpenResume}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFC] to-[#6039ea] hover:from-[#8b6dfc] hover:to-[#6d44f3] rounded-lg shadow-sm shadow-[#7C5CFC]/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Resume</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#A3AEC2] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/10 dark:border-white/10 border-slate-200 bg-[#080B14]/98 dark:bg-[#080B14]/98 bg-white/98 backdrop-blur-xl px-4 py-5 shadow-2xl">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <ArrowRight className="w-4 h-4 text-[#38BDF8]" />}
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6e4ef4] rounded-lg text-center flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
