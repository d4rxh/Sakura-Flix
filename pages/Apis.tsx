import React, { useState } from 'react';
import { Clipboard, Check, Terminal, Globe, PlayCircle, Code, Cpu, Tv } from 'lucide-react';

const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handleCopy} className="text-zinc-500 hover:text-brand-400 transition-colors" title="Copy Content">
      {copied ? <Check size={16} /> : <Clipboard size={16} />}
    </button>
  )
}

const Endpoint = ({ title, method, url, desc, params, example, notes }: any) => (
  <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-brand-400/30 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <span className={`font-bold px-2 py-1 text-[10px] rounded uppercase tracking-wider ${method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
        {method}
      </span>
      <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide">{title}</h3>
    </div>
    
    <div className="flex items-center gap-3 bg-black/40 p-3 rounded mb-4 font-mono text-xs md:text-sm text-zinc-300 border border-white/5 group">
      <Globe className="w-4 h-4 text-zinc-600 group-hover:text-brand-400 transition-colors" />
      <span className="flex-1 truncate select-all">{url}</span>
      <CopyBtn text={url} />
    </div>

    <p className="text-zinc-400 text-sm leading-relaxed mb-4 border-l-2 border-zinc-700 pl-3">
      {desc}
    </p>

    {params && (
      <div className="mb-4">
        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2 tracking-widest">Parameters Needed</h4>
        <ul className="grid gap-2">
          {params.map((p: string, i: number) => (
            <li key={i} className="text-xs text-zinc-300 flex items-start gap-2 bg-white/5 p-2 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    )}

    {notes && (
         <div className="mb-4 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded">
            <h4 className="text-[10px] font-bold text-yellow-500 uppercase mb-1 tracking-widest flex items-center gap-2">
                Important Logic
            </h4>
            <p className="text-xs text-zinc-400 whitespace-pre-wrap font-mono">{notes}</p>
         </div>
    )}

    {example && (
        <div className="mt-4 pt-4 border-t border-white/5">
             <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2 tracking-widest">Example Usage</h4>
             <div className="bg-[#0d0d0d] p-3 rounded border border-white/5 font-mono text-xs text-zinc-400 overflow-x-auto relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyBtn text={example} />
                </div>
                <pre>{example}</pre>
             </div>
        </div>
    )}
  </div>
)

const MasterPrompt = () => {
    const promptText = `Act as a senior frontend developer. I want to build a modern anime streaming website (like Zoro/HiAnime) using React, Tailwind CSS, and the following API endpoints.

BASE URLS:
1. Home Data: https://backendweb-ivory.vercel.app/api/v1
2. Anime Data: https://newanimebackend.vercel.app/anime/hianime

ENDPOINTS:
1. Home Page: GET /home (Returns spotlight, trending, latest episodes)
2. Search: GET /search?q={query}&page=1 (Returns search results)
3. Details: GET /info?id={animeId} (Returns anime info and episode list)
4. Episodes: GET /episodes/{animeId} (Returns list of episodes with IDs)
5. Streaming (Method A - Video Link): GET /episode-srcs?id={episodeId}&server=vidstreaming&category=sub
   - Returns an m3u8 file link. Use hls.js to play it.

6. Streaming (Method B - Embed/Iframe):
   - Logic: Extract the numeric ID from the Episode ID.
   - Example Episode ID: "one-piece-100$episode$12345"
   - Extracted Number: "12345"
   - Embed URL: https://megaplay.buzz/stream/s-2/{number}/sub?autoplay=1
   - Use an <iframe> pointing to this URL.

7. Genres: GET /genres (List of genres)
8. Category: GET /genre/{genreName}?page=1

REQUIREMENTS:
- Use a dark, sleek UI (colors: black background, #f472b6 accent).
- Create a 'Hero' slider for the spotlight anime on the home page.
- On the Watch page, implement the MegaPlay iframe embed method for video playback because it's easiest.
- Implement a search bar.
- Use 'lucide-react' for icons.
- Ensure the site is responsive (mobile-friendly).

Please initialize the project structure and provide the code for the Home page and Watch page first.`;

    return (
        <div className="mt-16 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-brand-400" /> Master AI Prompt
                </h2>
                <span className="text-xs font-bold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                    Copy & Paste into ChatGPT / Claude
                </span>
            </div>
            
            <div className="bg-[#050505] border border-brand-400/30 rounded-lg p-6 relative group">
                <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-brand-400 text-black px-3 py-1.5 rounded font-bold text-xs cursor-pointer hover:bg-white transition-colors"
                         onClick={() => navigator.clipboard.writeText(promptText)}>
                        <CopyBtn text={promptText} />
                        <span>COPY PROMPT</span>
                    </div>
                </div>
                <pre className="font-mono text-xs md:text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {promptText}
                </pre>
            </div>
        </div>
    );
};

export const Apis: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-20 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-display italic tracking-tighter">
                API <span className="text-brand-400">SECRETS</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
               Welcome to the developer backend. Here is the exact logic used to power SakuraFlix, including the secret embedded player logic.
            </p>
        </div>
        
        <div className="space-y-4">
            
            <Endpoint 
                title="1. MegaPlay Embed (Easiest Streaming)" 
                method="IFRAME" 
                url="https://megaplay.buzz/stream/s-2/{id}/{type}?autoplay=1"
                desc="This is how you stream video without handling complex m3u8 files. You just use an iframe."
                notes={`CRITICAL LOGIC:\nThe API gives you an episode ID like "one-piece-100$episode$58421".\nYou MUST extract only the numbers after "$episode$".\n\nExample ID: "one-piece-100$episode$58421"\nExtracted ID: "58421"\n\nFinal URL: https://megaplay.buzz/stream/s-2/58421/sub?autoplay=1`}
                example={`<iframe \n  src="https://megaplay.buzz/stream/s-2/58421/sub?autoplay=1" \n  frameborder="0" \n  allowfullscreen \n></iframe>`}
            />

            <Endpoint 
                title="2. Get Home Page Data" 
                method="GET" 
                url="https://backendweb-ivory.vercel.app/api/v1/home"
                desc="Get Spotlight, Trending, Upcoming, and Latest Episodes all in one request."
                example={`fetch('https://backendweb-ivory.vercel.app/api/v1/home')`}
            />

            <Endpoint 
                title="3. Search Anime" 
                method="GET" 
                url="https://newanimebackend.vercel.app/anime/hianime/{query}?page=1"
                desc="Search for any anime."
                params={['query: Anime name (e.g. naruto)', 'page: Page number']}
                example={`fetch('https://newanimebackend.vercel.app/anime/hianime/bleach?page=1')`}
            />

            <Endpoint 
                title="4. Get Info & Episodes" 
                method="GET" 
                url="https://newanimebackend.vercel.app/anime/hianime/info?id={id}"
                desc="Get description, stats, and the full list of episode IDs."
                params={['id: Anime ID (e.g. one-piece)']}
                example={`fetch('https://newanimebackend.vercel.app/anime/hianime/info?id=one-piece')`}
            />

            <Endpoint 
                title="5. Genres" 
                method="GET" 
                url="https://newanimebackend.vercel.app/anime/hianime/genres"
                desc="Get a list of all available genres."
                example={`fetch('https://newanimebackend.vercel.app/anime/hianime/genres')`}
            />

            <Endpoint 
                title="6. Genre Specific Anime" 
                method="GET" 
                url="https://newanimebackend.vercel.app/anime/hianime/genre/{genreName}?page=1"
                desc="Get anime belonging to a specific genre."
                params={['genreName: e.g. action, romance, horror']}
                example={`fetch('https://newanimebackend.vercel.app/anime/hianime/genre/action?page=1')`}
            />

        </div>

        <MasterPrompt />

        <div className="mt-12 p-6 bg-brand-400/10 border border-brand-400/20 rounded-lg flex items-start gap-4">
            <Terminal className="w-6 h-6 text-brand-400 mt-1" />
            <div>
                <h4 className="text-white font-bold uppercase mb-2">Developer Note</h4>
                <p className="text-zinc-400 text-sm">
                   The "Master Prompt" above is designed to be pasted directly into an AI coding assistant. It contains all the context needed for the AI to understand the specialized logic of this backend.
                </p>
            </div>
        </div>

      </div>
    </div>
  )
}
