import React, { useRef } from 'react';
import {
  Compass,
  Tv,
  Link as LinkIcon,
  Server,
  Search,
  Wifi,
  Database,
  Lock,
  CloudSync,
  Chrome,
  Zap,
  Shield,
  Monitor
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- Mock UI Components for Visuals (Animated) ---

const MockSearchBar = () => (
    <div className="w-full bg-black/40 border border-white/10 p-4 rounded-lg relative overflow-hidden backdrop-blur-sm group">
        <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-brand-400" />
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                    className="h-full bg-brand-400/50"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 />
            </div>
        </div>
        {/* Scanning Line */}
        <motion.div 
            className="absolute top-0 bottom-0 w-[2px] bg-brand-400/50 blur-[2px]"
            animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mt-3 space-y-2 opacity-50">
             <div className="w-3/4 h-2 bg-white/5 rounded-full" />
             <div className="w-1/2 h-2 bg-white/5 rounded-full" />
        </div>
    </div>
);

const MockServerList = () => (
    <div className="w-full bg-black/40 border border-white/10 p-4 rounded-lg space-y-2 backdrop-blur-sm">
        {[
            { name: "MegaPlay", ping: "24ms" },
            { name: "VidWish", ping: "45ms" },
            { name: "StreamSB", ping: "112ms" }
        ].map((server, i) => (
             <motion.div 
                key={server.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`flex items-center justify-between p-2 rounded border ${i === 0 ? 'border-brand-400/50 bg-brand-400/10' : 'border-white/5 bg-white/5'}`}
             >
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                    <span className="font-mono text-xs text-zinc-300">{server.name}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{server.ping}</span>
            </motion.div>
        ))}
    </div>
);

const MockPlayer = () => (
    <div className="w-full aspect-video bg-black border border-white/10 rounded-lg overflow-hidden relative flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Play Button Pulse */}
        <div className="relative z-10 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-md">
             <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-brand-400/20 rounded-full"
             />
             <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
             <motion.div 
                className="h-full bg-brand-400 shadow-[0_0_10px_#f472b6]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
             />
        </div>
    </div>
);

const MockConnection = () => (
    <div className="flex items-center justify-center gap-4 py-4">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
            <Monitor className="w-8 h-8 text-zinc-500" />
        </motion.div>
        <div className="flex-1 h-[2px] bg-white/10 relative min-w-[60px] max-w-[100px]">
             <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-400 rounded-full shadow-[0_0_10px_#f472b6]"
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             />
        </div>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}>
            <Wifi className="w-8 h-8 text-brand-400" />
        </motion.div>
    </div>
);

const TimelineStep: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  visual: React.ReactNode;
  align: 'left' | 'right';
  index: number;
}> = ({ icon: Icon, title, description, visual, align, index }) => {
  const isLeft = align === 'left';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className={`flex items-center w-full mb-24 relative ${isLeft ? 'flex-row-reverse' : ''} md:flex-row`}
    >
        {/* Desktop Layout */}
        <div className={`hidden md:flex w-full ${isLeft ? 'flex-row-reverse' : 'flex-row'} items-center gap-12`}>
            {/* Content Side */}
            <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-dark-800 border border-white/10 mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] group hover:border-brand-400/50 transition-colors`}>
                    <Icon className="w-6 h-6 text-brand-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2 font-display italic">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
            </div>

            {/* Center Node */}
            <div className="relative z-10">
                <div className="w-4 h-4 bg-black border-2 border-brand-400 rounded-full shadow-[0_0_15px_#f472b6]" />
            </div>

            {/* Visual Side */}
            <div className="flex-1">
                <div className={`transform transition-transform hover:scale-105 duration-500 ${isLeft ? '-rotate-1' : 'rotate-1'}`}>
                    {visual}
                </div>
            </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col w-full pl-8 border-l border-white/10 relative">
             <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-brand-400 rounded-full" />
             <div className="mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-brand-400" /> {title}
                </h3>
                <p className="text-zinc-400 text-sm">{description}</p>
             </div>
             <div className="w-full mb-8">
                {visual}
             </div>
        </div>
    </motion.div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string; visual: React.ReactNode }> = ({ title, description, visual }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-black/40 border border-white/5 p-8 rounded-xl backdrop-blur-sm relative overflow-hidden group hover:border-brand-400/30 transition-colors"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/5 rounded-full blur-[50px] group-hover:bg-brand-400/10 transition-colors" />
        
        <div className="relative z-10 flex flex-col items-center text-center h-full">
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                {visual}
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wide mb-3">{title}</h4>
            <p className="text-sm text-zinc-400 leading-relaxed font-mono">{description}</p>
        </div>
    </motion.div>
);

export const Documentation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-dark-950 pt-32 pb-20 px-4 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-400/5 blur-[120px] rounded-full opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full opacity-50" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-32 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-400/20 blur-[100px] rounded-full -z-10"
          />
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black text-white font-display uppercase tracking-tighter mb-6 leading-none"
          >
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-rose-600">Works</span>
          </motion.h1>
          
          <motion.p 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="text-zinc-400 max-w-xl mx-auto font-mono text-sm md:text-base border-l-2 border-brand-400 pl-4 text-left md:text-center md:border-l-0 md:pl-0"
          >
            A visual deep dive into the architecture powering your streaming experience.
            <br className="hidden md:block"/> From query to playback, see the data flow.
          </motion.p>
        </div>

        {/* Section 1: The Pipeline */}
        <div className="relative mb-32">
             {/* Center Line for Desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5 hidden md:block">
                <motion.div 
                    style={{ scaleY, transformOrigin: "top" }}
                    className="w-full h-full bg-gradient-to-b from-brand-400 via-rose-500 to-transparent shadow-[0_0_10px_#f472b6]"
                />
            </div>

            <TimelineStep
                index={0}
                icon={Compass} 
                title="Discovery"
                description="Search queries are processed instantly against our indexed database of thousands of anime titles."
                visual={<MockSearchBar />} 
                align="left"
            />
             <TimelineStep
                index={1}
                icon={LinkIcon} 
                title="Aggregation"
                description="Our engine scrapes and aggregates stream sources from multiple public providers in real-time."
                visual={<MockConnection />} 
                align="right"
            />
             <TimelineStep
                index={2}
                icon={Server} 
                title="Optimization"
                description="The best server is selected based on ping and load, ensuring buffer-free playback."
                visual={<MockServerList />} 
                align="left"
            />
             <TimelineStep
                index={3}
                icon={Tv} 
                title="Playback"
                description="Content is delivered via HLS streaming directly to the custom player interface."
                visual={<MockPlayer />} 
                align="right"
            />
        </div>
        
        {/* Section 2: Firebase Tech */}
        <div className="relative">
             <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
             >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-400/30 bg-brand-400/10 mb-4">
                    <Database className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Powered by Google Firebase</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic font-display uppercase tracking-tighter">
                    Secure & Synchronized
                </h2>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard 
                    title="Encrypted Auth"
                    description="We use Google's secure authentication. We never store passwords."
                    visual={
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    }
                />
                <FeatureCard 
                    title="Real-time Sync"
                    description="Watch on your phone, pause, and pick up on your PC instantly."
                    visual={
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center relative">
                            <CloudSync className="w-8 h-8 text-brand-400" />
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-brand-400 rounded-full"
                            />
                        </div>
                    }
                />
                <FeatureCard 
                    title="Cloud Progress"
                    description="Episode timestamps are saved to your account profile automatically."
                    visual={
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-yellow-400" />
                        </div>
                    }
                />
                <FeatureCard 
                    title="Private Data"
                    description="Your watch history is yours. We do not sell user data to third parties."
                    visual={
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                    }
                />
             </div>
        </div>

      </div>
    </div>
  );
};