import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Leaf,
  Car,
  Utensils,
  Zap,
  Map as MapIcon,
  Trash,
  Sparkles,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore } from '../../lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { generateActionPlan } from '../../lib/gemini';

// Using global confetti from CDN
const confetti = (window as any).confetti;

const initialPlan = [
  {
    week: 1,
    title: 'Transportation Optimization',
    tasks: [
      { id: 'ap1', text: 'Walk or bike for trips under 2km', impact: 'High', icon: 'Car' },
      { id: 'ap2', text: 'Research local public transit routes', impact: 'Medium', icon: 'Map' },
      { id: 'ap3', text: 'Check tire pressure for fuel efficiency', impact: 'Low', icon: 'Zap' }
    ]
  },
  {
    week: 2,
    title: 'Energy Efficiency',
    tasks: [
      { id: 'ap4', text: 'Switch to LED bulbs in all rooms', impact: 'High', icon: 'Zap' },
      { id: 'ap5', text: 'Lower thermostat by 1 degree', impact: 'Medium', icon: 'Flame' },
      { id: 'ap6', text: 'Unplug vampire electronics', impact: 'Medium', icon: 'Zap' }
    ]
  },
  {
    week: 3,
    title: 'Dietary Shift',
    tasks: [
      { id: 'ap7', text: 'Adopt Meatless Mondays', impact: 'High', icon: 'Utensils' },
      { id: 'ap8', text: 'Buy locally sourced seasonal produce', impact: 'Medium', icon: 'Leaf' },
      { id: 'ap9', text: 'Reduce food waste through meal planning', impact: 'High', icon: 'Utensils' }
    ]
  },
  {
    week: 4,
    title: 'Waste Reduction',
    tasks: [
      { id: 'ap10', text: 'Start home composting', impact: 'High', icon: 'Leaf' },
      { id: 'ap11', text: 'Eliminate single-use plastics', impact: 'High', icon: 'Trash' },
      { id: 'ap12', text: 'Audit your recycling habits', impact: 'Medium', icon: 'Trash' }
    ]
  }
];

