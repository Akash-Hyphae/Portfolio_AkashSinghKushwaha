import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  FileCode,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  UserCheck,
  ShoppingBag,
  Gamepad2,
  BrainCircuit,
  FolderGit2,
} from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';
import { CaseStudyModal } from './CaseStudyModal';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'oldest'>('featured');

  const categories = ['All', 'Full-Stack Development', 'Gaming', 'Artificial Intelligence'];

  // Filtering and Sorting
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.order - b.order;
    }
    if (sortBy === 'newest') {
      return (b.order || 0) - (a.order || 0);
    }
    return (a.order || 0) - (b.order || 0);
  });

  const getProjectGraphic = (slug: string, title: string) => {
    if (slug.includes('handloom')) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-[#1a1c2e] via-[#131b2d] to-[#0d1220] flex flex-col items-center justify-center p-6 border-b border-white/5 relative overflow-hidden group-hover:scale-102 transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent opacity-80" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-amber-300">Client E-Commerce · 100+ Catalog</span>
            <span className="text-xs text-slate-400 mt-1">Razorpay HMAC-SHA256 · 15+ REST APIs</span>
          </div>
        </div>
      );
    }
    if (slug.includes('play4glory')) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-[#1c1836] via-[#14162e] to-[#0c0e1e] flex flex-col items-center justify-center p-6 border-b border-white/5 relative overflow-hidden group-hover:scale-102 transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent opacity-80" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-3.5 rounded-2xl bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-[#7C5CFC] mb-2">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-[#7C5CFC]">64-Team Knockout Generator</span>
            <span className="text-xs text-slate-400 mt-1">Recursive Trees · In-App Digital Wallet</span>
          </div>
        </div>
      );
    }
    if (slug.includes('pathlytic')) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-[#102334] via-[#0f1d2e] to-[#0a1420] flex flex-col items-center justify-center p-6 border-b border-white/5 relative overflow-hidden group-hover:scale-102 transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent opacity-80" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-3.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 mb-2">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-sky-300">Gemini Schema Mentorship</span>
            <span className="text-xs text-slate-400 mt-1">Adaptive Curriculum · Power BI Analytics</span>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-48 bg-gradient-to-br from-[#131B2D] to-[#0c111e] flex flex-col items-center justify-center p-6 border-b border-white/5 relative overflow-hidden">
        <FolderGit2 className="w-8 h-8 text-[#7C5CFC] mb-2" />
        <span className="text-xs font-mono text-slate-300">{title}</span>
      </div>
    );
  };

  return (
    <section id="projects" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
              Production Software &amp; Architectures
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Projects</h2>
            <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
              Real-world, database-backed applications with full case studies, technical architecture decisions, and
              verified deliverables.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#101626] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#101626] border border-white/10 text-slate-300 focus:outline-none focus:border-[#7C5CFC]"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest</option>
              <option value="oldest">Chronological</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'bg-[#101626] text-[#A3AEC2] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {sorted.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#101626] border border-white/5">
            <p className="text-sm text-[#A3AEC2]">No projects match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs text-[#7C5CFC] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl bg-[#101626] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div>
                  {/* Visual Banner */}
                  {project.coverImage ? (
                    <div className="w-full h-48 overflow-hidden border-b border-white/5 bg-[#131B2D]">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Hide broken img if file missing
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    getProjectGraphic(project.slug, project.title)
                  )}

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Metadata Header */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span className="text-[#38BDF8] font-medium">{project.category}</span>
                      <span>·</span>
                      <span>{project.period}</span>
                      {project.clientWork && (
                        <>
                          <span>·</span>
                          <span className="text-amber-400 flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> Client
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[#A3AEC2] leading-relaxed mt-2 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.technologies.slice(0, 5).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#131B2D] border border-white/5 text-[11px] font-mono text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-1.5 py-0.5 text-[11px] font-mono text-slate-400">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 border-t border-white/5 mt-4">
                  <div className="flex items-center justify-between gap-2 pt-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-[#7C5CFC] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Case Study</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="GitHub Repository"
                          className="p-2 rounded-lg bg-[#131B2D] hover:bg-[#1b253e] text-slate-300 hover:text-white border border-white/5 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="Live Demo"
                          className="p-2 rounded-lg bg-[#131B2D] hover:bg-[#1b253e] text-[#38BDF8] hover:text-white border border-white/5 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};
