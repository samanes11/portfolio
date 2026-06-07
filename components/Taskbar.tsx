"use client";

import { useState, useRef, useEffect } from "react";
import SystemTray from "./ui/SystemTray";

interface TaskbarProps {
  openWindows: string[];
  minimizedWindows: string[];
  activeWindow: string | null;
  onOpenWindow: (id: string) => void;
  onCloseWindow?: (id: string) => void;
  onToggleStart: () => void;
  currentTime: string;
}

const windowLabels: Record<string, string> = {
  about: "aboutMe.tsx",
  projects: "Projects",
  resume: "Resume",
  contact: "Contact",
  game: "Game",
  mediaplayer: "Media Player",
  controlPanel: "Control Panel",
  weather: "Weather",
};

const windowIcons: Record<string, string> = {
  about: "icon-[octicon--person-fill-24]",
  projects: "icon-[teenyicons--folder-solid]",
  resume: "icon-[material-symbols--description-rounded]",
  contact: "icon-[ic--baseline-email]",
  game: "icon-[solar--gameboy-bold]",
  mediaplayer: "icon-[material-symbols-light--smart-display]",
  controlPanel: "icon-[mdi--shield-account]",
  weather: "icon-[mdi--weather-partly-cloudy]",
};

const windowAccents: Record<string, string> = {
  about: "#60a5fa",
  projects: "#fbbf24",
  resume: "#a78bfa",
  contact: "#34d399",
  game: "#f472b6",
  mediaplayer: "#fb923c",
  controlPanel: "#f87171",
  weather: "#38bdf8",
};

