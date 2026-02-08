from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'resume_builder_secret_key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 1 week

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    full_name: str
    is_premium: bool = False
    subscription_type: Optional[str] = None
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    portfolio: str = ""
    summary: str = ""

class Experience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str = ""
    position: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""
    achievements: List[str] = []

class Education(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution: str = ""
    degree: str = ""
    field: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""
    achievements: List[str] = []

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    technologies: List[str] = []
    url: str = ""
    highlights: List[str] = []

class Certification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    issuer: str = ""
    date: str = ""
    expiry: str = ""
    credential_id: str = ""

class ResumeData(BaseModel):
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    experiences: List[Experience] = []
    education: List[Education] = []
    skills: List[str] = []
    projects: List[Project] = []
    certifications: List[Certification] = []

class ResumeCreate(BaseModel):
    title: str
    template: str = "professional"
    data: ResumeData = Field(default_factory=ResumeData)

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    data: Optional[ResumeData] = None

class ResumeResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    title: str
    template: str
    data: ResumeData
    ats_score: Optional[int] = None
    created_at: str
    updated_at: str

class AIRequest(BaseModel):
    text: str
    context: Optional[str] = None

class ATSOptimizeRequest(BaseModel):
    resume_id: str
    job_description: str

class STARRequest(BaseModel):
    experience_description: str
    role: str

class PaymentRequest(BaseModel):
    plan: str  # "early_bird" or "lifetime"
    origin_url: str

class LinkedInImportRequest(BaseModel):
    linkedin_url: str

# Pricing
PRICING = {
    "early_bird": 9.99,
    "lifetime": 49.99
}

# ============== HELPERS ==============

def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode = {"sub": user_id, "email": email, "exp": expire}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password": hashed_password,
        "full_name": user_data.full_name,
        "is_premium": False,
        "subscription_type": None,
        "created_at": now
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_access_token(user_id, user_data.email)
    user_response = UserResponse(
        id=user_id,
        email=user_data.email,
        full_name=user_data.full_name,
        is_premium=False,
        subscription_type=None,
        created_at=now
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(user["id"], user["email"])
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        is_premium=user.get("is_premium", False),
        subscription_type=user.get("subscription_type"),
        created_at=user["created_at"]
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        is_premium=current_user.get("is_premium", False),
        subscription_type=current_user.get("subscription_type"),
        created_at=current_user["created_at"]
    )

# ============== RESUME ROUTES ==============

@api_router.post("/resumes", response_model=ResumeResponse)
async def create_resume(resume: ResumeCreate, current_user: dict = Depends(get_current_user)):
    resume_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    resume_doc = {
        "id": resume_id,
        "user_id": current_user["id"],
        "title": resume.title,
        "template": resume.template,
        "data": resume.data.model_dump(),
        "ats_score": None,
        "created_at": now,
        "updated_at": now
    }
    
    await db.resumes.insert_one(resume_doc)
    
    return ResumeResponse(**{k: v for k, v in resume_doc.items() if k != "_id"})

@api_router.get("/resumes", response_model=List[ResumeResponse])
async def get_resumes(current_user: dict = Depends(get_current_user)):
    resumes = await db.resumes.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).to_list(100)
    return resumes

