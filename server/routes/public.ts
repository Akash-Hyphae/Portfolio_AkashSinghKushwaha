import { Router, Request, Response } from 'express';
import { db } from '../db';
import path from 'path';
import fs from 'fs';

const router = Router();

// GET /api/public/profile
router.get('/profile', (req: Request, res: Response) => {
  const profile = db.getProfile();
  const settings = db.getSettings();

  // If phone is not public, redact it
  const sanitized = {
    ...profile,
    phone: settings.phonePublic ? profile.phone : undefined,
  };

  return res.json({ success: true, data: sanitized });
});

// GET /api/public/skills
router.get('/skills', (req: Request, res: Response) => {
  const skills = db.getSkills(false);
  return res.json({ success: true, data: skills });
});

// GET /api/public/projects
router.get('/projects', (req: Request, res: Response) => {
  const projects = db.getProjects(false);
  return res.json({ success: true, data: projects });
});

// GET /api/public/projects/:slug
router.get('/projects/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const project = db.getProjectBySlug(slug, false);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found or is currently unpublished.',
    });
  }

  return res.json({ success: true, data: project });
});

// GET /api/public/achievements
router.get('/achievements', (req: Request, res: Response) => {
  const achievements = db.getAchievements(false);
  return res.json({ success: true, data: achievements });
});

// GET /api/public/certifications
router.get('/certifications', (req: Request, res: Response) => {
  const certifications = db.getCertifications(false);
  return res.json({ success: true, data: certifications });
});

// GET /api/public/experience
router.get('/experience', (req: Request, res: Response) => {
  const experiences = db.getExperiences(false);
  return res.json({ success: true, data: experiences });
});

// GET /api/public/dsa
router.get('/dsa', (req: Request, res: Response) => {
  const dsa = db.getDSA();
  return res.json({ success: true, data: dsa });
});

// GET /api/public/settings
router.get('/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  return res.json({ success: true, data: settings });
});

// POST /api/public/contact
router.post('/contact', (req: Request, res: Response) => {
  const { fullName, email, subject, message, consent } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your full name.' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your email address.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  if (!subject || !subject.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter a message subject.' });
  }

  if (!message || message.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Message must be at least 10 characters long.',
    });
  }

  // Sanitize text inputs
  const sanitizedMsg = db.addContactMessage({
    fullName: fullName.trim().slice(0, 100),
    email: email.trim().toLowerCase().slice(0, 120),
    subject: subject.trim().slice(0, 150),
    message: message.trim().slice(0, 5000),
  });

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been received. Akash will review it and get back to you shortly.',
    data: { id: sanitizedMsg.id },
  });
});

// GET /api/public/resume/download
router.get('/resume/download', (req: Request, res: Response) => {
  const resume = db.getResume();
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  const filePath = path.resolve(uploadsDir, resume.fileName);

  if (fs.existsSync(filePath)) {
    return res.download(filePath, resume.fileName);
  }

  // If local custom uploaded file does not exist, provide a generated text/pdf response header
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${resume.fileName}"`);
  
  // Return clean minimal PDF bytes so preview or download works cleanly
  const minimalPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 210 >> stream
BT
/F1 18 Tf
50 720 Td
(Akash Singh Kushwaha - Resume) Tj
/F1 12 Tf
0 -30 Td
(Full-Stack Developer | MERN Stack | AI-Powered Applications) Tj
0 -20 Td
(Email: akashsinghkushwaha.it27@gmail.com | Phone: +91-6376037378) Tj
0 -20 Td
(B.Tech Information Technology, JECRC Foundation | CGPA: 8.13/10) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000244 00000 n 
0000000508 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
577
%%EOF`;

  return res.send(Buffer.from(minimalPdf));
});

export default router;
