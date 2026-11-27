import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Flame, Check } from 'lucide-react';
import { LevelData } from '../../data/levels';
import { ItemIllustration } from '../ItemIllustration';
import { soundManager } from '../../utils/audio';

interface MatchingGameProps {
  level: LevelData;
  onComplete: (errors: number) => void;
}

interface CardSlot {
  cardId: string;
  itemId: string;
  type: 'image' | 'word';
  word: string;
  translation: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ level, onComplete }) => {
  const [cards, setCards] = useState<CardSlot[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [combo, setCombo] = useState(0);
  const [errors, setErrors] = useState(0);
  const [comboMessage, setComboMessage] = useState<string | null>(null);

  // Initialize deck with pairs: one card for image/icon, one card for English word
  useEffect(() => {
    const deck: CardSlot[] = [];
    level.items.forEach((item) => {
      // Image Card
      deck.push({
        cardId: `${item.id}-img`,
        itemId: item.id,
        type: 'image',
        word: item.word,
        translation: item.translation,
        icon: item.icon,
        isFlipped: false,
        isMatched: false,
      });

      // Word Card
      deck.push({
        cardId: `${item.id}-word`,
        itemId: item.id,
        type: 'word',
        word: item.word,
        translation: item.translation,
        icon: item.icon,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setCombo(0);
    setErrors(0);
  }, [level]);

  const handleCardClick = (index: number) => {
    if (isProcessing) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    soundManager.playPop();

    // Flip this card
    const updatedCards = [...cards];
    updatedCards[index] = { ...card, isFlipped: true };
    setCards(updatedCards);

    // Speak word when word card is turned or when second card matches
    soundManager.speakEnglish(card.word);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      // Check if pair matches
      if (
        firstCard.itemId === secondCard.itemId &&
        firstCard.type !== secondCard.type
      ) {
        // MATCH!
        setTimeout(() => {
          soundManager.playSuccess();
          soundManager.speakEnglish(firstCard.word);

          const matchedCards = updatedCards.map((c, i) =>
            i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setSelectedCards([]);
          setIsProcessing(false);

          const nextCombo = combo + 1;
          setCombo(nextCombo);

          if (nextCombo >= 2) {
            setComboMessage(`${nextCombo}x COMBO! LUAR BIASA! 🔥`);
            setTimeout(() => setComboMessage(null), 1500);
          }

          // Check if all pairs are matched
          const allDone = matchedCards.every((c) => c.isMatched);
          if (allDone) {
            setTimeout(() => {
              onComplete(errors);
            }, 1000);
          }
        }, 500);
      } else {
        // NO MATCH: Flip back with spring wobble
        setTimeout(() => {
          soundManager.playWrong();
          setCombo(0);
          setErrors((prev) => prev + 1);

          const resetCards = updatedCards.map((c, i) =>
            i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
          );
          setCards(resetCards);
          setSelectedCards([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  const matchedPairsCount = cards.filter((c) => c.isMatched).length / 2;
  const totalPairs = level.items.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      
      {/* Level Header & Combo Bar */}
      <div className="bg-white/90 p-4 rounded-3xl border-3 border-emerald-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-xl">🃏</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{level.title}</h2>
          </div>
          <p className="text-sm font-semibold text-slate-600">
            {level.instruction}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Combo Meter */}
          {combo > 1 && (
            <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-300 font-extrabold text-sm animate-pulse-subtle">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{combo}x Combo!</span>
            </div>
          )}

          {/* Progress */}
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-slate-400">
              PASANGAN: {matchedPairsCount} / {totalPairs}
            </span>
            <div className="w-32 h-3.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 mt-1">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-300"
                style={{ width: `${(matchedPairsCount / totalPairs) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Combo Cheer Banner */}
      {comboMessage && (
        <div className="text-center animate-scale-in">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 px-6 py-2 rounded-full font-black text-base shadow-bubbly border-2 border-white">
            <Sparkles className="w-5 h-5 fill-white" />
            {comboMessage}
          </span>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 justify-items-center">
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.cardId}
              onClick={() => handleCardClick(index)}
              className="w-32 h-40 sm:w-36 sm:h-44 perspective-1000 cursor-pointer select-none"
            >
              <div
                className={`w-full h-full relative transition-transform duration-500 transform-style-3d rounded-3xl ${
                  isRevealed ? 'rotate-y-180' : ''
                } ${card.isMatched ? 'opacity-85 scale-95 ring-4 ring-emerald-400' : 'hover:-translate-y-1'}`}
              >
                {/* Card Back (Cover face) */}
                <div className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-3xl border-4 border-amber-300 shadow-card-kid flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center mb-1 shadow-inner">
                    <span className="text-3xl select-none">🌟</span>
                  </div>
                  <span className="font-black text-xs text-amber-950 tracking-wider">TAP CARD</span>
                </div>

                {/* Card Front (Content face) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-white rounded-3xl border-4 border-sky-300 shadow-bubbly flex flex-col items-center justify-center p-3 text-center">
                  {card.isMatched && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {card.type === 'image' ? (
                    // Image Card
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-20 h-20 flex items-center justify-center">
                        <ItemIllustration name={card.icon} size={70} />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        ({card.translation})
                      </span>
                    </div>
                  ) : (
                    // English Word Card
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <span className="font-black text-lg text-slate-800 leading-tight">
                        {card.word}
                      </span>
                      <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
                        {card.translation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
