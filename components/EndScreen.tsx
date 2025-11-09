import React from 'react';

interface EndScreenProps {
  outcome: string;
  onPlayAgain: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ outcome, onPlayAgain }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 bg-cover bg-center">
      <div className="max-w-3xl w-full p-10 bg-black bg-opacity-80 rounded-xl shadow-2xl border-4 border-red-600/70 text-center">
        <h1 className="text-5xl font-extrabold text-red-500 mb-6 tracking-wider">FIM DA LINHA DO TEMPO</h1>
        <p className="text-xl text-gray-200 leading-relaxed whitespace-pre-wrap italic mb-8 border-l-4 border-red-700/50 pl-4 text-left">
          {outcome}
        </p>

        <p className="text-gray-400 mb-8 text-lg font-semibold">
          Sua jornada pelo Efeito Borboleta chegou ao fim.
        </p>

        <button
          onClick={onPlayAgain}
          className="mt-6 bg-yellow-600 text-gray-900 font-bold text-lg py-3 px-10 rounded-lg shadow-xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-[1.05]"
        >
          Tentar Outra Realidade
        </button>
      </div>
    </div>
  );
};

export default EndScreen;