import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../App";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { 
  FileText, Plus, MoreVertical, Download, Edit, Trash2, 
  Crown, LogOut, User, Sparkles, Target, Clock, Settings,
  Mail, Copy, History, Share2, Moon, Sun, Link as LinkIcon, 
  BarChart3, Eye, ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";

const Dashboard = () => {
  const { user, token, logout, API } = useAuth();
  const { theme, toggleTheme, saveThemeToBackend } = useTheme();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedResumeForShare, setSelectedResumeForShare] = useState(null);
  const [shareInfo, setShareInfo] = useState(null);
  const [sharePassword, setSharePassword] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [creatingShare, setCreatingShare] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchResumes();
    fetchAnalytics();
  }, []);

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
      toast.error("Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const response = await fetch(`${API}/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Untitled Resume",
          template: "professional",
          data: {
            personal_info: { full_name: user?.full_name || "", email: user?.email || "" },
            experiences: [],
            education: [],
            skills: [],
            projects: [],
            certifications: []
          }
        }),
      });

      if (response.ok) {
        const resume = await response.json();
        navigate(`/builder/${resume.id}`);
      }
    } catch (error) {
      toast.error("Failed to create resume");
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`${API}/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r.id !== id));
        toast.success("Resume deleted");
      }
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  const downloadPDF = async (id, title) => {
    try {
      const response = await fetch(`${API}/resumes/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/\s+/g, "_")}.pdf`;
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

  const duplicateResume = async (id) => {
    try {
      const response = await fetch(`${API}/resumes/${id}/duplicate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const newResume = await response.json();
        setResumes([newResume, ...resumes]);
        toast.success("Resume duplicated!");
      }
    } catch (error) {
      toast.error("Failed to duplicate resume");
    }
  };

  const getATSScoreColor = (score) => {
    if (!score) return "bg-slate-100 text-slate-600";
    if (score >= 80) return "bg-emerald-100 text-emerald-700";
    if (score >= 60) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="dashboard-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              VitaeCraft
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!user?.is_premium && (
              <Link to="/pricing">
                <Button 
                  className="bg-gradient-to-r from-[#002FA7] to-[#FF4F00] text-white"
                  data-testid="upgrade-btn"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  data-testid="user-menu-btn"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.full_name?.charAt(0) || "U"}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-medium text-[#0F172A]">{user?.full_name}</p>
                  <p className="text-sm text-[#64748B]">{user?.email}</p>
                  {user?.is_premium && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gradient-to-r from-[#002FA7] to-[#FF4F00] text-white text-xs rounded-full">
                      <Crown className="w-3 h-3" />
                      Premium
                    </span>
                  )}
                </div>
                <DropdownMenuItem 
                  onClick={() => navigate("/settings")} 
                  className="cursor-pointer"
                  data-testid="settings-btn"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-red-600 cursor-pointer"
                  data-testid="logout-btn"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 
            className="text-3xl font-bold text-[#0F172A] mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="dashboard-title"
          >
            Welcome back, {user?.full_name?.split(" ")[0]}!
          </h1>
          <p className="text-[#64748B]">
            {resumes.length === 0 
              ? "Create your first resume and start your journey to landing your dream job."
              : `You have ${resumes.length} resume${resumes.length > 1 ? "s" : ""}. Keep building!`
            }
          </p>
        </motion.div>

        {/* Quick Stats for Premium Users */}
        {user?.is_premium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#002FA7]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#002FA7]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0F172A]">{resumes.length}</p>
                  <p className="text-sm text-[#64748B]">Total Resumes</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF4F00]/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#FF4F00]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0F172A]">Unlimited</p>
                  <p className="text-sm text-[#64748B]">AI Enhancements</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0F172A]">Active</p>
                  <p className="text-sm text-[#64748B]">ATS Optimization</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resumes Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-xl font-semibold text-[#0F172A]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Your Resumes
          </h2>
          <Button 
            onClick={createNewResume}
            className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white"
            data-testid="create-resume-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Resume
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002FA7]"></div>
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-12 text-center"
          >
            <div className="w-16 h-16 bg-[#002FA7]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#002FA7]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              No resumes yet
            </h3>
            <p className="text-[#64748B] mb-6">
              Create your first resume to get started
            </p>
            <Button 
              onClick={createNewResume}
              className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white"
              data-testid="empty-create-resume-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden group"
                data-testid={`resume-card-${index}`}
              >
                {/* Template Preview */}
                <div className={`h-32 bg-gradient-to-br ${
                  resume.template === 'modern' 
                    ? 'from-[#FF4F00]/10 to-orange-100' 
                    : resume.template === 'minimalist'
                    ? 'from-slate-100 to-slate-50'
                    : 'from-[#002FA7]/10 to-blue-100'
                } flex items-center justify-center`}>
                  <div className="w-20 h-28 bg-white shadow-md rounded-sm border border-slate-200 relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      resume.template === 'modern' ? 'bg-[#FF4F00]' : 
                      resume.template === 'minimalist' ? 'bg-slate-300' : 'bg-[#002FA7]'
                    }`} />
                    <div className="p-2 space-y-1">
                      <div className="h-2 w-10 bg-slate-200 rounded" />
                      <div className="h-1 w-8 bg-slate-100 rounded" />
                      <div className="h-1 w-12 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-[#0F172A] mb-1 line-clamp-1">
                        {resume.title}
                      </h3>
                      <p className="text-xs text-[#64748B] capitalize">{resume.template} Template</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`resume-menu-${index}`}
                        >
                          <MoreVertical className="w-4 h-4 text-[#64748B]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/builder/${resume.id}`)} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateResume(resume.id)} className="cursor-pointer">
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadPDF(resume.id, resume.title)} className="cursor-pointer">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/cover-letter?resume=${resume.id}`)} className="cursor-pointer">
                          <Mail className="w-4 h-4 mr-2" />
                          Create Cover Letter
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteResume(resume.id)} className="text-red-600 cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#64748B]">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(resume.updated_at)}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${getATSScoreColor(resume.ats_score)}`}>
                      {resume.ats_score ? `ATS ${resume.ats_score}` : "No score"}
                    </span>
                  </div>

                  <Button
                    onClick={() => navigate(`/builder/${resume.id}`)}
                    variant="outline"
                    className="w-full mt-4 border-slate-200"
                    data-testid={`edit-resume-${index}`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Continue Editing
                  </Button>
                </div>
              </motion.div>
            ))}

            {/* Create New Card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: resumes.length * 0.05 }}
              onClick={createNewResume}
              className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center hover:border-[#002FA7] hover:bg-[#002FA7]/5 transition-all cursor-pointer min-h-[280px]"
              data-testid="new-resume-card"
            >
              <div className="w-12 h-12 bg-[#002FA7]/10 rounded-xl flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-[#002FA7]" />
              </div>
              <p className="font-medium text-[#0F172A]">Create New Resume</p>
              <p className="text-sm text-[#64748B]">Start fresh</p>
            </motion.button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
