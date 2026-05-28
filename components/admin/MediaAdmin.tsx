"use client";

import { useState, useEffect } from "react";
import WindowFloat from "../ui/WindowFloat";

interface MediaItem {
  id: string;
  title: string;
  image: string;
  thumbnail?: string;
  category: string;
  description?: string;
}

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onBack: () => void;
}

const categoryGradient: Record<string, string> = {
  MicroService: "from-green-400 via-green-700 to-green-800",
  Web:          "from-yellow-300 via-yellow-600 to-yellow-500",
  Mobile:       "from-orange-400 via-orange-500 to-orange-600",
};

// ── Form modal ───────────────────────────────────────────────────────────────

function MediaModal({ initial, onSave, onClose }: {
  initial?: MediaItem | null;
  onSave: (p: Partial<MediaItem>) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    id:          initial?.id          ?? "",
    title:       initial?.title       ?? "",
    image:       initial?.image       ?? "",
    category:    initial?.category    ?? "",
    description: initial?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.id || !form.title) { setErr("ID and Title are required"); return; }
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (e: any) { setErr(e?.message ?? "Error"); }
    finally { setSaving(false); }
  }

  const fields: { key: keyof typeof form; label: string; placeholder: string; disabled?: boolean }[] = [
    { key: "id",          label: "ID",          placeholder: "bikee-rental", disabled: isEdit },
    { key: "title",       label: "Title",        placeholder: "Bikee Rental App" },
    { key: "image",       label: "Image URL",    placeholder: "./bicy.png" },
    { key: "category",    label: "Category",     placeholder: "Mobile / Web / MicroService" },
    { key: "description", label: "Description",  placeholder: "Short description..." },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          style={{ background: "linear-gradient(135deg,#1e1e2c,#232838)" }}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
            <span className="text-white/70 text-xs font-mono">
              {isEdit ? "Edit Media" : "Add New Media"}
            </span>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
          </div>

          <div className="flex flex-col gap-4 p-5 max-h-[80vh] overflow-y-auto" style={{ direction: "ltr" }}>
            {fields.map(({ key, label, placeholder, disabled }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-gray-300 font-bold text-sm">{label}</label>
                <input
                  type="text"
                  value={form[key]}
                  placeholder={placeholder}
                  disabled={disabled}
                  onChange={(e) => set(key)(e.target.value)}
                  className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors disabled:opacity-60 text-gray-300"
                  style={{ background: "rgba(255,255,255,0.05)", fontWeight: 700, fontSize: 13 }}
                />
              </div>
            ))}

            {/* Image preview */}
            {form.image && (
              <div className="rounded-lg overflow-hidden bg-black aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}

            {err && <span className="text-red-400 text-xs">{err}</span>}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-mono transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono font-bold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Media"}
              </button>
            </div>
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
            <p className="text-gray-300 text-center text-sm">Are you sure you want to delete this media?</p>
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

// ── Preview modal ─────────────────────────────────────────────────────────────

function PreviewModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0f0f0f,#1a1a1a)" }}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
            <span className="text-white/70 text-xs font-mono">Media Preview</span>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
          </div>
          <div className="flex flex-col gap-4 p-5" style={{ direction: "ltr" }}>
            <div className="w-full bg-black rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-full h-auto max-h-96 object-contain" />
            </div>
            <div className="flex flex-col gap-2">
              <div className={`self-start px-3 py-1 rounded-full bg-gradient-to-r ${categoryGradient[item.category] ?? "from-gray-400 to-gray-500"} text-xs text-white font-semibold`}>
                {item.category}
              </div>
              <span className="text-white font-bold text-lg">{item.title}</span>
              {item.description && (
                <span className="text-gray-400 text-sm">{item.description}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminMediaManagement({ onClose, onMinimize, onBack }: Props) {
  const [media, setMedia]   = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState<"add" | "edit" | "delete" | "preview" | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [toast, setToast]   = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  async function load() {
    try {
      const res = await fetch("/api/system/showMedia?p=media");
      const data = await res.json();
      if (data.data) setMedia(data.data);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(form: Partial<MediaItem>) {
    const isEdit = !!selected;
    const res = await fetch(`/api/system/${isEdit ? "updateMedia" : "addMedia"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.msg ?? "Failed");
    showToast(isEdit ? "Media updated!" : "Media added!");
    load();
  }

  async function handleDelete() {
    if (!selected) return;
    const res = await fetch("/api/system/removeMedia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id }),
    });
    const data = await res.json();
    if (data.success) { showToast("Media deleted!"); load(); }
    setModal(null);
  }

  return (
    <>
      <WindowFloat
        onclose={onClose} onminimize={onMinimize} showMinimize padding={0}
        maxWidth="140vh" title="Media Management"
        contentStyle={{ background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)", height: "70vh" }}
      >
        <div className="flex flex-col h-full" style={{ direction: "ltr" }}>
          {/* Header */}
          <div className="flex flex-row items-center flex-wrap sm:flex-nowrap gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-[#1e1e1e] border-b border-gray-700">
            <div className="flex flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button onClick={onBack} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <span className="icon-[mdi--arrow-left] w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <span className="icon-[mdi--image-multiple] w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold text-sm sm:text-lg truncate">Media Management</span>
                <span className="text-white/70 text-xs truncate">Control Panel / Media</span>
              </div>
            </div>
            <button
              onClick={() => { setSelected(null); setModal("add"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-mono transition-colors w-full sm:w-auto justify-center"
            >
              <span className="icon-[mdi--plus-circle] w-5 h-5" />
              Add Media
            </button>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#1a1a1a]">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin" />
              </div>
            )}

            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-900 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image} alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* category badge */}
                      <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full bg-gradient-to-r ${categoryGradient[item.category] ?? "from-gray-400 to-gray-500"} text-xs text-white font-semibold shadow-xl`}>
                        {item.category}
                      </div>
                      {/* view overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => { setSelected(item); setModal("preview"); }}
                          className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
                        >
                          <span className="icon-[mdi--eye] w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Info + actions */}
                    <div className="p-3 sm:p-4 flex flex-col gap-3">
                      <span className="text-white font-semibold text-sm sm:text-base line-clamp-1">{item.title}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelected(item); setModal("edit"); }}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs font-mono transition-colors border border-yellow-600/30"
                        >
                          <span className="icon-[mdi--pencil] w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => { setSelected(item); setModal("delete"); }}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-mono transition-colors border border-red-600/30"
                        >
                          <span className="icon-[mdi--delete] w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </WindowFloat>

      {/* Modals */}
      {(modal === "add" || modal === "edit") && (
        <MediaModal initial={modal === "edit" ? selected : null} onSave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal === "delete" && <ConfirmModal onConfirm={handleDelete} onClose={() => setModal(null)} />}
      {modal === "preview" && selected && <PreviewModal item={selected} onClose={() => setModal(null)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1200] bg-green-600 text-white px-5 py-2 rounded-full text-sm font-mono shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
