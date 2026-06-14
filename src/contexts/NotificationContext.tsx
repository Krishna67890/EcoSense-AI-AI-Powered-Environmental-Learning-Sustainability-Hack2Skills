import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFirestore } from '../lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, Info, Award } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'achievement';
  timestamp: string;
  read?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, currentUser } = useAuth();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (userProfile?.notifications) {
      setLocalNotifications(userProfile.notifications);
    }
  }, [userProfile?.notifications]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const db = getFirestore();
    if (!currentUser || !db) return;

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      notifications: arrayUnion(newNotification)
    });
  };

  const markAsRead = async (id: string) => {
    const db = getFirestore();
    if (!currentUser || !db || !userProfile?.notifications) return;

    const updatedNotifications = userProfile.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      notifications: updatedNotifications
    });
  };

  const clearAll = async () => {
    const db = getFirestore();
    if (!currentUser || !db) return;
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      notifications: []
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications: localNotifications, addNotification, markAsRead, clearAll }}>
      {children}
      <NotificationToast notifications={localNotifications} markAsRead={markAsRead} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

const NotificationToast = ({ notifications, markAsRead }: { notifications: Notification[], markAsRead: (id: string) => void }) => {
  const unread = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {unread.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="pointer-events-auto bg-black/90 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex items-start space-x-3 w-80"
          >
            <div className={`p-2 rounded-xl ${
              n.type === 'success' ? 'bg-primary/20 text-primary' :
              n.type === 'achievement' ? 'bg-yellow-400/20 text-yellow-400' :
              'bg-blue-400/20 text-blue-400'
            }`}>
              {n.type === 'success' ? <CheckCircle size={18} /> :
               n.type === 'achievement' ? <Award size={18} /> :
               <Info size={18} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{n.message}</p>
              <p className="text-[10px] text-white/40 mt-1 uppercase">Just Now</p>
            </div>
            <button
              onClick={() => markAsRead(n.id)}
              className="text-white/20 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
