import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from './components/Timer';
import { GameCard } from './components/GameCard';
import { CategorySelect } from './components/CategorySelect';
import { GameSetup } from './components/GameSetup';
import { Category, GameState, GameStats, GameSettings, GameMode } from './types';
import { Trophy, Timer as TimerIcon, Gamepad2, Sparkles } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentWord: '',
    timeLeft: 60,
    score: 0,
    category: null,
    settings: {
      duration: 60,
      mode: 'solo',
    },
    usedWords: new Set(),
  });

  const [gameStats, setGameStats] = useState<GameStats>({
    correctGuesses: 0,
    skips: 0,
    totalTime: 0,
  });

  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    let timer: number;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = window.setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  const handleGameSetup = (settings: GameSettings) => {
    setGameState((prev) => ({
      ...prev,
      settings,
      timeLeft: settings.duration,
    }));
    setShowSetup(false);
  };

  const startGame = (category: Category) => {
    const availableWords = category.words.filter(
      (word) => !gameState.usedWords.has(word)
    );
    
    if (availableWords.length === 0) {
      // Reset used words if all words have been used
      gameState.usedWords.clear();
    }
    
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      currentWord: randomWord,
      timeLeft: prev.settings.duration,
      score: 0,
      category,
      usedWords: new Set([randomWord]),
    }));
  };

  const endGame = () => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  };

  const exitGame = () => {
    setGameState({
      isPlaying: false,
      currentWord: '',
      timeLeft: 60,
      score: 0,
      category: null,
      settings: gameState.settings,
      usedWords: new Set(),
    });
    setGameStats({
      correctGuesses: 0,
      skips: 0,
      totalTime: 0,
    });
    setShowSetup(true);
  };

  const handleCorrect = () => {
    if (!gameState.category) return;
    
    const availableWords = gameState.category.words.filter(
      (word) => !gameState.usedWords.has(word)
    );
    
    if (availableWords.length === 0) {
      endGame();
      return;
    }

    const nextWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    setGameState((prev) => ({
      ...prev,
      currentWord: nextWord,
      score: prev.score + 1,
      usedWords: new Set([...prev.usedWords, nextWord]),
    }));

    setGameStats((prev) => ({
      ...prev,
      correctGuesses: prev.correctGuesses + 1,
    }));
  };

  const handleSkip = () => {
    if (!gameState.category) return;
    
    const availableWords = gameState.category.words.filter(
      (word) => !gameState.usedWords.has(word)
    );
    
    if (availableWords.length === 0) {
      gameState.usedWords.clear();
    }
    
    const nextWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    setGameState((prev) => ({
      ...prev,
      currentWord: nextWord,
      usedWords: new Set([...prev.usedWords, nextWord]),
    }));

    setGameStats((prev) => ({
      ...prev,
      skips: prev.skips + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-indigo-900">Charades!</h1>
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-gray-600">The ultimate party game</p>
        </header>

        <AnimatePresence mode="wait">
          {showSetup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GameSetup onComplete={handleGameSetup} />
            </motion.div>
          )}

          {!showSetup && !gameState.isPlaying && !gameState.category && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-center mb-6">Choose a Category</h2>
                <CategorySelect onSelect={startGame} />
              </div>
            </motion.div>
          )}

          {gameState.isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <Timer timeLeft={gameState.timeLeft} totalTime={gameState.settings.duration} />
              <div className="mt-8">
                <GameCard
                  word={gameState.currentWord}
                  onCorrect={handleCorrect}
                  onSkip={handleSkip}
                  onExit={exitGame}
                />
              </div>
              <div className="mt-8 text-center">
                <p className="text-2xl font-bold text-indigo-900">
                  Score: {gameState.score}
                </p>
              </div>
            </motion.div>
          )}

          {!gameState.isPlaying && gameState.category && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h2 className="text-3xl font-bold text-center">Game Over!</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Trophy className="w-6 h-6 text-yellow-500 mr-3" />
                    <span>Score</span>
                  </div>
                  <span className="font-bold">{gameState.score}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <TimerIcon className="w-6 h-6 text-blue-500 mr-3" />
                    <span>Time Played</span>
                  </div>
                  <span className="font-bold">{gameState.settings.duration - gameState.timeLeft}s</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Gamepad2 className="w-6 h-6 text-green-500 mr-3" />
                    <span>Category</span>
                  </div>
                  <span className="font-bold">{gameState.category.name}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={exitGame}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Change Category
                </button>
                <button
                  onClick={() => startGame(gameState.category!)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;