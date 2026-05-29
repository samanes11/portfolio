"use client";

import { useState, useEffect } from "react";
import WindowFloat from "../ui/WindowFloat";
import { toast } from "../ui/Toast";

interface Message {
  ID: string;
  Name: string;
  Email: string;
  msg: string;
  Date: string;
}

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onBack: () => void;
}

// ── View modal ────────────────────────────────────────────────────────────────

function ViewModal({ message, onClose }: { message: Message; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          style={{ background: "linear-gradient(135deg,#1E1E2C,#232838)" }}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
            <span className="text-white/70 text-xs font-mono">Message Details</span>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
          </div>
          <div className="flex flex-col gap-4 p-5" style={{ direction: "ltr" }}>
            <div className="flex flex-row items-start gap-2">
              <span className="icon-[mdi--account] w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col flex-1">
                <span className="text-gray-100 font-extrabold text-xs mb-1">Name</span>
                <span className="text-gray-400 font-medium text-sm">{message.Name}</span>
              </div>
            </div>
            <div className="flex flex-row items-start gap-2">
              <span className="icon-[mdi--email] w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col flex-1">
                <span className="text-gray-100 font-extrabold text-xs mb-1">Email</span>
                <span className="text-gray-400 text-sm">{message.Email}</span>
              </div>
            </div>
            <div className="flex flex-row items-start gap-2">
              <span className="icon-[mdi--calendar] w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col flex-1">
                <span className="text-gray-100 font-extrabold text-xs mb-1">Date</span>
                <span className="text-gray-400 text-sm">{message.Date}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex flex-row items-center gap-2">
                <span className="icon-[mdi--message-text] w-5 h-5 text-orange-500" />
                <span className="text-gray-100 font-extrabold text-xs">Message</span>
              </div>
              <div className="bg-gray-400 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{message.msg}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-mono transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Confirm delete ────────────────────────────────────────────────────────────

function ConfirmModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4">
        <div className="w-[250px] rounded-2xl shadow-2xl border border-white/10 overflow-hidden" style={{ background: "#1e1e2c" }}>
          <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
            <span className="text-white/70 text-xs font-mono">Confirm Delete</span>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
          </div>
          <div className="flex flex-col items-center gap-4 p-5" style={{ direction: "ltr" }}>
            <span className="icon-[mdi--alert-circle] w-14 h-14 text-red-500" />
            <p className="text-gray-300 text-center text-sm">Are you sure you want to delete this message?</p>
            <p className="text-gray-500 text-center text-xs">This action cannot be undone.</p>
            <button
              onClick={onConfirm}
              className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminMessagesManagement({ onClose, onMinimize, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<"view" | "delete" | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);

  async function load() {
    try {
      const res  = await fetch("/api/system/showMsg?p=mdms");
      const data = await res.json();
      if (data.data) setMessages(data.data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!selected) return;
    try {
      const res  = await fetch("/api/system/removeMsg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.ID }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message deleted successfully!");
        load();
      } else {
        toast.error(data.msg || "Failed to delete message");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setModal(null);
  }

  return (
    <>
      <WindowFloat
        onclose={onClose} onminimize={onMinimize} showMinimize padding={0}
        maxWidth="90vh" title="Messages Management"
        contentStyle={{ background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)", height: "70vh" }}
      >
        <div className="flex flex-col h-full" style={{ direction: "ltr" }}>
          {/* Header */}
          <div className="flex flex-row items-center flex-wrap sm:flex-nowrap gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-[#1e1e1e] border-b border-gray-700">
            <div className="flex flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button onClick={onBack} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <span className="icon-[mdi--arrow-left] w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <span className="icon-[mdi--message-text] w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold text-sm sm:text-lg truncate">Messages Management</span>
                <span className="text-white/70 text-xs truncate">Control Panel / Messages</span>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#1a1a1a] flex flex-col gap-3 sm:gap-4">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gray-600 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
                <span className="icon-[mdi--message-off] w-12 h-12" />
                <span className="text-sm">No messages yet</span>
              </div>
            )}

            {!loading && messages.map((message, index) => (
              <div
                key={message.ID ?? index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                  <div className="flex flex-row items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <span className="icon-[mdi--account] w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 gap-1">
                      <div className="flex flex-row items-center flex-wrap gap-2">
                        <span className="text-white font-semibold truncate text-sm sm:text-base">{message.Name}</span>
                        <span className="text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded text-xs">{message.Date}</span>
                      </div>
                      <div className="flex flex-row items-center gap-2 text-gray-400 text-xs sm:text-sm">
                        <span className="icon-[mdi--email] w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{message.Email}</span>
                      </div>
                      <span className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">{message.msg}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => { setSelected(message); setModal("view"); }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-mono transition-colors border border-blue-600/30"
                    >
                      <span className="icon-[mdi--eye] w-4 h-4" /> View
                    </button>
                    <button
                      onClick={() => { setSelected(message); setModal("delete"); }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-mono transition-colors border border-red-600/30"
                    >
                      <span className="icon-[mdi--delete] w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowFloat>

      {modal === "view"   && selected && <ViewModal    message={selected} onClose={() => setModal(null)} />}
      {modal === "delete" &&             <ConfirmModal onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </>
  );
}