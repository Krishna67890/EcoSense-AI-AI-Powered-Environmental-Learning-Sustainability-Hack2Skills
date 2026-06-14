import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Leaf, Globe, Zap, ArrowRight, BarChart3, Users,
  ShieldCheck, Volume2, Sparkles, ChevronDown,
  HelpCircle, CheckCircle2, Star
} from 'lucide-react';
import Button from '../components/ui/Button';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group"
      >
        <span className="text-lg font-medium group-hover:text-primary transition-colors">{question}</span>
        <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LandingPage = () => {
  const [commuteType, setCommuteType] = useState('car');
  const [isSimulating, setIsSimulating] = useState(false);

  const speakOverview = () => {
    const text = "Welcome to Eco Sense AI, the world's most advanced AI-powered sustainability platform. Developed by Krishna Patil Rajput, our platform helps you track, measure, and reduce your carbon footprint in real-time.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const getAiTip = (type: string) => {
    const tips: Record<string, string> = {
      car: "Switching to an EV could save you 4.6 tonnes of CO2 annually. Try carpooling this week!",
      bus: "Great choice! Public transit is 75% more efficient per passenger mile than solo driving.",
      bike: "Perfect! You're saving 0.4kg of CO2 per mile. Your 'Digital Twin' ecosystem is thriving.",
      walk: "Zero impact! Walking short distances improves health and keeps your carbon score at A+."
    };
    return tips[type];
  };

  return (
    <div className="relative overflow-hidden selection:bg-primary selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="text-primary h-8 w-8" />
            <span className="text-xl font-bold tracking-tighter">EcoSense AI</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Intelligence</a>
            <a href="#demo" className="hover:text-primary transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">Support</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/auth?mode=signup"><Button>Join Now</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary-light text-[11px] font-black uppercase tracking-[0.2em] border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              Autonomous Sustainability Intelligence
            </span>
            <h1 className="mt-8 text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 leading-[1.1]">
              Architect Your <br className="hidden md:block" /> Sustainable Future.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the power of Gemini 1.5 Pro AI. Measure, predict, and automate your journey to Net Zero with real-time predictive analytics.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="h-14 px-10 text-lg rounded-2xl group shadow-2xl shadow-primary/20">
                  Launch Platform
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <button
                className="h-14 px-10 text-lg rounded-2xl glass-dark border border-white/10 flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
                onClick={speakOverview}
              >
                <Volume2 className="h-5 w-5 text-primary" />
                Listen to Vision
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="glass-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12 border-b border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="text-primary" size={24} />
                    Live AI Simulator
                  </h3>
                  <p className="text-muted-foreground mt-1">See how our core engine processes your daily habits.</p>
                </div>
                <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl">
                  {['car', 'bus', 'bike', 'walk'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setCommuteType(t)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${commuteType === t ? 'bg-primary text-black' : 'hover:bg-white/10 text-muted-foreground'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-12 bg-gradient-to-b from-transparent to-primary/5 min-h-[300px] flex items-center justify-center">
              <div className="max-w-md w-full glass p-8 rounded-3xl border border-primary/20 relative group">
                <div className="absolute -top-3 -right-3 h-8 w-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                  <Star size={16} className="text-black" />
                </div>
                <p className="text-xs font-black uppercase text-primary tracking-[0.2em] mb-4">Gemini AI Coaching</p>
                <p className="text-xl font-medium leading-relaxed italic">
                  "{getAiTip(commuteType)}"
                </p>
                <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground pt-6 border-t border-white/5">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Leaf className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white">EcoSense Engine v2.0</p>
                    <p>Real-time behavioral analysis active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center mt-8 text-xs text-muted-foreground font-medium uppercase tracking-widest">
            * Interactive UI Mockup showing Gemini 1.5 Integration
          </p>
        </div>
      </section>

      {/* Stats Section with Verification */}
      <section className="py-20 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Verified Trees', value: '1.2M+', icon: Leaf },
              { label: 'CO₂ Reduced', value: '1,284t', icon: Zap },
              { label: 'Data Points', value: '850M', icon: Globe },
              { label: 'Uptime', value: '99.9%', icon: ShieldCheck }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="mx-auto h-12 w-12 text-primary/40 mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-full w-full" />
                </div>
                <p className="text-4xl font-bold mb-2 tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-12 text-[10px] text-muted-foreground uppercase tracking-widest opacity-40">
            Validated by EcoSense Core Models • Updated Real-time • Feb 2026
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 italic">Investment Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Choose your level of commitment to the planet.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-10 rounded-[2.5rem] glass-dark border border-white/5 hover:border-white/10 transition-all flex flex-col">
              <h4 className="text-xl font-bold mb-2">Eco Explorer</h4>
              <p className="text-4xl font-bold mb-6">$0 <span className="text-sm font-normal text-muted-foreground">/ forever</span></p>
              <ul className="space-y-4 mb-10 flex-1">
                {['Basic Footprint Tracking', 'AI Daily Tips', 'Global Community Access'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 size={18} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=signup" className="w-full">
                <Button variant="ghost" className="w-full h-12 rounded-xl">Get Started</Button>
              </Link>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-primary/10 border-2 border-primary/30 relative flex flex-col">
              <div className="absolute -top-4 right-8 px-4 py-1 bg-primary text-black text-[10px] font-black uppercase rounded-full">Recommended</div>
              <h4 className="text-xl font-bold mb-2">Sustainability Titan</h4>
              <p className="text-4xl font-bold mb-6">$12 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
              <ul className="space-y-4 mb-10 flex-1">
                {['Hyper-Personalized Digital Twin', 'Advanced Predictive Analytics', 'Professional Certifications', 'Priority AI Coaching'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 rounded-xl shadow-xl shadow-primary/20">Upgrade Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Common Queries</h2>
          <div className="space-y-2">
            <FAQItem
              question="How accurate is the Carbon calculation?"
              answer="We use global IPCC-validated emission factors combined with real-time data from your regional energy grids and transport databases to provide accuracy within ±5%."
            />
            <FAQItem
              question="Is my data shared with third parties?"
              answer="Never. Your environmental data is encrypted and used only to power your personalized AI Eco Coach. We do not sell user data to advertisers."
            />
            <FAQItem
              question="What is the 'Digital Twin' feature?"
              answer="It's a high-fidelity virtual simulation of your environmental self. It predicts how changing one habit today will affect your cumulative footprint over the next 10 years."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="text-primary h-8 w-8" />
                <span className="text-2xl font-bold tracking-tighter">EcoSense AI</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">The ultimate operating system for a carbon-neutral life. Built for the Hack Skills Challenge.</p>
            </div>
            <div className="flex gap-12 text-sm font-medium">
              <div className="flex flex-col gap-4">
                <p className="text-white">Platform</p>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Intelligence</a>
                <a href="#demo" className="text-muted-foreground hover:text-primary transition-colors">Demo</a>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-white">Legal</p>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-black">
            © 2026 EcoSense AI Platform • Developed by Krishna Patil Rajput
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
