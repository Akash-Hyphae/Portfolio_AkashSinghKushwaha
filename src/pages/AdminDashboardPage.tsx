import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Trophy,
  Award,
  Briefcase,
  FileText,
  Mail,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Upload,
  RefreshCw,
} from 'lucide-react';
import {
  ProfileData,
  SkillItem,
  ProjectItem,
  DSAData,
  AchievementItem,
  CertificationItem,
  ExperienceItem,
  ResumeData,
  ContactMessage,
  SiteSettings,
  AdminUser,
} from '../types/portfolio';
import { api, DashboardStats } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

type TabType =
  | 'overview'
  | 'profile'
  | 'skills'
  | 'projects'
  | 'dsa'
  | 'achievements'
  | 'certifications'
  | 'experience'
  | 'resume'
  | 'inbox'
  | 'settings'
  | 'security';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, onNavigateHome }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [dsa, setDSA] = useState<DSAData | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Contact inbox filters
  const [inboxFilter, setInboxFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [inboxSearch, setInboxSearch] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        dashStats,
        profData,
        skillsData,
        projectsData,
        dsaData,
        achData,
        certData,
        expData,
        resData,
        msgsData,
        settData,
      ] = await Promise.all([
        api.getAdminDashboard(),
        api.adminGetProfile(),
        api.adminGetSkills(),
        api.adminGetProjects(),
        api.adminGetDSA(),
        api.adminGetAchievements(),
        api.adminGetCertifications(),
        api.adminGetExperiences(),
        api.adminGetResume(),
        api.adminGetContactMessages(inboxSearch, inboxFilter),
        api.adminGetSettings(),
      ]);

      setStats(dashStats);
      setProfile(profData);
      setSkills(skillsData);
      setProjects(projectsData);
      setDSA(dsaData);
      setAchievements(achData);
      setCertifications(certData);
      setExperiences(expData);
      setResume(resData);
      setMessages(msgsData);
      setSettings(settData);
    } catch (err: any) {
      showToast(err.message || 'Failed to load dashboard data. Session might be expired.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [inboxFilter]);

  const handleLogout = async () => {
    try {
      await api.logout();
      showToast('Logged out of admin dashboard.', 'info');
      onLogout();
    } catch {
      onLogout();
    }
  };

  // --- Profile Save Handler ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const updated = await api.adminUpdateProfile(profile);
      setProfile(updated);
      showToast('Profile information saved successfully!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    }
  };

  // --- Skills Handlers ---
  const handleAddSkill = async () => {
    const name = prompt('Enter new skill name:');
    if (!name || !name.trim()) return;
    const category = prompt(
      'Enter category:\n1. Programming Languages\n2. Frontend Development\n3. Backend Development\n4. Databases\n5. Core Computer Science\n6. Tools and Platforms\n7. AI and Integrations',
      'Frontend Development'
    );
    try {
      await api.adminAddSkill({
        name: name.trim(),
        category: (category?.trim() as any) || 'Frontend Development',
        featured: true,
        visible: true,
        order: skills.length + 1,
      });
      showToast(`Skill "${name}" added!`, 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleSkillVisible = async (skill: SkillItem) => {
    try {
      await api.adminUpdateSkill(skill.id, { visible: !skill.visible });
      showToast(`Skill "${skill.name}" visibility updated.`, 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteSkill = async (skill: SkillItem) => {
    if (!confirm(`Are you sure you want to delete skill "${skill.name}"?`)) return;
    try {
      await api.adminDeleteSkill(skill.id);
      showToast(`Skill "${skill.name}" deleted.`, 'info');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --- Projects Handlers ---
  const handleToggleProjectStatus = async (project: ProjectItem) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      await api.adminUpdateProject(project.id, { status: newStatus });
      showToast(`Project "${project.title}" marked as ${newStatus}.`, 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProject = async (project: ProjectItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${project.title}"?`)) return;
    try {
      await api.adminDeleteProject(project.id);
      showToast(`Project deleted successfully.`, 'info');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --- DSA Handlers ---
  const handleSaveDSA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsa) return;
    try {
      const updated = await api.adminUpdateDSA(dsa);
      setDSA(updated);
      showToast('DSA statistics and topics updated!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --- Resume Upload Handler ---
  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploaded = await api.adminUploadFile(file);
      await api.adminUpdateResume({
        fileName: file.name,
        fileSize: uploaded.size,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      });
      showToast('Resume file replaced and published successfully!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to upload resume PDF.', 'error');
    }
  };

  // --- Contact Inbox Handlers ---
  const handleToggleMessageRead = async (msg: ContactMessage) => {
    try {
      await api.adminMarkMessageRead(msg.id, !msg.read);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteMessage = async (msg: ContactMessage) => {
    if (!confirm(`Delete message from "${msg.fullName}"?`)) return;
    try {
      await api.adminDeleteMessage(msg.id);
      showToast('Message deleted.', 'info');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --- Settings Save Handler ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await api.adminUpdateSettings(settings);
      setSettings(updated);
      showToast('Site settings and section visibility saved!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --- Password Change Handler ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    try {
      await api.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully! Keep it secure.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-200 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-[#101626] border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C5CFC] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold">
            CMS
          </span>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Akash Singh Kushwaha — Admin CMS</h1>
            <span className="text-[11px] font-mono text-emerald-400">● Live Database Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#131B2D] hover:bg-[#1a253e] text-slate-200 border border-white/5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={loadDashboardData}
            aria-label="Refresh data"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#7C5CFC]' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-[#0c101d] border-r border-white/5 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-2">
              Management Modules
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview &amp; Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile &amp; Bio</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>Projects ({projects.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4" />
                <span>Skills ({skills.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('dsa')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'dsa'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>DSA &amp; LeetCode</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experience</span>
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'achievements'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'certifications'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Certifications</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume PDF</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Inbox</span>
              </div>
              {stats?.unreadMessages ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {stats.unreadMessages}
                </span>
              ) : null}
            </button>
          </div>

          {/* Bottom Settings & Security */}
          <div className="pt-4 border-t border-white/5 space-y-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'text-[#A3AEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Admin Security</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#080B14]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">System &amp; Content Dashboard</h2>
                <p className="text-xs text-[#A3AEC2] mt-1">Real-time database records and activity metrics.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
                  <div className="text-xs text-[#A3AEC2]">Published Projects</div>
                  <div className="text-2xl font-bold text-white font-mono mt-1">{stats.publishedProjects}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{stats.draftProjects} drafts in reserve</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
                  <div className="text-xs text-[#A3AEC2]">DSA Problems</div>
                  <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{stats.dsaTotal}+</div>
                  <div className="text-[11px] text-slate-500 mt-1">LeetCode &amp; GFG verified</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
                  <div className="text-xs text-[#A3AEC2]">Contact Messages</div>
                  <div className="text-2xl font-bold text-sky-400 font-mono mt-1">{stats.totalMessages}</div>
                  <div className="text-[11px] text-rose-400 mt-1 font-semibold">{stats.unreadMessages} unread</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#101626] border border-white/10">
                  <div className="text-xs text-[#A3AEC2]">Active Resume</div>
                  <div className="text-2xl font-bold text-[#7C5CFC] font-mono mt-1">{stats.resumeVersion}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Live downloadable PDF</div>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="p-6 rounded-2xl bg-[#101626] border border-white/10">
                <h3 className="text-sm font-bold text-white tracking-tight mb-4">Recent Administrative Activity</h3>
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentActivity.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-[#131B2D]/80 border border-white/5 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{log.action}:</span>
                          <span className="text-[#A3AEC2]">{log.target}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No activity logged yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && profile && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Profile &amp; Identity Editor</h2>
                  <p className="text-xs text-[#A3AEC2] mt-1">
                    Manage your public persona, education, contact details, and bio.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6 p-6 rounded-2xl bg-[#101626] border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Professional Headline</label>
                    <input
                      type="text"
                      value={profile.headline}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Degree &amp; Major</label>
                    <input
                      type="text"
                      value={profile.degree}
                      onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Institution</label>
                    <input
                      type="text"
                      value={profile.institution}
                      onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">CGPA</label>
                    <input
                      type="text"
                      value={profile.cgpa}
                      onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Availability Status</label>
                    <input
                      type="text"
                      value={profile.availabilityStatus}
                      onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={profile.summary}
                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                  />
                </div>

                {/* Social Profiles */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
                    Social Profile URLs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={profile.socialLinks.linkedin}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={profile.socialLinks.github}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, github: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">LeetCode URL</label>
                      <input
                        type="url"
                        value={profile.socialLinks.leetcode}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, leetcode: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">GeeksforGeeks URL</label>
                      <input
                        type="url"
                        value={profile.socialLinks.gfg}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, gfg: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6e4df3] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="max-w-6xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Projects Manager</h2>
                  <p className="text-xs text-[#A3AEC2] mt-1">
                    Manage project entries, draft/publish status, case studies, and ordering.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    const title = prompt('Project Title:');
                    if (!title) return;
                    const desc = prompt('Short description:');
                    if (!desc) return;
                    try {
                      await api.adminAddProject({
                        title,
                        slug: '',
                        category: 'Full-Stack Development',
                        subtitle: '',
                        description: desc,
                        period: '2026',
                        clientWork: false,
                        technologies: ['React', 'Node.js'],
                        isFeatured: false,
                        status: 'published',
                        order: projects.length + 1,
                        caseStudy: {
                          problemStatement: '',
                          objectives: [],
                          solutionOverview: '',
                          technicalArchitecture: '',
                          keyDecisions: [],
                          challengesAndSolutions: '',
                          verifiedFeatures: [],
                          futureImprovements: [],
                        },
                      });
                      showToast(`Project created!`, 'success');
                      loadDashboardData();
                    } catch (err: any) {
                      showToast(err.message, 'error');
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6c4be9] rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-[#101626] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            p.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {p.status}
                        </span>
                        <span className="text-[#38BDF8]">{p.category}</span>
                        <span>·</span>
                        <span className="text-slate-400">Order: {p.order}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                      <p className="text-xs text-[#A3AEC2] line-clamp-1">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleProjectStatus(p)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-[#131B2D] hover:bg-[#1a253e] text-slate-300 border border-white/5 transition-colors cursor-pointer"
                      >
                        {p.status === 'published' ? 'Unpublish (Draft)' : 'Publish'}
                      </button>

                      <button
                        onClick={async () => {
                          const newTitle = prompt('Edit Title:', p.title);
                          if (!newTitle) return;
                          try {
                            await api.adminUpdateProject(p.id, { title: newTitle });
                            showToast('Project updated.', 'success');
                            loadDashboardData();
                          } catch (err: any) {
                            showToast(err.message, 'error');
                          }
                        }}
                        className="p-2 rounded-lg bg-[#131B2D] hover:bg-[#1a253e] text-slate-300 hover:text-white border border-white/5 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(p)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="max-w-6xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Skills Manager</h2>
                  <p className="text-xs text-[#A3AEC2] mt-1">
                    Add, edit, reorder, or hide skills without deleting them.
                  </p>
                </div>

                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6c4be9] rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-[#101626] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{s.name}</span>
                        {s.visible === false && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#38BDF8]">{s.category}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleSkillVisible(s)}
                        className="p-1.5 text-slate-400 hover:text-white"
                        title={s.visible === false ? 'Show skill' : 'Hide skill'}
                      >
                        {s.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s)}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                        title="Delete skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DSA */}
          {activeTab === 'dsa' && dsa && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">DSA &amp; Problem Solving Manager</h2>
                <p className="text-xs text-[#A3AEC2] mt-1">
                  Update verified LeetCode &amp; GFG problem counts, last-modified dates, and study notes.
                </p>
              </div>

              <form onSubmit={handleSaveDSA} className="p-6 rounded-2xl bg-[#101626] border border-white/10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Total Solved Count</label>
                    <input
                      type="number"
                      value={dsa.totalSolved}
                      onChange={(e) => setDSA({ ...dsa, totalSolved: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">LeetCode Solved</label>
                    <input
                      type="number"
                      value={dsa.leetCodeSolved}
                      onChange={(e) => setDSA({ ...dsa, leetCodeSolved: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">GeeksforGeeks Solved</label>
                    <input
                      type="number"
                      value={dsa.gfgSolved}
                      onChange={(e) => setDSA({ ...dsa, gfgSolved: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last-Updated Label</label>
                  <input
                    type="text"
                    value={dsa.lastUpdated}
                    onChange={(e) => setDSA({ ...dsa, lastUpdated: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6c4be9] rounded-xl transition-colors cursor-pointer"
                  >
                    Save DSA Counts
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: RESUME */}
          {activeTab === 'resume' && resume && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Resume Management</h2>
                <p className="text-xs text-[#A3AEC2] mt-1">
                  Upload a replacement PDF or update version and publication date.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#101626] border border-white/10 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#131B2D]">
                  <FileText className="w-8 h-8 text-[#38BDF8]" />
                  <div>
                    <div className="text-sm font-bold text-white">{resume.fileName}</div>
                    <div className="text-xs text-slate-400">
                      Version: {resume.version} · Last Updated: {resume.lastUpdated}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Upload Replacement PDF</label>
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 hover:border-[#7C5CFC] rounded-2xl cursor-pointer bg-[#0c101d] transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-300">Choose PDF file to upload</span>
                    <span className="text-[11px] text-slate-500 mt-1">PDF format only, up to 10MB</span>
                    <input type="file" accept="application/pdf" onChange={handleResumeFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INBOX */}
          {activeTab === 'inbox' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Contact Messages Inbox</h2>
                  <p className="text-xs text-[#A3AEC2] mt-1">
                    Direct messages received from the portfolio contact form.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={inboxFilter}
                    onChange={(e) => setInboxFilter(e.target.value as any)}
                    className="px-3 py-1.5 text-xs rounded-xl bg-[#101626] border border-white/10 text-slate-300"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#101626] border border-white/5">
                  <Mail className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-[#A3AEC2]">No messages in this folder.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        !m.read
                          ? 'bg-[#131b31] border-[#7C5CFC]/40'
                          : 'bg-[#101626] border-white/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          {!m.read && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                          <span className="font-bold text-white text-sm">{m.fullName}</span>
                          <span className="text-xs text-slate-400">({m.email})</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#38BDF8] mb-2">{m.subject}</div>
                      <p className="text-xs text-[#A3AEC2] leading-relaxed whitespace-pre-line mb-4">{m.message}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                        <button
                          onClick={() => handleToggleMessageRead(m)}
                          className="text-[#7C5CFC] hover:underline cursor-pointer"
                        >
                          Mark as {m.read ? 'Unread' : 'Read'}
                        </button>

                        <div className="flex items-center gap-3">
                          <a
                            href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                            className="px-3 py-1 rounded-lg bg-[#131B2D] text-slate-200 hover:text-white"
                          >
                            Reply via Email
                          </a>
                          <button
                            onClick={() => handleDeleteMessage(m)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && settings && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Site Settings &amp; Section Visibility</h2>
                <p className="text-xs text-[#A3AEC2] mt-1">
                  Control which sections appear on the public portfolio and configure privacy toggles.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#101626] border border-white/10 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Site Title</label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hero Tagline</label>
                  <input
                    type="text"
                    value={settings.heroTagline}
                    onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8] mb-3">
                    Section Visibility Toggles
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {Object.entries(settings.sectionVisibility).map(([key, val]) => (
                      <label key={key} className="flex items-center gap-2 p-3 rounded-xl bg-[#131B2D] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              sectionVisibility: {
                                ...settings.sectionVisibility,
                                [key]: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-[#7C5CFC]"
                        />
                        <span className="capitalize text-slate-200">{key} Section</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-white">Public Phone Number Visibility</div>
                    <div className="text-[11px] text-slate-400">Toggle whether visitor can view your phone number</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.phonePublic}
                    onChange={(e) => setSettings({ ...settings, phonePublic: e.target.checked })}
                    className="rounded text-[#7C5CFC] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6c4be9] rounded-xl transition-colors cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 9: SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Admin Account Security</h2>
                <p className="text-xs text-[#A3AEC2] mt-1">Change master password for the administrative CMS.</p>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-[#101626] border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6c4be9] rounded-xl transition-colors cursor-pointer mt-2"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
