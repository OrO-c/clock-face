// src/components/UI/PresetSelector.tsx
import React from 'react';
import { Clock, Star, Moon, Sun, Sparkles } from 'lucide-react';
import { useClockStore } from '../../stores/useClockStore';
import { presets } from '../../utils/presetData';

export const PresetSelector: React.FC = () => {
  const { loadPreset } = useClockStore();
  
  const presetConfigs = [
    { key: 'classic', name: '经典', icon: <Clock size={20} />, color: 'bg-amber-100 text-amber-800' },
    { key: 'modern', name: '现代', icon: <Sparkles size={20} />, color: 'bg-blue-100 text-blue-800' },
    { key: 'minimal', name: '极简', icon: <Sun size={20} />, color: 'bg-gray-100 text-gray-800' },
    { key: 'vintage', name: '复古', icon: <Moon size={20} />, color: 'bg-stone-100 text-stone-800' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">快速预设</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {presetConfigs.map((preset) => (
          <button
            key={preset.key}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 ${preset.color}`}
            onClick={() => loadPreset(presets[preset.key])}
          >
            {preset.icon}
            <span className="mt-2 text-sm font-medium">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
