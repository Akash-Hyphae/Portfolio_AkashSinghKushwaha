# Akash Singh Kushwaha — Full-Stack Portfolio & Admin CMS

A production-ready, full-stack personal developer portfolio and content management system for **Akash Singh Kushwaha** (Information Technology undergraduate, MERN stack engineer, and AI-powered application developer).

Built with **React 19, TypeScript, Express.js, Tailwind CSS, Lucide Icons, and atomic database persistence**.

---

## 🌟 Key Features

### 1. Public Portfolio
- **3-Zone Header Contract**: Sleek wordmark, single-line clean navigation links, "My Resume" CTA, and Dark/Light theme switcher.
- **Hero Showcase**: Live availability badge, greeting, terminal code card (`AkashSingh.ts`), and verified statistics strip (400+ DSA problems solved, 3 featured projects, 13 table tennis medals, 2027 expected graduation).
- **About Me**: Academic background at JECRC Foundation (CGPA 8.13/10), engineering philosophy, athletic discipline, and "Currently Learning" track.
- **Categorized Skills**: Dynamic filtering across Programming Languages, Frontend, Backend, Databases, Core Computer Science, Tools, and AI integrations.
- **Production Projects & Case Studies**:
  - **Handloom House**: Client-commissioned MERN e-commerce platform with 100+ items catalog, 15+ REST APIs, and Razorpay HMAC-SHA256 signature verification.
  - **Play4Glory**: Esports tournament management engine with automated 64-team recursive bracket trees, double-entry wallet ledger, and RBAC.
  - **Pathlytic AI**: Adaptive career roadmap platform using Gemini structured schemas, multi-step onboarding, and Power BI visual pace analytics.
- **DSA & Problem-Solving Journey**: Verified 400+ problem milestone across LeetCode (240) and GeeksforGeeks (160), topic completion percentages, and featured problem architectures.
- **Work Experience**: Production timeline of freelance client deliverables.
- **Achievements & Athletics**: Dedicated state-level table tennis highlight (13 podium medals: 7 Gold, 5 Silver, 1 Bronze; West Zone representative) and technical milestones.
- **Certifications**: Accredited Infosys Springboard *Core Java Programming Revisited* credential with verification links.
- **Curriculum Vitae / Resume**: Live downloadable PDF with versioning and last-updated tracking.
- **Functional Contact Form**: Client & server validation, anti-spam sanitization, and database message persistence.
- **Admin Access**: Discreet footer entry link to `/admin/login` keeping public navigation uncluttered.

### 2. Complete Administrative CMS (`/admin/dashboard`)
- **JWT & HTTP-Only Authentication**: Secure password hashing with bcrypt, SameSite cookie protection, and login rate limiting.
- **Real-Time Overview**: Live database KPI counts, draft vs. published metrics, and activity audit logs.
- **Profile Manager**: Edit name, bio, education, CGPA, phone visibility, and social links.
- **Projects CRUD**: Full case study editor, slug generator, draft/publish workflow, and ordering.
- **Skills CRUD**: Add, edit, reorder, feature, or hide skills without deleting.
- **DSA Manager**: Update problem counts, platform splits, and topic progress percentages.
- **Achievements & Certifications CRUD**: Manage awards, credentials, and verification links.
- **Experience Manager**: Add professional milestones and client deliverables.
- **Resume Manager**: Upload replacement PDFs with automatic file validation and version tagging.
- **Contact Inbox**: Searchable inbox, read/unread filters, and direct email reply links.
- **Site Settings**: Toggle individual section visibility, order, and maintenance mode.
- **Admin Security**: Change administrative master credentials.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript (`tsx`) |
| **Authentication** | JSON Web Tokens (JWT), HTTP-Only cookies, bcryptjs |
| **Database** | Persistent JSON document store with atomic file writes + MongoDB Atlas adapter |
| **File Handling** | Multer with strict MIME type and 10MB size limits |

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/akashsinghkushwaha/portfolio-cms.git
cd portfolio-cms

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in values (or use defaults for instant zero-configuration local runs):
```env
PORT=3000
NODE_ENV=development
ADMIN_EMAIL=akashsinghkushwaha.it27@gmail.com
ADMIN_PASSWORD=Admin@2026#Akash
SESSION_SECRET=your-secure-secret-key-32-chars
```

### 4. Running the Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

### 5. Administrator Access
- Navigate to: `http://localhost:3000/admin/login`
- Default Email: `akashsinghkushwaha.it27@gmail.com`
- Default Password: `Admin@2026#Akash` (change immediately in Admin Security panel)

---

## 📦 Production Build & Deployment

### Build Command
```bash
npm run build
```
This compiles the TypeScript and Vite assets into the `dist/` directory.

### Production Start
```bash
npm start
```

### Deploying to Render
1. Create a new Web Service on [Render](https://render.com).
2. Connect your Git repository.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.ts` or `npm start`
4. Set Environment Variables in the Render dashboard:
   - `NODE_ENV=production`
   - `SESSION_SECRET=...`
   - `ADMIN_EMAIL=akashsinghkushwaha.it27@gmail.com`
   - `ADMIN_PASSWORD=...`

---

## 🔒 Security Best Practices Implemented
- **No Plaintext Passwords**: Passwords hashed with bcrypt (salt rounds: 10).
- **Server-Side Route Authorization**: All `/api/admin/*` routes verify JWT tokens server-side before execution.
- **Login Rate Limiting**: Exponential cooldown on repeated failed attempts to prevent brute force.
- **Zero API Key Leakage**: No private keys or secrets exposed to the Vite client bundle.
- **File Upload Validation**: Allowed MIME types strictly limited to images and PDFs up to 10MB.
