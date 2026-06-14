import React from 'react';
import { motion } from 'framer-motion';
import { Info, Code, Award, Target, Globe, Github, Linkedin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const About = () => {
  return (
    <div className="space-y-12 pb-20" role="region" aria-label="About EcoSense AI Platform">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
          role="status"
          aria-label="Platform Version"
        >
          <Award size={14} aria-hidden="true" />
          EcoSense AI (2026)
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About EcoSense AI</h1>
        <p className="text-muted-foreground text-lg">
          EcoSense AI is an intelligent sustainability platform developed for Challenge 3: Carbon Footprint Awareness Platform.
        </p>
        <p className="text-muted-foreground">
          The platform empowers individuals to understand, track, and reduce their carbon footprint through personalized recommendations, AI-powered sustainability coaching, real-time analytics, and community engagement.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8" aria-labelledby="mission-title">
        <Card variant="glass" className="space-y-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary" aria-hidden="true">
            <Target size={24} />
          </div>
          <h3 id="mission-title" className="text-2xl font-bold">Mission</h3>
          <p className="text-muted-foreground leading-relaxed">
            To make sustainable living simple, measurable, and accessible for everyone.
          </p>
        </Card>

        <Card variant="glass" className="space-y-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500" aria-hidden="true">
            <Globe size={24} />
          </div>
          <h3 className="text-2xl font-bold">Core Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label="Feature list">
            {[
              "AI Eco Coach",
              "Carbon Footprint Tracking",
              "Personalized Action Plans",
              "Sustainability Analytics",
              "Global Leaderboards",
              "Community Challenges",
              "Voice Assistant",
              "Real-Time Environmental Insights"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck size={14} className="text-primary flex-shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="space-y-6" aria-labelledby="challenge-title">
        <Card variant="glass" className="border-l-4 border-l-primary">
          <h3 id="challenge-title" className="text-2xl font-bold mb-4">Challenge 3: Carbon Footprint Awareness Platform</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-2">Problem Statement</h4>
              <p className="text-muted-foreground">
                Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-2">EcoSense AI Solution</h4>
              <p className="text-muted-foreground">
                EcoSense AI combines artificial intelligence, behavioral insights, and real-time analytics to help users measure their environmental impact and take practical steps toward sustainability.
              </p>
            </div>
            <div className="pt-4">
              <h4 className="font-bold text-white mb-2">Users receive:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label="User benefits">
                {[
                  "Personalized recommendations",
                  "AI coaching",
                  "Progress tracking",
                  "Community motivation",
                  "Sustainability scoring"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={14} className="text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Developer Section */}
      <section className="space-y-8" aria-labelledby="developer-title">
        <h2 id="developer-title" className="text-3xl font-bold text-center">Meet the Visionary</h2>
        <Card variant="glass" className="max-w-3xl mx-auto overflow-hidden p-0 border-white/10 group">
          <div className="bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 p-1 md:p-1.5">
            <div className="bg-[#09090b] rounded-[calc(1.5rem-4px)] p-6 md:p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="h-48 w-48 rounded-3xl bg-gradient-to-tr from-primary to-blue-500 p-1 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="h-full w-full rounded-[calc(1.5rem-4px)] bg-[#09090b] overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/Devloper.jpg"
                      alt="Krishna Patil - Full Stack & AI Architect"
                      className="h-full w-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Krishna+Patil&background=22c55e&color=fff&size=512";
                      }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 border-4 border-[#09090b]" aria-hidden="true">
                  <Code size={20} className="text-black" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tighter">Krishna Patil</h3>
                  <p className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Lead Full-Stack Architect & AI Engineer</p>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  A tech visionary dedicated to bridging the gap between advanced Artificial Intelligence and environmental sustainability. Specializing in high-performance React ecosystems and AI integration to build solutions that matter.
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                  {[
                    { icon: Github, label: 'GitHub', href: 'https://github.com/Krishna67890' },
                    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/krishna-patil-rajput-b66b03340' },
                    { icon: Globe, label: 'Portfolio', href: 'https://krishna-patil-rajput.vercel.app/' }
                  ].map((link, idx) => (
                    <a key={idx} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Follow Krishna on ${link.label}`}>
                      <Button variant="outline" size="sm" className="rounded-xl bg-white/5 border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                        <link.icon size={16} className="mr-2" aria-hidden="true" />
                        {link.label}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <footer className="p-4 bg-white/5 text-center border-t border-white/5 backdrop-blur-xl">
             <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">React 19 Expert</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Implementation</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Eco-Tech Lead</span>
                </div>
             </div>
          </footer>
        </Card>
      </section>
    </div>
  );
};

export default About;
