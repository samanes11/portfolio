"use client";

interface DesktopIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  onOpen: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function DesktopIcon({
  id,
  icon,
  label,
  onOpen,
  isSelected,
  onSelect,
}: DesktopIconProps) {
  return (
    <div
      onClick={() => onSelect?.(id)}
      onDoubleClick={() => onOpen(id)}
      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl cursor-pointer transition-colors w-20 ${
        isSelected ? "bg-white/20" : ""
      }`}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-yellow-600 rounded-lg text-white shadow-lg flex items-center justify-center">
        {icon}
      </div>
      <span
        className="text-white font-semibold drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] text-center leading-tight"
        style={{ fontSize: 11 }}
      >
        {label}
      </span>
    </div>
  );
}
