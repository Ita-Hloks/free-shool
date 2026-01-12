import React, { useEffect, useRef, useState } from "react";
import PopWindow from "./popWindow.tsx";

interface SignaturePadProps {
  isOpen: boolean;
  onSave: (signatureData: string) => void;
  onClose: () => void;
}

export default function SignaturePad({ isOpen, onSave, onClose }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas)
      return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;

      const context = canvas.getContext("2d");
      if (!context)
        return;

      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "#1f2937";
      context.lineWidth = 1.5;
      contextRef.current = context;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [isOpen]);

  const getCoordinates = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas)
      return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    else {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    setIsEmpty(false);

    const { x, y } = getCoordinates(e);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing.current)
      return;

    const { x, y } = getCoordinates(e);
    contextRef.current?.lineTo(x, y);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context)
      return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (isEmpty)
      return;
    const canvas = canvasRef.current;
    if (!canvas)
      return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
    handleClear();
    onClose();
  };

  return (
    <PopWindow
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlay={true}
      blurBackdrop={true}
      fullscreen={false}
    >
      <div>
        <canvas
          ref={canvasRef}
          className="w-full h-86 bg-white cursor-crosshair touch-none border-t border-b mb-2 b-gray-500 rounded-lg"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClear}
            disabled={isEmpty}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-medium
              hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            清除
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-medium
              hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isEmpty}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600
              text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
              hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50
              disabled:cursor-not-allowed disabled:shadow-none"
          >
            保存
          </button>
        </div>
      </div>
    </PopWindow>
  );
};
