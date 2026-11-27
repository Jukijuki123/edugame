import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  status: 'correct' | 'wrong';
}

interface FeedbackMessage {
  text: string;
  type: 'success' | 'error';
}

export const ConnectLineGame: React.FC<ConnectLineGameProps> = ({ level, onComplete }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement>>({});

  // Shuffle right side items for variety (stable per session)
  const rightItems = useMemo(() => {
    return [...level.items].sort(() => Math.random() - 0.5);
  }, [level.items]);

  // Theme color helpers
  const themeColor = level.themeColor;
  const themeColorLight = `${themeColor}1A`; // 10% opacity
  const themeColorMedium = `${themeColor}4D`; // 30% opacity
  const themeColorStrong = `${themeColor}CC`; // 80% opacity

  // Calculate line positions using quadratic bezier curve
  const getLinePath = (leftId: string, rightId: string): string => {
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

  // Trigger SVG layer visibility after layout
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.style.opacity = '1';
    }
  }, [connections, selectedLeft]);

  const handleLeftClick = (item: LevelItem) => {
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
      soundManager.playSuccess();
      soundManager.speakEnglish(leftItem.word);

      setConnections(prev => [
        ...prev.filter(c => c.leftId !== selectedLeft && c.rightId !== item.id),
        { leftId: selectedLeft, rightId: item.id, status: 'correct' }
      ]);

      setFeedback({
        text: `Hebat! ${leftItem.word} (${leftItem.translation})`,
        type: 'success'
      });
      setTimeout(() => setFeedback(null), 2000);

      const nextCount = connections.filter(c => c.status === 'correct').length + 1;
      if (nextCount === level.items.length) {
        setTimeout(() => onComplete(errors), 800);
      }
    } else {
      soundManager.playWrong();
      setErrors(prev => prev + 1);

      const wrongConnection: Connection = { leftId: selectedLeft, rightId: item.id, status: 'wrong' };
      setConnections(prev => [...prev, wrongConnection]);

      setFeedback({
        text: 'Ayo coba sambung yang cocok!',
        type: 'error'
      });

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

  // Dynamic className builders
  const getLeftItemClassName = (connected: boolean, selected: boolean) => {
    const base = 'group relative w-full h-24 sm:h-28 rounded-3xl border-4 flex items-center justify-center gap-4 p-3 transition-all duration-200 ease-out cursor-pointer select-none touch-none focus-visible:outline-none focus-visible:ring-4';
    if (connected) return `${base} bg-emerald-50/90 border-emerald-400 shadow-sm`;
    if (selected) return `${base} bg-[${themeColorLight}] border-[${themeColorStrong}] scale-[1.02] shadow-bubbly ring-4 ring-[${themeColorMedium}]`;
    return `${base} bg-white/80 border-slate-300/80 hover:border-[${themeColor}] hover:shadow-bubbly hover:-translate-x-1`;
  };

  const getRightItemClassName = (connected: boolean) => {
    const base = 'group relative w-full h-24 sm:h-28 rounded-3xl border-4 flex items-center justify-center gap-4 p-3 transition-all duration-200 ease-out cursor-pointer select-none touch-none text-left focus-visible:outline-none focus-visible:ring-4';
    if (connected) return `${base} bg-emerald-50/90 border-emerald-400 shadow-sm`;
    return `${base} bg-white/80 border-slate-300/80 hover:border-[${themeColor}] hover:shadow-bubbly hover:translate-x-1`;
  };

  const headerBorderStyle = { borderColor: themeColorStrong };
  const columnLabelStyle = { color: themeColorStrong };
  const progressBarStyle = { background: `linear-gradient(90deg, ${themeColor}, ${themeColor})` };
  const celebrationStyle = { background: `linear-gradient(135deg, ${themeColor}, ${themeColor}DD)` };
  const speakerButtonStyle = { backgroundColor: themeColorLight, color: themeColor };
  const translationBadgeStyle = { color: themeColor, backgroundColor: themeColorLight };
  const previewLineFilter = `drop-shadow(0 0 3px ${themeColor})`;
  const correctLineFilter = 'drop-shadow(0 0 3px #10B981)';
  const wrongLineFilter = 'drop-shadow(0 0 2px #FB7185)';
  const feedbackToastBorder = feedback?.type === 'success' ? 'border-emerald-300 text-emerald-700' : 'border-rose-300 text-rose-700';
  const feedbackSparkleColor = feedback?.type === 'success' ? '#10B981' : '#FB7185';
  const speakerIconStyle = { color: themeColor };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Browser surface theming via injected style */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::selection {
          background-color: ${themeColor}4D;
          color: ${themeColor};
        }
        :focus-visible {
          outline: 3px solid ${themeColor};
          outline-offset: 2px;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${themeColor}66;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${themeColor}99;
        }
      `}} />

      {/* Top Header & Instruction */}
      <div className="bg-white/90 p-4 rounded-3xl border-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3" style={headerBorderStyle}>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-xl" aria-hidden="true">🔗</span>
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
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(progressCount / level.items.length) * 100}%`,
                ...progressBarStyle,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="text-center animate-scale-in" role="status" aria-live="polite">
          <span className={`inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full font-black text-base shadow-bubbly border-2 ${feedbackToastBorder}`}>
            <Sparkles className="w-5 h-5" style={{ color: feedbackSparkleColor }} />
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
          aria-hidden="true"
        >
          {connections.map((conn, idx) => {
            const path = getLinePath(conn.leftId, conn.rightId);
            if (!path) return null;

            const isWrong = conn.status === 'wrong';

            return (
              <path
                key={`${conn.leftId}-${conn.rightId}-${idx}`}
                d={path}
                stroke={isWrong ? '#FB7185' : '#10B981'}
                strokeWidth={isWrong ? 4 : 5}
                strokeDasharray={isWrong ? '8,4' : 'none'}
                strokeLinecap="round"
                fill="none"
                className={isWrong ? 'animate-wobble' : 'animate-draw'}
                style={{
                  filter: isWrong ? wrongLineFilter : correctLineFilter,
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
                return `M ${startX} ${startY} L ${startX + 100} ${startY}`;
              })()}
              stroke={themeColor}
              strokeWidth={3}
              strokeDasharray="6,4"
              strokeLinecap="round"
              fill="none"
              className="animate-dash"
              style={{ filter: previewLineFilter }}
            />
          )}
        </svg>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start relative z-20">
          {/* LEFT COLUMN - Images */}
          <div className="space-y-3">
            <div className="text-center font-extrabold text-sm mb-2 uppercase tracking-wider" style={columnLabelStyle}>
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
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLeftClick(item); } }}
                    className={getLeftItemClassName(connected, selected)}
                    role="listitem"
                    aria-label={`${item.word} (${item.translation})${connected ? ', sudah disambungkan' : ''}`}
                    aria-selected={selected}
                    tabIndex={0}
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
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-full shadow-md animate-pop-in" aria-hidden="true">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}

                    {selected && !connected && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
                        <Volume2 className="w-6 h-6 animate-pulse-subtle" style={speakerIconStyle} />
                      </div>
                    )}

                    {wrongConnection && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white p-1.5 rounded-full shadow-md animate-wobble" aria-hidden="true">
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
            <div className="text-center font-extrabold text-sm mb-2 uppercase tracking-wider" style={columnLabelStyle}>
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
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRightClick(item); } }}
                    className={getRightItemClassName(connected)}
                    role="listitem"
                    aria-label={`${item.word} (${item.translation})${connected ? ', sudah disambungkan' : ''}`}
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReplayAudio(item.word); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleReplayAudio(item.word); } }}
                        className="flex-shrink-0 w-10 h-10 rounded-xl transition-all duration-150 ease-out flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={speakerButtonStyle}
                        aria-label={`Dengarkan ${item.word}`}
                        title="Dengarkan pengucapan"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div className="min-w-0">
                        <div className="font-extrabold text-lg sm:text-xl text-slate-800 leading-tight truncate">
                          {item.word}
                        </div>
                        <div className="text-xs font-bold px-2 py-0.5 rounded-full inline-block" style={translationBadgeStyle}>
                          {item.translation}
                        </div>
                      </div>
                    </div>

                    {connected && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-full shadow-md animate-pop-in" aria-hidden="true">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}

                    {wrongConnection && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white p-1.5 rounded-full shadow-md animate-wobble" aria-hidden="true">
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
        <div className="text-center animate-scale-in py-4" role="status" aria-live="polite">
          <div className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-bubbly border-2 border-white animate-pop-in" style={celebrationStyle}>
            <Sparkles className="w-6 h-6 fill-white animate-pulse" />
            <span>Semua Terhubung! Luar Biasa! 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};