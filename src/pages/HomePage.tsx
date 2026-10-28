import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { HeroSection } from '../components/hero/HeroSection';
import { AboutSection } from '../components/about/AboutSection';
import { SkillsSection } from '../components/skills/SkillsSection';
import { ProjectsSection } from '../components/projects/ProjectsSection';
import { DSASection } from '../components/dsa/DSASection';
import { ExperienceSection } from '../components/experience/ExperienceSection';
import { AchievementsSection } from '../components/achievements/AchievementsSection';
import { CertificationsSection } from '../components/certifications/CertificationsSection';
import { ResumeSection } from '../components/resume/ResumeSection';
import { ContactSection } from '../components/contact/ContactSection';
import { Footer } from '../components/footer/Footer';
import {
  ProfileData,
  SkillItem,
  ProjectItem,
  DSAData,
  AchievementItem,
  CertificationItem,
  ExperienceItem,
  ResumeData,
  SiteSettings,
} from '../types/portfolio';
import { api } from '../services/api';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface HomePageProps {
  onOpenAdminLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAdminLogin }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Database Data States
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [dsa, setDSA] = useState<DSAData | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [resume, setResume] = useState<ResumeData>({
    fileName: 'Akash_Singh_Kushwaha_Resume.pdf',
    url: '/api/public/resume/download',
    lastUpdated: 'October 2026',
    version: 'v2.4',
    status: 'published',
  });
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'Akash Singh Kushwaha | Full-Stack Developer & AI Engineer',
    heroTagline: 'Building products that solve real problems — from full-stack platforms to AI-powered applications.',
    availabilityBadge: 'Open to Internships & Opportunities',
    email: 'akashsinghkushwaha.it27@gmail.com',
    phone: '+91-6376037378',
    phonePublic: true,
    githubUrl: 'https://github.com/akashsinghkushwaha',
    linkedinUrl: 'https://linkedin.com/in/akashsinghkushwaha',
    leetcodeUrl: 'https://leetcode.com/akashsinghkushwaha',
    gfgUrl: 'https://geeksforgeeks.org/user/akashsinghkushwaha',
    sectionVisibility: {
      about: true,
      skills: true,
      projects: true,
      dsa: true,
      achievements: true,
      certifications: true,
      experience: true,
      resume: true,
      contact: true,
    },
    sectionOrder: ['about', 'skills', 'projects', 'dsa', 'experience', 'achievements', 'certifications', 'resume', 'contact'],
    maintenanceMode: false,
    seoDescription: 'Full-Stack Developer & AI Engineer',
  });

  const [activeSection, setActiveSection] = useState('hero');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        profileData,
        skillsData,
        projectsData,
        dsaData,
        achData,
        certData,
        expData,
        settData,
      ] = await Promise.all([
        api.getProfile(),
        api.getSkills(),
        api.getProjects(),
        api.getDSA(),
        api.getAchievements(),
        api.getCertifications(),
        api.getExperiences(),
        api.getSettings(),
      ]);

      setProfile(profileData);
      setSkills(skillsData);
      setProjects(projectsData);
      setDSA(dsaData);
      setAchievements(achData);
      setCertifications(certData);
      setExperiences(expData);
      setSettings(settData);
    } catch (err: any) {
      console.error('Failed to load portfolio public data:', err);
      setError(err.message || 'Unable to connect to database server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ScrollSpy for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'dsa', 'experience', 'achievements', 'certifications', 'resume', 'contact'];
      const scrollPos = window.scrollY + 140;

      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#38BDF8] flex items-center justify-center text-white font-bold text-sm animate-pulse">
            AK
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#A3AEC2]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7C5CFC]" />
            <span>Connecting to database...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile || !dsa) {
    return (
      <div className="min-h-screen bg-[#080B14] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 max-w-md">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
          <h2 className="text-base font-bold mb-1">Server Connection Notice</h2>
          <p className="text-xs text-slate-300 mb-4">{error || 'Could not load data.'}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7C5CFC] hover:bg-[#6e4ef4] text-white cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const vis = settings.sectionVisibility || {
    about: true,
    skills: true,
    projects: true,
    dsa: true,
    achievements: true,
    certifications: true,
    experience: true,
    resume: true,
    contact: true,
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC]">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenResume={() => scrollToSection('resume')}
      />

      {/* Hero Section */}
      <HeroSection
        profile={profile}
        dsa={dsa}
        onExploreWork={() => scrollToSection('projects')}
        onDownloadResume={() => scrollToSection('resume')}
        onContactMe={() => scrollToSection('contact')}
      />

      {/* Sections controlled by Settings Visibility */}
      {vis.about && <AboutSection profile={profile} />}
      {vis.skills && <SkillsSection skills={skills} />}
      {vis.projects && <ProjectsSection projects={projects} />}
      {vis.dsa && <DSASection dsa={dsa} />}
      {vis.experience && <ExperienceSection experiences={experiences} />}
      {vis.achievements && <AchievementsSection achievements={achievements} />}
      {vis.certifications && <CertificationsSection certifications={certifications} />}
      {vis.resume && <ResumeSection resume={resume} />}
      {vis.contact && <ContactSection profile={profile} settings={settings} />}

      {/* Footer */}
      <Footer
        profile={profile}
        onOpenAdminLogin={onOpenAdminLogin}
        onScrollToTop={() => scrollToSection('hero')}
      />
    </div>
  );
};
