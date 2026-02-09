import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { FileText, Download, Lock, Loader2, Eye } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PublicResume = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResume();
  }, [slug]);

  const fetchResume = async (pwd = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL(`${API}/public/resume/${slug}`);
      if (pwd) url.searchParams.append("password", pwd);
      
      const response = await fetch(url.toString());
      
      if (response.ok) {
        const data = await response.json();
        if (data.password_required) {
          setPasswordRequired(true);
          setResume(null);
        } else {
          setResume(data);
          setPasswordRequired(false);
        }
      } else if (response.status === 401) {
        setError("Invalid password");
      } else {
        setError("Resume not found");
      }
    } catch (error) {
      setError("Failed to load resume");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    fetchResume(password);
  };

  const downloadPDF = async () => {
    try {
      const url = new URL(`${API}/public/resume/${slug}/pdf`);
      if (password) url.searchParams.append("password", password);
      
      const response = await fetch(url.toString());
      
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${resume?.title || "resume"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        toast.success("PDF downloaded!");
      }
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#002FA7]" />
      </div>
    );
  }

  if (error && !passwordRequired) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-900 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">
            {error}
          </h1>
          <p className="text-[#64748B] dark:text-slate-400">
            This resume may have been removed or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-900 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#002FA7]/10 dark:bg-[#002FA7]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#002FA7]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Password Protected
            </h1>
            <p className="text-[#64748B] dark:text-slate-400 mb-6">
              This resume is password protected. Enter the password to view.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
                data-testid="password-input"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-[#002FA7] hover:bg-[#002FA7]/90"
                data-testid="submit-password-btn"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "View Resume"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const data = resume?.data || {};
  const personal = data.personal_info || {};

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#0F172A] dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              VitaeCraft
            </span>
          </div>
          <Button onClick={downloadPDF} className="bg-[#002FA7] hover:bg-[#002FA7]/90" data-testid="download-pdf-btn">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 ${
            resume?.template === 'modern' ? 'border-t-4 border-[#FF4F00]' :
            resume?.template === 'minimalist' ? 'border border-slate-200 dark:border-slate-700' :
            'border-l-4 border-[#002FA7]'
          }`}
          data-testid="resume-content"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className={`text-3xl font-bold mb-2 ${
              resume?.template === 'modern' ? 'uppercase text-[#0F172A] dark:text-white' : 'text-[#002FA7] dark:text-blue-400'
            }`} style={{ fontFamily: 'Outfit, sans-serif' }}>
              {personal.full_name || "Name"}
            </h1>
            <p className="text-[#64748B] dark:text-slate-400">
              {[personal.email, personal.phone, personal.location].filter(Boolean).join(" | ")}
            </p>
            {(personal.linkedin || personal.portfolio) && (
              <p className="text-[#64748B] dark:text-slate-400 text-sm mt-1">
                {[personal.linkedin, personal.portfolio].filter(Boolean).join(" | ")}
              </p>
            )}
          </div>

          {/* Summary */}
          {personal.summary && (
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-2 ${
                resume?.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7] dark:text-blue-400'
              }`}>
                {resume?.template === 'modern' ? '— ABOUT —' : 'Professional Summary'}
              </h2>
              <p className="text-[#374151] dark:text-slate-300 leading-relaxed">{personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experiences?.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-3 ${
                resume?.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7] dark:text-blue-400'
              }`}>
                {resume?.template === 'modern' ? '— EXPERIENCE —' : 'Experience'}
              </h2>
              {data.experiences.map((exp, i) => (
                <div key={i} className="mb-4">
                  <h3 className="font-semibold text-[#0F172A] dark:text-white">{exp.position}</h3>
                  <p className="text-[#64748B] dark:text-slate-400 text-sm">
                    {exp.company} | {exp.start_date} - {exp.current ? "Present" : exp.end_date}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.achievements?.filter(a => a).map((ach, j) => (
                      <li key={j} className="text-[#374151] dark:text-slate-300 text-sm">• {ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education?.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-3 ${
                resume?.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7] dark:text-blue-400'
              }`}>
                {resume?.template === 'modern' ? '— EDUCATION —' : 'Education'}
              </h2>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <h3 className="font-semibold text-[#0F172A] dark:text-white">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-[#64748B] dark:text-slate-400 text-sm">
                    {edu.institution} | {edu.end_date}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-2 ${
                resume?.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7] dark:text-blue-400'
              }`}>
                {resume?.template === 'modern' ? '— SKILLS —' : 'Skills'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-[#002FA7]/10 dark:bg-[#002FA7]/20 text-[#002FA7] dark:text-blue-400 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && (
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${
                resume?.template === 'modern' ? 'text-[#FF4F00]' : 'text-[#002FA7] dark:text-blue-400'
              }`}>
                {resume?.template === 'modern' ? '— PROJECTS —' : 'Projects'}
              </h2>
              {data.projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <h3 className="font-semibold text-[#0F172A] dark:text-white">{proj.name}</h3>
                  <p className="text-[#374151] dark:text-slate-300 text-sm">{proj.description}</p>
                  {proj.technologies?.length > 0 && (
                    <p className="text-[#64748B] dark:text-slate-400 text-xs mt-1">
                      Tech: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[#64748B] dark:text-slate-500 text-sm mt-6">
          Created with <a href="/" className="text-[#002FA7] dark:text-blue-400 hover:underline">VitaeCraft</a>
        </p>
      </div>
    </div>
  );
};

export default PublicResume;
