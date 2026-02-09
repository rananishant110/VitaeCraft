# VitaeCraft - AI-Powered Resume Builder
## Product Requirements Document (PRD)

---

## 📋 Executive Summary

**Product Name:** VitaeCraft  
**Tagline:** Build Resumes That Get You Hired  
**Version:** 1.1.0  
**Last Updated:** January 2026

VitaeCraft is an AI-powered resume builder that helps job seekers create ATS-optimized, professional resumes using the STAR methodology. The platform offers multiple templates, AI-enhanced content generation, job description matching, cover letter generation, and a seamless PDF export experience.

---

## 🎯 Product Vision

To become the go-to platform for job seekers who want to create impactful, ATS-friendly resumes that significantly increase their chances of landing interviews and jobs.

---

## 👥 Target Audience

| Persona | Description | Pain Points |
|---------|-------------|-------------|
| **Fresh Graduates** | First-time job seekers with limited experience | Don't know how to structure a resume, lack professional language |
| **Career Changers** | Professionals switching industries | Need to reframe experience for new fields, ATS rejection |
| **Job Seekers** | Actively looking for new opportunities | Generic resumes not getting callbacks, ATS filtering |
| **Professionals** | Updating resumes for promotions/new roles | Outdated resume format, need to highlight achievements |
| **Freelancers** | Building client-facing profiles | Need multiple resume versions for different clients |

---

## 💰 Business Model

### Pricing Tiers

| Plan | Price | Duration | Features |
|------|-------|----------|----------|
| **Free** | $0 | Forever | 1 Resume, 3 Templates, PDF Download, Basic Editor |
| **Early Bird Premium** | $9.99 | Lifetime | All features, Limited time offer (80% off) |
| **Lifetime Premium** | $49.99 | Lifetime | All features, Regular price |

---

## 🏗️ Technical Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TailwindCSS, Shadcn/UI, Framer Motion |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | MongoDB |
| **AI/ML** | OpenAI GPT-5.2 via Emergent Integrations |
| **Payments** | Stripe via Emergent Integrations |
| **Email** | Resend (optional, mock mode available) |
| **PDF Generation** | ReportLab |
| **Authentication** | JWT (JSON Web Tokens) |

---

## 📱 Application Pages & Routes

| Route | Page | Auth Required | Status |
|-------|------|---------------|--------|
| `/` | Landing Page | No | ✅ Complete |
| `/login` | User Login | No | ✅ Complete |
| `/register` | User Registration | No | ✅ Complete |
| `/dashboard` | User Dashboard | Yes | ✅ Complete |
| `/builder/:id?` | Resume Builder | Yes | ✅ Complete |
| `/pricing` | Pricing Page | No | ✅ Complete |
| `/payment-success` | Payment Confirmation | Yes | ✅ Complete |
| `/forgot-password` | Password Reset Request | No | ✅ Complete |
| `/reset-password` | Password Reset Form | No | ✅ Complete |
| `/verify-email` | Email Verification | No | ✅ Complete |
| `/settings` | User Settings | Yes | ✅ Complete |
| `/cover-letter/:id?` | Cover Letter Builder | Yes | ✅ Complete |

---

## 🔌 API Endpoints

### Authentication APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | User registration with email verification | ✅ Complete |
| POST | `/api/auth/login` | User login | ✅ Complete |
| GET | `/api/auth/me` | Get current user | ✅ Complete |
| POST | `/api/auth/forgot-password` | Request password reset | ✅ Complete |
| POST | `/api/auth/reset-password` | Reset password with token | ✅ Complete |
| POST | `/api/auth/verify-email` | Verify email address | ✅ Complete |
| POST | `/api/auth/resend-verification` | Resend verification email | ✅ Complete |
| PUT | `/api/auth/update-profile` | Update profile and password | ✅ Complete |

### Resume APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/resumes` | Create new resume | ✅ Complete |
| GET | `/api/resumes` | List user's resumes | ✅ Complete |
| GET | `/api/resumes/:id` | Get specific resume | ✅ Complete |
| PUT | `/api/resumes/:id` | Update resume (with versioning) | ✅ Complete |
| DELETE | `/api/resumes/:id` | Delete resume | ✅ Complete |
| GET | `/api/resumes/:id/pdf` | Download as PDF | ✅ Complete |
| POST | `/api/resumes/:id/duplicate` | Duplicate resume | ✅ Complete |
| GET | `/api/resumes/:id/versions` | Get version history | ✅ Complete |
| POST | `/api/resumes/:id/restore/:version` | Restore to version | ✅ Complete |
| GET | `/api/resumes/:id/export/json` | Export as JSON | ✅ Complete |
| GET | `/api/resumes/:id/export/txt` | Export as plain text | ✅ Complete |

