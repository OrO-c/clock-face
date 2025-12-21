// src/stores/useClockStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ClockConfig, ControlTab } from '../types';

interface ClockStore extends ClockConfig {
  // UI状态
  activeTab: ControlTab;
  setActiveTab: (tab: ControlTab) => void;
  
  // 更新方法
  updateCanvas: (data: Partial<ClockConfig['canvas']>) => void;
  updateBackground: (data: Partial<ClockConfig['background']>) => void;
  updateMajorScales: (data: Partial<ClockConfig['majorScales']>) => void;
  updateMinorScales: (data: Partial<ClockConfig['minorScales']>) => void;
  updateNumbers: (data: Partial<ClockConfig['numbers']>) => void;
  updateCenter: (data: Partial<ClockConfig['center']>) => void;
  
  // 工具方法
  resetToDefault: () => void;
  loadPreset: (preset: Partial<ClockConfig>) => void;
}

const defaultConfig: ClockConfig = {
  canvas: {
    width: 800,
    height: 800,
    dpi: 72,
    backgroundColor: '#ffffff',
    transparent: false,
  },
  background: {
    type: 'color',
    color: '#f8fafc',
    gradient: {
      type: 'radial',
      colors: ['#ffffff', '#e2e8f0'],
      angle: 0,
    },
    image: {
      url: '',
      opacity: 1,
      scale: 1,
    },
    pattern: {
      type: 'none',
      color: '#cbd5e1',
      size: 10,
    },
  },
  majorScales: {
    visible: true,
    count: 12,
    length: 30,
    width: 3,
    color: '#334155',
    shape: 'line',
    position: 'outside',
    rotation: 0,
  },
  minorScales: {
    visible: true,
    count: 60,
    length: 15,
    width: 1,
    color: '#94a3b8',
    shape: 'line',
  },
  numbers: {
    visible: true,
    style: 'arabic',
    fontFamily: 'Arial, sans-serif',
    fontSize: 36,
    color: '#1e293b',
    rotation: 'radial',
    position: 0.75,
    customTexts: Array(12).fill('').map((_, i) => (i + 1).toString()),
  },
  center: {
    visible: true,
    size: 10,
    color: '#dc2626',
    style: 'circle',
  },
};

export const useClockStore = create<ClockStore>()(
  immer((set, get) => ({
    ...defaultConfig,
    activeTab: 'background',
    
    setActiveTab: (tab) => set({ activeTab: tab }),
    
    updateCanvas: (data) => set((state) => {
      Object.assign(state.canvas, data);
    }),
    
    updateBackground: (data) => set((state) => {
      Object.assign(state.background, data);
    }),
    
    updateMajorScales: (data) => set((state) => {
      Object.assign(state.majorScales, data);
    }),
    
    updateMinorScales: (data) => set((state) => {
      Object.assign(state.minorScales, data);
    }),
    
    updateNumbers: (data) => set((state) => {
      Object.assign(state.numbers, data);
    }),
    
    updateCenter: (data) => set((state) => {
      Object.assign(state.center, data);
    }),
    
    resetToDefault: () => set(defaultConfig),
    
    loadPreset: (preset) => set((state) => {
      Object.assign(state, preset);
    }),
  }))
);
