import React, { useRef, useEffect, useState } from 'react';
import {
  Stage,
  Layer,
  Circle,
  Line,
  Text,
  Image,
  RegularPolygon,
  Rect,
} from 'react-konva';
import { useClockStore } from '../../stores/useClockStore';
import { calculatePosition, generateNumberText } from '../../utils/canvasUtils';

// 自定义 Hook：加载图片并返回状态
const useLoadedImage = (url: string) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    if (!url) {
      setImage(undefined);
      setStatus('loaded');
      return;
    }

    setStatus('loading');
    const img = new window.Image();
    img.crossOrigin = 'anonymous'; // 支持跨域图片
    img.src = url;

    img.onload = () => {
      setImage(img);
      setStatus('loaded');
    };

    img.onerror = () => {
      console.error('图片加载失败:', url);
      setImage(undefined);
      setStatus('error');
    };
  }, [url]);

  return { image, status };
};

export const ClockCanvas: React.FC = () => {
  const stageRef = useRef<any>(null);
  const config = useClockStore();

  const { width, height } = config.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  // 加载背景图
  const { image: bgImage, status: bgImageStatus } = useLoadedImage(config.background.image.url);

  // 渲染主刻度
  const renderMajorScales = () => {
    if (!config.majorScales.visible) return null;

    const scales = [];
    const count = config.majorScales.count;
    const angleStep = 360 / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep + config.majorScales.rotation;
      const startRadius = radius;
      let endRadius;

      switch (config.majorScales.position) {
        case 'inside':
          endRadius = startRadius - config.majorScales.length;
          break;
        case 'outside':
          endRadius = startRadius + config.majorScales.length;
          break;
        case 'center':
        default:
          endRadius = startRadius;
      }

      const startPos = calculatePosition(centerX, centerY, startRadius, angle);
      const endPos = calculatePosition(centerX, centerY, endRadius, angle);

      switch (config.majorScales.shape) {
        case 'triangle':
          scales.push(
            <RegularPolygon
              key={`major-${i}`}
              x={endPos.x}
              y={endPos.y}
              sides={3}
              radius={config.majorScales.length / 2}
              fill={config.majorScales.color}
              rotation={angle + 90}
            />
          );
          break;
        case 'circle':
          scales.push(
            <Circle
              key={`major-${i}`}
              x={endPos.x}
              y={endPos.y}
              radius={config.majorScales.length / 2}
              fill={config.majorScales.color}
            />
          );
          break;
        case 'rectangle':
          scales.push(
            <Rect
              key={`major-${i}`}
              x={endPos.x - config.majorScales.length / 4}
              y={endPos.y - config.majorScales.length}
              width={config.majorScales.length / 2}
              height={config.majorScales.length}
              fill={config.majorScales.color}
              rotation={angle}
            />
          );
          break;
        default: // line
          scales.push(
            <Line
              key={`major-${i}`}
              points={[startPos.x, startPos.y, endPos.x, endPos.y]}
              stroke={config.majorScales.color}
              strokeWidth={config.majorScales.width}
            />
          );
      }
    }

    return scales;
  };

  // 渲染副刻度
  const renderMinorScales = () => {
    if (!config.minorScales.visible) return null;

    const scales = [];
    const count = config.minorScales.count;
    const angleStep = 360 / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      const startRadius = radius;
      const endRadius = startRadius - config.minorScales.length;

      const startPos = calculatePosition(centerX, centerY, startRadius, angle);
      const endPos = calculatePosition(centerX, centerY, endRadius, angle);

      if (config.minorScales.shape === 'dot') {
        scales.push(
          <Circle
            key={`minor-${i}`}
            x={endPos.x}
            y={endPos.y}
            radius={config.minorScales.width}
            fill={config.minorScales.color}
          />
        );
      } else {
        scales.push(
          <Line
            key={`minor-${i}`}
            points={[startPos.x, startPos.y, endPos.x, endPos.y]}
            stroke={config.minorScales.color}
            strokeWidth={config.minorScales.width}
          />
        );
      }
    }

    return scales;
  };

  // 渲染数字
  const renderNumbers = () => {
    if (!config.numbers.visible) return null;

    const numbers = [];
    const count = config.majorScales.count;
    const angleStep = 360 / count;
    const numberRadius = radius * config.numbers.position;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep + config.majorScales.rotation;
      const text =
        config.numbers.style === 'custom'
          ? config.numbers.customTexts[i] || (i + 1).toString()
          : generateNumberText(i, config.numbers.style);

      if (!text) continue;

      const position = calculatePosition(centerX, centerY, numberRadius, angle);

      let rotation = 0;
      if (config.numbers.rotation === 'radial') {
        rotation = angle > 180 ? angle - 180 : angle;
      }

      numbers.push(
        <Text
          key={`number-${i}`}
          x={position.x}
          y={position.y}
          text={text}
          fontSize={config.numbers.fontSize}
          fontFamily={config.numbers.fontFamily}
          fill={config.numbers.color}
          rotation={rotation}
          align="center"
          verticalAlign="middle"
          offsetX={0}
          offsetY={config.numbers.fontSize / 2}
        />
      );
    }

    return numbers;
  };

  // 渲染背景
  const renderBackground = () => {
    switch (config.background.type) {
      case 'gradient':
        return (
          <Rect
            width={width}
            height={height}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: width, y: height }}
            fillLinearGradientColorStops={
              config.background.gradient.type === 'linear'
                ? [0, config.background.gradient.colors[0], 1, config.background.gradient.colors[1]]
                : undefined
            }
            fillRadialGradientStartPoint={{ x: width / 2, y: height / 2 }}
            fillRadialGradientEndPoint={{ x: width / 2, y: height / 2 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndRadius={Math.min(width, height) / 2}
            fillRadialGradientColorStops={
              config.background.gradient.type === 'radial'
                ? [0, config.background.gradient.colors[0], 1, config.background.gradient.colors[1]]
                : undefined
            }
          />
        );

      case 'image':
        if (!config.background.image.url || bgImageStatus === 'error') {
          return <Rect width={width} height={height} fill={config.background.color} />;
        }

        if (bgImageStatus === 'loading') {
          return (
            <>
              <Rect width={width} height={height} fill={config.background.color} />
              <Text
                x={width / 2}
                y={height / 2}
                text="加载图片中..."
                fontSize={20}
                fill="#666"
                align="center"
                verticalAlign="middle"
              />
            </>
          );
        }

        // 只有当 bgImage 是 HTMLImageElement 时才渲染 Image
        return bgImage ? (
          <Image
            image={bgImage}
            width={width}
            height={height}
            opacity={config.background.image.opacity}
          />
        ) : null;

      default:
        return <Rect width={width} height={height} fill={config.background.color} />;
    }
  };

  // 缓存渲染结果，避免重复计算
  const backgroundContent = renderBackground();
  const minorScales = renderMinorScales();
  const majorScales = renderMajorScales();
  const numbers = renderNumbers();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        style={{
          backgroundColor: config.canvas.transparent ? 'transparent' : config.canvas.backgroundColor,
        }}
      >
        <Layer>
          {/* 背景 */}
          {backgroundContent}

          {/* 副刻度 */}
          {minorScales}

          {/* 主刻度 */}
          {majorScales}

          {/* 数字 */}
          {numbers}

          {/* 中心点 */}
          {config.center.visible && config.center.style !== 'none' && (
            <Circle
              x={centerX}
              y={centerY}
              radius={config.center.size}
              fill={config.center.color}
            />
          )}

          {/* 外圆边框 */}
          <Circle
            x={centerX}
            y={centerY}
            radius={radius + 10}
            stroke="#e2e8f0"
            strokeWidth={2}
            dash={[5, 5]}
          />
        </Layer>
      </Stage>
    </div>
  );
};
