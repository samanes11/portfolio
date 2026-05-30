"use client";

import { useState, useEffect, useCallback } from "react";
import LoginScreen from "@/components/LoginScreen";
import Taskbar from "@/components/Taskbar";
import StartMenu from "@/components/StartMenu";
import DesktopIcon from "@/components/DesktopIcon";
import Notification from "@/components/Notification";
import AboutWindow from "@/components/windows/AboutWindow";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import ResumeWindowPC from "@/components/windows/ResumeWindowPC";
import ResumeWindowMobile from "@/components/windows/ResumeWindowMobile";
import ContactWindow from "@/components/windows/ContactWindow";
import GameWindow from "@/components/windows/GameWindow";
import MediaPlayerWindow from "@/components/windows/MediaPlayerWindow";
import ControlPanel from "@/components/admin/ControlPanel";
import { ToastContainer } from "@/components/ui/Toast";

type WindowId =
  | "about"
  | "projects"
  | "resume"
  | "contact"
  | "game"
  | "mediaplayer"
  | "AI Terminal"
  | "controlPanel";

const desktopIcons: { id: WindowId; icon: string; label: string }[] = [
  { id: "about", icon: "icon-[octicon--person-fill-24]", label: "About Me" },
  {
    id: "projects",
    icon: "icon-[teenyicons--folder-solid]",
    label: "Projects",
  },
  {
    id: "resume",
    icon: "icon-[material-symbols--description-rounded]",
    label: "Resume",
  },
  { id: "contact", icon: "icon-[ic--baseline-email]", label: "Contact" },
];

export default function PortfolioPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [openWindows, setOpenWindows] = useState<Set<WindowId>>(new Set());
  const [minimizedWindows, setMinimizedWindows] = useState<WindowId[]>([]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);

  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [mediaFilterProjectId, setMediaFilterProjectId] = useState<
    string | null
  >(null);

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const show = setTimeout(() => setShowNotification(true), 7_000);
    const hide = setTimeout(() => setShowNotification(false), 19_000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [isLoggedIn]);

  const openWindow = useCallback((id: string) => {
    const wid = id as WindowId;
    setOpenWindows((prev) => new Set(prev).add(wid));
    setMinimizedWindows((prev) => prev.filter((w) => w !== wid));
    setActiveWindow(wid);
    setStartMenuOpen(false);
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setMinimizedWindows((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setOpenWindows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const handleTaskbarClick = useCallback(
    (id: string) => {
      const wid = id as WindowId;
      if (minimizedWindows.includes(wid)) {
        openWindow(wid);
      } else if (openWindows.has(wid)) {
        minimizeWindow(wid);
      } else {
        openWindow(wid);
      }
    },
    [minimizedWindows, openWindows, openWindow, minimizeWindow],
  );

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={() => setIsLoggedIn(true)}
        onAdminLogin={() => {
          setIsLoggedIn(true);
          setIsAdmin(true);
          openWindow("controlPanel");
        }}
      />
    );
  }

  const allOpenForTaskbar = [
    ...Array.from(openWindows),
    ...minimizedWindows,
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pb-16"
      style={{
        backgroundImage: "url(/437.png)",
        backgroundSize: "cover",
        direction: "ltr",
      }}
      onClick={() => setSelectedIcon(null)}
    >
      {/* Desktop Icons */}
      <div
        className="p-5 flex flex-col gap-4 w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        {desktopIcons.map(({ id, icon, label }) => (
          <DesktopIcon
            key={id}
            id={id}
            icon={<span className={`${icon} w-[26px] h-[26px]`} />}
            label={label}
            onOpen={(wid) => openWindow(wid)}
            isSelected={selectedIcon === id}
            onSelect={(wid) => setSelectedIcon(wid)}
          />
        ))}
      </div>

      {/* Windows */}
      {openWindows.has("about") && (
        <AboutWindow
          onClose={() => closeWindow("about")}
          onMinimize={() => minimizeWindow("about")}
        />
      )}

      {openWindows.has("projects") && (
        <ProjectsWindow
          onClose={() => closeWindow("projects")}
          onMinimize={() => minimizeWindow("projects")}
          onOpenMediaPlayer={(projectId) => {
            setMediaFilterProjectId(projectId);
            openWindow("mediaplayer");
          }}
        />
      )}

      {openWindows.has("resume") &&
        (isMobile ? (
          <ResumeWindowMobile
            onClose={() => closeWindow("resume")}
            onMinimize={() => minimizeWindow("resume")}
          />
        ) : (
          <ResumeWindowPC
            onClose={() => closeWindow("resume")}
            onMinimize={() => minimizeWindow("resume")}
          />
        ))}

      {openWindows.has("contact") && (
        <ContactWindow
          onClose={() => closeWindow("contact")}
          onMinimize={() => minimizeWindow("contact")}
        />
      )}

      {openWindows.has("game") && (
        <GameWindow
          onClose={() => closeWindow("game")}
          onMinimize={() => minimizeWindow("game")}
        />
      )}

      {openWindows.has("mediaplayer") && (
        <MediaPlayerWindow
          onClose={() => closeWindow("mediaplayer")}
          onMinimize={() => minimizeWindow("mediaplayer")}
          filterProjectId={mediaFilterProjectId}
          onClearFilter={() => setMediaFilterProjectId(null)}
        />
      )}

      {openWindows.has("controlPanel") && isAdmin && (
        <ControlPanel
          onClose={() => closeWindow("controlPanel")}
          onMinimize={() => minimizeWindow("controlPanel")}
        />
      )}

      {/* Notification */}
      {showNotification && (
        <Notification
          onClose={() => setShowNotification(false)}
          onAboutClick={() => openWindow("about")}
          onProjectsClick={() => openWindow("projects")}
        />
      )}

      {/* Start Menu */}
      {startMenuOpen && (
        <StartMenu
          onItemClick={(id) => openWindow(id)}
          onClose={() => setStartMenuOpen(false)}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        openWindows={allOpenForTaskbar}
        minimizedWindows={minimizedWindows}
        activeWindow={activeWindow}
        onOpenWindow={handleTaskbarClick}
        onToggleStart={() => setStartMenuOpen((o) => !o)}
        currentTime={currentTime}
      />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}