@api_router.get("/resumes/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one(
        {"id": resume_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@api_router.put("/resumes/{resume_id}", response_model=ResumeResponse)
async def update_resume(resume_id: str, update: ResumeUpdate, current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one({"id": resume_id, "user_id": current_user["id"]})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    update_data = {}
    if update.title is not None:
        update_data["title"] = update.title
    if update.template is not None:
        update_data["template"] = update.template
    if update.data is not None:
        update_data["data"] = update.data.model_dump()
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.resumes.update_one({"id": resume_id}, {"$set": update_data})
    
    updated_resume = await db.resumes.find_one({"id": resume_id}, {"_id": 0})
    return updated_resume

@api_router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.resumes.delete_one({"id": resume_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume deleted successfully"}

# ============== AI ROUTES ==============

async def get_ai_chat():
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    chat = LlmChat(
        api_key=api_key,
        session_id=str(uuid.uuid4()),
        system_message="You are a professional resume writing expert. Help users create ATS-optimized resumes using STAR methodology (Situation, Task, Action, Result). Provide concise, impactful content."
    )
    chat.with_model("openai", "gpt-5.2")
    return chat

@api_router.post("/ai/star-enhance")
async def enhance_with_star(request: STARRequest, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_premium", False):
        raise HTTPException(status_code=403, detail="Premium subscription required")
    
    chat = await get_ai_chat()
    prompt = f"""Transform this job experience into a powerful STAR-formatted achievement:

Role: {request.role}
Original Description: {request.experience_description}

Please rewrite this using the STAR method (Situation, Task, Action, Result) in 2-3 bullet points. 
Each bullet should:
- Start with a strong action verb
- Include quantifiable metrics where possible
- Focus on impact and results
- Be ATS-friendly

Return only the bullet points, no explanations."""

    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    return {"enhanced_text": response}

@api_router.post("/ai/ats-optimize")
async def optimize_for_ats(request: ATSOptimizeRequest, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_premium", False):
        raise HTTPException(status_code=403, detail="Premium subscription required")
    
    resume = await db.resumes.find_one({"id": request.resume_id, "user_id": current_user["id"]}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    chat = await get_ai_chat()
    prompt = f"""Analyze this resume against the job description and provide:
1. An ATS compatibility score (0-100)
2. Missing keywords that should be added
3. Specific suggestions to improve ATS ranking

Job Description:
{request.job_description}

Resume Data:
{resume['data']}

Respond in JSON format:
{{
    "score": <number>,
    "missing_keywords": ["keyword1", "keyword2"],
    "suggestions": ["suggestion1", "suggestion2"],
    "optimized_summary": "<improved professional summary>"
}}"""

    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    # Try to parse as JSON, otherwise return raw
    try:
        import json
        result = json.loads(response)
        # Update ATS score in resume
        await db.resumes.update_one(
            {"id": request.resume_id},
            {"$set": {"ats_score": result.get("score", 0)}}
        )
        return result
    except:
        return {"raw_response": response}

@api_router.post("/ai/tailor-resume")
async def tailor_resume(request: ATSOptimizeRequest, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_premium", False):
        raise HTTPException(status_code=403, detail="Premium subscription required")
    
    resume = await db.resumes.find_one({"id": request.resume_id, "user_id": current_user["id"]}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    chat = await get_ai_chat()
    prompt = f"""Tailor this resume for the specific job description. Provide:
1. Rewritten professional summary targeted to this role
2. Suggested skill additions
3. Experience bullet point improvements
4. Keywords to emphasize

Job Description:
{request.job_description}

Current Resume:
{resume['data']}

Respond in JSON format:
{{
    "tailored_summary": "<new summary>",
    "skills_to_add": ["skill1", "skill2"],
    "experience_improvements": [
        {{"original": "<original text>", "improved": "<improved text>"}}
    ],
    "keywords_to_emphasize": ["keyword1", "keyword2"]
}}"""

    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    try:
        import json
        return json.loads(response)
    except:
        return {"raw_response": response}

@api_router.post("/ai/improve-text")
async def improve_text(request: AIRequest, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_premium", False):
        raise HTTPException(status_code=403, detail="Premium subscription required")
    
    chat = await get_ai_chat()
    prompt = f"""Improve this resume text to be more impactful and professional:

Original: {request.text}
Context: {request.context or 'Resume content'}

Provide an improved version that:
- Uses strong action verbs
- Is concise and impactful
- Is ATS-friendly
- Highlights achievements

Return only the improved text."""

    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    return {"improved_text": response}

# ============== PDF GENERATION ==============

def generate_professional_pdf(resume_data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch, leftMargin=0.75*inch, rightMargin=0.75*inch)
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    styles.add(ParagraphStyle(name='Name', fontSize=24, spaceAfter=6, textColor=colors.HexColor('#002FA7'), fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='ContactInfo', fontSize=10, spaceAfter=12, textColor=colors.HexColor('#64748B')))
    styles.add(ParagraphStyle(name='SectionTitle', fontSize=14, spaceBefore=16, spaceAfter=8, textColor=colors.HexColor('#002FA7'), fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='JobTitle', fontSize=12, spaceAfter=2, fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='Company', fontSize=11, spaceAfter=4, textColor=colors.HexColor('#64748B')))
    styles.add(ParagraphStyle(name='BulletPoint', fontSize=10, leftIndent=15, spaceAfter=4, bulletIndent=0))
    styles.add(ParagraphStyle(name='Summary', fontSize=10, spaceAfter=12, leading=14))
    
    story = []
    data = resume_data.get('data', {})
    personal = data.get('personal_info', {})
    
    # Header
    story.append(Paragraph(personal.get('full_name', 'Your Name'), styles['Name']))
    
    contact_parts = []
    if personal.get('email'): contact_parts.append(personal['email'])
    if personal.get('phone'): contact_parts.append(personal['phone'])
    if personal.get('location'): contact_parts.append(personal['location'])
    if contact_parts:
        story.append(Paragraph(' | '.join(contact_parts), styles['ContactInfo']))
    
    links = []
    if personal.get('linkedin'): links.append(f"LinkedIn: {personal['linkedin']}")
    if personal.get('portfolio'): links.append(f"Portfolio: {personal['portfolio']}")
    if links:
        story.append(Paragraph(' | '.join(links), styles['ContactInfo']))
    
    # Summary
    if personal.get('summary'):
        story.append(Paragraph('PROFESSIONAL SUMMARY', styles['SectionTitle']))
        story.append(Paragraph(personal['summary'], styles['Summary']))
    
    # Experience
    experiences = data.get('experiences', [])
    if experiences:
        story.append(Paragraph('EXPERIENCE', styles['SectionTitle']))
        for exp in experiences:
            story.append(Paragraph(exp.get('position', ''), styles['JobTitle']))
            date_str = f"{exp.get('start_date', '')} - {'Present' if exp.get('current') else exp.get('end_date', '')}"
            story.append(Paragraph(f"{exp.get('company', '')} | {date_str}", styles['Company']))
            if exp.get('description'):
                story.append(Paragraph(exp['description'], styles['BulletPoint']))
            for achievement in exp.get('achievements', []):
                story.append(Paragraph(f"• {achievement}", styles['BulletPoint']))
            story.append(Spacer(1, 8))
    
    # Education
    education = data.get('education', [])
    if education:
        story.append(Paragraph('EDUCATION', styles['SectionTitle']))
        for edu in education:
            story.append(Paragraph(f"{edu.get('degree', '')} in {edu.get('field', '')}", styles['JobTitle']))
            date_str = f"{edu.get('start_date', '')} - {edu.get('end_date', '')}"
            gpa_str = f" | GPA: {edu['gpa']}" if edu.get('gpa') else ""
            story.append(Paragraph(f"{edu.get('institution', '')} | {date_str}{gpa_str}", styles['Company']))
            story.append(Spacer(1, 8))
    
    # Skills
    skills = data.get('skills', [])
    if skills:
        story.append(Paragraph('SKILLS', styles['SectionTitle']))
        story.append(Paragraph(', '.join(skills), styles['Summary']))
    
    # Projects
    projects = data.get('projects', [])
    if projects:
        story.append(Paragraph('PROJECTS', styles['SectionTitle']))
        for proj in projects:
            story.append(Paragraph(proj.get('name', ''), styles['JobTitle']))
            if proj.get('description'):
                story.append(Paragraph(proj['description'], styles['BulletPoint']))
            if proj.get('technologies'):
                story.append(Paragraph(f"Technologies: {', '.join(proj['technologies'])}", styles['Company']))
            story.append(Spacer(1, 8))
    
    # Certifications
    certs = data.get('certifications', [])
    if certs:
        story.append(Paragraph('CERTIFICATIONS', styles['SectionTitle']))
        for cert in certs:
            story.append(Paragraph(f"{cert.get('name', '')} - {cert.get('issuer', '')} ({cert.get('date', '')})", styles['BulletPoint']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def generate_modern_pdf(resume_data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch, leftMargin=0.75*inch, rightMargin=0.75*inch)
    
    styles = getSampleStyleSheet()
    
    # Modern styles with orange accents
    styles.add(ParagraphStyle(name='ModernName', fontSize=28, spaceAfter=4, textColor=colors.HexColor('#0F172A'), fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='ModernContact', fontSize=10, spaceAfter=16, textColor=colors.HexColor('#FF4F00')))
    styles.add(ParagraphStyle(name='ModernSection', fontSize=12, spaceBefore=14, spaceAfter=6, textColor=colors.HexColor('#FF4F00'), fontName='Helvetica-Bold', borderPadding=4))
    styles.add(ParagraphStyle(name='ModernJob', fontSize=11, spaceAfter=2, fontName='Helvetica-Bold', textColor=colors.HexColor('#0F172A')))
    styles.add(ParagraphStyle(name='ModernCompany', fontSize=10, spaceAfter=4, textColor=colors.HexColor('#64748B'), fontName='Helvetica-Oblique'))
    styles.add(ParagraphStyle(name='ModernBullet', fontSize=10, leftIndent=12, spaceAfter=3))
    styles.add(ParagraphStyle(name='ModernSummary', fontSize=10, spaceAfter=10, leading=13, textColor=colors.HexColor('#374151')))
    
    story = []
    data = resume_data.get('data', {})
    personal = data.get('personal_info', {})
    
    # Header with modern styling
    story.append(Paragraph(personal.get('full_name', 'Your Name').upper(), styles['ModernName']))
    
    contact_parts = []
    if personal.get('email'): contact_parts.append(personal['email'])
    if personal.get('phone'): contact_parts.append(personal['phone'])
    if personal.get('location'): contact_parts.append(personal['location'])
    if personal.get('linkedin'): contact_parts.append(personal['linkedin'])
    if contact_parts:
        story.append(Paragraph(' • '.join(contact_parts), styles['ModernContact']))
    
    # Summary
    if personal.get('summary'):
        story.append(Paragraph('— ABOUT —', styles['ModernSection']))
        story.append(Paragraph(personal['summary'], styles['ModernSummary']))
    
    # Experience
    experiences = data.get('experiences', [])
    if experiences:
        story.append(Paragraph('— EXPERIENCE —', styles['ModernSection']))
        for exp in experiences:
            story.append(Paragraph(exp.get('position', ''), styles['ModernJob']))
            date_str = f"{exp.get('start_date', '')} - {'Present' if exp.get('current') else exp.get('end_date', '')}"
            story.append(Paragraph(f"{exp.get('company', '')} | {date_str}", styles['ModernCompany']))
            if exp.get('description'):
                story.append(Paragraph(exp['description'], styles['ModernBullet']))
            for achievement in exp.get('achievements', []):
                story.append(Paragraph(f"→ {achievement}", styles['ModernBullet']))
            story.append(Spacer(1, 6))
    
    # Skills
    skills = data.get('skills', [])
    if skills:
        story.append(Paragraph('— SKILLS —', styles['ModernSection']))
        story.append(Paragraph(' • '.join(skills), styles['ModernSummary']))
    
    # Education
    education = data.get('education', [])
    if education:
        story.append(Paragraph('— EDUCATION —', styles['ModernSection']))
        for edu in education:
            story.append(Paragraph(f"{edu.get('degree', '')} in {edu.get('field', '')}", styles['ModernJob']))
            story.append(Paragraph(f"{edu.get('institution', '')} | {edu.get('start_date', '')} - {edu.get('end_date', '')}", styles['ModernCompany']))
            story.append(Spacer(1, 6))
    
    # Projects
    projects = data.get('projects', [])
    if projects:
        story.append(Paragraph('— PROJECTS —', styles['ModernSection']))
        for proj in projects:
            story.append(Paragraph(proj.get('name', ''), styles['ModernJob']))
            if proj.get('description'):
                story.append(Paragraph(proj['description'], styles['ModernBullet']))
            story.append(Spacer(1, 6))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def generate_minimalist_pdf(resume_data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.75*inch, bottomMargin=0.75*inch, leftMargin=1*inch, rightMargin=1*inch)
    
    styles = getSampleStyleSheet()
    
    # Minimalist clean styles
    styles.add(ParagraphStyle(name='MinName', fontSize=20, spaceAfter=8, textColor=colors.HexColor('#0F172A'), fontName='Helvetica'))
    styles.add(ParagraphStyle(name='MinContact', fontSize=9, spaceAfter=20, textColor=colors.HexColor('#6B7280')))
    styles.add(ParagraphStyle(name='MinSection', fontSize=10, spaceBefore=16, spaceAfter=8, textColor=colors.HexColor('#9CA3AF'), fontName='Helvetica', leftIndent=0))
    styles.add(ParagraphStyle(name='MinJob', fontSize=10, spaceAfter=2, fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='MinCompany', fontSize=9, spaceAfter=4, textColor=colors.HexColor('#6B7280')))
    styles.add(ParagraphStyle(name='MinBullet', fontSize=9, leftIndent=10, spaceAfter=2, textColor=colors.HexColor('#374151')))
    styles.add(ParagraphStyle(name='MinSummary', fontSize=9, spaceAfter=8, leading=12, textColor=colors.HexColor('#374151')))
    
    story = []
    data = resume_data.get('data', {})
    personal = data.get('personal_info', {})
    
    # Simple header
    story.append(Paragraph(personal.get('full_name', 'Your Name'), styles['MinName']))
    
    contact_parts = []
    if personal.get('email'): contact_parts.append(personal['email'])
    if personal.get('phone'): contact_parts.append(personal['phone'])
    if personal.get('location'): contact_parts.append(personal['location'])
    if contact_parts:
        story.append(Paragraph(' / '.join(contact_parts), styles['MinContact']))
    
    # Summary
    if personal.get('summary'):
        story.append(Paragraph(personal['summary'], styles['MinSummary']))
    
    # Experience
    experiences = data.get('experiences', [])
    if experiences:
        story.append(Paragraph('Experience', styles['MinSection']))
        for exp in experiences:
            date_str = f"{exp.get('start_date', '')}–{'Present' if exp.get('current') else exp.get('end_date', '')}"
            story.append(Paragraph(f"{exp.get('position', '')} at {exp.get('company', '')}", styles['MinJob']))
            story.append(Paragraph(date_str, styles['MinCompany']))
            for achievement in exp.get('achievements', []):
                story.append(Paragraph(f"· {achievement}", styles['MinBullet']))
            story.append(Spacer(1, 4))
    
    # Education
    education = data.get('education', [])
    if education:
        story.append(Paragraph('Education', styles['MinSection']))
        for edu in education:
            story.append(Paragraph(f"{edu.get('degree', '')} · {edu.get('field', '')}", styles['MinJob']))
            story.append(Paragraph(f"{edu.get('institution', '')} · {edu.get('end_date', '')}", styles['MinCompany']))
            story.append(Spacer(1, 4))
    
    # Skills
    skills = data.get('skills', [])
    if skills:
        story.append(Paragraph('Skills', styles['MinSection']))
        story.append(Paragraph(', '.join(skills), styles['MinSummary']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

@api_router.get("/resumes/{resume_id}/pdf")
async def generate_pdf(resume_id: str, current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one({"id": resume_id, "user_id": current_user["id"]}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    template = resume.get('template', 'professional')
    
    if template == 'modern':
        pdf_buffer = generate_modern_pdf(resume)
    elif template == 'minimalist':
        pdf_buffer = generate_minimalist_pdf(resume)
    else:
        pdf_buffer = generate_professional_pdf(resume)
    
    filename = f"{resume.get('title', 'resume').replace(' ', '_')}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ============== PAYMENT ROUTES ==============

@api_router.post("/payments/create-checkout")
async def create_checkout(request: PaymentRequest, http_request: Request, current_user: dict = Depends(get_current_user)):
    if request.plan not in PRICING:
        raise HTTPException(status_code=400, detail="Invalid plan selected")
    
    amount = PRICING[request.plan]
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    
    host_url = request.origin_url
    webhook_url = f"{host_url}/api/webhook/stripe"
    success_url = f"{host_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/pricing"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    checkout_request = CheckoutSessionRequest(
        amount=float(amount),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": current_user["id"],
            "plan": request.plan,
            "email": current_user["email"]
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": current_user["id"],
        "email": current_user["email"],
        "amount": amount,
        "currency": "usd",
        "plan": request.plan,
        "status": "pending",
        "payment_status": "initiated",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.payment_transactions.insert_one(transaction)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, current_user: dict = Depends(get_current_user)):
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction record
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    
    if transaction and status.payment_status == "paid":
        # Check if already processed
        if transaction.get("payment_status") != "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "status": "complete",
                    "payment_status": "paid",
                    "completed_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            # Upgrade user to premium
            plan = transaction.get("plan", "lifetime")
            await db.users.update_one(
                {"id": current_user["id"]},
                {"$set": {
                    "is_premium": True,
                    "subscription_type": plan
                }}
            )
    elif transaction and status.status == "expired":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"status": "expired", "payment_status": "expired"}}
        )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount": status.amount_total / 100,  # Convert from cents
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            
            if transaction and transaction.get("payment_status") != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {
                        "status": "complete",
                        "payment_status": "paid",
                        "completed_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
                
                user_id = transaction.get("user_id")
                plan = transaction.get("plan", "lifetime")
                
                await db.users.update_one(
                    {"id": user_id},
                    {"$set": {
                        "is_premium": True,
                        "subscription_type": plan
                    }}
                )
        
        return {"received": True}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return {"received": True}

# ============== LINKEDIN IMPORT (MOCK) ==============

@api_router.post("/linkedin/import")
async def import_linkedin(request: LinkedInImportRequest, current_user: dict = Depends(get_current_user)):
    """
    NOTE: This is a MOCKED implementation. Real LinkedIn import requires 
    LinkedIn API OAuth integration which needs LinkedIn Developer approval.
    """
    # Mock data based on URL
    mock_data = {
        "personal_info": {
            "full_name": "John Doe",
            "email": current_user["email"],
            "linkedin": request.linkedin_url,
            "summary": "Experienced professional with a passion for technology and innovation."
        },
        "experiences": [
            {
                "id": str(uuid.uuid4()),
                "company": "Tech Company",
                "position": "Senior Developer",
                "start_date": "2020-01",
                "end_date": "",
                "current": True,
                "description": "Leading development of key products",
                "achievements": ["Led team of 5 developers", "Increased performance by 40%"]
            }
        ],
        "education": [
            {
                "id": str(uuid.uuid4()),
                "institution": "University",
                "degree": "Bachelor's",
                "field": "Computer Science",
                "start_date": "2014",
                "end_date": "2018",
                "gpa": "",
                "achievements": []
            }
        ],
        "skills": ["JavaScript", "Python", "React", "Node.js", "AWS"]
    }
    
    return {
        "message": "LinkedIn data imported (MOCKED - real LinkedIn API requires OAuth integration)",
        "data": mock_data,
        "is_mocked": True
    }

# ============== ROOT ROUTE ==============

@api_router.get("/")
async def root():
    return {"message": "ResumeAI API", "version": "1.0.0"}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
