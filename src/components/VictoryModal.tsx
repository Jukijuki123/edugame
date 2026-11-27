import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, Map, Trophy, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VictoryModalProps {
  stars: number;
  levelTitle: string;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onGoToMap: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stars,
  levelTitle,
  hasNextLevel,
  onNextLevel,
  onRetry,
  onGoToMap,
}) => {
  useEffect(() => {
    // Play celebratory sound
    soundManager.playFanfare();

    // Trigger colorful confetti shower
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#FACC15', '#38BDF8', '#4ADE80', '#FB7185', '#A855F7'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const getPraiseMessage = () => {
    if (stars === 3) {
      return {
        title: 'LUAR BIASA! 🌟🌟🌟',
        subtitle: 'Kamu menjawab semua soal dengan sangat sempurna!',
      };
    }
    if (stars === 2) {
      return {
        title: 'HEBAT SEKALI! 🌟🌟',
        subtitle: 'Bagus sekali! Kamu sudah hampir sempurna!',
      };
    }
    return {
      title: 'BAGUS! TERUS MAJU! 🌟',
      subtitle: 'Semangat pantang menyerah! Terus berlatih agar makin pintar!',
    };
  };

  const praise = getPraiseMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center border-4 border-amber-300 shadow-bubbly transform scale-100 transition-all space-y-6">
        
        {/* Top Trophy Badge */}
        <div className="relative -mt-16 mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-bubbly flex items-center justify-center">
          <Trophy className="w-12 h-12 text-amber-950 fill-amber-300" />
          <Sparkles className="absolute -top-1 -right-1 w-7 h-7 text-yellow-400 fill-white animate-spin" />
        </div>

        {/* Title & Level */}
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            Tantangan Selesai
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {praise.title}
          </h2>
          <p className="text-slate-500 font-semibold text-sm">
            {levelTitle} • {praise.subtitle}
          </p>
        </div>

        {/* Big 3 Stars Award */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`transition-all duration-300 transform ${
                  isEarned
                    ? 'scale-110 drop-shadow-md animate-pop-in'
                    : 'scale-90 opacity-40'
                }`}
                style={{ animationDelay: `${starIdx * 0.15}s` }}
              >
                <Star
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${
                    isEarned
                      ? 'fill-amber-400 text-amber-500 stroke-[2]'
                      : 'fill-slate-200 text-slate-300'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {hasNextLevel ? (
            <button
              onClick={() => {
                soundManager.playSuccess();
                onNextLevel();
              }}
              className="w-full py-4 bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-emerald-950 font-black text-lg rounded-2xl shadow-btn-grass active:shadow-bubbly-active transform hover:-translate-y-0.5 active:translate-y-1 transition flex items-center justify-center gap-2 border-2 border-emerald-300"
            >
              <span>Level Berikutnya</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          ) : (
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-900 font-extrabold text-sm">
              🎉 Selamat! Kamu telah menamatkan semua level!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onRetry();
              }}
              className="py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold rounded-2xl border-2 border-amber-300 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onGoToMap();
              }}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Map className="w-4 h-4 text-sky-600" />
              <span>Peta Level</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
