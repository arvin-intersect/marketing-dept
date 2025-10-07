import { BarChart3, Database, Link2, Rocket } from "lucide-react";

export const CreationCard = () => {
  return (
    <div className="rounded-lg p-8 flex flex-col bg-gradient-to-br from-gray-900 via-blue-900/40 to-gray-900 relative overflow-hidden border border-slate-800">
      <div className="text-center md:text-left z-10">
        <h2 className="text-3xl font-bold text-white mb-4">
          Intersect AI Marketing Suite
        </h2>
        <p className="text-muted-foreground mb-10 max-w-xl mx-auto md:mx-0">
          A self-sustaining ecosystem of AI agents that connect analytics, lead capture, nurture, and outreach — working together to grow autonomously.
        </p>
      </div>

      {/* This is the container for the visual diagram. It will be hidden on mobile screens. */}
      <div className="hidden md:flex relative min-h-[300px] w-full items-center justify-center mt-8">
        {/* Animated Connecting Curves SVG */}
        <svg
          viewBox="0 0 400 300"
          className="absolute top-0 left-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="galaxy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Paths with glow filter */}
          <g filter="url(#glow)" opacity="0.6">
            <path d="M 200,150 C 150,150 150,50 100,50" stroke="url(#galaxy-gradient)" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '0s' }} />
            <path d="M 200,150 C 250,150 250,50 300,50" stroke="url(#galaxy-gradient)" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '0.2s' }} />
            <path d="M 200,150 C 150,150 150,250 100,250" stroke="url(#galaxy-gradient)" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '0.4s' }} />
            <path d="M 200,150 C 250,150 250,250 300,250" stroke="url(#galaxy-gradient)" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '0.6s' }} />
          </g>
        </svg>

        {/* Central AI Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-center shadow-xl border-4 border-slate-900 animate-pulse-glow">
                AI Core
            </div>
        </div>
        
        {/* Satellite Components */}
        <div className="absolute top-0 left-[25%] -translate-x-1/2 flex flex-col items-center z-10">
          <div className="p-4 bg-gray-800 border border-slate-700 rounded-xl shadow-md">
            <BarChart3 size={28} className="text-blue-400" />
          </div>
          <span className="text-sm text-gray-300 font-medium mt-2">Pulse</span>
        </div>

        <div className="absolute top-0 right-[25%] translate-x-1/2 flex flex-col items-center z-10">
          <div className="p-4 bg-gray-800 border border-slate-700 rounded-xl shadow-md">
            <Rocket size={28} className="text-pink-500" />
          </div>
          <span className="text-sm text-gray-300 font-medium mt-2">Edge</span>
        </div>
        
        <div className="absolute bottom-0 left-[25%] -translate-x-1/2 flex flex-col items-center z-10">
          <div className="p-4 bg-gray-800 border border-slate-700 rounded-xl shadow-md">
            <Database size={28} className="text-emerald-400" />
          </div>
          <span className="text-sm text-gray-300 font-medium mt-2">Vault</span>
        </div>

        <div className="absolute bottom-0 right-[25%] translate-x-1/2 flex flex-col items-center z-10">
          <div className="p-4 bg-gray-800 border border-slate-700 rounded-xl shadow-md">
            <Link2 size={28} className="text-violet-400" />
          </div>
          <span className="text-sm text-gray-300 font-medium mt-2">Bridge</span>
        </div>
      </div>
    </div>
  );
};