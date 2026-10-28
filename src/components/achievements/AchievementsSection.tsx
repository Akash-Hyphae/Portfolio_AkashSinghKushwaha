import React from 'react';
import { Trophy, Medal, Award, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { AchievementItem } from '../../types/portfolio';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  return (
    <section id="achievements" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
            Recognitions &amp; Milestones
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Achievements</h2>
          <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
            A track record of sports discipline, algorithmic consistency, and commercial software deliveries.
          </p>
        </div>

        {/* Highlight Banner: Table Tennis Medals */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#17142b] via-[#101626] to-[#0c1221] border border-amber-500/20 shadow-2xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-3">
                <Trophy className="w-3.5 h-3.5" />
                <span>State-Level Table Tennis Athlete</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                West Zone Inter-University Representative · 13 Career Medals
              </h3>
              <p className="text-xs sm:text-sm text-[#A3AEC2] leading-relaxed mt-2 max-w-2xl">
                Represented JECRC Foundation at the prestigious West Zone table tennis tournament. Built a record of 13
                podium finishes (7 Gold, 5 Silver, 1 Bronze) demonstrating athletic focus and mental stamina under
                pressure.
              </p>
            </div>

            <div className="lg:col-span-4 flex items-center justify-around sm:justify-end gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">7</div>
                <div className="text-[11px] text-amber-200/80 uppercase tracking-wider font-semibold mt-0.5">Gold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-300 font-mono">5</div>
                <div className="text-[11px] text-slate-300/80 uppercase tracking-wider font-semibold mt-0.5">Silver</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono">1</div>
                <div className="text-[11px] text-amber-600/80 uppercase tracking-wider font-semibold mt-0.5">Bronze</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#101626] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="text-[#38BDF8] font-mono">{item.category}</span>
                  <span>{item.date}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <div className="text-xs text-[#7C5CFC] font-medium mb-3">{item.organization}</div>

                <p className="text-xs text-[#A3AEC2] leading-relaxed mb-4">{item.description}</p>
              </div>

              {item.highlights && item.highlights.length > 0 && (
                <div className="pt-3 border-t border-white/5 space-y-1.5">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="text-[11px] text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
