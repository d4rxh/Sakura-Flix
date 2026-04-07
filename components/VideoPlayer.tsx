import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Server, Languages, Info, AlertTriangle, Maximize, RotateCw, Shield, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Episode } from '../types';

interface VideoPlayerProps {
  episodeId: string;
  currentEp: Episode;
  changeEpisode: (direction: 'prev' | 'next') => void;
  hasNextEp: boolean;
  hasPrevEp: boolean;
}

// Ad domains to block via navigator.serviceWorker postMessage
const AD_DOMAINS = [
  'doubleclick.net', 'googleadservices.com', 'googlesyndication.com',
  'adservice.google.com', 'pagead2.googlesyndication.com', 'popads.net',
  'popcash.net', 'propellerads.com', 'adsterra.com', 'exoclick.com',
  'juicyads.com', 'trafficjunky.com', 'revcontent.com', 'outbrain.com',
  'taboola.com', 'media.net', 'pubmatic.com', 'rubiconproject.com',
];

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  episodeId, currentEp, changeEpisode, hasNextEp, hasPrevEp,
}) => {
  const [category, setCategory] = useState<'sub' | 'dub'>(() =>
    (localStorage.getItem('video_category') as 'sub' | 'dub') || 'sub'
  );
  const [server, setServer] = useState<'vidWish' | 'megaPlay'>(() =>
    (localStorage.getItem('video_server') as 'vidWish' | 'megaPlay') || 'megaPlay'
  );
  const [isSkipping, setIsSkipping] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showAdBlockInfo, setShowAdBlockInfo] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { localStorage.setItem('video_category', category); }, [category]);
  useEffect(() => { localStorage.setItem('video_server', server); }, [server]);

  // Handle landscape orientation
  const toggleLandscape = async () => {
    try {
      if (!isLandscape) {
        // Try Screen Orientation API first
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('landscape');
        }
        // Also try fullscreen on the iframe container
        const container = document.getElementById('video-fullscreen-container');
        if (container && container.requestFullscreen) {
          await container.requestFullscreen();
        }
        setIsLandscape(true);
      } else {
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsLandscape(false);
        setZoom(1);
      }
    } catch (e) {
      // Fallback: just toggle CSS landscape mode
      setIsLandscape(!isLandscape);
      if (isLandscape) setZoom(1);
    }
  };

  // Listen for orientation change from device rotation
  useEffect(() => {
    const handleOrientation = () => {
      if (window.matchMedia('(orientation: landscape)').matches) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
        setZoom(1);
      }
    };
    window.addEventListener('orientationchange', handleOrientation);
    screen.orientation?.addEventListener('change', handleOrientation);
    return () => {
      window.removeEventListener('orientationchange', handleOrientation);
      screen.orientation?.removeEventListener('change', handleOrientation);
    };
  }, []);

  const handleSkipToNext = () => {
    if (hasNextEp) {
      setIsSkipping(true);
      setTimeout(() => { changeEpisode('next'); setIsSkipping(false); }, 5000);
    }
  };

  const extractNumericId = (id: string) => {
    if (!id) return '';
    if (id.includes('?ep=')) return id.split('?ep=')[1];
    if (id.includes('$episode$')) return id.split('$episode$')[1];
    const match = id.match(/-(\d+)$/);
    if (match) return match[1];
    if (/^\d+$/.test(id)) return id;
    return id;
  };

  const hianimeEpId = extractNumericId(episodeId);
  const domain = server === 'vidWish' ? 'vidwish.live' : 'megaplay.buzz';
  const src = `https://${domain}/stream/s-2/${hianimeEpId}/${category}?autoplay=1`;

  // Landscape fullscreen styles
  const landscapeStyle: React.CSSProperties = isLandscape ? {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    width: '100vw',
    height: '100vh',
    background: '#000',
  } : {};

  const btnBase = "px-3 py-2 border text-xs font-bold uppercase transition-all rounded-lg";
  const btnActive = "text-black border-pink-400";
  const btnInactive = "text-zinc-500 hover:text-white border-dark-600 hover:border-pink-400/50";

  return (
    <div className="flex flex-col gap-0 w-full relative group" style={isLandscape ? { pointerEvents: 'none' } : {}}>
      {/* Video container */}
      <div
        id="video-fullscreen-container"
        className={`relative w-full bg-black border overflow-hidden z-10 ${isLandscape ? '' : 'aspect-video'}`}
        style={{
          borderColor: 'rgba(244,114,182,0.15)',
          ...(isLandscape ? { ...landscapeStyle, pointerEvents: 'auto' } : {}),
        }}
      >
        <iframe
          ref={iframeRef}
          key={`${server}-${category}-${episodeId}`}
          src={src}
          className="w-full h-full"
          allowFullScreen
          scrolling="no"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-pointer-lock allow-forms"
          title="Anime Stream"
          style={isLandscape
            ? { width: '100vw', height: '100vh', transform: `scale(${zoom})`, transformOrigin: 'center center' }
            : { transform: `scale(${zoom})`, transformOrigin: 'center center' }
          }
        />

        {/* Landscape close button */}
        {isLandscape && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
            <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))}
              className="p-2 rounded-full text-white" style={{ background: 'rgba(244,114,182,0.3)', border: '1px solid rgba(244,114,182,0.5)' }}>
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.6)' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-2 rounded-full text-white" style={{ background: 'rgba(244,114,182,0.3)', border: '1px solid rgba(244,114,182,0.5)' }}>
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(1)}
              className="p-2 rounded-full text-white" style={{ background: 'rgba(244,114,182,0.2)', border: '1px solid rgba(244,114,182,0.4)' }}>
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleLandscape}
              className="p-2 rounded-full text-white"
              style={{ background: 'rgba(244,114,182,0.3)', border: '1px solid rgba(244,114,182,0.5)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Rotate to landscape button (portrait only) */}
        {!isLandscape && (
          <button
            onClick={toggleLandscape}
            className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(244,114,182,0.25)', border: '1px solid rgba(244,114,182,0.4)', backdropFilter: 'blur(8px)' }}
            title="Fullscreen Landscape"
          >
            <Maximize className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-pink-200">Fullscreen</span>
          </button>
        )}
      </div>

      {/* Controls Panel */}
      {!isLandscape && (
        <div className="border-x border-b p-3 md:p-5 flex flex-col gap-3 shadow-lg relative overflow-hidden rounded-b-xl"
          style={{ background: 'linear-gradient(180deg, #1a0018 0%, #0a0008 100%)', borderColor: 'rgba(244,114,182,0.12)' }}>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Server */}
              <div className="flex flex-col gap-1 min-w-[130px]">
                <span className="text-[9px] font-bold text-pink-400/70 uppercase tracking-widest flex items-center gap-1">
                  <Server className="w-3 h-3" /> Server
                </span>
                <div className="flex rounded-lg border p-0.5" style={{ background: 'rgba(244,114,182,0.05)', borderColor: 'rgba(244,114,182,0.15)' }}>
                  <button onClick={() => setServer('megaPlay')}
                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase transition-all rounded-md ${server === 'megaPlay' ? 'text-black' : btnInactive}`}
                    style={server === 'megaPlay' ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)' } : {}}>
                    Mega
                  </button>
                  <button onClick={() => setServer('vidWish')}
                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase transition-all rounded-md ${server === 'vidWish' ? 'text-black' : btnInactive}`}
                    style={server === 'vidWish' ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)' } : {}}>
                    VidWish
                  </button>
                </div>
              </div>

              {/* Audio */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-pink-400/70 uppercase tracking-widest flex items-center gap-1">
                  <Languages className="w-3 h-3" /> Audio
                </span>
                <div className="flex rounded-lg border p-0.5" style={{ background: 'rgba(244,114,182,0.05)', borderColor: 'rgba(244,114,182,0.15)' }}>
                  {['sub', 'dub'].map((type) => (
                    <button key={type} onClick={() => setCategory(type as 'sub' | 'dub')}
                      className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase transition-all rounded-md ${category === type ? 'bg-white text-black' : btnInactive}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Landscape button */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-pink-400/70 uppercase tracking-widest flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> View
                </span>
                <button
                  onClick={toggleLandscape}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all text-pink-300 hover:text-black"
                  style={{ border: '1px solid rgba(244,114,182,0.3)', background: 'rgba(244,114,182,0.08)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #f472b6, #ec4899)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(244,114,182,0.08)')}
                >
                  <Maximize className="w-3.5 h-3.5" /> Landscape
                </button>
              </div>

              {/* Zoom controls */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-pink-400/70 uppercase tracking-widest flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" /> Zoom
                </span>
                <div className="flex items-center gap-1 rounded-lg border px-2 py-1" style={{ background: 'rgba(244,114,182,0.05)', borderColor: 'rgba(244,114,182,0.15)' }}>
                  <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))}
                    className="text-zinc-400 hover:text-pink-400 transition-colors">
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-pink-300 min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                    className="text-zinc-400 hover:text-pink-400 transition-colors">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setZoom(1)}
                    className="text-zinc-400 hover:text-pink-400 transition-colors ml-0.5">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Ad Block info */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-pink-400/70 uppercase tracking-widest flex items-center gap-1">
                  <Shield className="w-3 h-3" /> AdBlock
                </span>
                <button
                  onClick={() => setShowAdBlockInfo(!showAdBlockInfo)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-emerald-400"
                  style={{ border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)' }}
                >
                  <Shield className="w-3.5 h-3.5" /> Active
                </button>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between md:justify-end gap-2 border-t pt-3 md:border-0 md:pt-0"
              style={{ borderColor: 'rgba(244,114,182,0.1)' }}>
              <span className="md:hidden text-[9px] font-bold text-pink-400/50 uppercase tracking-widest">Episodes</span>
              <div className="flex gap-2">
                <button onClick={() => changeEpisode('prev')} disabled={!hasPrevEp}
                  className="group px-3 py-2 border text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg"
                  style={{ background: 'rgba(244,114,182,0.05)', borderColor: 'rgba(244,114,182,0.15)' }}
                  title="Previous Episode">
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button onClick={() => changeEpisode('next')} disabled={!hasNextEp}
                  className="group px-3 py-2 border text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg"
                  style={{ background: 'rgba(244,114,182,0.05)', borderColor: 'rgba(244,114,182,0.15)' }}
                  title="Next Episode">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {hasNextEp && (
                  <button onClick={handleSkipToNext} disabled={isSkipping}
                    className="group px-3 py-2 border text-red-400 hover:text-white disabled:opacity-30 transition-all rounded-lg text-[10px] uppercase font-bold"
                    style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
                    {isSkipping ? 'Skipping...' : 'Error? Skip →'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ad Block Info Popup */}
          {showAdBlockInfo && (
            <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-300 mb-1">Ad Blocker Active</p>
                  <p className="text-zinc-400 leading-relaxed">SakuraFlix blocks known ad networks at the service worker level. Since video streams use external players, for best ad-free experience we recommend also using <strong className="text-white">uBlock Origin</strong> browser extension or <strong className="text-white">Brave Browser</strong>.</p>
                </div>
                <button onClick={() => setShowAdBlockInfo(false)} className="text-zinc-500 hover:text-white ml-auto flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Episode info */}
          <div className="pt-2 border-t flex justify-between items-center text-[10px] font-mono"
            style={{ borderColor: 'rgba(244,114,182,0.08)' }}>
            <div className="flex items-center gap-2 text-zinc-400">
              <Info className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline">PLAYING: </span>
              <span className="text-pink-200 font-bold">EP {currentEp.number}</span>
            </div>
            {currentEp.isFiller && (
              <span className="flex items-center gap-1 text-red-400 font-bold uppercase tracking-wider bg-red-500/10 px-2 py-0.5 border border-red-500/20 rounded">
                <AlertTriangle className="w-3 h-3" /> Filler
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
