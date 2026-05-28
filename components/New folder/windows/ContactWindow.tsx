"use client";

import { useState } from "react";
import WindowFloat from "../ui/WindowFloat";

interface ContactWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

export default function ContactWindow({ onClose, onMinimize }: ContactWindowProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSend = async () => {
    if (!name || !email || !message) {
      setStatus("error");
      setStatusMsg("All fields are required");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/system/msg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, Email: email, msg: message }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setStatusMsg("Message sent!");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
        setStatusMsg(data.msg || "Failed to send message");
      }
    } catch {
      setStatus("error");
      setStatusMsg("Network error");
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
          "linear-gradient(135deg, rgba(134,137,143,0.82), rgba(35,29,49,0.82))",
      }}
    >
      <div className="flex flex-col gap-4" style={{ direction: "ltr" }}>
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-bold" style={{ fontSize: 13 }}>
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 transition-colors"
            style={{ fontWeight: 1000, fontSize: 13, color: "#374151" }}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-bold" style={{ fontSize: 13 }}>
            Email or Phone
          </label>
          <input
            type="email"
            placeholder="09123456789"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 transition-colors"
            style={{ fontWeight: 1000, fontSize: 13, color: "#374151" }}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label className="font-bold" style={{ fontWeight: 1000, color: "#374151", fontSize: 13 }}>
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

        {/* Status */}
        {status !== "idle" && status !== "loading" && (
          <span
            className={status === "success" ? "text-green-600 text-sm" : "text-red-500 text-sm"}
          >
            {statusMsg}
          </span>
        )}

        <button
          className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors disabled:opacity-50"
          onClick={handleSend}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </div>
    </WindowFloat>
  );
}
