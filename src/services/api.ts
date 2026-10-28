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

export interface DashboardStats {
  publishedProjects: number;
  draftProjects: number;
  totalProjects: number;
  totalSkills: number;
  totalAchievements: number;
  totalCertifications: number;
  totalMessages: number;
  unreadMessages: number;
  dsaTotal: number;
  resumeVersion: string;
  recentActivity: Array<{ id: string; action: string; target: string; timestamp: string }>;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('akash_admin_token_cache');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    const errorMsg = data.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Public
  getProfile: async (): Promise<ProfileData> => {
    const res = await request<{ success: boolean; data: ProfileData }>('/api/public/profile');
    return res.data;
  },
  getSkills: async (): Promise<SkillItem[]> => {
    const res = await request<{ success: boolean; data: SkillItem[] }>('/api/public/skills');
    return res.data;
  },
  getProjects: async (): Promise<ProjectItem[]> => {
    const res = await request<{ success: boolean; data: ProjectItem[] }>('/api/public/projects');
    return res.data;
  },
  getProjectBySlug: async (slug: string): Promise<ProjectItem> => {
    const res = await request<{ success: boolean; data: ProjectItem }>(`/api/public/projects/${slug}`);
    return res.data;
  },
  getAchievements: async (): Promise<AchievementItem[]> => {
    const res = await request<{ success: boolean; data: AchievementItem[] }>('/api/public/achievements');
    return res.data;
  },
  getCertifications: async (): Promise<CertificationItem[]> => {
    const res = await request<{ success: boolean; data: CertificationItem[] }>('/api/public/certifications');
    return res.data;
  },
  getExperiences: async (): Promise<ExperienceItem[]> => {
    const res = await request<{ success: boolean; data: ExperienceItem[] }>('/api/public/experience');
    return res.data;
  },
  getDSA: async (): Promise<DSAData> => {
    const res = await request<{ success: boolean; data: DSAData }>('/api/public/dsa');
    return res.data;
  },
  getSettings: async (): Promise<SiteSettings> => {
    const res = await request<{ success: boolean; data: SiteSettings }>('/api/public/settings');
    return res.data;
  },
  submitContact: async (form: { fullName: string; email: string; subject: string; message: string; consent?: boolean }) => {
    return request<{ success: boolean; message: string; data?: { id: string } }>('/api/public/contact', {
      method: 'POST',
      body: JSON.stringify(form),
    });
  },

