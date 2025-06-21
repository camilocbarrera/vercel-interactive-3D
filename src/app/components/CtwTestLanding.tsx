"use client";

import { useState, useEffect, useCallback } from "react";
import { CardData } from './_types/card';
import { generateCardTexture, generateBandTexture } from './_actions/texture-generation';
import { handleShare } from './_actions/share-handlers';
import { HeroSection } from './_components/HeroSection';
import { SceneSection } from './_components/SceneSection';

export default function CtwTestLanding() {
  const [cardData, setCardData] = useState<CardData>({
    name: "Cristian Correa",
    title: "Sr Vibe Coder Engineer",
    company: "ACC"
  });

  const [cardTexture, setCardTexture] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showScene, setShowScene] = useState(false);
  const [showTextAnimation, setShowTextAnimation] = useState(false);
  const [bandTexture, setBandTexture] = useState<string | null>(null);

  const handleGenerateCardTexture = useCallback(() => {
    setIsGenerating(true);
    
    try {
      const dataURL = generateCardTexture(cardData);
      setCardTexture(dataURL);
      
      // Transition to scene view
      setTimeout(() => {
        setIsGenerating(false);
        setShowScene(true);
        // Trigger text animation after scene appears
        setTimeout(() => {
          setShowTextAnimation(true);
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Error generating card texture:', error);
      setIsGenerating(false);
    }
  }, [cardData]);

  useEffect(() => {
    try {
      const texture = generateBandTexture();
      setBandTexture(texture);
    } catch (error) {
      console.error('Error generating band texture:', error);
    }
  }, []);

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShareAction = useCallback((platform: string) => {
    handleShare(platform, cardData);
  }, [cardData]);

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden">
      {!showScene ? (
        <HeroSection
          cardData={cardData}
          isGenerating={isGenerating}
          onInputChange={handleInputChange}
          onGenerateCard={handleGenerateCardTexture}
        />
      ) : (
        <SceneSection
          cardData={cardData}
          cardTexture={cardTexture}
          bandTexture={bandTexture}
          isGenerating={isGenerating}
          showSidebar={showSidebar}
          showTextAnimation={showTextAnimation}
          onSetShowSidebar={setShowSidebar}
          onInputChange={handleInputChange}
          onGenerateCard={handleGenerateCardTexture}
          onShare={handleShareAction}
        />
      )}
    </div>
  );
} 