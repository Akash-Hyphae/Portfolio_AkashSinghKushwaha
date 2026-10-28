import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Cpu,
  Layers,
  Lightbulb,
  ShieldCheck,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const cs = project.caseStudy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0e1424] border border-white/10 shadow-2xl text-slate-200 z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-[#131B2D] border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#38BDF8] font-mono mb-1">
              <span>{project.category}</span>
              {project.clientWork && (
                <>
                  <span>·</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Client Production
                  </span>
                </>
              )}
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> {project.period}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{project.title}</h2>
            <p className="text-xs sm:text-sm text-[#A3AEC2] mt-1">{project.subtitle || project.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm">
          {/* Action Links Bar */}
          <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-white/10">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6e4ef4] rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Live Application</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-[#131B2D] hover:bg-[#1c263f] border border-white/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>

          {/* Problem Statement & Objectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#101626] border border-white/5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> The Problem
              </h3>
              <p className="text-xs leading-relaxed text-[#A3AEC2]">{cs.problemStatement}</p>
            </div>

            <div className="p-5 rounded-xl bg-[#101626] border border-white/5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Core Objectives
              </h3>
              <ul className="space-y-1.5 text-xs text-[#A3AEC2]">
                {cs.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#38BDF8] font-bold">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution & Architecture */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#101626] border border-white/5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7C5CFC] mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Solution Overview
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">{cs.solutionOverview}</p>
            </div>

            <div className="p-5 rounded-xl bg-[#101626] border border-white/5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Technical Architecture
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">{cs.technicalArchitecture}</p>
            </div>
          </div>

          {/* Verified Engineering Features */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Verified Technical Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cs.verifiedFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-[#131B2D]/80 border border-white/5 text-xs text-slate-200 flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Decisions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Key Engineering Decisions
            </h3>
            <ul className="space-y-2 text-xs text-[#A3AEC2]">
              {cs.keyDecisions.map((dec, i) => (
                <li key={i} className="p-3 rounded-lg bg-[#101626] border border-white/5 flex items-start gap-2.5">
                  <span className="text-[#7C5CFC] font-mono font-bold mt-0.5">0{i + 1}.</span>
                  <span className="leading-relaxed">{dec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges & Solutions */}
          {cs.challengesAndSolutions && (
            <div className="p-5 rounded-xl bg-[#101626] border border-amber-500/20">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Challenge &amp; Resolution
              </h3>
              <p className="text-xs leading-relaxed text-[#A3AEC2] whitespace-pre-line">
                {cs.challengesAndSolutions}
              </p>
            </div>
          )}

          {/* Technologies Used */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md bg-[#131B2D] border border-white/10 text-xs font-mono text-sky-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Future Improvements */}
          {cs.futureImprovements && cs.futureImprovements.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Planned Enhancements
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#A3AEC2]">
                {cs.futureImprovements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#131B2D] border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Slug: <code className="text-[#38BDF8]">{project.slug}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
