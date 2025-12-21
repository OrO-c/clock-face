// src/utils/presetData.ts
import { ClockConfig } from '../types';

export const presets: Record<string, Partial<ClockConfig>> = {
  classic: {
    background: {
      type: 'color',
      color: '#fef3c7',
    },
    majorScales: {
      color: '#92400e',
      shape: 'line',
      length: 40,
    },
    numbers: {
      style: 'roman',
      fontFamily: 'Times New Roman',
      color: '#92400e',
    },
    center: {
      color: '#92400e',
      size: 12,
    },
  },
  modern: {
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        colors: ['#0f172a', '#1e293b'],
        angle: 45,
      },
    },
    majorScales: {
      color: '#e2e8f0',
      shape: 'triangle',
      position: 'inside',
    },
    minorScales: {
      color: '#475569',
    },
    numbers: {
      color: '#e2e8f0',
      style: 'arabic',
      fontSize: 32,
    },
    center: {
      color: '#3b82f6',
    },
  },
  minimal: {
    background: {
      type: 'color',
      color: '#ffffff',
    },
    majorScales: {
      visible: false,
    },
    minorScales: {
      visible: false,
    },
    numbers: {
      fontSize: 48,
      color: '#000000',
      position: 0.85,
    },
    center: {
      style: 'none',
    },
  },
  vintage: {
    background: {
      type: 'pattern',
      pattern: {
        type: 'grid',
        color: '#d6d3d1',
        size: 8,
      },
    },
    majorScales: {
      shape: 'rectangle',
      color: '#57534e',
    },
    numbers: {
      style: 'chinese',
      fontFamily: 'SimSun, serif',
      color: '#57534e',
    },
  },
};