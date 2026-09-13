import { Cloud } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center noise">
      <div className="relative">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center shadow-lg shadow-bronze-700/20">
          <Cloud className="w-7 h-7 text-ink-950" strokeWidth={2.5} />
        </div>
        <div className="absolute -inset-1.5 border border-bronze-500/20 rounded-xl animate-ping" />
      </div>
      <p className="text-white/30 mt-6 text-sm animate-pulse font-mono tracking-wider">Connecting to infrastructure...</p>
    </div>
  );
}
