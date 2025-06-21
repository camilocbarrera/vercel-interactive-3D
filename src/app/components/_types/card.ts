export interface CardData {
  name: string;
  title: string;
  company: string;
}

export interface TextureSettings {
  scaleWidth: number;
  scaleHeight: number;
  positionX: number;
  positionY: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export interface BandSettings {
  customBandTextureUrl: string | null;
  bandRepeatX: number;
  bandRepeatY: number;
  bandColor: string;
}

export interface TextIntegration {
  style: string;
  depth: number;
  opacity: number;
  emissive: number;
  metalness: number;
  roughness: number;
} 