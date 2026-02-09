# VitaeCraft - AI-Powered Resume Builder

## Original Problem Statement
Build a full stack web app for resume creation in PDF format, where user can update their skills, experience and other details and they can download a PDF out of it. The app should be capable to tailor the resume for ATS and use methodologies like STAR to update and prepare the resume smartly for the user. App should have one time lifetime subscription for $9.99 as early offer and later $49.99 for lifetime.

## User Choices
- **AI Integration**: OpenAI GPT-5.2 with Emergent LLM Key
- **Payment**: Stripe (test key available)
- **Auth**: JWT-based email/password authentication
- **Templates**: Professional, Modern, Minimalist (all included)
- **Additional Features**: LinkedIn import, Job description-based resume tailoring

## Architecture

### Tech Stack
- **Frontend**: React 19 + TailwindCSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-5.2 via Emergent Integrations
- **Payments**: Stripe via Emergent Integrations
- **PDF Generation**: ReportLab

### Key Routes
- `/` - Landing Page
- `/login` - User Login
- `/register` - User Registration
- `/dashboard` - User Dashboard (protected)
- `/builder/:id` - Resume Builder (protected)
- `/pricing` - Pricing Page
- `/payment-success` - Payment Confirmation (protected)

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/resumes` - Create resume
- `GET /api/resumes` - List user resumes
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id/pdf` - Download PDF
- `POST /api/ai/star-enhance` - AI STAR enhancement (premium)
- `POST /api/ai/ats-optimize` - ATS optimization (premium)
- `POST /api/ai/tailor-resume` - Job description matching (premium)
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `GET /api/payments/status/:session_id` - Get payment status
- `POST /api/linkedin/import` - LinkedIn import (MOCKED)

## User Personas
1. **Job Seekers** - Looking to create professional resumes
2. **Career Changers** - Need ATS-optimized resumes for new industries
3. **Fresh Graduates** - First-time resume creators
4. **Professionals** - Updating resumes for new opportunities

## Core Requirements (Static)
- [x] User authentication (JWT)
- [x] Resume CRUD operations
- [x] Multiple resume templates (Professional, Modern, Minimalist)
- [x] PDF download functionality
- [x] AI-powered STAR methodology enhancement
- [x] ATS optimization scoring
- [x] Job description matching
- [x] Stripe payment integration
- [x] Subscription management ($9.99 early bird, $49.99 lifetime)

## What's Been Implemented (Jan 2026)
- [x] Full landing page with Profolio branding
- [x] User registration and login with JWT
- [x] Dashboard with resume management
- [x] Resume builder with live preview
- [x] 3 professional templates (Professional, Modern, Minimalist)
- [x] PDF generation with all templates
- [x] AI STAR enhancement (premium)
- [x] AI ATS optimization (premium)
- [x] AI resume tailoring (premium)
- [x] Stripe payment integration
- [x] Payment success polling
- [x] LinkedIn import (MOCKED - requires OAuth approval)

## Prioritized Backlog

### P0 (Critical - Not Needed)
All P0 features implemented

### P1 (High Priority)
- [ ] Real LinkedIn OAuth integration
- [ ] Cover letter generation
- [ ] Email verification
- [ ] Password reset flow

### P2 (Medium Priority)
- [ ] Resume analytics/views tracking
- [ ] Multiple resume versions comparison
- [ ] Export to DOCX format
- [ ] Dark mode toggle in dashboard

### P3 (Low Priority)
- [ ] Team/Enterprise plans
- [ ] Resume sharing/public links
- [ ] Interview tips integration
- [ ] Job board integration

## Next Tasks
1. Implement real LinkedIn OAuth (requires LinkedIn Developer approval)
2. Add cover letter generation feature
3. Implement email verification flow
4. Add password reset functionality
5. Consider adding resume analytics

## Mocked Features
- **LinkedIn Import**: Returns mock data. Real implementation requires LinkedIn OAuth approval and API access.
