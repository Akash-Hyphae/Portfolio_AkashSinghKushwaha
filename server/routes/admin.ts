import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest } from '../auth';

const router = Router();

// Protect ALL admin routes
router.use(requireAdmin);

// Setup multer for file uploads
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, SVG, and PDF files are allowed.'));
    }
  },
});

// GET /api/admin/dashboard
router.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getDashboardStats();
  return res.json({ success: true, data: stats });
});

// GET /api/admin/logs
router.get('/logs', (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getDashboardStats();
  return res.json({ success: true, data: stats.recentActivity });
});

// --- PROFILE ---
router.get('/profile', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getProfile() });
});

router.put('/profile', (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateProfile(req.body);
  db.logActivity('Updated Profile', 'Personal Information & Bio', req.ip);
  return res.json({ success: true, data: updated });
});

// --- SKILLS ---
router.get('/skills', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getSkills(true) });
});

router.post('/skills', (req: AuthenticatedRequest, res: Response) => {
  const { name, category, featured, visible, order, icon } = req.body;
  if (!name || !category) {
    return res.status(400).json({ success: false, error: 'Skill name and category are required.' });
  }
  const created = db.addSkill({ name, category, featured: !!featured, visible: visible !== false, order: order || 0, icon });
  db.logActivity('Added Skill', name, req.ip);
  return res.status(201).json({ success: true, data: created });
});

router.put('/skills/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateSkill(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Skill not found.' });
  }
  db.logActivity('Updated Skill', updated.name, req.ip);
  return res.json({ success: true, data: updated });
});

router.delete('/skills/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteSkill(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Skill not found.' });
  }
  db.logActivity('Deleted Skill', `ID: ${id}`, req.ip);
  return res.json({ success: true, message: 'Skill deleted successfully.' });
});

// --- PROJECTS ---
router.get('/projects', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getProjects(true) });
});

router.post('/projects', (req: AuthenticatedRequest, res: Response) => {
  const { title, category, description, subtitle, period, clientWork, technologies, liveUrl, githubUrl, isFeatured, status, caseStudy, coverImage } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Project title and description are required.' });
  }
  const created = db.addProject({
    title,
    slug: req.body.slug || '',
    category: category || 'Full-Stack Development',
    subtitle: subtitle || '',
    description,
    period: period || 'Present',
    clientWork: !!clientWork,
    technologies: Array.isArray(technologies) ? technologies : ['React', 'Node.js'],
    liveUrl: liveUrl || '',
    githubUrl: githubUrl || '',
    coverImage: coverImage || '',
    isFeatured: !!isFeatured,
    status: status === 'draft' ? 'draft' : 'published',
    order: req.body.order || 0,
    caseStudy: caseStudy || {
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
  db.logActivity('Created Project', created.title, req.ip);
  return res.status(201).json({ success: true, data: created });
});

router.put('/projects/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateProject(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }
  db.logActivity('Updated Project', updated.title, req.ip);
  return res.json({ success: true, data: updated });
});

router.delete('/projects/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteProject(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }
  db.logActivity('Deleted Project', `ID: ${id}`, req.ip);
  return res.json({ success: true, message: 'Project deleted successfully.' });
});

// --- DSA ---
router.get('/dsa', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getDSA() });
});

router.put('/dsa', (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateDSA(req.body);
  db.logActivity('Updated DSA Metrics', `${updated.totalSolved} problems`, req.ip);
  return res.json({ success: true, data: updated });
});

// --- ACHIEVEMENTS ---
router.get('/achievements', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getAchievements(true) });
});

router.post('/achievements', (req: AuthenticatedRequest, res: Response) => {
  const { title, organization, category, date, highlights, description, imageUrl, visible, order } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description are required.' });
  }
  const created = db.addAchievement({
    title,
    organization: organization || '',
    category: category || 'Sports',
    date: date || '',
    highlights: Array.isArray(highlights) ? highlights : [],
    description,
    imageUrl: imageUrl || '',
    visible: visible !== false,
    order: order || 0,
  });
  db.logActivity('Created Achievement', created.title, req.ip);
  return res.status(201).json({ success: true, data: created });
});

router.put('/achievements/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateAchievement(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Achievement not found.' });
  }
  db.logActivity('Updated Achievement', updated.title, req.ip);
  return res.json({ success: true, data: updated });
});

