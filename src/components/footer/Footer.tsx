import React from 'react';
import { Lock, Heart, ArrowUp } from 'lucide-react';
import { ProfileData } from '../../types/portfolio';

interface FooterProps {
  profile: ProfileData;
  onOpenAdminLogin: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAdminLogin, onScrollToTop }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#06080e] py-12 text-[#A3AEC2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C5CFC] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold">
              AK
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">{profile.name}</div>
              <div className="text-xs text-slate-500 font-mono">Full-Stack MERN &amp; AI Engineer</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-left">
            <span>Designed &amp; engineered with high architectural rigor. © {currentYear} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onScrollToTop}
              className="p-2 rounded-lg bg-[#101626] hover:bg-[#151d33] text-slate-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* Subtle Administrator Access */}
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101626] hover:bg-[#151d33] text-slate-500 hover:text-slate-300 border border-white/5 transition-colors cursor-pointer text-[11px] font-mono"
            >
              <Lock className="w-3 h-3 text-[#7C5CFC]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
