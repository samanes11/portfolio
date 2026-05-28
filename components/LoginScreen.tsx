"use client";

import { useState } from "react";
import Image from "next/image";

interface LoginScreenProps {
  onLogin: () => void;
  onAdminLogin: () => void;
}

export default function LoginScreen({
  onLogin,
  onAdminLogin,
}: LoginScreenProps) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const handleAdminSubmit = async () => {
  //   try {
  //     const res = await fetch("/api/system/checkPass", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ pass: password }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       setShowAdminModal(false);
  //       setPassword("");
  //       onAdminLogin();
  //     } else {
  //       setError("Incorrect password");
  //     }
  //   } catch {
  //     setError("Connection error");
  //   }
  // };

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-black flex items-center justify-center px-4 relative overflow-hidden"
        style={{ direction: "ltr" }}
      >
        {/* Aurora */}
        <span className="aurora aurora1" />
        <span className="aurora aurora2" />
        <span className="aurora aurora3" />

        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 31) % 100}%`,
                animationDelay: `${(i % 6) * 0.6}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-6 text-center animate-fadeUp">
          {/* Avatar */}
          <div className="relative mx-auto">
            <div className="relative w-36 h-36 rounded-full p-[3px]">
              <div
                className="absolute inset-0 rounded-full animate-spinSlow opacity-20"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(219,143,56,0.6), rgba(219,143,56,0.6), rgba(150,85,33,0.6))",
                }}
              />
              <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden ring-2 ring-white/10 shadow-[0_0_40px_-10px_rgba(59,130,246,.5)] flex items-center justify-center">
                <Image
                  src="/1.jpg"
                  alt="Avatar"
                  width={150}
                  height={150}
                  className="rounded-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-700 font-bold tracking-wide animate-glowText"
              style={{ fontSize: 32 }}
            >
              Saman Esmaellpour
            </span>
            <span className="text-gray-300 font-light" style={{ fontSize: 14 }}>
              Full-Stack Developer (QE)
            </span>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col items-center gap-4">
            <button
              className="relative overflow-hidden flex items-center justify-center gap-2 w-1/2 py-2 px-4 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-xl shadow-lg transition-all duration-300 active:scale-[.98] hover:shadow-amber-500/30"
              onClick={onLogin}
            >
              <span className="icon-[mage--user] w-5 h-5" />
              <span className="font-mono">Login as guest</span>
              <span className="shine" />
            </button>

            <button
              className="relative overflow-hidden flex items-center justify-center gap-2 w-1/2 py-2 px-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-[.98]"
              onClick={() => setShowAdminModal(true)}
            >
              <span className="icon-[mdi--shield-account] w-5 h-5" />
              <span className="font-mono">Login as admin</span>
              <span className="shine" />
            </button>
          </div>

          <span
            className="text-gray-400 px-4 text-center"
            style={{ fontSize: 11 }}
          >
            For the best experience, please use a PC and press (F11) to enter
            full screen
          </span>
        </div>
      </div>

      {/* Admin Password Modal */}
      {showAdminModal && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowAdminModal(false);
              setError("");
              setPassword("");
            }}
          />
          <div className="fixed inset-0 z-[1001] flex items-center justify-center">
            <div
              className="rounded-2xl shadow-2xl border border-white/10 overflow-hidden w-[300px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(134,137,143,0.82), rgba(35,29,49,0.82))",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* modal titlebar */}
              <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
                <span className="text-white/70 text-xs font-mono">
                  admin login
                </span>
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    setError("");
                    setPassword("");
                  }}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400"
                />
              </div>

              <div
                className="p-5 flex flex-col items-center gap-5"
                style={{ direction: "ltr" }}
              >
                <div className="w-full flex flex-col gap-1">
                  <label className="text-white/70 text-xs font-mono mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    // onKeyDown={(e) => e.key === "Enter" && handleAdminSubmit()}
                    className="w-full rounded-lg px-3 py-2 text-sm font-mono outline-none border border-white/20 focus:border-amber-500/60 transition-colors"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(134,137,143,0.4), rgba(35,29,49,0.4))",
                      color: "white",
                      fontWeight: 1000,
                      fontSize: 13,
                    }}
                    autoFocus
                    placeholder="Enter password..."
                  />
                  {error && (
                    <span className="text-red-400 text-xs mt-1">{error}</span>
                  )}
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-mono transition-colors"
                    onClick={() => {
                      setShowAdminModal(false);
                      setError("");
                      setPassword("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-mono font-bold transition-colors"
                    // onClick={handleAdminSubmit}
                    onClick={() => {
                      setShowAdminModal(false);
                      setPassword("");
                      onAdminLogin();
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .animate-fadeUp {
          animation: fadeUp 0.9s ease-out both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-spinSlow {
          animation: spinSlow 8s linear infinite;
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-glowText {
          animation: glowText 3s ease-in-out infinite;
        }
        @keyframes glowText {
          0%,
          100% {
            text-shadow: 0 0 0px rgba(99, 102, 241, 0);
          }
          50% {
            text-shadow: 0 4px 22px rgba(99, 102, 241, 0.45);
          }
        }
        .aurora {
          position: absolute;
          width: 45vmax;
          height: 45vmax;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.25;
          mix-blend-mode: screen;
        }
        .aurora1 {
          background: radial-gradient(closest-side, #60a5fa, transparent 70%);
          top: -10%;
          left: -10%;
          animation: float1 14s ease-in-out infinite;
        }
        .aurora2 {
          background: radial-gradient(closest-side, #a78bfa, transparent 70%);
          top: 10%;
          right: -15%;
          animation: float2 16s ease-in-out infinite;
        }
        .aurora3 {
          background: radial-gradient(closest-side, #22d3ee, transparent 70%);
          bottom: -20%;
          left: 20%;
          animation: float3 18s ease-in-out infinite;
        }
        @keyframes float1 {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(6%, 8%, 0) scale(1.05);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-5%, 6%, 0) scale(1.08);
          }
        }
        @keyframes float3 {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(4%, -6%, 0) scale(1.03);
          }
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 9999px;
          opacity: 0.5;
          animation: twinkle 3.2s ease-in-out infinite;
          box-shadow:
            0 0 6px rgba(255, 255, 255, 0.6),
            0 0 14px rgba(99, 102, 241, 0.35);
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.7);
          }
        }
        .shine {
          pointer-events: none;
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          mix-blend-mode: screen;
          transition: transform 0.7s ease;
        }
        button:hover .shine {
          transform: translateX(120%);
        }
      `}</style>
    </>
  );
}
