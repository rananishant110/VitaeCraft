import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } else {
        const error = await response.json();
        setStatus("error");
        setMessage(error.detail || "Verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8" data-testid="logo">
          <div className="w-12 h-12 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            VitaeCraft
          </span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 bg-[#002FA7]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-[#002FA7] animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Verifying Email
              </h1>
              <p className="text-[#64748B]">Please wait...</p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="success-title">
                Email Verified!
              </h1>
              <p className="text-[#64748B] mb-6">{message}</p>
              <Link to="/dashboard">
                <Button className="w-full bg-[#002FA7] hover:bg-[#002FA7]/90 h-12" data-testid="go-dashboard-btn">
                  Go to Dashboard
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Verification Failed
              </h1>
              <p className="text-[#64748B] mb-6">{message}</p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full bg-[#002FA7] hover:bg-[#002FA7]/90 h-12">
                    Go to Login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
