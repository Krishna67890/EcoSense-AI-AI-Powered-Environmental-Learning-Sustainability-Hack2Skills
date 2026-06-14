import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirebaseAuth, getFirestore } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUpDefault = searchParams.get('mode') === 'signup';
  const [isSignUp, setIsSignUp] = useState(isSignUpDefault);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getFirebaseAuth();
    const db = getFirestore();

    if (!auth || !db) {
      setError('Firebase is not initialized. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, {
          displayName: name || 'Eco Explorer'
        });

        // Create user profile in Firestore
        const perfectDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const userProfileData = {
          uid: user.uid,
          email: user.email || '',
          fullName: name.trim() || 'Eco Warrior',
          displayName: name.trim() || 'Eco Warrior',
          photoURL: user.photoURL || '',
          profileImage: user.photoURL || '',
          phoneNumber: '',
          onboardingCompleted: false,
          joinedAt: perfectDate,
          ecoProgress: 0,
          level: 1,
          experience: 0,
          totalTasksCompleted: 0,
          completedChallenges: [],
          completedTasks: [],
          badges: ['Eco Newbie'],
          createdAt: new Date().toISOString(),
          isOnline: true,
          lastLogin: perfectDate,
          loginCount: 1,
          lastSeen: new Date().toISOString(),
          rank: 0,
          habits: {
            transportation: { dailyDistance: 0, type: 'walk' },
            energy: { monthlyUsage: 0, renewableSource: false },
            diet: 'balanced',
            flights: 0,
            waste: 'average',
            water: 0,
            householdSize: 1
          },
          moduleProgress: {},
          labProgress: {}
        };

        await setDoc(doc(db, 'users', user.uid), userProfileData);
        setSuccess('Account created successfully! Welcome to EcoSense.');
        setTimeout(() => navigate('/onboarding'), 1500);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Sign in successful! Welcome back.');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err: any) {
      console.error("Auth Error:", err.code, err.message);
      let message = 'An unexpected error occurred. Please try again.';

      if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
      } else if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials or Sign Up.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/user-not-found' || err.message.includes('user-not-found')) {
        message = 'No account found with this email. Please Sign Up.';
      } else if (err.message.includes('API key not valid')) {
        message = 'Firebase API Key is invalid. Please check your .env file.';
      } else if (err.message.includes('400')) {
        message = 'Network error (400). This usually means a Firebase service is not enabled or the API key is restricted.';
      } else {
        message = err.message;
      }

      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
              <Leaf className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? 'Join the movement for a greener planet' : 'Continue your sustainability journey'}
            </p>
          </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm flex items-center gap-2">
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium ml-1">Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    const auth = getFirebaseAuth();
                    if (auth && email) sendPasswordResetEmail(auth, email);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg rounded-xl mt-4"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                {isSignUp ? 'Sign Up' : 'Sign In'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
      </main>
    </div>
  );
};

export default Auth;
