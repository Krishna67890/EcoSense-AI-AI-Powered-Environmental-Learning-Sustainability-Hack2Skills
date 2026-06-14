import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  Clock,
  Star,
  Award,
  ChevronRight,
  ChevronDown,
  Lock,
  Leaf,
  Droplets,
  Wind,
  Flame,
  Search,
  TrendingUp,
  Users,
  Swords,
  ZapOff,
  FlameKindling,
  ShoppingBag,
  BrainCircuit,
  Calendar,
  ArrowUpRight,
  Map,
  Trash,
  Volume2,
  VolumeX,
  Play,
  Loader2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CHALLENGES, COMMUNITY_CHALLENGES, BADGES } from '../../lib/data';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore } from '../../lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { cn } from '../../lib/utils';

const sectionDescriptions = {
  daily: "Your daily missions are simple, high-impact actions you can take every day to reduce your footprint. To use this section, browse the available cards, click 'View Mission Tasks' to see what needs to be done, and tap each task once completed to earn instant XP and Green Coins.",
  weekly: "Weekly challenges are more intensive goals focusing on lifestyle shifts over seven days. Select a challenge to expand its milestones. Complete all milestones within the week to unlock major XP boosts and exclusive progress badges.",
  monthly: "Mega challenges are for dedicated eco-warriors targeting long-term goals. These often take a full month to complete. Progress through the listed tasks to achieve net-zero status and unlock legendary badges that showcase your commitment.",
  community: "Community challenges track our collective global impact. Here you can see how your individual actions contribute to massive goals like planting ten thousand trees. Watch the live progress bars and complete your personal missions to help the world reach these milestones.",
  arena: "The Eco Battle Arena is where you compete. View your current league ranking from Bronze to Planet Protector. Check the leaderboard to see how you stack up against rivals and participate in the Weekly Arena to earn championship rewards."
};

