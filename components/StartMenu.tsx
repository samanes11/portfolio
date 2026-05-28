"use client";

import { useState } from "react";
import Image from "next/image";

interface StartMenuProps {
  onItemClick: (id: string) => void;
  onClose: () => void;
  recentOpen?: boolean;
}

const socialLinks = [
  {
    name: "GitHub",
    url: "https://qepal.com/i/ahPyU",
    icon: "icon-[bi--github]",
    colorFrom: "from-gray-700/20", colorTo: "to-gray-900/20",
    textColor: "text-gray-400",
    hoverFrom: "group-hover:from-gray-700", hoverTo: "group-hover:to-gray-900",
  },
  {
    name: "LinkedIn",
    url: "https://qepal.com/i/JUG6m",
    icon: "icon-[ri--linkedin-box-fill]",
    colorFrom: "from-blue-600/20", colorTo: "to-blue-800/20",
    textColor: "text-blue-400",
    hoverFrom: "group-hover:from-blue-600", hoverTo: "group-hover:to-blue-800",
  },
  {
    name: "Instagram",
    url: "https://qepal.com/i/SeTZB",
    icon: "icon-[basil--instagram-outline]",
    colorFrom: "from-pink-500/20", colorTo: "to-purple-600/20",
    textColor: "text-pink-400",
    hoverFrom: "group-hover:from-pink-500", hoverTo: "group-hover:to-purple-600",
  },
  {
    name: "Telegram",
    url: "https://qepal.com/i/oAb7x",
    icon: "icon-[bxl--telegram]",
    colorFrom: "from-sky-400/20", colorTo: "to-blue-600/20",
    textColor: "text-sky-400",
    hoverFrom: "group-hover:from-sky-400", hoverTo: "group-hover:to-blue-600",
  },
];

const menuItems = [
  { id: "about",       icon: "icon-[octicon--person-fill-24]",                   label: "About Me",    desc: "Personal information" },
  { id: "projects",    icon: "icon-[teenyicons--folder-solid]",                   label: "Projects",    desc: "View my work" },
  { id: "resume",      icon: "icon-[material-symbols--description-rounded]",      label: "Resume",      desc: "Experience & education" },
  { id: "contact",     icon: "icon-[ic--baseline-email]",                         label: "Contact",     desc: "Get in touch" },
  { id: "AI Terminal", icon: "icon-[eos-icons--terminal]",                        label: "AI Terminal", desc: "AI Assistant" },
];

const recentApps = [
  { name: "Steam",          icon: "icon-[cib--steam]",                                  color: "from-slate-700 to-slate-900" },
  { name: "VS Code",        icon: "icon-[mdi--microsoft-visual-studio-code]",           color: "from-blue-500 to-blue-600" },
  { name: "Spotify",        icon: "icon-[ri--spotify-fill]",                            color: "from-green-500 to-green-600" },
  { name: "Figma",          icon: "icon-[streamline-logos--figma-logo-block]",          color: "from-purple-500 to-purple-600" },
  { name: "Edge",           icon: "icon-[bi--browser-edge]",                            color: "from-[#0078D7] to-[#00A4EF]" },
  { name: "Photoshop",      icon: "icon-[icon-park-solid--adobe-photoshop]",            color: "from-[#0F2027] to-[#203A43]" },
  { name: "Android Studio", icon: "icon-[mdi--android-studio]",                        color: "from-emerald-600 to-teal-700" },
];

