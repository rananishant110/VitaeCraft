import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { FileText, CheckCircle, Loader2, XCircle, ArrowRight, Crown } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { token, API, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    } else {
      setStatus("failed");
    }
  }, [sessionId]);

  const pollPaymentStatus = async () => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setStatus("failed");
      toast.error("Payment verification timed out. Please contact support.");
      return;
    }

    try {
      const response = await fetch(`${API}/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentData(data);

        if (data.payment_status === "paid") {
          setStatus("success");
          await refreshUser();
          toast.success("Payment successful! Welcome to Premium!");
          return;
        } else if (data.status === "expired") {
          setStatus("failed");
          toast.error("Payment session expired");
          return;
        }

        // Continue polling
        setAttempts(prev => prev + 1);
        setTimeout(pollPaymentStatus, pollInterval);
      } else {
        setAttempts(prev => prev + 1);
        setTimeout(pollPaymentStatus, pollInterval);
      }
    } catch (error) {
      setAttempts(prev => prev + 1);
      setTimeout(pollPaymentStatus, pollInterval);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8" data-testid="logo">
          <div className="w-12 h-12 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Profolio
          </span>
        </Link>

        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 bg-[#002FA7]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-[#002FA7] animate-spin" />
              </div>
              <h1 
                className="text-2xl font-bold text-[#0F172A] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Verifying Payment
              </h1>
              <p className="text-[#64748B] mb-6">
                Please wait while we confirm your payment...
              </p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#002FA7] to-[#FF4F00]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(attempts / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
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
              <h1 
                className="text-2xl font-bold text-[#0F172A] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                data-testid="success-title"
              >
                Payment Successful!
              </h1>
              <p className="text-[#64748B] mb-6">
                Welcome to Profolio Premium! You now have access to all AI-powered features.
              </p>

              <div className="bg-gradient-to-r from-[#002FA7] to-[#FF4F00] p-4 rounded-xl mb-6">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Premium Member</span>
                </div>
              </div>

              {paymentData && (
                <div className="text-left bg-slate-50 rounded-lg p-4 mb-6 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#64748B]">Amount Paid</span>
                    <span className="font-medium text-[#0F172A]">${paymentData.amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Access Type</span>
                    <span className="font-medium text-[#0F172A]">Lifetime</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link to="/dashboard" className="block">
                  <Button 
                    className="w-full bg-[#002FA7] hover:bg-[#002FA7]/90 h-12"
                    data-testid="go-dashboard-btn"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/builder" className="block">
                  <Button variant="outline" className="w-full border-slate-200 h-12">
                    Create New Resume
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 
                className="text-2xl font-bold text-[#0F172A] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Payment Failed
              </h1>
              <p className="text-[#64748B] mb-6">
                We couldn't verify your payment. If you were charged, please contact our support team.
              </p>

              <div className="space-y-3">
                <Link to="/pricing" className="block">
                  <Button className="w-full bg-[#002FA7] hover:bg-[#002FA7]/90 h-12">
                    Try Again
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full border-slate-200 h-12">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Support Note */}
        <p className="mt-6 text-sm text-[#64748B]">
          Need help?{" "}
          <a href="mailto:support@profolio.com" className="text-[#002FA7] hover:underline">
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