  // Auth
  login: async (email: string, password: string): Promise<{ user: AdminUser; token: string }> => {
    const res = await request<{ success: boolean; user: AdminUser; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('akash_admin_token_cache', res.token);
    }
    return res;
  },
  logout: async () => {
    localStorage.removeItem('akash_admin_token_cache');
    return request<{ success: boolean; message: string }>('/api/auth/logout', { method: 'POST' });
  },
  getMe: async (): Promise<AdminUser> => {
    const res = await request<{ success: boolean; user: AdminUser }>('/api/auth/me');
    return res.user;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    return request<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Admin Dashboard
  getAdminDashboard: async (): Promise<DashboardStats> => {
    const res = await request<{ success: boolean; data: DashboardStats }>('/api/admin/dashboard');
    return res.data;
  },

  // Admin Profile
  adminGetProfile: async (): Promise<ProfileData> => {
    const res = await request<{ success: boolean; data: ProfileData }>('/api/admin/profile');
    return res.data;
  },
  adminUpdateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    const res = await request<{ success: boolean; data: ProfileData }>('/api/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Admin Skills
  adminGetSkills: async (): Promise<SkillItem[]> => {
    const res = await request<{ success: boolean; data: SkillItem[] }>('/api/admin/skills');
    return res.data;
  },
  adminAddSkill: async (skill: Omit<SkillItem, 'id'>): Promise<SkillItem> => {
    const res = await request<{ success: boolean; data: SkillItem }>('/api/admin/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
    return res.data;
  },
  adminUpdateSkill: async (id: string, skill: Partial<SkillItem>): Promise<SkillItem> => {
    const res = await request<{ success: boolean; data: SkillItem }>(`/api/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skill),
    });
    return res.data;
  },
  adminDeleteSkill: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/skills/${id}`, { method: 'DELETE' });
  },

  // Admin Projects
  adminGetProjects: async (): Promise<ProjectItem[]> => {
    const res = await request<{ success: boolean; data: ProjectItem[] }>('/api/admin/projects');
    return res.data;
  },
  adminAddProject: async (project: Omit<ProjectItem, 'id'>): Promise<ProjectItem> => {
    const res = await request<{ success: boolean; data: ProjectItem }>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
    return res.data;
  },
  adminUpdateProject: async (id: string, project: Partial<ProjectItem>): Promise<ProjectItem> => {
    const res = await request<{ success: boolean; data: ProjectItem }>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
    return res.data;
  },
  adminDeleteProject: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/projects/${id}`, { method: 'DELETE' });
  },

  // Admin DSA
  adminGetDSA: async (): Promise<DSAData> => {
    const res = await request<{ success: boolean; data: DSAData }>('/api/admin/dsa');
    return res.data;
  },
  adminUpdateDSA: async (dsa: Partial<DSAData>): Promise<DSAData> => {
    const res = await request<{ success: boolean; data: DSAData }>('/api/admin/dsa', {
      method: 'PUT',
      body: JSON.stringify(dsa),
    });
    return res.data;
  },

  // Admin Achievements
  adminGetAchievements: async (): Promise<AchievementItem[]> => {
    const res = await request<{ success: boolean; data: AchievementItem[] }>('/api/admin/achievements');
    return res.data;
  },
  adminAddAchievement: async (item: Omit<AchievementItem, 'id'>): Promise<AchievementItem> => {
    const res = await request<{ success: boolean; data: AchievementItem }>('/api/admin/achievements', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return res.data;
  },
  adminUpdateAchievement: async (id: string, item: Partial<AchievementItem>): Promise<AchievementItem> => {
    const res = await request<{ success: boolean; data: AchievementItem }>(`/api/admin/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return res.data;
  },
  adminDeleteAchievement: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/achievements/${id}`, { method: 'DELETE' });
  },

  // Admin Certifications
  adminGetCertifications: async (): Promise<CertificationItem[]> => {
    const res = await request<{ success: boolean; data: CertificationItem[] }>('/api/admin/certifications');
    return res.data;
  },
  adminAddCertification: async (item: Omit<CertificationItem, 'id'>): Promise<CertificationItem> => {
    const res = await request<{ success: boolean; data: CertificationItem }>('/api/admin/certifications', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return res.data;
  },
  adminUpdateCertification: async (id: string, item: Partial<CertificationItem>): Promise<CertificationItem> => {
    const res = await request<{ success: boolean; data: CertificationItem }>(`/api/admin/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return res.data;
  },
  adminDeleteCertification: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/certifications/${id}`, { method: 'DELETE' });
  },

  // Admin Experience
  adminGetExperiences: async (): Promise<ExperienceItem[]> => {
    const res = await request<{ success: boolean; data: ExperienceItem[] }>('/api/admin/experience');
    return res.data;
  },
  adminAddExperience: async (item: Omit<ExperienceItem, 'id'>): Promise<ExperienceItem> => {
    const res = await request<{ success: boolean; data: ExperienceItem }>('/api/admin/experience', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return res.data;
  },
  adminUpdateExperience: async (id: string, item: Partial<ExperienceItem>): Promise<ExperienceItem> => {
    const res = await request<{ success: boolean; data: ExperienceItem }>(`/api/admin/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return res.data;
  },
  adminDeleteExperience: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/experience/${id}`, { method: 'DELETE' });
  },

  // Admin Resume
  adminGetResume: async (): Promise<ResumeData> => {
    const res = await request<{ success: boolean; data: ResumeData }>('/api/admin/resume');
    return res.data;
  },
  adminUpdateResume: async (data: Partial<ResumeData>): Promise<ResumeData> => {
    const res = await request<{ success: boolean; data: ResumeData }>('/api/admin/resume', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Admin Contact Inbox
  adminGetContactMessages: async (search?: string, filter?: 'all' | 'read' | 'unread'): Promise<ContactMessage[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);
    const res = await request<{ success: boolean; data: ContactMessage[] }>(`/api/admin/contact?${params.toString()}`);
    return res.data;
  },
  adminMarkMessageRead: async (id: string, read: boolean) => {
    return request<{ success: boolean; message: string }>(`/api/admin/contact/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    });
  },
  adminDeleteMessage: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/contact/${id}`, { method: 'DELETE' });
  },

  // Admin Settings
  adminGetSettings: async (): Promise<SiteSettings> => {
    const res = await request<{ success: boolean; data: SiteSettings }>('/api/admin/settings');
    return res.data;
  },
  adminUpdateSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const res = await request<{ success: boolean; data: SiteSettings }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return res.data;
  },

  // File Upload
  adminUploadFile: async (file: File): Promise<{ originalName: string; fileName: string; size: string; mimetype: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await request<{ success: boolean; file: any }>('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });
    return res.file;
  },
};