### AI APIs (Premium Only)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/ai/star-enhance` | STAR methodology enhancement | ✅ Complete |
| POST | `/api/ai/ats-optimize` | ATS optimization & scoring | ✅ Complete |
| POST | `/api/ai/tailor-resume` | Job description matching | ✅ Complete |
| POST | `/api/ai/improve-text` | General text improvement | ✅ Complete |
| POST | `/api/ai/generate-summary` | Generate professional summary | ✅ Complete |
| POST | `/api/ai/suggest-skills` | Suggest relevant skills | ✅ Complete |
| POST | `/api/ai/generate-cover-letter` | Generate cover letter | ✅ Complete |

### Cover Letter APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/cover-letters` | Create cover letter | ✅ Complete |
| GET | `/api/cover-letters` | List cover letters | ✅ Complete |
| GET | `/api/cover-letters/:id` | Get cover letter | ✅ Complete |
| PUT | `/api/cover-letters/:id` | Update cover letter | ✅ Complete |
| DELETE | `/api/cover-letters/:id` | Delete cover letter | ✅ Complete |

### Payment APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/payments/create-checkout` | Create Stripe checkout | ✅ Complete |
| GET | `/api/payments/status/:session_id` | Get payment status | ✅ Complete |
| GET | `/api/payments/history` | Get payment history | ✅ Complete |
| POST | `/api/webhook/stripe` | Stripe webhook handler | ✅ Complete |

### Integration APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/linkedin/import` | Import from LinkedIn | 🔜 Coming Soon |

---

## ✅ Feature Implementation Status

### 🟢 COMPLETED FEATURES (P0 - MVP)

- [x] **User Authentication**
  - [x] Email/password registration with verification
  - [x] Email/password login
  - [x] JWT token management
  - [x] Protected routes
  - [x] Session persistence
  - [x] Logout functionality

- [x] **Resume Builder**
  - [x] Personal Information section
  - [x] Work Experience section with STAR enhancement
  - [x] Education section
  - [x] Skills section
  - [x] Projects section
  - [x] Certifications section
  - [x] Live preview while editing
  - [x] Auto-save functionality

- [x] **Resume Templates**
  - [x] Professional template
  - [x] Modern template
  - [x] Minimalist template
  - [x] Template switching with instant preview

- [x] **PDF Generation**
  - [x] All template PDF exports
  - [x] Proper formatting and styling

- [x] **AI Features (Premium)**
  - [x] STAR methodology enhancement
  - [x] ATS compatibility scoring
  - [x] Job description matching
  - [x] Resume tailoring

- [x] **Payment Integration**
  - [x] Stripe checkout
  - [x] Early bird & lifetime pricing
  - [x] Payment status polling
  - [x] Automatic premium upgrade

### 🟢 COMPLETED FEATURES (P1 - High Priority)

- [x] **Email Verification System**
  - [x] Verification token generation on registration
  - [x] Verify email page
  - [x] Resend verification option
  - [x] Email verified indicator in UI

- [x] **Password Reset Flow**
  - [x] Forgot password page
  - [x] Password reset email (mock mode)
  - [x] Reset token validation
  - [x] New password form
  - [x] Token expiration handling

- [x] **Cover Letter Generator**
  - [x] Cover letter builder page
  - [x] AI-powered generation from resume + job description
  - [x] Save and edit cover letters
  - [x] Copy and download options

- [x] **LinkedIn Integration**
  - [x] "Coming Soon" placeholder
  - [ ] Real OAuth integration (requires LinkedIn approval)

### 🟢 COMPLETED FEATURES (P2 - Medium Priority)

- [x] **Resume Versioning**
  - [x] Automatic version history on updates
  - [x] View version history
  - [x] Restore previous versions

- [x] **Resume Duplication**
  - [x] One-click duplicate
  - [x] Creates copy with "(Copy)" suffix

- [x] **AI Summary Generator**
  - [x] Generate summary from experience
  - [x] Multiple tone options (professional, casual, creative)

