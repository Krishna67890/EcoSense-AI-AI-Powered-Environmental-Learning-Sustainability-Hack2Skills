import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  Award,
  Users,
  Search,
  Plus,
  Filter,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  Send,
  MoreVertical,
  Flag,
  User as UserIcon,
  Leaf,
  Globe,
  Star,
  Hash
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore } from '../../lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { generateBotPosts, BOT_COMMENTS, BOT_NAMES } from '../../lib/bots';
import { CommunityPost } from '../../types';

const CommunityHub = () => {
  const { userProfile, currentUser } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'achievements' | 'discussions' | 'tips'>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const db = getFirestore();
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'community_posts'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityPost[];

      const botPosts = generateBotPosts(50); // Add 50 bot posts to the feed
      const combinedPosts = [...fetchedPosts, ...botPosts].map(post => {
        // Randomly add bot comments to posts that don't have many
        if (post.comments.length < 2 && Math.random() > 0.5) {
          const numComments = Math.floor(Math.random() * 3) + 1;
          const botComments = Array.from({ length: numComments }, (_, i) => ({
            id: `bot-comment-${post.id}-${i}`,
            userId: `bot-${Math.floor(Math.random() * BOT_NAMES.length)}`,
            userName: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
            content: BOT_COMMENTS[Math.floor(Math.random() * BOT_COMMENTS.length)],
            timestamp: new Date().toISOString()
          }));
          return { ...post, comments: [...post.comments, ...botComments] };
        }
        return post;
      }).sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setPosts(combinedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!currentUser || !newPost.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const db = getFirestore();
      if (!db) return;
      await addDoc(collection(db, 'community_posts'), {
        userId: currentUser.uid,
        userName: userProfile?.fullName || 'Eco Warrior',
        userImage: userProfile?.photoURL || '',
        content: newPost,
        type: 'discussion',
        likes: [],
        comments: [],
        timestamp: new Date().toISOString(),
        tags: ['#EcoSense', '#Sustainability']
      });
      setNewPost('');
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string, likes: string[]) => {
    if (!currentUser) return;
    const db = getFirestore();
    if (!db) return;
    const postRef = doc(db, 'community_posts', postId);
    const isLiked = likes.includes(currentUser.uid);

    try {
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || post.type === activeTab.slice(0, -1);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="mr-3 text-primary" />
            Eco Community Hub
          </h1>
          <p className="text-muted-foreground text-sm">Connect, share achievements, and discuss sustainability with 12k+ warriors.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none w-64"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Post & Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Create Post */}
          <Card variant="glass" className="p-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="" /> : <UserIcon className="text-primary h-6 w-6" />}
              </div>
              <div className="flex-1 space-y-4">
                <textarea
                  placeholder="Share a sustainability tip, achievement, or start a discussion..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none min-h-[80px]"
                />
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                      <ImageIcon size={14} className="mr-2" /> Image
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                      <Hash size={14} className="mr-2" /> Tags
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 px-6 text-[10px] font-black uppercase tracking-widest"
                    disabled={!newPost.trim() || isPosting}
                    onClick={handlePost}
                  >
                    {isPosting ? 'Posting...' : 'Post Message'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
             {(['all', 'achievements', 'discussions', 'tips'] as const).map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={cn(
                   "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                   activeTab === tab ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                 )}
               >
                 {tab}
               </button>
             ))}
          </div>

          {/* Feed */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <Card variant="glass" className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary/20 to-blue-500/20 flex items-center justify-center overflow-hidden border border-white/10">
                           {post.userImage ? <img src={post.userImage} alt="" className="h-full w-full object-cover" /> : <UserIcon className="text-primary h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold flex items-center gap-2">
                            {post.userName}
                            {post.type === 'achievement' && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded font-black uppercase">Level Up</span>}
                            {(post as any).isBot && <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black border border-blue-500/30">BOT</span>}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{new Date(post.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <button className="text-muted-foreground hover:text-white p-1">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <p className="text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.image && (
                      <div className="mb-6 rounded-2xl overflow-hidden border border-white/10">
                        <img src={post.image} alt="Post content" className="w-full h-auto" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                       {post.tags?.map(tag => (
                         <span key={tag} className="text-[10px] text-primary font-bold hover:underline cursor-pointer">{tag}</span>
                       ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                        <button
                          onClick={() => toggleLike(post.id, post.likes)}
                          className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                            currentUser && post.likes.includes(currentUser.uid) ? "text-primary" : "text-muted-foreground hover:text-white"
                          )}
                        >
                          <ThumbsUp size={14} />
                          {post.likes.length} Likes
                        </button>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                          <MessageSquare size={14} />
                          {post.comments.length} Comments
                        </button>
                      </div>
                      <button className="text-muted-foreground hover:text-white transition-colors">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                 <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                 <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Loading Community Feed...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 space-y-6">
           <Card variant="glass" className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                 <TrendingUp size={20} className="text-primary" />
                 Trending Topics
              </h3>
              <div className="space-y-4">
                 {[
                   { tag: '#ZeroWaste', posts: '1.2k', trend: 'up' },
                   { tag: '#SolarPower', posts: '856', trend: 'up' },
                   { tag: '#EcoFriendly', posts: '2.4k', trend: 'stable' },
                   { tag: '#ClimateAction', posts: '4.1k', trend: 'up' },
                   { tag: '#GreenLiving', posts: '1.5k', trend: 'down' }
                 ].map((topic, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div>
                         <p className="text-sm font-bold group-hover:text-primary transition-colors">{topic.tag}</p>
                         <p className="text-[10px] text-muted-foreground">{topic.posts} posts this week</p>
                      </div>
                      <div className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded",
                        topic.trend === 'up' ? "bg-green-500/10 text-green-500" :
                        topic.trend === 'down' ? "bg-red-500/10 text-red-500" :
                        "bg-white/10 text-muted-foreground"
                      )}>
                        {topic.trend.toUpperCase()}
                      </div>
                   </div>
                 ))}
              </div>
           </Card>

           <Card variant="glass" className="p-6">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                 <Award size={20} className="text-yellow-500" />
                 Community Leaders
              </h3>
              <div className="space-y-4">
                 {[
                   { name: 'EcoElena', xp: '12,450', level: 45, color: 'from-yellow-500' },
                   { name: 'GreenMark', xp: '10,820', level: 42, color: 'from-gray-400' },
                   { name: 'SustainabilitySam', xp: '9,540', level: 38, color: 'from-amber-600' }
                 ].map((leader, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-tr to-transparent flex items-center justify-center font-black text-black text-xs", leader.color)}>
                         {i + 1}
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold">{leader.name}</p>
                         <p className="text-[10px] text-muted-foreground">LVL {leader.level} • {leader.xp} XP</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Button variant="outline" className="w-full mt-6 text-[10px] font-black uppercase tracking-widest border-white/10">View Leaderboard</Button>
           </Card>

           <Card variant="glass" className="p-6 border-dashed border-primary/30 text-center">
              <Globe className="h-10 w-10 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-md font-black mb-2">Global Impact</h3>
              <p className="text-xs text-muted-foreground mb-6">Our community has collectively offset <span className="text-white font-bold">142 tons</span> of CO2 this month.</p>
              <div className="flex justify-center -space-x-2">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-[#09090b] bg-white/10 flex items-center justify-center text-[10px] font-black overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                   </div>
                 ))}
                 <div className="h-8 w-8 rounded-full border-2 border-[#09090b] bg-primary text-black flex items-center justify-center text-[8px] font-black">
                    +12k
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
