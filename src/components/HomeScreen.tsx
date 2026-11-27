import React from 'react';
import { Play, Sparkles, Layers, Volume2, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HomeScreenProps {
  totalStars: number;
  unlockedCount: number;
  totalLevels: number;
  onStartAdventure: () => void;
  onOpenStageMap: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  totalStars,
  unlockedCount,
  totalLevels,
  onStartAdventure,
  onOpenStageMap,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Playful Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-orange-400/20 border-2 border-amber-300 text-amber-900 px-5 py-2 rounded-full font-bold text-sm sm:text-base animate-pulse-subtle shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
          <span>Game Edukasi Bahasa Inggris Seru untuk Anak SD</span>
          <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-amber-600 drop-shadow-sm">
              WordQuest
            </span>{' '}
            <span className="text-sky-500 underline decoration-sky-300 decoration-wavy decoration-2">
              Junior
            </span>
          </h1>
          <p className="text-slate-600 font-semibold text-lg sm:text-xl max-w-xl mx-auto">
            Jelajahi dunia kata Bahasa Inggris dengan permainan seret kartu, <strong>Klik Sambung</strong>, dan letuskan gelembung suara! 🎈
          </p>
        </div>

        {/* Mascot & Play Button Showcase */}
        <div className="relative py-4">
          <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto relative">
            <div className="absolute inset-0 bg-amber-300/40 rounded-full blur-2xl animate-pulse"></div>
            {/* Cute Mascot Avatar */}
            <div className="relative z-10 w-full h-full bg-gradient-to-tr from-amber-200 via-yellow-100 to-sky-100 rounded-full border-4 border-amber-400 shadow-bubbly flex items-center justify-center animate-float">
              <span className="text-7xl sm:text-8xl select-none filter drop-shadow-md">🦁</span>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full font-extrabold text-xs shadow-md border-2 border-white animate-pulse-subtle">
                Hi Friend!
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              soundManager.playSuccess();
              onStartAdventure();
            }}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xl rounded-3xl shadow-btn-yellow active:shadow-bubbly-active transform hover:-translate-y-1 active:translate-y-1 transition duration-150 flex items-center justify-center gap-3 border-2 border-amber-300"
          >
            <Play className="w-7 h-7 fill-amber-950" />
            <span>Mulai Petualangan!</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenStageMap();
            }}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xl rounded-3xl border-4 border-slate-200 shadow-card-kid active:shadow-bubbly-active transform hover:-translate-y-0.5 active:translate-y-1 transition flex items-center justify-center gap-3"
          >
            <Layers className="w-6 h-6 text-sky-500" />
            <span>Peta Level ({unlockedCount}/{totalLevels})</span>
          </button>
        </div>

        {/* Feature Cards Grid (3 Gameplay Modes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          <div className="bg-white/90 p-5 rounded-3xl border-3 border-sky-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl mb-3">
              🎒
            </div>
            <h3 className="font-extrabold text-lg text-slate-800">1. Drag & Drop</h3>
            <p className="text-slate-500 text-sm mt-1">
              Tarik benda ke siluet yang tepat dengan animasi lentur & pengucapan suara.
            </p>
          </div>

          <div className="bg-white/90 p-5 rounded-3xl border-3 border-violet-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl mb-3">
              🔗
            </div>
            <h3 className="font-extrabold text-lg text-slate-800">2. Klik Sambung</h3>
            <p className="text-slate-500 text-sm mt-1">
              Sambungkan gambar ke kata Bahasa Inggris dengan garis klik satu-satu!
            </p>
          </div>

          <div className="bg-white/90 p-5 rounded-3xl border-3 border-rose-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl mb-3">
              🫧
            </div>
            <h3 className="font-extrabold text-lg text-slate-800">3. Bubble Pop</h3>
            <p className="text-slate-500 text-sm mt-1">
              Dengarkan pelafalan suara lalu letuskan gelembung kata yang benar sebelum melayang!
            </p>
          </div>
        </div>

        {/* Progress Quick Banner */}
        <div className="bg-amber-100/70 border-2 border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-amber-900">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span>Total Bintang Terkumpul: <strong>{totalStars}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-700" />
            <span>Dilengkapi Suara Pelafalan Asli (Text-to-Speech)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
