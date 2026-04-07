import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShieldCheck, Mail, Lock, User, Upload, AlertCircle, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SakuraFlixLogo = () => (
  <img
    src="https://res.cloudinary.com/dj5hhott5/image/upload/v1767901324/qhz63r6numvtg9816crn.png"
    alt="SakuraFlix"
    className="w-16 h-16 object-contain"
    style={{ filter: 'hue-rotate(280deg) saturate(2.5) brightness(1.3)' }}
  />
);

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo, loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLoginMode) {
        await loginWithEmail(email, password);
      } else {
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        if (!name) throw new Error("Please enter your name");
        await registerWithEmail(email, password, name, profileImage);
      }
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email') {
        setError("Password or Email Incorrect");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email is already registered");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null); setIsLoading(true);
    try { await loginWithGoogle(); navigate('/'); }
    catch (err: any) { setError("Failed to sign in with Google."); }
    finally { setIsLoading(false); }
  };

  const handleGuestAccess = () => { loginDemo(); navigate('/'); };

  const inputStyle = "w-full border rounded-xl p-3.5 pl-11 text-white placeholder-zinc-500 focus:outline-none transition-all duration-200 font-sans text-sm";
  const inputBg = "bg-white/5 border-pink-900/30 focus:border-pink-400 focus:bg-pink-500/5";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-16 overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #0a0008 0%, #1a0018 40%, #0a0008 100%)' }}>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Floating petals */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="sakura-petal" style={{
          left: `${5 + i * 16}%`,
          animationDuration: `${5 + i}s`,
          animationDelay: `${i * 0.7}s`,
        }} />
      ))}

      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(160deg, rgba(26,0,24,0.9), rgba(10,0,8,0.95))',
            border: '1px solid rgba(244,114,182,0.2)',
            boxShadow: '0 25px 60px rgba(244,114,182,0.1), 0 0 0 1px rgba(244,114,182,0.05)'
          }}>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-3">
              <SakuraFlixLogo />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={isLoginMode ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h1 className="font-display font-bold text-2xl tracking-wider mb-1"
                  style={{ background: 'linear-gradient(135deg, #ffb3d4, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {isLoginMode ? 'Welcome Back' : 'Join SakuraFlix'}
                </h1>
                <p className="text-zinc-500 text-xs">
                  {isLoginMode ? '✿ Sign in to your anime sanctuary' : '✿ Begin your anime journey'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-5 flex items-center gap-2 font-semibold overflow-hidden">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence initial={false}>
              {!isLoginMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3.5">
                  <div className="flex justify-center py-2">
                    <label className="relative cursor-pointer group">
                      <div className={`w-20 h-20 rounded-full border-2 ${imagePreview ? 'border-pink-400' : 'border-dashed border-pink-900/50'} flex items-center justify-center overflow-hidden transition-all group-hover:border-pink-400`}
                        style={{ background: 'rgba(244,114,182,0.05)' }}>
                        {imagePreview ? (
                          <img src="/logo.jpg" alt="SakuraFlix" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <Upload className="w-6 h-6 text-pink-400/50 group-hover:text-pink-400" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-1 border-2 border-dark-900">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    </label>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}
                      className={`${inputStyle} ${inputBg}`} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                className={`${inputStyle} ${inputBg}`} required />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className={`${inputStyle} ${inputBg}`} required />
            </div>

            <AnimatePresence initial={false}>
              {!isLoginMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="relative pt-0">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input type="password" placeholder="Repeat Password" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${inputStyle} ${inputBg}`} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button layout type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-full font-bold uppercase tracking-wide mt-2 flex items-center justify-center gap-2 transition-all text-white text-sm disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)', boxShadow: '0 4px 20px rgba(244,114,182,0.3)' }}>
              {isLoading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : (
                <motion.div key={isLoginMode ? 'btn-login' : 'btn-signup'} initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                  <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>
          </form>

          <div className="mt-5 text-center">
            <button onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }}
              className="text-zinc-500 hover:text-pink-400 text-xs font-semibold transition-colors">
              <AnimatePresence mode="wait">
                <motion.span key={isLoginMode ? 'switch-signup' : 'switch-login'}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {isLoginMode ? "Don't have an account? Sign Up ✿" : "Already have an account? Login"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(244,114,182,0.15)' }} />
            <span className="text-zinc-600 text-xs font-bold">OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(244,114,182,0.15)' }} />
          </div>

          <div className="space-y-2.5">
            <button type="button" onClick={handleGoogleLogin} disabled={isLoading}
              className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2.5 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={handleGuestAccess}
              className="w-full font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-pink-300"
              style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.2)' }}>
              <ShieldCheck className="w-4 h-4" /> Continue as Guest
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
