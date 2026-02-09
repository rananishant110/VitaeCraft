# VitaeCraft - AI-Powered Resume Builder
## Product Requirements Document (PRD)

---

## 📋 Executive Summary

**Product Name:** VitaeCraft  
**Tagline:** Build Resumes That Get You Hired  
**Version:** 1.0.0 (MVP)  
**Last Updated:** January 2026

VitaeCraft is an AI-powered resume builder that helps job seekers create ATS-optimized, professional resumes using the STAR methodology. The platform offers multiple templates, AI-enhanced content generation, job description matching, and a seamless PDF export experience.

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

### Revenue Streams
- One-time lifetime subscriptions
- Future: Enterprise/Team plans
- Future: Resume review services

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
| **PDF Generation** | ReportLab |
| **Authentication** | JWT (JSON Web Tokens) |
| **Hosting** | Emergent Platform |

### System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  FastAPI Backend│────▶│    MongoDB      │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ OpenAI   │ │  Stripe  │ │ ReportLab│
              │ GPT-5.2  │ │ Payments │ │   PDF    │
              └──────────┘ └──────────┘ └──────────┘
```

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
| `/forgot-password` | Password Reset | No | ⏳ Pending |
| `/verify-email` | Email Verification | No | ⏳ Pending |
| `/settings` | User Settings | Yes | ⏳ Pending |
| `/templates` | Template Gallery | No | ⏳ Pending |
| `/cover-letter/:id?` | Cover Letter Builder | Yes | ⏳ Pending |

---

## 🔌 API Endpoints

### Authentication APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | User registration | ✅ Complete |
| POST | `/api/auth/login` | User login | ✅ Complete |
| GET | `/api/auth/me` | Get current user | ✅ Complete |
| POST | `/api/auth/forgot-password` | Request password reset | ⏳ Pending |
| POST | `/api/auth/reset-password` | Reset password | ⏳ Pending |
| POST | `/api/auth/verify-email` | Verify email address | ⏳ Pending |
| POST | `/api/auth/resend-verification` | Resend verification email | ⏳ Pending |

### Resume APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/resumes` | Create new resume | ✅ Complete |
| GET | `/api/resumes` | List user's resumes | ✅ Complete |
| GET | `/api/resumes/:id` | Get specific resume | ✅ Complete |
| PUT | `/api/resumes/:id` | Update resume | ✅ Complete |
| DELETE | `/api/resumes/:id` | Delete resume | ✅ Complete |
| GET | `/api/resumes/:id/pdf` | Download as PDF | ✅ Complete |
| POST | `/api/resumes/:id/duplicate` | Duplicate resume | ⏳ Pending |
| GET | `/api/resumes/:id/versions` | Get version history | ⏳ Pending |

### AI APIs (Premium Only)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/ai/star-enhance` | STAR methodology enhancement | ✅ Complete |
| POST | `/api/ai/ats-optimize` | ATS optimization & scoring | ✅ Complete |
| POST | `/api/ai/tailor-resume` | Job description matching | ✅ Complete |
| POST | `/api/ai/improve-text` | General text improvement | ✅ Complete |
| POST | `/api/ai/generate-summary` | Generate professional summary | ⏳ Pending |
| POST | `/api/ai/suggest-skills` | Suggest relevant skills | ⏳ Pending |
| POST | `/api/ai/generate-cover-letter` | Generate cover letter | ⏳ Pending |

### Payment APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/payments/create-checkout` | Create Stripe checkout | ✅ Complete |
| GET | `/api/payments/status/:session_id` | Get payment status | ✅ Complete |
| POST | `/api/webhook/stripe` | Stripe webhook handler | ✅ Complete |
| GET | `/api/payments/history` | Get payment history | ⏳ Pending |

