import { CardData } from '../_types/card';

export const captureScene = (cardData: CardData): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Create a composite canvas
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = 1200;
    compositeCanvas.height = 630; // Standard social media aspect ratio
    const ctx = compositeCanvas.getContext('2d');
    
    if (!ctx) return null;

    // Fill background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1200, 630);

    // Add left side text content
    ctx.fillStyle = '#ffdd00';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('— EDICIÓN AGOSTO 2025', 50, 100);

    // Main title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('IA HACK', 50, 160);
    ctx.fillStyle = '#ffdd00';
    ctx.fillText('A', 200, 160);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('THON', 230, 160);

    // Description
    ctx.fillStyle = '#999999';
    ctx.font = '18px Arial';
    ctx.fillText('Únete a la plataforma de', 50, 220);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('innovación', 250, 220);
    ctx.fillStyle = '#999999';
    ctx.font = '18px Arial';
    ctx.fillText('de la región.', 350, 220);

    // Additional text
    ctx.fillStyle = '#999999';
    ctx.font = '14px Arial';
    ctx.fillText('Crea tu insignia personalizada.', 50, 280);

    // Participant info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(cardData.name, 50, 450);
    ctx.fillStyle = '#ffdd00';
    ctx.font = '16px Arial';
    ctx.fillText(cardData.title, 50, 480);
    ctx.fillStyle = '#cccccc';
    ctx.font = '14px Arial';
    ctx.fillText(cardData.company, 50, 510);

    // Share buttons area
    ctx.fillStyle = '#333333';
    ctx.font = '12px Arial';
    ctx.fillText('SHARE ON:', 50, 580);
    ctx.fillText('Download • Twitter • LinkedIn • Copy', 150, 580);

    // Capture the Three.js canvas
    const threeCanvas = document.querySelector('canvas');
    if (threeCanvas) {
      // Scale and position the 3D scene on the right side
      const sceneWidth = 500;
      const sceneHeight = 600;
      const sceneX = 650;
      const sceneY = 15;
      
      ctx.drawImage(threeCanvas, sceneX, sceneY, sceneWidth, sceneHeight);
    }

    // Add branding at bottom
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ORGANIZADO POR COLOMBIA TECH WEEK', 600, 610);

    const dataURL = compositeCanvas.toDataURL('image/png', 1.0);
    return dataURL;
  } catch (error) {
    console.error('Error capturing composite scene:', error);
    
    // Fallback: try to capture just the canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      try {
        const dataURL = canvas.toDataURL('image/png', 1.0);
        return dataURL;
      } catch (fallbackError) {
        console.error('Fallback capture also failed:', fallbackError);
      }
    }
    
    return null;
  }
}; 