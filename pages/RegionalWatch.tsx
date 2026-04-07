import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../services/api';
import { LoaderCircle, AlertTriangle, ChevronLeft, List, Grid2X2, Search, Maximize, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegionalWatch: React.FC = () => {
    const { animeId, episodeNumber } = useParams<{ animeId: string, episodeNumber: string }>();
    const navigate = useNavigate();
    const [epSearch, setEpSearch] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
    const [isLandscape, setIsLandscape] = useState(false);
    const [zoom, setZoom] = useState(1);

    const { data: animeData, isLoading: isAnimeLoading, isError: isAnimeError, error: animeError } = useApi<any>(
        `https://animesalt-api-lovat.vercel.app/api/anime/${animeId}`
    );
    const isMovie = episodeNumber === 'movie';
    const { data: epData, isLoading: isEpLoading, isError: isEpError, error: epError } = useApi<any>(
        `https://animesalt-api-lovat.vercel.app/api/episode/${episodeNumber}`,
        { enabled: !isMovie }
    );

    const isLoading = isAnimeLoading || (isEpLoading && !isMovie);
    const isError = isAnimeError || (isEpError && !isMovie);
    const error = animeError || epError;

    const seasonsMap: Record<string, any[]> = {};
    if (animeData && animeData.episodes && Array.isArray(animeData.episodes)) {
        animeData.episodes.forEach((ep: any) => {
            const s = ep.season || '1';
            if (!seasonsMap[s]) seasonsMap[s] = [];
            seasonsMap[s].push(ep);
        });
    }
    const seasons = Object.entries(seasonsMap).map(([title, episodes]) => ({ title: `Season ${title}`, episodes }));

    useEffect(() => {
        if (seasons.length > 0 && !isMovie) {
            const playingSeasonIdx = seasons.findIndex(s => s.episodes.some((e: any) => e.id === episodeNumber));
            if (playingSeasonIdx !== -1) setSelectedSeasonIdx(playingSeasonIdx);
        }
    }, [animeData, episodeNumber, isMovie]);

    // Landscape toggle
    const toggleLandscape = async () => {
        try {
            if (!isLandscape) {
                if (screen.orientation && (screen.orientation as any).lock) {
                    await (screen.orientation as any).lock('landscape');
                }
                const container = document.getElementById('regional-video-container');
                if (container?.requestFullscreen) await container.requestFullscreen();
                setIsLandscape(true);
            } else {
                if (screen.orientation && (screen.orientation as any).unlock) (screen.orientation as any).unlock();
                if (document.fullscreenElement) await document.exitFullscreen();
                setIsLandscape(false);
                setZoom(1);
            }
        } catch (e) {
            setIsLandscape(!isLandscape);
        }
    };

    useEffect(() => {
        const handleOri = () => {
            if (window.matchMedia('(orientation: landscape)').matches) setIsLandscape(true);
            else { setIsLandscape(false); setZoom(1); }
        };
        window.addEventListener('orientationchange', handleOri);
        return () => window.removeEventListener('orientationchange', handleOri);
    }, []);

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0008' }}>
            <LoaderCircle className="w-12 h-12 animate-spin text-pink-400" />
            <span className="font-bold text-sm tracking-widest uppercase text-pink-300">Loading Stream...</span>
        </div>
    );

    if (isError || !animeData || Object.keys(animeData).length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: '#0a0008' }}>
            <AlertTriangle className="w-16 h-16 text-red-400 opacity-50" />
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">Error</h1>
                <p className="text-zinc-500 text-sm">{error?.message || "Episode data not found."}</p>
            </div>
            <button onClick={() => navigate(`/regional/anime/${animeId}`)}
                className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-pink-300 transition-all"
                style={{ border: '1px solid rgba(244,114,182,0.3)', background: 'rgba(244,114,182,0.08)' }}>
                ← Back to Anime
            </button>
        </div>
    );

    const anime = animeData;
    const episodes = anime.episodes || [];
    const activeSeasonEps = seasons[selectedSeasonIdx]?.episodes || [];
    const filteredEpisodes = activeSeasonEps.filter((ep: any) =>
        ep.number.toString().includes(epSearch) ||
        (ep.title && ep.title.toLowerCase().includes(epSearch.toLowerCase()))
    );

    let videoUrl = "";
    if (isMovie) videoUrl = anime.movie_players?.length > 0 ? anime.movie_players[0] : "";
    else videoUrl = epData?.video_player || "";

    const currentEpTitle = isMovie ? anime.title : (episodes.find((e: any) => e.id === episodeNumber)?.title || `Episode ${episodeNumber}`);

    // Landscape fullscreen style
    const landscapeVideoStyle: React.CSSProperties = isLandscape ? {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999, width: '100vw', height: '100vh', background: '#000',
    } : {};

    const pinkBorder = { borderColor: 'rgba(244,114,182,0.15)' };
    const pinkBg = { background: 'linear-gradient(180deg, #1a0018 0%, #0a0008 100%)' };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="min-h-screen pt-14 md:pt-20 pb-16 text-zinc-200 relative"
            style={{ background: '#0a0008' }}>

            <div className="max-w-[1800px] mx-auto w-full px-2 md:px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 border-b pb-3 md:pb-4"
                    style={pinkBorder}>
                    <div>
                        <button onClick={() => navigate(`/regional/anime/${animeId}`)}
                            className="flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-widest hover:text-white mb-1 transition-colors">
                            <ChevronLeft className="w-3 h-3" /> Back to Anime
                        </button>
                        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white truncate max-w-2xl leading-tight">
                            {currentEpTitle}
                        </h1>
                        <p className="text-zinc-500 text-xs font-mono">{anime.title}</p>
                    </div>
                    <span className="text-pink-400 text-[9px] font-bold uppercase border px-2 py-1 rounded-lg self-start md:self-auto"
                        style={{ borderColor: 'rgba(244,114,182,0.3)', background: 'rgba(244,114,182,0.08)' }}>
                        ✿ Regional
                    </span>
                </div>

                {/* Layout */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

                    {/* Video + Controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">

                        {/* Player */}
                        <div id="regional-video-container"
                            className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl group"
                            style={{ ...(isLandscape ? landscapeVideoStyle : { aspectRatio: '16/9' }), border: '1px solid rgba(244,114,182,0.15)' }}>
                            {videoUrl ? (
                                <iframe
                                    src={videoUrl}
                                    className="w-full h-full border-none"
                                    allowFullScreen
                                    allow="autoplay; fullscreen"
                                    sandbox="allow-scripts allow-same-origin allow-presentation allow-pointer-lock allow-forms"
                                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                                    No video source found for this {isMovie ? 'movie' : 'episode'}.
                                </div>
                            )}

                            {/* Landscape close */}
                            {isLandscape && (
                                <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
                                    <button onClick={() => setZoom(z => Math.max(1, z - 0.1))}
                                        className="p-2 rounded-full text-white" style={{ background: 'rgba(244,114,182,0.3)' }}>
                                        <ZoomOut className="w-4 h-4" />
                                    </button>
                                    <span className="text-white text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                                        className="p-2 rounded-full text-white" style={{ background: 'rgba(244,114,182,0.3)' }}>
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setZoom(1)}
                                        className="p-2 rounded-full text-white" style={{ background: 'rgba(244,114,182,0.2)' }}>
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button onClick={toggleLandscape}
                                        className="p-2 rounded-full text-white" style={{ background: 'rgba(244,114,182,0.3)' }}>
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Portrait landscape button */}
                            {!isLandscape && videoUrl && (
                                <button onClick={toggleLandscape}
                                    className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: 'rgba(244,114,182,0.25)', border: '1px solid rgba(244,114,182,0.4)', backdropFilter: 'blur(8px)' }}>
                                    <Maximize className="w-3.5 h-3.5 text-pink-400" />
                                    <span className="text-pink-200">Fullscreen</span>
                                </button>
                            )}
                        </div>

                        {/* Zoom controls (portrait) */}
                        {!isLandscape && videoUrl && (
                            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ ...pinkBg, border: '1px solid rgba(244,114,182,0.1)' }}>
                                <span className="text-[9px] font-bold text-pink-400/70 uppercase tracking-widest mr-1">Zoom</span>
                                <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-pink-400 transition-colors border" style={pinkBorder}>
                                    <ZoomOut className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold text-pink-300 min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
                                <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-pink-400 transition-colors border" style={pinkBorder}>
                                    <ZoomIn className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setZoom(1)}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-pink-400 transition-colors border text-[10px] font-bold ml-1" style={pinkBorder}>
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <div className="flex-1" />
                                <button onClick={toggleLandscape}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-black"
                                    style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}>
                                    <Maximize className="w-3 h-3" /> Landscape
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Episode List */}
                    {!isMovie && (
                        <div className="w-full lg:w-[380px] flex-shrink-0">
                            <div className="flex flex-col rounded-xl overflow-hidden h-[420px] md:h-[560px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-24"
                                style={{ ...pinkBg, border: '1px solid rgba(244,114,182,0.15)', boxShadow: '0 8px 32px rgba(244,114,182,0.08)' }}>

                                {/* List Header */}
                                <div className="p-3 border-b space-y-3" style={{ background: 'rgba(244,114,182,0.05)', borderColor: 'rgba(244,114,182,0.12)' }}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                            <List className="w-4 h-4 text-pink-400" /> Episodes
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex rounded-lg border p-0.5" style={{ background: '#0a0008', borderColor: 'rgba(244,114,182,0.15)' }}>
                                                <button onClick={() => setViewMode('list')}
                                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                                                    style={viewMode === 'list' ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)' } : {}}>
                                                    <List className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => setViewMode('grid')}
                                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                                                    style={viewMode === 'grid' ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)' } : {}}>
                                                    <Grid2X2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-500 px-2 py-1 rounded-lg border" style={pinkBorder}>
                                                {activeSeasonEps.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Search + Season */}
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                                            <input type="text" placeholder="Search episode..."
                                                value={epSearch} onChange={(e) => setEpSearch(e.target.value)}
                                                className="w-full border rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                                                style={{ background: '#0a0008', borderColor: 'rgba(244,114,182,0.15)' }}
                                            />
                                        </div>
                                        {seasons.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                                {seasons.map((season, idx) => (
                                                    <button key={idx} onClick={() => setSelectedSeasonIdx(idx)}
                                                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap rounded-lg transition-colors border ${selectedSeasonIdx === idx ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
                                                        style={selectedSeasonIdx === idx
                                                            ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)', borderColor: '#f472b6' }
                                                            : { background: '#0a0008', borderColor: 'rgba(244,114,182,0.15)' }}>
                                                        {season.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Episode List */}
                                <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
                                    {filteredEpisodes.length > 0 ? (
                                        viewMode === 'list' ? (
                                            <div className="space-y-1">
                                                {filteredEpisodes.map((ep: any) => {
                                                    const isActive = ep.id === episodeNumber;
                                                    return (
                                                        <Link key={ep.id} to={`/regional/watch/${animeId}/${ep.id}`}
                                                            className={`flex items-center gap-2 p-2 rounded-lg group transition-all border-l-2 ${isActive ? '' : 'border-transparent hover:border-pink-500/30'}`}
                                                            style={isActive ? { background: 'rgba(244,114,182,0.1)', borderLeftColor: '#f472b6' } : {}}>
                                                            <div className={`w-7 h-6 flex items-center justify-center rounded-md font-mono text-[10px] font-bold flex-shrink-0 ${isActive ? 'text-black' : 'text-zinc-500 group-hover:text-white bg-dark-800'}`}
                                                                style={isActive ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)' } : {}}>
                                                                {ep.number}
                                                            </div>
                                                            <div className={`text-[10px] font-bold truncate ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                                                {ep.title || `Episode ${ep.number}`}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
                                                {filteredEpisodes.map((ep: any) => {
                                                    const isActive = ep.id === episodeNumber;
                                                    return (
                                                        <Link key={ep.id} to={`/regional/watch/${animeId}/${ep.id}`}
                                                            className={`aspect-square flex items-center justify-center rounded-lg border transition-all ${isActive ? 'text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                                                            style={isActive
                                                                ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)', borderColor: '#f472b6' }
                                                                : { background: 'rgba(244,114,182,0.05)', borderColor: 'rgba(244,114,182,0.12)' }}>
                                                            <span className="text-xs font-mono">{ep.number}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center">
                                            <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-xs uppercase font-bold">No episodes found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
