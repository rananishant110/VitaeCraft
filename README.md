# VitaeCraft - AI-Powered Resume Builder

> Build Resumes That Get You Hired

**VitaeCraft** is a modern, full-stack web application that helps job seekers create ATS-optimized, professional resumes using AI. It features multiple templates, intelligent content generation using STAR methodology, job description matching, cover letter generation, and seamless PDF export.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Key Features

### Resume Building
- **Multiple Templates**: Professional, Modern, and Minimalist designs
- **Real-time Editor**: Drag-and-drop interface with live preview
- **Version Control**: Automatic version history and restore functionality
- **Export Options**: PDF, JSON, and TXT formats

### AI-Powered Features (Premium)
- **STAR Enhancement**: Transform job experiences into powerful STAR-formatted achievements
- **ATS Optimization**: Get compatibility scores and keyword suggestions
- **Resume Tailoring**: Customize resumes for specific job descriptions
- **Smart Suggestions**: AI-powered skills recommendations based on job titles
- **Cover Letter Generation**: Create compelling cover letters automatically
- **Text Improvement**: Enhance resume text for impact and professionalism

### User Management
- **Authentication**: Secure registration and login with JWT tokens
- **Email Verification**: Verify email addresses for account security
- **Password Management**: Forgot password and reset functionality
- **Profile Settings**: Manage account information

### Subscription & Payments
- **Free Tier**: 1 resume, 3 templates, basic features
- **Early Bird Premium**: $9.99 lifetime (limited offer)
- **Lifetime Premium**: $49.99 lifetime with all features
- **Stripe Integration**: Secure payment processing

---

## 🏗️ Project Structure

```
VitaeCraft/
├── backend/                    # FastAPI Python backend
│   ├── server.py              # Main API server
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables (not committed)
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── ui/           # Radix UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   └── tailwind.config.js    # Tailwind CSS configuration
│
├── memory/                     # Project documentation
│   └── PRD.md                # Product Requirements Document
│
├── test_reports/             # Test results and reports
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router v7** - Client-side routing
- **TailwindCSS 3** - Utility-first CSS
- **Radix UI** - Headless UI components
- **React Hook Form** - Form state management
- **Zod** - Type-safe schema validation
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **jsPDF & html2canvas** - PDF generation

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **PyJWT** - JWT token handling
- **Passlib & Bcrypt** - Password hashing
- **ReportLab** - PDF generation
- **Resend** - Email service
- **Stripe** - Payment processing
- **Emergent Integrations** - LLM chat and payment APIs

### Database
- **MongoDB** - NoSQL database for flexible schema

### Additional Services
- **Stripe** - Payment gateway
- **Resend** - Email service provider
- **Emergent Integrations** - AI/LLM integration

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ and **npm/yarn**
- **Python** 3.9+
- **MongoDB** (local or cloud)
- API keys for:
  - Resend (email)
  - Stripe (payments)
  - Emergent Integrations (LLM)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and configure `.env` file**
   ```bash
   cp .env.example .env
   ```
   Update with your credentials:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=vitaecraft
   JWT_SECRET=your_secret_key
   RESEND_API_KEY=your_resend_key
   SENDER_EMAIL=your_email@resend.dev
   STRIPE_API_KEY=your_stripe_key
   EMERGENT_LLM_KEY=your_emergent_key
   FRONTEND_URL=http://localhost:3000
   CORS_ORIGINS=http://localhost:3000
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**
   ```bash
   python server.py
   ```
   Server runs at `http://localhost:8001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Create `.env` file** (if needed)
   ```env
   REACT_APP_API_URL=http://localhost:8001/api
   ```

4. **Start development server**
   ```bash
   yarn start
   # or
   npm start
   ```
   Frontend runs at `http://localhost:3000`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Reset password
- `PUT /api/auth/update-profile` - Update user profile

### Resumes
- `POST /api/resumes` - Create resume
- `GET /api/resumes` - List user's resumes
- `GET /api/resumes/{id}` - Get resume details
- `PUT /api/resumes/{id}` - Update resume
- `DELETE /api/resumes/{id}` - Delete resume
- `POST /api/resumes/{id}/duplicate` - Duplicate resume
- `GET /api/resumes/{id}/versions` - Get version history
- `POST /api/resumes/{id}/restore/{version}` - Restore version
- `GET /api/resumes/{id}/pdf` - Generate PDF
- `GET /api/resumes/{id}/export/json` - Export as JSON
- `GET /api/resumes/{id}/export/txt` - Export as TXT