router.delete('/achievements/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteAchievement(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Achievement not found.' });
  }
  db.logActivity('Deleted Achievement', `ID: ${id}`, req.ip);
  return res.json({ success: true, message: 'Achievement deleted successfully.' });
});

// --- CERTIFICATIONS ---
router.get('/certifications', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getCertifications(true) });
});

router.post('/certifications', (req: AuthenticatedRequest, res: Response) => {
  const { title, issuer, issueDate, verificationUrl, certificateUrl, fileType, status, order } = req.body;
  if (!title || !issuer) {
    return res.status(400).json({ success: false, error: 'Title and issuer are required.' });
  }
  const created = db.addCertification({
    title,
    issuer,
    issueDate: issueDate || '',
    verificationUrl: verificationUrl || '',
    certificateUrl: certificateUrl || '',
    fileType: fileType || 'image',
    status: status === 'draft' ? 'draft' : 'published',
    order: order || 0,
  });
  db.logActivity('Created Certification', created.title, req.ip);
  return res.status(201).json({ success: true, data: created });
});

router.put('/certifications/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateCertification(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Certification not found.' });
  }
  db.logActivity('Updated Certification', updated.title, req.ip);
  return res.json({ success: true, data: updated });
});

router.delete('/certifications/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteCertification(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Certification not found.' });
  }
  db.logActivity('Deleted Certification', `ID: ${id}`, req.ip);
  return res.json({ success: true, message: 'Certification deleted successfully.' });
});

// --- EXPERIENCE ---
router.get('/experience', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getExperiences(true) });
});

router.post('/experience', (req: AuthenticatedRequest, res: Response) => {
  const { role, company, employmentType, period, location, description, responsibilities, technologies, status, order } = req.body;
  if (!role || !company) {
    return res.status(400).json({ success: false, error: 'Role and company are required.' });
  }
  const created = db.addExperience({
    role,
    company,
    employmentType: employmentType || 'Full-time',
    period: period || '',
    location: location || '',
    description: description || '',
    responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
    technologies: Array.isArray(technologies) ? technologies : [],
    status: status === 'draft' ? 'draft' : 'published',
    order: order || 0,
  });
  db.logActivity('Created Experience', `${created.role} @ ${created.company}`, req.ip);
  return res.status(201).json({ success: true, data: created });
});

router.put('/experience/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateExperience(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Experience not found.' });
  }
  db.logActivity('Updated Experience', `${updated.role} @ ${updated.company}`, req.ip);
  return res.json({ success: true, data: updated });
});

router.delete('/experience/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteExperience(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Experience not found.' });
  }
  db.logActivity('Deleted Experience', `ID: ${id}`, req.ip);
  return res.json({ success: true, message: 'Experience deleted successfully.' });
});

// --- RESUME ---
router.get('/resume', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getResume() });
});

router.put('/resume', (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateResume(req.body);
  db.logActivity('Updated Resume Metadata', `Version: ${updated.version}`, req.ip);
  return res.json({ success: true, data: updated });
});

// --- CONTACT INBOX ---
router.get('/contact', (req: AuthenticatedRequest, res: Response) => {
  const search = req.query.search as string | undefined;
  const filter = (req.query.filter as 'all' | 'read' | 'unread') || 'all';
  const messages = db.getContactMessages(search, filter);
  return res.json({ success: true, data: messages });
});

router.patch('/contact/:id/read', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { read } = req.body;
  const success = db.markContactMessageRead(id, read !== false);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Message not found.' });
  }
  return res.json({ success: true, message: `Message marked as ${read ? 'read' : 'unread'}.` });
});

router.delete('/contact/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteContactMessage(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Message not found.' });
  }
  db.logActivity('Deleted Contact Message', `ID: ${id}`, req.ip);
  return res.json({ success: true, message: 'Message deleted successfully.' });
});

// --- SETTINGS ---
router.get('/settings', (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.getSettings() });
});

router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSettings(req.body);
  db.logActivity('Updated Site Settings', 'Global Config & Section Visibility', req.ip);
  return res.json({ success: true, data: updated });
});

// --- FILE UPLOAD ---
router.post('/upload', upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file provided or file type invalid.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  db.logActivity('Uploaded File', req.file.originalname, req.ip);

  return res.json({
    success: true,
    file: {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      size: `${Math.round(req.file.size / 1024)} KB`,
      mimetype: req.file.mimetype,
      url: fileUrl,
    },
  });
});

export default router;
