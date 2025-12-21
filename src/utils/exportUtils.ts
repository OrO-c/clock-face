// src/utils/exportUtils.ts
import { Stage } from 'konva';
import { saveAs } from 'file-saver';

export const exportAsPNG = async (stageRef: React.RefObject<Stage>, dpi: number = 300) => {
  if (!stageRef.current) return null;
  
  try {
    const stage = stageRef.current;
    const scale = dpi / 96; // 96是屏幕DPI
    
    const dataURL = stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: scale,
    });
    
    return dataURL;
  } catch (error) {
    console.error('导出PNG失败:', error);
    return null;
  }
};

export const exportAsSVG = (stageRef: React.RefObject<Stage>) => {
  if (!stageRef.current) return null;
  
  try {
    const stage = stageRef.current;
    const svg = stage.toSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    return blob;
  } catch (error) {
    console.error('导出SVG失败:', error);
    return null;
  }
};

export const downloadImage = (blob: Blob | string, filename: string) => {
  if (typeof blob === 'string') {
    // 处理DataURL
    const link = document.createElement('a');
    link.download = filename;
    link.href = blob;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // 处理Blob
    saveAs(blob, filename);
  }
};

export const generateFilename = (type: 'png' | 'svg') => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
  return `clock-face-${timestamp}.${type}`;
};