### AI Features (Premium)
- `POST /api/ai/star-enhance` - STAR methodology enhancement
- `POST /api/ai/ats-optimize` - ATS optimization and scoring
- `POST /api/ai/tailor-resume` - Tailor resume for job description
- `POST /api/ai/improve-text` - Improve resume text
- `POST /api/ai/generate-summary` - Generate professional summary
- `POST /api/ai/suggest-skills` - Get skill suggestions
- `POST /api/ai/generate-cover-letter` - Generate cover letter

### Cover Letters
- `POST /api/cover-letters` - Create cover letter
- `GET /api/cover-letters` - List cover letters
- `GET /api/cover-letters/{id}` - Get cover letter
- `PUT /api/cover-letters/{id}` - Update cover letter
- `DELETE /api/cover-letters/{id}` - Delete cover letter

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `GET /api/payments/status/{session_id}` - Get payment status
- `GET /api/payments/history` - Get payment history
- `POST /api/webhook/stripe` - Stripe webhook handler

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=vitaecraft

# JWT
JWT_SECRET=your_secret_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
SENDER_EMAIL=onboarding@resend.dev

# Payment (Stripe)
STRIPE_API_KEY=your_stripe_api_key

# AI/LLM
EMERGENT_LLM_KEY=your_emergent_api_key

# URLs
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

# Database
DB_NAME=vitaecraft
```

**Note**: Never commit `.env` files. They are in `.gitignore`. For production, set environment variables directly in your hosting platform.

---

## 📊 Database Schema

### Collections

**users**
```javascript
{
  id: String,
  email: String,
  password: String (hashed),
  full_name: String,
  is_premium: Boolean,
  subscription_type: String,
  email_verified: Boolean,
  verification_token: String,
  created_at: ISO8601
}
```

**resumes**
```javascript
{
  id: String,
  user_id: String,
  title: String,
  template: String,
  data: {
    personal_info: {},
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  },
  ats_score: Number,
  version: Number,
  created_at: ISO8601,
  updated_at: ISO8601
}
```

**cover_letters**
```javascript
{
  id: String,
  user_id: String,
  resume_id: String,
  title: String,
  content: String,
  company_name: String,
  job_description: String,
  created_at: ISO8601,
  updated_at: ISO8601
}
```

**payment_transactions**
```javascript
{
  id: String,
  session_id: String,
  user_id: String,
  email: String,
  amount: Number,
  currency: String,
  plan: String,
  status: String,
  payment_status: String,
  created_at: ISO8601,
  completed_at: ISO8601
}
```

---

## 🧪 Testing

Run tests with:

```bash
# Frontend
cd frontend
yarn test

# Backend
cd backend
pytest
```

Test reports are stored in `test_reports/`

---

## 📖 Pages & Features

### Frontend Pages
- **Landing Page** - Hero section with feature overview
- **Login/Register** - User authentication
- **Dashboard** - Resume management and overview
- **Resume Builder** - Full-featured resume editor
- **Cover Letter Builder** - Cover letter creation
- **Pricing Page** - Subscription plans
- **Settings** - User account settings
- **Payment Success** - Payment confirmation
- **Verify Email** - Email verification
- **Forgot Password** - Password recovery
- **Reset Password** - Set new password

---

## 🔄 Workflow

1. **User Registration** → Email verification
2. **Resume Creation** → Real-time editing with templates
3. **AI Enhancement** (Premium) → Upgrade via Stripe payment
4. **PDF Export** → Download formatted resume
5. **Version History** → Restore previous versions
6. **Cover Letter** → AI-generated or manually created
7. **Job Application** → Use tailored resume and cover letter

---

## 🐛 Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check `.env` configuration
- Verify API keys are correct
- Check CORS settings for frontend URL

### Frontend Issues
- Clear browser cache
- Check API URL in environment variables
- Verify backend is running on correct port
- Check browser console for errors

---

## 🚢 Deployment

### Backend
- FastAPI apps can be deployed on:
  - Heroku
  - Railway
  - AWS EC2/Lambda
  - DigitalOcean
  - Fly.io

### Frontend
- React apps can be deployed on:
  - Vercel (recommended)
  - Netlify
  - AWS S3 + CloudFront
  - GitHub Pages

### Environment Variables in Production
Set via your hosting platform's dashboard/settings, not in `.env` files.

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

## 🎨 Design

- **UI Framework**: Radix UI components with Tailwind CSS
- **Color Scheme**: Primary (#002FA7), Secondary (#FF4F00)
- **Typography**: System fonts for optimal performance
- **Responsive**: Mobile-first, fully responsive design

---

**Made with ❤️ by the VitaeCraft Team**
