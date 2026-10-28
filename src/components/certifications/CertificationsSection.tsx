import React from 'react';
import { Award, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CertificationItem } from '../../types/portfolio';

interface CertificationsSectionProps {
  certifications: CertificationItem[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  return (
    <section id="certifications" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
            Verified Credentials
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Certifications</h2>
          <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
            Accredited certifications validating core programming languages and software engineering foundations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-[#101626] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#7C5CFC]">
                    <Award className="w-6 h-6" />
                  </div>
                  {cert.issueDate && (
                    <span className="text-xs font-mono text-slate-400">{cert.issueDate}</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white tracking-tight mb-1">{cert.title}</h3>
                <div className="text-xs text-[#38BDF8] font-medium mb-4">{cert.issuer}</div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Completion</span>
                </div>
              </div>

              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-center rounded-xl bg-[#131B2D] hover:bg-[#1a253e] text-slate-200 hover:text-white border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Verify Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8]" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
