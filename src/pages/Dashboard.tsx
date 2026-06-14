import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Leaf,
  MessageSquare,
  Binary,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
  Trophy,
  Activity,
  Calendar,
  User as UserIcon,
  Info,
  Volume2,
  VolumeX,
  Camera,
  Users,
  Award,
  Bell
} from 'lucide-react';
import { getFirebaseAuth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Overview from './dashboard/Overview';
import Analytics from './dashboard/Analytics';
import EcoCoach from './dashboard/EcoCoach';
import EcoScanner from './dashboard/EcoScanner';
import DigitalTwin from './dashboard/DigitalTwin';
import Challenges from './dashboard/Challenges';
import Leaderboard from './dashboard/Leaderboard';
import KnowledgeHub from './dashboard/KnowledgeHub';
import ActionPlan from './dashboard/ActionPlan';
import CommunityHub from './dashboard/CommunityHub';
import Certification from './dashboard/Certification';
import Profile from './dashboard/Profile';
import About from './dashboard/About';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile } = useAuth();
  const { notifications, markAsRead, clearAll, addNotification } = useNotifications();
  const location = useLocation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Welcome notification on first dashboard load
    const hasWelcomed = sessionStorage.getItem('eco-welcomed');
    if (userProfile && !hasWelcomed) {
      addNotification({
        message: `Welcome back, ${userProfile.fullName}! Your digital twin is synced and ready.`,
        type: 'info'
      });
      sessionStorage.setItem('eco-welcomed', 'true');
    }
  }, [userProfile]);

  const sectionDescriptions: Record<string, string> = {
    '/dashboard': "Welcome to your Overview. Here you can see your current sustainability score, recent activity, and a quick summary of your environmental impact and progress towards your goals.",
    '/dashboard/analytics': "The Analytics section provides deep insights into your carbon footprint trends. You can analyze emissions by category, track your progress over time, and identify exactly where you're making the most impact.",
    '/dashboard/twin': "Your Digital Twin is a virtual representation of your environmental self. It visualizes how your real-world actions affect your virtual ecosystem, helping you understand long-term consequences in a simulated environment.",
    '/dashboard/coach': "Meet your AI Eco Coach. This intelligent assistant uses your data to provide personalized advice, answer sustainability questions, and help you navigate your journey toward a zero-carbon lifestyle.",
    '/dashboard/scanner': "The AI Eco Scanner uses computer vision to analyze product sustainability and audit electricity bills. Just upload an image or scan a barcode to get instant environmental impact data.",
    '/dashboard/plan': "The Action Plan is your personalized roadmap. It breaks down your long-term sustainability goals into manageable tasks, scheduled across your calendar for consistent progress.",
    '/dashboard/challenges': "Welcome to the Challenges Hub. Engage in daily, weekly, and community missions to earn XP, collect badges, and climb the global leaderboards while making a real difference.",
    '/dashboard/learning': "The Knowledge Hub is your educational resource center. Complete interactive modules and quizzes to deepen your understanding of environmental science and sustainable practices.",
    '/dashboard/community': "Connect with thousands of environmentalists in our Community Hub. Share your achievements, post tips, participate in discussions, and see the collective impact we're making worldwide.",
    '/dashboard/certification': "Earn and download professional sustainability certifications. Validate your expertise through modules and labs to showcase your environmental commitment.",
    '/dashboard/profile': "Your Profile showcases your achievements, current level, and accumulated rewards.",
    '/dashboard/about': "The About section explains the mission of EcoSense AI and introduces the visionaries behind this platform. Learn about our commitment to a sustainable future."
  };

  const speakSection = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = sectionDescriptions[location.pathname] || "Welcome to EcoSense AI.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    // Auto-speak on section change if desired, or just stop current speech
    stopSpeaking();
  }, [location.pathname]);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { name: 'Eco Scanner', icon: Camera, path: '/dashboard/scanner' },
    { name: 'Digital Twin', icon: Binary, path: '/dashboard/twin' },
    { name: 'AI Eco Coach', icon: MessageSquare, path: '/dashboard/coach' },
    { name: 'Action Plan', icon: Calendar, path: '/dashboard/plan' },
    { name: 'Challenges', icon: Target, path: '/dashboard/challenges' },
    { name: 'Community', icon: Users, path: '/dashboard/community' },
    { name: 'Certifications', icon: Award, path: '/dashboard/certification' },
    { name: 'Knowledge Hub', icon: Activity, path: '/dashboard/learning' },
    { name: 'Profile', icon: UserIcon, path: '/dashboard/profile' },
    { name: 'About', icon: Info, path: '/dashboard/about' },
  ];

  const handleLogout = () => {
    const auth = getFirebaseAuth();
    if (auth) auth.signOut();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b]">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 glass-dark border-r border-white/5">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="text-black h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter">EcoSense AI</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  location.pathname === item.path
                    ? "bg-primary text-black font-semibold"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-black" : "text-muted-foreground group-hover:text-primary")} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="flex items-center space-x-3 mb-6 p-3 glass-dark rounded-2xl">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-green-300 overflow-hidden flex items-center justify-center">
               {userProfile?.photoURL ? (
                 <img src={userProfile.photoURL} alt="" className="h-full w-full object-cover" />
               ) : (
                 <span className="text-black font-bold">{userProfile?.displayName?.[0] || 'E'}</span>
               )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{userProfile?.fullName || 'Eco Warrior'}</p>
              <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Floating Guide & Notifications */}
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-3 rounded-2xl border transition-all shadow-2xl backdrop-blur-md relative",
                showNotifications
                  ? "bg-primary text-black border-primary"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              )}
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 flex items-center justify-center text-[8px] text-white font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 z-[-1]"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 glass-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-bold">Notifications</h3>
                      <button
                        onClick={clearAll}
                        className="text-[10px] text-muted-foreground hover:text-white uppercase tracking-wider"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <Bell className="mx-auto h-8 w-8 text-white/10 mb-2" />
                          <p className="text-xs text-muted-foreground">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer",
                              !n.read && "bg-primary/5"
                            )}
                            onClick={() => markAsRead(n.id)}
                          >
                            <div className="flex gap-3">
                              <div className={cn(
                                "h-2 w-2 rounded-full mt-1.5 shrink-0",
                                n.type === 'success' ? "bg-primary" : n.type === 'achievement' ? "bg-yellow-400" : "bg-blue-400"
                              )} />
                              <div className="flex-1">
                                <p className={cn("text-xs leading-relaxed", !n.read ? "text-white font-medium" : "text-muted-foreground")}>
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {new Date(n.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={isSpeaking ? stopSpeaking : speakSection}
            className={cn(
              "hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all shadow-2xl backdrop-blur-md group",
              isSpeaking
                ? "bg-red-500/20 border-red-500/50 text-red-500"
                : "bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
            )}
          >
            <div className="relative">
              {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">AI Guide</span>
              <span className="text-xs font-bold">{isSpeaking ? "Stop Guidance" : "Explain This Tab"}</span>
            </div>
          </button>
        </div>

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 glass-dark sticky top-0 z-40">
          <div className="flex items-center space-x-2">
            <Leaf className="text-primary h-6 w-6" />
            <span className="font-bold">EcoSense AI</span>
          </div>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/scanner" element={<EcoScanner />} />
            <Route path="/twin" element={<DigitalTwin />} />
            <Route path="/coach" element={<EcoCoach />} />
            <Route path="/plan" element={<ActionPlan />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/certification" element={<Certification />} />
            <Route path="/learning" element={<KnowledgeHub />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-80 bg-[#09090b] z-50 lg:hidden p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center space-x-2">
                  <Leaf className="text-primary h-8 w-8" />
                  <span className="text-xl font-bold">EcoSense AI</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center space-x-4 p-4 rounded-2xl glass-dark"
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                    <span className="text-lg font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
