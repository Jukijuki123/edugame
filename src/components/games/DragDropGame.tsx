import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Volume2, CheckCircle2, Sparkles } from 'lucide-react';
import { LevelData, LevelItem } from '../../data/levels';
import { ItemIllustration } from '../ItemIllustration';
import { soundManager } from '../../utils/audio';

interface DragDropGameProps {
  level: LevelData;
  onComplete: (errors: number) => void;
}

// Draggable Card Component
function DraggableCard({ item, isDragging }: { item: LevelItem; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none select-none cursor-grab active:cursor-grabbing p-4 rounded-3xl bg-white border-4 border-amber-300 shadow-card-kid hover:shadow-bubbly hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-2 w-32 h-36 sm:w-36 sm:h-40 ${
        isDragging ? 'opacity-30 scale-95' : 'opacity-100'
      }`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center pointer-events-none">
        <ItemIllustration name={item.icon} size={70} />
      </div>
      <div className="text-center pointer-events-none">
        <div className="font-extrabold text-base text-slate-800 leading-tight">{item.word}</div>
        <div className="text-xs font-semibold text-slate-400">{item.translation}</div>
      </div>
    </div>
  );
}

// Droppable Zone Component (Silhouette Shadow)
function DropZone({
  item,
  placedItem,
  onSpeak,
}: {
  item: LevelItem;
  placedItem?: LevelItem;
  onSpeak: (word: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: item.targetZone || `zone-${item.id}`,
    data: item,
  });

  const isFilled = !!placedItem;

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-3xl border-4 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 w-32 h-36 sm:w-36 sm:h-40 ${
        isFilled
          ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
          : isOver
          ? 'bg-amber-100/80 border-amber-500 scale-105 shadow-bubbly border-dashed'
          : 'bg-white/60 border-slate-300/80 border-dashed hover:border-slate-400'
      }`}
    >
      {isFilled ? (
        // Placed State with checkmark and speaker button
        <div className="flex flex-col items-center justify-center gap-2 animate-scale-in">
          <div className="relative">
            <ItemIllustration name={placedItem.icon} size={70} />
            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md animate-pop-in">
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-emerald-800 text-sm">{placedItem.word}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(placedItem.word);
              }}
              className="p-1 rounded-full bg-emerald-200 text-emerald-800 hover:bg-emerald-300 transition"
              title="Dengarkan Pengucapan"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // Empty State: Silhouette shadow & word prompt
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <ItemIllustration name={item.icon} isSilhouette={true} size={64} />
          </div>
          <span className="text-xs font-bold text-slate-400 text-center uppercase tracking-wide">
            {item.word}
          </span>
        </div>
      )}
    </div>
  );
}

export const DragDropGame: React.FC<DragDropGameProps> = ({ level, onComplete }) => {
  const [placedItems, setPlacedItems] = useState<Record<string, LevelItem>>({});
  const [activeItem, setActiveItem] = useState<LevelItem | null>(null);
  const [errors, setErrors] = useState(0);
  const [feedbackEffect, setFeedbackEffect] = useState<{ text: string; color: string } | null>(null);

  // Setup pointer sensors with touch support for tablets & mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    })
  );

  const availableItems = level.items.filter(
    (item) => !Object.values(placedItems).some((p) => p.id === item.id)
  );

  const handleDragStart = (event: DragStartEvent) => {
    soundManager.playClick();
    const item = event.active.data.current as LevelItem;
    setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) {
      soundManager.playWrong();
      return;
    }

    const draggedItem = active.data.current as LevelItem;
    const targetItem = over.data.current as LevelItem;
    const targetZoneId = over.id as string;

    // Check if the drop zone matches the item
    if (draggedItem.id === targetItem.id) {
      // Correct drop!
      soundManager.playSuccess();
      soundManager.speakEnglish(draggedItem.word);

      setFeedbackEffect({
        text: `Hebat! ${draggedItem.word} (${draggedItem.translation})`,
        color: 'text-emerald-600',
      });
      setTimeout(() => setFeedbackEffect(null), 2000);

      const nextPlaced = {
        ...placedItems,
        [targetZoneId]: draggedItem,
      };
      setPlacedItems(nextPlaced);

      // Check if all items have been placed
      if (Object.keys(nextPlaced).length === level.items.length) {
        setTimeout(() => {
          onComplete(errors);
        }, 1200);
      }
    } else {
      // Incorrect drop: spring bounce back
      soundManager.playWrong();
      setErrors((prev) => prev + 1);
      setFeedbackEffect({
        text: 'Ayo coba cocokkan dengan bayangan yang tepat!',
        color: 'text-rose-600',
      });
      setTimeout(() => setFeedbackEffect(null), 1800);
    }
  };

  const handleSpeak = (word: string) => {
    soundManager.playClick();
    soundManager.speakEnglish(word);
  };

  const progressCount = Object.keys(placedItems).length;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        
        {/* Progress & Instruction Bar */}
        <div className="bg-white/90 p-4 rounded-3xl border-3 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xl">🎒</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">{level.title}</h2>
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {level.instruction}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress bar */}
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-slate-400">
                PROGRES: {progressCount} / {level.items.length}
              </span>
              <div className="w-32 h-3.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 mt-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${(progressCount / level.items.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Feedback Toast */}
        {feedbackEffect && (
          <div className="text-center animate-scale-in">
            <span className={`inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full font-black text-base shadow-bubbly border-2 border-amber-200 ${feedbackEffect.color}`}>
              <Sparkles className="w-5 h-5" />
              {feedbackEffect.text}
            </span>
          </div>
        )}

        {/* Drop Zones (The Target Silhouettes) */}
        <div className="bg-gradient-to-b from-sky-50/80 to-blue-100/50 p-6 rounded-3xl border-4 border-sky-200 shadow-inner">
          <div className="text-center font-extrabold text-sm text-sky-800 mb-4 uppercase tracking-wider">
            Siluet Target Kotak Jawaban
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {level.items.map((item) => {
              const zoneKey = item.targetZone || `zone-${item.id}`;
              return (
                <DropZone
                  key={zoneKey}
                  item={item}
                  placedItem={placedItems[zoneKey]}
                  onSpeak={handleSpeak}
                />
              );
            })}
          </div>
        </div>

        {/* Items Rack (Cards to be dragged) */}
        <div className="bg-amber-50/90 p-5 rounded-3xl border-4 border-amber-200 shadow-sm">
          <div className="text-center font-extrabold text-sm text-amber-900 mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
            <span>👇 Tarik kartu ini ke atas:</span>
          </div>

          {availableItems.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-4 min-h-[160px]">
              {availableItems.map((item) => (
                <DraggableCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-emerald-700 font-black text-lg animate-pulse">
              🎉 Semua barang sudah ditempatkan dengan tepat!
            </div>
          )}
        </div>

      </div>

      {/* Drag Overlay during movement */}
      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeItem ? (
          <div className="p-4 rounded-3xl bg-white border-4 border-amber-400 shadow-2xl scale-105 flex flex-col items-center justify-center gap-2 w-32 h-36 sm:w-36 sm:h-40">
            <ItemIllustration name={activeItem.icon} size={70} />
            <div className="text-center">
              <div className="font-extrabold text-base text-slate-800">{activeItem.word}</div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