export default function Taskbar({
  openWindows,
  minimizedWindows,
  activeWindow,
  onOpenWindow,
  onCloseWindow,
  onToggleStart,
  currentTime,
}: TaskbarProps) {
  const [hoveredWindow, setHoveredWindow] = useState<string | null>(null);
  const [closingWindows, setClosingWindows] = useState<Set<string>>(new Set());

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setClosingWindows((prev) => new Set(prev).add(id));
    setTimeout(() => {
      onCloseWindow?.(id);
      setClosingWindows((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
  };

  return (
    <>
      <style>{`
        @keyframes tb-pill-in {
          from { opacity: 0; transform: scale(0.7) translateY(8px); }
          to   { opacity: 1; transform: scale(1)   translateY(0px); }
        }
        @keyframes tb-pill-out {
          from { opacity: 1; transform: scale(1)   translateY(0px); width: auto; max-width: 180px; }
          to   { opacity: 0; transform: scale(0.6) translateY(6px);  max-width: 0px; padding: 0; margin: 0; }
        }
        @keyframes tb-dot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%       { transform: scale(1.5); opacity: 1; }
        }
        @keyframes tb-start-hover {
          0%   { transform: scale(1) rotate(0deg); }
          40%  { transform: scale(1.15) rotate(-8deg); }
          70%  { transform: scale(1.1) rotate(4deg); }
          100% { transform: scale(1.08) rotate(0deg); }
        }
        .tb-pill-enter { animation: tb-pill-in 240ms cubic-bezier(.34,1.4,.64,1) forwards; }
        .tb-pill-exit  { animation: tb-pill-out 200ms cubic-bezier(.4,0,.6,1) forwards; overflow: hidden; }
        .tb-start-btn:hover .tb-start-icon { animation: tb-start-hover 0.4s ease forwards; }
        .tb-active-dot { animation: tb-dot-pulse 2s ease-in-out infinite; }

        .tb-pill {
          position: relative;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 10px 5px 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
          white-space: nowrap;
          overflow: hidden;
          max-width: 180px;
        }
        .tb-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .tb-pill:hover::before { opacity: 1; }
        .tb-pill:active { transform: scale(0.96); }

        .tb-close-btn {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.15s, transform 0.15s, background 0.15s;
          flex-shrink: 0;
          background: rgba(255,255,255,0.08);
          border: none;
          cursor: pointer;
        }
        .tb-pill:hover .tb-close-btn {
          opacity: 1;
          transform: scale(1);
        }
        .tb-close-btn:hover {
          background: rgba(255, 80, 80, 0.7) !important;
        }

        .tb-shimmer {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .tb-pill:hover .tb-shimmer { opacity: 1; }
      `}</style>

      {/* ── TASKBAR ── */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[56px] z-[999] flex items-center px-3 gap-2"
        style={{
          background: "rgba(10, 10, 15, 0.55)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 -1px 0 rgba(255,255,255,0.04), 0 -8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Start Button ── */}
        <button
          className="tb-start-btn relative group flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(145deg, #b45309, #92400e)",
            boxShadow: "0 2px 12px rgba(180, 83, 9, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
          onClick={onToggleStart}
        >
          <span
            className="tb-start-icon icon-[material-symbols-light--window] w-[22px] h-[22px] text-white"
            style={{ display: "block" }}
          />
          {/* glow ring on hover */}
          <span
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)",
            }}
          />
        </button>

        {/* ── Separator ── */}
        <div
          className="h-6 w-px flex-shrink-0"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)" }}
        />

        {/* ── Window Pills ── */}
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto overflow-y-visible" style={{ scrollbarWidth: "none" }}>
          {openWindows.map((id) => {
            const isActive = id === activeWindow;
            const isMinimized = minimizedWindows.includes(id);
            const isClosing = closingWindows.has(id);
            const accent = windowAccents[id] ?? "#94a3b8";
            const label = windowLabels[id] ?? (id.charAt(0).toUpperCase() + id.slice(1));
            const icon = windowIcons[id];

            return (
              <div
                key={id}
                className={`tb-pill ${isClosing ? "tb-pill-exit" : "tb-pill-enter"}`}
                style={{
                  background: isActive
                    ? `rgba(${hexToRgb(accent)}, 0.15)`
                    : "rgba(255,255,255,0.06)",
                  border: isActive
                    ? `1px solid rgba(${hexToRgb(accent)}, 0.35)`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isActive
                    ? `0 0 12px rgba(${hexToRgb(accent)}, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
                    : "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                onMouseEnter={() => setHoveredWindow(id)}
                onMouseLeave={() => setHoveredWindow(null)}
                onClick={() => onOpenWindow(id)}
              >
                <span className="tb-shimmer" />

                {/* Icon */}
                {icon && (
                  <span
                    className={`${icon} w-[15px] h-[15px] flex-shrink-0 transition-all duration-200`}
                    style={{
                      color: isActive ? accent : isMinimized ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.65)",
                      filter: isActive ? `drop-shadow(0 0 4px ${accent}88)` : "none",
                    }}
                  />
                )}

                {/* Label */}
                <span
                  className="font-mono transition-all duration-200"
                  style={{
                    fontSize: 11,
                    color: isActive ? "rgba(255,255,255,0.9)" : isMinimized ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {label}
                </span>

                {/* Active indicator dot */}
                <span
                  className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${isActive ? "tb-active-dot" : ""}`}
                  style={{
                    background: isActive ? accent : isMinimized ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)",
                    boxShadow: isActive ? `0 0 6px ${accent}` : "none",
                    marginLeft: 2,
                  }}
                />

                {/* Close button */}
                {onCloseWindow && (
                  <button
                    className="tb-close-btn"
                    onClick={(e) => handleClose(e, id)}
                    title="Close"
                  >
                    <span className="icon-[mdi--close] w-[9px] h-[9px] text-white/80" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ── System Tray ── */}
        <div
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <SystemTray />
        </div>

        {/* ── Divider ── */}
        <div
          className="h-6 w-px flex-shrink-0"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)" }}
        />

        {/* ── Clock ── */}
        <button
          className="flex-shrink-0 flex flex-col items-center justify-center px-3 h-9 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
            minWidth: 64,
          }}
        >
          <span
            className="font-mono font-semibold text-white tabular-nums"
            style={{ fontSize: 12, letterSpacing: "0.05em" }}
          >
            {currentTime}
          </span>
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}
          >
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </button>
      </div>
    </>
  );
}

// hex "#60a5fa" → "96, 165, 250"
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}