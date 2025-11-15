import React, { createContext, useContext, useEffect, useState } from 'react';
// FIREBASE COMMENTED OUT FOR TESTING
// import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: any | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setMockUser: (user: User | null) => void; // For testing without Firebase
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock user for testing - set to null to show auth screen, or set a user object to skip auth
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Set to false to skip loading

  // Mock user data for testing - uncomment to auto-login
  // const mockUser: User = {
  //   id: 'test-user-1',
  //   phoneNumber: '+1234567890',
  //   name: 'Test User',
  //   school: 'UW-Madison',
  //   profileImageUrl: '',
  //   createdAt: new Date(),
  //   contactsImported: false,
  // };

  const fetchUserData = async (uid: string) => {
    // FIREBASE COMMENTED OUT
    // try {
    //   const userDoc = await getDoc(doc(db, 'users', uid));
    //   if (userDoc.exists()) {
    //     const userData = userDoc.data();
    //     setUser({
    //       id: userDoc.id,
    //       ...userData,
    //       createdAt: userData.createdAt?.toDate() || new Date(),
    //     } as User);
    //   } else {
    //     setUser(null);
    //   }
    // } catch (error) {
    //   console.error('Error fetching user data:', error);
    //   setUser(null);
    // }
    console.log('Mock: fetchUserData called for', uid);
  };

  const refreshUser = async () => {
    // FIREBASE COMMENTED OUT
    // if (firebaseUser) {
    //   await fetchUserData(firebaseUser.uid);
    // }
    console.log('Mock: refreshUser called');
  };

  const setMockUser = (newUser: User | null) => {
    setUser(newUser);
    setFirebaseUser(newUser ? { uid: newUser.id } : null);
  };

  useEffect(() => {
    // FIREBASE COMMENTED OUT
    // const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //   setFirebaseUser(user);
    //   if (user) {
    //     await fetchUserData(user.uid);
    //   } else {
    //     setUser(null);
    //   }
    //   setLoading(false);
    // });
    // return unsubscribe;
    
    // Mock: Set loading to false immediately
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, refreshUser, setMockUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

