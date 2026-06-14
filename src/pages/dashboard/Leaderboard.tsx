import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Search, Filter, CheckCircle2, Clock, Zap, Award, Mail, X, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getFirestore } from '../../lib/firebase';
import { generateBots } from '../../lib/bots';
import { UserProfile } from '../../types';

const Leaderboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'online'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    const db = getFirestore();
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      })) as UserProfile[];

      const validUsers = users.filter(u => u.fullName || u.email);
      const bots = generateBots();
      const allUsers = [...validUsers, ...bots];

      const sortedUsers = allUsers.sort((a, b) => {
        const scoreA = a.ecoProgress ?? 0;
        const scoreB = b.ecoProgress ?? 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.joinedAt || 0).getTime() - new Date(a.joinedAt || 0).getTime();
      });

      setLeaderboardData(sortedUsers);
      setLoading(false);
    }, (err) => {
      console.error("Leaderboard sync error:", err);
      setError("Unable to sync global leaderboard.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getRankName = (level: number) => {
    if (level > 30) return 'Eco Champion';
    if (level > 20) return 'Eco Titan';
    if (level > 10) return 'Eco Guardian';
    return 'Eco Specialist';
  };

  const displayedUsers = leaderboardData.filter(u => {
    const matchesSearch =
      (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter === 'online') return u.isOnline === true;
    return true;
  });

  const stats = {
    totalWarriors: leaderboardData.length,
    activeNow: leaderboardData.filter(u => u.isOnline).length,
    co2Offset: leaderboardData.reduce((acc, u) => acc + (u.ecoProgress || 0) * 0.5, 0).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    tasksCompleted: leaderboardData.reduce((acc, u) => acc + (u.totalTasksCompleted || 0), 0).toLocaleString()
  };

  return (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Trophy className="mr-3 text-yellow-500" />
            Global Sustainability Leaderboard
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-muted-foreground text-sm">Eco Warriors: <span className="text-white font-bold">{stats.totalWarriors}</span></p>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <p className="text-muted-foreground text-sm">Active: <span className="text-green-500 font-bold">{stats.activeNow}</span></p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search warriors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none w-64"
          />
        </div>
      </header>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         {displayedUsers.slice(0, 3).map((user, i) => (
           <Card
             key={user.uid}
             variant="glass"
             onClick={() => setSelectedUser(user)}
             className={`relative pt-12 text-center border-t-4 cursor-pointer hover:bg-white/5 transition-all ${
               i === 0 ? 'border-t-yellow-500 md:scale-105 z-10' :
               i === 1 ? 'border-t-gray-400' : 'border-t-amber-600'
             }`}
           >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="relative">
                   <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-2xl font-bold text-black shadow-xl overflow-hidden border-2 border-white/10">
                      {(user.profileImage || user.photoURL) ? (
                        <img
                          src={user.profileImage || user.photoURL}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as any).src = ''; (e.target as any).style.display='none'; }}
                        />
                      ) : (user.fullName?.[0] || 'W')}
                   </div>
                   <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                      {i === 0 ? <Crown className="text-yellow-500 h-5 w-5" /> :
                       i === 1 ? <Medal className="text-gray-400 h-5 w-5" /> :
                       <Medal className="text-amber-600 h-5 w-5" />}
                   </div>
                   {user.isOnline && (
                     <div className="absolute top-0 right-0 h-4 w-4 bg-green-500 border-2 border-[#09090b] rounded-full animate-pulse" />
                   )}
                </div>
             </div>
             <h3 className="text-xl font-bold mt-4">{user.fullName}</h3>
             <p className="text-xs text-primary font-bold uppercase tracking-widest">
               LEVEL {user.level || 1} • {getRankName(user.level || 1)}
             </p>
             <div className="mt-6 grid grid-cols-2 border-t border-white/5 pt-4">
                <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold">Tasks</p>
                   <p className="text-lg font-bold">{user.totalTasksCompleted || 0}</p>
                </div>
                <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold">Score</p>
                   <p className="text-lg font-bold text-primary">{user.ecoProgress || 0}</p>
                </div>
             </div>
           </Card>
         ))}
      </div>

      <div className="flex gap-2 mb-4">
         <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')} className="text-[10px] h-8 px-4">All Warriors</Button>
         <Button variant={filter === 'online' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('online')} className="text-[10px] h-8 px-4 gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active Now
         </Button>
      </div>

      <Card variant="glass" className="p-0 overflow-hidden relative">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase text-muted-foreground font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Warrior</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4 text-right">Activity</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {displayedUsers.map((user, index) => (
                      <tr
                        key={user.uid}
                        onClick={() => setSelectedUser(user)}
                        className={`hover:bg-white/5 transition-colors cursor-pointer ${user.uid === userProfile?.uid ? 'bg-primary/5' : ''}`}
                      >
                        <td className="px-6 py-4 font-bold text-muted-foreground">#{index + 1}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-sm font-bold relative">
                                  {(user.profileImage || user.photoURL) ? <img src={user.profileImage || user.photoURL} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as any).style.display='none'; }} /> : (user.fullName?.[0] || 'W')}
                              </div>
                              <div>
                                <p className="font-bold text-sm flex items-center gap-2">
                                  {user.fullName}
                                  {user.uid === userProfile?.uid && <span className="text-[10px] bg-primary text-black px-1.5 py-0.5 rounded font-black">ME</span>}
                                  {(user as any).isBot && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black border border-blue-500/30">BOT</span>}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{ (user as any).isBot ? 'Verified AI Warrior' : `Joined ${user.joinedAt}`}</p>
                              </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-[10px] font-black uppercase tracking-widest">
                              Level {user.level || 1} • {getRankName(user.level || 1)}
                           </p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs font-bold text-primary">{user.ecoProgress || 0} pts</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            {user.isOnline ? (
                              <div className="flex items-center justify-end gap-2 text-green-500">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold">Online</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground/40">Offline</span>
                            )}
                        </td>
                      </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </Card>

      {/* Sticky Bottom "YOU" Bar */}
      {userProfile && (
        <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                #{leaderboardData.findIndex(u => u.uid === userProfile.uid) + 1}
              </div>
              <div>
                <p className="text-sm font-bold">{userProfile.fullName} (You)</p>
                <p className="text-[10px] text-primary uppercase font-black tracking-widest">
                  Level {userProfile.level || 1} • {getRankName(userProfile.level || 1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 md:gap-12">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-muted-foreground uppercase font-black">Eco Score</p>
                <p className="text-sm font-bold text-primary">{userProfile.ecoProgress || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-black">Experience</p>
                <p className="text-sm font-bold">{userProfile.experience || 0} XP</p>
              </div>
              <Button size="sm" variant="outline" className="h-9 text-[10px] uppercase font-black border-primary/20 text-primary" onClick={() => setSelectedUser(userProfile)}>My Stats</Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Preview Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md">
              <Card variant="glass" className="relative p-8 text-center border-primary/20">
                <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-white"><X size={20} /></button>
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary to-blue-500 mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-black shadow-2xl overflow-hidden border-4 border-white/10">
                  {(selectedUser.profileImage || selectedUser.photoURL) ? <img src={selectedUser.profileImage || selectedUser.photoURL} className="h-full w-full object-cover" onError={(e) => { (e.target as any).style.display='none'; }} /> : selectedUser.fullName?.[0]}
                </div>
                <h2 className="text-2xl font-bold">{selectedUser.fullName}</h2>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">LEVEL {selectedUser.level || 1} {getRankName(selectedUser.level || 1)}</p>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">XP</p>
                    <p className="text-lg font-bold">{selectedUser.experience || 0}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Tasks</p>
                    <p className="text-lg font-bold">{selectedUser.totalTasksCompleted || 0}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Score</p>
                    <p className="text-lg font-bold text-primary">{selectedUser.ecoProgress || 0}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground">
                   <div className="flex items-center gap-2">
                     <Calendar size={14} />
                     <span className="text-xs">Joined: {selectedUser.joinedAt}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Mail size={14} />
                     <span className="text-xs">{selectedUser.email}</span>
                   </div>
                </div>

                <Button variant="primary" className="w-full mt-8" onClick={() => setSelectedUser(null)}>Close</Button>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
