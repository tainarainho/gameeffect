import React, { useState, useEffect } from 'react';
import { PlayerIdentity, GameTheme } from '../types';
import { CrimeIcon, EnvironmentIcon, PoliticsIcon, RandomIcon } from './IconComponents';

interface StartScreenProps {
  onStart: (identity: PlayerIdentity, theme: GameTheme) => void;
}

const themeOptions: { theme: GameTheme, icon: React.FC<{className?: string}> }[] = [
    { theme: 'Crimes Reais', icon: CrimeIcon },
    { theme: 'Clima Ambiental', icon: EnvironmentIcon },
    { theme: 'Política Global', icon: PoliticsIcon },
    { theme: 'Aleatório', icon: RandomIcon },
];

const identityOptions: PlayerIdentity[] = ['Homem', 'Mulher', 'Não-binário'];

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [identity, setIdentity] = useState<PlayerIdentity | null>(null);
  const [theme, setTheme] = useState<GameTheme | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  
  useEffect(() => {
    const storageKey = 'butterflyEffectPlayerCount';
    
    // Lê o valor atual do localStorage. Se não existir, o valor padrão é '0'.
    const currentStoredCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    // Incrementa o contador para a visita atual. A primeira visita resultará em 1.
    const newCount = currentStoredCount + 1;
    
    // Salva o novo valor de volta no localStorage.
    localStorage.setItem(storageKey, newCount.toString());
    
    // Define o estado para ser exibido na tela.
    setPlayerCount(newCount);
  }, []); // O array vazio [] garante que este efeito seja executado apenas uma vez, quando o componente é montado.


  const handleStart = () => {
    if (identity && theme) {
      onStart(identity, theme);
    }
  };

  const getThemeColors = (currentTheme: GameTheme | null, selected: boolean) => {
    const themeColorMap = {
      'Crimes Reais': {
        bg: 'bg-red-600',
        border: 'border-red-600',
        hoverBorder: 'hover:border-red-500',
        text: 'text-red-500'
      },
      'Clima Ambiental': {
        bg: 'bg-orange-500',
        border: 'border-orange-500',
        hoverBorder: 'hover:border-orange-400',
        text: 'text-orange-500'
      },
      'Política Global': {
        bg: 'bg-cyan-500',
        border: 'border-cyan-500',
        hoverBorder: 'hover:border-cyan-400',
        text: 'text-cyan-500'
      },
      'Aleatório': {
        bg: 'bg-yellow-500',
        border: 'border-yellow-500',
        hoverBorder: 'hover:border-yellow-400',
        text: 'text-yellow-500'
      }
    };
    
    const colors = themeColorMap[currentTheme || 'Aleatório'] || themeColorMap['Aleatório'];

    if (selected) {
        return `${colors.bg} ${colors.border} text-white`;
    }
    return `bg-gray-800 border-gray-600 ${colors.hoverBorder} hover:bg-gray-700`;
  };

  return (
    <div className="text-center animate-fade-in">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">Como você se identifica?</h2>
        <div className="flex justify-center gap-4">
          {identityOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setIdentity(opt)}
              className={`px-6 py-2 border-2 rounded-lg font-semibold transition-all duration-200 ${
                getThemeColors(theme, identity === opt)
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">Escolha o tema da sua história:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themeOptions.map(({ theme: themeOpt, icon: Icon }) => (
                <button
                    key={themeOpt}
                    onClick={() => setTheme(themeOpt)}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                        getThemeColors(themeOpt, theme === themeOpt)
                    }`}
                >
                    <Icon className="w-8 h-8" />
                    <span className="font-semibold">{themeOpt}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="my-8 text-center">
          <p className="text-gray-400">
              <span className={`font-bold text-lg ${getThemeColors(theme, true).split(' ')[3] || 'text-yellow-500'}`}>{playerCount.toLocaleString('pt-BR')}</span>
              <span className="ml-2">indivíduos já alteraram o destino.</span>
          </p>
      </div>

      <button
        onClick={handleStart}
        disabled={!identity || !theme}
        className={`px-10 py-3 text-white font-bold text-lg rounded-lg shadow-lg transition-colors transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:hover:scale-100
            ${theme ? getThemeColors(theme, true).split(' ')[0] + ' hover:' + getThemeColors(theme, true).split(' ')[0].replace('600','700').replace('500','600') : 'bg-gray-600'}
        `}
      >
        Iniciar História
      </button>
    </div>
  );
};

export default StartScreen;