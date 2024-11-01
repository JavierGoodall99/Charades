export type Category = {
  id: string;
  name: string;
  icon: string;
  words: string[];
};

export type GameMode = 'solo' | 'versus' | 'teams';

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type Team = {
  id: string;
  name: string;
  players: Player[];
  score: number;
};

export type GameSettings = {
  duration: number;
  mode: GameMode;
  players?: Player[];
  teams?: Team[];
};

export type GameState = {
  isPlaying: boolean;
  currentWord: string;
  timeLeft: number;
  score: number;
  category: Category | null;
  settings: GameSettings;
  usedWords: Set<string>;
  currentTeamIndex?: number;
  currentPlayerIndex?: number;
};

export type GameStats = {
  correctGuesses: number;
  skips: number;
  totalTime: number;
};