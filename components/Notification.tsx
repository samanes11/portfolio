"use client";

interface NotificationProps {
  onClose: () => void;
  onAboutClick: () => void;
  onProjectsClick: () => void;
}

export default function Notification({
  onClose,
  onAboutClick,
  onProjectsClick,
}: NotificationProps) {
  return (
    <div className="fixed bottom-20 right-6 z-[1002] animate-slideUp">
      <div className="bg-white backdrop-blur-xl rounded-lg shadow-2xl border border-amber-900/30 overflow-hidden w-80">
        {/* Header */}
        <div className="flex items-center bg-gradient-to-r from-amber-900/80 to-stone-800/80 px-4 py-2 gap-2 border-b border-amber-900/30">
          <div className="flex items-center justify-center">
            <span style={{ fontSize: 19 }}>ℹ️</span>
          </div>
          <span className="text-white font-semibold flex-1" style={{ fontSize: 13 }}>
            Notification
          </span>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors w-5 h-5 flex items-center justify-center"
          >
            <span className="icon-[mdi--close] w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-start p-4 gap-3" style={{ direction: "ltr" }}>
          <span className="text-gray-600 leading-relaxed" style={{ fontSize: 13 }}>
            Hi, I&apos;m Saman! Welcome to my personal site, Hope you&apos;re visiting
            from a PC! double-click the folders to explore.
          </span>
          <span className="text-gray-600" style={{ fontSize: 12 }}>
            Get Started:{" "}
            <span
              className="text-amber-700 hover:text-amber-900 hover:underline cursor-pointer transition-colors"
              onClick={onAboutClick}
            >
              About Me
            </span>{" "}
            |{" "}
            <span
              className="text-amber-700 hover:text-amber-900 hover:underline cursor-pointer transition-colors"
              onClick={onProjectsClick}
            >
              My Projects
            </span>
          </span>
        </div>
      </div>

      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
