import React, { useState, useRef, useEffect } from 'react';
import { Check, Volume2, Sparkles, X } from 'lucide-react';
import { LevelData, LevelItem } from '../../data/levels';
import { ItemIllustration } from '../ItemIllustration';
import { soundManager } from '../../utils/audio';

interface ConnectLineGameProps {
  level: LevelData;
  onComplete: (errors: number) => void;
}

interface Connection {
  leftId: string;
  rightId: string;
  status: 'correct' | 'wrong' | 'pending';
}

export const ConnectLineGame: React.FC<ConnectLineGameProps> = ({ level, onComplete }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement>>({});

  // Shuffle right side items for variety
  const rightItems = React.useMemo(() => {
    return [...level.items].sort(() => Math.random() - 0.5);
  }, [level.items]);

  // Calculate line positions
  const getLinePath = (leftId: string, rightId: string) => {
    const leftEl = leftRefs.current[leftId];
    const rightEl = rightRefs.current[rightId];
    const svg = svgRef.current;

    if (!leftEl || !rightEl || !svg) return '';

    const leftRect = leftEl.getBoundingClientRect();
    const rightRect = rightEl.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const startX = leftRect.right - svgRect.left;
    const startY = leftRect.top + leftRect.height / 2 - svgRect.top;
    const endX = rightRect.left - svgRect.left;
    const endY = rightRect.top + rightRect.height / 2 - svgRect.top;

    const midX = (startX + endX) / 2;
    const cp1x = startX + (midX - startX) * 0.5;
    const cp2x = endX - (endX - midX) * 0.5;

    return `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
  };

  // Update SVG lines on render
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.style.opacity = '1';
    }
  }, [connections, selectedLeft]);

  const handleLeftClick = (item: LevelItem) => {
    // If already connected correctly, ignore
    const existingConnection = connections.find(c => c.leftId === item.id && c.status === 'correct');
    if (existingConnection) return;

    soundManager.playClick();
    soundManager.speakEnglish(item.word);
    setSelectedLeft(item.id);
  };

  const handleRightClick = (item: LevelItem) => {
    if (!selectedLeft) return;

    const leftItem = level.items.find(i => i.id === selectedLeft);
    if (!leftItem) return;

    const isMatch = leftItem.id === item.id;

    if (isMatch) {
      // Correct connection!
      soundManager.playSuccess();
      soundManager.speakEnglish(leftItem.word);

      setConnections(prev => [
        ...prev.filter(c => c.leftId !== selectedLeft && c.rightId !== item.id),
        { leftId: selectedLeft, rightId: item.id, status: 'correct' }
      ]);

      setFeedback({
        text: `Hebat! ${leftItem.word} (${leftItem.translation})`,
        color: 'text-emerald-600'
      });
      setTimeout(() => setFeedback(null), 2000);

      const nextCount = connections.filter(c => c.status === 'correct').length + 1;
      if (nextCount === level.items.length) {
        setTimeout(() => onComplete(errors), 800);
      }
    } else {
      // Wrong connection
      soundManager.playWrong();
      setErrors(prev => prev + 1);

      const wrongConnection: Connection = { leftId: selectedLeft, rightId: item.id, status: 'wrong' };
      setConnections(prev => [...prev, wrongConnection]);

      setFeedback({
        text: 'Ayo coba sambung yang cocok!',
        color: 'text-rose-600'
      });

      // Remove wrong connection after animation
      setTimeout(() => {
        setConnections(prev => prev.filter(c => c !== wrongConnection));
        setTimeout(() => setFeedback(null), 1000);
      }, 600);
    }

    setSelectedLeft(null);
  };

  const handleReplayAudio = (word: string) => {
    soundManager.playClick();
    soundManager.speakEnglish(word);
  };

  const isLeftConnected = (id: string) => connections.some(c => c.leftId === id && c.status === 'correct');
  const isRightConnected = (id: string) => connections.some(c => c.rightId === id && c.status === 'correct');

  const progressCount = connections.filter(c => c.status === 'correct').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Header & Instruction */}
      <div className="bg-white/90 p-4 rounded-3xl border-3 border-violet-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-xl">🔗</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{level.title}</h2>
          </div>
          <p className="text-sm font-semibold text-slate-600">
            {level.instruction}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-slate-400">
            TERHUBUNG: {progressCount} / {level.items.length}
          </span>
          <div className="w-32 h-3.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 mt-1">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(progressCount / level.items.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="text-center animate-bounce">
          <span className={`inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full font-black text-base shadow-bubbly border-2 border-violet-200 ${feedback.color}`}>
            <Sparkles className="w-5 h-5 text-violet-500" />
            {feedback.text}
          </span>
        </div>
      )}

      {/* Main Game Area */}
      <div className="relative">
        {/* SVG Lines Layer */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
          style={{ opacity: 0 }}
        >
          {connections.map((conn, idx) => {
            const path = getLinePath(conn.leftId, conn.rightId);
            if (!path) return null;

            const isWrong = conn.status === 'wrong';
            const isPending = conn.status === 'pending' && conn.leftId === selectedLeft;

            return (
              <path
                key={`${conn.leftId}-${conn.rightId}-${idx}`}
                d={path}
                stroke={isWrong ? '#fb7185' : isPending ? level.themeColor : '#4ade80'}
                strokeWidth={isWrong ? 4 : 5}
                strokeDasharray={isWrong ? '8,4' : 'none'}
                strokeLinecap="round"
                fill="none"
                className={isWrong ? 'animate-wobble' : 'animate-draw'}
                style={{
                  filter: isWrong ? 'drop-shadow(0 0 2px #fb7185)' : 'drop-shadow(0 0 3px #4ade80)',
                }}
              />
            );
          })}

          {/* Preview line while selecting */}
          {selectedLeft && (
            <path
              d={(() => {
                const leftEl = leftRefs.current[selectedLeft];
                const svg = svgRef.current;
                if (!leftEl || !svg) return '';
                const leftRect = leftEl.getBoundingClientRect();
                const svgRect = svg.getBoundingClientRect();
                const startX = leftRect.right - svgRect.left;
                const startY = leftRect.top + leftRect.height / 2 - svgRect.top;
                // Draw to mouse center-ish as hint
                return `M ${startX} ${startY} L ${startX + 100} ${startY}`;
              })()}
              stroke={level.themeColor}
              strokeWidth={3}
              strokeDasharray="6,4"
              strokeLinecap="round"
              fill="none"
              className="animate-dash"
              style={{ filter: `drop-shadow(0 0 3px ${level.themeColor})` }}
            />
          )}
        </svg>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start relative z-20">
          {/* LEFT COLUMN - Images */}
          <div className="space-y-3">
            <div className="text-center font-extrabold text-sm text-violet-800 mb-2 uppercase tracking-wider">
              Gambar / Ilustrasi
            </div>
            <div className="space-y-3" role="list" aria-label="Pilih gambar">
              {level.items.map((item) => {
                const connected = isLeftConnected(item.id);
                const selected = selectedLeft === item.id;
                const wrongConnection = connections.find(c => c.leftId === item.id && c.status === 'wrong');

                return (
                  <div
                    key={item.id}
                    ref={el => { leftRefs.current[item.id] = el!; }}
                    onClick={() => handleLeftClick(item)}
                    className={`group relative w-full h-24 sm:h-28 rounded-3xl border-4 flex items-center justify-center gap-4 p-3 transition-all duration-200 cursor-pointer select-none touch-none ${
                      connected
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                        : selected
                        ? `bg-${level.themeColor.replace('#', '')}-100/80 border-${level.themeColor.replace('#', '')}-500 scale-[1.02] shadow-bubbly ring-4 ring-${level.themeColor.replace('#', '')}-200`
                        : 'bg-white/80 border-slate-300/80 hover:border-violet-400 hover:shadow-bubbly hover:-translate-x-1'
                    }`}
                    role="listitem"
                    aria-label={`${item.word} (${item.translation})${connected ? ', sudah disambungkan' : ''}`}
                    aria-selected={selected}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLeftClick(item); } }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0">
                      <ItemIllustration name={item.icon} size={72} />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-extrabold text-lg sm:text-xl text-slate-800 leading-tight truncate">
                        {item.word}
                      </div>
                      <div className="text-xs font-semibold text-slate-400 truncate">
                        {item.translation}
                      </div>
                    </div>

                    {connected && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-full shadow-md animate-bounce-in">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}

                    {selected && !connected && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Volume2 className={`w-6 h-6 text-${level.themeColor.replace('#', '')}-600 animate-bounce`} />
                      </div>
                    )}

                    {wrongConnection && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white p-1.5 rounded-full shadow-md animate-wobble">
                        <X className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN - Words */}
          <div className="space-y-3">
            <div className="text-center font-extrabold text-sm text-violet-800 mb-2 uppercase tracking-wider">
              Kata Bahasa Inggris
            </div>
            <div className="space-y-3" role="list" aria-label="Pilih kata yang cocok">
              {rightItems.map((item) => {
                const connected = isRightConnected(item.id);
                const wrongConnection = connections.find(c => c.rightId === item.id && c.status === 'wrong');

                return (
                  <div
                    key={item.id}
                    ref={el => { rightRefs.current[item.id] = el!; }}
                    onClick={() => handleRightClick(item)}
                    className={`group relative w-full h-24 sm:h-28 rounded-3xl border-4 flex items-center justify-center gap-4 p-3 transition-all duration-200 cursor-pointer select-none touch-none text-left ${
                      connected
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                        : 'bg-white/80 border-slate-300/80 hover:border-violet-400 hover:shadow-bubbly hover:translate-x-1'
                    }`}
                    role="listitem"
                    aria-label={`${item.word} (${item.translation})${connected ? ', sudah disambungkan' : ''}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRightClick(item); } }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReplayAudio(item.word); }}
                        className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-100 text-violet-600 hover:bg-violet-200 transition flex items-center justify-center shadow-sm"
                        aria-label={`Dengarkan ${item.word}`}
                        title="Dengarkan pengucapan"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div className="min-w-0">
                        <div className="font-extrabold text-lg sm:text-xl text-slate-800 leading-tight truncate">
                          {item.word}
                        </div>
                        <div className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full inline-block">
                          {item.translation}
                        </div>
                      </div>
                    </div>

                    {connected && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-full shadow-md animate-bounce-in">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}

                    {wrongConnection && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white p-1.5 rounded-full shadow-md animate-wobble">
                        <X className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Celebration */}
      {progressCount === level.items.length && progressCount > 0 && (
        <div className="text-center animate-bounce-in py-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-bubbly border-2 border-white">
            <Sparkles className="w-6 h-6 fill-white animate-pulse" />
            <span>Semua Terhubung! Luar Biasa! 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};