- [x] **Skills Suggestion Engine**
  - [x] Suggest skills based on job title
  - [x] Technical and soft skills
  - [x] Trending skills

- [x] **Export Options**
  - [x] Export to JSON (backup)
  - [x] Export to plain text
  - [x] PDF export (already in MVP)

- [x] **User Settings Page**
  - [x] Update profile information
  - [x] Change password
  - [x] Email verification status
  - [x] Premium status display

---

### 🟢 COMPLETED FEATURES (P3 - Low Priority)

- [x] **Dark Mode**
  - [x] Dashboard dark mode toggle
  - [x] Theme persistence in localStorage
  - [x] Backend sync for user preferences
  - [x] Dark mode styles for all components

- [x] **Resume Analytics**
  - [x] View count tracking
  - [x] Download count tracking
  - [x] Analytics dashboard endpoint
  - [x] Per-resume analytics

- [x] **Public Resume Sharing**
  - [x] Generate public link
  - [x] Custom URL slug
  - [x] View tracking for public resumes
  - [x] Password protection option
  - [x] Share dialog in dashboard
  - [x] Copy link functionality

### 🟡 PENDING FEATURES (P4 - Future)

- [ ] **Real LinkedIn OAuth Integration**
- [ ] **Team/Enterprise Plans**
- [ ] **Resume Review Service**
- [ ] **Multi-language Support**
- [ ] **Mobile Apps**
- [ ] **Export to DOCX**

---

## 📊 Database Collections

### Users
```javascript
{
  id: String,
  email: String (unique),
  password: String (hashed),
  full_name: String,
  is_premium: Boolean,
  subscription_type: String,
  email_verified: Boolean,
  verification_token: String,
  created_at: DateTime
}
```

### Resumes
```javascript
{
  id: String,
  user_id: String,
  title: String,
  template: String,
  data: Object,
  ats_score: Number,
  version: Number,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Resume Versions
```javascript
{
  id: String,
  resume_id: String,
  version: Number,
  title: String,
  template: String,
  data: Object,
  created_at: DateTime
}
```

### Cover Letters
```javascript
{
  id: String,
  user_id: String,
  resume_id: String,
  title: String,
  content: String,
  company_name: String,
  job_description: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Password Resets
```javascript
{
  id: String,
  user_id: String,
  token: String,
  expires_at: DateTime,
  used: Boolean
}
```

### Payment Transactions
```javascript
{
  id: String,
  session_id: String,
  user_id: String,
  amount: Number,
  plan: String,
  status: String,
  payment_status: String,
  created_at: DateTime,
  completed_at: DateTime
}
```

---

## 🔐 Security Features

### Implemented
- [x] Password hashing with bcrypt
- [x] JWT token authentication
- [x] CORS configuration
- [x] Input validation with Pydantic
- [x] Email verification
- [x] Password reset with expiring tokens
- [x] Secure payment handling via Stripe

### Pending
- [ ] Rate limiting
- [ ] Two-factor authentication
- [ ] Audit logging

---

## 📈 Test Results

| Category | Tests | Pass Rate |
|----------|-------|-----------|
| Backend APIs | 26 | 100% |
| Frontend UI | 25 | 96% |
| Overall | 51 | 98% |

---

## 🚀 Release History

### v1.0.0 (MVP)
- Core resume builder
- 3 templates
- PDF export
- AI features (STAR, ATS)
- Stripe payments
- User authentication

### v1.1.0 (P1 + P2)
- Email verification system
- Password reset flow
- Cover letter generator
- Resume versioning & duplication
- AI summary generator
- Skills suggestion engine
- User settings page
- Export options (JSON, TXT)

---

## 📝 Known Limitations

1. **LinkedIn Import**: Marked as "Coming Soon" - requires LinkedIn Developer Program approval
2. **Email Sending**: Mock mode when RESEND_API_KEY not configured
3. **AI Features**: Require premium subscription

---

## 🔧 Configuration

### Required Environment Variables (Backend)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
EMERGENT_LLM_KEY=<your_emergent_key>
STRIPE_API_KEY=<your_stripe_key>
JWT_SECRET=<your_secret>
RESEND_API_KEY=<optional>
SENDER_EMAIL=<optional>
FRONTEND_URL=<your_frontend_url>
```

---

*Document Version: 1.1.0*  
*Last Updated: January 2026*
