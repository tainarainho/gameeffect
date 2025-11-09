import React, { useState, useEffect, useRef } from 'react';
import { StoryNode, Choice, GameHistoryItem, GameTheme } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface GameScreenProps {
  isLoading: boolean;
  node: StoryNode | null;
  onChoice: (choice: Choice) => void;
  history: GameHistoryItem[];
  theme: GameTheme;
}

const getSoundUrl = (description: string, theme: GameTheme): string => {
  const desc = description.toLowerCase();

  // URLs de áudio de demonstração do Pixabay (uso não comercial)
  switch (theme) {
    case 'Crimes Reais':
      if (desc.includes('sirene') || desc.includes('polícia') || desc.includes('perseguição')) return 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_2c87b9c9e8.mp3'; // Police siren
      if (desc.includes('chuva') || desc.includes('noite')) return 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_35a64a3511.mp3'; // Rain and thunder
      if (desc.includes('tensão') || desc.includes('silêncio')) return 'https://cdn.pixabay.com/download/audio/2022/10/24/audio_332a63212c.mp3'; // Suspense
      return 'https://cdn.pixabay.com/download/audio/2022/10/24/audio_332a63212c.mp3'; // Default suspense

    case 'Clima Ambiental':
      if (desc.includes('floresta') || desc.includes('vento')) return 'https://cdn.pixabay.com/download/audio/2022/08/17/audio_392c2a7116.mp3'; // Forest wind
      if (desc.includes('tempestade') || desc.includes('trovão')) return 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_35a64a3511.mp3'; // Rain and thunder
      if (desc.includes('fogo') || desc.includes('queimada')) return 'https://cdn.pixabay.com/download/audio/2024/02/09/audio_2e75e1137c.mp3'; // Fire
      return 'https://cdn.pixabay.com/download/audio/2022/08/17/audio_392c2a7116.mp3'; // Default nature

    case 'Política Global':
      if (desc.includes('multidão') || desc.includes('protesto')) return 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_0317c3093c.mp3'; // Crowd
      if (desc.includes('notícia') || desc.includes('urgente')) return 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_eb3832c66c.mp3'; // News intro
      if (desc.includes('debate') || desc.includes('tensão')) return 'https://cdn.pixabay.com/download/audio/2023/07/20/audio_f53495d038.mp3'; // Tense debate
      return 'https://cdn.pixabay.com/download/audio/2023/07/20/audio_f53495d038.mp3'; // Default debate/tension

    case 'Aleatório':
    default:
      if (desc.includes('chuva') || desc.includes('tempestade')) return 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_35a64a3511.mp3';
      if (desc.includes('floresta')) return 'https://cdn.pixabay.com/download/audio/2022/08/17/audio_392c2a7116.mp3';
      if (desc.includes('sirene')) return 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_2c87b9c9e8.mp3';
      return 'https://cdn.pixabay.com/download/audio/2022/10/24/audio_332a63212c.mp3';
  }
};

const getThemeAccentColors = (theme: GameTheme) => {
    switch (theme) {
        case 'Crimes Reais':
            return {
                text: 'text-red-600',
                border: 'border-red-700',
                hoverBorder: 'hover:border-red-600',
                pulseBg: 'bg-red-600'
            };
        case 'Clima Ambiental':
            return {
                text: 'text-orange-500',
                border: 'border-orange-500',
                hoverBorder: 'hover:border-orange-500',
                pulseBg: 'bg-orange-500'
            };
        case 'Política Global':
            return {
                text: 'text-cyan-400',
                border: 'border-cyan-400',
                hoverBorder: 'hover:border-cyan-400',
                pulseBg: 'bg-cyan-400'
            };
        case 'Aleatório':
        default:
            return {
                text: 'text-yellow-400',
                border: 'border-yellow-500',
                hoverBorder: 'hover:border-yellow-400',
                pulseBg: 'bg-yellow-400'
            };
    }
};


const GameScreen: React.FC<GameScreenProps> = ({ isLoading, node, onChoice, history, theme }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [soundUrl, setSoundUrl] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { text: accentText, border: accentBorder, hoverBorder: accentHoverBorder, pulseBg: accentPulseBg } = getThemeAccentColors(theme);
  
  // Efeito para atualizar imagem e som
  useEffect(() => {
    if (node) {
      setShowContent(false);

      const keywords = node.imagePrompt.split(' ').join(',');
      setImageUrl(`https://source.unsplash.com/1600x900/?${keywords}`);
      setSoundUrl(getSoundUrl(node.soundDescription, theme));
      
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [node, theme]);

  // Efeito para controlar a reprodução do áudio
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
        audioElement.volume = 0.3;
        if (soundUrl && !isMuted) {
            audioElement.play().catch(error => console.warn("Audio play failed (user interaction required):", error));
        } else {
            audioElement.pause();
        }
    }
  }, [soundUrl, isMuted]);

  // Efeito para a animação de digitação
  useEffect(() => {
    if (node?.storyText) {
      const textToType = node.storyText;
      let i = 0;
      setDisplayedText('');
      const typingInterval = setInterval(() => {
        if (i < textToType.length) {
          setDisplayedText(prev => prev + textToType.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 35);

      return () => clearInterval(typingInterval);
    }
  }, [node?.storyText]);

  if (isLoading || !node) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <LoadingSpinner />
      </div>
    );
  }

  const isTyping = displayedText.length < (node?.storyText?.length || 0);

  const muteIcon = isMuted ? (
    <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
    </>
  ) : (
    <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </>
  );

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>
      
      <audio ref={audioRef} src={soundUrl} loop hidden />

      <button
        onClick={() => setIsMuted(prev => !prev)}
        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-gray-900 bg-opacity-70 text-white hover:bg-red-700 transition-colors shadow-lg border border-gray-700"
        aria-label={isMuted ? 'Ligar Áudio' : 'Desligar Áudio'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {muteIcon}
        </svg>
      </button>


      <div className={`relative z-10 w-full max-w-4xl mx-auto p-8 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800 transition-opacity duration-700 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        
        {history.length > 0 && (
          <div className="mb-8 border-b border-gray-700 pb-4">
            <h3 className={`text-md font-semibold ${accentText} mb-3 tracking-wider uppercase`}>Resumo da Jornada</h3>
            <div className="max-h-28 overflow-y-auto pr-3 text-sm">
              {history.map((item, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <p className="text-gray-400 italic">"{item.node.outcomeText.substring(0, 80)}..."</p>
                  <p className={`mt-1 pl-4 border-l-2 ${accentBorder}`}>
                    <span className="font-bold text-gray-300">Você escolheu:</span>
                    <span className="text-white ml-2">{item.choice.text}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-base md:text-lg text-gray-400 italic leading-relaxed mb-6 whitespace-pre-wrap">
          {node.outcomeText}
        </p>

        <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 whitespace-pre-wrap min-h-[120px]">
          {displayedText}
          {isTyping && <span className={`inline-block align-middle w-0.5 h-6 ${accentPulseBg} ml-1 animate-pulse`} />}
        </p>

        <div className="grid grid-cols-1 gap-4">
          {node.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice)}
              disabled={isLoading}
              className={`w-full text-left bg-gray-900 bg-opacity-70 p-4 rounded-lg border-2 border-gray-800 transition-all duration-300 transform hover:scale-[1.01] ${isLoading ? 'opacity-50 cursor-not-allowed' : `${accentHoverBorder} hover:bg-gray-800`}`}
            >
              <span className={`font-semibold ${accentText} mr-2`}>{choice.id}:</span>
              <span className="text-white">{choice.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
