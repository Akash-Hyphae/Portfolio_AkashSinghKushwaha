import React from 'react';
import { FileText, Download, ExternalLink, Calendar, CheckCircle2, Shield } from 'lucide-react';
import { ResumeData } from '../../types/portfolio';

interface ResumeSectionProps {
  resume: ResumeData;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ resume }) => {
  const downloadUrl = '/api/public/resume/download';

  return (
    <section id="resume" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
            Curriculum Vitae
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Professional Resume</h2>
          <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
            Detailed breakdown of technical education, MERN stack deliverables, Java algorithms, and collegiate
            achievements.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-[#101626] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Summary Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30">
                  Version {resume.version || 'v2.4'}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Updated {resume.lastUpdated || 'October 2026'}
                </span>
                {resume.fileSize && (
                  <span className="text-slate-500">· {resume.fileSize}</span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Akash Singh Kushwaha — Full-Stack Resume
              </h3>

              <p className="text-xs sm:text-sm text-[#A3AEC2] leading-relaxed max-w-2xl">
                Contains verified documentation of MERN client work for Handloom House, Play4Glory esports platform,
                Pathlytic AI career roadmap engine, B.Tech IT coursework (CGPA 8.13), and 400+ algorithmic solutions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href={downloadUrl}
                  download={resume.fileName || 'Akash_Singh_Kushwaha_Resume.pdf'}
                  className="px-6 py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFC] to-[#5b36ea] hover:from-[#8b6cfd] hover:to-[#6a43f7] rounded-xl shadow-lg shadow-[#7C5CFC]/25 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </a>

                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-[#131B2D] hover:bg-[#1a253e] border border-white/10 rounded-xl transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Browser</span>
                </a>
              </div>
            </div>

            {/* Right: Resume Document Preview Card */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/10 shadow-inner flex flex-col items-center text-center">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#7C5CFC]/20 to-[#38BDF8]/20 border border-white/10 text-white mb-4">
                  <FileText className="w-12 h-12 text-[#38BDF8]" />
                </div>
                <div className="font-mono text-xs text-white font-semibold">{resume.fileName}</div>
                <div className="text-[11px] text-slate-400 mt-1">Verified Single-Page Technical CV</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-3 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Direct Download Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
