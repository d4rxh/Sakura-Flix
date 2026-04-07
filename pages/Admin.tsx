import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle, Database, Play, Code, RotateCcw, Monitor, Type, Layout, MousePointer2, Smartphone, Move, Mouse, Sliders, Key, ImagePlus, Trash2, Plus } from 'lucide-react';
import { DEFAULT_CONFIG, getConfig } from '../services/api';
import axios from 'axios';

export const Admin: React.FC = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  
  // Extended UI Config State
  const [uiConfig, setUiConfig] = useState({ 
      slideInterval: 8000,
      showHeroTitle: true,
      heroTitleColor: '#ffffff',
      heroTitleFontSize: 'large',
      heroAspectRatio: '16:9',
      enableTrackpad: false,
      trackpadWidth: 256,
      trackpadHeight: 192,
      scrollSensitivity: 2, // Default sensitivity
      invertScroll: false,
      showRightClick: false // Option to show right click button
  });
  
  // Custom Hero URLs Management
  const [heroUrls, setHeroUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  
  const [testResult, setTestResult] = useState<{ status: string; message: string; data?: any } | null>(null);
  const [testEndpoint, setTestEndpoint] = useState('/home');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load API config
    setConfig(getConfig());
    
    // Load UI config
    try {
        const storedUi = localStorage.getItem('ui_config');
        if (storedUi) {
            const parsed = JSON.parse(storedUi);
            setUiConfig(prev => ({ ...prev, ...parsed }));
        }
    } catch (e) {}

    // Load Hero URLs
    try {
        const storedUrls = localStorage.getItem('custom_hero_urls');
        if (storedUrls) {
            setHeroUrls(JSON.parse(storedUrls));
        } else {
            // Default Slide (Updated to valid raw JSON)
            setHeroUrls(['https://res.cloudinary.com/dj5hhott5/raw/upload/v1767375104/heroslides_data.json']);
        }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('api_config', JSON.stringify(config));
      localStorage.setItem('ui_config', JSON.stringify(uiConfig));
      localStorage.setItem('custom_hero_urls', JSON.stringify(heroUrls));
      
      setIsSaved(true);
      
      // Dispatch custom event to update Trackpad immediately without reload
      window.dispatchEvent(new Event('ui_config_update'));

      setTimeout(() => {
        setIsSaved(false);
        window.location.reload(); // Reload to reflect changes in Hero component immediately
      }, 1000);
    } catch (e) {
      alert("Failed to save settings to Local Storage");
    }
  };

  const handleReset = () => {
    if(window.confirm("Are you sure you want to reset all settings to default?")) {
      localStorage.removeItem('api_config');
      localStorage.removeItem('ui_config');
      localStorage.removeItem('custom_hero_urls');
      
      setConfig(DEFAULT_CONFIG);
      setUiConfig({ 
          slideInterval: 8000,
          showHeroTitle: true,
          heroTitleColor: '#ffffff',
          heroTitleFontSize: 'large',
          heroAspectRatio: '16:9',
          enableTrackpad: false,
          trackpadWidth: 256,
          trackpadHeight: 192,
          scrollSensitivity: 2,
          invertScroll: false,
          showRightClick: false
      });
      // Reset URL list to default
      setHeroUrls(['https://res.cloudinary.com/dj5hhott5/raw/upload/v1767375104/heroslides_data.json']);
      
      window.location.reload();
    }
  };

  const generateApiKey = () => {
    // Generate a secure random hex string
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const key = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    setConfig(prev => ({ ...prev, apiKey: `ak_${key}` }));
  };

  const addHeroUrl = () => {
      if (newUrl && !heroUrls.includes(newUrl)) {
          setHeroUrls([...heroUrls, newUrl]);
          setNewUrl('');
      }
  };

  const removeHeroUrl = (urlToRemove: string) => {
      setHeroUrls(heroUrls.filter(url => url !== urlToRemove));
  };

  const runTest = async () => {
    setTestResult({ status: 'loading', message: 'Fetching...' });
    try {
        const url = `${config.baseUrl.replace(/\/+$/, '')}${testEndpoint}`;
        // Include API key in test request headers
        const headers = config.apiKey ? { 'x-api-key': config.apiKey } : {};
        
        const res = await axios.get(url, { headers });
        setTestResult({ 
            status: 'success', 
            message: `Status: ${res.status}`, 
            data: res.data 
        });
    } catch (err: any) {
        setTestResult({ 
            status: 'error', 
            message: err.message, 
            data: err.response?.data 
        });
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 px-4 pb-12 font-sans text-zinc-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-dark-700 pb-4">
            <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Admin Settings</h1>
                <p className="text-zinc-500 text-sm mt-1">Configure API connections and Interface preferences.</p>
            </div>
            <div className="flex gap-3">
                <button onClick={handleReset} className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors uppercase font-bold text-xs tracking-wider flex items-center gap-2 -skew-x-12">
                    <span className="skew-x-12 flex items-center gap-2"><RotateCcw className="w-3 h-3" /> Reset</span>
                </button>
                <button 
                    onClick={handleSave} 
                    className={`px-6 py-2 font-bold uppercase tracking-wider transition-colors -skew-x-12 flex items-center gap-2 ${
                        isSaved ? 'bg-green-500 text-black' : 'bg-brand-400 text-black hover:bg-white'
                    }`}
                >
                    <span className="skew-x-12 flex items-center gap-2">
                        {isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isSaved ? 'Saved!' : 'Save Changes'}
                    </span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Configuration Column */}
            <div className="space-y-6">
                
                {/* Hero Slides Configuration (NEW) */}
                <div className="bg-dark-900 border border-dark-700 p-6 relative">
                    <h2 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-dark-700 pb-2">
                        <ImagePlus className="w-4 h-4 text-brand-400" /> Hero Slider Config
                    </h2>
                    
                    <div className="mb-4">
                        <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Add Custom Slide (JSON URL)</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="w-full bg-dark-800 border border-dark-600 text-white px-3 py-2 text-sm focus:border-brand-400 outline-none"
                                placeholder="https://api.example.com/slide.json"
                            />
                            <button 
                                onClick={addHeroUrl}
                                className="px-3 bg-brand-400 text-black hover:bg-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-dark-600">
                        {heroUrls.map((url, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-dark-800 p-2 border border-dark-600 rounded-sm">
                                <span className="text-xs font-mono text-zinc-400 truncate flex-1 mr-2" title={url}>{url}</span>
                                <button 
                                    onClick={() => removeHeroUrl(url)}
                                    className="text-zinc-500 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                         {heroUrls.length === 0 && (
                            <p className="text-[10px] text-zinc-500 italic">No custom slides added.</p>
                        )}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">
                        These APIs are fetched and merged with the spotlight anime list on the Home page.
                    </p>
                </div>

                {/* Input Mode Settings */}
                <div className="bg-dark-900 border border-dark-700 p-6 relative">
                    <h2 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-dark-700 pb-2">
                        <MousePointer2 className="w-4 h-4 text-brand-400" /> Input Configuration
                    </h2>
                    
                    <div className="flex items-center justify-between bg-dark-800 p-4 border border-dark-600 rounded-sm mb-4">
                        <div>
                            <div className="text-sm font-bold text-white uppercase mb-1 flex items-center gap-2">
                                {uiConfig.enableTrackpad ? <MousePointer2 className="w-4 h-4 text-brand-400"/> : <Smartphone className="w-4 h-4 text-zinc-500"/>}
                                {uiConfig.enableTrackpad ? 'Mouse Mode' : 'Touch Mode'}
                            </div>
                            <p className="text-[10px] text-zinc-500">
                                {uiConfig.enableTrackpad ? 'Virtual Trackpad enabled.' : 'Standard touch controls enabled.'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setUiConfig({...uiConfig, enableTrackpad: !uiConfig.enableTrackpad})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${uiConfig.enableTrackpad ? 'bg-brand-400' : 'bg-dark-600'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${uiConfig.enableTrackpad ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {uiConfig.enableTrackpad && (
                        <div className="space-y-6 pt-4 border-t border-dark-700">
                             
                             {/* Size Config */}
                             <div className="space-y-4">
                                <h3 className="text-xs font-bold text-brand-400 uppercase flex items-center gap-2">
                                    <Move className="w-3 h-3" /> Dimensions
                                </h3>
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase mb-1 flex justify-between">
                                        Width <span>{uiConfig.trackpadWidth}px</span>
                                    </label>
                                    <input 
                                        type="range" min="150" max="500" step="10"
                                        value={uiConfig.trackpadWidth}
                                        onChange={(e) => setUiConfig({...uiConfig, trackpadWidth: parseInt(e.target.value)})}
                                        className="w-full accent-brand-400 h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase mb-1 flex justify-between">
                                        Height <span>{uiConfig.trackpadHeight}px</span>
                                    </label>
                                    <input 
                                        type="range" min="150" max="500" step="10"
                                        value={uiConfig.trackpadHeight}
                                        onChange={(e) => setUiConfig({...uiConfig, trackpadHeight: parseInt(e.target.value)})}
                                        className="w-full accent-brand-400 h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                             </div>

                             {/* Functionality Config */}
                             <div className="space-y-4 pt-4 border-t border-dark-700">
                                <h3 className="text-xs font-bold text-brand-400 uppercase flex items-center gap-2">
                                    <Sliders className="w-3 h-3" /> Capabilities
                                </h3>
                                
                                {/* Scroll Sensitivity */}
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase mb-1 flex justify-between">
                                        Scroll Sensitivity <span>{uiConfig.scrollSensitivity}x</span>
                                    </label>
                                    <input 
                                        type="range" min="1" max="10" step="0.5"
                                        value={uiConfig.scrollSensitivity}
                                        onChange={(e) => setUiConfig({...uiConfig, scrollSensitivity: parseFloat(e.target.value)})}
                                        className="w-full accent-brand-400 h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Right Click Toggle */}
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Enable Right Click</label>
                                    <button 
                                        onClick={() => setUiConfig({...uiConfig, showRightClick: !uiConfig.showRightClick})}
                                        className={`w-8 h-4 rounded-full relative transition-colors ${uiConfig.showRightClick ? 'bg-brand-400' : 'bg-dark-600'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-md ${uiConfig.showRightClick ? 'left-4.5' : 'left-0.5'}`} />
                                    </button>
                                </div>
                             </div>

                        </div>
                    )}
                </div>

                {/* Base URL */}
                <div className="bg-dark-900 border border-dark-700 p-6 relative">
                    <h2 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-dark-700 pb-2">
                        <Database className="w-4 h-4 text-brand-400" /> Base URL
                    </h2>
                    <div>
                        <input 
                            type="text" 
                            value={config.baseUrl}
                            onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                            className="w-full bg-dark-800 border border-dark-600 text-white px-3 py-3 text-sm focus:border-brand-400 outline-none placeholder-zinc-600 font-mono"
                            placeholder="https://api.example.com/v1"
                        />
                        <p className="text-[10px] text-zinc-500 mt-2">Enter the root URL of your backend.</p>
                    </div>
                </div>

                {/* Security & Keys */}
                <div className="bg-dark-900 border border-dark-700 p-6 relative">
                    <h2 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-dark-700 pb-2">
                        <Key className="w-4 h-4 text-brand-400" /> Access Keys
                    </h2>
                    
                    <div className="space-y-4">
                        {/* Anime API Key */}
                        <div>
                            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Backend API Key</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={config.apiKey || ''}
                                    onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                                    className="w-full bg-dark-800 border border-dark-600 text-white px-3 py-3 text-sm focus:border-brand-400 outline-none placeholder-zinc-600 font-mono"
                                    placeholder="x-api-key"
                                />
                                <button 
                                    onClick={generateApiKey}
                                    className="px-4 bg-dark-800 border border-dark-600 hover:bg-brand-400 hover:text-black hover:border-brand-400 text-white transition-colors text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Settings */}
                <div className="bg-dark-900 border border-dark-700 p-6 relative">
                    <h2 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-dark-700 pb-2">
                        <Monitor className="w-4 h-4 text-brand-400" /> UI Customization
                    </h2>
                    
                    <div className="space-y-6">
                        {/* Slide Interval */}
                        <div>
                            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Hero Slide Interval (ms)</label>
                            <input 
                                type="number" 
                                value={uiConfig.slideInterval}
                                onChange={(e) => setUiConfig({...uiConfig, slideInterval: parseInt(e.target.value)})}
                                className="w-full bg-dark-800 border border-dark-600 text-white px-3 py-3 text-sm focus:border-brand-400 outline-none"
                            />
                        </div>

                         {/* Aspect Ratio Config */}
                         <div>
                            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 flex items-center gap-2">
                                <Layout className="w-3 h-3 text-brand-400" /> Hero Aspect Ratio
                            </label>
                            <select 
                                value={uiConfig.heroAspectRatio}
                                onChange={(e) => setUiConfig({...uiConfig, heroAspectRatio: e.target.value})}
                                className="w-full bg-dark-800 border border-dark-600 text-white px-3 py-3 text-sm focus:border-brand-400 outline-none uppercase font-bold"
                            >
                                <option value="16:9">16:9 Standard</option>
                                <option value="cinematic">Cinematic (80vh)</option>
                                <option value="fullscreen">Full Screen (100vh)</option>
                            </select>
                        </div>

                        {/* Poster Name / Title Customization */}
                        <div className="pt-4 border-t border-dark-700">
                             <h3 className="text-xs font-bold text-brand-400 uppercase mb-3 flex items-center gap-2">
                                <Type className="w-3 h-3" /> Poster Name (Title)
                             </h3>
                             
                             <div className="space-y-4">
                                {/* Toggle Visibility */}
                                <div className="flex items-center justify-between bg-dark-800 p-3 border border-dark-600">
                                    <label className="text-xs font-bold text-zinc-300 uppercase">Show Title</label>
                                    <button 
                                        onClick={() => setUiConfig({...uiConfig, showHeroTitle: !uiConfig.showHeroTitle})}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${uiConfig.showHeroTitle ? 'bg-brand-400' : 'bg-dark-600'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-md ${uiConfig.showHeroTitle ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                {/* Title Color */}
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Text Color</label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative overflow-hidden w-10 h-10 rounded border border-dark-600">
                                            <input 
                                                type="color" 
                                                value={uiConfig.heroTitleColor}
                                                onChange={(e) => setUiConfig({...uiConfig, heroTitleColor: e.target.value})}
                                                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-xs font-mono text-zinc-500 uppercase">{uiConfig.heroTitleColor}</span>
                                    </div>
                                </div>

                                {/* Title Size */}
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Font Size</label>
                                    <select 
                                        value={uiConfig.heroTitleFontSize}
                                        onChange={(e) => setUiConfig({...uiConfig, heroTitleFontSize: e.target.value})}
                                        className="w-full bg-dark-800 border border-dark-600 text-white px-3 py-3 text-sm focus:border-brand-400 outline-none uppercase font-bold"
                                    >
                                        <option value="small">Small</option>
                                        <option value="normal">Medium</option>
                                        <option value="large">Large (Default)</option>
                                        <option value="massive">Massive</option>
                                    </select>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Tester Column */}
            <div className="bg-dark-900 border border-dark-700 p-6 flex flex-col h-full">
                <h2 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-dark-700 pb-2">
                    <Code className="w-4 h-4 text-brand-400" /> API Tester
                </h2>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={testEndpoint}
                        onChange={(e) => setTestEndpoint(e.target.value)}
                        className="flex-1 bg-dark-800 border border-dark-600 text-white px-3 py-2 font-mono text-sm focus:border-brand-400 outline-none"
                        placeholder="/home"
                    />
                    <button 
                        onClick={runTest}
                        disabled={testResult?.status === 'loading'}
                        className="px-4 bg-dark-800 border border-dark-600 hover:bg-brand-400 hover:text-black hover:border-brand-400 text-white transition-colors"
                    >
                        {testResult?.status === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex-1 bg-black border border-dark-700 p-4 overflow-auto font-mono text-xs text-zinc-300 min-h-[300px] relative">
                    {testResult ? (
                        <>
                            <div className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold uppercase ${
                                testResult.status === 'success' ? 'bg-green-500/20 text-green-500' : 
                                testResult.status === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-500'
                            }`}>
                                {testResult.message}
                            </div>
                            <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600">
                            Enter an endpoint above to test...
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};