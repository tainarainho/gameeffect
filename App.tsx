import React, { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { PlayerIdentity, GameTheme, StoryNode, GameHistoryItem, Choice } from './types';
import { startStory, advanceStory } from './services/geminiService';

type GameState = 'start' | 'loading' | 'playing' | 'end';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerIdentity, setPlayerIdentity] = useState<PlayerIdentity | null>(null);
  const [gameTheme, setGameTheme] = useState<GameTheme | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = useCallback(async (identity: PlayerIdentity, theme: GameTheme) => {
    setGameState('loading');
    setError(null);
    setPlayerIdentity(identity);
    setGameTheme(theme);
    setHistory([]);
    try {
      const initialNode = await startStory(theme, identity);
      setCurrentNode(initialNode);
      setGameState('playing');
    } catch (err) {
      console.error(err);
      setError('Falha ao iniciar a história. Por favor, tente novamente.');
      setGameState('start');
    }
  }, []);

  const handleChoice = useCallback(async (choice: Choice) => {
    if (!currentNode || !playerIdentity || !gameTheme) return;

    setGameState('loading');
    setError(null);

    const newHistoryItem: GameHistoryItem = { node: currentNode, choice };
    const updatedHistory = [...history, newHistoryItem];
    setHistory(updatedHistory);

    try {
      const nextNode = await advanceStory(updatedHistory, playerIdentity, gameTheme);
      setCurrentNode(nextNode);
      if (nextNode.isEnd) {
        setGameState('end');
      } else {
        setGameState('playing');
      }
    } catch (err) {
      console.error(err);
      setError('Falha ao avançar na história. Por favor, tente novamente.');
      // Revert state to allow user to try again from the same point
      setHistory(history);
      setGameState('playing');
    }
  }, [currentNode, history, playerIdentity, gameTheme]);

  const handleRestart = useCallback(() => {
    setGameState('start');
    setPlayerIdentity(null);
    setGameTheme(null);
    setCurrentNode(null);
    setHistory([]);
    setError(null);
  }, []);

  const renderContent = () => {
    if (error) {
        // A simple error display that allows restarting
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
                <button
                    onClick={handleRestart}
                    className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }
    
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStartGame} />;
      case 'loading':
      case 'playing':
        if (currentNode && gameTheme) {
          return (
            <GameScreen
              isLoading={gameState === 'loading'}
              node={currentNode}
              onChoice={handleChoice}
              history={history}
              theme={gameTheme}
            />
          );
        }
        return <LoadingSpinner />;
      case 'end':
        return currentNode && gameTheme ? <EndScreen finalNode={currentNode} history={history} onRestart={handleRestart} theme={gameTheme} /> : <LoadingSpinner />;
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-red-500 tracking-wider">EFEITO BORBOLETA</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
