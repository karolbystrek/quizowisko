import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { cn } from '@/lib/utils';
import { useTheme } from '../ThemeProvider';

export interface RoughProps {
  roughness?: number;
  bowing?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeLineDash?: number[];
  strokeLineDashOffset?: number;
  fill?: string;
  fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'sunburst' | 'dashed' | 'zigzag-line';
  fillWeight?: number;
  hachureGap?: number;
  shape?: 'rectangle' | 'circle' | 'rounded';
  cornerRadius?: number;
  seed?: number;
  drawCheck?: boolean;
}

export const RoughOverlay: React.FC<RoughProps & { className?: string }> = ({
  className,
  roughness = 1.5,
  bowing = 1,
  stroke,
  strokeWidth = 1,
  strokeLineDash,
  strokeLineDashOffset,
  fill,
  fillStyle = 'hachure',
  fillWeight,
  hachureGap,
  shape = 'rectangle',
  cornerRadius = 8,
  seed,
  drawCheck,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(parent);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);

    const parent = canvas.parentElement;
    if (parent) {
      // Use offsetWidth/Height to cover borders if any
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Default stroke based on theme if not provided
    const effectiveStroke = stroke || (theme === 'dark' ? '#ffffff' : '#000000');

    const config: any = {
      roughness,
      bowing,
      stroke: effectiveStroke,
      strokeWidth,
      fill,
      fillStyle,
      fillWeight,
      hachureGap,
    };
    
    if (strokeLineDash) {
        config.strokeLineDash = strokeLineDash;
    }
    if (strokeLineDashOffset !== undefined) {
        config.strokeLineDashOffset = strokeLineDashOffset;
    }
    if (seed !== undefined) {
        config.seed = seed;
    }

    const w = canvas.width;
    const h = canvas.height;
    // Add some padding to avoid clipping the rough strokes
    const padding = 2; 
    
    if (shape === 'circle') {
      // Draw ellipse/circle
      rc.ellipse(w / 2, h / 2, w - padding * 2, h - padding * 2, config);
    } else if (shape === 'rounded') {
      // Draw rounded rectangle using path
      const r = cornerRadius;
      // Ensure radius isn't too big for the box
      const safeR = Math.min(r, w/2, h/2);
      
      const x = padding;
      const y = padding;
      const width = w - padding * 2;
      const height = h - padding * 2;
      
      // SVG Path for rounded rect
      const path = `
        M ${x + safeR} ${y}
        L ${x + width - safeR} ${y}
        Q ${x + width} ${y} ${x + width} ${y + safeR}
        L ${x + width} ${y + height - safeR}
        Q ${x + width} ${y + height} ${x + width - safeR} ${y + height}
        L ${x + safeR} ${y + height}
        Q ${x} ${y + height} ${x} ${y + height - safeR}
        L ${x} ${y + safeR}
        Q ${x} ${y} ${x + safeR} ${y}
      `;
      
      rc.path(path, config);
    } else {
      // Default rectangle
      rc.rectangle(padding, padding, w - padding * 2, h - padding * 2, config);
    }

    if (drawCheck) {
        // Draw a checkmark in the center
        // Points relative to width/height
        // Start: 25% x, 50% y
        // Mid: 45% x, 75% y
        // End: 80% x, 20% y
        const x1 = w * 0.25;
        const y1 = h * 0.55;
        const x2 = w * 0.45;
        const y2 = h * 0.8;
        const x3 = w * 0.8;
        const y3 = h * 0.2;
        
        // Use a linear path for the check
        rc.linearPath([[x1, y1], [x2, y2], [x3, y3]], {
            ...config,
            strokeWidth: (config.strokeWidth || 1) * 2, // Make it bolder
            roughness: 2 // Make it sketchy
        });
    }

  }, [dimensions, roughness, bowing, stroke, strokeWidth, strokeLineDash, strokeLineDashOffset, fill, fillStyle, fillWeight, hachureGap, shape, cornerRadius, seed, drawCheck, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

interface RoughBoxProps extends React.HTMLAttributes<HTMLDivElement>, RoughProps {}

export const RoughBox = React.forwardRef<HTMLDivElement, RoughBoxProps>(({
  children,
  className,
  roughness,
  bowing,
  stroke,
  strokeWidth,
  strokeLineDash,
  strokeLineDashOffset,
  fill,
  fillStyle,
  fillWeight,
  hachureGap,
  shape,
  cornerRadius,
  seed,
  drawCheck,
  ...props
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn("relative", className)} 
      {...props}
    >
      <RoughOverlay 
        roughness={roughness}
        bowing={bowing}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLineDash={strokeLineDash}
        strokeLineDashOffset={strokeLineDashOffset}
        fill={fill}
        fillStyle={fillStyle}
        fillWeight={fillWeight}
        hachureGap={hachureGap}
        shape={shape}
        cornerRadius={cornerRadius}
        seed={seed}
        drawCheck={drawCheck}
      />
      {children}
    </div>
  );
});
RoughBox.displayName = 'RoughBox';