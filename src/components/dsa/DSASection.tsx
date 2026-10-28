import React, { useState } from 'react';
import {
  Code2,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Brain,
  Calendar,
  Layers,
  ArrowRight,
  BookMarked,
  Github,
} from 'lucide-react';
import { DSAData, FeaturedProblem, DSATopic } from '../../types/portfolio';

interface DSASectionProps {
  dsa: DSAData;
}

export const DSASection: React.FC<DSASectionProps> = ({ dsa }) => {
  const [activeTab, setActiveTab] = useState<'topics' | 'featured'>('topics');

  const getStatusColor = (status: DSATopic['status']) => {
    switch (status) {
      case 'Mastered':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Proficient':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'In Progress':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Learning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getDifficultyColor = (diff: FeaturedProblem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400';
      case 'Medium':
        return 'text-amber-400';
      case 'Hard':
        return 'text-rose-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <section id="dsa" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
              Algorithmic Problem-Solving
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Data Structures &amp; Algorithms
            </h2>
            <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
              Consistent analytical problem solving in Java. Rigorous mastery of asymptotic complexity, trees, dynamic
              programming, and graph theory.
            </p>
          </div>

          {/* Coding Profile Links */}
          <div className="flex items-center gap-3">
            {dsa.leetCodeUrl && (
              <a
                href={dsa.leetCodeUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#101626] border border-amber-500/30 text-amber-300 hover:bg-[#162035] transition-colors flex items-center gap-2"
              >
                <span>LeetCode Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {dsa.gfgUrl && (
              <a
                href={dsa.gfgUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#101626] border border-emerald-500/30 text-emerald-300 hover:bg-[#162035] transition-colors flex items-center gap-2"
              >
                <span>GeeksforGeeks Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Highlight Metrics KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
            <span className="text-xs text-[#A3AEC2]">Total Solved (Combined)</span>
            <div className="text-3xl font-bold text-white font-mono tabular-nums mt-1">{dsa.totalSolved}+</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 font-mono">
              <Calendar className="w-3 h-3" />
              <span>Verified {dsa.lastUpdated}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
            <span className="text-xs text-[#A3AEC2]">LeetCode Solved</span>
            <div className="text-3xl font-bold text-amber-400 font-mono tabular-nums mt-1">
              {dsa.leetCodeSolved}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Java Implementation</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
            <span className="text-xs text-[#A3AEC2]">GeeksforGeeks Solved</span>
            <div className="text-3xl font-bold text-emerald-400 font-mono tabular-nums mt-1">{dsa.gfgSolved}</div>
            <div className="text-[11px] text-slate-500 mt-2">Core CS &amp; Algorithms</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
            <span className="text-xs text-[#A3AEC2]">Primary Language</span>
            <div className="text-3xl font-bold text-sky-400 font-mono mt-1">Java</div>
            <div className="text-[11px] text-slate-500 mt-2">OOP &amp; Standard Collections</div>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-[#7C5CFC] text-white'
                : 'bg-[#101626] text-[#A3AEC2] hover:text-white border border-white/5'
            }`}
          >
            Topic Mastery &amp; Progress ({dsa.topics.length})
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'featured'
                ? 'bg-[#7C5CFC] text-white'
                : 'bg-[#101626] text-[#A3AEC2] hover:text-white border border-white/5'
            }`}
          >
            Key Algorithmic Solutions ({dsa.featuredProblems.length})
          </button>
        </div>

        {/* Tab 1: Topics Breakdown */}
        {activeTab === 'topics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dsa.topics.map((t) => {
              const pct = Math.min(100, Math.round((t.completed / (t.target || 1)) * 100));
              return (
                <div key={t.id} className="p-5 rounded-xl bg-[#101626] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">{t.name}</h3>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs text-[#A3AEC2] font-mono mt-3">
                      <span>Progress</span>
                      <span>
                        <strong className="text-white">{t.completed}</strong> / {t.target} solved ({pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#131B2D] mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#38BDF8] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {t.notes && <p className="text-[11px] text-slate-400 mt-3 line-clamp-2">{t.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Featured Problems */}
        {activeTab === 'featured' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dsa.featuredProblems.map((prob) => (
              <div
                key={prob.id}
                className="p-5 rounded-xl bg-[#101626] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-[#38BDF8]">{prob.topic}</span>
                    <span className={`text-xs font-bold font-mono ${getDifficultyColor(prob.difficulty)}`}>
                      {prob.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{prob.title}</h3>
                  <p className="text-xs text-[#A3AEC2] leading-relaxed mb-4">{prob.notes}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <span className="text-slate-400 font-mono">{prob.platform}</span>

                  <div className="flex items-center gap-3">
                    {prob.solutionUrl && (
                      <a
                        href={prob.solutionUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[#7C5CFC] hover:text-white flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Solution</span>
                      </a>
                    )}
                    <a
                      href={prob.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-white hover:text-[#38BDF8] flex items-center gap-1 font-semibold"
                    >
                      <span>Problem</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
