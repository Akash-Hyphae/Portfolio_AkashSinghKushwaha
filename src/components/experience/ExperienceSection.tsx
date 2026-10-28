import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { ExperienceItem } from '../../types/portfolio';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
            Professional Track Record
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Work Experience</h2>
          <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
            Real production deliverables built for paying clients and autonomous products.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#101626] border border-white/10 hover:border-white/20 transition-all shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] mb-1">
                    <span className="font-semibold text-white text-base">{exp.company}</span>
                    <span>·</span>
                    <span>{exp.employmentType}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#131B2D] border border-white/5">
                    <Calendar className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    <span>{exp.period}</span>
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#131B2D] border border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-[#A3AEC2] leading-relaxed mb-6">{exp.description}</p>

              {/* Responsibilities list */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Core Responsibilities &amp; Impact
                </h4>
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-[#131B2D] border border-white/5 text-xs font-mono text-sky-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
