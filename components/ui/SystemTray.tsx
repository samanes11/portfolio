"use client";

import { useState } from "react";

export default function SystemTray() {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer">
      {/* Language */}
      <div className="px-1 text-[10px] font-bold text-white/70 hover:text-white transition-colors">
        ENG
      </div>
      {/* Wi-Fi */}
      <div className="p-1 hover:bg-white/10 rounded" title="Internet Access">
        <span className="icon-[material-symbols--wifi] w-4 h-4 text-white/80" />
      </div>

      {/* Volume */}
      <div 
        className="p-1 hover:bg-white/10 rounded" 
        onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
        }}
        title="Volume"
      >
        <span className={`${isMuted ? 'icon-[material-symbols--volume-off]' : 'icon-[material-symbols--volume-up]'} w-4 h-4 text-white/80`} />
      </div>

      {/* Battery */}
      <div className="p-1 hover:bg-white/10 rounded" title="Battery: 100% (Plugged in)">
        <span className="icon-[material-symbols--battery-charging-full] w-4 h-4 text-green-400" />
      </div>

    </div>
  );
}