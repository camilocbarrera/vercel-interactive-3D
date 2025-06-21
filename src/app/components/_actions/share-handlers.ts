import { CardData } from '../_types/card';
import { captureScene } from './scene-capture';

export const handleShare = (platform: string, cardData: CardData) => {
  if (typeof window === 'undefined') return;

  const shareData = {
    title: `Mi insignia de IA HACKATHON - ${cardData.name}`,
    text: `🎯 ¡Soy ${cardData.name}, ${cardData.title} en ${cardData.company}!\n\n🚀 Participando en IA HACKATHON - Edición Agosto 2025\n💡 Únete a la plataforma de innovación de la región\n\n#IAHackathon #ColombiaInnovation #TechWeek #InteligenciaArtificial`,
    url: window.location.href
  };

  switch (platform) {
    case 'download':
      const capture = captureScene(cardData);
      if (capture) {
        const link = document.createElement('a');
        link.download = `ia-hackathon-insignia-${cardData.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = capture;
        link.click();
      }
      break;
    
    case 'x':
      const xText = encodeURIComponent(`🎯 ¡Mi insignia personalizada para IA HACKATHON!\n\n${cardData.name} | ${cardData.title}\n${cardData.company}\n\n🚀 #IAHackathon #ColombiaInnovation #TechWeek`);
      window.open(`https://twitter.com/intent/tweet?text=${xText}&url=${encodeURIComponent(window.location.href)}`, '_blank');
      break;
    
    case 'linkedin':
      const linkedinText = encodeURIComponent(`Participando en IA HACKATHON - Edición Agosto 2025. ¡Únete a la plataforma de innovación de la región!`);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${linkedinText}`, '_blank');
      break;
    
    case 'copy':
      const capture2 = captureScene(cardData);
      if (capture2 && navigator.clipboard) {
        // Try to copy the image to clipboard
        fetch(capture2)
          .then(res => res.blob())
          .then(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            return navigator.clipboard.write([item]);
          })
          .then(() => {
            // Show success feedback
            const button = document.querySelector('[data-share="copy"]') as HTMLElement;
            if (button) {
              const originalText = button.textContent;
              button.textContent = '¡Copiado!';
              setTimeout(() => {
                button.textContent = originalText;
              }, 2000);
            }
          })
          .catch(() => {
            // Fallback: copy the URL to clipboard
            navigator.clipboard.writeText(`${shareData.text}\n\n${window.location.href}`)
              .then(() => {
                const button = document.querySelector('[data-share="copy"]') as HTMLElement;
                if (button) {
                  const originalText = button.textContent;
                  button.textContent = '¡Enlace copiado!';
                  setTimeout(() => {
                    button.textContent = originalText;
                  }, 2000);
                }
              });
          });
      } else {
        // Fallback for browsers without clipboard support
        navigator.clipboard?.writeText(`${shareData.text}\n\n${window.location.href}`);
      }
      break;
  }
}; 