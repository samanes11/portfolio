"use client";

import { useState, useRef } from "react";
import WindowFloat from "../ui/WindowFloat";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onBack: () => void;
}

export default function AdminLayoutManagement({ onClose, onMinimize, onBack }: Props) {
  const [projectName, setProjectName]   = useState("");
  const [desktopImages, setDesktopImages] = useState<string[]>([]);
  const [mobileImages, setMobileImages]  = useState<string[]>([]);
  const [showPoster, setShowPoster]      = useState(false);
  const [downloading, setDownloading]    = useState(false);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef  = useRef<HTMLInputElement>(null);

  // ── Image upload helpers ───────────────────────────────────────────────────

  function readFile(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = (e) => res(e.target!.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  async function handleDesktopUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await readFile(file);
    setDesktopImages((prev) => [...prev, data]);
    e.target.value = "";
  }

  async function handleMobileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await readFile(file);
    setMobileImages((prev) => [...prev, data]);
    e.target.value = "";
  }

  // ── Canvas download ────────────────────────────────────────────────────────

  async function downloadPoster() {
    const posterEl = document.getElementById("posterOutput");
    if (!posterEl) return;
    setDownloading(true);

    try {
      const { width, height } = posterEl.getBoundingClientRect();
      const scale  = 2;
      const canvas = document.createElement("canvas");
      canvas.width  = width  * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      // Background
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "rgba(20,25,39,1)");
      bg.addColorStop(1, "rgba(10,13,20,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Project name
      ctx.fillStyle = "#e9edf8";
      ctx.font = "bold 24px Arial";
      ctx.fillText(projectName, width - 30, 45);

      const loadImg = (src: string) =>
        new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload  = () => res(img);
          img.onerror = rej;
          img.src = src;
        });

      // Desktop mockup
      if (desktopImages.length > 0) {
        const img   = await loadImg(desktopImages[0]);
        const dW    = width * 0.56;
        const dH    = (dW * 7.9) / 16;
        const dX    = 40, dY = 120;

        // frame
        const frameG = ctx.createLinearGradient(dX, dY, dX, dY + dH + 32);
        frameG.addColorStop(0, "#e8eaed");
        frameG.addColorStop(1, "#d5d8dc");
        ctx.fillStyle = frameG;
        ctx.beginPath();
        (ctx as any).roundRect(dX, dY, dW, dH + 32, 12);
        ctx.fill();

        // screen
        ctx.fillStyle = "#000";
        ctx.beginPath();
        (ctx as any).roundRect(dX + 8, dY + 8, dW - 16, dH, 6);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        (ctx as any).roundRect(dX + 8, dY + 8, dW - 16, dH, 6);
        ctx.clip();
        ctx.drawImage(img, dX + 8, dY + 8, dW - 16, dH);
        ctx.restore();

        // stand
        const sCx = dX + dW / 2, sBy = dY + dH + 56;
        const baseG = ctx.createLinearGradient(sCx - 40, sBy - 4, sCx + 40, sBy);
        baseG.addColorStop(0, "rgba(168,173,181,0)");
        baseG.addColorStop(0.2, "rgba(168,173,181,1)");
        baseG.addColorStop(0.8, "rgba(168,173,181,1)");
        baseG.addColorStop(1, "rgba(168,173,181,0)");
        ctx.fillStyle = baseG;
        ctx.beginPath();
        (ctx as any).roundRect(sCx - 40, sBy - 4, 80, 4, 2);
        ctx.fill();

        ctx.fillStyle = "#b8bcc4";
        ctx.beginPath();
        (ctx as any).roundRect(sCx - 20, sBy - 24, 40, 20, [2, 2, 0, 0]);
        ctx.fill();
      }

      // Mobile mockups
      if (mobileImages.length > 0) {
        const imgs = await Promise.all(mobileImages.slice(0, 3).map(loadImg));
        const mW   = 200;
        const mH   = (mW * 19.5) / 9;

        imgs.forEach((img, i) => {
          ctx.save();
          const oX = width - 48 - i * 220;
          const oY = height - 40 - mH - i * 10;
          const rot = (-6 + i * 3) * (Math.PI / 180);

          ctx.translate(oX, oY + mH);
          ctx.rotate(rot);
          ctx.translate(-oX, -(oY + mH));

          // frame
          const fG = ctx.createLinearGradient(oX - mW, oY, oX - mW, oY + mH + 8);
          fG.addColorStop(0, "#1c1f2a");
          fG.addColorStop(1, "#12151e");
          ctx.fillStyle = fG;
          ctx.beginPath();
          (ctx as any).roundRect(oX - mW, oY, mW, mH + 8, 24);
          ctx.fill();

          // screen
          ctx.fillStyle = "#000";
          ctx.beginPath();
          (ctx as any).roundRect(oX - mW + 4, oY + 4, mW - 8, mH, 20);
          ctx.fill();

          ctx.save();
          ctx.beginPath();
          (ctx as any).roundRect(oX - mW + 4, oY + 4, mW - 8, mH, 20);
          ctx.clip();
          ctx.drawImage(img, oX - mW + 4, oY + 4, mW - 8, mH);
          ctx.restore();
          ctx.restore();
        });
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a   = document.createElement("a");
        a.href     = url;
        a.download = `${projectName || "poster"}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <WindowFloat
      onclose={onClose} onminimize={onMinimize} showMinimize
      maxWidth="140vh" title="Poster Builder"
      contentStyle={{ background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)" }}
    >
      <div className="flex flex-col h-full overflow-auto" style={{ direction: "ltr" }}>
        {/* Header */}
        <div className="flex flex-row items-center flex-wrap sm:flex-nowrap gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-[#1e1e1e] border-b border-gray-700">
          <div className="flex flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button onClick={onBack} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
              <span className="icon-[mdi--arrow-left] w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <span className="icon-[mdi--image-frame] w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-sm sm:text-lg truncate">Poster Builder</span>
              <span className="text-white/70 text-xs truncate">Control Panel / Layout</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-6 bg-[#1a1a1a] overflow-auto">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">

            {/* Inputs */}
            <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-white/10 flex flex-col gap-5">
              <span className="text-white font-semibold text-base">Project Information</span>

              {/* Project name */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-300 font-bold text-sm">Project Name:</label>
                <input
                  type="text" value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Example: Management Dashboard"
                  className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm outline-none focus:border-cyan-500 transition-colors text-gray-300"
                  style={{ background: "rgba(255,255,255,0.05)", fontSize: 13 }}
                />
              </div>

              {/* Upload grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">

                {/* Desktop */}
                <div className="flex flex-col gap-3">
                  <span className="text-gray-300 font-bold text-sm">Desktop Image:</span>
                  {desktopImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {desktopImages.map((img, i) => (
                        <div key={i} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="w-20 h-14 rounded-lg object-cover border-2 border-gray-600" />
                          <button
                            onClick={() => setDesktopImages((p) => p.filter((_, j) => j !== i))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => desktopInputRef.current?.click()}
                    className="self-start flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono transition-colors"
                  >
                    <span className="icon-[mdi--plus] w-4 h-4" /> Add Desktop Image
                  </button>
                  <input ref={desktopInputRef} type="file" accept="image/*" className="hidden" onChange={handleDesktopUpload} />
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-3">
                  <span className="text-gray-300 font-bold text-sm">Mobile Images:</span>
                  {mobileImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mobileImages.map((img, i) => (
                        <div key={i} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="w-20 h-14 rounded-lg object-cover border-2 border-gray-600" />
                          <button
                            onClick={() => setMobileImages((p) => p.filter((_, j) => j !== i))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => mobileInputRef.current?.click()}
                    className="self-start flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono transition-colors"
                  >
                    <span className="icon-[mdi--plus] w-4 h-4" /> Add Mobile Image
                  </button>
                  <input ref={mobileInputRef} type="file" accept="image/*" className="hidden" onChange={handleMobileUpload} />
                </div>
              </div>

              {/* Generate */}
              <button
                onClick={() => setShowPoster(true)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-mono font-bold transition-all mt-2"
              >
                <span className="icon-[mdi--image-plus] w-5 h-5" />
                Generate Poster
              </button>
            </div>

            {/* Poster preview */}
            {showPoster && (
              <div className="flex flex-col gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-white/10 flex flex-col gap-4">
                  <span className="text-white font-semibold text-base">Poster Preview</span>

                  {/* Canvas preview */}
                  <div
                    id="posterOutput"
                    className="relative w-full rounded-lg overflow-hidden"
                    style={{
                      aspectRatio: "16/9",
                      background: "linear-gradient(160deg, rgba(20,25,39,1), rgba(10,13,20,1))",
                    }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        filter: "blur(30px)",
                        background:
                          "radial-gradient(60% 40% at 20% 20%, rgba(122,169,255,0.18), transparent 50%), radial-gradient(50% 40% at 80% 80%, rgba(122,255,214,0.12), transparent 55%)",
                      }}
                    />

                    {/* Title */}
                    <div className="absolute top-5 left-5 right-5 z-10 flex justify-end">
                      <span className="text-2xl font-bold text-[#e9edf8]">{projectName}</span>
                    </div>

                    {/* Desktop mockup preview */}
                    {desktopImages.length > 0 && (
                      <div
                        style={{
                          position: "absolute", left: 40, top: 120, width: "56%",
                          borderRadius: 12, padding: "8px 8px 24px 8px",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
                          background: "linear-gradient(to bottom, #e8eaed, #d5d8dc)",
                        }}
                      >
                        <div style={{ width: "100%", aspectRatio: "16/7.9", borderRadius: 6, overflow: "hidden", background: "#000" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={desktopImages[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        {/* monitor stand */}
                        <div style={{ position: "absolute", bottom: -24, left: "50%", transform: "translateX(-50%)", width: 140, height: 24 }}>
                          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 80, height: 4, background: "linear-gradient(90deg,transparent,#a8adb5 20%,#a8adb5 80%,transparent)", borderRadius: 2 }} />
                          <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 40, height: 20, background: "linear-gradient(to bottom,#c8ccd4,#9fa4ac)", borderRadius: "2px 2px 0 0" }} />
                        </div>
                      </div>
                    )}

                    {/* Mobile mockups preview */}
                    {mobileImages.length > 0 && (
                      <div style={{ position: "absolute", right: 48, bottom: 40, display: "flex", gap: 20, zIndex: 5, flexDirection: "row-reverse" }}>
                        {mobileImages.slice(0, 3).map((img, i) => (
                          <div key={i} style={{
                            width: 200,
                            background: "linear-gradient(145deg,#1c1f2a,#12151e)",
                            borderRadius: 24, padding: 4,
                            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                            transform: `rotate(${-6 + i * 3}deg) translateY(${i * 10}px)`,
                          }}>
                            <div style={{ aspectRatio: "9/19.5", borderRadius: 20, overflow: "hidden", background: "#000" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10 flex flex-wrap gap-3">
                  <button
                    onClick={downloadPoster}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-mono font-bold transition-all disabled:opacity-50"
                  >
                    <span className="icon-[mdi--download] w-5 h-5" />
                    {downloading ? "Generating..." : "Download as Image"}
                  </button>
                  <button
                    onClick={() => { setProjectName(""); setDesktopImages([]); setMobileImages([]); setShowPoster(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-mono font-bold transition-all"
                  >
                    <span className="icon-[mdi--restart] w-5 h-5" />
                    Restart
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </WindowFloat>
  );
}
