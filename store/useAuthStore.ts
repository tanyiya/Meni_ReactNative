import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig"; 
import { setDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";
import { getDocs, collection, query, where, updateDoc } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  connectionCode: string;
}

export interface Partner {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  partner: Partner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Auth actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  connectPartner: (partnerCodeInput: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      partner: null,
      isAuthenticated: false,
      isLoading: false,
      
      initializeAuth: async () => {
        // This would normally check a token's validity with your API
        // For now, we'll just simulate a loading state
        setTimeout(() => {
          set({ isLoading: false });
        }, 1000);
      },
      
      login: async (email: string, password: string) => {
        // Simulate API call
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            // For demo purposes, accept any credentials
            // In a real app, this would validate with your backend
            if (email && password) {
              set({
                user: {
                  id: 'user-123',
                  name: 'User',
                  email: email,
                  connectionCode: 'DEFAULT-CODE', // Add a default or generated connection code
                },
                isAuthenticated: true,
              });
              resolve();
            } else {
              reject(new Error('Invalid credentials'));
            }
          }, 1500);
        });
      },
      
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
      
        try {
          const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
          const user = userCredential.user;
      
          await updateProfile(user, { displayName: name });
      
          // Generate unique partner code
          const partnerCode = "TOGETHER-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      
          // Save user to Firestore with the partner code
          await setDoc(doc(FIREBASE_DB, "users", user.uid), {
            uid: user.uid,
            name,
            email,
            partnerCode,
            partnerId: null, // initially no partner connected
          });
      
          set({
            user: {
              id: user.uid,
              name,
              email,
              connectionCode: partnerCode, // Add the connectionCode property
            },
            isAuthenticated: true,
          });
        } catch (error: any) {
          throw new Error(error.message || "Registration failed");
        } finally {
          set({ isLoading: false });
        }
      },
      
      
      logout: async () => {
        // Clear auth state
        set({
          user: null,
          partner: null,
          isAuthenticated: false,
        });
      },
      
      connectPartner: async (partnerCodeInput: string) => {
        const { user } = get();
        if (!user) return;
      
        // Search for the partner's user doc with this code
        const q = query(
          collection(FIREBASE_DB, "users"),
          where("partnerCode", "==", partnerCodeInput)
        );
        const querySnapshot = await getDocs(q);
      
        if (querySnapshot.empty) {
          throw new Error("Invalid partner code");
        }
      
        const partnerDoc = querySnapshot.docs[0];
        const partnerData = partnerDoc.data();
      
        // Update both users in Firestore to link them
        await Promise.all([
          updateDoc(doc(FIREBASE_DB, "users", user.id), {
            partnerId: partnerData.uid,
          }),
          updateDoc(doc(FIREBASE_DB, "users", partnerData.uid), {
            partnerId: user.id,
          }),
        ]);
      
        set({
          partner: {
            id: partnerData.uid,
            name: partnerData.name,
          },
        });
      }
      
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;