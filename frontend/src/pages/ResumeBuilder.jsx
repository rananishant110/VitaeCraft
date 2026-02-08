import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import {
  FileText, ArrowLeft, Save, Download, Plus, Trash2, Sparkles,
  Target, User, Briefcase, GraduationCap, Code, Award, ChevronDown,
  ChevronUp, Wand2, Upload, Loader2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API } = useAuth();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [resume, setResume] = useState({
    title: "Untitled Resume",
    template: "professional",
    data: {
      personal_info: { full_name: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "" },
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    }
  });
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    if (id) fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`${API}/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setResume(data);
      } else {
        toast.error("Resume not found");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const url = id ? `${API}/resumes/${id}` : `${API}/resumes`;
      const method = id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resume),
      });

      if (response.ok) {
        const data = await response.json();
        if (!id) navigate(`/builder/${data.id}`, { replace: true });
        toast.success("Resume saved!");
      }
    } catch (error) {
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    if (!id) {
      toast.error("Please save your resume first");
      return;
    }
    try {
      const response = await fetch(`${API}/resumes/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${resume.title.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("PDF downloaded!");
      }
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      data: {
        ...prev.data,
        personal_info: { ...prev.data.personal_info, [field]: value }
      }
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      data: {
        ...prev.data,
        experiences: [...prev.data.experiences, {
          id: Date.now().toString(),
          company: "",
          position: "",
          start_date: "",
          end_date: "",
          current: false,
          description: "",
          achievements: [""]
        }]
      }
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume(prev => {
      const experiences = [...prev.data.experiences];
      experiences[index] = { ...experiences[index], [field]: value };
      return { ...prev, data: { ...prev.data, experiences } };
    });
  };

  const removeExperience = (index) => {
    setResume(prev => ({
      ...prev,
      data: {
        ...prev.data,
        experiences: prev.data.experiences.filter((_, i) => i !== index)
      }
    }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      data: {
        ...prev.data,
        education: [...prev.data.education, {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          field: "",
          start_date: "",
          end_date: "",
          gpa: "",
          achievements: []
        }]
      }
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume(prev => {
      const education = [...prev.data.education];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, data: { ...prev.data, education } };
    });
  };

  const removeEducation = (index) => {
    setResume(prev => ({
      ...prev,
      data: { ...prev.data, education: prev.data.education.filter((_, i) => i !== index) }
    }));
  };

  const addSkill = (skill) => {
    if (skill && !resume.data.skills.includes(skill)) {
      setResume(prev => ({
        ...prev,
        data: { ...prev.data, skills: [...prev.data.skills, skill] }
      }));
    }
  };

  const removeSkill = (index) => {
    setResume(prev => ({
      ...prev,
      data: { ...prev.data, skills: prev.data.skills.filter((_, i) => i !== index) }
    }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      data: {
        ...prev.data,
        projects: [...prev.data.projects, {
          id: Date.now().toString(),
          name: "",
          description: "",
          technologies: [],
          url: "",
          highlights: []
        }]
      }
    }));
  };

  const updateProject = (index, field, value) => {
    setResume(prev => {
      const projects = [...prev.data.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, data: { ...prev.data, projects } };
    });
  };

  const removeProject = (index) => {
    setResume(prev => ({
      ...prev,
      data: { ...prev.data, projects: prev.data.projects.filter((_, i) => i !== index) }
    }));
  };

  const enhanceWithSTAR = async (expIndex) => {
    if (!user?.is_premium) {
      toast.error("Premium required for AI features");
      navigate("/pricing");
      return;
    }

    const exp = resume.data.experiences[expIndex];
    if (!exp.description && exp.achievements.filter(a => a).length === 0) {
      toast.error("Add some description first");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`${API}/ai/star-enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          experience_description: exp.description || exp.achievements.join(". "),
          role: exp.position
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const bullets = data.enhanced_text.split("\n").filter(b => b.trim()).map(b => b.replace(/^[•\-\*]\s*/, ""));
        updateExperience(expIndex, "achievements", bullets);
        toast.success("Enhanced with STAR methodology!");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to enhance");
      }
    } catch (error) {
      toast.error("AI enhancement failed");
    } finally {
      setAiLoading(false);
    }
  };

  const optimizeForATS = async () => {
    if (!user?.is_premium) {
      toast.error("Premium required for AI features");
      navigate("/pricing");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    if (!id) {
      toast.error("Please save your resume first");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`${API}/ai/ats-optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resume_id: id,
          job_description: jobDescription
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAtsResult(data);
        toast.success("ATS analysis complete!");
      } else {
        const error = await response.json();
        toast.error(error.detail || "ATS analysis failed");
      }
    } catch (error) {
      toast.error("ATS optimization failed");
    } finally {
      setAiLoading(false);
    }
  };

  const tailorResume = async () => {
    if (!user?.is_premium) {
      toast.error("Premium required for AI features");
      navigate("/pricing");
      return;
    }

    if (!jobDescription.trim() || !id) {
      toast.error("Save resume and add job description first");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`${API}/ai/tailor-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resume_id: id,
          job_description: jobDescription
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.tailored_summary) {
          updatePersonalInfo("summary", data.tailored_summary);
        }
        if (data.skills_to_add) {
          data.skills_to_add.forEach(skill => addSkill(skill));
        }
        toast.success("Resume tailored for job!");
      }
    } catch (error) {
      toast.error("Tailoring failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002FA7]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors" data-testid="back-btn">
              <ArrowLeft className="w-5 h-5 text-[#64748B]" />
            </Link>
            <Input
              value={resume.title}
              onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 w-64"
              placeholder="Resume Title"
              data-testid="resume-title-input"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select value={resume.template} onValueChange={(value) => setResume(prev => ({ ...prev, template: value }))}>
              <SelectTrigger className="w-40" data-testid="template-select">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={downloadPDF} className="border-slate-200" data-testid="download-btn">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>

            <Button onClick={saveResume} disabled={saving} className="bg-[#002FA7] hover:bg-[#002FA7]/90" data-testid="save-btn">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Tabs */}
        <div className="lg:hidden mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
              <TabsTrigger value="ai" className="flex-1">AI Tools</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className={`space-y-4 ${activeTab !== "edit" ? "hidden lg:block" : ""}`}>
            <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-3">
              {/* Personal Info */}
              <AccordionItem value="personal" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="hover:no-underline py-4" data-testid="personal-section">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#002FA7]/10 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-[#002FA7]" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">Personal Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={resume.data.personal_info.full_name}
                        onChange={(e) => updatePersonalInfo("full_name", e.target.value)}
                        placeholder="John Doe"
                        data-testid="fullname-field"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={resume.data.personal_info.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        placeholder="john@example.com"
                        data-testid="email-field"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={resume.data.personal_info.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        data-testid="phone-field"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={resume.data.personal_info.location}
                        onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        placeholder="New York, NY"
                        data-testid="location-field"
                      />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input
                        value={resume.data.personal_info.linkedin}
                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                      />
                    </div>
                    <div>
                      <Label>Portfolio</Label>
                      <Input
                        value={resume.data.personal_info.portfolio}
                        onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                        placeholder="johndoe.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Professional Summary</Label>
                    <Textarea
                      value={resume.data.personal_info.summary}
                      onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                      placeholder="A brief summary of your professional background..."
                      rows={4}
                      data-testid="summary-field"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Experience */}
              <AccordionItem value="experience" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="hover:no-underline py-4" data-testid="experience-section">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FF4F00]/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-[#FF4F00]" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">Experience</span>
                    <span className="text-sm text-[#64748B]">({resume.data.experiences.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {resume.data.experiences.map((exp, index) => (
                    <div key={exp.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#64748B]">Experience {index + 1}</span>
                        <div className="flex items-center gap-2">
                          {user?.is_premium && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => enhanceWithSTAR(index)}
                              disabled={aiLoading}
                              className="text-xs border-[#002FA7] text-[#002FA7]"
                              data-testid={`star-enhance-${index}`}
                            >
                              <Wand2 className="w-3 h-3 mr-1" />
                              STAR
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(index, "position", e.target.value)}
                            placeholder="Software Engineer"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            placeholder="Tech Company"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Start Date</Label>
                          <Input
                            value={exp.start_date}
                            onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                            placeholder="Jan 2020"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End Date</Label>
                          <Input
                            value={exp.current ? "Present" : exp.end_date}
                            onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                            placeholder="Present"
                            className="h-9"
                            disabled={exp.current}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Description / Achievements</Label>
                        <Textarea
                          value={exp.achievements?.join("\n") || exp.description}
                          onChange={(e) => updateExperience(index, "achievements", e.target.value.split("\n"))}
                          placeholder="• Led development of key features&#10;• Increased performance by 40%"
                          rows={4}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full border-dashed" data-testid="add-experience-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Education */}
              <AccordionItem value="education" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="hover:no-underline py-4" data-testid="education-section">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">Education</span>
                    <span className="text-sm text-[#64748B]">({resume.data.education.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {resume.data.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#64748B]">Education {index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label className="text-xs">Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                            placeholder="University Name"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            placeholder="Bachelor's"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                            placeholder="Computer Science"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Start Year</Label>
                          <Input
                            value={edu.start_date}
                            onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                            placeholder="2016"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End Year</Label>
                          <Input
                            value={edu.end_date}
                            onChange={(e) => updateEducation(index, "end_date", e.target.value)}
                            placeholder="2020"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addEducation} className="w-full border-dashed" data-testid="add-education-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Skills */}
              <AccordionItem value="skills" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="hover:no-underline py-4" data-testid="skills-section">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">Skills</span>
                    <span className="text-sm text-[#64748B]">({resume.data.skills.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {resume.data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#002FA7]/10 text-[#002FA7] rounded-full text-sm"
                      >
                        {skill}
                        <button onClick={() => removeSkill(index)} className="hover:text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill (press Enter)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      data-testid="skill-input"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Projects */}
              <AccordionItem value="projects" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="hover:no-underline py-4" data-testid="projects-section">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">Projects</span>
                    <span className="text-sm text-[#64748B]">({resume.data.projects.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {resume.data.projects.map((proj, index) => (
                    <div key={proj.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#64748B]">Project {index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Project Name</Label>
                          <Input
                            value={proj.name}
                            onChange={(e) => updateProject(index, "name", e.target.value)}
                            placeholder="Project Name"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            value={proj.description}
                            onChange={(e) => updateProject(index, "description", e.target.value)}
                            placeholder="Brief description of the project"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Technologies (comma separated)</Label>
                          <Input
                            value={proj.technologies?.join(", ") || ""}
                            onChange={(e) => updateProject(index, "technologies", e.target.value.split(",").map(t => t.trim()))}
                            placeholder="React, Node.js, MongoDB"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addProject} className="w-full border-dashed" data-testid="add-project-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right Panel - Preview & AI */}
          <div className="space-y-4">
            {/* Preview */}
            <div className={`${activeTab !== "preview" && activeTab !== "edit" ? "hidden lg:block" : activeTab === "ai" ? "hidden lg:block" : ""}`}>
              <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
                <h3 className="font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Live Preview
                </h3>
                <div className={`resume-preview p-6 text-left text-xs overflow-auto max-h-[600px] ${
                  resume.template === 'modern' ? 'border-t-4 border-[#FF4F00]' :
                  resume.template === 'minimalist' ? 'border border-slate-200' :
                  'border-l-4 border-[#002FA7]'
                }`} data-testid="resume-preview">
                  {/* Header */}
                  <div className="mb-4">
                    <h1 className={`text-xl font-bold ${resume.template === 'modern' ? 'uppercase text-[#0F172A]' : 'text-[#002FA7]'}`}>
                      {resume.data.personal_info.full_name || "Your Name"}
                    </h1>
                    <p className="text-[#64748B] text-[10px] mt-1">
                      {[resume.data.personal_info.email, resume.data.personal_info.phone, resume.data.personal_info.location]
                        .filter(Boolean).join(" | ")}
                    </p>
                  </div>

                  {/* Summary */}
                  {resume.data.personal_info.summary && (
                    <div className="mb-4">
                      <h2 className={`text-sm font-semibold mb-1 ${resume.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7]'}`}>
                        {resume.template === 'modern' ? '— ABOUT —' : 'PROFESSIONAL SUMMARY'}
                      </h2>
                      <p className="text-[#374151] leading-relaxed">{resume.data.personal_info.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resume.data.experiences.length > 0 && (
                    <div className="mb-4">
                      <h2 className={`text-sm font-semibold mb-2 ${resume.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7]'}`}>
                        {resume.template === 'modern' ? '— EXPERIENCE —' : 'EXPERIENCE'}
                      </h2>
                      {resume.data.experiences.map((exp, i) => (
                        <div key={i} className="mb-3">
                          <p className="font-semibold text-[#0F172A]">{exp.position}</p>
                          <p className="text-[#64748B] text-[10px]">
                            {exp.company} | {exp.start_date} - {exp.current ? "Present" : exp.end_date}
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {exp.achievements?.filter(a => a).map((ach, j) => (
                              <li key={j} className="text-[#374151]">• {ach}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resume.data.education.length > 0 && (
                    <div className="mb-4">
                      <h2 className={`text-sm font-semibold mb-2 ${resume.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7]'}`}>
                        {resume.template === 'modern' ? '— EDUCATION —' : 'EDUCATION'}
                      </h2>
                      {resume.data.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                          <p className="font-semibold text-[#0F172A]">{edu.degree} in {edu.field}</p>
                          <p className="text-[#64748B] text-[10px]">{edu.institution} | {edu.end_date}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resume.data.skills.length > 0 && (
                    <div className="mb-4">
                      <h2 className={`text-sm font-semibold mb-1 ${resume.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7]'}`}>
                        {resume.template === 'modern' ? '— SKILLS —' : 'SKILLS'}
                      </h2>
                      <p className="text-[#374151]">{resume.data.skills.join(" • ")}</p>
                    </div>
                  )}

                  {/* Projects */}
                  {resume.data.projects.length > 0 && (
                    <div>
                      <h2 className={`text-sm font-semibold mb-2 ${resume.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7]'}`}>
                        {resume.template === 'modern' ? '— PROJECTS —' : 'PROJECTS'}
                      </h2>
                      {resume.data.projects.map((proj, i) => (
                        <div key={i} className="mb-2">
                          <p className="font-semibold text-[#0F172A]">{proj.name}</p>
                          <p className="text-[#374151]">{proj.description}</p>
                          {proj.technologies?.length > 0 && (
                            <p className="text-[#64748B] text-[10px]">Tech: {proj.technologies.join(", ")}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Tools */}
            <div className={`${activeTab !== "ai" ? "hidden lg:block" : ""}`}>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF4F00]" />
                  AI Tools
                  {!user?.is_premium && (
                    <span className="text-xs bg-[#FF4F00]/10 text-[#FF4F00] px-2 py-0.5 rounded-full">Premium</span>
                  )}
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Job Description (for ATS & Tailoring)</Label>
                    <Textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here to optimize your resume..."
                      rows={4}
                      className="mt-1"
                      data-testid="job-description-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={optimizeForATS}
                      disabled={aiLoading || !user?.is_premium}
                      className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white"
                      data-testid="ats-optimize-btn"
                    >
                      {aiLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
                      ATS Score
                    </Button>
                    <Button
                      onClick={tailorResume}
                      disabled={aiLoading || !user?.is_premium}
                      variant="outline"
                      className="border-[#FF4F00] text-[#FF4F00] hover:bg-[#FF4F00]/10"
                      data-testid="tailor-btn"
                    >
                      {aiLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                      Tailor
                    </Button>
                  </div>

                  {/* ATS Results */}
                  {atsResult && (
                    <div className="p-4 bg-slate-50 rounded-lg space-y-3" data-testid="ats-results">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#0F172A]">ATS Score</span>
                        <span className={`px-3 py-1 rounded-full font-mono text-sm ${
                          atsResult.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          atsResult.score >= 60 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {atsResult.score}/100
                        </span>
                      </div>

                      {atsResult.missing_keywords?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-[#0F172A] mb-1">Missing Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {atsResult.missing_keywords.map((kw, i) => (
                              <button
                                key={i}
                                onClick={() => addSkill(kw)}
                                className="text-xs px-2 py-1 bg-[#FF4F00]/10 text-[#FF4F00] rounded-full hover:bg-[#FF4F00]/20"
                              >
                                + {kw}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {atsResult.suggestions?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-[#0F172A] mb-1">Suggestions:</p>
                          <ul className="text-sm text-[#64748B] space-y-1">
                            {atsResult.suggestions.map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!user?.is_premium && (
                    <Link to="/pricing">
                      <Button className="w-full bg-gradient-to-r from-[#002FA7] to-[#FF4F00] text-white" data-testid="upgrade-ai-btn">
                        Upgrade to Unlock AI Features
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
