import { CardData } from '../_types/card';

export const generateCardTexture = (cardData: CardData): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Clear canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1024, 1024);

  // Create the card design (matching the business card style)
  
  // Left side - Dark area with large text
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 512, 1024);

  // Right side - Light area
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(512, 0, 512, 1024);

  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  
  // IA HACKATHON with yellow A
  ctx.fillText('IA HACK', 30, 60);
  ctx.fillStyle = '#ffdd00';
  ctx.fillText('A', 140, 60);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('THON', 165, 60);
  
  // Subtitle
  ctx.fillStyle = '#ffdd00';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('— EDICIÓN AGOSTO 2025', 30, 85);

  // Large decorative text/numbers (IA style)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 200px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('IA', 256, 420);

  // Add some decorative dots (like in the original)
  ctx.fillStyle = '#ffdd00'; // Yellow dots
  for (let i = 0; i < 30; i++) {
    const x = 180 + Math.random() * 120;
    const y = 120 + Math.random() * 60;
    const size = Math.random() * 4 + 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Name on left side
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'left';
  const nameLines = cardData.name.split(' ');
  nameLines.forEach((line, index) => {
    ctx.fillText(line, 30, 580 + (index * 55));
  });

  // Title/Role
  ctx.fillStyle = '#ffdd00';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(cardData.title, 30, 690);
  
  // Company
  ctx.fillStyle = '#cccccc';
  ctx.font = '20px Arial';
  ctx.fillText(cardData.company, 30, 720);

  // Right side content
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('AGOSTO 2025', 768, 200);
  
  // Event details
  ctx.font = '14px Arial';
  ctx.fillText('Plataforma de', 768, 230);
  ctx.font = 'bold 16px Arial';
  ctx.fillText('INNOVACIÓN', 768, 250);

  // QR Code placeholder (simple pattern)
  ctx.fillStyle = '#000000';
  const qrSize = 160;
  const qrX = 688;
  const qrY = 280;
  
  // Create a simple QR-like pattern
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      if (Math.random() > 0.5) {
        ctx.fillRect(qrX + (i * 10), qrY + (j * 10), 8, 8);
      }
    }
  }

  // Add corner markers for QR code
  ctx.fillRect(qrX, qrY, 30, 30);
  ctx.fillRect(qrX + qrSize - 30, qrY, 30, 30);
  ctx.fillRect(qrX, qrY + qrSize - 30, 30, 30);
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX + 8, qrY + 8, 14, 14);
  ctx.fillRect(qrX + qrSize - 22, qrY + 8, 14, 14);
  ctx.fillRect(qrX + 8, qrY + qrSize - 22, 14, 14);

  // IA HACKATHON branding at bottom right
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('IA HACK', 740, 480);
  ctx.fillStyle = '#ffdd00';
  ctx.fillText('A', 780, 480);
  ctx.fillStyle = '#000000';
  ctx.fillText('THON', 795, 480);
  
  // Yellow accent square
  ctx.fillStyle = '#ffdd00';
  ctx.fillRect(820, 465, 12, 12);

  // Organizer branding
  ctx.fillStyle = '#666666';
  ctx.font = '10px Arial';
  ctx.fillText('ORGANIZADO POR', 768, 520);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('COLOMBIA TECH WEEK', 768, 535);

  // Convert canvas to data URL
  return canvas.toDataURL('image/png');
};

export const generateBandTexture = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Create a rope/chain pattern
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, 128, 32);

  // Add chain links pattern
  for (let i = 0; i < 8; i++) {
    const x = i * 16;
    
    // Chain link
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + 8, 16, 6, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner highlight
    ctx.strokeStyle = '#777777';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x + 8, 16, 4, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Add some texture detail
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 32;
    const size = Math.random() * 1;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
}; 