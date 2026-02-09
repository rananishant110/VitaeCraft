import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { FileText, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (response.ok) {
        setSuccess(true);
        toast.success("Password reset successfully!");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-4">Invalid Reset Link</h1>
          <p className="text-[#64748B] mb-6">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password">
            <Button className="bg-[#002FA7] hover:bg-[#002FA7]/90">
              Request New Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-8" data-testid="logo">
          <div className="w-10 h-10 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            VitaeCraft
          </span>
        </Link>

        {!success ? (
          <>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Set new password
            </h1>
            <p className="text-[#64748B] mb-8">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0F172A]">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-slate-200"
                    required
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#0F172A]">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
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
                className="w-full h-12 bg-[#002FA7] hover:bg-[#002FA7]/90 text-white"
                disabled={loading}
                data-testid="reset-submit-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Password Reset!
            </h1>
            <p className="text-[#64748B] mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Link to="/login">
              <Button className="bg-[#002FA7] hover:bg-[#002FA7]/90">
                Go to Login
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