### Integration APIs

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/linkedin/import` | Import from LinkedIn | ⚠️ Mocked |
| POST | `/api/indeed/import` | Import from Indeed | ⏳ Pending |
| GET | `/api/templates` | Get available templates | ⏳ Pending |

---

## ✅ Feature Implementation Status

### 🟢 COMPLETED FEATURES

#### Core Features
- [x] **User Authentication**
  - [x] Email/password registration
  - [x] Email/password login
  - [x] JWT token management
  - [x] Protected routes
  - [x] Session persistence
  - [x] Logout functionality

- [x] **Resume Builder**
  - [x] Personal Information section (name, email, phone, location, LinkedIn, portfolio, summary)
  - [x] Work Experience section (company, position, dates, achievements)
  - [x] Education section (institution, degree, field, dates, GPA)
  - [x] Skills section (add/remove skills)
  - [x] Projects section (name, description, technologies, URL)
  - [x] Certifications section (name, issuer, date, credential ID)
  - [x] Live preview while editing
  - [x] Auto-save functionality
  - [x] Mobile responsive editing

- [x] **Resume Templates**
  - [x] Professional template (blue accent, traditional layout)
  - [x] Modern template (orange accent, contemporary design)
  - [x] Minimalist template (clean, minimal design)
  - [x] Template switching with instant preview

- [x] **PDF Generation**
  - [x] Professional template PDF export
  - [x] Modern template PDF export
  - [x] Minimalist template PDF export
  - [x] Proper formatting and styling
  - [x] Instant download

- [x] **AI Features (Premium)**
  - [x] STAR methodology enhancement for experiences
  - [x] ATS compatibility scoring (0-100)
  - [x] Missing keywords identification
  - [x] Improvement suggestions
  - [x] Job description matching
  - [x] Resume tailoring for specific jobs
  - [x] General text improvement

- [x] **Payment Integration**
  - [x] Stripe checkout integration
  - [x] Early bird pricing ($9.99)
  - [x] Lifetime pricing ($49.99)
  - [x] Payment status polling
  - [x] Automatic premium upgrade on payment
  - [x] Payment transaction records

- [x] **Dashboard**
  - [x] Resume list view
  - [x] Create new resume
  - [x] Edit existing resume
  - [x] Delete resume
  - [x] Download PDF from dashboard
  - [x] ATS score display
  - [x] Template preview thumbnails
  - [x] Last updated timestamps
  - [x] Premium status indicator

- [x] **Landing Page**
  - [x] Hero section with CTA
  - [x] Features section
  - [x] How it works section
  - [x] Pricing section
  - [x] Testimonials section
  - [x] Footer with links

- [x] **UI/UX**
  - [x] Responsive design (mobile, tablet, desktop)
  - [x] Loading states
  - [x] Error handling with toast notifications
  - [x] Form validation
  - [x] Smooth animations (Framer Motion)
  - [x] Professional color scheme (International Klein Blue + Signal Orange)
  - [x] Custom typography (Outfit + Manrope fonts)

---

### 🟡 PENDING FEATURES

#### Priority 1 (P1) - High Priority

- [ ] **Email Verification**
  - [ ] Send verification email on registration
  - [ ] Verification link handling
  - [ ] Resend verification option
  - [ ] Restrict features until verified

- [ ] **Password Reset**
  - [ ] Forgot password page
  - [ ] Password reset email
  - [ ] Reset token validation
  - [ ] New password form

- [ ] **Real LinkedIn Integration**
  - [ ] LinkedIn OAuth flow
  - [ ] Profile data import
  - [ ] Experience import
  - [ ] Skills import
  - [ ] Education import
  - Note: Currently mocked - requires LinkedIn Developer approval

- [ ] **Cover Letter Generator**
  - [ ] Cover letter builder page
  - [ ] AI-powered generation from resume + job description
  - [ ] Multiple cover letter templates
  - [ ] PDF export for cover letters

#### Priority 2 (P2) - Medium Priority

- [ ] **Resume Versioning**
  - [ ] Save version history
  - [ ] Compare versions side-by-side
  - [ ] Restore previous versions
  - [ ] Version naming/tagging

- [ ] **Resume Duplication**
  - [ ] Duplicate existing resume
  - [ ] Create variations for different jobs
  - [ ] Bulk duplicate with modifications

- [ ] **AI Summary Generator**
  - [ ] Generate professional summary from experience
  - [ ] Multiple tone options (formal, casual, creative)
  - [ ] Industry-specific summaries

- [ ] **Skills Suggestion Engine**
  - [ ] Suggest skills based on job title
  - [ ] Trending skills by industry
  - [ ] Skill gap analysis

- [ ] **Export Options**
  - [ ] Export to DOCX format
  - [ ] Export to plain text
  - [ ] Export to JSON (data backup)

- [ ] **User Settings Page**
  - [ ] Update profile information
  - [ ] Change password
  - [ ] Notification preferences
  - [ ] Delete account option

#### Priority 3 (P3) - Low Priority

- [ ] **Dark Mode**
  - [ ] Dashboard dark mode toggle
  - [ ] Resume builder dark mode
  - [ ] Persist preference

- [ ] **Resume Analytics**
  - [ ] View count tracking
  - [ ] Download count tracking
  - [ ] ATS score history
  - [ ] Performance insights

- [ ] **Public Resume Sharing**
  - [ ] Generate public link
  - [ ] Custom URL slug
  - [ ] View tracking
  - [ ] Password protection option

- [ ] **Template Gallery**
  - [ ] Browse all templates
  - [ ] Template previews
  - [ ] Filter by industry/style
  - [ ] Premium template badges

- [ ] **Interview Preparation**
  - [ ] Common questions based on resume
  - [ ] STAR answer generator
  - [ ] Practice mode

- [ ] **Job Board Integration**
  - [ ] Search jobs from Indeed/LinkedIn
  - [ ] One-click apply with resume
  - [ ] Job tracking

#### Priority 4 (P4) - Future Enhancements

- [ ] **Team/Enterprise Plans**
  - [ ] Team dashboard
  - [ ] Shared templates
  - [ ] Admin controls
  - [ ] Usage analytics

- [ ] **Resume Review Service**
  - [ ] Professional review request
  - [ ] Feedback integration
  - [ ] Video consultations

- [ ] **Multi-language Support**
  - [ ] UI translation
  - [ ] Resume content translation
  - [ ] Regional templates

- [ ] **Mobile App**
  - [ ] iOS app
  - [ ] Android app
  - [ ] Push notifications

---

## 📊 Database Schema

### Users Collection
```javascript
{
  id: String (UUID),
  email: String (unique),
  password: String (hashed),
  full_name: String,
  is_premium: Boolean,
  subscription_type: String | null, // "early_bird" | "lifetime"
  email_verified: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Resumes Collection
```javascript
{
  id: String (UUID),
  user_id: String (FK to Users),
  title: String,
  template: String, // "professional" | "modern" | "minimalist"
  data: {
    personal_info: {
      full_name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      portfolio: String,
      summary: String
    },
    experiences: [{
      id: String,
      company: String,
      position: String,
      start_date: String,
      end_date: String,
      current: Boolean,
      description: String,
      achievements: [String]
    }],
    education: [{
      id: String,
      institution: String,
      degree: String,
      field: String,
      start_date: String,
      end_date: String,
      gpa: String,
      achievements: [String]
    }],
    skills: [String],
    projects: [{
      id: String,
      name: String,
      description: String,
      technologies: [String],
      url: String,
      highlights: [String]
    }],
    certifications: [{
      id: String,
      name: String,
      issuer: String,
      date: String,
      expiry: String,
      credential_id: String
    }]
  },
  ats_score: Number | null,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Payment Transactions Collection
```javascript
{
  id: String (UUID),
  session_id: String (Stripe session),
  user_id: String (FK to Users),
  email: String,
  amount: Number,
  currency: String,
  plan: String, // "early_bird" | "lifetime"
  status: String, // "pending" | "complete" | "expired"
  payment_status: String, // "initiated" | "paid" | "expired"
  created_at: DateTime,
  completed_at: DateTime | null
}
```

---

## 🔐 Security Considerations

### Implemented
- [x] Password hashing with bcrypt
- [x] JWT token authentication
- [x] CORS configuration
- [x] Input validation with Pydantic
- [x] MongoDB injection prevention
- [x] Secure payment handling via Stripe

### Pending
- [ ] Rate limiting on API endpoints
- [ ] Email verification requirement
- [ ] Two-factor authentication (2FA)
- [ ] Session invalidation on password change
- [ ] Audit logging

---

## 📈 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| User Registration Conversion | 30% | TBD |
| Free to Premium Conversion | 10% | TBD |
| Resume Completion Rate | 70% | TBD |
| PDF Download Rate | 80% | TBD |
| User Retention (30-day) | 40% | TBD |
| ATS Score Improvement | +20 points | TBD |

---

## 🚀 Release Roadmap

### Phase 1: MVP (✅ COMPLETE)
- Core resume builder
- 3 templates
- PDF export
- AI features (STAR, ATS)
- Stripe payments
- User authentication

### Phase 2: Enhanced Features (🔄 IN PROGRESS)
- Email verification
- Password reset
- Cover letter generator
- Resume versioning
- More AI features

### Phase 3: Integrations
- Real LinkedIn OAuth
- Indeed integration
- Job board connections
- Export formats (DOCX)

### Phase 4: Growth
- Analytics dashboard
- Public sharing
- Template marketplace
- Mobile apps

### Phase 5: Enterprise
- Team plans
- Admin dashboard
- SSO integration
- Custom branding

---

## 📝 Notes

### Known Limitations
1. **LinkedIn Import**: Currently returns mock data. Real implementation requires LinkedIn Developer Program approval and OAuth setup.
2. **AI Features**: Require premium subscription. Free users see upgrade prompts.
3. **PDF Templates**: Basic styling - advanced layouts pending.

### Technical Debt
1. Consider adding Redis for session caching
2. Implement proper error logging service
3. Add comprehensive API documentation (Swagger)
4. Set up automated testing pipeline

---

## 📞 Contact

**Product Owner:** [Your Name]  
**Technical Lead:** [Your Name]  
**Support Email:** support@vitaecraft.com

---

*Document Version: 1.0.0*  
*Last Updated: January 2026*
