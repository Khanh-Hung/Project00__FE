"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Loader2 } from "lucide-react";

export interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onSave: (croppedDataUrl: string) => void;
  outputSize?: number;
  outputWidth?: number;
  outputHeight?: number;
  cropShape?: "round" | "rect";
  title?: string;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  outputSize = 512,
  outputWidth,
  outputHeight,
  cropShape = "round",
  title,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const isRect = cropShape === "rect";
  const viewportW = isRect ? 260 : 230;
  const viewportH = isRect ? 390 : 230;
  const outW = outputWidth || (isRect ? 512 : outputSize);
  const outH = outputHeight || (isRect ? 768 : outputSize);

  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const ratio = imageSize.width > 0 && imageSize.height > 0 ? imageSize.width / imageSize.height : 1;
  const viewportRatio = viewportW / viewportH;
  const minZoom = ratio > viewportRatio ? viewportRatio / ratio : ratio / viewportRatio;

  let styleWidth = viewportW;
  let styleHeight = viewportH;
  if (imageSize.width > 0 && imageSize.height > 0) {
    if (ratio > viewportRatio) {
      styleHeight = viewportH;
      styleWidth = viewportH * ratio;
    } else {
      styleWidth = viewportW;
      styleHeight = viewportW / ratio;
    }
  }

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Mouse wheel zoom
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const step = 0.05;
      setZoom((prev) => {
        const next = e.deltaY < 0 ? Math.min(4, prev + step) : Math.max(minZoom, prev - step);
        return parseFloat(next.toFixed(2));
      });
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [isOpen, minZoom]);

  if (!isOpen || !imageSrc) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not create 2D canvas context");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Background fill
      ctx.fillStyle = "#18191c";
      ctx.fillRect(0, 0, outW, outH);

      const scaleFactor = outW / viewportW;
      let drawW = img.width;
      let drawH = img.height;
      const imgRatio = img.width / img.height;
      const outRatio = outW / outH;

      if (imgRatio > outRatio) {
        drawH = outH;
        drawW = outH * imgRatio;
      } else {
        drawW = outW;
        drawH = outW / imgRatio;
      }

      const destW = drawW * zoom;
      const destH = drawH * zoom;
      const destX = outW / 2 + position.x * scaleFactor - destW / 2;
      const destY = outH / 2 + position.y * scaleFactor - destH / 2;

      const roundedX = Math.round(destX);
      const roundedY = Math.round(destY);
      const roundedW = Math.round(destW);
      const roundedH = Math.round(destH);

      // Multi-step high quality downscaling for maximum sharpness
      let source: HTMLImageElement | HTMLCanvasElement = img;
      let sw = img.naturalWidth || img.width;
      let sh = img.naturalHeight || img.height;

      while (sw > 2 * roundedW || sh > 2 * roundedH) {
        const nextW = Math.max(roundedW, Math.floor(sw / 2));
        const nextH = Math.max(roundedH, Math.floor(sh / 2));
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = nextW;
        tempCanvas.height = nextH;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = "high";
          tempCtx.drawImage(source, 0, 0, sw, sh, 0, 0, nextW, nextH);
          source = tempCanvas;
          sw = nextW;
          sh = nextH;
        } else {
          break;
        }
      }

      ctx.drawImage(source, 0, 0, sw, sh, roundedX, roundedY, roundedW, roundedH);

      const croppedResult = canvas.toDataURL("image/png", 1.0);
      onSave(croppedResult);
      onClose();
    } catch (err) {
      console.error("Failed to crop image", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const modalTitle = title || (isRect ? "Cắt & Căn chỉnh ảnh toàn thân (2:3)" : "Cắt & Căn chỉnh ảnh đại diện");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full ${isRect ? "max-w-lg" : "max-w-md"} rounded-3xl border border-[#31333a] bg-[#212227] p-6 shadow-2xl overflow-hidden flex flex-col items-center`}>
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-[#2c2e35] pb-4 mb-4">
          <h3 className="text-base font-bold text-zinc-100">{modalTitle}</h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-[#2b2c34] hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewport Mask */}
        <div className="relative my-2 flex items-center justify-center">
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              width: viewportW,
              height: viewportH,
            }}
            className={`relative overflow-hidden border-2 border-zinc-400 shadow-2xl cursor-grab active:cursor-grabbing bg-black/60 select-none touch-none flex items-center justify-center ring-8 ring-black/40 ${
              isRect ? "rounded-2xl" : "rounded-full"
            }`}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              onLoad={(e) => {
                const img = e.currentTarget;
                setImageSize({
                  width: img.naturalWidth || img.width,
                  height: img.naturalHeight || img.height,
                });
              }}
              className="absolute max-w-none origin-center pointer-events-none select-none"
              style={{
                width: styleWidth * zoom,
                height: styleHeight * zoom,
                transform: `translate(${position.x}px, ${position.y}px)`,
                imageRendering: "auto",
              }}
            />
          </div>
        </div>

        <p className="text-xs text-zinc-400 mt-3 text-center">
          Kéo thả để căn chỉnh vị trí, dùng thanh trượt hoặc lăn chuột để phóng to/thu nhỏ
        </p>

        {/* Zoom Controls */}
        <div className="w-full mt-3 flex items-center gap-3 px-2">
          <ZoomOut className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            type="range"
            min={minZoom}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#191a1e] rounded-lg appearance-none cursor-pointer accent-white"
          />
          <ZoomIn className="h-4 w-4 text-zinc-400 shrink-0" />

          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPosition({ x: 0, y: 0 });
            }}
            title="Đặt lại vị trí"
            className="rounded-xl border border-[#3b3d46] bg-[#2b2c34] p-1.5 text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="w-full flex items-center gap-3 mt-5 pt-4 border-t border-[#2c2e35]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#3b3d46] bg-[#2b2c34] py-2.5 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleApplyCrop}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-100 py-2.5 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            <span>Áp Dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
