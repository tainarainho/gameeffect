import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex justify-center items-center">
        {/* Círculo externo (Amarelo) */}
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        {/* Círculo interno (Vermelho - Efeito Borboleta) */}
        <div className="absolute w-8 h-8 border-4 border-red-600 border-b-transparent rounded-full animate-spin-slow"></div>
      </div>
      <p className="text-lg font-semibold text-gray-300">
        Recalculando a Realidade...
      </p>

      {/* Estilo CSS para o segundo spinner */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-720deg); } /* Rotação reversa e mais rápida */
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;