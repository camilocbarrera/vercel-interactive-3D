import { Sparkles } from 'lucide-react';
import { CardData } from '../_types/card';

interface HeroSectionProps {
  cardData: CardData;
  isGenerating: boolean;
  onInputChange: (field: keyof CardData, value: string) => void;
  onGenerateCard: () => void;
}

export const HeroSection = ({ 
  cardData, 
  isGenerating, 
  onInputChange, 
  onGenerateCard 
}: HeroSectionProps) => {
  const handleSubmit = () => {
    if (!cardData.name.trim()) {
      alert('Por favor ingresa tu nombre antes de generar tu insignia.');
      return;
    }
    onGenerateCard();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full mx-auto px-2 sm:px-6">
        {/* Hero Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4">
            <span className="text-yellow-400 text-xs sm:text-sm font-bold">— EDICIÓN AGOSTO 2025</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            IA HACK<span className="text-yellow-400">A</span>THON
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed px-2">
            Únete a la plataforma de <span className="text-white font-semibold">innovación</span> de la región.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Nombre Completo</label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className="w-full bg-gray-800 text-white text-base px-4 py-4 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none transition-colors touch-manipulation"
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Rol / Título</label>
            <input
              type="text"
              value={cardData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className="w-full bg-gray-800 text-white text-base px-4 py-4 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none transition-colors touch-manipulation"
              placeholder="ej., Ingeniero de IA, Desarrollador"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Empresa / Organización</label>
            <input
              type="text"
              value={cardData.company}
              onChange={(e) => onInputChange('company', e.target.value)}
              className="w-full bg-gray-800 text-white text-base px-4 py-4 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none transition-colors touch-manipulation"
              placeholder="Tu empresa u organización"
            />
          </div>
          
          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            disabled={isGenerating}
            className={`w-full mt-6 sm:mt-8 text-black text-base font-bold py-4 px-6 rounded-lg transition-all duration-300 touch-manipulation ${
              isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 transform hover:scale-105 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Generando tu insignia...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Asistir al Evento
              </div>
            )}
          </button>
        </div>

        {/* Organizer info */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">ORGANIZADO POR</p>
          <p className="text-sm font-bold">COLOMBIA TECH WEEK</p>
        </div>
      </div>
    </div>
  );
}; 