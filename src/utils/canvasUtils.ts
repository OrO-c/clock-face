// src/utils/canvasUtils.ts
export const generateNumberText = (index: number, style: string): string => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const chineseNumerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  
  switch (style) {
    case 'roman':
      return romanNumerals[index] || (index + 1).toString();
    case 'chinese':
      return chineseNumerals[index] || (index + 1).toString();
    case 'none':
      return '';
    default:
      return (index + 1).toString();
  }
};

export const calculatePosition = (
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): { x: number; y: number } => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: centerX + radius * Math.sin(rad),
    y: centerY - radius * Math.cos(rad),
  };
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
