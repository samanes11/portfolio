"use client";

import { useState, useEffect } from "react";
import WindowFloat from "../ui/WindowFloat";

interface MediaItem {
  id: string;
  image: string;
  thumbnail?: string;
  title: string;
  description?: string;
  category: string;
}

interface MediaPlayerWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  filterProjectId?: string | null;
  onClearFilter?: () => void;
}

const categoryGradient: Record<string, string> = {
  MicroService: "from-green-400 via-green-700 to-green-800",
  Web: "from-yellow-300 via-yellow-600 to-yellow-500",
  Mobile: "from-orange-400 via-orange-500 to-orange-600",
};

export default function MediaPlayerWindow({
  onClose,
  onMinimize,
  filterProjectId = null,
  onClearFilter,
}: MediaPlayerWindowProps) {
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/system/showMedia?p=media")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setAllMedia(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const media = filterProjectId
    ? allMedia.filter((m) => m.id === filterProjectId)
    : allMedia;

  // Detail view
  if (selectedImage) {
    const img = allMedia.find((i) => i.id === selectedImage);
    if (!img) return null;

    return (
      <WindowFloat
        onclose={onClose}
        onminimize={onMinimize}
        padding={0}
        maxWidth="160vh"
        title={img.title}
        contentStyle={{
          background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
        }}
      >
        <div style={{ direction: "ltr" }}>
          <div className="px-4 py-3 bg-[#1e1e1e] border-b border-gray-700">
            <button
              onClick={() => setSelectedImage(null)}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="icon-[mdi--arrow-left] w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="bg-black p-4 sm:p-8 flex items-center justify-center">
            <div className="relative max-w-5xl mx-auto w-full">
              <img
                src={img.image}
                alt={img.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </WindowFloat>
    );
  }

  // Grid view
  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      maxWidth="120vh"
      title="Media Player"
      contentStyle={{
        background: "#242323",
      }}
    >
      <div style={{ direction: "ltr" }}>
        {/* Filter banner */}
        {filterProjectId && (
          <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20">
            <span className="icon-[material-symbols--filter-alt] w-4 h-4 text-amber-400" />
            <span
              className="text-amber-300 sm:text-sm font-medium flex-1 truncate"
              style={{ fontSize: 12 }}
            >
              Showing screenshots for this project
            </span>
            {onClearFilter && (
              <button
                onClick={onClearFilter}
                className="text-gray-400 hover:text-white transition-colors text-xs underline underline-offset-2 shrink-0"
              >
                Show all
              </button>
            )}
          </div>
        )}

        <div className="min-h-[400px] flex items-center justify-center">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="w-10 h-10 border-4 border-gray-600 border-t-amber-500 rounded-full animate-spin" />
              <span style={{ fontSize: 16 }}>Loading media...</span>
            </div>
          )}

          {/* Empty filter result */}
          {!loading && allMedia.length > 0 && media.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
              <span className="icon-[material-symbols--image-not-supported-outline] w-12 h-12" />
              <span style={{ fontSize: 14 }}>
                No screenshots found for this project
              </span>
              {onClearFilter && (
                <button
                  onClick={onClearFilter}
                  className="text-amber-400 hover:text-amber-300 text-xs underline underline-offset-2 transition-colors"
                >
                  View all media
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && media.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-3 w-full">
              {media.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 shadow-lg ring-2 ring-transparent group-hover:ring-pink-500/50 transition-all duration-300">
                    <img
                      src={img.thumbnail || img.image}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Zoom overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <span className="icon-[material-symbols-light--pan-zoom-rounded] w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>
                    {/* Category badge */}
                    <div
                      className={`absolute top-2 left-2 px-2.5 py-1 rounded-full bg-gradient-to-r ${
                        categoryGradient[img.category] ??
                        "from-gray-400 to-gray-500"
                      } text-xs text-white font-semibold shadow-xl backdrop-blur-sm`}
                    >
                      {img.category}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="mt-3 px-1">
                    <span
                      className="text-white font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-orange-500 transition-all duration-300 line-clamp-1 text-sm sm:text-base block"
                      style={{ fontSize: 15 }}
                    >
                      {img.title}
                    </span>
                    {img.description && (
                      <span
                        className="text-gray-400 line-clamp-2 mt-1 text-xs sm:text-sm block"
                        style={{ fontSize: 13 }}
                      >
                        {img.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WindowFloat>
  );
}
