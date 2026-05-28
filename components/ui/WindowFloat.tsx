"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface WindowFloatProps {
  onclose: () => void;
  onminimize?: () => void;
  showMinimize?: boolean;
  children: React.ReactNode;
  maxWidth?: string;
  padding?: number;
  contentStyle?: React.CSSProperties;
  title?: string;
}

// Global z-index manager
let globalZ = 901;
const getNextZ = () => ++globalZ;

export default function WindowFloat({
  onclose,
  onminimize,
  showMinimize = false,
  children,
  maxWidth = "600px",
  padding = 16,
  contentStyle = {},
  title,
}: WindowFloatProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const windowRef   = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"open" | "closing" | "minimizing">("open");
  const [minimizeTarget, setMinimizeTarget] = useState<{ x: number; y: number } | null>(null);
  const [pos, setPos]     = useState<{ x: number; y: number } | null>(null);
  const [zIndex, setZIndex] = useState(() => getNextZ());

  const dragging   = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const bringToFront = useCallback(() => {
    setZIndex(getNextZ());
  }, []);

  const handleClose = useCallback(() => {
    setPhase("closing");
    setTimeout(() => onclose(), 220);
  }, [onclose]);

  const handleMinimize = useCallback(() => {
    // Calculate where the window should fly to (taskbar bottom-left area)
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      const taskbarY = window.innerHeight - 56; // taskbar height ~56px
      const targetX  = 60; // approximate taskbar icon area
      const targetY  = taskbarY;
      setMinimizeTarget({ x: targetX - rect.left, y: targetY - rect.top });
    }
    setPhase("minimizing");
    setTimeout(() => onminimize?.(), 320);
  }, [onminimize]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Mouse drag
  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      bringToFront();
      dragging.current = true;

      const rect     = windowRef.current!.getBoundingClientRect();
      const currentX = pos?.x ?? rect.left;
      const currentY = pos?.y ?? rect.top;

      dragOffset.current = {
        x: e.clientX - currentX,
        y: e.clientY - currentY,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const w    = windowRef.current?.offsetWidth  ?? 400;
        const h    = windowRef.current?.offsetHeight ?? 300;
        const x = Math.min(Math.max(ev.clientX - dragOffset.current.x, 0), winW - w);
        const y = Math.min(Math.max(ev.clientY - dragOffset.current.y, 0), winH - h - 56);
        setPos({ x, y });
      };

      const onMouseUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [pos, bringToFront]
  );

  // Touch drag 
  const onTitleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      bringToFront();
      dragging.current = true;

      const touch    = e.touches[0];
      const rect     = windowRef.current!.getBoundingClientRect();
      const currentX = pos?.x ?? rect.left;
      const currentY = pos?.y ?? rect.top;

      dragOffset.current = {
        x: touch.clientX - currentX,
        y: touch.clientY - currentY,
      };

      const onTouchMove = (ev: TouchEvent) => {
        if (!dragging.current) return;
        ev.preventDefault();
        const t    = ev.touches[0];
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const w    = windowRef.current?.offsetWidth  ?? 400;
        const h    = windowRef.current?.offsetHeight ?? 300;
        const x = Math.min(Math.max(t.clientX - dragOffset.current.x, 0), winW - w);
        const y = Math.min(Math.max(t.clientY - dragOffset.current.y, 0), winH - h - 56);
        setPos({ x, y });
      };

      const onTouchEnd = () => {
        dragging.current = false;
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      };

      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    },
    [pos, bringToFront]
  );

  const isClosing    = phase === "closing";
  const isMinimizing = phase === "minimizing";

  // CSS custom properties for the minimize target offset
  const minimizeCSSVars = isMinimizing && minimizeTarget
    ? ({
        "--wf-min-x": `${minimizeTarget.x}px`,
        "--wf-min-y": `${minimizeTarget.y}px`,
      } as React.CSSProperties)
    : {};

  const posStyle: React.CSSProperties = pos
    ? { position: "fixed", left: pos.x, top: pos.y, transform: "none" }
    : { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  return (
    <>
      <style>{`
        @keyframes wf-window-in {
          0%   { opacity:0; transform:translate(-50%,-50%) scale(0.88) translateY(18px); }
          60%  { opacity:1; transform:translate(-50%,-50%) scale(1.02) translateY(-3px); }
          100% { opacity:1; transform:translate(-50%,-50%) scale(1)    translateY(0); }
        }
        @keyframes wf-window-in-dragged {
          0%   { opacity:0; transform:scale(0.88); }
          60%  { opacity:1; transform:scale(1.02); }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes wf-window-out {
          0%   { opacity:1; transform:translate(-50%,-50%) scale(1)    translateY(0); }
          100% { opacity:0; transform:translate(-50%,-50%) scale(0.88) translateY(18px); }
        }
        @keyframes wf-window-out-dragged {
          0%   { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(0.88); }
        }
        @keyframes wf-minimize-to-taskbar {
          0%   {
            opacity: 1;
            transform: translate(-50%,-50%) scale(1) translate(0px, 0px);
          }
          30%  {
            opacity: 1;
            transform: translate(-50%,-50%) scale(0.85) translate(0px, 0px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%,-50%) scale(0.08) translate(var(--wf-min-x, 0px), var(--wf-min-y, 60px));
          }
        }
        @keyframes wf-minimize-to-taskbar-dragged {
          0%   {
            opacity: 1;
            transform: scale(1) translate(0px, 0px);
          }
          30%  {
            opacity: 1;
            transform: scale(0.85) translate(0px, 0px);
          }
          100% {
            opacity: 0;
            transform: scale(0.08) translate(var(--wf-min-x, 0px), var(--wf-min-y, 60px));
          }
        }
        .wf-titlebar { cursor: grab; user-select: none; }
        .wf-titlebar:active { cursor: grabbing; }
      `}</style>

      {/* Window */}
      <div
        ref={windowRef}
        onMouseDown={bringToFront}
        className="pointer-events-auto relative rounded-2xl border border-white/10 overflow-hidden flex flex-col"
        style={{
          ...posStyle,
          ...minimizeCSSVars,
          zIndex,
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
          transformOrigin: "bottom center",
          animation: isMinimizing
            ? pos
              ? "wf-minimize-to-taskbar-dragged 320ms cubic-bezier(.4,0,.6,1) forwards"
              : "wf-minimize-to-taskbar 320ms cubic-bezier(.4,0,.6,1) forwards"
            : isClosing
              ? pos
                ? "wf-window-out-dragged 220ms cubic-bezier(.4,0,.2,1) forwards"
                : "wf-window-out 220ms cubic-bezier(.4,0,.2,1) forwards"
              : pos
                ? "wf-window-in-dragged 300ms cubic-bezier(.34,1.4,.64,1) forwards"
                : "wf-window-in 300ms cubic-bezier(.34,1.4,.64,1) forwards",
          ...contentStyle,
        }}
      >
        {/* Title bar */}
        <div
          className="wf-titlebar flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10 flex-shrink-0"
          onMouseDown={onTitleMouseDown}
          onTouchStart={onTitleTouchStart}
        >
          <span className="text-white/70 text-xs font-mono pointer-events-none">
            {title ?? "window"}
          </span>
          <div className="flex items-center gap-2">
            {showMinimize && onminimize && (
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors"
                title="Minimize"
              />
            )}
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              title="Close"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1" style={{ padding }}>
          {children}
        </div>
      </div>
    </>
  );
}