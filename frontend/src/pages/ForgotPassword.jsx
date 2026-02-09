import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { FileText, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSent(true);
        toast.success("Reset link sent!");
      } else {
        // Still show success for security (don't reveal if email exists)
        setSent(true);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <Link to="/" className="flex items-center gap-2 mb-8" data-testid="logo">
          <div className="w-10 h-10 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            VitaeCraft
          </span>
        </Link>

        {!sent ? (
          <>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Forgot password?
            </h1>
            <p className="text-[#64748B] mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0F172A]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-slate-200"
                    required
                    data-testid="email-input"
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
                  "Send Reset Link"
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
              Check your email
            </h1>
            <p className="text-[#64748B] mb-6">
              If an account exists for {email}, you'll receive a password reset link shortly.
            </p>
            <Link to="/login">
              <Button variant="outline" className="border-slate-200">
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
