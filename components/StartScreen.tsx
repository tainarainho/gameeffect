import React, { useState } from 'react';
import { PlayerIdentity, GameTheme } from '../types';

interface StartScreenProps {
  onStartGame: (identity: PlayerIdentity, theme: GameTheme) => void;
}

const identities: PlayerIdentity[] = ['Homem', 'Mulher', 'Não-binário'];
const themes: GameTheme[] = ['Crimes Reais', 'Clima Ambiental', 'Política Global', 'Aleatório'];

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [selectedIdentity, setSelectedIdentity] = useState<PlayerIdentity>(identities[0]);
  const [selectedTheme, setSelectedTheme] = useState<GameTheme>(themes[0]);

  const handleStart = () => {
    onStartGame(selectedIdentity, selectedTheme);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="max-w-xl w-full p-8 bg-gray-800 rounded-xl shadow-2xl border border-red-700/50">
        <h1 className="text-4xl font-extrabold text-red-600 mb-2 tracking-wide">EFEITO BORBOLETA</h1>
        <p className="text-gray-400 text-xl italic mb-8">Pequenas escolhas, consequências globais.</p>

        <div className="space-y-6">
          {/* Seleção de Identidade */}
          <div>
            <label className="block text-lg font-semibold text-yellow-400 mb-3">Sua Identidade (Protagonista)</label>
            <div className="flex flex-wrap gap-3">
              {identities.map((identity) => (
                <button
                  key={identity}
                  onClick={() => setSelectedIdentity(identity)}
                  className={`py-2 px-4 rounded-lg transition-all duration-200 ${
                    selectedIdentity === identity
                      ? 'bg-red-700 text-white font-bold border-2 border-red-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {identity}
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Tema */}
          <div>
            <label className="block text-lg font-semibold text-yellow-400 mb-3">Tema da Crise</label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                    selectedTheme === theme
                      ? 'bg-red-700 text-white font-bold border-2 border-red-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="mt-10 w-full bg-red-800 text-white font-extrabold text-xl py-4 rounded-lg shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-[1.01]"
        >
          INICIAR CADEIA DE EVENTOS
        </button>
      </div>
    </div>
  );
};

export default StartScreen;