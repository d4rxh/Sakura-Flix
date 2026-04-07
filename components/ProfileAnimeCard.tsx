import React from 'react';
import { Link } from 'react-router-dom';
import { UserProgress } from '../services/firebase';
import { Play, CheckCircle, Plus, Clock, Trash2 } from 'lucide-react';

interface ProfileAnimeCardProps {
  progress: UserProgress;
  onDelete: (id: string) => void;
}

export const ProfileAnimeCard: React.FC<ProfileAnimeCardProps> = ({ progress, onDelete }) => {
  const isCompleted = progress.status === 'Completed';
  // If status is On Hold or episodes watched is 0, consider it "Saved/Plan to Watch"
  const isSaved = progress.status === 'On Hold' || progress.currentEpisode === 0;
  
  const progressPercentage = progress.totalEpisodes > 0 
    ? (progress.currentEpisode / progress.totalEpisodes) * 100 
    : 0;
  
  // Link logic: If saved (not started), go to details. If watching, go to next episode.
  const link = !isCompleted && !isSaved && progress.nextEpisodeId 
    ? `/watch/${encodeURIComponent(progress.nextEpisodeId)}` 
    : `/anime/${progress.animeId}`;

  const handleDelete = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm("Remove this anime from your list?")) {
          onDelete(progress.animeId);
      }
  };

  return (
    <div className="group/card relative">
      <Link to={link} className="block relative">
        <div className="relative aspect-[2/3] overflow-hidden bg-dark-800 mb-2 transition-all duration-300 rounded-sm group-hover/card:shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/5 group-hover/card:border-brand-400/30">
          <img
            src={progress.poster} 
            alt={progress.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover/card:scale-105 ${isCompleted ? 'grayscale group-hover/card:grayscale-0' : ''}`}
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
             <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-400 shadow-[0_0_15px_#f472b6] transform scale-50 group-hover/card:scale-100 transition-all duration-300">
                {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-black fill-black" />
                ) : isSaved ? (
                    <Play className="w-5 h-5 text-black fill-black ml-1" />
                ) : (
                    <Play className="w-5 h-5 text-black fill-black ml-1" />
                )}
             </div>
          </div>
          
          {/* Badge for Saved Items */}
          {isSaved && !isCompleted && (
             <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm border border-white/10 px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                 <Clock className="w-3 h-3 text-brand-400" /> Plan
             </div>
          )}

          {/* Delete Button */}
          <button 
            onClick={handleDelete}
            className="absolute top-2 right-2 w-7 h-7 bg-black/80 hover:bg-red-500 border border-white/10 hover:border-red-500 rounded flex items-center justify-center text-zinc-400 hover:text-white transition-all z-20 shadow-lg"
            title="Remove from list"
          >
              <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          {/* Progress Bar (Only for Watching) */}
          {!isCompleted && !isSaved && progress.totalEpisodes > 0 && (
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10" title={`${progressPercentage.toFixed(0)}% watched`}>
               <div className="h-full bg-brand-400 transition-all shadow-[0_0_10px_#f472b6]" style={{ width: `${progressPercentage}%` }}></div>
             </div>
          )}
        </div>
      </Link>

      {/* Text Content */}
      <div>
        <h3 className="text-sm font-bold text-zinc-200 group-hover/card:text-brand-400 transition-colors line-clamp-1 leading-tight" title={progress.title}>
          {progress.title}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
           <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-mono font-medium text-zinc-500">
              {isCompleted ? (
                 <span className="text-green-500 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> COMPLETED</span>
              ) : isSaved ? (
                 <span className="text-zinc-400 flex items-center gap-1"><Plus className="w-3 h-3" /> PLAN TO WATCH</span>
              ) : (
                 <span className="text-brand-400 flex items-center gap-1">EP {progress.currentEpisode} <span className="text-zinc-600">/</span> {progress.totalEpisodes || '?'}</span>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};