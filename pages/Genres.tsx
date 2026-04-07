import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, Map, Smile, HeartCrack, Wand2, Music, Heart, 
  Rocket, Briefcase, Sparkles, Sword, Coffee, Ghost, 
  Trophy, Search, HelpCircle, Zap, LayoutGrid
} from 'lucide-react';

const genres = [
  { id: 'action', label: 'Action', icon: Flame },
  { id: 'adventure', label: 'Adventure', icon: Map },
  { id: 'comedy', label: 'Comedy', icon: Smile },
  { id: 'drama', label: 'Drama', icon: HeartCrack },
  { id: 'fantasy', label: 'Fantasy', icon: Wand2 },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'romance', label: 'Romance', icon: Heart },
  { id: 'sci-fi', label: 'Sci-Fi', icon: Rocket },
  { id: 'seinen', label: 'Seinen', icon: Briefcase },
  { id: 'shojo', label: 'Shojo', icon: Sparkles },
  { id: 'shonen', label: 'Shonen', icon: Sword },
  { id: 'slice-of-life', label: 'Slice of Life', icon: Coffee },
  { id: 'horror', label: 'Horror', icon: Ghost },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'mystery', label: 'Mystery', icon: HelpCircle },
  { id: 'supernatural', label: 'Supernatural', icon: Zap },
];

export const Genres: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-20 px-3 md:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {genres.map((genre, idx) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Link 
                to={`/animes/${genre.id}`}
                className="group relative flex flex-col items-center justify-center aspect-[16/9] md:aspect-[3/2] overflow-hidden rounded-sm bg-black border border-white/10 hover:border-brand-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,114,182,0.15)]"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-brand-400/0 group-hover:bg-brand-400/5 transition-colors duration-300" />

                <div className="w-8 h-8 md:w-10 md:h-10 mb-3 text-zinc-500 group-hover:text-brand-400 transition-colors transform group-hover:scale-110 duration-300">
                  <genre.icon strokeWidth={1.5} className="w-full h-full" />
                </div>
                <span className="text-sm md:text-lg font-black text-zinc-400 group-hover:text-white uppercase tracking-widest transition-all duration-300">
                  {genre.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};