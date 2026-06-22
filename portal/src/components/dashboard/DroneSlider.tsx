"use client";

import React, { useState, useRef } from 'react';

export function DroneSlider({ beforeImage, afterImage, beforeLabel, afterLabel }: { beforeImage: string, afterImage: string, beforeLabel: string, afterLabel: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-800">Drone Progress Verification (Module 5)</h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">High-Res Orthomosaic</span>
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden cursor-ew-resize select-none"
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
        onTouchMove={handleDrag}
        onClick={handleDrag}
      >
        {/* After Image (Background) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${afterImage})` }}
        />
        
        {/* Before Image (Clipped) */}
        <div 
          className="absolute inset-0 bg-cover bg-center border-r-[3px] border-white shadow-[1px_0_4px_rgba(0,0,0,0.5)]"
          style={{ 
            backgroundImage: `url(${beforeImage})`,
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        />

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg z-10"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm z-0">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm z-0">
          {afterLabel}
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-4 text-center">Drag the slider to compare baseline satellite imagery with the latest drone orthomosaic scan.</p>
    </div>
  );
}
