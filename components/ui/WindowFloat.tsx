"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface WindowFloatProps {
  onclose: () => void;
  onminimize?: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  padding?: number;
  contentStyle?: React.CSSProperties;
  title?: string;
}

let globalZ = 901;
const getNextZ = () => ++globalZ;

export default function WindowFloat({
  onclose,
  onminimize,
  children,
  maxWidth = "600px",
  padding = 16,
  contentStyle = {},
  title,
}: WindowFloatProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"open" | "closing" | "minimizing">("open");
  const [minimizeTarget, setMinimizeTarget] = useState<{ x: number; y: number } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [zIndex, setZIndex] = useState(() => getNextZ());
  const [hoveredBtn, setHoveredBtn] = useState<"close" | "minimize" | null>(null);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const bringToFront = useCallback(() => {
    setZIndex(getNextZ());
  }, []);

  const handleClose = useCallback(() => {
    setPhase("closing");
    setTimeout(() => onclose(), 220);
  }, [onclose]);

  const handleMinimize = useCallback(() => {
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      const taskbarY = window.innerHeight - 56;
      const targetX = 60;
      const targetY = taskbarY;
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

  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      bringToFront();
      dragging.current = true;

      const rect = windowRef.current!.getBoundingClientRect();
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
        const w = windowRef.current?.offsetWidth ?? 400;
        const h = windowRef.current?.offsetHeight ?? 300;
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

  const onTitleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      bringToFront();
      dragging.current = true;

      const touch = e.touches[0];
      const rect = windowRef.current!.getBoundingClientRect();
      const currentX = pos?.x ?? rect.left;
      const currentY = pos?.y ?? rect.top;

      dragOffset.current = {
        x: touch.clientX - currentX,
        y: touch.clientY - currentY,
      };

      const onTouchMove = (ev: TouchEvent) => {
        if (!dragging.current) return;
        ev.preventDefault();
        const t = ev.touches[0];
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const w = windowRef.current?.offsetWidth ?? 400;
        const h = windowRef.current?.offsetHeight ?? 300;
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

  const isClosing = phase === "closing";
  const isMinimizing = phase === "minimizing";

  const minimizeCSSVars =
    isMinimizing && minimizeTarget
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
          0%   { opacity:1; transform:translate(-50%,-50%) scale(1) translate(0px,0px); }
          30%  { opacity:1; transform:translate(-50%,-50%) scale(0.85) translate(0px,0px); }
          100% { opacity:0; transform:translate(-50%,-50%) scale(0.08) translate(var(--wf-min-x,0px),var(--wf-min-y,60px)); }
        }
        @keyframes wf-minimize-to-taskbar-dragged {
          0%   { opacity:1; transform:scale(1) translate(0px,0px); }
          30%  { opacity:1; transform:scale(0.85) translate(0px,0px); }
          100% { opacity:0; transform:scale(0.08) translate(var(--wf-min-x,0px),var(--wf-min-y,60px)); }
        }

        /* Traffic-light button styles */
        .wf-btn-group { display:flex; align-items:center; gap:7px; }

        .wf-btn {
          position: relative;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: filter 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex-shrink: 0;
        }
        .wf-btn:active { transform: scale(0.88); }

        .wf-btn-close  { background: #ff5f57; box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.25); }
        .wf-btn-min    { background: #febc2e; box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.2); }

        .wf-btn-close:hover  { filter: brightness(0.88); }
        .wf-btn-min:hover    { filter: brightness(0.88); }

        /* Icon inside button — only visible on group hover */
        .wf-btn-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.12s;
          pointer-events: none;
        }
        .wf-btn-group:hover .wf-btn-icon { opacity: 1; }

        .wf-btn-icon svg {
          width: 7px;
          height: 7px;
          stroke: rgba(0,0,0,0.55);
          stroke-width: 1.8;
          stroke-linecap: round;
          fill: none;
        }

        .wf-titlebar { cursor: grab; user-select: none; }
        .wf-titlebar:active { cursor: grabbing; }
      `}</style>

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
          className="wf-titlebar flex items-center justify-between px-4 py-2.5 border-b border-white/10 flex-shrink-0"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onMouseDown={onTitleMouseDown}
          onTouchStart={onTitleTouchStart}
        >
          {/* Traffic-light buttons — macOS style, left side */}
          <div className="wf-btn-group">
            {/* Close */}
            <button
              className="wf-btn wf-btn-close"
              onClick={handleClose}
              title="Close"
              aria-label="Close window"
            >
              <span className="wf-btn-icon">
                <svg viewBox="0 0 8 8">
                  <line x1="1.5" y1="1.5" x2="6.5" y2="6.5" />
                  <line x1="6.5" y1="1.5" x2="1.5" y2="6.5" />
                </svg>
              </span>
            </button>

            {/* Minimize */}
            { onminimize && (
              <button
                className="wf-btn wf-btn-min"
                onClick={handleMinimize}
                title="Minimize"
                aria-label="Minimize window"
              >
                <span className="wf-btn-icon">
                  <svg viewBox="0 0 8 8">
                    <line x1="1.5" y1="4" x2="6.5" y2="4" />
                  </svg>
                </span>
              </button>
            )}
          </div>

          {/* Title — centered */}
          <span
            className="absolute left-1/2 -translate-x-1/2 text-white/60 font-mono pointer-events-none"
            style={{ fontSize: 12 }}
          >
            {title ?? "window"}
          </span>

          {/* Right spacer to balance title centering */}
          <div
            style={{
              width: onminimize ? 33 : 13,
              flexShrink: 0,
            }}
          />
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1" style={{ padding }}>
          {children}
        </div>
      </div>
    </>
  );
}