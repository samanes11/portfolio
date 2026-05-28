"use client";

import React, { useEffect, useRef } from "react";

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
  const overlayRef = useRef<HTMLDivElement>(null);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onclose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onclose]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === overlayRef.current) onclose();
        }}
      />

      {/* Window */}
      <div
        className="fixed z-[901] inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="pointer-events-auto relative rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
          style={{
            width: "100%",
            maxWidth,
            maxHeight: "90vh",
            ...contentStyle,
          }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10 flex-shrink-0">
            <span className="text-white/70 text-xs font-mono">
              {title ?? "window"}
            </span>
            <div className="flex items-center gap-2">
              {showMinimize && onminimize && (
                <button
                  onClick={onminimize}
                  className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors"
                  title="Minimize"
                />
              )}
              <button
                onClick={onclose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                title="Close"
              />
            </div>
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto flex-1"
            style={{ padding }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
