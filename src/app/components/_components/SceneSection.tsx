"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment, Lightformer } from "@react-three/drei";
import { Download, Linkedin, Copy, Edit, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Band from "../Band";
import { CardData, TextureSettings, BandSettings, TextIntegration } from '../_types/card';
import { XIcon } from './icons/XIcon';
import { useState, useEffect } from 'react';

interface SceneSectionProps {
  cardData: CardData;
  cardTexture: string | null;
  bandTexture: string | null;
  isGenerating: boolean;
  showSidebar: boolean;
  showTextAnimation: boolean;
  onSetShowSidebar: (show: boolean) => void;
  onInputChange: (field: keyof CardData, value: string) => void;
  onGenerateCard: () => void;
  onShare: (platform: string) => void;
}

export const SceneSection = ({
  cardData,
  cardTexture,
  bandTexture,
  isGenerating,
  showSidebar,
  showTextAnimation,
  onSetShowSidebar,
  onInputChange,
  onGenerateCard,
  onShare
}: SceneSectionProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const textureSettings: TextureSettings = {
    scaleWidth: 1,
    scaleHeight: 1,
    positionX: 0,
    positionY: 0,
    rotation: 180,
    flipHorizontal: true,
    flipVertical: false
  };

  const bandSettings: BandSettings = {
    customBandTextureUrl: bandTexture,
    bandRepeatX: -8,
    bandRepeatY: 2,
    bandColor: "#333333"
  };

  const textIntegration: TextIntegration = {
    style: "floating",
    depth: 0.01,
    opacity: 1,
    emissive: 0,
    metalness: 0.1,
    roughness: 0.2
  };

  const handleGenerateCard = () => {
    if (!cardData.name.trim()) {
      alert('Por favor ingresa tu nombre antes de generar tu insignia.');
      return;
    }
    onGenerateCard();
    onSetShowSidebar(false);
  };

  return (
    <>
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 text-sm">
        <div className="flex gap-8">
          
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">
            IA HACK<span className="text-yellow-400">A</span>THON
          </span>
          <div className="w-2 h-2 bg-white rounded-sm"></div>
        </div>
        <div className="flex gap-6">
          
        </div>
      </header>

      {/* Main Content with Animation - Title Section */}
      <div className={`absolute left-4 md:left-1/3 top-1/4 md:top-1/2 transform -translate-y-1/4 md:-translate-y-1/2 z-10 max-w-xs md:max-w-md px-4 md:px-0 transition-all duration-1000 ${
        showTextAnimation ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
      }`}>
        <div className="mb-2">
          <span className="text-yellow-400 text-xs md:text-sm font-bold">— EDICIÓN AGOSTO 2025</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          IA HACK<span className="text-yellow-400">A</span>THON
        </h1>
        <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
          Únete a la plataforma de <span className="text-white font-semibold">innovación</span> de<br className="hidden md:block" />
          <span className="md:hidden"> </span>la región.
        </p>
        
        {/* Edit and Social - Desktop Only */}
        <div className="hidden md:block">
          <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
            Crea tu insignia personalizada.<br />
            <Sheet open={showSidebar} onOpenChange={onSetShowSidebar}>
              <SheetTrigger asChild>
                <span className="inline-flex items-center gap-1 underline cursor-pointer hover:text-white">
                  <Edit className="w-3 h-3" />
                  Editar nombre del participante
                </span>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-black/95 backdrop-blur-sm">
                <SheetHeader className="pt-6">
                  <SheetTitle className="text-white">
                    IA HACK<span className="text-yellow-400">A</span>THON
                  </SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Únete a la plataforma de <span className="text-white font-semibold">innovación</span> de la región.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 py-8 px-1">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Nombre Completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={cardData.name}
                      onChange={(e) => onInputChange('name', e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400/20"
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">
                      Título/Cargo
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={cardData.title}
                      onChange={(e) => onInputChange('title', e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400/20"
                      placeholder="Ej: Desarrollador Full Stack"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-300">
                      Empresa/Organización
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={cardData.company}
                      onChange={(e) => onInputChange('company', e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400/20"
                      placeholder="Ej: Tech Company"
                    />
                  </div>
                  
                  <Button
                    onClick={handleGenerateCard}
                    disabled={isGenerating}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold mt-8"
                  >
                    {isGenerating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Generando...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generar Insignia
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">ORGANIZADO POR</p>
                  <p className="text-sm font-bold text-white">COLOMBIA TECH WEEK</p>
                </div>
              </SheetContent>
            </Sheet>
          </p>
          
          {/* Social Share - Desktop */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 text-xs text-gray-400">
            <span className="hidden md:block">SHARE ON:</span>
            <div className="flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto">
              <button
                onClick={() => onShare('download')}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#ffdd00] hover:bg-yellow-400 text-black rounded-lg transition-colors font-medium whitespace-nowrap text-xs md:text-sm"
              >
                <Download className="w-3 h-3 md:w-4 md:h-4" />
                Descargar
              </button>
              
              <button
                onClick={() => onShare('x')}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors border border-gray-600 whitespace-nowrap text-xs md:text-sm"
              >
                <XIcon className="w-3 h-3 md:w-4 md:h-4" />
                X
              </button>
              
              <button
                onClick={() => onShare('linkedin')}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors whitespace-nowrap text-xs md:text-sm"
              >
                <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                LinkedIn
              </button>
              
              <button
                onClick={() => onShare('copy')}
                data-share="copy"
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 whitespace-nowrap text-xs md:text-sm"
              >
                <Copy className="w-3 h-3 md:w-4 md:h-4" />
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit and Social Section - Mobile Bottom */}
      <div className={`md:hidden absolute left-4 right-4 bottom-8 z-10 transition-all duration-1000 ${
        showTextAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <p className="text-gray-400 text-xs mb-4 leading-relaxed">
          Crea tu insignia personalizada.<br />
          <Sheet open={showSidebar} onOpenChange={onSetShowSidebar}>
            <SheetTrigger asChild>
              <span className="inline-flex items-center gap-1 underline cursor-pointer hover:text-white">
                <Edit className="w-3 h-3" />
                Editar nombre del participante
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-black/95 backdrop-blur-sm">
              <SheetHeader className="pt-6">
                <SheetTitle className="text-white">
                  IA HACK<span className="text-yellow-400">A</span>THON
                </SheetTitle>
                <SheetDescription className="text-gray-400">
                  Únete a la plataforma de <span className="text-white font-semibold">innovación</span> de la región.
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-8 px-1">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Nombre Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={cardData.name}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400/20"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Título/Cargo
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={cardData.title}
                    onChange={(e) => onInputChange('title', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400/20"
                    placeholder="Ej: Desarrollador Full Stack"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-300">
                    Empresa/Organización
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={cardData.company}
                    onChange={(e) => onInputChange('company', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400/20"
                    placeholder="Ej: Tech Company"
                  />
                </div>
                
                <Button
                  onClick={handleGenerateCard}
                  disabled={isGenerating}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold mt-8"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Generando...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generar Insignia
                    </>
                  )}
                </Button>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">ORGANIZADO POR</p>
                <p className="text-sm font-bold text-white">COLOMBIA TECH WEEK</p>
              </div>
            </SheetContent>
          </Sheet>
        </p>
        
        {/* Social Share - Mobile Bottom */}
        <div className="flex flex-row gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => onShare('download')}
            className="flex items-center gap-2 px-3 py-2 bg-[#ffdd00] hover:bg-yellow-400 text-black rounded-lg transition-colors font-medium whitespace-nowrap text-xs"
          >
            <Download className="w-3 h-3" />
            Descargar
          </button>
          
          <button
            onClick={() => onShare('x')}
            className="flex items-center gap-2 px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors border border-gray-600 whitespace-nowrap text-xs"
          >
            <XIcon className="w-3 h-3" />
            X
          </button>
          
          <button
            onClick={() => onShare('linkedin')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors whitespace-nowrap text-xs"
          >
            <Linkedin className="w-3 h-3" />
            LinkedIn
          </button>
          
          <button
            onClick={() => onShare('copy')}
            data-share="copy"
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 whitespace-nowrap text-xs"
          >
            <Copy className="w-3 h-3" />
            Copiar
          </button>
        </div>
      </div>

      {/* 3D Card Scene */}
      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${
        showTextAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`} style={{ marginLeft: isMobile ? '0px' : '500px' }}>
        <Canvas 
          camera={{ position: [5, 0, 13], fov: isMobile ? 35 : 25 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={Math.PI * 0.2} />
          <Physics
            interpolate
            gravity={[0, -40, 0]}
            timeStep={1 / 60}
          >
            <Band 
              key={cardTexture}
              cardData={{
                name: "",
                title: "",
                company: "",
                namePosition: [0, 0.2, 0.1],
                titlePosition: [0, -0.1, 0.1],
                companyPosition: [0, -0.35, 0.1],
                fontSize: 0.08
              }}
              customTextureUrl={cardTexture}
              textureSettings={textureSettings}
              bandSettings={bandSettings}
              textIntegration={textIntegration}
              showText={false}
              maxSpeed={isGenerating ? 80 : 50}
              minSpeed={isGenerating ? 20 : 10}
            />
          </Physics>
          <Environment background blur={0.75}>
            <color attach="background" args={["#000000"]} />
            <Lightformer
              intensity={1}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={2}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={2}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={5}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      </div>
    </>
  );
}; 