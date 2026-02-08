import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { 
  FileText, CheckCircle, Crown, ArrowLeft, Sparkles, 
  Target, Zap, Shield, ChevronRight, Loader2 
} from "lucide-react";

const PricingPage = () => {
  const { user, token, API } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (plan) => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (user?.is_premium) {
      toast.info("You already have premium access!");
      return;
    }

    setLoading(plan);
    try {
      const response = await fetch(`${API}/payments/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          origin_url: window.location.origin
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to create checkout");
      }
    } catch (error) {
      toast.error("Payment initialization failed");
    } finally {
      setLoading(null);
    }
  };

  const features = [
    { icon: <FileText className="w-5 h-5" />, title: "Unlimited Resumes", desc: "Create as many resumes as you need" },
    { icon: <Sparkles className="w-5 h-5" />, title: "AI STAR Enhancement", desc: "Transform experiences with STAR methodology" },
    { icon: <Target className="w-5 h-5" />, title: "ATS Optimization", desc: "Get real-time ATS scoring and suggestions" },
    { icon: <Zap className="w-5 h-5" />, title: "Job Description Matching", desc: "Tailor your resume for any job instantly" },
    { icon: <Shield className="w-5 h-5" />, title: "All Premium Templates", desc: "Access all professional templates" },
    { icon: <Crown className="w-5 h-5" />, title: "Lifetime Access", desc: "One payment, forever access" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="logo">
            <div className="w-10 h-10 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Profolio
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {token ? (
              <Link to="/dashboard">
                <Button variant="outline" className="border-slate-200" data-testid="dashboard-btn">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" data-testid="login-btn">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#002FA7] hover:bg-[#002FA7]/90" data-testid="signup-btn">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF4F00]/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-[#FF4F00]" />
              <span className="text-sm font-medium text-[#FF4F00]">Limited Time Offer - 80% OFF</span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Unlock Your Full
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#002FA7] to-[#FF4F00]">
                Career Potential
              </span>
            </h1>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Get lifetime access to all AI-powered features and create unlimited ATS-optimized resumes
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
            {/* Early Bird */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-[#002FA7] to-[#001d66] p-8 rounded-2xl shadow-xl overflow-hidden"
              data-testid="early-bird-card"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F00]/20 rounded-full blur-3xl" />
              
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#FF4F00] text-white text-xs font-bold rounded-full animate-pulse">
                BEST VALUE
              </div>

              <div className="relative">
                <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Early Bird Special
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">$9.99</span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-white/50 line-through text-lg">$49.99</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">Save 80%</span>
                </div>
                <p className="text-white/70 text-sm mb-6">One-time payment • Lifetime access</p>

                <ul className="space-y-3 mb-8">
                  {["Unlimited Resumes", "AI STAR Enhancement", "ATS Optimization", "Job Matching", "All Templates", "Priority Support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <CheckCircle className="w-5 h-5 text-[#FF4F00] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout("early_bird")}
                  disabled={loading === "early_bird" || user?.is_premium}
                  className="w-full bg-white text-[#002FA7] hover:bg-white/90 h-12 text-base font-semibold"
                  data-testid="early-bird-btn"
                >
                  {loading === "early_bird" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : user?.is_premium ? (
                    "Already Premium"
                  ) : (
                    <>
                      Get Early Bird Access
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Regular */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
              data-testid="lifetime-card"
            >
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Lifetime Premium
              </h3>
              <div className="mb-2">
                <span className="text-5xl font-bold text-[#0F172A]">$49.99</span>
              </div>
              <p className="text-[#64748B] text-sm mb-6">Regular price • Lifetime access</p>

              <ul className="space-y-3 mb-8">
                {["Unlimited Resumes", "AI STAR Enhancement", "ATS Optimization", "Job Matching", "All Templates", "Priority Support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#64748B]">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout("lifetime")}
                disabled={loading === "lifetime" || user?.is_premium}
                variant="outline"
                className="w-full border-slate-300 h-12 text-base"
                data-testid="lifetime-btn"
              >
                {loading === "lifetime" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : user?.is_premium ? (
                  "Already Premium"
                ) : (
                  "Get Lifetime Access"
                )}
              </Button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 
              className="text-2xl font-bold text-[#0F172A] text-center mb-8"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Everything Included
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                >
                  <div className="w-10 h-10 bg-[#002FA7]/10 rounded-lg flex items-center justify-center text-[#002FA7] mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">{feature.title}</h3>
                  <p className="text-sm text-[#64748B]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Money Back */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-full">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">30-Day Money Back Guarantee</span>
            </div>
            <p className="text-[#64748B] mt-4 max-w-lg mx-auto">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#64748B]">
          <p>© 2024 Profolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
