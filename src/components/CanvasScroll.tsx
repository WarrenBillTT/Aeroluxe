import React, { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 281;

// Pad numbers to 3 digits (e.g., 1 -> 001, 25 -> 025)
const currentFrame = (index: number) => 
  `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

export const CanvasScroll: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Preload images
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadCount = 0;

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
          loadCount++;
          if (loadCount === FRAME_COUNT) {
            setLoaded(true);
          }
        };
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!loaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderImage(0); // initial render
    };

    const renderImage = (index: number) => {
      const img = images[index];
      if (!img) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      if (!canvas || !ctx) return;

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const progress = index / (FRAME_COUNT - 1);
      
      let scaleMultiplier = 1.0;
      
      // Start shrinking when progress > 0.80
      // At this point, the background has completely transitioned to solid cream,
      // so we can safely sample the corner pixel without showing sky artifacts.
      if (progress > 0.80) {
        const shrinkProgress = (progress - 0.80) / 0.20; // Maps 0.80-1.0 to 0.0-1.0
        // Smooth easing for the shrink transition
        const easeInOut = shrinkProgress * shrinkProgress * (3 - 2 * shrinkProgress);
        scaleMultiplier = 1.0 - (easeInOut * 0.25); // Shrinks up to 25%
      }
      
      const drawScale = scale * scaleMultiplier;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let r = 0, g = 0, b = 0;

      // If shrinking, extract background color to fill the borders
      if (scaleMultiplier < 1.0) {
        ctx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        r = pixel[0]; g = pixel[1]; b = pixel[2];
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const imgW = img.width * drawScale;
      const imgH = img.height * drawScale;
      const x = (canvas.width / 2) - imgW / 2;
      const y = (canvas.height / 2) - imgH / 2;

      // Draw the main image
      ctx.drawImage(img, x, y, imgW, imgH);

      // Apply seamless edge feathering (gradient blending) to hide any vignette/contrast lines
      if (scaleMultiplier < 1.0) {
        const colorSolid = `rgba(${r}, ${g}, ${b}, 1)`;
        const colorClear = `rgba(${r}, ${g}, ${b}, 0)`;
        const feather = 150; // Width of the blending gradient in pixels
        
        let grad;
        
        // Left Edge
        grad = ctx.createLinearGradient(x, 0, x + feather, 0);
        grad.addColorStop(0, colorSolid);
        grad.addColorStop(1, colorClear);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, feather, imgH);
        
        // Right Edge
        grad = ctx.createLinearGradient(x + imgW, 0, x + imgW - feather, 0);
        grad.addColorStop(0, colorSolid);
        grad.addColorStop(1, colorClear);
        ctx.fillStyle = grad;
        ctx.fillRect(x + imgW - feather, y, feather, imgH);
        
        // Top Edge
        grad = ctx.createLinearGradient(0, y, 0, y + feather);
        grad.addColorStop(0, colorSolid);
        grad.addColorStop(1, colorClear);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, imgW, feather);
        
        // Bottom Edge
        grad = ctx.createLinearGradient(0, y + imgH, 0, y + imgH - feather);
        grad.addColorStop(0, colorSolid);
        grad.addColorStop(1, colorClear);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y + imgH - feather, imgW, feather);
      }
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    // Scroll animation logic
    const handleScroll = () => {
      const container = document.getElementById('canvas-container');
      if (!container) return;
      
      const scrollTop = window.scrollY;
      const maxScrollTop = container.offsetHeight - window.innerHeight;
      
      // Calculate fraction, ensuring it stays between 0 and 1
      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
      
      const frameIndex = Math.floor(scrollFraction * (FRAME_COUNT - 1));
      
      requestAnimationFrame(() => renderImage(frameIndex));
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loaded, images]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ objectFit: 'cover' }}
      />
      {/* Fallback loading indicator if images take time */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest uppercase bg-black">
          Initializing Flight Systems...
        </div>
      )}
    </div>
  );
};
