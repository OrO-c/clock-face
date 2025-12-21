// src/App.tsx
import React from 'react';
import { ClockCanvas } from './components/Canvas/ClockCanvas';
import { ControlPanel } from './components/Controls/ControlPanel';
import { PresetSelector } from './components/UI/PresetSelector';
import { Github, Palette } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">钟表盘面设计器</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：画布和预设 */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">设计预览</h2>
                <span className="text-sm text-gray-500">实时预览 • 可拖拽调整</span>
              </div>
              <ClockCanvas />
            </div>
            
            <PresetSelector />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">使用提示</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 先选择预设快速开始，然后微调各项参数</li>
                <li>• 导出时选择300 DPI可获得最佳打印效果</li>
                <li>• 自定义数字可替换为星座、符号或文字</li>
                <li>• 设计完成后可联系厂家定制实物钟表</li>
              </ul>
            </div>
          </div>

          {/* 右侧：控制面板 */}
          <div>
            <ControlPanel />
            
            {/* 设计说明 */}
            <div className="mt-8 bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-900 mb-3">设计说明</h3>
              <p className="text-sm text-gray-600">
                此设计器专注于钟表盘面底图设计，不包含指针设计。
                完成设计后，可将生成的图片提供给钟表定制厂家制作实物。
                支持高分辨率导出，确保印刷质量。
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>图片上传说明：</strong>支持JPG、PNG、GIF格式，最大5MB。
                  上传的图片会自动调整大小以适应画布。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 钟表盘面设计器 • 专为钟表定制设计
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;