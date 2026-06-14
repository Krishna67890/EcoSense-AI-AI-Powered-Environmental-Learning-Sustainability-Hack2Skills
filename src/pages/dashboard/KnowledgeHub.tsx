import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Microscope,
  Search,
  Star,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Filter,
  Trophy,
  Loader2,
  ChevronRight,
  ClipboardList,
  AlertTriangle,
  ExternalLink,
  X,
  Sparkles,
  Trophy as TrophyIcon
} from 'lucide-react';
// @ts-ignore - confetti is loaded via CDN in index.html
const confetti = window.confetti;
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { MODULES, LABS } from '../../lib/data';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore } from '../../lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { EcoModule, EcoLab } from '../../types';

const KnowledgeHub = () => {
  const { userProfile, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'modules' | 'labs'>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ type: 'module' | 'lab', data: any } | null>(null);
  const [quizState, setQuizState] = useState<{
    view: 'intro' | 'quiz' | 'result';
    currentQuestionIndex: number;
    answers: number[];
    score: number;
  }>({
    view: 'intro',
    currentQuestionIndex: 0,
    answers: [],
    score: 0
  });

  const resetQuiz = () => {
    setQuizState({
      view: 'intro',
      currentQuestionIndex: 0,
      answers: [],
      score: 0
    });
  };

  React.useEffect(() => {
    if (!selectedItem) {
      resetQuiz();
    }
  }, [selectedItem]);

  const handleStartQuiz = () => {
    setQuizState(prev => ({ ...prev, view: 'quiz' }));
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const currentItem = selectedItem?.data;
    if (!currentItem || !currentItem.quiz) return;

    const newAnswers = [...quizState.answers, answerIndex];

    if (quizState.currentQuestionIndex < currentItem.quiz.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1,
        answers: newAnswers
      });
    } else {
      // Calculate score
      const correctCount = newAnswers.reduce((acc, ans, idx) => {
        return ans === currentItem.quiz[idx].correctAnswer ? acc + 1 : acc;
      }, 0);
      const finalScore = Math.round((correctCount / currentItem.quiz.length) * 100);

      setQuizState({
        ...quizState,
        view: 'result',
        answers: newAnswers,
        score: finalScore
      });
    }
  };

  const filteredModules = MODULES.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLabs = LABS.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.objective.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTask = async (id: string, isModule: boolean) => {
    if (!currentUser) return;
    const completedTasks = userProfile?.completedTasks || [];
    const isCompleted = completedTasks.includes(id);

    try {
      const db = getFirestore();
      if (!db) return;
      const userRef = doc(db, 'users', currentUser.uid);
      if (isCompleted) {
        // We don't usually "un-complete" for modules in this logic, but keeping it robust
      } else {
        const newXP = (userProfile?.experience || 0) + 10;
        const newLevel = Math.floor(newXP / 1000) + 1;
        await updateDoc(userRef, {
          completedTasks: arrayUnion(id),
          experience: newXP,
          level: newLevel
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteItem = async (id: string, type: 'module' | 'lab') => {
    if (!currentUser || processingId) return;

    // Validate if all sub-tasks are checked off first
    const item = type === 'module' ? MODULES.find(m => m.id === id) : LABS.find(l => l.id === id);
    if (!item) return;

    const completedTasks = userProfile?.completedTasks || [];
    const itemTasks = type === 'module'
      ? (item.tasks || []).map((t: any) => t.id)
      : (item as any).experimentSteps.map((_: any, i: number) => `${id}-step-${i}`);

    const allTasksDone = itemTasks.every((tId: string) => completedTasks.includes(tId));

    if (!allTasksDone) {
      alert("You must check off all real-world tasks above before you can Finalize & Claim your XP!");
      return;
    }

    setProcessingId(id);

    try {
      const db = getFirestore();
      if (!db) return;
      const userRef = doc(db, 'users', currentUser.uid);
      const field = type === 'module' ? `moduleProgress.${id}` : `labProgress.${id}`;
      const xp = type === 'module' ? 500 : 1000;
      const newXP = (userProfile?.experience || 0) + xp;
      const newLevel = Math.floor(newXP / 1000) + 1;

      const badgeName = type === 'module'
        ? `${item.title.split(': ')[1] || 'Module'} Specialist`
        : `${item.title.split(': ')[1] || 'Lab'} Expert`;

      const updates: any = {
        [field]: 100,
        experience: newXP,
        level: newLevel,
        badges: arrayUnion(badgeName),
        totalTasksCompleted: (userProfile?.totalTasksCompleted || 0) + 1,
        ecoProgress: Math.min(100, (userProfile?.ecoProgress || 0) + (type === 'module' ? 5 : 10)),
        sustainabilityScore: Math.min(100, (userProfile?.sustainabilityScore || 0) + (type === 'module' ? 5 : 10)),
        notifications: arrayUnion({
          id: `complete-${id}-${Date.now()}`,
          message: `🏆 ${type === 'module' ? 'Module' : 'Lab'} Mastered: ${item.title}!`,
          type: 'achievement',
          timestamp: new Date().toISOString()
        })
      };

      // Award "Eco Sage" if score was 100%
      if (quizState.score === 100 && !userProfile?.badges?.includes('Eco Sage')) {
        updates.badges = arrayUnion(badgeName, 'Eco Sage');
        updates.notifications = arrayUnion(
          {
            id: `complete-${id}-${Date.now()}`,
            message: `🏆 ${type === 'module' ? 'Module' : 'Lab'} Mastered: ${item.title}!`,
            type: 'achievement',
            timestamp: new Date().toISOString()
          },
          {
            id: `badge-sage-${Date.now()}`,
            message: "🏆 New Badge Unlocked: Eco Sage!",
            type: 'achievement',
            timestamp: new Date().toISOString()
          }
        );
      }

      await updateDoc(userRef, updates);
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const totalModulesCompleted = Object.values(userProfile?.moduleProgress || {}).filter(v => v === 100).length;
  const totalLabsCompleted = Object.values(userProfile?.labProgress || {}).filter(v => v === 100).length;
  const totalProgress = Math.round(((totalModulesCompleted + totalLabsCompleted) / (MODULES.length + LABS.length)) * 100);

  return (
    <div className="space-y-8 pb-10 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
            <GraduationCap className="mr-3 text-primary animate-bounce-slow" />
            Eco-Intelligence Academy
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            <span className="text-primary font-bold">[VERIFIED]</span> 105+ Sustainability Modules & Advanced Experimental Labs.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <motion.div
             whileHover={{ scale: 1.05 }}
             className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
           >
              <Trophy className="text-primary h-4 w-4" />
              <span className="text-xs font-bold text-primary">Academy Rank: {userProfile?.level && userProfile.level > 15 ? 'Eco-Savant' : (userProfile?.level && userProfile.level > 5 ? 'Environmentalist' : 'Novice')}</span>
           </motion.div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6 border-l-4 border-l-primary relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-primary/10 group-hover:scale-110 transition-transform">
            <Zap size={64} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Hub Progress</p>
          <p className="text-3xl font-black">{totalProgress}%</p>
          <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </Card>
        <Card variant="glass" className="p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-blue-500/10 group-hover:scale-110 transition-transform">
            <Microscope size={64} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Labs Verified</p>
          <p className="text-3xl font-black">{totalLabsCompleted}/50</p>
          <p className="text-[10px] text-blue-400 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 size={10} /> HANDS-ON EXPERIENCE
          </p>
        </Card>
        <Card variant="glass" className="p-6 border-l-4 border-l-purple-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-purple-500/10 group-hover:scale-110 transition-transform">
            <BookOpen size={64} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Modules Mastered</p>
          <p className="text-3xl font-black">{totalModulesCompleted}/55</p>
          <p className="text-[10px] text-purple-400 font-bold mt-2 flex items-center gap-1">
            <Star size={10} className="fill-purple-400" /> ACADEMIC EXCELLENCE
          </p>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex space-x-1 p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'modules' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'
            }`}
          >
            55 Modules
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'labs' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'
            }`}
          >
            50 Eco Labs
          </button>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'modules' ? (
          <motion.div
            key="modules"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredModules.map((mod) => {
              const isDone = userProfile?.moduleProgress?.[mod.id] === 100;
              return (
                <motion.div
                  key={mod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`group relative rounded-3xl p-6 transition-all cursor-pointer overflow-hidden border ${
                    isDone
                      ? 'border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                      : 'border-white/10 bg-white/5 hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedItem({ type: 'module', data: mod })}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all group-hover:rotate-12">
                     <BookOpen size={60} className="text-primary" />
                  </div>

                  <div className="flex justify-between items-start mb-4">
                     <span className="text-[9px] font-black text-primary px-2.5 py-1 bg-primary/10 rounded-full border border-primary/20 uppercase tracking-tighter">
                       {mod.duration}
                     </span>
                     <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/10">
                        <AlertTriangle size={10} className="text-orange-500" />
                        <span className="text-[9px] font-black text-orange-500 uppercase">Hard Mode</span>
                     </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground mb-6 line-clamp-2 leading-relaxed font-medium">{mod.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                     <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${isDone ? 'bg-primary text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-white/5 group-hover:bg-primary/20'}`}>
                           {isDone ? <CheckCircle2 size={16} /> : <Zap size={14} className="text-primary" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase leading-none">{isDone ? 'Mastered' : 'Locked'}</p>
                          <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{mod.tasks.length} Actionable Tasks</p>
                        </div>
                     </div>
                     <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl group-hover:bg-primary group-hover:text-black transition-all">
                        <ArrowRight size={18} />
                     </Button>
                  </div>

                  {/* Difficulty Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="labs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredLabs.map((lab) => {
              const progress = userProfile?.labProgress?.[lab.id] || 0;
              return (
                <Card
                  key={lab.id}
                  variant="glass"
                  className={`group hover:border-blue-500/30 transition-all cursor-pointer border-l-4 ${progress === 100 ? 'border-l-primary bg-primary/5' : 'border-l-blue-500/50'}`}
                  onClick={() => setSelectedItem({ type: 'lab', data: lab })}
                >
                  <div className="flex items-center gap-4 mb-4">
                     <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${progress === 100 ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-400'}`}>
                        <Microscope size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-sm leading-tight group-hover:text-blue-400 transition-colors">{lab.title}</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Interactive Experiment</p>
                     </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed italic">
                    "{lab.objective}"
                  </p>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase">
                        <span className="text-muted-foreground">Lab Progress</span>
                        <span className={progress === 100 ? 'text-primary' : 'text-blue-400'}>{progress}%</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-primary' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
                     </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full mt-6 text-[10px] font-black tracking-widest uppercase border-blue-500/20 text-blue-400 hover:bg-blue-500/10 ${progress === 100 ? 'border-primary/50 text-primary' : ''}`}
                  >
                     {progress === 100 ? 'Review Experiment' : 'Launch Lab'}
                  </Button>
                </Card>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal / Detail View */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 p-8 flex items-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">{selectedItem.data.title}</h2>
                  <p className="text-sm text-primary font-black uppercase tracking-widest">{selectedItem.type}</p>
                </div>
              </div>

              <div className="p-8 overflow-y-auto space-y-8 flex-1">
                {quizState.view === 'intro' ? (
                  <>
                    <section>
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Introduction</h4>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {selectedItem.data.description} {selectedItem.data.objective || selectedItem.data.content}
                      </p>
                    </section>

                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Step 1: Required Field Tasks</h4>
                        <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">+10 XP per task</span>
                      </div>

                      <div className="space-y-3">
                        {(selectedItem.type === 'module' ? selectedItem.data.tasks : selectedItem.data.experimentSteps).map((task: any, idx: number) => {
                          const taskId = selectedItem.type === 'module' ? task.id : `${selectedItem.data.id}-step-${idx}`;
                          const isCompleted = userProfile?.completedTasks?.includes(taskId);

                          return (
                            <div
                              key={idx}
                              onClick={() => toggleTask(taskId, selectedItem.type === 'module')}
                              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${
                                isCompleted ? 'bg-primary border-primary text-black' : 'border-white/20'
                              }`}>
                                {isCompleted && <CheckCircle2 size={14} />}
                              </div>
                              <span className={`text-sm font-medium ${isCompleted ? 'text-white line-through opacity-50' : 'text-white/90'}`}>
                                {selectedItem.type === 'module' ? task.title : task}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <div className="pt-4 border-t border-white/5">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Possible Reward</p>
                            <p className="text-xl font-black text-primary">+{selectedItem.type === 'module' ? '500' : '1000'} XP</p>
                          </div>
                          <Button
                            onClick={handleStartQuiz}
                            disabled={!((selectedItem.type === 'module' ? selectedItem.data.tasks.map((t: any) => t.id) : selectedItem.data.experimentSteps.map((_: any, i: number) => `${selectedItem.data.id}-step-${i}`)).every((id: string) => userProfile?.completedTasks?.includes(id)))}
                            className="px-10 h-12 rounded-xl text-sm font-black uppercase tracking-widest group"
                          >
                            Step 2: Start Quiz <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground italic font-medium flex items-center justify-center gap-1">
                          <AlertTriangle size={10} className="text-orange-500" />
                          You must complete all tasks above before taking the validation quiz.
                        </p>
                      </div>
                    </div>
                  </>
                ) : quizState.view === 'quiz' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-black text-primary uppercase">Question {quizState.currentQuestionIndex + 1} of {selectedItem.data.quiz?.length || 5}</span>
                       <div className="flex gap-1">
                          {selectedItem.data.quiz?.map((_: any, i: number) => (
                             <div key={i} className={`h-1 w-8 rounded-full ${i <= quizState.currentQuestionIndex ? 'bg-primary' : 'bg-white/10'}`} />
                          ))}
                       </div>
                    </div>

                    <h3 className="text-xl font-bold leading-tight">
                       {selectedItem.data.quiz?.[quizState.currentQuestionIndex]?.question}
                    </h3>

                    <div className="grid gap-3">
                       {selectedItem.data.quiz?.[quizState.currentQuestionIndex]?.options.map((option: string, idx: number) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswerQuestion(idx)}
                            className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium"
                          >
                             <div className="flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">{String.fromCharCode(65 + idx)}</span>
                                {option}
                             </div>
                          </motion.button>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-6">
                    <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center ${quizState.score >= 80 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                       {quizState.score >= 80 ? <TrophyIcon size={40} /> : <AlertTriangle size={40} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{quizState.score >= 80 ? 'Verification Successful!' : 'Verification Failed'}</h3>
                      <p className="text-muted-foreground mt-2">You scored {quizState.score}% on the {selectedItem.data.title} Quiz.</p>
                    </div>

                    {quizState.score >= 80 ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 inline-block">
                           <p className="text-xs font-bold text-primary mb-1">UNLOCKED REWARD</p>
                           <p className="text-2xl font-black">+{selectedItem.type === 'module' ? '500' : '1000'} XP</p>
                        </div>
                        <div className="flex justify-center gap-4">
                           <Button
                             onClick={() => handleCompleteItem(selectedItem.data.id, selectedItem.type)}
                             disabled={processingId === selectedItem.data.id}
                             className="px-10 h-12 rounded-xl text-sm font-black uppercase tracking-widest"
                           >
                             {processingId === selectedItem.data.id ? <Loader2 className="animate-spin" /> : 'Claim Rewards & Badge'}
                           </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          You need at least 80% score to verify this module. Please review the content and try again.
                        </p>
                        <Button
                          variant="outline"
                          onClick={resetQuiz}
                          className="px-10 h-12 rounded-xl text-sm font-black uppercase tracking-widest border-white/10"
                        >
                          Retry Quiz
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Impact Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
         {[
           { label: 'Modules Available', value: '55+', icon: <BookOpen size={14} /> },
           { label: 'Active Labs', value: '50', icon: <Microscope size={14} /> },
           { label: 'Avg. Completion', value: '18 mins', icon: <Clock size={14} /> },
           { label: 'XP Potential', value: '45,000+', icon: <Zap size={14} /> }
         ].map((stat, i) => (
           <Card key={i} variant="glass" className="p-4 flex items-center gap-3 border-white/5 hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                 {stat.icon}
              </div>
              <div>
                 <p className="text-sm font-black">{stat.value}</p>
                 <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">{stat.label}</p>
              </div>
           </Card>
         ))}
      </div>

      {/* Global Progress Bar */}
      <Card variant="glass" className="mt-8 bg-primary/5 border-primary/20 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <TrophyIcon size={24} />
               </div>
               <div>
                  <h4 className="text-lg font-bold uppercase tracking-tighter">Academic Mastery Progress</h4>
                  <p className="text-xs text-muted-foreground">Leveling up through the 105+ curriculum items.</p>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="text-right flex-1 md:flex-none">
                  <p className="text-[10px] text-muted-foreground uppercase font-black">Total Earned XP</p>
                  <p className="text-xl font-black text-primary">{(totalModulesCompleted * 500 + totalLabsCompleted * 1000).toLocaleString()} XP</p>
               </div>
               <div className="w-40 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 2, ease: "backOut" }}
                  />
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
};

export default KnowledgeHub;
