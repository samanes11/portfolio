"use client";

import { useState } from "react";
import WindowFloat from "../ui/WindowFloat";
import { toast } from "../ui/Toast";

interface ContactWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

export default function ContactWindow({ onClose, onMinimize }: ContactWindowProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!name || !email || !message) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/system/msg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, Email: email, msg: message }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent successfully!");
        setName(""); setEmail(""); setMessage("");
      } else {
        toast.error(data.msg || "Failed to send message");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      showMinimize
      padding={20}
      maxWidth="40vh"
      title="Contact"
      contentStyle={{
        background:
          "#2d2d2d",
      }}
    >
      <div className="flex flex-col gap-4" style={{ direction: "ltr" }}>
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-400 font-bold" style={{ fontSize: 13 }}>
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 transition-colors"
            style={{ fontWeight: 1000, fontSize: 13 }}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-400 font-bold" style={{ fontSize: 13 }}>
            Email or Phone
          </label>
          <input
            type="email"
            placeholder="09123456789"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 transition-colors"
            style={{ fontWeight: 1000, fontSize: 13 }}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-slate-400" style={{ fontWeight: 1000, fontSize: 13 }}>
            Message
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 transition-colors resize-none"
            rows={5}
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          className="btn btn-ghost w-full rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </WindowFloat>
  );
}