const Challenges = () => {
  const { userProfile, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'community' | 'arena'>('daily');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const dailyQuizQuestions = [
    {
      question: "Which sector contributes most to global CO2 emissions?",
      options: ["Transportation", "Energy Production", "Agriculture", "Fashion"],
      correct: 1
    },
    {
      question: "What is the primary greenhouse gas produced by livestock?",
      options: ["Carbon Dioxide", "Methane", "Nitrous Oxide", "Ozone"],
      correct: 1
    },
    {
      question: "What does 'Net Zero' mean?",
      options: ["Producing no carbon at all", "Balancing emissions with removal", "Using only solar power", "Reducing waste to zero"],
      correct: 1
    }
  ];

  const handleUpdateChallenges = async () => {
    setIsUpdating(true);
    // Simulate fetching fresh AI-driven challenges
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUpdating(false);
  };

  const handleQuizAnswer = async (index: number) => {
    if (index === dailyQuizQuestions[quizStep].correct) {
      setQuizScore(prev => prev + 1);
    }

    if (quizStep < dailyQuizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizFinished(true);

      // Award XP and Badge in Firestore
      if (currentUser) {
        try {
          const db = getFirestore();
          if (!db) return;
          const userRef = doc(db, 'users', currentUser.uid);
          const finalScore = index === dailyQuizQuestions[quizStep].correct ? quizScore + 1 : quizScore;
          const xpGained = finalScore * 100;

          const updates: any = {
            experience: (userProfile?.experience || 0) + xpGained,
            notifications: arrayUnion({
              id: `quiz-${Date.now()}`,
              message: `Quiz Completed! +${xpGained} XP earned.`,
              type: 'success',
              timestamp: new Date().toISOString()
            })
          };

          // Unlock "Eco Sage" badge if score is perfect
          if (finalScore === dailyQuizQuestions.length && !userProfile?.badges?.includes('Eco Sage')) {
            updates.badges = arrayUnion('Eco Sage');
            updates.notifications.push({
              id: `badge-sage-${Date.now()}`,
              message: "🏆 New Badge Unlocked: Eco Sage!",
              type: 'achievement',
              timestamp: new Date().toISOString()
            });
          }

          await updateDoc(userRef, updates);
        } catch (error) {
          console.error("Error updating quiz rewards:", error);
        }
      }
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setQuizStep(0);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const speakDescription = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Section: ${activeTab}. ${sectionDescriptions[activeTab]}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf': return <Leaf className="h-5 w-5" />;
      case 'Zap': return <Zap className="h-5 w-5" />;
      case 'Droplets': return <Droplets className="h-5 w-5" />;
      case 'Wind': return <Wind className="h-5 w-5" />;
      case 'Map': return <Map className="h-5 w-5" />;
      case 'Trash': return <Trash className="h-5 w-5" />;
      case 'Star': return <Star className="h-5 w-5" />;
      case 'Award': return <Award className="h-5 w-5" />;
      default: return <Flame className="h-5 w-5" />;
    }
  };

  const isTaskCompleted = (taskId: string) => userProfile?.completedTasks?.includes(taskId);

  const toggleTask = async (challengeId: string, taskId: string, points: number) => {
    if (!currentUser || processingId) return;
    setProcessingId(taskId);
    try {
      const db = getFirestore();
      if (!db) return;
      const isCompleted = isTaskCompleted(taskId);
      const userRef = doc(db, 'users', currentUser.uid);
      const challenge = CHALLENGES.find(c => c.id === challengeId);

      if (isCompleted) {
        await updateDoc(userRef, {
          completedTasks: arrayRemove(taskId),
          experience: Math.max(0, (userProfile?.experience || 0) - points),
          ecoProgress: Math.max(0, (userProfile?.ecoProgress || 0) - 1)
        });
      } else {
        const newTotalTasks = (userProfile?.totalTasksCompleted || 0) + 1;
        const newExp = (userProfile?.experience || 0) + points;

        await updateDoc(userRef, {
          completedTasks: arrayUnion(taskId),
          experience: newExp,
          totalTasksCompleted: newTotalTasks,
          ecoProgress: Math.min(100, (userProfile?.ecoProgress || 0) + 1),
          notifications: arrayUnion({
            id: Date.now().toString(),
            message: `Mission step completed! +${points} XP gained.`,
            type: 'success',
            timestamp: new Date().toISOString()
          })
        });

        // Check for challenge completion
        if (challenge) {
          const updatedTasks = [...(userProfile?.completedTasks || []), taskId];
          const allTasksDone = challenge.tasks.every(t => updatedTasks.includes(t.id));

          if (allTasksDone) {
            await updateDoc(userRef, {
              completedChallenges: arrayUnion(challengeId),
              experience: newExp + (challenge.reward?.xp || 0),
              level: Math.floor((newExp + (challenge.reward?.xp || 0)) / 1000) + 1,
              notifications: arrayUnion({
                id: `complete-${challengeId}`,
                message: `🏆 Challenge Mastered: ${challenge.title}!`,
                type: 'achievement',
                timestamp: new Date().toISOString()
              })
            });
          }
        }
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredChallenges = CHALLENGES.filter(c => c.type === activeTab);

  return (
    <div className="space-y-10 pb-20">
      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-black to-black border border-white/10 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6"
          >
            <Trophy size={14} /> Eco Challenges Hub
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
            Transform Sustainability into an <span className="text-primary">Exciting Journey</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Challenge 3: Carbon Footprint Awareness Platform. AI-powered challenges, rewards, achievements, and community competitions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 font-black uppercase tracking-widest bg-primary text-black hover:bg-primary/90"
              onClick={() => setActiveTab('arena')}
            >
              <Swords size={18} className="mr-2" />
              Enter Quiz Arena
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 font-black uppercase tracking-widest border-white/20 hover:bg-white/5"
              onClick={() => {
                const leaderboardTab = document.querySelector('[data-tab="leaderboard"]');
                if (leaderboardTab) (leaderboardTab as HTMLElement).click();
              }}
            >
              <Trophy size={18} className="mr-2" />
              View Leaderboard
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/30 to-transparent" />
          <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-primary/20" />
        </div>
      </header>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: `${userProfile?.streak || 0} Days`, icon: FlameKindling, color: 'text-orange-500' },
          { label: 'Green Coins', value: (userProfile as any)?.greenCoins || 0, icon: Zap, color: 'text-yellow-500' },
          { label: 'Global Rank', value: `#${userProfile?.rank || '---'}`, icon: Trophy, color: 'text-primary' },
          { label: 'Badges', value: `${userProfile?.badges?.length || 0}/24`, icon: Award, color: 'text-blue-500' },
        ].map((stat, i) => (
          <Card key={i} variant="glass" className="p-4 flex flex-col items-center text-center">
            <stat.icon className={cn("h-6 w-6 mb-2", stat.color)} />
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{stat.label}</p>
            <p className="text-xl font-black">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* --- NAVIGATION TABS --- */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          {[
            { id: 'daily', label: 'Daily', icon: Clock },
            { id: 'weekly', label: 'Weekly', icon: Calendar },
            { id: 'monthly', label: 'Mega', icon: Star },
            { id: 'community', label: 'Community', icon: Users },
            { id: 'arena', label: 'Arena', icon: Swords },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id ? "bg-primary text-black" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={isSpeaking ? stopSpeaking : speakDescription}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all animate-in fade-in slide-in-from-left-2",
            isSpeaking
              ? "bg-red-500/10 border-red-500/50 text-red-500"
              : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
          )}
        >
          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isSpeaking ? "Stop AI Guide" : "Section Guide"}
          </span>
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[400px]">
        {activeTab === 'community' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_CHALLENGES.map((comm) => (
              <Card key={comm.id} variant="glass" className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   {getIcon(comm.icon)}
                </div>
                <h3 className="text-xl font-black mb-2">{comm.title}</h3>
                <p className="text-xs text-muted-foreground mb-6 uppercase font-black tracking-widest">Community Goal</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-primary">{comm.current.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">/ {comm.goal.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(comm.current / comm.goal) * 100}%` }}
                      className="h-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase">
                    <Award size={12} /> Reward: {comm.reward}
                  </div>
                </div>
              </Card>
            ))}
            <Card variant="glass" className="md:col-span-3 border-dashed border-primary/30 flex flex-col items-center justify-center p-12 text-center bg-primary/5">
               <Users className="h-12 w-12 text-primary mb-4" />
               <h3 className="text-2xl font-black">Collective Global Impact</h3>
               <p className="text-muted-foreground max-w-md mx-auto mt-2">All users contribute together. Every action counts towards these massive sustainability goals.</p>
               <div className="mt-8 flex gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">432T</p>
                    <p className="text-[10px] font-black uppercase text-primary">CO₂ REDUCED</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">1.2M</p>
                    <p className="text-[10px] font-black uppercase text-primary">LITERS SAVED</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">85K</p>
                    <p className="text-[10px] font-black uppercase text-primary">TREES PLANTED</p>
                  </div>
               </div>
            </Card>
          </div>
        ) : activeTab === 'arena' ? (
          <div className="space-y-8">
            <Card variant="glass" className="p-8 border-l-4 border-l-primary overflow-hidden relative">
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
                       <Swords className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black tracking-tighter">Eco Battle Arena</h2>
                       <p className="text-primary font-bold text-sm uppercase tracking-widest">Compete with other Eco Warriors</p>
                    </div>
                 </div>
                 <p className="text-muted-foreground max-w-2xl mb-8">
                    Rankings based on Carbon Reduction, XP Earned, Missions Completed, and Community Contributions. Climb the leagues to become the ultimate Planet Protector.
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { name: 'Bronze Warrior', icon: '🥉', color: 'border-orange-900/50 bg-orange-900/10' },
                      { name: 'Silver Guardian', icon: '🥈', color: 'border-slate-400/50 bg-slate-400/10' },
                      { name: 'Gold Champion', icon: '🥇', color: 'border-yellow-500/50 bg-yellow-500/10' },
                      { name: 'Diamond Hero', icon: '💎', color: 'border-cyan-400/50 bg-cyan-400/10' },
                      { name: 'Planet Protector', icon: '👑', color: 'border-primary/50 bg-primary/10', active: true },
                    ].map((league, i) => (
                      <div key={i} className={cn(
                        "p-4 rounded-2xl border flex flex-col items-center text-center transition-all",
                        league.color,
                        league.active ? "scale-110 ring-2 ring-primary shadow-2xl z-10" : "opacity-50 grayscale"
                      )}>
                        <span className="text-3xl mb-2">{league.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">{league.name}</span>
                        {league.active && <div className="mt-2 text-[8px] bg-primary text-black px-2 py-0.5 rounded-full font-black">CURRENT LEAGUE</div>}
                      </div>
                    ))}
                 </div>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Swords className="h-64 w-64" />
               </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card variant="glass" className="p-6">
                  <h3 className="text-xl font-black mb-6 flex items-center justify-between">
                     Top Rivals
                     <TrendingUp className="text-primary" size={20} />
                  </h3>
                  <div className="space-y-4">
                     {[
                       { name: 'Alex River', level: 48, xp: '12.4k', change: '+240' },
                       { name: 'Sarah Green', level: 45, xp: '11.8k', change: '+180' },
                       { name: 'Mark Woods', level: 42, xp: '10.2k', change: '+450' },
                     ].map((rival, i) => (
                       <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary">
                                {rival.name[0]}
                             </div>
                             <div>
                                <p className="text-sm font-bold">{rival.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black">LVL {rival.level} Specialist</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black">{rival.xp} XP</p>
                             <p className="text-[10px] text-green-500 font-black">{rival.change}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-6 text-[10px] font-black tracking-widest uppercase">
                     Open Battle Dashboard <ArrowUpRight size={14} className="ml-2" />
                  </Button>
               </Card>

               <Card variant="glass" className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
                  <h3 className="text-xl font-black mb-2">Weekly Eco Arena</h3>
                  <p className="text-xs text-muted-foreground mb-8">Ends in: 2d 14h 23m</p>

                  <div className="relative h-40 flex items-end justify-around gap-2 px-4 mb-4">
                     <div className="w-12 bg-white/10 rounded-t-lg h-2/3 relative group">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black">2nd</div>
                     </div>
                     <div className="w-16 bg-primary rounded-t-lg h-full relative shadow-lg shadow-primary/20">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                           <Trophy className="text-yellow-500 mb-1" size={16} />
                           <span className="text-xs font-black">YOU</span>
                        </div>
                     </div>
                     <div className="w-12 bg-white/10 rounded-t-lg h-1/2 relative group">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black">3rd</div>
                     </div>
                  </div>

                  <p className="text-center text-xs font-bold text-primary">You are currently in 1st Place! Maintain your lead to earn the Arena Champion Badge.</p>
                  <Button className="w-full mt-6 font-black uppercase tracking-widest">Compete Now</Button>
               </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredChallenges.map((challenge) => {
                const isJoined = (userProfile as any)?.activeChallenges?.includes(challenge.id);
                const isCompleted = userProfile?.completedChallenges?.includes(challenge.id);
                const completedTasksCount = challenge.tasks.filter(t => isTaskCompleted(t.id)).length;
                const progress = (completedTasksCount / challenge.tasks.length) * 100;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={challenge.id}
                  >
                    <Card
                      variant="glass"
                      className={cn(
                        "relative group overflow-hidden transition-all h-full flex flex-col",
                        expandedId === challenge.id ? 'ring-2 ring-primary/50' : 'hover:border-primary/30',
                        isCompleted ? 'border-primary/50 bg-primary/5' : ''
                      )}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/10 transition-colors">
                           {getIcon(challenge.icon)}
                        </div>
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-1 text-primary">
                              <Zap size={12} className="fill-primary" />
                              <span className="text-xs font-black">+{challenge.reward?.xp || challenge.points} XP</span>
                           </div>
                           <span className="text-[9px] text-muted-foreground mt-1 uppercase font-black tracking-widest">
                              {challenge.difficulty}
                           </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">{challenge.title}</h3>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
                        {challenge.description}
                      </p>

                      {isJoined || isCompleted ? (
                        <div className="space-y-2 mb-4">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                              <span className="text-muted-foreground">Progress ({completedTasksCount}/{challenge.tasks.length})</span>
                              <span className="text-primary">{Math.round(progress)}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                           </div>
                        </div>
                      ) : null}

                      <div className="flex gap-2">
                        {!isJoined && !isCompleted ? (
                           <Button
                             size="sm"
                             className="w-full text-[10px] font-black tracking-widest uppercase bg-primary text-black"
                             onClick={async () => {
                               if (!currentUser) return;
                               const db = getFirestore();
                               if (!db) return;
                               const userRef = doc(db, 'users', currentUser.uid);
                               await updateDoc(userRef, {
                                 activeChallenges: arrayUnion(challenge.id)
                               });
                             }}
                           >
                             Join Challenge
                           </Button>
                        ) : isCompleted ? (
                           <Button
                             size="sm"
                             variant="ghost"
                             disabled
                             className="w-full text-[10px] font-black tracking-widest uppercase text-primary"
                           >
                             <CheckCircle2 size={14} className="mr-2" />
                             Completed
                           </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={progress === 100 ? 'primary' : 'outline'}
                            className="w-full text-[10px] font-black tracking-widest uppercase"
                            onClick={() => {
                              if (progress === 100) {
                                // Claim Reward logic
                                toggleTask(challenge.id, '', 0); // Trigger completion check
                              } else {
                                setExpandedId(expandedId === challenge.id ? null : challenge.id);
                              }
                            }}
                          >
                            {progress === 100 ? 'Claim Reward' : (expandedId === challenge.id ? 'Close' : 'Complete Tasks')}
                          </Button>
                        )}
                      </div>

                      <AnimatePresence>
                        {expandedId === challenge.id && isJoined && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                              {challenge.tasks.map((task) => {
                                const done = isTaskCompleted(task.id);
                                return (
                                  <div
                                    key={task.id}
                                    onClick={() => toggleTask(challenge.id, task.id, task.points)}
                                    className={cn(
                                      "flex items-center gap-3 p-3 rounded-xl bg-white/5 border transition-all cursor-pointer group/task",
                                      done ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:border-primary/20',
                                      processingId === task.id ? 'opacity-50 animate-pulse' : ''
                                    )}
                                  >
                                    <div className={cn(
                                      "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                                      done ? 'border-primary bg-primary text-black' : 'border-white/20 group-hover/task:border-primary'
                                    )}>
                                       {done ? <CheckCircle2 size={12} /> : (
                                         <div className="h-2 w-2 rounded-full bg-primary opacity-0 group-hover/task:opacity-100 transition-opacity" />
                                       )}
                                    </div>
                                    <div className="flex-1">
                                      <p className={cn("text-xs font-bold", done ? 'text-primary' : '')}>{task.title}</p>
                                      <p className="text-[10px] text-muted-foreground">{task.description}</p>
                                    </div>
                                    <span className="text-[9px] font-bold text-primary">+{task.points} XP</span>
                                  </div>
                                );
                              })}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-[9px] font-bold uppercase opacity-50 hover:opacity-100"
                                onClick={() => alert("Proof submission system: Please upload a photo of your activity to verify.")}
                              >
                                Submit Proof (Photo)
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* --- AI PERSONALIZED SECTION --- */}
            <Card variant="glass" className="bg-primary/5 border-dashed border-primary/30 flex flex-col justify-between p-6">
               <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="text-primary" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Coach Recommended</span>
                  </div>
                  <h3 className="text-xl font-black mb-4">Personalized Missions</h3>
                  <div className="space-y-3">
                     {[
                       "Take public transport 3 times this week",
                       "Reduce meat consumption by 2 meals",
                       "Lower screen brightness to save energy"
                     ].map((aiTask, i) => (
                       <div key={i} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                          <div className="h-4 w-4 rounded-full bg-primary/20 flex-shrink-0 mt-0.5" />
                          {aiTask}
                       </div>
                     ))}
                  </div>
               </div>
               <Button variant="outline" size="sm" className="mt-8 font-black uppercase tracking-widest text-[10px]">
                  Generate More with AI
               </Button>
            </Card>
          </div>
        )}
      </div>

      {/* --- ECO STREAK & QUIZ AREA --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="p-8 relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-transparent">
           <div className="relative z-10">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                 <FlameKindling className="text-orange-500" />
                 Eco Streak System
              </h2>
              <div className="flex gap-4 mb-8">
                 {[
                   { days: 3, xp: 100 },
                   { days: 7, xp: 300 },
                   { days: 30, xp: 1000 },
                 ].map((streak, i) => (
                   <div key={i} className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-lg font-black">{streak.days}D</p>
                      <p className="text-[10px] font-black text-orange-500">+{streak.xp} XP</p>
                   </div>
                 ))}
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Progress</p>
                    <p className="text-xl font-black">{userProfile?.streak || 0} Day Streak</p>
                 </div>
                 <div className="h-12 w-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 flex items-center justify-center font-black">
                    {(userProfile?.streak || 0) % 7}/7
                 </div>
              </div>
           </div>
           <ZapOff className="absolute -bottom-10 -right-10 w-48 h-48 text-orange-500/5 rotate-12" />
        </Card>

        <Card variant="glass" className="p-8 relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <BrainCircuit className="text-blue-400" />
                    Eco Quiz Arena
                 </h2>
                 <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-1 rounded border border-blue-500/30 uppercase tracking-widest">
                    Live Now
                 </span>
              </div>

              {!showQuiz ? (
                <>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                     Challenge your environmental knowledge with our daily AI-curated quiz. Earn up to <span className="text-white font-bold">500 XP</span> and exclusive <span className="text-white font-bold">"Sage" badges</span>.
                  </p>

                  <div className="space-y-4 mb-8">
                     <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                              <Play size={16} fill="currentColor" />
                           </div>
                           <div>
                              <p className="text-xs font-bold">Today's Topic</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-blue-400/70">Global Sustainability</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-black">3 Questions</p>
                           <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">2 min</p>
                        </div>
                     </div>
                  </div>

                  <Button
                    onClick={() => setShowQuiz(true)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-6 shadow-lg shadow-blue-500/20"
                  >
                     Start Quiz Challenge
                  </Button>
                </>
              ) : quizFinished ? (
                <div className="text-center py-4 space-y-4">
                  <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Quiz Completed!</h3>
                  <p className="text-muted-foreground">You scored {quizScore} out of {dailyQuizQuestions.length}</p>
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <p className="text-xs font-black text-primary uppercase">REWARD EARNED</p>
                    <p className="text-xl font-black">+{quizScore * 100} XP</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={resetQuiz}>Back to Arena</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-blue-400">
                    <span>Question {quizStep + 1} of {dailyQuizQuestions.length}</span>
                    <span>{Math.round(((quizStep + 1) / dailyQuizQuestions.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${((quizStep + 1) / dailyQuizQuestions.length) * 100}%` }} />
                  </div>

                  <h3 className="text-lg font-bold leading-tight min-h-[3rem]">
                    {dailyQuizQuestions[quizStep].question}
                  </h3>

                  <div className="grid gap-2">
                    {dailyQuizQuestions[quizStep].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all text-sm font-medium"
                      >
                        <span className="inline-block w-6 text-blue-400 font-bold">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
           </div>
           <BrainCircuit className="absolute -bottom-10 -right-10 w-48 h-48 text-blue-400/5 -rotate-12 pointer-events-none" />
        </Card>
      </div>

      {/* --- ACHIEVEMENT SYSTEM --- */}
      <section>
         <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-black flex items-center gap-3 tracking-tighter">
              <Award className="text-yellow-500 h-8 w-8" />
              Achievement System
           </h2>
           <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
             {userProfile?.badges?.length || 0} / 24 UNLOCKED
           </span>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {BADGES.map((badge, i) => {
              const locked = (userProfile?.level || 1) < badge.level;
              const isEarned = userProfile?.badges?.includes(badge.name);
              return (
                <Card
                  key={i}
                  variant="glass"
                  className={cn(
                    "text-center p-4 relative group transition-all",
                    locked && !isEarned ? 'opacity-30 grayscale' : 'hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] cursor-help',
                    isEarned && "border-primary/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                  )}
                  title={badge.name}
                >
                   <div className="text-4xl mb-3 group-hover:rotate-12 transition-transform duration-500">
                      {locked && !isEarned ? <Lock className="mx-auto text-muted-foreground h-8 w-8" /> : badge.icon}
                   </div>
                   <p className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2">{badge.name}</p>
                   {!locked && isEarned && <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />}
                </Card>
              );
            })}
         </div>
      </section>

      {/* --- GREEN REWARDS STORE --- */}
      <Card variant="glass" className="p-8 border-t-4 border-t-yellow-500 bg-yellow-500/5">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
               <h2 className="text-2xl font-black flex items-center gap-3 mb-2">
                  <ShoppingBag className="text-yellow-500" />
                  Green Rewards Store
               </h2>
               <p className="text-muted-foreground text-sm">
                  Earn Green Coins by completing missions. Redeem them for premium themes, exclusive avatars, AI reports, and sustainability certificates.
               </p>
            </div>
            <div className="flex gap-4">
               {[
                 { label: 'Premium Themes', cost: '500' },
                 { label: 'AI Reports', cost: '1000' },
                 { label: 'Certificates', cost: '2500' },
               ].map((reward, i) => (
                 <div key={i} className="px-6 py-4 rounded-2xl bg-black/40 border border-white/10 text-center min-w-[120px]">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">{reward.label}</p>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 font-black">
                       <Zap size={10} className="fill-yellow-500" />
                       {reward.cost}
                    </div>
                 </div>
               ))}
            </div>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest whitespace-nowrap">
               Open Store
            </Button>
         </div>
      </Card>

      {/* --- LIVE PROGRESS DASHBOARD --- */}
      <Card variant="glass" className="p-10 border-white/10 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary animate-pulse" />
         <h2 className="text-2xl font-black mb-10 text-center tracking-tighter uppercase">Live Progress Dashboard</h2>
         <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {[
              { label: 'Trees Saved', value: '14', icon: '🌳' },
              { label: 'Energy Saved', value: '450 kWh', icon: '⚡' },
              { label: 'Water Saved', value: '1.2k L', icon: '💧' },
              { label: 'Waste Recycled', value: '24 kg', icon: '♻️' },
              { label: 'Green Trips', value: '142', icon: '🚲' },
              { label: 'CO₂ Reduced', value: '340 kg', icon: '🌍' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                 <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{stat.icon}</div>
                 <p className="text-2xl font-black mb-1">{stat.value}</p>
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            ))}
         </div>
         <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <span>Updating in real time...</span>
            <span className="text-primary flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
               Planet Protector Rank: Top 1% Global
            </span>
         </div>
      </Card>
    </div>
  );
};

export default Challenges;
