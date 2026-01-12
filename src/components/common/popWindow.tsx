import type { ReactNode } from "react";
import React, { useEffect, useRef } from "react";

interface PopWindowProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
  closeOnOverlay?: boolean;
  blurBackdrop?: boolean;
  fullscreen?: boolean;
  className?: string;
}

const PopWindow: React.FC<PopWindowProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
  blurBackdrop = true,
  fullscreen = false,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen)
      return;

    const handleTouchStart = (e: TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        const deltaX = e.touches[0].clientX - startX.current;
        const deltaY = Math.abs(e.touches[0].clientY - startY.current);

        if (Math.abs(deltaX) > 50 && deltaY < 50) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen]);

  if (!isOpen)
    return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  const containerClass = fullscreen
    ? "fixed inset-0 z-50"
    : "fixed inset-0 z-50 flex items-center justify-center p-4";

  const contentClass = fullscreen
    ? "relative bg-white w-full h-full overflow-auto"
    : `relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} ${className} animate-in zoom-in-95 slide-in-from-bottom-4 duration-200`;

  return (
    <div className={`${containerClass} animate-in h-full fade-in duration-200`}>
      <div
        className={`absolute inset-0 bg-black/60 ${blurBackdrop ? "backdrop-blur-sm" : ""}`}
        onClick={closeOnOverlay ? onClose : undefined}
      />

      <div ref={modalRef} className={contentClass}>
        {showClose && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="关闭"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className={fullscreen ? "h-full" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopWindow;
