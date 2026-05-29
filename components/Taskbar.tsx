"use client";

import SystemTray from "./ui/SystemTray";

interface TaskbarProps {
  openWindows: string[];
  minimizedWindows: string[];
  activeWindow: string | null;
  onOpenWindow: (id: string) => void;
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
  // "AI Terminal": "AI Terminal",
  controlPanel: "Control Panel",
};

const windowIcons: Record<string, string> = {
  about: "icon-[octicon--person-fill-24]",
  projects: "icon-[teenyicons--folder-solid]",
  resume: "icon-[material-symbols--description-rounded]",
  contact: "icon-[ic--baseline-email]",
  game: "icon-[solar--gameboy-bold]",
  mediaplayer: "icon-[material-symbols-light--smart-display]",
  // "AI Terminal": "icon-[eos-icons--terminal]",
  controlPanel: "icon-[mdi--shield-account]",
};

export default function Taskbar({
  openWindows,
  minimizedWindows,
  activeWindow,
  onOpenWindow,
  onToggleStart,
  currentTime,
}: TaskbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 flex items-center bg-gray-900/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-3 gap-3 z-[999]">
      {/* Start Button */}
      <button
        className="group relative h-8 w-8 rounded-xl bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-900 hover:to-amber-500 shadow-lg hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        onClick={onToggleStart}
      >
        <span className="icon-[material-symbols-light--window] w-[30px] h-[30px] text-white" />
      </button>

      {/* Divider */}
      <div className="h-8 w-px bg-white/20" />

      {/* Windows list */}
      <div className="flex gap-2 flex-1 overflow-x-hidden items-center">
        {openWindows.map((windowId) => {
          const isActive = windowId === activeWindow;
          const isMinimized = minimizedWindows.includes(windowId);
          return (
            <button
              key={windowId}
              onClick={() => onOpenWindow(windowId)}
              className={`group relative h-10 px-4 rounded-lg backdrop-blur-sm border text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 whitespace-nowrap shadow-lg ${
                isActive
                  ? "bg-red-900/30 border-yellow-700/50"
                  : "bg-white/10 border-white/10 hover:bg-white/20"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive
                    ? "bg-yellow-500 animate-pulse"
                    : isMinimized
                      ? "bg-gray-600"
                      : "bg-gray-400"
                }`}
              />
              {windowIcons[windowId] && (
                <span
                  className={`${windowIcons[windowId]} w-[18px] h-[18px] ${isMinimized ? "opacity-50" : ""}`}
                />
              )}
              <span
                style={{ fontSize: 12 }}
                className={`font-medium ${isMinimized ? "opacity-50" : ""}`}
              >
                {windowLabels[windowId] ??
                  windowId.charAt(0).toUpperCase() + windowId.slice(1)}
              </span>
            </button>
          );
        })}
      </div>
      {/* System Tray */}
      <div className="flex items-center gap-1">
        <SystemTray />

        <div className="h-8 w-px bg-white/20 mx-1" />

        {/* Clock*/}
        <button className="h-10 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-0.5">
          <span
            className="font-mono font-semibold text-white"
            style={{ fontSize: 12 }}
          >
            {currentTime}
          </span>
          <span className="text-gray-400" style={{ fontSize: 9 }}>
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </button>
      </div>
    </div>
  );
}
