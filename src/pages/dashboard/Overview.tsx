import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Car,
  Utensils,
  Droplets,
  Sparkles,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { doc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { getFirestore } from '../../lib/firebase';
import { UserProfile } from '../../types';

const data = [
  { name: 'Jan', emissions: 450, projection: 450 },
  { name: 'Feb', emissions: 420, projection: 420 },
  { name: 'Mar', emissions: 435, projection: 435 },
  { name: 'Apr', emissions: 400, projection: 400 },
  { name: 'May', emissions: 380, projection: 380 },
  { name: 'Jun', emissions: 360, projection: 360 },
  { name: 'Jul', emissions: null, projection: 340 },
  { name: 'Aug', emissions: null, projection: 320 },
  { name: 'Sep', emissions: null, projection: 300 },
  { name: 'Oct', emissions: null, projection: 280 },
  { name: 'Nov', emissions: null, projection: 260 },
  { name: 'Dec', emissions: null, projection: 240 },
];

const PROBLEM_STATEMENT = "Challenge 3] Carbon Footprint Awareness Platform: Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.";

const Overview = () => {
  const { userProfile, currentUser } = useAuth();
  const [notification, setNotification] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [globalStats, setGlobalStats] = useState({
    totalWarriors: 0,
    activeNow: 0,
    tasksCompleted: 0,
    co2Offset: 0
  });

  React.useEffect(() => {
    const db = getFirestore();
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as UserProfile);
      const totalWarriors = users.length;
      const activeNow = users.filter(u => u.isOnline).length;
      const tasksCompleted = users.reduce((acc, u) => acc + (u.totalTasksCompleted || 0), 0);
      const co2Offset = users.reduce((acc, u) => acc + (u.ecoProgress || 0) * 0.5, 0);

      setGlobalStats({
        totalWarriors,
        activeNow,
        tasksCompleted,
        co2Offset
      });
    });

    return () => unsubscribe();
  }, []);

  const getSmartInsight = () => {
    if (userProfile?.primaryTransport === 'Car') {
      return "Swapping just two car trips this week for public transit or walking will reduce your personal footprint by roughly 12kg of CO₂.";
    }
    if (userProfile?.dietType === 'Non-Veg') {
      return "Trying a 'Meatless Monday' reduces your dietary carbon footprint by 15% over the month!";
    }
    if (userProfile?.housingType === 'House') {
      return "Installing a smart thermostat could reduce your heating and cooling emissions by up to 10% annually.";
    }
    return "I noticed your transportation footprint spiked by 15% this week. If you switch tomorrow's commute to the subway, you'll hit Level ahead of schedule.";
  };

  const handleQuickTrack = async (points: number, action: string) => {
    if (!currentUser || !userProfile) return;
    const db = getFirestore();
    if (!db) return;
    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const newXP = (userProfile.experience || 0) + (points * 10);
      const newLevel = Math.floor(newXP / 1000) + 1;
      const newEcoProgress = Math.min(100, (userProfile.ecoProgress || 0) + points);

      await updateDoc(userRef, {
        experience: newXP,
        level: newLevel,
        ecoProgress: newEcoProgress,
        totalTasksCompleted: (userProfile.totalTasksCompleted || 0) + 1
      });
      showActionToast(`Logged: ${action} (+${points} XP)`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const showActionToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApplyToPlan = () => {
    // Custom event to communicate with ActionPlan component
    const event = new CustomEvent('ai-task-push', {
      detail: {
        title: "Switch to cycling for trips under 5km",
        impact: "High"
      }
    });
    window.dispatchEvent(event);
    showActionToast("Action plan recalibrated with new goals.");
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eco-Intelligence Hub</h1>
          <p className="text-muted-foreground mt-1 truncate max-w-2xl">{PROBLEM_STATEMENT}</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-2">
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-xs font-bold text-primary">LVL {userProfile?.level || 1}</span>
           </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="relative overflow-hidden group border-l-4 border-l-primary" role="status" aria-label="Global Rank Score">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Zap size={64} className="text-primary" aria-hidden="true" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Rank Score</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-4xl font-black">{userProfile?.ecoProgress || 78}</span>
            <span className="text-xs text-primary font-bold">TOP 5%</span>
          </div>
          <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden" aria-hidden="true">
             <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${userProfile?.ecoProgress || 78}%` }}
               className="h-full bg-primary"
             />
          </div>
        </Card>

        <Card variant="glass" className="border-l-4 border-l-blue-500" role="status" aria-label="Community Impact">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Community Impact</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-4xl font-black">{globalStats.co2Offset.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span className="text-xs text-muted-foreground font-bold">KG CO₂ OFFSET</span>
          </div>
            <div className="mt-4 flex items-center text-[10px] text-blue-400 font-black uppercase">
               Collective Impact
            </div>
          </Card>

          <Card variant="glass" className="border-t-4 border-t-primary relative overflow-hidden" role="region" aria-label="Daily Quick Tracking">
            <h3 className="font-bold text-sm mb-4">Daily 1-Click Track</h3>
            <div className="space-y-3">
               {[
                 { label: 'Ate plant-based meal', points: 10, icon: Utensils },
                 { label: 'Avoided single-use plastic', points: 5, icon: Droplets },
                 { label: 'Walked/Biked instead of car', points: 15, icon: Car },
               ].map((action) => (
                 <button
                   key={action.label}
                   disabled={isUpdating}
                   onClick={() => handleQuickTrack(action.points, action.label)}
                   aria-label={`Log action: ${action.label} for ${action.points} points`}
                   className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all group"
                 >
                   <div className="flex items-center gap-3">
                     <action.icon size={14} className="text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                   </div>
                   <span className="text-[10px] font-black text-primary">+{action.points} XP</span>
                 </button>
               ))}
            </div>
          </Card>

          <Card variant="glass" className="bg-primary/10 border-primary/20" role="status" aria-label="Active Warriors Online">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Active Warriors</p>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white">{globalStats.activeNow}</span>
              <span className="text-xs text-primary font-bold">ONLINE</span>
            </div>
            <div className="mt-4 flex items-center text-[10px] text-green-500 font-black">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse" aria-hidden="true" />
              SYNCHRONIZED NOW
            </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Trend Intelligence */}
        <Card variant="glass" className="lg:col-span-2" role="region" aria-label="12-Month CO2 Impact Projection Chart">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold">12-Month Impact Projection</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">AI-Driven CO₂ Reduction Forecast</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/30 border border-dashed border-primary" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase">Projected</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full" aria-label="Area chart showing actual CO2 emissions and AI-driven projections for the next 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} accessibilityLayer>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#ffffff20"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#ffffff20"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="projection"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorProjection)"
                />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  stroke="#22c55e"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorEmissions)"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <Card variant="glass" className="border-t-4 border-t-primary relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
               <Sparkles size={100} className="text-primary" />
            </div>
            <div className="flex items-center gap-3 mb-6">
               <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <MessageSquare size={20} className="text-primary" />
               </div>
               <div>
                  <h3 className="font-bold text-sm">Eco-Sensi Coaching</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Autonomous Intelligence</p>
               </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "Hey {userProfile?.fullName?.split(' ')[0] || 'Explorer'}! {getSmartInsight()}"
            </p>

            <div className="mt-6 space-y-3">
               <button
                  onClick={() => showActionToast("Task added to your daily mission list!")}
                  className="w-full py-3 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
               >
                  Take Action
               </button>
               <button
                  onClick={handleApplyToPlan}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
               >
                  Apply to Action Plan
               </button>
            </div>
          </Card>

          <Card variant="glass" role="region" aria-label="Eco-Intelligence Breakdown">
            <h3 className="font-bold mb-4 flex items-center gap-2">
               <CheckCircle2 size={16} className="text-primary" aria-hidden="true" />
               Intelligence Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Transportation', value: 45, icon: Car, color: 'bg-blue-500' },
                { label: 'Energy Usage', value: 20, icon: Zap, color: 'bg-yellow-500' },
                { label: 'Food Footprint', value: 25, icon: Utensils, color: 'bg-orange-500' },
                { label: 'Waste Stream', value: 10, icon: Droplets, color: 'bg-primary' },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5" role="progressbar" aria-valuenow={item.value} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label} footprint: ${item.value}%`}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                    <span className="flex items-center gap-2">
                      <item.icon size={12} className="text-muted-foreground" aria-hidden="true" />
                      {item.label}
                    </span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className={cn("h-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Social Links & Attribution */}
      <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <a href="https://github.com/Krishna67890" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors">
               <span className="text-[10px] font-bold tracking-widest">GITHUB / KRISHNA67890</span>
            </a>
            <div className="h-4 w-px bg-white/10" />
            <a href="https://www.linkedin.com/in/krishna-patil-rajput-b66b03340" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors">
               <span className="text-[10px] font-bold tracking-widest">LINKEDIN / KRISHNA-PATIL</span>
            </a>
         </div>
         <p className="text-[10px] text-muted-foreground font-black tracking-[0.3em] uppercase">
            © 2026 EcoSense AI • Autonomous Sustainability Intelligence
         </p>
      </footer>

      {/* Advanced Notification Toast */}
      <AnimatePresence>
         {notification && (
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
            >
               <div className="bg-primary text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center gap-3">
                  <Sparkles size={16} />
                  {notification}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Overview;
