import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { LevelData, LevelItem } from '../../data/levels';
import { ItemIllustration } from '../ItemIllustration';
import { soundManager } from '../../utils/audio';

interface BubblePopGameProps {
  level: LevelData;
  onComplete: (errors: number) => void;
}

interface FloatingBubble {
  uid: string;
  item: LevelItem;
  bgGradient: string;
  borderColor: string;
  isPopping: boolean;
  isWrongWobble: boolean;
}

const BUBBLE_THEMES = [
  { bg: 'from-pink-200/80 to-rose-300/80', border: 'border-rose-400' },
  { bg: 'from-sky-200/80 to-blue-300/80', border: 'border-sky-400' },
  { bg: 'from-amber-200/80 to-yellow-300/80', border: 'border-amber-400' },
  { bg: 'from-emerald-200/80 to-green-300/80', border: 'border-emerald-400' },
  { bg: 'from-purple-200/80 to-indigo-300/80', border: 'border-purple-400' },
];

export const BubblePopGame: React.FC<BubblePopGameProps> = ({ level, onComplete }) => {
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Target item for the current question
  const currentTarget = level.items[currentTargetIndex];

  // Speak target word whenever question changes
  useEffect(() => {
    if (currentTarget) {
      // Delay slightly for smooth transition
      const timer = setTimeout(() => {
        soundManager.speakEnglish(currentTarget.word);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentTargetIndex, currentTarget]);

  // Refresh active bubbles for the question
  useEffect(() => {
    if (!currentTarget) return;

    // Pick candidates including the target item and other distractors
    const candidateList = [...level.items].sort(() => Math.random() - 0.5);

    const generatedBubbles: FloatingBubble[] = candidateList.map((item, idx) => {
      const theme = BUBBLE_THEMES[idx % BUBBLE_THEMES.length];
      return {
        uid: `${item.id}-${Date.now()}-${idx}`,
        item,
        bgGradient: theme.bg,
        borderColor: theme.border,
        isPopping: false,
        isWrongWobble: false,
      };
    });

    setBubbles(generatedBubbles);
  }, [currentTargetIndex, level.items]);

  const handleBubbleClick = (bubble: FloatingBubble, index: number) => {
    if (bubble.isPopping) return;

    if (bubble.item.id === currentTarget.id) {
      // Correct bubble popped!
      soundManager.playPop();
      soundManager.playSuccess();
      soundManager.speakEnglish(currentTarget.word);

      // Trigger pop animation
      const nextBubbles = [...bubbles];
      nextBubbles[index] = { ...bubble, isPopping: true };
      setBubbles(nextBubbles);

      setFeedback(`🎉 Benar! "${currentTarget.word}" (${currentTarget.translation})`);

      setTimeout(() => {
        setFeedback(null);
        if (currentTargetIndex + 1 < level.items.length) {
          setCurrentTargetIndex((prev) => prev + 1);
        } else {
          // Finished all questions in this level
          onComplete(errors);
        }
      }, 1100);
    } else {
      // Wrong bubble: wobble effect
      soundManager.playWrong();
      setErrors((prev) => prev + 1);

      const nextBubbles = [...bubbles];
      nextBubbles[index] = { ...bubble, isWrongWobble: true };
      setBubbles(nextBubbles);

      setFeedback(`Bukan itu, yuk dengarkan lagi kata "${currentTarget.word}"!`);

      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b, i) => (i === index ? { ...b, isWrongWobble: false } : b))
        );
        setTimeout(() => setFeedback(null), 1500);
      }, 600);
    }
  };

  const handleReplayPrompt = () => {
    soundManager.playClick();
    if (currentTarget) {
      soundManager.speakEnglish(currentTarget.word);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      
      {/* Top Header & Instruction */}
      <div className="bg-white/90 p-4 rounded-3xl border-3 border-rose-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-xl">🫧</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{level.title}</h2>
          </div>
          <p className="text-sm font-semibold text-slate-600">
            {level.instruction}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-slate-400">
            SOAL: {currentTargetIndex + 1} / {level.items.length}
          </span>
          <div className="w-32 h-3.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 mt-1">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentTargetIndex + 1) / level.items.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Big Audio Speaker Action Card */}
      {currentTarget && (
        <div className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 p-6 rounded-3xl border-4 border-amber-400 shadow-bubbly text-center space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-amber-900">
            DENGARKAN DAN TEMUKAN GELEMBUNG:
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReplayPrompt}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-black text-2xl sm:text-3xl rounded-2xl border-4 border-amber-400 shadow-bubbly active:shadow-bubbly-active transform hover:scale-105 active:scale-95 transition flex items-center gap-3 animate-pulse-subtle"
            >
              <Volume2 className="w-8 h-8 text-amber-600 animate-bounce" />
              <span>"{currentTarget.word}"</span>
            </button>
          </div>

          <p className="text-sm font-bold text-amber-900">
            Artinya: <span className="underline">{currentTarget.translation}</span> • Ketuk tombol untuk dengar ulang 🔊
          </p>
        </div>
      )}

      {/* Feedback Toast */}
      {feedback && (
        <div className="text-center animate-bounce">
          <span className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full font-black text-base shadow-bubbly border-2 border-rose-300 text-rose-700">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {feedback}
          </span>
        </div>
      )}

      {/* Floating Bubbles Pool */}
      <div className="bg-gradient-to-b from-sky-100/60 via-blue-50/40 to-amber-50/50 rounded-3xl border-4 border-sky-200 p-6 sm:p-10 min-h-[360px] flex flex-wrap items-center justify-center gap-6 sm:gap-8 relative overflow-hidden">
        
        {bubbles.map((bubble, index) => {
          if (bubble.isPopping) {
            return (
              <div
                key={bubble.uid}
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center scale-125 opacity-0 transition-all duration-300"
              >
                <div className="text-4xl animate-ping">💥</div>
              </div>
            );
          }

          return (
            <div
              key={bubble.uid}
              onClick={() => handleBubbleClick(bubble, index)}
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr ${bubble.bgGradient} border-4 ${bubble.borderColor} shadow-bubbly hover:shadow-2xl flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                index % 2 === 0 ? 'animate-float' : 'animate-float-reverse'
              } ${bubble.isWrongWobble ? 'animate-wobble ring-4 ring-rose-400' : ''}`}
            >
              {/* Bubble Highlight shine */}
              <div className="absolute top-3 left-4 w-7 h-3 rounded-full bg-white/70 -rotate-45 blur-[0.5px]"></div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center pointer-events-none drop-shadow-md">
                <ItemIllustration name={bubble.item.icon} size={68} />
              </div>

              <div className="text-center pointer-events-none mt-1">
                <div className="font-black text-slate-800 text-base leading-tight">
                  {bubble.item.word}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  {bubble.item.translation}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
