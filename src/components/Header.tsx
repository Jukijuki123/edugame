import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Star, ArrowLeft, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentView: 'home' | 'map' | 'game';
  levelTitle?: string;
  totalStars: number;
  onGoBack: () => void;
  onRestartLevel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  levelTitle,
  totalStars,
  onGoBack,
  onRestartLevel,
}) => {
  const [isMuted, setIsMuted] = useState(!soundManager.isSoundEnabled());

  useEffect(() => {
    setIsMuted(!soundManager.isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const enabled = soundManager.toggleSound();
    setIsMuted(!enabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-amber-200/60 px-4 py-3 sm:px-6 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left Side: Back button or Logo */}
        <div className="flex items-center gap-3">
          {currentView !== 'home' ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onGoBack();
              }}
              className="flex items-center gap-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl font-bold shadow-bubbly active:shadow-bubbly-active transform active:translate-y-1 transition"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-amber-900 stroke-[3]" />
              <span className="hidden sm:inline text-sm">Kembali</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🎒</span>
              <div className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                WordQuest <span className="text-sky-500">Junior</span>
              </div>
            </div>
          )}

          {levelTitle && (
            <div className="hidden md:flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-700">Misi:</span>
              <span className="font-bold text-slate-800 text-sm">{levelTitle}</span>
            </div>
          )}
        </div>

        {/* Right Side: Level reset, Sound toggle, Stars Counter */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {currentView === 'game' && onRestartLevel && (
            <button
              onClick={() => {
                soundManager.playClick();
                onRestartLevel();
              }}
              className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl border-2 border-rose-200 shadow-sm active:scale-95 transition"
              title="Ulangi Level Ini"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {/* Sound Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-2xl border-2 shadow-sm transition active:scale-95 ${
              isMuted
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            aria-label="Pengaturan Suara"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Star Counter */}
          <div className="flex items-center gap-2 bg-amber-400/20 border-2 border-amber-400 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500 stroke-[2] animate-pulse-subtle" />
            <span className="font-extrabold text-lg text-amber-900 leading-none">{totalStars}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