const ActionPlan = () => {
  const { userProfile, currentUser } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [plan, setPlan] = useState<any[]>(initialPlan);

  useEffect(() => {
    const fetchSavedPlan = async () => {
      if (!currentUser) return;
      const db = getFirestore();
      if (!db) return;
      try {
        const planRef = doc(db, 'actionPlans', currentUser.uid);
        const planDoc = await getDoc(planRef);
        if (planDoc.exists()) {
          setPlan(planDoc.data().plan);
        }
      } catch (error: any) {
        console.warn("Firestore fetch error (likely offline):", error.message);
      }
    };
    fetchSavedPlan();

    // Listen for tasks pushed from Digital Twin or other components
    const handlePushTask = async (e: any) => {
      const { title, impact } = e.detail;

      setPlan(currentPlan => {
        // Prevent duplicates in the same week
        const taskExists = currentPlan.some(week =>
          week.tasks.some((t: any) => t.text === title)
        );

        if (taskExists) return currentPlan;

        const newTask = {
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: title,
          impact: impact || 'Medium',
          icon: 'Zap'
        };

        const updatedPlan = [...currentPlan];
        // Add to the first week
        updatedPlan[0] = {
          ...updatedPlan[0],
          tasks: [newTask, ...updatedPlan[0].tasks]
        };

        // Persist to Firestore immediately
        if (currentUser) {
          const db = getFirestore();
          if (db) {
            const planRef = doc(db, 'actionPlans', currentUser.uid);
            setDoc(planRef, {
              plan: updatedPlan,
              generatedAt: new Date().toISOString()
            }, { merge: true }).catch(err => console.error("Sync error:", err));
          }
        }

        return updatedPlan;
      });
    };

    window.addEventListener('ai-task-push', handlePushTask);
    return () => window.removeEventListener('ai-task-push', handlePushTask);
  }, [currentUser]);

  const handleGeneratePlan = async () => {
    if (!currentUser || !userProfile) return;
    const db = getFirestore();
    if (!db) return;
    setIsGenerating(true);
    try {
      const newPlan = await generateActionPlan(userProfile);
      const planRef = doc(db, 'actionPlans', currentUser.uid);
      await setDoc(planRef, {
        plan: newPlan,
        generatedAt: new Date().toISOString()
      });
      setPlan(newPlan);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#22c55e', '#ffffff']
      });
    } catch (error) {
      console.error("Failed to generate plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetPlan = async () => {
    if (!currentUser) return;
    const db = getFirestore();
    if (!db) return;
    if (confirm("Are you sure you want to reset your plan to the default?")) {
      const planRef = doc(db, 'actionPlans', currentUser.uid);
      await setDoc(planRef, {
        plan: initialPlan,
        generatedAt: new Date().toISOString()
      });
      setPlan(initialPlan);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Car': return <Car size={12} />;
      case 'Map': return <MapIcon size={12} />;
      case 'Zap': return <Zap size={12} />;
      case 'Flame': return <Flame size={12} />;
      case 'Utensils': return <Utensils size={12} />;
      case 'Leaf': return <Leaf size={12} />;
      case 'Trash': return <Trash size={12} />;
      default: return <Sparkles size={12} />;
    }
  };

  const isCompleted = (id: string) => userProfile?.completedTasks?.includes(id);

  const toggleTask = async (id: string, impact: string) => {
    if (!currentUser || processingId) return;

    setProcessingId(id);
    const done = isCompleted(id);
    const db = getFirestore();
    if (!db) return;
    const userRef = doc(db, 'users', currentUser.uid);
    const xpGain = impact === 'High' ? 50 : impact === 'Medium' ? 30 : 15;

    try {
      if (done) {
        await updateDoc(userRef, {
          completedTasks: arrayRemove(id),
          experience: Math.max(0, (userProfile?.experience || 0) - xpGain),
          totalTasksCompleted: Math.max(0, (userProfile?.totalTasksCompleted || 0) - 1)
        });
      } else {
        await updateDoc(userRef, {
          completedTasks: arrayUnion(id),
          experience: (userProfile?.experience || 0) + xpGain,
          totalTasksCompleted: (userProfile?.totalTasksCompleted || 0) + 1
        });

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#fbbf24']
        });

        // Badge Check Logic
        const newTotal = (userProfile?.totalTasksCompleted || 0) + 1;
        if (newTotal % 1 === 0 && newTotal <= 50) { // Giving badge for every task for demo/testing or every 5
           const badgeName = `Badge #${newTotal}`;
           await updateDoc(userRef, {
            notifications: arrayUnion({
              id: `badge_unlock_${Date.now()}`,
              message: `🎉 CONGRATULATIONS! You've earned: ${badgeName}. Click to claim your reward!`,
              type: 'achievement',
              timestamp: new Date().toISOString()
            }),
            badges: arrayUnion(badgeName)
          });
        }
      }
    } catch (error) {
      console.error("Error toggling action plan task:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const completedCount = plan.reduce((acc, week) =>
    acc + week.tasks.filter((t: any) => isCompleted(t.id)).length, 0
  );
  const totalTasks = plan.reduce((acc, week) => acc + week.tasks.length, 0);
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calendar className="mr-3 text-primary" />
            Adaptive AI Action Plan
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            [Challenge 3] Carbon Footprint Awareness: Personalized 30-day reduction roadmap.
          </p>
        </div>
        <div className="flex gap-2">
           <Button
             variant="outline"
             size="sm"
             className="border-red-500/20 text-red-500/80 hover:bg-red-500/5"
             onClick={handleResetPlan}
           >
             <RefreshCcw className="mr-2 h-4 w-4" />
             Reset Plan
           </Button>
           <Button
             variant="primary"
             size="sm"
             onClick={handleGeneratePlan}
             disabled={isGenerating}
           >
             {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
             Generate New Plan
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plan.map((week, weekIdx) => (
          <div key={weekIdx} className="space-y-4">
             <div className="flex items-center space-x-2 px-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Week {week.week}</span>
                <div className="h-px flex-1 bg-white/10" />
             </div>
             <h3 className="font-bold text-base px-2 truncate" title={week.title}>{week.title}</h3>

             <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                {week.tasks.map((task: any) => {
                  const done = isCompleted(task.id);
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Card
                        variant="glass"
                        className={`p-4 hover:border-primary/30 transition-all cursor-pointer group ${done ? 'bg-primary/5 border-primary/20' : ''} ${processingId === task.id ? 'opacity-50 animate-pulse' : ''}`}
                        onClick={() => toggleTask(task.id, task.impact)}
                      >
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {done ? (
                                <CheckCircle2 className="text-primary h-5 w-5" />
                              ) : (
                                <Circle className="text-muted-foreground group-hover:text-primary transition-colors h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium leading-tight ${done ? 'text-muted-foreground line-through italic' : ''}`}>
                                  {task.text}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                  <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${
                                    task.impact === 'High' ? 'bg-red-500/10 text-red-500' :
                                    task.impact === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                                    'bg-blue-500/10 text-blue-500'
                                  }`}>
                                    {task.impact}
                                  </span>
                                  <div className="text-muted-foreground">
                                    {getIcon(task.icon)}
                                  </div>
                              </div>
                            </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
             </div>
          </div>
        ))}
      </div>

      <Card variant="glass" className="bg-gradient-to-r from-primary/10 via-background to-blue-500/5 border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles size={120} />
         </div>
         <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <Flame size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    Eco-Impact Momentum
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full animate-pulse">ACTIVE</span>
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-md">
                    You've neutralized <span className="text-white font-bold">{(completedCount * 12.5).toFixed(1)}kg</span> of CO₂ this month.
                    Keep it up to reach <span className="text-primary font-bold">Level {userProfile?.level ? userProfile.level + 1 : 15}</span>.
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-8 w-full lg:w-auto">
               <div className="flex-1 lg:flex-none">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span>Task Progress</span>
                    <span className="text-primary">{progress}%</span>
                  </div>
                  <div className="w-full lg:w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-primary to-blue-400"
                      />
                  </div>
               </div>
               <div className="text-center bg-white/5 p-3 rounded-2xl border border-white/10 min-w-[100px]">
                  <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter">Streak</p>
                  <p className="text-2xl font-black text-primary">12 <span className="text-[10px] text-white/50">Days</span></p>
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
};

export default ActionPlan;
