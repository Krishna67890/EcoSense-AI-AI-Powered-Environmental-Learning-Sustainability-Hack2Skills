import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth, getFirestore } from '../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirestore();

    // 1. Safety Check: If Firebase auth is not initialized, don't attempt to use it.
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | undefined;
    let presenceInterval: any;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = undefined;
      }

      if (presenceInterval) {
        clearInterval(presenceInterval);
      }

      setCurrentUser(user);

      if (user) {
        const docRef = doc(db, 'users', user.uid);

        const updatePresence = async () => {
          try {
            await setDoc(docRef, {
              uid: user.uid,
              email: user.email || '',
              isOnline: true,
              lastSeen: new Date().toISOString(),
              lastLogin: new Date().toISOString().split('T')[0],
            }, { merge: true });
          } catch (e) {
            console.warn("Presence sync failed:", e);
          }
        };

        updatePresence();
        presenceInterval = setInterval(updatePresence, 120000);

        unsubscribeProfile = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
          } else {
            const defaultName = user.displayName || user.email?.split('@')[0] || 'Eco Warrior';
            const perfectDate = new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              fullName: defaultName,
              displayName: defaultName,
              photoURL: user.photoURL || '',
              profileImage: user.photoURL || '',
              ecoProgress: 0,
              level: 1,
              experience: 0,
              totalTasksCompleted: 0,
              completedChallenges: [],
              completedTasks: [],
              badges: ['Eco Newbie'],
              joinedAt: perfectDate,
              createdAt: new Date().toISOString(),
              onboardingCompleted: false,
              isOnline: true,
              lastSeen: new Date().toISOString(),
              lastLogin: new Date().toISOString().split('T')[0],
              loginCount: 1,
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
            await setDoc(docRef, newProfile);
            setUserProfile(newProfile);
          }
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (presenceInterval) clearInterval(presenceInterval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
