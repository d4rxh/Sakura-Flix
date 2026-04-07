import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, Move, ArrowUpFromLine, Mouse } from 'lucide-react';

export const Trackpad: React.FC = () => {
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 256, h: 192 });
  const [config, setConfig] = useState({ 
      scrollSensitivity: 2,
      invertScroll: false,
      showRightClick: false 
  });
  
  const prevHoverRef = useRef<Element | null>(null);
  
  // Load config
  useEffect(() => {
    const checkConfig = () => {
        try {
            const stored = localStorage.getItem('ui_config');
            if (stored) {
                const parsed = JSON.parse(stored);
                setIsEnabled(parsed.enableTrackpad === true);
                if (parsed.trackpadWidth) {
                    setDimensions({ w: parsed.trackpadWidth, h: parsed.trackpadHeight });
                }
                setConfig({
                    scrollSensitivity: parsed.scrollSensitivity || 2,
                    invertScroll: parsed.invertScroll || false,
                    showRightClick: parsed.showRightClick || false
                });
            }
        } catch(e) {}
    };
    
    checkConfig();
    window.addEventListener('storage', checkConfig);
    window.addEventListener('ui_config_update', checkConfig);
    
    return () => {
        window.removeEventListener('storage', checkConfig);
        window.removeEventListener('ui_config_update', checkConfig);
    };
  }, []);

  // Hover Simulation Logic
  useEffect(() => {
    if (!isEnabled) return;

    // We briefly hide the cursor to see what's under it, then show it back
    const cursor = document.getElementById('virtual-cursor');
    if (cursor) cursor.style.display = 'none';
    const elem = document.elementFromPoint(cursorPos.x, cursorPos.y);
    if (cursor) cursor.style.display = 'block';

    if (elem) {
        // Dispatch mousemove to trigger JS based hovers that rely on movement
        // This makes hover effects much more responsive
        elem.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: cursorPos.x,
            clientY: cursorPos.y
        }));
    }

    if (elem !== prevHoverRef.current) {
        if (prevHoverRef.current) {
            // Dispatch mouseleave/mouseout to old element
            prevHoverRef.current.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window }));
            prevHoverRef.current.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, cancelable: true, view: window }));
        }

        if (elem) {
            // Dispatch mouseenter/mouseover to new element
            elem.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
            elem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
        }

        prevHoverRef.current = elem;
    }
  }, [cursorPos, isEnabled]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // Stop event from passing through to elements behind
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;

    // Check if in scroll zone (Right 15% of trackpad)
    if (x > rect.width * 0.85) {
        setIsScrolling(true);
    } else {
        setIsDragging(true);
    }

    setLastTouch({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!lastTouch) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    if (isScrolling) {
        // SCROLL MODE
        const deltaY = (currentY - lastTouch.y) * config.scrollSensitivity;
        window.scrollBy(0, config.invertScroll ? -deltaY : deltaY);
    } else {
        // CURSOR MODE
        const deltaX = (currentX - lastTouch.x) * 2.5; 
        const deltaY = (currentY - lastTouch.y) * 2.5;

        setCursorPos(prev => ({
            x: Math.min(Math.max(0, prev.x + deltaX), window.innerWidth),
            y: Math.min(Math.max(0, prev.y + deltaY), window.innerHeight)
        }));
    }

    setLastTouch({ x: currentX, y: currentY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    setIsScrolling(false);
    setLastTouch(null);
  };

  const handleLeftClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    triggerClick('click');
  };

  const handleRightClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    triggerClick('contextmenu');
  };

  const triggerClick = (eventType: 'click' | 'contextmenu') => {
    const cursor = document.getElementById('virtual-cursor');
    if(cursor) cursor.style.display = 'none';
    const element = document.elementFromPoint(cursorPos.x, cursorPos.y);
    if(cursor) cursor.style.display = 'block';

    if (element) {
        if (eventType === 'click' && element instanceof HTMLElement) {
            element.click();
            // Focus management for better UX
            if (document.activeElement instanceof HTMLElement && document.activeElement.tagName !== 'INPUT') {
                 document.activeElement.blur();
            }
        } else {
            // Right Click Logic
            element.dispatchEvent(new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: cursorPos.x,
                clientY: cursorPos.y,
                button: 2,
                buttons: 2
            }));
        }
    }
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Virtual Cursor */}
      <div 
        id="virtual-cursor"
        className="fixed z-[9999] pointer-events-none transition-transform duration-75"
        style={{ 
            left: 0, 
            top: 0, 
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` 
        }}
      >
        <MousePointer2 className={`w-6 h-6 fill-brand-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)] ${isScrolling ? 'text-white' : 'text-brand-400'}`} />
      </div>

      {/* Trackpad Area */}
      <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end gap-2 touch-none select-none">
         
         {/* Status Indicators */}
         <div className="flex gap-2">
            {isScrolling && (
                <div className="text-[10px] font-bold text-black bg-brand-400 uppercase tracking-widest px-2 py-1 border border-brand-400 rounded-sm pointer-events-none animate-pulse">
                    Scrolling
                </div>
            )}
            <div className="text-[10px] font-bold text-zinc-500 bg-black/90 uppercase tracking-widest px-2 py-1 border border-dark-700 rounded-sm pointer-events-none">
                Trackpad Active
            </div>
         </div>
         
         <div 
            className="bg-black/90 border border-dark-600 rounded-xl backdrop-blur-md shadow-2xl flex flex-col overflow-hidden relative transition-colors"
            style={{ width: `${dimensions.w}px`, height: `${dimensions.h}px` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
         >
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUs 2NTUsIDAuMSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />
            
            <div className="flex flex-1 relative">
                {/* Main Touch Area */}
                <div className="flex-1 flex items-center justify-center text-zinc-700 pointer-events-none">
                    <Move className="w-8 h-8 opacity-20" />
                </div>

                {/* Scroll Zone Indicator */}
                <div className="w-[15%] h-full border-l border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1">
                    <ArrowUpFromLine className="w-3 h-3 text-zinc-600" />
                    <div className="w-0.5 h-8 bg-zinc-800 rounded-full"></div>
                </div>
            </div>

            {/* Buttons */}
            <div className="h-14 border-t border-white/10 flex divide-x divide-white/10">
                <button 
                    className="flex-1 bg-white/5 active:bg-brand-400/20 transition-colors flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider hover:text-white group"
                    onMouseDown={handleLeftClick}
                    onTouchStart={handleLeftClick}
                >
                    <Mouse className="w-4 h-4 mr-2 group-active:scale-90 transition-transform" /> Left
                </button>
                {config.showRightClick && (
                    <button 
                        className="flex-1 bg-white/5 active:bg-brand-400/20 transition-colors flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider hover:text-white group"
                        onMouseDown={handleRightClick}
                        onTouchStart={handleRightClick}
                    >
                        <MousePointer2 className="w-4 h-4 mr-2 group-active:scale-90 transition-transform" /> Right
                    </button>
                )}
            </div>
         </div>
      </div>
    </>
  );
};