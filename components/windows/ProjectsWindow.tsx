"use client";

import { useState, useEffect } from "react";
import WindowFloat from "../ui/WindowFloat";

interface Project {
  id: string;
  name: string;
  date: string;
  platform: string;
  tech: string;
  desc: string;
}

interface MediaItem {
  id: string;
  image: string;
  thumbnail?: string;
  title: string;
  description?: string;
  category: string;
}

interface ProjectsWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onOpenMediaPlayer?: (projectId: string) => void;
}

export default function ProjectsWindow({
  onClose,
  onMinimize,
  onOpenMediaPlayer,
}: ProjectsWindowProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetch("/api/system/showProject")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setProjects(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const project = projects.find((p) => p.id === selectedProject);

  // Media Preview Modal
  if (previewMedia) {
    return (
      <WindowFloat
        onclose={() => setPreviewMedia(null)}
        showMinimize={false}
        maxWidth="700px"
        title="Media Preview"
        contentStyle={{ background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)" }}
      >
        <div className="flex flex-col gap-4 p-5" style={{ direction: "ltr" }}>
          <div className="w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewMedia.image}
              alt={previewMedia.title}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-row items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full bg-gradient-to-r ${
                  previewMedia.category === "MicroService"
                    ? "from-green-400 via-green-700 to-green-800"
                    : previewMedia.category === "Web"
                    ? "from-yellow-300 via-yellow-600 to-yellow-500"
                    : previewMedia.category === "Mobile"
                    ? "from-orange-400 via-orange-500 to-orange-600"
                    : "from-gray-400 to-gray-500"
                } text-xs text-white font-semibold`}
              >
                {previewMedia.category}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold" style={{ fontSize: 18 }}>
                {previewMedia.title}
              </span>
              <span className="text-gray-600 mt-2" style={{ fontSize: 14 }}>
                {previewMedia.description}
              </span>
            </div>
          </div>
        </div>
      </WindowFloat>
    );
  }

  // Project Detail View 
  if (selectedProject && project) {
    return (
      <WindowFloat
        onclose={onClose}
        onminimize={onMinimize}
        showMinimize
        maxWidth="120vh"
        title={project.name}
        contentStyle={{ background: "#2d2d2d" }}
      >
        <div style={{ direction: "ltr" }}>
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-[#1e1e1e] border-b border-gray-700">
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
            >
              <span className="icon-[mdi--arrow-left] w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <span className="icon-[fluent-emoji-flat--open-file-folder] w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-base sm:text-lg truncate">
                {project.name}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm truncate">
                Projects / {project.name}
              </div>
            </div>
            {/* Screenshots button */}
            {onOpenMediaPlayer && (
              <button
                onClick={() => onOpenMediaPlayer(project.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 hover:text-amber-300 transition-all text-xs sm:text-sm font-medium shrink-0"
              >
                <span className="icon-[solar--gallery-bold] w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Date:</span>
                <span className="text-white">{project.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Platform:</span>
                <span className="text-white">{project.platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Tech:</span>
                <span className="text-white break-all">{project.tech}</span>
              </div>
            </div>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {project.desc}
            </div>
          </div>
        </div>
      </WindowFloat>
    );
  }

  // Project List 
  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      showMinimize
      maxWidth="120vh"
      title="Projects"
      contentStyle={{ background: "#2d2d2d" }}
    >
      <div className="min-h-[400px] flex flex-col" style={{ direction: "ltr" }}>
        {/* Table header */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_100px_120px_200px] xl:grid-cols-[1fr_120px_140px_240px] gap-4 px-6 py-3 bg-[#252525] border-b border-gray-700">
          {["Name", "Date", "Platform", "Tech"].map((h) => (
            <span key={h} className="text-gray-400 font-medium text-sm">{h}</span>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-3">
              <div className="w-10 h-10 border-4 border-gray-600 border-t-amber-500 rounded-full animate-spin" />
              <span className="text-gray-400" style={{ fontSize: 14 }}>Loading projects...</span>
            </div>
          )}

          {!loading && projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className="group hover:bg-white/5 active:bg-white/10 cursor-pointer transition-all border-b border-gray-800/50 last:border-b-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_200px] lg:grid-cols-[1fr_120px_140px_240px] gap-2 sm:gap-4 px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <span className="icon-[material-symbols--folder] w-10 h-10 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm sm:text-base truncate group-hover:text-amber-400 transition-colors">
                        {project.name}
                      </div>
                      <div className="sm:hidden flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                        <span>{project.date}</span>
                        <span>•</span>
                        <span>{project.platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-gray-400 text-sm">{project.date}</div>
                <div className="hidden sm:flex items-center text-gray-400 text-sm truncate">{project.platform}</div>
                <div className="text-gray-400 text-xs sm:text-sm truncate sm:flex sm:items-center px-1 sm:px-0">
                  <span className="sm:hidden text-gray-500 font-medium">Tech: </span>
                  {project.tech}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WindowFloat>
  );
}
