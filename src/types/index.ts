// src/types/index.ts
export interface ClockConfig {
  // 画布设置
  canvas: {
    width: number;
    height: number;
    dpi: number;
    backgroundColor: string;
    transparent: boolean;
  };
  
  // 背景
  background: {
    type: 'color' | 'gradient' | 'image' | 'pattern';
    color: string;
    gradient: {
      type: 'linear' | 'radial';
      colors: string[];
      angle: number;
    };
    image: {
      url: string;
      opacity: number;
      scale: number;
    };
    pattern: {
      type: 'none' | 'grid' | 'dots' | 'lines';
      color: string;
      size: number;
    };
  };
  
  // 主刻度（整点）
  majorScales: {
    visible: boolean;
    count: number;
    length: number;
    width: number;
    color: string;
    shape: 'line' | 'triangle' | 'circle' | 'rectangle';
    position: 'inside' | 'outside' | 'center';
    rotation: number;
  };
  
  // 副刻度
  minorScales: {
    visible: boolean;
    count: number; // 通常是60
    length: number;
    width: number;
    color: string;
    shape: 'line' | 'dot';
  };
  
  // 数字
  numbers: {
    visible: boolean;
    style: 'arabic' | 'roman' | 'chinese' | 'none' | 'custom';
    fontFamily: string;
    fontSize: number;
    color: string;
    rotation: 'radial' | 'horizontal';
    position: number; // 半径比例 0.7-0.9
    customTexts: string[];
  };
  
  // 中心点
  center: {
    visible: boolean;
    size: number;
    color: string;
    style: 'circle' | 'decorative' | 'none';
  };
}

export type ControlTab = 'background' | 'scales' | 'numbers' | 'canvas' | 'export';
