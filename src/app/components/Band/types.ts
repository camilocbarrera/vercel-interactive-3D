export interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  customTextureUrl?: string | null;
  textureSettings?: {
    scaleWidth: number;
    scaleHeight: number;
    positionX: number;
    positionY: number;
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
  bandSettings?: {
    customBandTextureUrl: string | null;
    bandRepeatX: number;
    bandRepeatY: number;
    bandColor: string;
  };
  textIntegration?: {
    style: string;
    depth: number;
    opacity: number;
    emissive: number;
    metalness: number;
    roughness: number;
  };
  showText?: boolean;
  cardData?: {
    name: string;
    title: string;
    company: string;
    namePosition?: [number, number, number];
    titlePosition?: [number, number, number];
    companyPosition?: [number, number, number];
    fontSize?: number;
  };
}

export interface TextMaterialProps {
  metalness: number;
  roughness: number;
  transparent?: boolean;
  opacity: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
}

export type TextIntegrationStyle = 
  | "embossed" 
  | "engraved" 
  | "glowing" 
  | "metallic" 
  | "transparent" 
  | "floating"; 