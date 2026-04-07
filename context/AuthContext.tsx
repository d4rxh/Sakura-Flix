import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, DEMO_USER_ID, googleProvider } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginDemo: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, file: File | null) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  loginDemo: () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  loginWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check if we were in demo mode (simple persistence)
    const storedDemo = localStorage.getItem('is_demo_session');
    if (storedDemo === 'true') {
        setIsDemo(true);
        // Create a mock user object compatible with Firebase User type
        const mockUser = {
            uid: DEMO_USER_ID,
            email: 'guest@system.override',
            displayName: 'System Guest (Premium)',
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: null,
            delete: async () => {},
            getIdToken: async () => 'mock-token',
            getIdTokenResult: async () => ({
                token: 'mock',
                signInProvider: 'custom',
                claims: {},
                authTime: Date.now().toString(),
                issuedAtTime: Date.now().toString(),
                expirationTime: (Date.now() + 3600).toString(),
            }),
            reload: async () => {},
            toJSON: () => ({}),
            phoneNumber: null,
            photoURL: null
        } as unknown as User;
        setUser(mockUser);
        setLoading(false);
    } else {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!isDemo) {
              setUser(currentUser);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }
  }, [isDemo]);

  const loginDemo = () => {
    setLoading(true);
    localStorage.setItem('is_demo_session', 'true');
    // Trigger the effect reload
    window.location.reload(); 
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const registerWithEmail = async (email: string, pass: string, name: string, file: File | null) => {
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;

      let photoURL = null;

      // 2. Upload Photo to Cloudinary if exists
      if (file) {
          try {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('upload_preset', 'My smallest server'); // Unsigned preset
              formData.append('cloud_name', 'dj5hhott5');
              
              const res = await fetch('https://api.cloudinary.com/v1_1/dj5hhott5/image/upload', {
                  method: 'POST',
                  body: formData
              });
              
              if (res.ok) {
                  const data = await res.json();
                  photoURL = data.secure_url;
              } else {
                  console.error("Cloudinary upload failed", await res.text());
              }
          } catch (e) {
              console.error("Profile photo upload error", e);
          }
      }

      // 3. Update Profile with Display Name and Photo URL
      await updateProfile(newUser, {
          displayName: name,
          photoURL: photoURL
      });
      
      // Force reload to get updated profile in auth state
      await newUser.reload();
      setUser(auth.currentUser);
  };

  const logout = async () => {
    if (isDemo) {
        localStorage.removeItem('is_demo_session');
        setIsDemo(false);
        setUser(null);
        window.location.reload();
    } else {
        await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginDemo, loginWithEmail, registerWithEmail, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};