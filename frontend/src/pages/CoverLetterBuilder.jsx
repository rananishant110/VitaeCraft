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
  FileText, ArrowLeft, Save, Download, Sparkles, Loader2,
  Copy, Building, Briefcase, Wand2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const CoverLetterBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API } = useAuth();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resumes, setResumes] = useState([]);
  
  const [coverLetter, setCoverLetter] = useState({
    title: "Untitled Cover Letter",
    resume_id: "",
    company_name: "",
    job_description: "",
    content: ""
  });

  useEffect(() => {
    fetchResumes();
    if (id) fetchCoverLetter();
  }, [id]);

  const fetchResumes = async () => {
    try {
      const response = await fetch(`${API}/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error("Failed to fetch resumes");
    }
  };

  const fetchCoverLetter = async () => {
    try {
      const response = await fetch(`${API}/cover-letters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCoverLetter(data);
      } else {
        toast.error("Cover letter not found");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load cover letter");
    } finally {
      setLoading(false);
    }
  };

  const saveCoverLetter = async () => {
    if (!coverLetter.resume_id) {
      toast.error("Please select a resume");
      return;
    }

    setSaving(true);
    try {
      const url = id ? `${API}/cover-letters/${id}` : `${API}/cover-letters`;
      const method = id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(coverLetter),
      });

      if (response.ok) {
        const data = await response.json();
        if (!id) navigate(`/cover-letter/${data.id}`, { replace: true });
        toast.success("Cover letter saved!");
      }
    } catch (error) {
      toast.error("Failed to save cover letter");
    } finally {
      setSaving(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!user?.is_premium) {
      toast.error("Premium required for AI features");
      navigate("/pricing");
      return;
    }

    if (!coverLetter.resume_id) {
      toast.error("Please select a resume first");
      return;
    }

    if (!coverLetter.job_description.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    if (!coverLetter.company_name.trim()) {
      toast.error("Please enter the company name");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${API}/ai/generate-cover-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resume_id: coverLetter.resume_id,
          job_description: coverLetter.job_description,
          company_name: coverLetter.company_name,
          tone: "professional"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCoverLetter(prev => ({ ...prev, content: data.cover_letter }));
        toast.success("Cover letter generated!");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Generation failed");
      }
    } catch (error) {
      toast.error("Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter.content);
    toast.success("Copied to clipboard!");
  };

  const downloadAsTxt = () => {
    const blob = new Blob([coverLetter.content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${coverLetter.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#002FA7]" />
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
              value={coverLetter.title}
              onChange={(e) => setCoverLetter(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 w-64"
              placeholder="Cover Letter Title"
              data-testid="title-input"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={copyToClipboard} className="border-slate-200" data-testid="copy-btn">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={downloadAsTxt} className="border-slate-200" data-testid="download-btn">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={saveCoverLetter} disabled={saving} className="bg-[#002FA7] hover:bg-[#002FA7]/90" data-testid="save-btn">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-4">
            {/* Resume Selection */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#002FA7]" />
                Select Resume
              </h3>
              <Select 
                value={coverLetter.resume_id} 
                onValueChange={(value) => setCoverLetter(prev => ({ ...prev, resume_id: value }))}
              >
                <SelectTrigger data-testid="resume-select">
                  <SelectValue placeholder="Choose a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {resumes.length === 0 && (
                <p className="text-sm text-[#64748B] mt-2">
                  No resumes found. <Link to="/builder" className="text-[#002FA7]">Create one first</Link>
                </p>
              )}
            </div>

            {/* Company & Job Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#FF4F00]" />
                Job Details
              </h3>
              
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={coverLetter.company_name}
                  onChange={(e) => setCoverLetter(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="e.g., Google, Microsoft"
                  data-testid="company-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  value={coverLetter.job_description}
                  onChange={(e) => setCoverLetter(prev => ({ ...prev, job_description: e.target.value }))}
                  placeholder="Paste the job description here..."
                  rows={8}
                  data-testid="job-description-input"
                />
              </div>

              <Button
                onClick={generateCoverLetter}
                disabled={generating || !user?.is_premium}
                className="w-full bg-gradient-to-r from-[#002FA7] to-[#FF4F00] text-white"
                data-testid="generate-btn"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                {user?.is_premium ? "Generate with AI" : "Upgrade to Generate"}
              </Button>

              {!user?.is_premium && (
                <p className="text-xs text-center text-[#64748B]">
                  AI generation requires <Link to="/pricing" className="text-[#002FA7]">Premium</Link>
                </p>
              )}
            </div>
          </div>

          {/* Right Panel - Editor & Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF4F00]" />
                Cover Letter Content
              </h3>
              <Textarea
                value={coverLetter.content}
                onChange={(e) => setCoverLetter(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Your cover letter content will appear here. You can edit it after generation or write your own."
                rows={20}
                className="font-serif text-[15px] leading-relaxed"
                data-testid="content-textarea"
              />
            </div>

            {/* Preview */}
            {coverLetter.content && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-[#0F172A] mb-4">Preview</h3>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-[#374151] leading-relaxed" style={{ fontFamily: 'Fraunces, serif' }}>
                    {coverLetter.content}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
