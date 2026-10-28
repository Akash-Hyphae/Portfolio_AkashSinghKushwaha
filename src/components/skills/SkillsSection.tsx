import React, { useState } from 'react';
import {
  Code,
  Layers,
  Server,
  Database,
  Cpu,
  Wrench,
  Sparkles,
  Check,
} from 'lucide-react';
import { SkillItem } from '../../types/portfolio';

interface SkillsSectionProps {
  skills: SkillItem[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const categories = [
    'All Categories',
    'Programming Languages',
    'Frontend Development',
    'Backend Development',
    'Databases',
    'Core Computer Science',
    'Tools and Platforms',
    'AI and Integrations',
  ] as const;

  const [activeCategory, setActiveCategory] = useState<string>('All Categories');

  const filteredSkills =
    activeCategory === 'All Categories'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Programming Languages':
        return <Code className="w-4 h-4 text-sky-400" />;
      case 'Frontend Development':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'Backend Development':
        return <Server className="w-4 h-4 text-emerald-400" />;
      case 'Databases':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'Core Computer Science':
        return <Cpu className="w-4 h-4 text-rose-400" />;
      case 'Tools and Platforms':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'AI and Integrations':
        return <Sparkles className="w-4 h-4 text-teal-400" />;
      default:
        return <Code className="w-4 h-4 text-[#7C5CFC]" />;
    }
  };

  // Group by category when 'All Categories' is selected
  const categoryGroups = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-[#7C5CFC] font-semibold mb-2">
            Technical Arsenal
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Skills &amp; Technologies</h2>
          <p className="text-sm text-[#A3AEC2] mt-2 max-w-2xl">
            A practical, battle-tested stack deployed across commercial client projects, competitive gaming systems,
            and AI mentorship architectures.
          </p>
        </div>

        {/* Interactive Category Filter Tabs (Single-line, functional buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'bg-[#101626] text-[#A3AEC2] hover:text-white hover:bg-[#151d33] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeCategory === 'All Categories' ? (
          /* Grouped Category View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryGroups.map((group) => {
              const groupSkills = skills.filter((s) => s.category === group);
              return (
                <div
                  key={group}
                  className="p-5 rounded-2xl bg-[#101626] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="p-2 rounded-lg bg-[#131B2D] border border-white/5">
                        {getCategoryIcon(group)}
                      </div>
                      <h3 className="text-sm font-semibold text-white tracking-tight">{group}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {groupSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="px-3 py-2 rounded-lg bg-[#131B2D]/80 border border-white/5 text-xs text-slate-200 flex items-center justify-between"
                        >
                          <span className="truncate">{skill.name}</span>
                          {skill.featured && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] shrink-0 ml-1.5" title="Core skill" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Filtered View */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-[#101626] border border-white/10 hover:border-[#7C5CFC]/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-2 h-2 rounded-full bg-[#7C5CFC] shrink-0" />
                  <span className="text-xs font-medium text-slate-200 truncate">{skill.name}</span>
                </div>
                {skill.featured && (
                  <span className="text-[10px] text-purple-400 font-mono tracking-tight shrink-0">CORE</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
