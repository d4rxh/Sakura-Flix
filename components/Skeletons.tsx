import React from 'react';

// Enhanced Skeleton with Shimmer
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`skeleton-shimmer bg-dark-800/50 ${className}`} />
);

export const AnimeCardSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-full animate-pulse">
    {/* Card Image Area - Matching aspect-[2/3] */}
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-dark-800 rounded-sm border border-white/5">
       <div className="absolute inset-0 skeleton-shimmer opacity-50" />
    </div>
    
    {/* Text Content */}
    <div className="mt-2 md:mt-3 space-y-2">
      <Skeleton className="h-3 md:h-4 w-3/4 rounded-sm" />
      <div className="flex justify-between items-center">
         <Skeleton className="h-2 md:h-3 w-1/3 rounded-sm" />
         <Skeleton className="h-2 md:h-3 w-4 rounded-sm" />
      </div>
    </div>
  </div>
);

export const ContinueWatchingCardSkeleton: React.FC = () => (
    <div className="w-[280px] md:w-[320px] flex-shrink-0 snap-start">
        <div className="relative aspect-video bg-dark-800 overflow-hidden rounded-sm border border-white/5">
            <div className="absolute inset-0 skeleton-shimmer opacity-50" />
            
            {/* Overlay simulation */}
            <div className="absolute bottom-3 left-3 right-3 space-y-2 z-10">
                <Skeleton className="h-3 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-1/2 bg-white/20" />
            </div>
            
            {/* Progress Bar Placeholder */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <Skeleton className="h-full w-2/3 bg-brand-400/30" />
            </div>
        </div>
    </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="relative w-full aspect-video bg-dark-950 overflow-hidden flex items-end border-b border-white/5">
    {/* Background Placeholder */}
    <div className="absolute inset-0 skeleton-shimmer opacity-10" />
    
    <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-12 pb-8 md:pb-16">
        <div className="max-w-2xl space-y-4">
             {/* Title */}
            <Skeleton className="h-10 md:h-16 w-3/4 md:w-1/2 rounded-sm" />
            
            {/* Meta */}
            <div className="flex gap-3">
                <Skeleton className="h-4 w-12 rounded-sm" />
                <Skeleton className="h-4 w-12 rounded-sm" />
                <Skeleton className="h-4 w-20 rounded-sm" />
            </div>

            {/* Desc */}
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-2/3 opacity-60" />
                <Skeleton className="h-4 w-1/2 opacity-60" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <Skeleton className="h-10 md:h-12 w-32 md:w-40 skew-x-[-12deg] rounded-sm" />
                <Skeleton className="h-10 md:h-12 w-10 md:w-14 skew-x-[-12deg] rounded-sm" />
            </div>
        </div>
    </div>
  </div>
);

export const SectionSkeleton: React.FC = () => (
  <div className="mb-8 md:mb-12 relative">
      <div className="max-w-[1600px] mx-auto px-3 md:px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-4 border-l-4 border-dark-800 pl-4">
               <Skeleton className="h-6 w-48 rounded-sm" />
          </div>
          
          {/* Horizontal Scroll Area */}
          <div className="flex gap-3 md:gap-5 overflow-hidden -mx-3 md:-mx-6 px-3 md:px-6">
               {[...Array(6)].map((_, i) => (
                   <div key={i} className="w-[105px] sm:w-[150px] md:w-[200px] flex-shrink-0">
                       <AnimeCardSkeleton />
                   </div>
               ))}
          </div>
      </div>
  </div>
);

export const HomeSkeleton: React.FC = () => (
  <div className="min-h-screen bg-dark-950 pb-20 overflow-hidden">
      {/* PC Only Hero Skeleton */}
      <div className="hidden md:block">
         <HeroSkeleton />
      </div>

      {/* Content Area - Adjusted padding for Mobile (pt-24) vs Desktop (-mt-12 overlap) */}
      <div className="relative z-10 space-y-6 pt-24 md:pt-0 md:-mt-8">
           <SectionSkeleton />
           <SectionSkeleton />
           <SectionSkeleton />
           <SectionSkeleton />
      </div>
  </div>
);

export const CategorySkeleton: React.FC = () => (
   <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6">
        {[...Array(18)].map((_, i) => (
            <AnimeCardSkeleton key={i} />
        ))}
   </div>
);

export const DetailSkeleton: React.FC = () => (
  <div className="min-h-screen bg-dark-900 pb-20">
      {/* Banner Area */}
      <div className="relative w-full h-[40vh] min-h-[300px] md:h-[60vh] md:min-h-[500px] bg-dark-950 overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent" />

          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-row items-end pb-8 md:pb-12 gap-4 md:gap-8">
              {/* Poster Placeholder */}
              <div className="w-28 sm:w-40 md:w-64 flex-shrink-0 -mb-10 md:-mb-28 z-20">
                 <div className="aspect-[2/3] w-full bg-dark-800 rounded-sm border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 skeleton-shimmer opacity-30" />
                 </div>
              </div>

              {/* Info Placeholder */}
              <div className="flex flex-col justify-end w-full z-10 space-y-2 md:space-y-4 mb-1 md:mb-0">
                  <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-8 md:h-16 w-full md:w-3/4" />
                  <Skeleton className="h-4 md:h-6 w-1/2" />
                  
                  {/* Stats Row */}
                  <div className="flex gap-4 pt-2 md:pt-4 border-t border-white/10 mt-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-20 space-y-8 md:space-y-12">
          {/* Description */}
          <section>
              <Skeleton className="h-6 md:h-8 w-32 md:w-48 mb-4 md:mb-6" />
              <div className="space-y-2">
                  <Skeleton className="h-3 md:h-4 w-full opacity-60" />
                  <Skeleton className="h-3 md:h-4 w-full opacity-60" />
                  <Skeleton className="h-3 md:h-4 w-5/6 opacity-60" />
              </div>
              <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16 rounded-sm" />
                  <Skeleton className="h-6 w-20 rounded-sm" />
                  <Skeleton className="h-6 w-16 rounded-sm" />
              </div>
          </section>

          {/* Episodes Grid */}
          <section>
              <div className="flex justify-between items-end mb-4 md:mb-6">
                 <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
                 <Skeleton className="h-8 w-24 rounded-sm skew-x-[-12deg]" />
              </div>
              <div className="flex flex-col gap-1">
                  {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-14 md:h-16 w-full bg-dark-800 border-l-4 border-transparent flex items-center px-4 gap-4">
                          <Skeleton className="h-6 w-6 rounded-sm" />
                          <div className="flex-1 space-y-2">
                              <Skeleton className="h-3 w-3/4" />
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      </div>
  </div>
);

export const SideCardSkeleton: React.FC = () => (
  <div className="flex gap-4 p-2 items-center">
    <Skeleton className="w-16 h-24 rounded-sm flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const ScheduleItemSkeleton: React.FC<{ isLast?: boolean }> = ({ isLast }) => (
    <div className={`flex gap-4 md:gap-8 relative pl-6 md:pl-8 ${!isLast ? 'pb-8 md:pb-12' : ''}`}>
        {!isLast && <div className="absolute left-[11px] md:left-[15px] top-3 bottom-0 w-[1px] bg-white/5" />}
        <div className="absolute left-[6px] md:left-[10px] top-1.5 w-3 h-3 rounded-full bg-dark-950 border border-dark-700 z-10" />
        <div className="w-16 md:w-24 flex-shrink-0">
           <Skeleton className="h-6 md:h-8 w-12 mb-2" />
           <Skeleton className="h-3 w-8" />
        </div>
        <div className="flex-1 bg-dark-900 border border-dark-700 p-5 rounded-sm h-32 relative overflow-hidden">
             <div className="absolute inset-0 skeleton-shimmer opacity-5" />
             <div className="space-y-3 w-3/4 mt-1">
                 <Skeleton className="h-5 md:h-6 w-3/4" />
                 <Skeleton className="h-3 md:h-4 w-1/2 opacity-50" />
             </div>
             <div className="flex gap-2 mt-4">
                 <Skeleton className="h-5 w-16 rounded-sm" />
                 <Skeleton className="h-5 w-20 rounded-sm" />
             </div>
        </div>
    </div>
);

export const ScheduleSkeleton: React.FC = () => (
    <div className="max-w-4xl mx-auto pt-8">
        {[...Array(6)].map((_, i) => (
            <ScheduleItemSkeleton key={i} isLast={i === 5} />
        ))}
    </div>
);