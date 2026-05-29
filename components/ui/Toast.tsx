"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

// ── Singleton store ───────────────────────────────────────────────────────────

type Listener = (toasts: ToastItem[]) => void;
let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

let counter = 0;

export function toast(message: string, type: ToastType = "info", duration = 3500) {
  const id = `toast-${++counter}`;
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, duration);
}

// Convenience helpers
toast.success = (msg: string, duration?: number) => toast(msg, "success", duration);
toast.error   = (msg: string, duration?: number) => toast(msg, "error",   duration);
toast.info    = (msg: string, duration?: number) => toast(msg, "info",    duration);
toast.warning = (msg: string, duration?: number) => toast(msg, "warning", duration);

// ── Icons ─────────────────────────────────────────────────────────────────────

const icons: Record<ToastType, string> = {
  success: "icon-[mdi--check-circle]",
  error:   "icon-[mdi--close-circle]",
  info:    "icon-[mdi--information]",
  warning: "icon-[mdi--alert]",
};

const alertClass: Record<ToastType, string> = {
  success: "alert-success",
  error:   "alert-error",
  info:    "alert-info",
  warning: "alert-warning",
};

// ── Single Toast ──────────────────────────────────────────────────────────────

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleRemove = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(item.id), 280);
  }, [item.id, onRemove]);

  return (
    <div
      onClick={handleRemove}
      className={`alert ${alertClass[item.type]} shadow-2xl cursor-pointer select-none border border-white/10 backdrop-blur-md`}
      style={{
        minWidth: 260,
        maxWidth: 380,
        fontSize: 14,
        fontFamily: "monospace",
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving
          ? "translateX(0) scale(1)"
          : leaving
            ? "translateX(60px) scale(0.92)"
            : "translateX(60px) scale(0.92)",
        transition: leaving
          ? "opacity 280ms ease-in, transform 280ms cubic-bezier(.4,0,.6,1)"
          : "opacity 300ms ease-out, transform 300ms cubic-bezier(.34,1.4,.64,1)",
        background: item.type === "success"
          ? "linear-gradient(135deg, rgba(20,83,45,0.95), rgba(21,128,61,0.95))"
          : item.type === "error"
          ? "linear-gradient(135deg, rgba(127,29,29,0.95), rgba(185,28,28,0.95))"
          : item.type === "warning"
          ? "linear-gradient(135deg, rgba(120,53,15,0.95), rgba(180,83,9,0.95))"
          : "linear-gradient(135deg, rgba(30,58,138,0.95), rgba(29,78,216,0.95))",
      }}
    >
      <span className={`${icons[item.type]} w-5 h-5 flex-shrink-0`} />
      <span className="font-medium">{item.message}</span>
    </div>
  );
}

// ── Toast Container ───────────────────────────────────────────────────────────

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const listener: Listener = (t) => setItems(t);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const remove = useCallback((id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, []);

  if (!mounted || items.length === 0) return null;

  return createPortal(
    <div
      className="toast toast-end toast-bottom"
      style={{ zIndex: 9999, gap: 8, paddingBottom: 72 }}
    >
      {items.map((item) => (
        <ToastCard key={item.id} item={item} onRemove={remove} />
      ))}
    </div>,
    document.body
  );
}