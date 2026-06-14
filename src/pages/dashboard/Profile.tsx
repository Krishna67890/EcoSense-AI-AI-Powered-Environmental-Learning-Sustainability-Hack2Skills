import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Camera, Shield, Bell, Leaf,
  Award, Target, Settings as SettingsIcon, LogOut,
  CheckCircle2, Circle, Microscope, BookOpen,
  Github, Linkedin, Zap, Lock, Eye, EyeOff, Save, Loader2, Sparkles
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseAuth, getFirebaseStorage, getFirestore } from '../../lib/firebase';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updatePassword, updateProfile, signOut } from 'firebase/auth';
import { MODULES, LABS } from '../../lib/data';
import { BADGES } from '../../lib/badges';

const Profile = () => {
  const { userProfile, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'labs' | 'modules' | 'badges' | 'security'>('overview');
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    phoneNumber: userProfile?.phoneNumber || '',
    email: userProfile?.email || '',
    dietType: userProfile?.dietType || 'Veg',
    primaryTransport: userProfile?.primaryTransport || 'Public Transit',
    housingType: userProfile?.housingType || 'Apartment',
    currentPassword: '',
    newPassword: '',
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [localPhotoURL, setLocalPhotoURL] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.fullName || userProfile.displayName || '',
        phoneNumber: userProfile.phoneNumber || '',
        email: userProfile.email || '',
        dietType: userProfile.dietType || 'Veg',
        primaryTransport: userProfile.primaryTransport || 'Public Transit',
        housingType: userProfile.housingType || 'Apartment',
        currentPassword: '',
        newPassword: '',
      });
      setLocalPhotoURL(userProfile.profileImage || userProfile.photoURL || null);
      setImageError(false);
    } else {
      setFormData({
        displayName: '',
        phoneNumber: '',
        email: '',
        dietType: 'Veg',
        primaryTransport: 'Public Transit',
        housingType: 'Apartment',
        currentPassword: '',
        newPassword: '',
      });
      setLocalPhotoURL(null);
    }
  }, [userProfile]);

  const getRankName = (level: number) => {
    if (level > 30) return 'Eco Champion';
    if (level > 20) return 'Eco Titan';
    if (level > 10) return 'Eco Guardian';
    return 'Eco Specialist';
  };

  const currentLevel = userProfile?.level || Math.floor((userProfile?.experience || 0) / 1000) + 1;
  const nextLevelXP = Math.ceil((userProfile?.experience || 0) / 1000) * 1000 || 1000;
  const progressToNextLevel = ((userProfile?.experience || 0) % 1000) / 10;

  const activeLabsCount = Object.keys(userProfile?.labProgress || {}).length || 0;

  const stats = [
    { label: 'Completed Tasks', value: userProfile?.totalTasksCompleted || 0, icon: <CheckCircle2 className="text-primary" /> },
    {
      label: 'Active Labs',
      value: activeLabsCount,
      icon: <Microscope className="text-blue-400" />,
      cta: activeLabsCount === 0 ? { label: '+ Start Lab', path: '/dashboard/learning' } : null
    },
    { label: 'Modules Mastery', value: `${Object.keys(userProfile?.moduleProgress || {}).length || 0}/55`, icon: <BookOpen className="text-purple-400" /> },
    { label: 'Current Level', value: currentLevel, icon: <Award className="text-yellow-400" /> },
  ];

  const handleUpdatePassword = async () => {
    const auth = getFirebaseAuth();
    if (!auth || !auth.currentUser || !formData.newPassword) return;
    setIsUpdatingPassword(true);
    try {
      await updatePassword(auth.currentUser, formData.newPassword);
      setNotification("Password updated successfully!");
      setFormData({ ...formData, currentPassword: '', newPassword: '' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      console.error("Password update error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to Blob failed'));
            },
            'image/jpeg',
            0.7
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setUploadProgress(0);
      const compressedBlob = await compressImage(file);

      // Optimistic UI update
      const objectUrl = URL.createObjectURL(compressedBlob);
      setLocalPhotoURL(objectUrl);

      const storage = getFirebaseStorage();
      const db = getFirestore();
      if (!storage || !db) return;

      const storageRef = ref(storage, `profiles/${currentUser.uid}/profile_pic.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, compressedBlob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          alert("Failed to upload image. Please try again.");
          setUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setLocalPhotoURL(downloadURL); // Optimistic UI update

          // Update Firestore
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, {
            photoURL: downloadURL,
            profileImage: downloadURL
          });

          // Update Firebase Auth Profile for consistency
          await updateProfile(currentUser, {
            photoURL: downloadURL
          });

          setUploadProgress(null);
          setNotification("Profile picture updated successfully!");
          setTimeout(() => setNotification(null), 3000);
        }
      );
    } catch (error) {
      console.error("Compression/Upload error:", error);
      alert("Failed to process image. Please try again.");
      setUploadProgress(null);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    const db = getFirestore();
    if (!db) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        fullName: formData.displayName || '',
        displayName: formData.displayName || '',
        phoneNumber: formData.phoneNumber || '',
        dietType: formData.dietType,
        primaryTransport: formData.primaryTransport,
        housingType: formData.housingType
      });

      // Update Firebase Auth Profile for consistency
      await updateProfile(currentUser, {
        displayName: formData.displayName
      });

      setIsEditing(false);
      setNotification("Sustainability Persona updated!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleCompleteLab = async (labId: string) => {
    if (!currentUser || !userProfile) return;
    const db = getFirestore();
    if (!db) return;
    const currentProgress = userProfile.labProgress?.[labId] || 0;
    if (currentProgress >= 100) return;

    const newProgress = Math.min(currentProgress + 34, 100);
    // Aligning XP with KnowledgeHub: ~1000 XP total for a lab
    const xpGain = currentProgress === 0 ? 300 : (newProgress === 100 ? 400 : 150);
    const progressGain = newProgress === 100 ? 10 : 2;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const newXP = (userProfile.experience || 0) + xpGain;
      const newLevel = Math.floor(newXP / 1000) + 1;

      await updateDoc(userRef, {
        [`labProgress.${labId}`]: newProgress,
        experience: newXP,
        level: newLevel,
        totalTasksCompleted: newProgress === 100 ? (userProfile.totalTasksCompleted || 0) + 1 : (userProfile.totalTasksCompleted || 0),
        ecoProgress: Math.min(100, (userProfile.ecoProgress || 0) + progressGain),
        sustainabilityScore: Math.min(100, (userProfile.sustainabilityScore || 0) + progressGain) // Maintain legacy
      });
    } catch (error) {
      console.error("Error updating lab:", error);
    }
  };

  const handleCompleteModule = async (moduleId: string) => {
    if (!currentUser || !userProfile) return;
    const db = getFirestore();
    if (!db) return;
    const isCompleted = (userProfile.moduleProgress?.[moduleId] || 0) >= 100;
    if (isCompleted) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const newXP = (userProfile.experience || 0) + 500; // Match KnowledgeHub
      const newProgress = (userProfile.ecoProgress || 0) + 5;
      const newLevel = Math.floor(newXP / 1000) + 1;

      await updateDoc(userRef, {
        [`moduleProgress.${moduleId}`]: 100,
        experience: newXP,
        level: newLevel,
        totalTasksCompleted: (userProfile.totalTasksCompleted || 0) + 1,
        ecoProgress: Math.min(100, newProgress),
        sustainabilityScore: Math.min(100, newProgress) // Maintain legacy
      });
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eco-Intelligence Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            Challenge 3] Carbon Footprint Awareness Platform: Tracking impact through advanced insights.
          </p>
        </div>
        <div className="flex gap-2">
           <a href="https://github.com/Krishna67890" target="_blank" rel="noreferrer">
             <Button variant="outline" size="icon" className="rounded-xl"><Github size={18} /></Button>
           </a>
           <a href="https://www.linkedin.com/in/krishna-patil-rajput-b66b03340" target="_blank" rel="noreferrer">
             <Button variant="outline" size="icon" className="rounded-xl"><Linkedin size={18} /></Button>
           </a>
        </div>
      </header>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} variant="glass" className="p-4 flex flex-col items-center text-center">
            <div className="p-2 rounded-lg bg-white/5 mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation & Core Profile */}
        <div className="space-y-6">
          <Card variant="glass" className="text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary" />

            <div className="relative inline-block mt-6">
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-blue-500 mx-auto flex items-center justify-center text-4xl font-bold text-black shadow-2xl overflow-hidden border-4 border-white/10 relative">
                {uploadProgress !== null && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 p-4">
                    <Zap className="animate-pulse text-primary mb-2" size={24} />
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-white mt-1 font-bold">{Math.round(uploadProgress)}%</span>
                  </div>
                )}
                {localPhotoURL && !imageError ? (
                  <img
                    key={localPhotoURL}
                    src={localPhotoURL}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={() => {
                      console.warn("Profile image failed to load, falling back.");
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-blue-500/20 w-full h-full">
                    <span className="text-4xl font-black">{userProfile?.fullName?.[0]?.toUpperCase() || userProfile?.email?.[0]?.toUpperCase() || 'W'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">Warrior</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleCameraClick}
                disabled={uploadProgress !== null}
                className="absolute -bottom-2 -right-2 p-3 bg-primary rounded-xl text-black border-4 border-[#09090b] hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <h2 className="text-2xl font-bold mt-6">{userProfile?.fullName || 'Eco Warrior'}</h2>
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                LEVEL {currentLevel} · {getRankName(currentLevel)}
              </span>
              <div className="w-48 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{nextLevelXP - (userProfile?.experience || 0)} XP to Level {currentLevel + 1}</p>
            </div>

            <nav className="mt-8 flex flex-col gap-1 text-left">
              {[
                { id: 'overview', label: 'Overview', icon: <User size={16} /> },
                { id: 'labs', label: '50 Eco Labs', icon: <Microscope size={16} /> },
                { id: 'modules', label: 'Knowledge Modules', icon: <BookOpen size={16} /> },
                { id: 'badges', label: '50 Badges', icon: <Award size={16} /> },
                { id: 'security', label: 'Advanced Security', icon: <Shield size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    activeTab === item.id ? 'bg-primary text-black font-bold' : 'hover:bg-white/5 text-muted-foreground'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </Card>

          <Button variant="outline" className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10" onClick={async () => {
            try {
              const db = getFirestore();
              const auth = getFirebaseAuth();
              if (currentUser && db) {
                await updateDoc(doc(db, 'users', currentUser.uid), { isOnline: false });
              }
              if (auth) {
                await signOut(auth);
                window.location.href = '/'; // Force redirect to landing
              }
            } catch (error) {
              console.error("Sign out error:", error);
              // Fallback if firestore update fails
              const auth = getFirebaseAuth();
              if (auth) await signOut(auth);
              window.location.href = '/';
            }
          }}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out Securely
          </Button>
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <Card variant="glass">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Identity & Sustainability Stats</h3>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setIsEditing(false);
                          setFormData(prev => ({
                            ...prev,
                            displayName: userProfile?.fullName || userProfile?.displayName || '',
                            phoneNumber: userProfile?.phoneNumber || ''
                          }));
                        }}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSaveProfile} className="gap-2">
                          <Save size={14} /> Save
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Identity</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-sm font-bold text-white">{userProfile?.fullName || 'Warrior'}</p>
                      <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">{userProfile?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Update Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Sustainability Persona Dropdowns */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Diet Type</label>
                    <select
                      disabled={!isEditing}
                      value={formData.dietType}
                      onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 appearance-none"
                    >
                      <option value="Veg">Vegetarian</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Primary Transport</label>
                    <select
                      disabled={!isEditing}
                      value={formData.primaryTransport}
                      onChange={(e) => setFormData({ ...formData, primaryTransport: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 appearance-none"
                    >
                      <option value="Car">Car</option>
                      <option value="Public Transit">Public Transit</option>
                      <option value="Bike">Bike / Walk</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Housing Type</label>
                    <select
                      disabled={!isEditing}
                      value={formData.housingType}
                      onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 appearance-none"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Eco Progress</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-primary">
                      {userProfile?.ecoProgress || 0} Points
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Join Date</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-muted-foreground">
                      {userProfile?.joinedAt || '2026-01-01'}
                    </div>
                  </div>
                </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Recent Activity
                    </h4>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
                       Last login tracked on: {userProfile?.lastLogin || userProfile?.lastSeen || 'Today'}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Achievements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {userProfile?.badges?.map((badge, i) => (
                         <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase">
                           {badge}
                         </span>
                       ))}
                       {(!userProfile?.badges || userProfile.badges.length === 0) && <p className="text-xs italic text-muted-foreground">No badges earned yet.</p>}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'labs' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xl font-bold">Eco Labs Experimentation</h3>
                  <p className="text-xs text-primary font-bold">50 LABS TOTAL</p>
                </div>
                <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {LABS.map((lab, i) => {
                    const progress = userProfile?.labProgress?.[lab.id] || 0;
                    return (
                      <Card
                        key={lab.id}
                        variant="glass"
                        className={`p-4 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer ${progress === 100 ? 'bg-primary/5 border-primary/20' : ''}`}
                        onClick={() => handleCompleteLab(lab.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold border transition-colors ${progress === 100 ? 'bg-primary text-black border-primary' : progress > 0 ? 'bg-primary/20 text-primary border-primary/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {progress === 100 ? <CheckCircle2 size={18} /> : i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{lab.title}</p>
                            <p className="text-xs text-muted-foreground">{lab.objective}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex gap-1">
                            {Array.from({ length: 3 }).map((_, step) => (
                              <div key={step} className={`h-1.5 w-6 rounded-full transition-colors ${progress > (step * 33) ? 'bg-primary' : 'bg-white/10'}`} />
                            ))}
                          </div>
                          <p className={`text-[10px] font-bold uppercase ${progress === 100 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {progress > 0 ? `${Math.round(progress)}% Complete` : 'Start Lab'}
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'modules' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAllModules ? MODULES : MODULES.slice(0, 10)).map((mod, i) => {
                  const isCompleted = (userProfile?.moduleProgress?.[mod.id] || 0) >= 100;
                  return (
                    <Card
                      key={mod.id}
                      variant="glass"
                      onClick={() => handleCompleteModule(mod.id)}
                      className={`p-5 relative group cursor-pointer overflow-hidden transition-all hover:scale-[1.02] ${isCompleted ? 'border-primary/30 bg-primary/5' : ''}`}
                    >
                      <div className={`absolute -right-4 -top-4 text-white/5 transition-colors ${isCompleted ? 'text-primary/10' : 'group-hover:text-primary/10'}`}>
                        <BookOpen size={80} />
                      </div>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">{mod.duration}</p>
                      <h4 className="font-bold text-lg leading-tight mb-2 pr-10">{mod.title}</h4>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((u) => (
                            <div key={u} className="h-6 w-6 rounded-full border-2 border-[#09090b] bg-white/10 flex items-center justify-center text-[8px] font-bold">
                              {u}
                            </div>
                          ))}
                          <div className="pl-4 text-[10px] text-muted-foreground">+240 learners</div>
                        </div>
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isCompleted ? 'bg-primary text-black' : 'bg-white/5 group-hover:bg-primary group-hover:text-black'}`}
                        >
                          {isCompleted ? <CheckCircle2 size={14} /> : <Zap size={14} />}
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {!showAllModules && (
                  <div className="md:col-span-2 text-center py-6">
                    <Button
                      variant="outline"
                      className="text-xs opacity-50 hover:opacity-100"
                      onClick={() => setShowAllModules(true)}
                    >
                      View all 55 modules
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xl font-bold">Sustainability Achievement Badges</h3>
                  <p className="text-xs text-primary font-bold">{userProfile?.badges?.length || 0} / 50 UNLOCKED</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {BADGES.map((badge, i) => {
                    const isUnlocked = userProfile?.badges?.includes(badge.title) || userProfile?.badges?.includes(`Badge #${i+1}`);
                    return (
                      <Card
                        key={badge.id}
                        variant="glass"
                        className={`p-4 text-center transition-all ${
                          isUnlocked
                            ? 'border-primary/60 bg-primary/10 scale-105 shadow-[0_0_20px_rgba(34,197,94,0.2)] ring-1 ring-primary/30'
                            : 'opacity-30 grayscale hover:opacity-40'
                        }`}
                      >
                        <div className={`text-3xl mb-2 ${isUnlocked ? 'animate-pulse' : ''}`}>{badge.icon}</div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${isUnlocked ? 'text-primary' : ''}`}>{badge.title}</p>
                        <p className="text-[8px] text-muted-foreground mt-1">{badge.requirement}</p>
                        {isUnlocked && (
                          <div className="mt-2 flex justify-center">
                            <Sparkles size={12} className="text-primary" />
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <Card variant="glass" className="border-t-4 border-t-primary">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Shield className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Advanced Shield</h3>
                      <p className="text-sm text-muted-foreground">Multi-layer encryption & account protection.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div>
                        <p className="font-bold">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-muted-foreground">Extra layer of security via mobile app or SMS.</p>
                      </div>
                      <Button
                        variant={userProfile?.twoFactorEnabled ? "outline" : "primary"}
                        size="sm"
                        onClick={async () => {
                          if (!currentUser) return;
                          const db = getFirestore();
                          if (!db) return;
                          const newState = !userProfile?.twoFactorEnabled;
                          try {
                            await updateDoc(doc(db, 'users', currentUser.uid), {
                              twoFactorEnabled: newState
                            });
                            alert(`2FA ${newState ? 'Enabled' : 'Disabled'} successfully!`);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      >
                        {userProfile?.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center mb-4">
                        <p className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Security Protocol</p>
                        <button onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div className="grid gap-3">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="New Security Key (Password)"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                        <Button
                          className="w-full"
                          onClick={handleUpdatePassword}
                          disabled={isUpdatingPassword || !formData.newPassword}
                        >
                          {isUpdatingPassword ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Securely"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                      <Lock className="text-yellow-500 h-5 w-5" />
                      <div>
                        <p className="text-sm font-bold text-yellow-500">Last Login: June 10, 2024</p>
                        <p className="text-[10px] text-yellow-500/70">From Windows 11 • Mumbai, India (IP: 103.45.XX.XX)</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Advanced Notification Toast */}
      <footer className="mt-12 text-center py-6 border-t border-white/5">
         <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
            © 2026 EcoSense AI • Autonomous Sustainability Intelligence
         </p>
      </footer>

      <AnimatePresence>
         {notification && (
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-primary text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3"
            >
               <CheckCircle2 size={16} />
               {notification}
            </motion.div>
         )}

         {(userProfile?.notifications && userProfile.notifications.length > 0) && (
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2"
            >
               {userProfile?.notifications?.slice(-1).map((n: any) => (
                  <div key={n.id} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <Award size={16} />
                    {n.message}
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[8px] bg-white/20" onClick={async () => {
                       const db = getFirestore();
                       if (db && currentUser) {
                         await updateDoc(doc(db, 'users', currentUser.uid), {
                           notifications: arrayRemove(n)
                         });
                       }
                    }}>CLAIM</Button>
                  </div>
               ))}
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
