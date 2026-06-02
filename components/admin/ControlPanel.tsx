"use client";

import { useState } from "react";
import WindowFloat from "../ui/WindowFloat";
import AdminProjectManagement from "./ProjectAdmin";
import AdminMediaManagement from "./MediaAdmin";
import AdminMessagesManagement from "./MsgAdmin";
import AdminLayoutManagement from "./LayoutAdmin";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
}

type Section = "projects" | "media" | "messages" | "layout" | null;

const sections: {
  id: Section;
  label: string;
  icon: string;
  from: string;
  to: string;
  iconColor: string;
}[] = [
  {
    id: "projects",
    label: "Project Management",
    icon: "icon-[mdi--folder-edit]",
    from: "from-blue-500/10",
    to: "to-blue-600/10",
    iconColor: "from-blue-500 to-blue-600",
  },
  {
    id: "media",
    label: "Media Management",
    icon: "icon-[mdi--image-multiple]",
    from: "from-purple-500/10",
    to: "to-purple-600/10",
    iconColor: "from-purple-500 to-purple-600",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "icon-[mdi--message-text]",
    from: "from-emerald-500/10",
    to: "to-emerald-600/10",
    iconColor: "from-emerald-500 to-emerald-600",
  },
  {
    id: "layout",
    label: "Poster Builder",
    icon: "icon-[mdi--image-frame]",
    from: "from-cyan-500/10",
    to: "to-cyan-600/10",
    iconColor: "from-cyan-500 to-cyan-600",
  },
];

export default function ControlPanel({ onClose, onMinimize }: Props) {
  const [activeSection, setActiveSection] = useState<Section>(null);

  const back = () => setActiveSection(null);
  const sharedProps = { onClose, onMinimize, onBack: back };

  if (activeSection === "projects")
    return <AdminProjectManagement {...sharedProps} />;
  if (activeSection === "media")
    return <AdminMediaManagement {...sharedProps} />;
  if (activeSection === "messages")
    return <AdminMessagesManagement {...sharedProps} />;
  if (activeSection === "layout")
    return <AdminLayoutManagement {...sharedProps} />;

  // ── Main menu ─────────────────────────────────────────────────────────────
  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      maxWidth="120vh"
      title="Control Panel"
      contentStyle={{ background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)" }}
    >
      <div className="flex flex-col h-full w-full" style={{ direction: "ltr" }}>
        {/* Header */}
        <div className="flex flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#1e1e1e] border-b border-gray-700">
          <div className="flex items-center gap-3 text-white text-lg sm:text-xl font-semibold">
            <span className="icon-[mdi--shield-account] w-6 h-6 sm:w-7 sm:h-7" />
            Control Panel
          </div>
        </div>

        {/* Grid */}
        <div className="flex items-center justify-center p-4 sm:p-8 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl">
            {sections.map(({ id, label, icon, from, to, iconColor }) => (
              <div
                key={id}
                onClick={() => setActiveSection(id)}
                className="group cursor-pointer"
              >
                <div
                  className={`bg-gradient-to-br ${from} ${to} hover:brightness-125 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${iconColor} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <span
                        className={`${icon} w-8 h-8 sm:w-10 sm:h-10 text-white`}
                      />
                    </div>
                    <span className="text-white font-semibold text-base sm:text-lg">
                      {label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFloat>
  );
}
