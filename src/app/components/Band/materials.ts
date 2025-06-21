import { TextMaterialProps, TextIntegrationStyle } from './types';

export const getTextMaterialProps = (
  textIntegration: { 
    style: string; 
    metalness: number; 
    roughness: number; 
    opacity: number; 
    emissive: number; 
  },
  isMainText: boolean = true
): TextMaterialProps => {
  const baseProps: TextMaterialProps = {
    metalness: textIntegration.metalness,
    roughness: textIntegration.roughness,
    transparent: textIntegration.opacity < 1,
    opacity: textIntegration.opacity
  };

  switch (textIntegration.style as TextIntegrationStyle) {
    case "embossed":
      return {
        ...baseProps,
        color: isMainText ? "#ffffff" : "#f0f0f0",
        emissive: "#222222",
        emissiveIntensity: 0.1,
        metalness: 0.3,
        roughness: 0.1
      };
    
    case "engraved":
      return {
        ...baseProps,
        color: isMainText ? "#444444" : "#666666",
        emissive: "#000000",
        emissiveIntensity: 0.05,
        metalness: 0.8,
        roughness: 0.4
      };
    
    case "glowing":
      return {
        ...baseProps,
        color: isMainText ? "#ffffff" : "#cccccc",
        emissive: isMainText ? "#00ff88" : "#0088ff",
        emissiveIntensity: textIntegration.emissive,
        metalness: 0.1,
        roughness: 0.1
      };
    
    case "metallic":
      return {
        ...baseProps,
        color: isMainText ? "#c0c0c0" : "#a0a0a0",
        emissive: "#111111",
        emissiveIntensity: 0.2,
        metalness: 0.9,
        roughness: 0.1
      };
    
    case "transparent":
      return {
        ...baseProps,
        color: isMainText ? "#ffffff" : "#cccccc",
        transparent: true,
        opacity: Math.max(0.3, textIntegration.opacity * 0.7),
        metalness: 0.2,
        roughness: 0.3
      };
    
    case "floating":
    default:
      return {
        ...baseProps,
        color: isMainText ? "#ffffff" : (isMainText === false ? "#cccccc" : "#00ff88"),
        metalness: textIntegration.metalness,
        roughness: textIntegration.roughness
      };
  }
};

export const getTextDepth = (
  textIntegration: { style: string; depth: number },
  isMainText: boolean = true
): number => {
  const baseDepth = textIntegration.depth;
  
  switch (textIntegration.style as TextIntegrationStyle) {
    case "engraved":
      return Math.max(0.002, baseDepth * 0.5);
    case "embossed":
      return baseDepth * 1.8;
    case "floating":
      return baseDepth;
    default:
      return baseDepth;
  }
}; 