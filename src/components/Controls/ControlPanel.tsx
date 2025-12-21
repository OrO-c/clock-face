// src/components/Controls/ControlPanel.tsx
import React, { useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useClockStore } from '../../stores/useClockStore';
import { exportAsPNG, exportAsSVG, downloadImage, generateFilename } from '../../utils/exportUtils';
import { 
  Palette, 
  Ruler, 
  Type, 
  Settings, 
  Download,
  Image as ImageIcon,
  Circle,
  Square,
  Triangle,
  Minus,
  Droplets,
  Loader2,
  Check,
  X
} from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);
  
  const { 
    activeTab, 
    setActiveTab,
    canvas,
    background,
    majorScales,
    minorScales,
    numbers,
    center,
    updateCanvas,
    updateBackground,
    updateMajorScales,
    updateMinorScales,
    updateNumbers,
    updateCenter,
    resetToDefault
  } = useClockStore();
  
  const tabs = [
    { id: 'background', label: '背景', icon: <Palette size={20} /> },
    { id: 'scales', label: '刻度', icon: <Ruler size={20} /> },
    { id: 'numbers', label: '数字', icon: <Type size={20} /> },
    { id: 'canvas', label: '画布', icon: <Settings size={20} /> },
    { id: 'export', label: '导出', icon: <Download size={20} /> },
  ];

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    // 创建临时URL
    const url = URL.createObjectURL(file);
    updateBackground({ 
      type: 'image',
      image: { 
        ...background.image, 
        url 
      } 
    });

    // 清理文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 移除背景图片
  const handleRemoveImage = () => {
    if (background.image.url) {
      URL.revokeObjectURL(background.image.url);
    }
    updateBackground({ 
      type: 'color',
      image: { ...background.image, url: '' } 
    });
  };

  // 导出PNG
  const handleExportPNG = async () => {
    try {
      // 获取画布引用
      const canvasElement = document.querySelector('.konvajs-content canvas');
      if (!canvasElement) {
        throw new Error('找不到画布元素');
      }
      
      const stage = (canvasElement as any).getStage();
      if (!stage) {
        throw new Error('找不到Stage实例');
      }
      
      // 设置缩放比例
      const scale = canvas.dpi / 72; // 基础DPI为72
      
      // 生成DataURL
      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: scale,
      });
      
      // 下载
      const link = document.createElement('a');
      link.download = generateFilename('png');
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('导出PNG失败:', error);
      alert('导出失败，请重试');
      return false;
    }
  };

  // 导出SVG
  const handleExportSVG = async () => {
    try {
      // 获取画布引用
      const canvasElement = document.querySelector('.konvajs-content canvas');
      if (!canvasElement) {
        throw new Error('找不到画布元素');
      }
      
      const stage = (canvasElement as any).getStage();
      if (!stage) {
        throw new Error('找不到Stage实例');
      }
      
      // 生成SVG
      const svg = stage.toSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      
      // 下载
      const link = document.createElement('a');
      link.download = generateFilename('svg');
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
      
      return true;
    } catch (error) {
      console.error('导出SVG失败:', error);
      alert('导出失败，请重试');
      return false;
    }
  };

  // 导出配置
  const [exporting, setExporting] = React.useState(false);
  const [exportQuality, setExportQuality] = React.useState<'screen' | 'print' | 'high'>('print');

  const handleExport = async (type: 'png' | 'svg') => {
    setExporting(true);
    
    try {
      let success = false;
      if (type === 'png') {
        success = await handleExportPNG();
      } else {
        success = await handleExportSVG();
      }
      
      if (success) {
        alert('导出成功！');
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const renderBackgroundTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">背景类型</label>
        <div className="grid grid-cols-2 gap-2">
          {(['color', 'gradient', 'image'] as const).map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg border ${
                background.type === type
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => updateBackground({ type })}
            >
              {type === 'color' && '纯色'}
              {type === 'gradient' && '渐变'}
              {type === 'image' && '图片'}
            </button>
          ))}
        </div>
      </div>

      {background.type === 'color' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
          <div className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded border border-gray-300"
              style={{ backgroundColor: background.color }}
            />
            <HexColorPicker
              color={background.color}
              onChange={(color) => updateBackground({ color })}
              style={{ width: '100%', height: '120px' }}
            />
          </div>
        </div>
      )}

      {background.type === 'gradient' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">渐变类型</label>
            <div className="flex space-x-2">
              {(['linear', 'radial'] as const).map((gradType) => (
                <button
                  key={gradType}
                  className={`px-4 py-2 rounded-lg border ${
                    background.gradient.type === gradType
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => updateBackground({ 
                    gradient: { ...background.gradient, type: gradType } 
                  })}
                >
                  {gradType === 'linear' ? '线性' : '径向'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">渐变颜色</label>
            <div className="flex space-x-2">
              {background.gradient.colors.map((color, index) => (
                <div key={index} className="flex-1">
                  <div 
                    className="w-full h-8 rounded border border-gray-300 mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <HexColorPicker
                    color={color}
                    onChange={(newColor) => {
                      const newColors = [...background.gradient.colors];
                      newColors[index] = newColor;
                      updateBackground({
                        gradient: { ...background.gradient, colors: newColors }
                      });
                    }}
                    style={{ width: '100%', height: '100px' }}
                  />
                </div>
              ))}
            </div>
          </div>
          {background.gradient.type === 'linear' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                渐变角度: {background.gradient.angle}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={background.gradient.angle}
                onChange={(e) => updateBackground({
                  gradient: { ...background.gradient, angle: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {background.type === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">背景图片</label>
            
            {background.image.url ? (
              <div className="space-y-3">
                <div className="relative">
                  <div 
                    className="w-full h-32 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden"
                  >
                    <img 
                      src={background.image.url} 
                      alt="背景预览" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Check size={16} className="mr-1" />
                  已上传背景图片
                </div>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600">点击上传图片</p>
                <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG, GIF 格式，最大 5MB</p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            
            {!background.image.url && (
              <button
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => fileInputRef.current?.click()}
              >
                选择图片
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                透明度: {(background.image.opacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={background.image.opacity}
                onChange={(e) => updateBackground({
                  image: { ...background.image, opacity: parseFloat(e.target.value) }
                })}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                缩放: {background.image.scale.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={background.image.scale}
                onChange={(e) => updateBackground({
                  image: { ...background.image, scale: parseFloat(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderScalesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Ruler className="mr-2" size={18} />
            主刻度
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">显示</span>
              <input
                type="checkbox"
                checked={majorScales.visible}
                onChange={(e) => updateMajorScales({ visible: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数量: {majorScales.count}
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={majorScales.count}
                onChange={(e) => updateMajorScales({ count: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                长度: {majorScales.length}px
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={majorScales.length}
                onChange={(e) => updateMajorScales({ length: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">形状</label>
              <div className="flex space-x-2">
                {(['line', 'triangle', 'circle', 'rectangle'] as const).map((shape) => (
                  <button
                    key={shape}
                    className={`p-2 rounded border ${
                      majorScales.shape === shape
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => updateMajorScales({ shape })}
                  >
                    {shape === 'line' && <Minus size={20} />}
                    {shape === 'triangle' && <Triangle size={20} />}
                    {shape === 'circle' && <Circle size={20} />}
                    {shape === 'rectangle' && <Square size={20} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: majorScales.color }}
                />
                <HexColorPicker
                  color={majorScales.color}
                  onChange={(color) => updateMajorScales({ color })}
                  style={{ width: '100px', height: '100px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Droplets className="mr-2" size={18} />
            副刻度
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">显示</span>
              <input
                type="checkbox"
                checked={minorScales.visible}
                onChange={(e) => updateMinorScales({ visible: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密度: {minorScales.count}
              </label>
              <select
                value={minorScales.count}
                onChange={(e) => updateMinorScales({ count: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={60}>每分钟 (60个)</option>
                <option value={30}>每2分钟 (30个)</option>
                <option value={15}>每5分钟 (15个)</option>
                <option value={12}>每5分钟对应主刻度 (12个)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                长度: {minorScales.length}px
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={minorScales.length}
                onChange={(e) => updateMinorScales({ length: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">形状</label>
              <div className="flex space-x-2">
                {(['line', 'dot'] as const).map((shape) => (
                  <button
                    key={shape}
                    className={`px-4 py-2 rounded border ${
                      minorScales.shape === shape
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => updateMinorScales({ shape })}
                  >
                    {shape === 'line' ? '线条' : '圆点'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
              <HexColorPicker
                color={minorScales.color}
                onChange={(color) => updateMinorScales({ color })}
                style={{ width: '100%', height: '100px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNumbersTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">显示数字</span>
          <input
            type="checkbox"
            checked={numbers.visible}
            onChange={(e) => updateNumbers({ visible: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">数字样式</label>
          <div className="grid grid-cols-3 gap-2">
            {(['arabic', 'roman', 'chinese', 'none', 'custom'] as const).map((style) => (
              <button
                key={style}
                className={`px-3 py-2 rounded-lg border ${
                  numbers.style === style
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => updateNumbers({ style })}
              >
                {style === 'arabic' && '阿拉伯'}
                {style === 'roman' && '罗马'}
                {style === 'chinese' && '中文'}
                {style === 'none' && '无'}
                {style === 'custom' && '自定义'}
              </button>
            ))}
          </div>
        </div>

        {numbers.style === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">自定义数字</label>
            <div className="grid grid-cols-3 gap-2">
              {numbers.customTexts.map((text, index) => (
                <input
                  key={index}
                  type="text"
                  value={text}
                  onChange={(e) => {
                    const newTexts = [...numbers.customTexts];
                    newTexts[index] = e.target.value;
                    updateNumbers({ customTexts: newTexts });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-center"
                  placeholder={`${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              字体大小: {numbers.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={numbers.fontSize}
              onChange={(e) => updateNumbers({ fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              位置: {(numbers.position * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.6"
              max="0.9"
              step="0.01"
              value={numbers.position}
              onChange={(e) => updateNumbers({ position: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
          <HexColorPicker
            color={numbers.color}
            onChange={(color) => updateNumbers({ color })}
            style={{ width: '100%', height: '100px' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">旋转方式</label>
          <div className="flex space-x-2">
            {(['radial', 'horizontal'] as const).map((rotation) => (
              <button
                key={rotation}
                className={`px-4 py-2 rounded border ${
                  numbers.rotation === rotation
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => updateNumbers({ rotation })}
              >
                {rotation === 'radial' ? '径向' : '水平'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCanvasTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">画布尺寸</label>
          <div className="space-y-2">
            {([800, 1000, 1200, 2000] as const).map((size) => (
              <button
                key={size}
                className={`w-full px-4 py-2 rounded-lg border ${
                  canvas.width === size
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => updateCanvas({ width: size, height: size })}
              >
                {size} × {size} px
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DPI</label>
            <select
              value={canvas.dpi}
              onChange={(e) => updateCanvas({ dpi: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={72}>72 DPI (屏幕)</option>
              <option value={150}>150 DPI (普通打印)</option>
              <option value={300}>300 DPI (高清打印)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">透明背景</span>
            <input
              type="checkbox"
              checked={canvas.transparent}
              onChange={(e) => updateCanvas({ transparent: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          
          {!canvas.transparent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
              <HexColorPicker
                color={canvas.backgroundColor}
                onChange={(color) => updateCanvas({ backgroundColor: color })}
                style={{ width: '100%', height: '100px' }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <button
          onClick={resetToDefault}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          重置为默认设置
        </button>
      </div>
    </div>
  );

  const renderExportTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">导出设置</h3>
        
        {/* 导出质量选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">导出质量</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'screen', label: '屏幕显示', dpi: 72 },
              { id: 'print', label: '普通打印', dpi: 150 },
              { id: 'high', label: '高清印刷', dpi: 300 }
            ] as const).map((option) => (
              <button
                key={option.id}
                className={`px-3 py-3 rounded-lg border ${
                  canvas.dpi === option.dpi
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => updateCanvas({ dpi: option.dpi })}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-75">{option.dpi} DPI</div>
              </button>
            ))}
          </div>
        </div>

        {/* 导出格式 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
          <div className="space-y-3">
            <button
              onClick={() => handleExport('png')}
              disabled={exporting}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  正在导出...
                </>
              ) : (
                <>
                  <Download className="mr-2" size={20} />
                  导出 PNG 图片
                </>
              )}
            </button>
            
            <button
              onClick={() => handleExport('svg')}
              disabled={exporting}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  正在导出...
                </>
              ) : (
                <>
                  <Download className="mr-2" size={20} />
                  导出 SVG 矢量图
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* 导出说明 */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">导出说明</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="inline-block w-6 flex-shrink-0">•</span>
              <span>PNG: 适合所有用途，支持透明背景</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 flex-shrink-0">•</span>
              <span>SVG: 矢量格式，可无限放大不失真</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 flex-shrink-0">•</span>
              <span>导出文件名包含时间戳，避免重复</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 flex-shrink-0">•</span>
              <span>导出过程可能需要几秒钟，请耐心等待</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'background':
        return renderBackgroundTab();
      case 'scales':
        return renderScalesTab();
      case 'numbers':
        return renderNumbersTab();
      case 'canvas':
        return renderCanvasTab();
      case 'export':
        return renderExportTab();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* 内容区域 */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};
