import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { 
  FileText, Sparkles, Target, Download, CheckCircle, 
  ArrowRight, Star, Zap, Shield, Users, ChevronRight 
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered STAR Method",
      description: "Transform your experiences into compelling achievements using the proven STAR methodology.",
      color: "from-[#002FA7] to-blue-400"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "ATS Optimization",
      description: "Get real-time ATS scoring and keyword suggestions to pass automated screening.",
      color: "from-[#FF4F00] to-orange-400"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Professional Templates",
      description: "Choose from curated templates designed by HR professionals and recruiters.",
      color: "from-emerald-500 to-teal-400"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Instant PDF Export",
      description: "Download your polished resume in PDF format, ready to submit.",
      color: "from-violet-500 to-purple-400"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "Profolio helped me land my dream job. The ATS optimization was a game-changer!",
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      content: "The STAR method suggestions transformed my bullet points. Highly recommend!",
      avatar: "MJ"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content: "Finally, a resume builder that actually understands what recruiters look for.",
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="logo">
            <div className="w-10 h-10 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Profolio
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Features</a>
            <a href="#pricing" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Pricing</a>
            <a href="#testimonials" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-[#64748B] hover:text-[#0F172A]" data-testid="login-btn">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white" data-testid="get-started-btn">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#002FA7]/10 rounded-full mb-6">
                <Zap className="w-4 h-4 text-[#FF4F00]" />
                <span className="text-sm font-medium text-[#002FA7]">AI-Powered Resume Builder</span>
              </div>
              
              <h1 
                className="text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6"
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}
              >
                Build Resumes That
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#002FA7] to-[#FF4F00]">
                  Get You Hired
                </span>
              </h1>
              
              <p className="text-lg text-[#64748B] mb-8 leading-relaxed max-w-lg">
                Create ATS-optimized resumes using AI and the proven STAR methodology. 
                Tailor your resume for any job in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white px-8 py-6 text-lg"
                    data-testid="hero-cta-btn"
                  >
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-slate-300 text-[#0F172A] px-8 py-6 text-lg"
                    data-testid="pricing-btn"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-slate-200">
                <div className="flex -space-x-3">
                  {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map((bg, i) => (
                    <div key={i} className={`w-10 h-10 ${bg} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium`}>
                      {['JD', 'SC', 'MR', 'AK'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#FF4F00]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-[#64748B]">Trusted by 10,000+ job seekers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-[#002FA7]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-[#FF4F00]/10 rounded-full blur-3xl" />
              
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
                <img 
                  src="https://images.unsplash.com/photo-1746021535489-00edc5efb203?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwyfHxjb25maWRlbnQlMjBwcm9mZXNzaW9uYWwlMjB3b3JraW5nJTIwbGFwdG9wJTIwbWluaW1hbGlzdCUyMG9mZmljZXxlbnwwfHx8fDE3NzA1MjgyMTh8MA&ixlib=rb-4.1.0&q=85"
                  alt="Professional workspace"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0F172A]">ATS Score</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-mono">92/100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-[#002FA7] to-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl font-bold text-[#0F172A] mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Our AI-powered tools help you create resumes that pass ATS systems and impress recruiters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                data-testid={`feature-card-${index}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl font-bold text-[#0F172A] mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Build Your Resume in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Enter Your Details", desc: "Fill in your experience, skills, and education. Our form guides you through each section." },
              { step: "02", title: "AI Enhancement", desc: "Let our AI transform your content using STAR methodology and optimize for ATS systems." },
              { step: "03", title: "Download & Apply", desc: "Export your polished resume as PDF and start applying to your dream jobs." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-7xl font-bold text-[#002FA7]/10 absolute -top-4 left-0" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {item.step}
                </div>
                <div className="relative pt-12 pl-4">
                  <h3 className="text-xl font-semibold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-[#64748B]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl font-bold text-[#0F172A] mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[#64748B]">
              Get lifetime access to all premium features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
              data-testid="free-plan-card"
            >
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">$0</span>
                <span className="text-[#64748B]">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["1 Resume", "3 Templates", "PDF Download", "Basic Editor"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#64748B]">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button variant="outline" className="w-full border-slate-300" data-testid="free-plan-btn">
                  Get Started
                </Button>
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#002FA7] to-[#001d66] p-8 rounded-2xl shadow-xl relative overflow-hidden"
              data-testid="premium-plan-card"
            >
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#FF4F00] text-white text-xs font-medium rounded-full">
                EARLY BIRD
              </div>
              <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Premium</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-white/70 ml-2 line-through">$49.99</span>
              </div>
              <p className="text-white/70 text-sm mb-6">One-time payment, lifetime access</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited Resumes", 
                  "All Templates", 
                  "AI STAR Enhancement", 
                  "ATS Optimization",
                  "Job Description Matching",
                  "LinkedIn Import",
                  "Priority Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-[#FF4F00]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/pricing">
                <Button className="w-full bg-white text-[#002FA7] hover:bg-white/90" data-testid="premium-plan-btn">
                  Get Premium
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl font-bold text-[#0F172A] mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Loved by Job Seekers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-1 text-[#FF4F00] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[#64748B] mb-6 italic" style={{ fontFamily: 'Fraunces, serif' }}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-[#0F172A]">{testimonial.name}</p>
                    <p className="text-sm text-[#64748B]">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#002FA7] to-[#001d66]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of professionals who've accelerated their career with Profolio
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-[#002FA7] hover:bg-white/90 px-8 py-6 text-lg"
                data-testid="final-cta-btn"
              >
                Start Building Your Resume
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#002FA7] to-[#FF4F00] rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Profolio
              </span>
            </div>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 Profolio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
