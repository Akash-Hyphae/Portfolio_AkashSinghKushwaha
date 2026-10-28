import React from 'react';
import { GraduationCap, Code2, Brain, Award, BookOpen, Compass, Trophy } from 'lucide-react';
import { ProfileData } from '../../types/portfolio';

interface AboutSectionProps {
  profile: ProfileData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
            Background &amp; Philosophy
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">About Me</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Story & Education */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-[#A3AEC2] leading-relaxed text-base space-y-4">
              <p>{profile.summary}</p>
              <p>
                My engineering focus centers on architecting clean, maintainable systems that bridge modern user
                interfaces with resilient backend architectures. Whether writing recursive algorithms for knockout
                brackets, implementing SHA256 payment verification routines, or grounding LLM outputs to deterministic
                schemas, I value correctness, speed, and real-world utility over buzzwords.
              </p>
            </div>

            {/* Education Card */}
            <div className="p-6 rounded-2xl bg-[#101626] border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#7C5CFC] shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider">Formal Education</div>
                  <h3 className="text-lg font-bold text-white mt-1">{profile.degree}</h3>
                  <div className="text-sm text-[#A3AEC2] mt-0.5">{profile.institution}</div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-3 font-mono">
                    <span className="text-emerald-400 font-semibold">CGPA: {profile.cgpa}</span>
                    <span>·</span>
                    <span>Class of {profile.expectedGraduation}</span>
                    <span>·</span>
                    <span>Jaipur, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Learning Subsection */}
            <div className="p-6 rounded-2xl bg-[#101626] border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#7C5CFC]" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Currently Deep-Diving Into</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.currentlyLearning.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#131B2D]/80 border border-white/5 text-xs text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Areas of Interest & Personal Interests */}
          <div className="lg:col-span-5 space-y-6">
            {/* Areas of Interest */}
            <div className="p-6 rounded-2xl bg-[#101626] border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Engineering Focus</h3>
              </div>
              <ul className="space-y-3">
                {profile.areasOfInterest.map((interest, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#A3AEC2]">
                    <span className="text-[#7C5CFC] font-mono text-xs mt-0.5">0{idx + 1}.</span>
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personal Interests / Athletic Discipline */}
            <div className="p-6 rounded-2xl bg-[#101626] border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Personal Passions &amp; Athletics
                </h3>
              </div>
              <p className="text-xs text-[#A3AEC2] leading-relaxed mb-4">
                Beyond software, high-intensity table tennis has shaped my focus and competitive grit. Competing at the
                state level and winning 13 tournament medals instilled the patience and tactical discipline required to
                debug complex software and solve hard algorithmic challenges.
              </p>
              <div className="space-y-2">
                {profile.personalInterests.map((p, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-300 p-2.5 rounded-lg bg-[#131B2D] border border-white/5 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
