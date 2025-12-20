// User state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface UserStore {
  profile: UserProfile | null;
  isLoggedIn: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  clearProfile: () => void;
  login: (profile: UserProfile) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      isLoggedIn: false,

      setProfile: (profile) => {
        set({ profile, isLoggedIn: true });
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }));
      },

      clearProfile: () => {
        set({ profile: null, isLoggedIn: false });
      },

      login: (profile) => {
        set({ profile, isLoggedIn: true });
      },

      logout: () => {
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        set({ profile: null, isLoggedIn: false });
      },
    }),
    {
      name: 'bloomcart-user',
    }
  )
);
