// LocalStorage helper for WordQuest Junior game progress

const STORAGE_KEYS = {
  UNLOCKED_LEVELS: 'wordquest_unlocked_levels',
  LEVEL_STARS: 'wordquest_level_stars',
  SOUND_ENABLED: 'wordquest_sound_enabled',
};

export interface GameProgress {
  unlockedLevels: string[];
  stars: Record<string, number>;
  totalStars: number;
}

export function loadGameProgress(): GameProgress {
  try {
    const defaultUnlocked = ['level-1'];
    const unlockedRaw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS);
    const unlockedLevels: string[] = unlockedRaw ? JSON.parse(unlockedRaw) : defaultUnlocked;

    const starsRaw = localStorage.getItem(STORAGE_KEYS.LEVEL_STARS);
    const stars: Record<string, number> = starsRaw ? JSON.parse(starsRaw) : {};

    const totalStars = Object.values(stars).reduce((sum, s) => sum + s, 0);

    return {
      unlockedLevels: Array.from(new Set([...defaultUnlocked, ...unlockedLevels])),
      stars,
      totalStars,
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return {
      unlockedLevels: ['level-1'],
      stars: {},
      totalStars: 0,
    };
  }
}

export function saveLevelProgress(levelId: string, earnedStars: number, nextLevelId?: string): GameProgress {
  try {
    const current = loadGameProgress();
    
    // Update stars (keep highest score)
    const currentStars = current.stars[levelId] || 0;
    if (earnedStars > currentStars) {
      current.stars[levelId] = earnedStars;
    }

    // Unlock next level if provided
    if (nextLevelId && !current.unlockedLevels.includes(nextLevelId)) {
      current.unlockedLevels.push(nextLevelId);
    }

    localStorage.setItem(STORAGE_KEYS.LEVEL_STARS, JSON.stringify(current.stars));
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(current.unlockedLevels));

    const totalStars = Object.values(current.stars).reduce((sum, s) => sum + s, 0);
    return {
      ...current,
      totalStars,
    };
  } catch (e) {
    console.error('Failed to save progress', e);
    return loadGameProgress();
  }
}

export function resetGameProgress(): GameProgress {
  localStorage.removeItem(STORAGE_KEYS.LEVEL_STARS);
  localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(['level-1']));
  return {
    unlockedLevels: ['level-1'],
    stars: {},
    totalStars: 0,
  };
}