export default function StartMenu({ onItemClick, onClose }: StartMenuProps) {
  const [recentOpen, setRecentOpen] = useState(false);
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1000] bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className="fixed bottom-16 left-3 right-3 sm:left-3 sm:right-auto sm:w-[400px] max-w-3xl bg-gradient-to-br from-gray-800/95 via-amber-950/95 to-stone-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-900/30 z-[1001] overflow-hidden"
        style={{ direction: "ltr" }}
      >
        {/* Profile */}
        <div className="bg-gradient-to-r from-amber-900/80 to-stone-800/80 px-6 py-4 border-b border-amber-900/30 flex items-center gap-4">
          <Image
            src="/1.jpg"
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col flex-1">
            <span className="text-white font-bold" style={{ fontSize: 16 }}>
              Saman Esmaellpour
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-row" style={{ height: 400 }}>
          {/* Left – menu items */}
          <div className="flex-1 flex flex-col p-3 gap-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg"
                onClick={() => onItemClick(item.id)}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 text-white group-hover:from-yellow-500 group-hover:to-amber-500 transition-all duration-300 shadow-lg group-hover:scale-105 flex items-center justify-center flex-shrink-0">
                  <span className={`${item.icon} w-[22px] h-[22px]`} />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-white font-semibold" style={{ fontSize: 13 }}>
                    {item.label}
                  </span>
                  <span className="text-gray-400" style={{ fontSize: 10 }}>
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px bg-white/10" />

          {/* Right – quick access */}
          <div className="w-40 flex flex-col p-3 gap-2 bg-gradient-to-b from-amber-950/60 to-stone-900/60">
            <span className="text-gray-200 px-2 mb-1" style={{ fontSize: 11 }}>
              Quick Access
            </span>

            {/* Game */}
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg group"
              onClick={() => onItemClick("game")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
                <span className="icon-[solar--gameboy-bold] w-[20px] h-[20px]" />
              </div>
              <span className="text-white font-medium" style={{ fontSize: 12 }}>
                Game
              </span>
            </div>

            {/* Media Player */}
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg group"
              onClick={() => onItemClick("mediaplayer")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-800 to-orange-500/20 text-red-400 group-hover:from-red-700 group-hover:to-orange-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
                <span className="icon-[material-symbols-light--smart-display] w-[20px] h-[20px]" />
              </div>
              <span className="text-white font-medium" style={{ fontSize: 12 }}>
                Media Player
              </span>
            </div>

            <div className="border-t border-white/10 my-2" />
            <span className="text-gray-200 px-2 mb-1" style={{ fontSize: 11 }}>
              Social
            </span>

            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg group"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${social.colorFrom} ${social.colorTo} ${social.textColor} ${social.hoverFrom} ${social.hoverTo} group-hover:text-white transition-all duration-300 flex items-center justify-center`}
                >
                  <span className={`${social.icon} w-[20px] h-[20px]`} />
                </div>
                <span className="text-white font-medium" style={{ fontSize: 12 }}>
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Recently Used */}
        <div className="px-3 pb-2">
          <div className="border-t border-white/10 pt-2">
            <div className="relative">
              {recentOpen && (
                <div className="absolute bottom-full mb-1 left-0 bg-gradient-to-br from-amber-950/98 to-stone-900/98 backdrop-blur-xl rounded-xl w-[180px] p-1 shadow-xl border border-amber-900/30 z-10">
                  {recentApps.map((app, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 cursor-not-allowed">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${app.color} shadow-lg flex items-center justify-center`}>
                        <span className={`${app.icon} w-4 h-4 text-white`} />
                      </div>
                      <span className="text-gray-300" style={{ fontSize: 10 }}>
                        {app.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setRecentOpen((o) => !o)}
                className="flex items-center justify-between px-4 py-2 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-xl w-[180px]"
              >
                <span className="text-gray-200" style={{ fontSize: 11 }}>Recently Used</span>
                <span className="text-gray-200 transition-transform duration-200" style={{ fontSize: 11, display: "inline-block", transform: recentOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▲</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-amber-900/30 bg-gradient-to-r from-amber-950/70 to-stone-900/70">
          <div className="flex flex-row p-2 gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-yellow-500/20 cursor-pointer transition-all duration-300 rounded-xl group"
              onClick={() => window.location.reload()}
            >
              <span className="icon-[iconamoon--restart-bold] w-[20px] h-[20px] text-gray-200 group-hover:text-yellow-300 transition-colors" />
              <span className="text-gray-200 font-medium" style={{ fontSize: 12 }}>restart</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-red-500/20 cursor-not-allowed transition-all duration-300 rounded-xl group">
              <span className="icon-[wpf--shutdown] w-[18px] h-[18px] text-gray-200 group-hover:text-red-600 transition-colors" />
              <span className="text-gray-200 font-medium" style={{ fontSize: 12 }}>Shutdown</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}