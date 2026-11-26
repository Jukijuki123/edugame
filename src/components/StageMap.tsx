import React from 'react';
import { Star, Lock, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import { LevelData } from '../data/levels';
import { soundManager } from '../utils/audio';

interface StageMapProps {
  levels: LevelData[];
  unlockedLevels: string[];
  starsMap: Record<string, number>;
  onSelectLevel: (level: LevelData) => void;
  onResetProgress: () => void;
}

export const StageMap: React.FC<StageMapProps> = ({
  levels,
  unlockedLevels,
  starsMap,
  onSelectLevel,
  onResetProgress,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
          🗺️ Peta Petualangan Kata
        </h2>
        <p className="text-slate-600 font-semibold text-base sm:text-lg">
          Selesaikan setiap tantangan untuk membuka level berikutnya dan kumpulkan semua bintang emas!
        </p>
      </div>

      {/* Levels list / journey track */}
      <div className="space-y-6 relative">
        {/* Subtle connecting vertical line */}
        <div className="absolute left-8 sm:left-1/2 top-10 bottom-10 w-2 -translate-x-1/2 bg-amber-200/70 -z-10 rounded-full border border-amber-300"></div>

        {levels.map((level, index) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          const earnedStars = starsMap[level.id] || 0;
          const isEven = index % 2 === 0;

          // Mode badge icon
          const modeIcon =
            level.mode === 'drag-and-drop' ? '🎒' : level.mode === 'matching' ? '🃏' : level.mode === 'connect-line' ? '🔗' : '🫧';

          return (
            <div
              key={level.id}
              className={`flex flex-col sm:flex-row items-center gap-4 ${
                isEven ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Level Card */}
              <div
                onClick={() => {
                  if (isUnlocked) {
                    soundManager.playClick();
                    onSelectLevel(level);
                  } else {
                    soundManager.playWrong();
                  }
                }}
                className={`w-full sm:w-[calc(50%-2rem)] p-5 rounded-3xl border-4 transition-all duration-200 ${
                  isUnlocked
                    ? 'bg-white cursor-pointer hover:-translate-y-1 shadow-card-kid hover:shadow-bubbly border-amber-300 hover:border-amber-400'
                    : 'bg-slate-100/90 border-slate-300 opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-inner"
                      style={{ backgroundColor: isUnlocked ? level.themeColor : '#94A3B8' }}
                    >
                      {isUnlocked ? modeIcon : <Lock className="w-7 h-7 text-white" />}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Level {level.levelNumber} • {level.category}
                      </span>
                      <h3 className="text-xl font-black text-slate-800">{level.title}</h3>
                    </div>
                  </div>

                  {/* Mode tag */}
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {level.mode === 'drag-and-drop'
                      ? 'Drag & Drop'
                      : level.mode === 'matching'
                      ? 'Kartu Balik'
                      : level.mode === 'connect-line'
                      ? 'Klik Sambung'
                      : 'Bubble Pop'}
                  </span>
                </div>

                <p className="mt-3 text-slate-600 text-sm font-medium">{level.instruction}</p>

                {/* Card footer: Stars & Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {/* Star indicators */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-5 h-5 ${
                          isUnlocked && starIdx <= earnedStars
                            ? 'fill-amber-400 text-amber-500 animate-pulse-subtle'
                            : 'fill-slate-200 text-slate-300'
                        }`}
                      />
                    ))}
                    {earnedStars > 0 && (
                      <span className="text-xs font-extrabold text-amber-700 ml-1">
                        {earnedStars}/3
                      </span>
                    )}
                  </div>

                  {isUnlocked ? (
                    <button
                      className="px-4 py-2 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm rounded-2xl shadow-btn-yellow active:shadow-bubbly-active transform active:translate-y-0.5 flex items-center gap-1.5 transition"
                    >
                      <Play className="w-4 h-4 fill-amber-950" />
                      <span>{earnedStars > 0 ? 'Main Lagi' : 'Mulai'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Lock className="w-4 h-4" />
                      <span>Selesaikan level sebelumnya</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Central Level Milestone Node (Desktop only) */}
              <div className="hidden sm:flex w-14 h-14 rounded-full border-4 border-white shadow-bubbly items-center justify-center font-black text-lg text-white z-10"
                style={{ backgroundColor: isUnlocked ? (earnedStars > 0 ? '#10B981' : '#F59E0B') : '#94A3B8' }}
              >
                {earnedStars > 0 ? <CheckCircle2 className="w-8 h-8 text-white" /> : level.levelNumber}
              </div>

              {/* Spacer on the other side */}
              <div className="hidden sm:block w-[calc(50%-2rem)]"></div>
            </div>
          );
        })}
      </div>

      {/* Footer Tools: Reset Progress */}
      <div className="pt-8 text-center">
        <button
          onClick={() => {
            if (window.confirm('Apakah kamu yakin ingin mengulang semua level dari awal? Bintangmu akan direset.')) {
              onResetProgress();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progres Permainan</span>
        </button>
      </div>
    </div>
  );
};
