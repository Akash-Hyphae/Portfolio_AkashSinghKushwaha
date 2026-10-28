export interface ProfileData {
  _id?: string;
  name: string;
  headline: string;
  heroTagline: string;
  summary: string;
  degree: string;
  institution: string;
  expectedGraduation: string;
  cgpa: string;
  email: string;
  phone: string;
  phonePublic: boolean;
  location: string;
  availabilityStatus: string;
  avatarUrl?: string;
  socialLinks: {
    linkedin: string;
    github: string;
    leetcode: string;
    gfg: string;
    youtube?: string;
  };
  currentlyLearning: string[];
  areasOfInterest: string[];
  personalInterests: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Programming Languages' | 'Frontend Development' | 'Backend Development' | 'Databases' | 'Core Computer Science' | 'Tools and Platforms' | 'AI and Integrations';
  icon?: string;
  featured?: boolean;
  visible?: boolean;
  order: number;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  period: string;
  clientWork: boolean;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  coverImage?: string;
  isFeatured: boolean;
  status: 'published' | 'draft';
  order: number;
  caseStudy: {
    problemStatement: string;
    objectives: string[];
    solutionOverview: string;
    technicalArchitecture: string;
    keyDecisions: string[];
    challengesAndSolutions: string;
    verifiedFeatures: string[];
    futureImprovements: string[];
    screenshots?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DSATopic {
  id: string;
  name: string;
  completed: number;
  target: number;
  status: 'Mastered' | 'Proficient' | 'In Progress' | 'Learning';
  notes?: string;
}

export interface FeaturedProblem {
  id: string;
  title: string;
  platform: 'LeetCode' | 'GeeksforGeeks' | 'CodeChef' | 'HackerRank';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  url: string;
  notes?: string;
  solutionUrl?: string;
}

export interface DSAData {
  totalSolved: number;
  leetCodeSolved: number;
  gfgSolved: number;
  lastUpdated: string;
  leetCodeUrl: string;
  gfgUrl: string;
  topics: DSATopic[];
  featuredProblems: FeaturedProblem[];
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  category: 'Sports' | 'Technical' | 'Coding' | 'Academic' | 'Award';
  date: string;
  highlights: string[];
  description: string;
  imageUrl?: string;
  visible: boolean;
  order: number;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  verificationUrl?: string;
  certificateUrl?: string;
  fileType?: 'image' | 'pdf';
  status: 'published' | 'draft';
  order: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  status: 'published' | 'draft';
  order: number;
}

export interface ResumeData {
  fileName: string;
  url: string;
  lastUpdated: string;
  version: string;
  status: 'published' | 'draft';
  fileSize?: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived?: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  heroTagline: string;
  availabilityBadge: string;
  email: string;
  phone: string;
  phonePublic: boolean;
  githubUrl: string;
  linkedinUrl: string;
  leetcodeUrl: string;
  gfgUrl: string;
  youtubeUrl?: string;
  sectionVisibility: {
    about: boolean;
    skills: boolean;
    projects: boolean;
    dsa: boolean;
    achievements: boolean;
    certifications: boolean;
    experience: boolean;
    resume: boolean;
    contact: boolean;
  };
  sectionOrder: string[];
  maintenanceMode: boolean;
  seoDescription: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  ip?: string;
}
