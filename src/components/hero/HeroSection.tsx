import React from 'react';
import { ArrowDown, Download, Mail, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProfileData, DSAData } from '../../types/portfolio';

interface HeroSectionProps {
  profile: ProfileData;
  dsa: DSAData;
  onExploreWork: () => void;
  onDownloadResume: () => void;
  onContactMe: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  dsa,
  onExploreWork,
  onDownloadResume,
  onContactMe,
}) => {
  return (
    <section id="hero" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#7C5CFC]/15 via-[#38BDF8]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131B2D]/90 border border-white/10 text-xs font-medium text-[#38BDF8] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{profile.availabilityStatus || 'Open to Internships & Opportunities'}</span>
            </div>

            <p className="text-[#A3AEC2] text-lg font-medium mb-2">Hi, I'm Akash Singh Kushwaha.</p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 text-balance">
              Full-Stack Developer building meaningful digital experiences.
            </h1>

            <p className="text-base sm:text-lg text-[#A3AEC2] leading-relaxed max-w-2xl mb-8">
              {profile.heroTagline ||
                'Building products that solve real problems — from full-stack platforms to AI-powered applications.'}{' '}
              {profile.summary.slice(0, 160)}...
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreWork}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#7C5CFC] to-[#5a38ea] hover:from-[#8d71fd] hover:to-[#6944f7] rounded-xl shadow-lg shadow-[#7C5CFC]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore My Work</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onDownloadResume}
                className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-[#131B2D] hover:bg-[#1c263f] border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#38BDF8]" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={onContactMe}
                className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-[#A3AEC2] hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Workspace Card & Interactive Code snippet */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Terminal Card */}
              <div className="rounded-2xl bg-[#101626] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
                {/* Terminal Header */}
                <div className="px-4 py-3 bg-[#0c111e] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#A3AEC2]">
                    <Terminal className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    <span>AkashSingh.ts</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#38BDF8]">MERN + AI</span>
                </div>

                {/* Code Body */}
                <div className="p-5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto space-y-1.5">
                  <div className="text-[#A3AEC2]">
                    <span className="text-purple-400">const</span> developer = &#123;
                  </div>
                  <div className="pl-4">
                    name: <span className="text-emerald-300">"{profile.name}"</span>,
                  </div>
                  <div className="pl-4">
                    role: <span className="text-emerald-300">"Full-Stack MERN & AI"</span>,
                  </div>
                  <div className="pl-4">
                    education: <span className="text-sky-300">"B.Tech IT (2027) · JECRC"</span>,
                  </div>
                  <div className="pl-4">
                    cgpa: <span className="text-amber-300 font-semibold">{profile.cgpa}</span>,
                  </div>
                  <div className="pl-4">
                    stack: [
                    <span className="text-purple-300">"React"</span>,{' '}
                    <span className="text-emerald-300">"Node"</span>,{' '}
                    <span className="text-sky-300">"Express"</span>,{' '}
                    <span className="text-amber-300">"MongoDB"</span>
                    ],
                  </div>
                  <div className="pl-4">
                    core: [<span className="text-sky-300">"DSA in Java"</span>,{' '}
                    <span className="text-purple-300">"REST APIs"</span>],
                  </div>
                  <div className="pl-4">
                    status: <span className="text-emerald-400">"Ready for impact"</span>
                  </div>
                  <div className="text-[#A3AEC2]">&#125;;</div>
                  <div className="pt-2 text-[#7C5CFC]">
                    <span className="text-slate-400">&gt; </span>developer.solveProblem();
                  </div>
                  <div className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{dsa.totalSolved}+ algorithmic problems solved</span>
                  </div>
                </div>

                {/* Floating Tech Indicators */}
                <div className="px-4 py-3 bg-[#0c111e]/80 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#A3AEC2]">Tech Focus:</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#131B2D] text-sky-400 font-mono text-[11px]">React</span>
                    <span className="px-2 py-0.5 rounded bg-[#131B2D] text-emerald-400 font-mono text-[11px]">Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-[#131B2D] text-amber-400 font-mono text-[11px]">Java</span>
                    <span className="px-2 py-0.5 rounded bg-[#131B2D] text-purple-400 font-mono text-[11px]">Gemini AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Strip Below Hero */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="p-4 rounded-xl bg-[#101626]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {dsa.totalSolved}+
              </div>
              <div className="text-xs sm:text-sm text-[#A3AEC2] mt-1 font-medium">DSA Problems Solved</div>
              <div className="text-[11px] text-slate-500 mt-0.5">LeetCode &amp; GeeksforGeeks</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101626]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7C5CFC] font-mono tabular-nums">3</div>
              <div className="text-xs sm:text-sm text-[#A3AEC2] mt-1 font-medium">Featured Platforms</div>
              <div className="text-[11px] text-slate-500 mt-0.5">E-Commerce, Esports, AI</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101626]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">13</div>
              <div className="text-xs sm:text-sm text-[#A3AEC2] mt-1 font-medium">Table Tennis Medals</div>
              <div className="text-[11px] text-slate-500 mt-0.5">7 Gold · 5 Silver · 1 Bronze</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101626]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] font-mono tabular-nums">
                {profile.expectedGraduation || '2027'}
              </div>
              <div className="text-xs sm:text-sm text-[#A3AEC2] mt-1 font-medium">Expected Graduation</div>
              <div className="text-[11px] text-slate-500 mt-0.5">B.Tech IT · CGPA 8.13</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
