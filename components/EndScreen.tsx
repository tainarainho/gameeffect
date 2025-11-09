import React from 'react';
import { StoryNode, GameHistoryItem, GameTheme } from '../types';

interface EndScreenProps {
  finalNode: StoryNode;
  history: GameHistoryItem[];
  onRestart: () => void;
  theme: GameTheme;
}

const getThemeAccentColors = (theme: GameTheme) => {
    switch (theme) {
        case 'Crimes Reais':
            return { text: 'text-red-500', bg: 'bg-red-600', hoverBg: 'hover:bg-red-700', choiceText: 'text-red-400' };
        case 'Clima Ambiental':
            return { text: 'text-orange-500', bg: 'bg-orange-500', hoverBg: 'hover:bg-orange-600', choiceText: 'text-orange-400' };
        case 'Política Global':
            return { text: 'text-cyan-400', bg: 'bg-cyan-500', hoverBg: 'hover:bg-cyan-600', choiceText: 'text-cyan-300' };
        case 'Aleatório':
        default:
            return { text: 'text-yellow-400', bg: 'bg-yellow-500', hoverBg: 'hover:bg-yellow-600', choiceText: 'text-yellow-300' };
    }
};

const EndScreen: React.FC<EndScreenProps> = ({ finalNode, history, onRestart, theme }) => {
  const colors = getThemeAccentColors(theme);
  
  return (
    <div className="text-center animate-fade-in max-w-3xl mx-auto">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl mb-8">
        <h2 className={`text-3xl font-bold ${colors.text} mb-4`}>Fim de Jogo</h2>
        <p className="text-gray-300 italic text-lg mb-4">{finalNode.outcomeText}</p>
        <p className="text-white text-xl">{finalNode.storyText}</p>

        {finalNode.realEventReference && (
          <div className="bg-gray-900 bg-opacity-50 mt-6 p-4 rounded-lg border border-gray-700">
            <h4 className={`text-lg font-semibold ${colors.text} mb-2`}>Inspiração Real</h4>
            <p className="text-gray-300">{finalNode.realEventReference}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-300">Sua Jornada</h3>
        <ul className="text-left space-y-4">
          {history.map((item, index) => (
            <li key={index} className="border-b border-gray-700 pb-2">
              <p className="text-gray-400 text-sm">Cenário {index + 1}</p>
              <p className="text-white">{item.node.storyText.substring(0, 100)}...</p>
              <p className="mt-1">
                <span className={`font-semibold ${colors.choiceText}`}>Sua escolha: </span>
                <span className="text-gray-300">{item.choice.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onRestart}
        className={`px-10 py-3 ${colors.bg} text-white font-bold text-lg rounded-lg shadow-lg ${colors.hoverBg} transition-colors transform hover:scale-105`}
      >
        Jogar Novamente
      </button>
    </div>
  );
};

export default EndScreen;