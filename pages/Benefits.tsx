import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Crown, User, ArrowRight, Smartphone, Monitor, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Benefits: React.FC = () => {
  const features = [
    { name: "Unlimited 1080p Streaming", guest: true, user: true },
    { name: "Watch History", guest: false, user: true },
    { name: "Manage Cloud History", guest: false, user: true },
    { name: "Cross-Device Sync", guest: false, user: true },
    { name: "Cloud Progress Tracking", guest: false, user: true },
    { name: "Auto-Mark Completed Shows", guest: false, user: true },
    { name: "Custom Watchlists (Coming Soon)", guest: false, user: true },
    { name: "Priority Server Access", guest: false, user: true },
  ];

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-20 px-4 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-400/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
            
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-white italic font-display uppercase tracking-tighter mb-4">
                    Unlock The <span className="text-brand-400">Full Power</span>
                </h1>
                <p className="text-zinc-400 max-w-lg mx-auto font-mono text-sm">
                    Level up your streaming experience. Sync your progress, track your completions, and never lose your spot again.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Guest Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-900 border border-dark-700 p-8 flex flex-col rounded-sm relative"
                >
                    <div className="mb-8 border-b border-dark-700 pb-8">
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-zinc-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Guest User</h2>
                        <div className="mt-2 text-zinc-500 font-mono text-sm">Casual Viewing</div>
                    </div>

                    <ul className="space-y-4 flex-1">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                {feature.guest ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                        <X className="w-3 h-3 text-zinc-600" />
                                    </div>
                                )}
                                <span className={`text-sm ${feature.guest ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature.name}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 pt-8 border-t border-dark-700">
                         <Link to="/" className="block w-full py-4 text-center border border-zinc-700 hover:bg-zinc-800 text-zinc-400 uppercase font-bold text-sm tracking-widest transition-colors">
                             Continue as Guest
                         </Link>
                    </div>
                </motion.div>

                {/* Member Card */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black border border-brand-400 p-8 flex flex-col rounded-sm relative overflow-hidden shadow-[0_0_30px_rgba(244,114,182,0.1)] transform md:scale-105"
                >
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-brand-400 text-black text-[10px] font-black uppercase px-3 py-1 tracking-widest">
                        Recommended
                    </div>

                    <div className="mb-8 border-b border-white/10 pb-8">
                        <div className="w-12 h-12 bg-brand-400 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(244,114,182,0.5)]">
                            <Crown className="w-6 h-6 text-black fill-black" />
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            Pro Member
                        </h2>
                        <div className="mt-2 text-brand-400 font-mono text-sm font-bold">100% Free Forever</div>
                    </div>

                    <ul className="space-y-4 flex-1">
                         {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${feature.user ? 'bg-brand-400' : 'bg-zinc-800'}`}>
                                    {feature.user ? <Check className="w-3 h-3 text-black font-bold" /> : <X className="w-3 h-3 text-zinc-600" />}
                                </div>
                                <span className={`text-sm font-medium ${feature.user ? 'text-white' : 'text-zinc-600'}`}>{feature.name}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 pt-8 border-t border-white/10">
                         <Link to="/login" className="block w-full py-4 text-center bg-brand-400 hover:bg-white text-black uppercase font-black text-sm tracking-widest transition-colors shadow-[0_0_20px_rgba(244,114,182,0.3)]">
                             Create Free Account
                         </Link>
                    </div>
                </motion.div>

            </div>

            {/* Feature Highlights */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-900 p-6 border border-dark-700">
                    <Monitor className="w-8 h-8 text-brand-400 mb-4" />
                    <h3 className="text-white font-bold uppercase tracking-wider mb-2">Cross-Platform</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        Start on your phone, finish on your desktop. Your history follows you wherever you go.
                    </p>
                </div>
                <div className="bg-dark-900 p-6 border border-dark-700">
                    <Shield className="w-8 h-8 text-brand-400 mb-4" />
                    <h3 className="text-white font-bold uppercase tracking-wider mb-2">Data Persistence</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        Local storage is temporary. Accounts are forever. Never lose your watched list when clearing cache.
                    </p>
                </div>
                <div className="bg-dark-900 p-6 border border-dark-700">
                    <Zap className="w-8 h-8 text-brand-400 mb-4" />
                    <h3 className="text-white font-bold uppercase tracking-wider mb-2">Smart Tracking</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        We automatically categorize shows as "Watching" or "Completed" based on your progress.
                    </p>
                </div>
            </div>

        </div>
    </div>
  );
};