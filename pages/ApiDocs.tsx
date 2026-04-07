
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Server, Copy, Check, ChevronDown, ChevronUp, Zap, Globe, Code2, Cpu, FileJson, List, Calendar, Play, Layers, Hash, Youtube } from 'lucide-react';
import { DEFAULT_CONFIG } from '../services/api';

// --- Helper Components ---

const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  const colors = {
    GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    POST: 'bg-green-500/10 text-green-400 border-green-500/20',
  };
  const style = colors[method as keyof typeof colors] || colors.GET;

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${style}`}>
      {method}
    </span>
  );
};

const CopyButton: React.FC<{ text: string; label?: string; className?: string }> = ({ text, label, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-brand-400 hover:text-black text-zinc-400 transition-all border border-white/5 hover:border-brand-400 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {label && <span className="text-[10px] font-bold uppercase">{label}</span>}
    </button>
  );
};

const JsonPreview: React.FC<{ data: any }> = ({ data }) => {
    const jsonString = JSON.stringify(data, null, 2);
    
    return (
        <div className="relative group mt-3">
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <CopyButton text={jsonString} className="bg-zinc-800 border border-white/10" />
            </div>
            <div className="bg-[#0D0D0D] border border-white/5 rounded-md p-3 overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-700">
                <pre className="font-mono text-[10px] md:text-xs leading-relaxed text-zinc-300">
                    {jsonString}
                </pre>
            </div>
        </div>
    );
};

const EndpointCard: React.FC<{ 
    name: string; 
    path: string; 
    method: string; 
    desc: string; 
    params?: string[];
    exampleResponse: any;
    index: number;
    baseUrlOverride?: string;
}> = ({ name, path, method, desc, params, exampleResponse, index, baseUrlOverride }) => {
    const [showResponse, setShowResponse] = useState(false);
    
    // Construct full URL logic
    const base = baseUrlOverride || DEFAULT_CONFIG.baseUrl;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const fullUrl = path.startsWith('http') ? path : `${cleanBase}${cleanPath}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative bg-dark-900/40 border border-white/5 rounded-lg p-5 hover:border-brand-400/30 hover:bg-dark-900/60 transition-all duration-300"
        >
            <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <MethodBadge method={method} />
                        <h3 className="font-bold text-zinc-200 text-sm md:text-base">{name}</h3>
                    </div>
                </div>

                {/* URL Bar */}
                <div className="flex items-center gap-2 bg-black/50 border border-white/5 rounded px-3 py-2 mb-4 font-mono text-xs md:text-sm text-zinc-400 group-focus-within:border-brand-400/50 transition-colors">
                    <Globe className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                    <div className="flex-1 overflow-x-auto scrollbar-hide whitespace-nowrap">
                        {fullUrl}
                    </div>
                    <div className="pl-2 border-l border-white/10">
                        <CopyButton text={fullUrl} />
                    </div>
                </div>

                <p className="text-xs md:text-sm text-zinc-500 leading-relaxed mb-4">
                    {desc}
                </p>

                {/* Parameters Section */}
                {params && params.length > 0 && (
                    <div className="mb-4">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 block">Parameters</span>
                        <div className="flex flex-wrap gap-2">
                            {params.map(p => (
                                <span key={p} className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded text-zinc-300 border border-white/5 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-brand-400"></span>
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Expandable Response */}
                <div className="border-t border-white/5 pt-3">
                    <button 
                        onClick={() => setShowResponse(!showResponse)}
                        className="w-full flex items-center justify-between text-[10px] font-bold text-zinc-500 hover:text-brand-400 uppercase tracking-widest transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <FileJson className="w-3.5 h-3.5" /> Example Response
                        </span>
                        {showResponse ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    
                    {showResponse && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <JsonPreview data={exampleResponse} />
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- NEW COMPONENT: Streaming Guide ---
const StreamingGuide: React.FC = () => {
    // --- Specific Watch Data Examples ---
    const streamUrl = "https://newanimebackend.vercel.app/anime/episode-srcs?id=one-piece-100$episode$1&server=vidstreaming&category=sub";
    
    const streamJson = {
        "success": true,
        "data": {
            "tracks": [
                { "file": "https://subs.example.com/eng.vtt", "label": "English", "kind": "captions", "default": true }
            ],
            "intro": { "start": 90, "end": 210 },
            "outro": { "start": 1300, "end": 1390 },
            "sources": [
                { "url": "https://m3u8.example.com/master.m3u8", "type": "hls", "isM3U8": true, "quality": "auto" },
                { "url": "https://m3u8.example.com/1080.m3u8", "type": "hls", "isM3U8": true, "quality": "1080p" }
            ],
            "headers": {
                "Referer": "https://vidstack.com",
                "User-Agent": "Mozilla/5.0..."
            }
        }
    };

    const megaPlayUrl = "https://megaplay.buzz/stream/s-2/12345/sub?autoplay=1";

    return (
        <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8 flex items-center gap-3">
                <Play className="w-6 h-6 text-brand-400" /> Streaming Integration Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Method 1: API Data (HLS) */}
                <div className="bg-dark-900 border border-white/10 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-8 h-8 rounded-full bg-brand-400 text-black flex items-center justify-center font-bold text-lg">1</span>
                        <div>
                            <h3 className="font-bold text-white uppercase text-sm">Watch Endpoint (API)</h3>
                            <p className="text-zinc-500 text-[10px]">Recommended for custom players (Vidstack/Hls.js)</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                        {/* URL COPY BLOCK */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Request URL</span>
                            </div>
                            <div className="bg-black/50 border border-white/5 rounded flex items-center p-2 group">
                                <code className="flex-1 font-mono text-[10px] text-brand-400 truncate pr-2">
                                    {streamUrl}
                                </code>
                                <CopyButton text={streamUrl} className="flex-shrink-0" />
                            </div>
                        </div>

                        {/* JSON COPY BLOCK */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Response JSON</span>
                            </div>
                            <div className="bg-black/50 border border-white/5 rounded relative group">
                                <div className="absolute top-2 right-2 z-10">
                                     <CopyButton text={JSON.stringify(streamJson, null, 2)} label="JSON" />
                                </div>
                                <div className="p-3 overflow-x-auto max-h-[200px] scrollbar-thin scrollbar-thumb-zinc-700">
                                    <pre className="font-mono text-[10px] text-zinc-300">
                                        {JSON.stringify(streamJson, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Method 2: MegaPlay Embed */}
                <div className="bg-dark-900 border border-white/10 rounded-lg p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6">
                         <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">2</span>
                         <div>
                            <h3 className="font-bold text-white uppercase text-sm">MegaPlay Embed (Iframe)</h3>
                            <p className="text-zinc-500 text-[10px]">Easiest integration. Direct iframe url.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                         {/* Embed Info */}
                         <div className="bg-brand-400/5 border border-brand-400/10 p-4 rounded">
                            <p className="text-zinc-400 text-xs leading-relaxed mb-2">
                                <span className="text-white font-bold">Logic:</span> You need the numeric ID from the episode ID.
                            </p>
                            <div className="text-[10px] font-mono space-y-1">
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-zinc-500">Episode ID:</span>
                                    <span className="text-zinc-300">one-piece-100$episode$<span className="text-brand-400 font-bold">12345</span></span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-zinc-500">Result ID:</span>
                                    <span className="text-brand-400 font-bold">12345</span>
                                </div>
                            </div>
                         </div>

                        {/* URL COPY BLOCK */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Embed URL</span>
                            </div>
                            <div className="bg-black/50 border border-white/5 rounded flex items-center p-2 group">
                                <code className="flex-1 font-mono text-[10px] text-green-400 truncate pr-2">
                                    {megaPlayUrl}
                                </code>
                                <CopyButton text={megaPlayUrl} className="flex-shrink-0" />
                            </div>
                        </div>

                        {/* Code Snippet */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">HTML Implementation</span>
                            </div>
                            <div className="bg-black/50 border border-white/5 rounded p-3 overflow-x-auto">
                                <pre className="font-mono text-[10px] text-zinc-500">
                                    &lt;iframe<br/>
                                    &nbsp;&nbsp;src="<span className="text-green-400">{megaPlayUrl}</span>"<br/>
                                    &nbsp;&nbsp;frameborder="0"<br/>
                                    &nbsp;&nbsp;allowfullscreen<br/>
                                    &gt;&lt;/iframe&gt;
                                </pre>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

// --- NEW COMPONENT: A-Z Reference ---
const EndpointReference: React.FC = () => {
    // A-Z list of all useful endpoints
    const endpoints = [
        { name: "Airing Schedule", path: "/anime/hianime/schedule", desc: "Get JST schedule" },
        { name: "Category: Completed", path: "/animes/completed?page=1", desc: "Finished anime list" },
        { name: "Category: Movies", path: "/animes/movie?page=1", desc: "Anime movies" },
        { name: "Category: Most Popular", path: "/animes/most-popular?page=1", desc: "All-time popular" },
        { name: "Category: Top Airing", path: "/animes/top-airing?page=1", desc: "Currently popular" },
        { name: "Episode List", path: "/anime/episodes/{id}", desc: "Get all episodes for anime" },
        { name: "Watch / Stream Sources", path: "/anime/episode-srcs?id={epId}", desc: "Get stream links (m3u8)" },
        { name: "Genre List", path: "/anime/hianime/genres", desc: "List of all genres" },
        { name: "Genre Search", path: "/anime/hianime/genre/{genreName}?page=1", desc: "Get anime by genre" },
        { name: "Home Feed", path: "/api/v1/home", desc: "Main dashboard data (Custom)" },
        { name: "Info / Details", path: "/anime/hianime/info?id={id}", desc: "Anime metadata" },
        { name: "Search", path: "/anime/hianime/{query}?page=1", desc: "Search anime" },
        { name: "Search Suggestions", path: "/anime/search/suggestion?q={query}", desc: "Autocomplete data" },
        { name: "Trending", path: "/anime/hianime/trending?page=1", desc: "Trending right now" },
    ];

    const mockJson = { "success": true, "data": "..." };

    return (
        <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8 flex items-center gap-3">
                <Layers className="w-6 h-6 text-brand-400" /> Complete Reference (A-Z)
            </h2>

            <div className="overflow-x-auto bg-dark-900 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-black/20 text-xs text-zinc-500 uppercase tracking-widest">
                            <th className="p-4 font-bold">Endpoint Name</th>
                            <th className="p-4 font-bold">Path Pattern</th>
                            <th className="p-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {endpoints.map((ep, i) => {
                             const fullUrl = ep.path.startsWith('/api') 
                                ? `https://backendweb-ivory.vercel.app${ep.path}` 
                                : `${DEFAULT_CONFIG.baseUrl}${ep.path}`;
                            
                             return (
                                <tr key={i} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{ep.name}</div>
                                        <div className="text-[10px] text-zinc-500">{ep.desc}</div>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-brand-400">
                                        {ep.path}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <CopyButton text={fullUrl} label="URL" />
                                            <CopyButton text={JSON.stringify(mockJson)} label="JSON" className="hidden sm:flex" />
                                        </div>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ApiDocs: React.FC = () => {
  const exampleCode = `
// Example: Fetching Streaming Links

const BASE_URL = "https://newanimebackend.vercel.app";

async function getStream(episodeId) {
  const url = \`\${BASE_URL}/anime/episode-srcs?id=\${episodeId}\`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if(data.success) {
       // Get highest quality m3u8
       const source = data.data.sources.find(s => s.quality === "1080p") 
                   || data.data.sources[0];
                   
       console.log("Stream URL:", source.url);
    }
  } catch (error) {
    console.error("Fetch failed", error);
  }
}

getStream("one-piece-100$episode$1");
  `.trim();

  // --- MOCK DATA ---
  const mockHomeData = { "success": true, "data": { "spotlight": [], "trending": [] } };
  const mockInfoData = { "success": true, "data": { "anime": { "info": { "id": "one-piece", "title": "One Piece" } } } };
  const mockEpisodesData = { "success": true, "data": { "totalEpisodes": 1000, "episodes": [] } };
  const mockStreamData = { "success": true, "data": { "sources": [{ "url": "...", "quality": "1080p" }] } };
  const mockSearchData = { "success": true, "data": { "animes": [] } };
  const mockScheduleData = { "success": true, "data": { "scheduledAnimes": [] } };
  const mockGenresData = { "success": true, "data": ["Action", "Adventure"] };
  const mockCategoryData = { "success": true, "data": { "animes": [] } };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-20 relative overflow-hidden font-sans">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
               backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Ambient Orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-brand-400/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/10 border border-brand-400/20 text-brand-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Cpu className="w-3 h-3" /> v2.0 Developer API
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-white font-display italic tracking-tighter mb-4">
                    PUBLIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">ACCESS</span>
                </h1>
                <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-lg">
                    A comprehensive suite of RESTful endpoints to build your own anime streaming application.
                </p>
            </motion.div>
        </div>

        {/* Main Layout: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Documentation */}
            <div className="lg:col-span-7 space-y-12">
                
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Uptime", val: "99.9%", icon: Server },
                        { label: "Latency", val: "<50ms", icon: Zap },
                        { label: "Access", val: "Free", icon: Globe },
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-dark-900/50 border border-white/5 p-4 rounded-lg text-center backdrop-blur-sm"
                        >
                            <stat.icon className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                            <div className="text-xl font-bold text-white font-mono">{stat.val}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Section: Core Endpoints */}
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Terminal className="w-5 h-5 text-brand-400" /> Core Services
                    </h2>
                    
                    <div className="space-y-4">
                        <EndpointCard 
                            index={1}
                            name="Home Feed (Dashboard)"
                            method="GET"
                            path="https://backendweb-ivory.vercel.app/api/v1/home"
                            desc="Returns trending anime, spotlights, and latest episodes. This is a specialized high-performance endpoint for home pages."
                            exampleResponse={mockHomeData}
                        />
                        <EndpointCard 
                            index={2}
                            name="Anime Details & Info"
                            method="GET"
                            path="anime/hianime/info?id=one-piece-100"
                            desc="Get full metadata, stats, synopsis, and related content."
                            params={["id (required): The unique anime ID"]}
                            exampleResponse={mockInfoData}
                        />
                        <EndpointCard 
                            index={3}
                            name="Episodes List"
                            method="GET"
                            path="anime/episodes/one-piece-100"
                            desc="Retrieve the full list of episodes for a specific anime ID."
                            params={["id (required): The unique anime ID"]}
                            exampleResponse={mockEpisodesData}
                        />
                        <EndpointCard 
                            index={4}
                            name="Streaming Links"
                            method="GET"
                            path="anime/episode-srcs?id=one-piece-100$episode$1&server=vidstreaming&category=sub"
                            desc="Fetch HLS streaming links (m3u8), subtitle tracks, and intro timestamps."
                            params={["id (required): The unique episode ID", "server (optional): vidstreaming, megacloud", "category (optional): sub, dub, raw"]}
                            exampleResponse={mockStreamData}
                        />
                    </div>
                </div>

                {/* Section: Discovery Endpoints */}
                <div className="pt-8">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                        <List className="w-5 h-5 text-brand-400" /> Discovery & Search
                    </h2>
                    
                    <div className="space-y-4">
                        <EndpointCard 
                            index={5}
                            name="Search"
                            method="GET"
                            path="anime/hianime/naruto?page=1"
                            desc="Search for anime by title keywords with pagination."
                            params={["query (path): Keyword", "page (query): Page number"]}
                            exampleResponse={mockSearchData} 
                        />
                        <EndpointCard 
                            index={6}
                            name="Search Suggestions"
                            method="GET"
                            path="anime/search/suggestion?q=one"
                            desc="Fast autocomplete suggestions for search bars."
                            params={["q (required): Query string"]}
                            exampleResponse={mockSearchData}
                        />
                        <EndpointCard 
                            index={7}
                            name="Genre List"
                            method="GET"
                            path="anime/hianime/genres"
                            desc="Get all available anime genres."
                            exampleResponse={mockGenresData}
                        />
                        <EndpointCard 
                            index={8}
                            name="Category / Genre Feed"
                            method="GET"
                            path="anime/hianime/genre/action?page=1"
                            desc="Get anime list for a specific genre or category."
                            params={["genre (path): Genre ID", "page (query): Page number"]}
                            exampleResponse={mockCategoryData}
                        />
                    </div>
                </div>

                {/* Section: Utility */}
                <div className="pt-8">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Calendar className="w-5 h-5 text-brand-400" /> Utilities
                    </h2>
                    
                    <div className="space-y-4">
                        <EndpointCard 
                            index={9}
                            name="Airing Schedule"
                            method="GET"
                            path="https://newanimebackend.vercel.app/anime/hianime/schedule"
                            desc="Get the daily airing schedule (JST time)."
                            exampleResponse={mockScheduleData}
                        />
                    </div>
                </div>
                
                {/* --- Streaming Guide Section --- */}
                <StreamingGuide />

                {/* --- A-Z Reference Section --- */}
                <EndpointReference />

            </div>

            {/* Right Column: Code Example (Sticky on Desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Code2 className="w-4 h-4" /> Usage Example
                    </h2>
                    <span className="text-[10px] bg-brand-400/10 text-brand-400 px-2 py-0.5 rounded border border-brand-400/20 font-bold uppercase">JS / TS</span>
                </div>

                {/* Client Example Terminal */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full rounded-lg overflow-hidden border border-white/10 bg-[#0D0D0D] shadow-2xl relative group"
                >
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <div className="text-xs font-mono text-zinc-500">client.js</div>
                    </div>
                    <div className="p-4 relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CopyButton text={exampleCode} />
                        </div>
                        <pre className="font-mono text-xs md:text-sm leading-relaxed text-zinc-300 overflow-x-auto">
                            {exampleCode}
                        </pre>
                    </div>
                </motion.div>

                <div className="bg-dark-900/50 border border-white/5 p-4 rounded-lg backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-white uppercase mb-2">Base URL Information</h3>
                    <p className="text-zinc-500 text-xs mb-3">Use these base URLs for your requests:</p>
                    
                    <div className="space-y-2">
                        <div className="font-mono text-[10px] text-zinc-400 bg-black/50 p-2 rounded border border-white/5 flex items-center justify-between group">
                            <span className="truncate">https://newanimebackend.vercel.app</span>
                            <CopyButton text="https://newanimebackend.vercel.app" className="p-1 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400 bg-black/50 p-2 rounded border border-white/5 flex items-center justify-between group">
                            <span className="truncate">https://backendweb-ivory.vercel.app/api/v1</span>
                            <CopyButton text="https://backendweb-ivory.vercel.app/api/v1" className="p-1 opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 mt-8 justify-center">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> JSON REST</span>
                    <span className="text-zinc-800">•</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> CORS Enabled</span>
                    <span className="text-zinc-800">•</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> No Rate Limit</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
