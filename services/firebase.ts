import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { HistoryItem, AnimeDetail, Episode } from "../types";

// Updated Configuration for 'roganime-13469'
const firebaseConfig = {
  apiKey: "AIzaSyDMJqlOCQJ2-n24DiDcBHn8CoES4aY4NTg",
  authDomain: "roganime-13469.firebaseapp.com",
  projectId: "roganime-13469",
  storageBucket: "roganime-13469.firebasestorage.app",
  messagingSenderId: "88007201894",
  appId: "1:88007201894:web:8ebb35ee96412faa13c9a7",
  measurementId: "G-RPCFNSMFFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export storage for profile uploads
export const googleProvider = new GoogleAuthProvider();

export const DEMO_USER_ID = 'demo-otaku-id';

// Helper to check if we should use mock storage (For Demo User)
const isMock = (userId: string) => userId === DEMO_USER_ID;

// Mock Storage Helpers
const getMockData = <T>(key: string, defaultVal: T): T => {
    const data = localStorage.getItem(`mock_cloud_${key}`);
    return data ? JSON.parse(data) : defaultVal;
};

const setMockData = (key: string, data: any) => {
    localStorage.setItem(`mock_cloud_${key}`, JSON.stringify(data));
};

// Database Helpers

export const getUserHistory = async (userId: string): Promise<HistoryItem[]> => {
  // Demo Fallback
  if (isMock(userId)) {
      return getMockData<HistoryItem[]>('history', []);
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().watchHistory || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching history:", error);
    throw new Error("Could not connect to the user database. Your progress and history won't be loaded.");
  }
};

export const getUserProgress = async (userId: string): Promise<Record<string, UserProgress>> => {
  // Demo Fallback
  if (isMock(userId)) {
      return getMockData<Record<string, UserProgress>>('progress', {});
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().progress || {};
    }
    return {};
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw new Error("Could not connect to the user database. Your progress and history won't be loaded.");
  }
};

export const saveUserHistory = async (userId: string, newItem: HistoryItem) => {
  // Demo Fallback
  if (isMock(userId)) {
      let currentHistory = getMockData<HistoryItem[]>('history', []);
      currentHistory = currentHistory.filter(h => h.animeId !== newItem.animeId);
      currentHistory.unshift(newItem);
      if (currentHistory.length > 50) currentHistory.pop();
      setMockData('history', currentHistory);
      return;
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    let currentHistory: HistoryItem[] = [];
    if (docSnap.exists()) {
      currentHistory = docSnap.data().watchHistory || [];
    }

    // Remove existing entry for this anime to push to top
    currentHistory = currentHistory.filter(h => h.animeId !== newItem.animeId);
    
    // Add new entry to start
    currentHistory.unshift(newItem);
    
    // Keep limit (e.g., 50 items for cloud storage)
    if (currentHistory.length > 50) currentHistory.pop();

    await setDoc(docRef, { watchHistory: currentHistory }, { merge: true });
  } catch (error) {
    console.error("Error saving history:", error);
    throw new Error("Could not save history. The database is currently offline.");
  }
};

export const removeUserHistoryItem = async (userId: string, animeId: string) => {
  // Demo Fallback
  if (isMock(userId)) {
      let currentHistory = getMockData<HistoryItem[]>('history', []);
      const updatedHistory = currentHistory.filter(h => h.animeId !== animeId);
      setMockData('history', updatedHistory);
      return updatedHistory;
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentHistory = docSnap.data().watchHistory || [];
      const updatedHistory = currentHistory.filter((h: any) => h.animeId !== animeId);
      
      await updateDoc(docRef, { watchHistory: updatedHistory });
      return updatedHistory;
    }
    return [];
  } catch (error) {
    console.error("Error removing history item:", error);
    throw new Error("Could not remove history item. The database is currently offline.");
  }
};

// NEW: Remove item from progress list (Watching/Saved/Completed)
export const removeUserProgress = async (userId: string, animeId: string) => {
  // Demo Fallback
  if (isMock(userId)) {
      const currentProgress = getMockData<Record<string, UserProgress>>('progress', {});
      if (currentProgress[animeId]) {
          delete currentProgress[animeId];
          setMockData('progress', currentProgress);
      }
      return;
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingProgress = docSnap.data().progress || {};
      if (existingProgress[animeId]) {
          delete existingProgress[animeId];
          await updateDoc(docRef, { progress: existingProgress });
      }
    }
  } catch (error) {
    console.error("Error removing progress:", error);
    throw new Error("Could not remove anime from list.");
  }
};

export interface UserProgress {
  animeId: string;
  title: string;
  poster: string;
  currentEpisode: number;
  totalEpisodes: number;
  status: 'Watching' | 'Completed' | 'On Hold';
  lastUpdated: number;
  nextEpisodeId?: string;
}

export const addToWatchlist = async (userId: string, animeData: AnimeDetail) => {
  const progressData: UserProgress = {
      animeId: animeData.id,
      title: animeData.title,
      poster: animeData.poster || animeData.image,
      currentEpisode: 0,
      totalEpisodes: animeData.totalEpisodes || animeData.episodes?.length || 0,
      status: 'On Hold', // Default status for "Add to List"
      lastUpdated: Date.now(),
      nextEpisodeId: animeData.episodes?.[0]?.id
  };

  // Demo Fallback
  if (isMock(userId)) {
      const currentProgress = getMockData<Record<string, UserProgress>>('progress', {});
      if (!currentProgress[animeData.id]) {
          currentProgress[animeData.id] = progressData;
          setMockData('progress', currentProgress);
      }
      return;
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const existingProgress = docSnap.exists() ? docSnap.data().progress || {} : {};
    
    // Don't overwrite if progress exists
    if (existingProgress[animeData.id]) {
        return; 
    }

    const updatedProgress = {
        ...existingProgress,
        [animeData.id]: progressData
    };

    await setDoc(docRef, { progress: updatedProgress }, { merge: true });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw new Error("Could not save to watchlist.");
  }
};

export const saveAnimeProgress = async (
  userId: string, 
  animeData: AnimeDetail, 
  currentEp: Episode
) => {
  const currentEpIndex = animeData.episodes.findIndex(e => e.id === currentEp.id);
  const nextEp = animeData.episodes[currentEpIndex + 1];
  
  const progressData: UserProgress = {
      animeId: animeData.id,
      title: animeData.title,
      poster: animeData.poster || animeData.image,
      currentEpisode: currentEp.number,
      totalEpisodes: animeData.totalEpisodes || animeData.episodes.length || 0,
      status: 'Watching',
      lastUpdated: Date.now(),
      nextEpisodeId: nextEp ? nextEp.id : undefined
  };

  if (progressData.totalEpisodes > 0 && progressData.currentEpisode >= progressData.totalEpisodes) {
      progressData.status = 'Completed';
  }

  // Demo Fallback
  if (isMock(userId)) {
      const currentProgress = getMockData<Record<string, UserProgress>>('progress', {});
      currentProgress[animeData.id] = progressData;
      setMockData('progress', currentProgress);
      return;
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const existingProgress = docSnap.exists() ? docSnap.data().progress || {} : {};
    
    const updatedProgress = {
        ...existingProgress,
        [animeData.id]: progressData
    };

    await setDoc(docRef, { progress: updatedProgress }, { merge: true });
  } catch (error) {
    console.error("Error saving progress:", error);
    throw new Error("Could not save progress. The database is currently offline.");
  }
};