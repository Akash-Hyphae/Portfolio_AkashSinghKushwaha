import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Send,
  Linkedin,
  Github,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { ProfileData, SiteSettings } from '../../types/portfolio';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface ContactSectionProps {
  profile: ProfileData;
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, settings }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (formData.message.trim().length < 10) {
      setErrorMessage('Message must contain at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContact(formData);
      setSubmitted(true);
      showToast(res.message || 'Message sent successfully!', 'success');
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
        consent: true,
      });
    } catch (err: any) {
      const msg = err.message || 'Failed to deliver message. Please try again or email directly.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
            Get In Touch
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Let's Connect</h2>
          <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
            Interested in full-stack engineering, AI product collaboration, or discussing algorithmic problems? Drop me
            a direct note.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Channels & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#101626] border border-white/10 space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Direct Communication</h3>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#A3AEC2]">Personal Email</div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm font-semibold text-white hover:text-[#38BDF8] transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              {/* Phone (configurable visibility) */}
              {(settings.phonePublic ?? true) && profile.phone && (
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#A3AEC2]">Mobile / WhatsApp</div>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors font-mono"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="text-xs text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>Location:</span>
                <span className="text-slate-200">{profile.location || 'Jaipur, Rajasthan, India'}</span>
              </div>
            </div>

            {/* Social Links Cards */}
            <div className="p-6 rounded-2xl bg-[#101626] border border-white/10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Profiles &amp; Code</h3>
              <div className="grid grid-cols-2 gap-3">
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3 rounded-xl bg-[#131B2D] hover:bg-[#1a253e] border border-white/5 transition-colors flex items-center gap-2.5 text-xs text-slate-200"
                  >
                    <Linkedin className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3 rounded-xl bg-[#131B2D] hover:bg-[#1a253e] border border-white/5 transition-colors flex items-center gap-2.5 text-xs text-slate-200"
                  >
                    <Github className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>GitHub</span>
                  </a>
                )}

                {profile.socialLinks.leetcode && (
                  <a
                    href={profile.socialLinks.leetcode}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3 rounded-xl bg-[#131B2D] hover:bg-[#1a253e] border border-white/5 transition-colors flex items-center gap-2.5 text-xs text-slate-200"
                  >
                    <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      LC
                    </span>
                    <span>LeetCode</span>
                  </a>
                )}

                {profile.socialLinks.gfg && (
                  <a
                    href={profile.socialLinks.gfg}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3 rounded-xl bg-[#131B2D] hover:bg-[#1a253e] border border-white/5 transition-colors flex items-center gap-2.5 text-xs text-slate-200"
                  >
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      GFG
                    </span>
                    <span>GeeksforGeeks</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#101626] border border-white/10 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1">Send a Message</h3>
              <p className="text-xs text-[#A3AEC2] mb-6">
                Your submission is validated and saved directly to the database.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold">Message delivered!</span> Thank you for reaching out. Akash will
                    respond to your email address shortly.
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Subject <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Role / Project Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your inquiry, project scope, or opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="rounded bg-[#131B2D] border-white/20 text-[#7C5CFC] focus:ring-0"
                  />
                  <label htmlFor="consent" className="text-[11px] text-slate-400 select-none">
                    I consent to having this form submit my details directly to Akash Singh Kushwaha's portfolio inbox.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-6 text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFC] to-[#5b36ea] hover:from-[#8b6cfd] hover:to-[#6a43f7] rounded-xl shadow-lg shadow-[#7C5CFC]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
