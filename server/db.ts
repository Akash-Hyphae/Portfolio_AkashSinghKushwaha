import fs from 'fs';
import path from 'path';
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
  AdminActivityLog,
} from '../src/types/portfolio';
import { getInitialSeedData } from './seed';

export interface DatabaseSchema {
  adminUsers: AdminUser[];
  profile: ProfileData;
  skills: SkillItem[];
  projects: ProjectItem[];
  dsa: DSAData;
  achievements: AchievementItem[];
  certifications: CertificationItem[];
  experiences: ExperienceItem[];
  resume: ResumeData;
  contactMessages: ContactMessage[];
  settings: SiteSettings;
  adminActivityLogs: AdminActivityLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'portfolio-db.json');

class DatabaseService {
  private data: DatabaseSchema;
  private isInitialized = false;

  constructor() {
    this.ensureDirectoryExists();
    this.data = this.loadDatabase();
    this.initializeSeedIfNeeded();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (err) {
      console.error('[DB] Failed to parse existing database file, preparing recovery:', err);
    }

    const initial = getInitialSeedData();
    return {
      ...initial,
      contactMessages: [],
      adminActivityLogs: [
        {
          id: 'log_init',
          action: 'Database Initialized',
          target: 'System',
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  private initializeSeedIfNeeded() {
    if (this.isInitialized) return;

    let hasChanges = false;
    const initial = getInitialSeedData();

    if (!this.data.profile || !this.data.profile.name) {
      this.data.profile = initial.profile;
      hasChanges = true;
    }
    if (!this.data.adminUsers || this.data.adminUsers.length === 0) {
      this.data.adminUsers = initial.adminUsers;
      hasChanges = true;
    }
    if (!this.data.skills || this.data.skills.length === 0) {
      this.data.skills = initial.skills;
      hasChanges = true;
    }
    if (!this.data.projects || this.data.projects.length === 0) {
      this.data.projects = initial.projects;
      hasChanges = true;
    }
    if (!this.data.dsa || !this.data.dsa.topics) {
      this.data.dsa = initial.dsa;
      hasChanges = true;
    }
    if (!this.data.achievements || this.data.achievements.length === 0) {
      this.data.achievements = initial.achievements;
      hasChanges = true;
    }
    if (!this.data.certifications || this.data.certifications.length === 0) {
      this.data.certifications = initial.certifications;
      hasChanges = true;
    }
    if (!this.data.experiences || this.data.experiences.length === 0) {
      this.data.experiences = initial.experiences;
      hasChanges = true;
    }
    if (!this.data.resume || !this.data.resume.fileName) {
      this.data.resume = initial.resume;
      hasChanges = true;
    }
    if (!this.data.settings || !this.data.settings.siteTitle) {
      this.data.settings = initial.settings;
      hasChanges = true;
    }
    if (!this.data.contactMessages) {
      this.data.contactMessages = [];
      hasChanges = true;
    }
    if (!this.data.adminActivityLogs) {
      this.data.adminActivityLogs = [];
      hasChanges = true;
    }

    if (hasChanges || !fs.existsSync(DB_FILE)) {
      this.saveDatabase();
    }
    this.isInitialized = true;
  }

  public saveDatabase() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[DB] Failed to save database file:', err);
    }
  }

  // Activity Logging
  public logActivity(action: string, target: string, ip?: string) {
    const entry: AdminActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      target,
      timestamp: new Date().toISOString(),
      ip,
    };
    this.data.adminActivityLogs.unshift(entry);
    if (this.data.adminActivityLogs.length > 50) {
      this.data.adminActivityLogs = this.data.adminActivityLogs.slice(0, 50);
    }
    this.saveDatabase();
    return entry;
  }

  // Profile
  public getProfile(): ProfileData {
    return this.data.profile;
  }

  public updateProfile(updates: Partial<ProfileData>): ProfileData {
    this.data.profile = {
      ...this.data.profile,
      ...updates,
      socialLinks: {
        ...this.data.profile.socialLinks,
        ...(updates.socialLinks || {}),
      },
    };
    this.saveDatabase();
    return this.data.profile;
  }

  // Skills
  public getSkills(all = false): SkillItem[] {
    const list = this.data.skills || [];
    const filtered = all ? list : list.filter((s) => s.visible !== false);
    return [...filtered].sort((a, b) => a.order - b.order);
  }

  public addSkill(skill: Omit<SkillItem, 'id'>): SkillItem {
    const newSkill: SkillItem = {
      ...skill,
      id: `sk_${Date.now()}`,
      order: skill.order || this.data.skills.length + 1,
      visible: skill.visible !== false,
    };
    this.data.skills.push(newSkill);
    this.saveDatabase();
    return newSkill;
  }

  public updateSkill(id: string, updates: Partial<SkillItem>): SkillItem | null {
    const idx = this.data.skills.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.skills[idx] = { ...this.data.skills[idx], ...updates };
    this.saveDatabase();
    return this.data.skills[idx];
  }

  public deleteSkill(id: string): boolean {
    const initialLen = this.data.skills.length;
    this.data.skills = this.data.skills.filter((s) => s.id !== id);
    if (this.data.skills.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Projects
  public getProjects(all = false): ProjectItem[] {
    const list = this.data.projects || [];
    const filtered = all ? list : list.filter((p) => p.status === 'published');
    return [...filtered].sort((a, b) => a.order - b.order);
  }

  public getProjectBySlug(slug: string, includeDraft = false): ProjectItem | null {
    const project = this.data.projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (!project) return null;
    if (!includeDraft && project.status !== 'published') return null;
    return project;
  }

  public addProject(item: Omit<ProjectItem, 'id'>): ProjectItem {
    // Generate unique slug
    let baseSlug = item.slug
      ? item.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : item.title.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    baseSlug = baseSlug.replace(/-+/g, '-').replace(/^-|-$/g, '') || 'project';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (this.data.projects.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const newProject: ProjectItem = {
      ...item,
      id: `proj_${Date.now()}`,
      slug: uniqueSlug,
      order: item.order || this.data.projects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.projects.push(newProject);
    this.saveDatabase();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    if (updates.slug && updates.slug !== this.data.projects[idx].slug) {
      let slugCandidate = updates.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      const conflict = this.data.projects.find((p) => p.id !== id && p.slug === slugCandidate);
      if (conflict) {
        slugCandidate = `${slugCandidate}-${Date.now().toString().slice(-4)}`;
      }
      updates.slug = slugCandidate;
    }

    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveDatabase();
    return this.data.projects[idx];
  }

  public deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // DSA
  public getDSA(): DSAData {
    return this.data.dsa;
  }

  public updateDSA(updates: Partial<DSAData>): DSAData {
    this.data.dsa = {
      ...this.data.dsa,
      ...updates,
      topics: updates.topics || this.data.dsa.topics,
      featuredProblems: updates.featuredProblems || this.data.dsa.featuredProblems,
    };
    this.saveDatabase();
    return this.data.dsa;
  }

  // Achievements
  public getAchievements(all = false): AchievementItem[] {
    const list = this.data.achievements || [];
    const filtered = all ? list : list.filter((a) => a.visible !== false);
    return [...filtered].sort((a, b) => a.order - b.order);
  }

  public addAchievement(item: Omit<AchievementItem, 'id'>): AchievementItem {
    const newItem: AchievementItem = {
      ...item,
      id: `ach_${Date.now()}`,
      order: item.order || this.data.achievements.length + 1,
      visible: item.visible !== false,
    };
    this.data.achievements.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  public updateAchievement(id: string, updates: Partial<AchievementItem>): AchievementItem | null {
    const idx = this.data.achievements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.achievements[idx] = { ...this.data.achievements[idx], ...updates };
    this.saveDatabase();
    return this.data.achievements[idx];
  }

  public deleteAchievement(id: string): boolean {
    const initialLen = this.data.achievements.length;
    this.data.achievements = this.data.achievements.filter((a) => a.id !== id);
    if (this.data.achievements.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Certifications
  public getCertifications(all = false): CertificationItem[] {
    const list = this.data.certifications || [];
    const filtered = all ? list : list.filter((c) => c.status === 'published');
    return [...filtered].sort((a, b) => a.order - b.order);
  }

  public addCertification(item: Omit<CertificationItem, 'id'>): CertificationItem {
    const newItem: CertificationItem = {
      ...item,
      id: `cert_${Date.now()}`,
      order: item.order || this.data.certifications.length + 1,
    };
    this.data.certifications.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  public updateCertification(id: string, updates: Partial<CertificationItem>): CertificationItem | null {
    const idx = this.data.certifications.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.certifications[idx] = { ...this.data.certifications[idx], ...updates };
    this.saveDatabase();
    return this.data.certifications[idx];
  }

  public deleteCertification(id: string): boolean {
    const initialLen = this.data.certifications.length;
    this.data.certifications = this.data.certifications.filter((c) => c.id !== id);
    if (this.data.certifications.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Experience
  public getExperiences(all = false): ExperienceItem[] {
    const list = this.data.experiences || [];
    const filtered = all ? list : list.filter((e) => e.status === 'published');
    return [...filtered].sort((a, b) => a.order - b.order);
  }

  public addExperience(item: Omit<ExperienceItem, 'id'>): ExperienceItem {
    const newItem: ExperienceItem = {
      ...item,
      id: `exp_${Date.now()}`,
      order: item.order || this.data.experiences.length + 1,
    };
    this.data.experiences.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  public updateExperience(id: string, updates: Partial<ExperienceItem>): ExperienceItem | null {
    const idx = this.data.experiences.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.data.experiences[idx] = { ...this.data.experiences[idx], ...updates };
    this.saveDatabase();
    return this.data.experiences[idx];
  }

  public deleteExperience(id: string): boolean {
    const initialLen = this.data.experiences.length;
    this.data.experiences = this.data.experiences.filter((e) => e.id !== id);
    if (this.data.experiences.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Resume
  public getResume(): ResumeData {
    return this.data.resume;
  }

  public updateResume(updates: Partial<ResumeData>): ResumeData {
    this.data.resume = { ...this.data.resume, ...updates };
    this.saveDatabase();
    return this.data.resume;
  }

  // Settings
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      sectionVisibility: {
        ...this.data.settings.sectionVisibility,
        ...(updates.sectionVisibility || {}),
      },
    };
    this.saveDatabase();
    return this.data.settings;
  }

  // Contact Messages
  public getContactMessages(search?: string, filterRead?: 'all' | 'read' | 'unread'): ContactMessage[] {
    let list = this.data.contactMessages || [];
    if (filterRead === 'read') {
      list = list.filter((m) => m.read);
    } else if (filterRead === 'unread') {
      list = list.filter((m) => !m.read);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
    const newMessage: ContactMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    if (!this.data.contactMessages) this.data.contactMessages = [];
    this.data.contactMessages.unshift(newMessage);
    this.saveDatabase();
    return newMessage;
  }

  public markContactMessageRead(id: string, read: boolean): boolean {
    const msg = this.data.contactMessages.find((m) => m.id === id);
    if (!msg) return false;
    msg.read = read;
    this.saveDatabase();
    return true;
  }

  public deleteContactMessage(id: string): boolean {
    const initialLen = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter((m) => m.id !== id);
    if (this.data.contactMessages.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Admin Users
  public getAdminByEmail(email: string): AdminUser | null {
    return this.data.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public getAdminById(id: string): AdminUser | null {
    return this.data.adminUsers.find((u) => u.id === id) || null;
  }

  public updateAdminPassword(id: string, newPasswordHash: string): boolean {
    const admin = this.data.adminUsers.find((u) => u.id === id);
    if (!admin) return false;
    admin.passwordHash = newPasswordHash;
    this.saveDatabase();
    return true;
  }

  public updateAdminLastLogin(id: string): void {
    const admin = this.data.adminUsers.find((u) => u.id === id);
    if (admin) {
      admin.lastLogin = new Date().toISOString();
      this.saveDatabase();
    }
  }

  // Stats for Admin Dashboard
  public getDashboardStats() {
    const totalProjects = this.data.projects.length;
    const publishedProjects = this.data.projects.filter((p) => p.status === 'published').length;
    const draftProjects = totalProjects - publishedProjects;
    const totalSkills = this.data.skills.length;
    const totalAchievements = this.data.achievements.length;
    const totalCertifications = this.data.certifications.length;
    const totalMessages = (this.data.contactMessages || []).length;
    const unreadMessages = (this.data.contactMessages || []).filter((m) => !m.read).length;
    const dsaTotal = this.data.dsa.totalSolved;

    return {
      publishedProjects,
      draftProjects,
      totalProjects,
      totalSkills,
      totalAchievements,
      totalCertifications,
      totalMessages,
      unreadMessages,
      dsaTotal,
      resumeVersion: this.data.resume.version,
      recentActivity: (this.data.adminActivityLogs || []).slice(0, 8),
    };
  }
}

export const db = new DatabaseService();
