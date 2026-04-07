import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 2000);
    const timer3 = setTimeout(() => {
        onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
        {/* Floating sakura petals */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl pointer-events-none select-none"
            initial={{ 
              x: `${10 + i * 12}vw`, 
              y: '-5vh', 
              opacity: 0, 
              rotate: 0 
            }}
            animate={{ 
              y: '110vh', 
              opacity: [0, 0.8, 0.8, 0], 
              rotate: 360 * (i % 2 === 0 ? 1 : -1) 
            }}
            transition={{ 
              duration: 2.5 + i * 0.2, 
              delay: i * 0.15, 
              ease: 'linear' 
            }}
          >
            🌸
          </motion.div>
        ))}

        <div className="relative w-full max-w-lg px-6 flex flex-col items-center justify-center">
            
            {/* Animated Logo Image */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mb-6"
            >
                <img 
                    src="/logo.jpg" 
                    alt="SakuraFlix" 
                    className="w-28 h-28 rounded-full object-cover mx-auto"
                    style={{ boxShadow: '0 0 40px #ff4da6, 0 0 80px rgba(255,77,166,0.3)' }}
                />
            </motion.div>

            {/* Animated Logo Title */}
            <div className="relative overflow-hidden mb-2">
                <motion.h1 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-black text-white font-display italic tracking-tighter text-center leading-none"
                >
                    SAKURA
                </motion.h1>
                <motion.div 
                    initial={{ top: 0, bottom: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                    className="absolute left-0 right-0 bg-[#050505] z-10"
                />
            </div>

            <div className="relative overflow-hidden mb-8">
                <motion.h1 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-black font-display italic tracking-tighter text-center leading-none"
                    style={{ color: '#ff4da6' }}
                >
                    FLIX
                </motion.h1>
                <motion.div 
                    initial={{ top: 0, bottom: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 0.6, delay: 0.35, ease: "easeInOut" }}
                    className="absolute left-0 right-0 bg-[#050505] z-10"
                />
            </div>

            {/* Subtext */}
            <motion.div
                initial={{ opacity: 0, letterSpacing: "0px" }}
                animate={{ opacity: 1, letterSpacing: "4px" }}
                transition={{ delay: 0.8, duration: 1 }}
                className="font-bold uppercase text-xs md:text-sm"
                style={{ color: '#ff4da6' }}
            >
                🌸 Premium Anime Experience
            </motion.div>

            {/* Loading Bar */}
            <div className="absolute bottom-[-100px] w-64 h-1 bg-zinc-900 overflow-hidden rounded-full">
                <motion.div 
                    className="h-full rounded-full"
                    style={{ background: '#ff4da6', boxShadow: '0 0 15px #ff4da6' }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none z-[-1]">
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[120px] rounded-full opacity-40 animate-pulse"
                  style={{ background: '#ff4da6' }}
                />
            </div>

        </div>
    </motion.div>
  );
};