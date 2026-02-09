import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { 
  FileText, ArrowLeft, User, Mail, Lock, Eye, EyeOff, 
  Loader2, Crown, CheckCircle, AlertCircle, Send
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const Settings = () => {
  const { user, token, API, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile state
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Verification state
  const [sendingVerification, setSendingVerification] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ full_name: fullName }),
      });

      if (response.ok) {
        await refreshUser();
        toast.success("Profile updated!");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(`${API}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to change password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    setSendingVerification(true);

    try {
      const response = await fetch(`${API}/auth/resend-verification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Verification email sent!");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to send verification email");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors" data-testid="back-btn">
              <ArrowLeft className="w-5 h-5 text-[#64748B]" />
            </Link>
            <h1 className="text-xl font-semibold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Settings
            </h1>
          </div>
          <Link to="/" className="flex items-center gap-2" data-testid="logo">
            <div className="w-8 h-8 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              VitaeCraft
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">{user?.full_name}</h2>
                <p className="text-[#64748B]">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {user?.is_premium ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#002FA7] to-[#FF4F00] text-white text-xs rounded-full">
                      <Crown className="w-3 h-3" />
                      Premium ({user?.subscription_type})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">Free Plan</span>
                  )}
                  {user?.email_verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!user?.is_premium && (
              <Link to="/pricing">
                <Button className="bg-gradient-to-r from-[#002FA7] to-[#FF4F00] text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </Link>
            )}
          </div>

          {!user?.email_verified && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p className="text-amber-800">Please verify your email to access all features.</p>
              </div>
              <Button
                onClick={handleResendVerification}
                disabled={sendingVerification}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                {sendingVerification ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Resend
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start border-b border-slate-200 bg-transparent h-auto p-0 mb-6">
              <TabsTrigger 
                value="profile" 
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#002FA7] data-[state=active]:text-[#002FA7] rounded-none"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#002FA7] data-[state=active]:text-[#002FA7] rounded-none"
              >
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Profile Information
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-12 border-slate-200"
                        data-testid="fullname-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="pl-10 h-12 border-slate-200 bg-slate-50"
                      />
                    </div>
                    <p className="text-xs text-[#64748B]">Email cannot be changed</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#002FA7] hover:bg-[#002FA7]/90"
                    data-testid="save-profile-btn"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Change Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <Input
                        id="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 h-12 border-slate-200"
                        required
                        data-testid="current-password-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <Input
                        id="newPassword"
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="pl-10 pr-10 h-12 border-slate-200"
                        required
                        data-testid="new-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                      >
                        {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <Input
                        id="confirmPassword"
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12 border-slate-200"
                        required
                        data-testid="confirm-password-input"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={changingPassword}
                    className="bg-[#002FA7] hover:bg-[#002FA7]/90"
                    data-testid="change-password-btn"
                  >
                    {changingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Change Password
                  </Button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl border border-red-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-[#64748B] text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
