import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { StageMap } from './components/StageMap';
import { DragDropGame } from './components/games/DragDropGame';
import { MatchingGame } from './components/games/MatchingGame';
import { BubblePopGame } from './components/games/BubblePopGame';
import { ConnectLineGame } from './components/games/ConnectLineGame';
import { VictoryModal } from './components/VictoryModal';
import { LEVELS, LevelData } from './data/levels';
import { loadGameProgress, saveLevelProgress, resetGameProgress } from './utils/storage';
import { soundManager } from './utils/audio';

type ViewMode = 'home' | 'map' | 'game';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeLevel, setActiveLevel] = useState<LevelData | null>(null);
  const [progress, setProgress] = useState(loadGameProgress());
  const [victoryState, setVictoryState] = useState<{
    show: boolean;
    stars: number;
    levelTitle: string;
    hasNextLevel: boolean;
  } | null>(null);

  // Reload progress on mount
  useEffect(() => {
    setProgress(loadGameProgress());
  }, []);

  const handleStartAdventure = () => {
    // Find first unfinished level or level 1
    const nextUnfinished = LEVELS.find((lvl) => !progress.stars[lvl.id]) || LEVELS[0];
    setActiveLevel(nextUnfinished);
    setCurrentView('game');
  };

  const handleOpenStageMap = () => {
    setCurrentView('map');
  };

  const handleSelectLevel = (level: LevelData) => {
    setActiveLevel(level);
    setCurrentView('game');
  };

  const handleGoBack = () => {
    if (currentView === 'game') {
      setCurrentView('map');
    } else if (currentView === 'map') {
      setCurrentView('home');
    }
  };

  const handleRestartLevel = () => {
    if (activeLevel) {
      // Force re-render of current game level
      setActiveLevel({ ...activeLevel });
    }
  };

  const handleLevelComplete = (errors: number) => {
    if (!activeLevel) return;

    // Calculate stars:
    // 0 errors = 3 stars
    // 1-2 errors = 2 stars
    // 3+ errors = 1 star
    let earnedStars = 3;
    if (errors >= 3) {
      earnedStars = 1;
    } else if (errors >= 1) {
      earnedStars = 2;
    }

    // Determine next level
    const currentIndex = LEVELS.findIndex((l) => l.id === activeLevel.id);
    const nextLevel = currentIndex >= 0 && currentIndex + 1 < LEVELS.length ? LEVELS[currentIndex + 1] : null;

    // Save progress to LocalStorage
    const updated = saveLevelProgress(activeLevel.id, earnedStars, nextLevel?.id);
    setProgress(updated);

    // Show victory modal
    setVictoryState({
      show: true,
      stars: earnedStars,
      levelTitle: activeLevel.title,
      hasNextLevel: !!nextLevel,
    });
  };

  const handleNextLevel = () => {
    if (!activeLevel) return;
    const currentIndex = LEVELS.findIndex((l) => l.id === activeLevel.id);
    if (currentIndex >= 0 && currentIndex + 1 < LEVELS.length) {
      const nextLvl = LEVELS[currentIndex + 1];
      setVictoryState(null);
      setActiveLevel(nextLvl);
      setCurrentView('game');
    } else {
      setVictoryState(null);
      setCurrentView('map');
    }
  };

  const handleRetryCurrentLevel = () => {
    setVictoryState(null);
    handleRestartLevel();
  };

  const handleGoToMapFromVictory = () => {
    setVictoryState(null);
    setCurrentView('map');
  };

  const handleResetProgress = () => {
    const fresh = resetGameProgress();
    setProgress(fresh);
    soundManager.playClick();
  };

  return (
    <div className="min-h-screen flex flex-col bg-game-cream text-slate-800">
      {/* Persistent Global Header */}
      <Header
        currentView={currentView}
        levelTitle={currentView === 'game' && activeLevel ? activeLevel.title : undefined}
        totalStars={progress.totalStars}
        onGoBack={handleGoBack}
        onRestartLevel={currentView === 'game' ? handleRestartLevel : undefined}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {currentView === 'home' && (
          <HomeScreen
            totalStars={progress.totalStars}
            unlockedCount={progress.unlockedLevels.length}
            totalLevels={LEVELS.length}
            onStartAdventure={handleStartAdventure}
            onOpenStageMap={handleOpenStageMap}
          />
        )}

        {currentView === 'map' && (
          <StageMap
            levels={LEVELS}
            unlockedLevels={progress.unlockedLevels}
            starsMap={progress.stars}
            onSelectLevel={handleSelectLevel}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentView === 'game' && activeLevel && (
          <div key={`${activeLevel.id}-${Date.now().toString().slice(-4)}`}>
            {activeLevel.mode === 'drag-and-drop' && (
              <DragDropGame
                key={activeLevel.id}
                level={activeLevel}
                onComplete={handleLevelComplete}
              />
            )}

            {activeLevel.mode === 'matching' && (
              <MatchingGame
                key={activeLevel.id}
                level={activeLevel}
                onComplete={handleLevelComplete}
              />
            )}

            {activeLevel.mode === 'bubble-pop' && (
              <BubblePopGame
                key={activeLevel.id}
                level={activeLevel}
                onComplete={handleLevelComplete}
              />
            )}

            {activeLevel.mode === 'connect-line' && (
              <ConnectLineGame
                key={activeLevel.id}
                level={activeLevel}
                onComplete={handleLevelComplete}
              />
            )}
          </div>
        )}
      </main>

      {/* Victory Celebration Modal */}
      {victoryState && victoryState.show && (
        <VictoryModal
          stars={victoryState.stars}
          levelTitle={victoryState.levelTitle}
          hasNextLevel={victoryState.hasNextLevel}
          onNextLevel={handleNextLevel}
          onRetry={handleRetryCurrentLevel}
          onGoToMap={handleGoToMapFromVictory}
        />
      )}
    </div>
  );
};

export default App;
