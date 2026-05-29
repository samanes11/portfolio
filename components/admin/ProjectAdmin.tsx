"use client";

import { useState, useEffect } from "react";
import WindowFloat from "../ui/WindowFloat";
import { toast } from "../ui/Toast";

interface Project {
  id: string;
  name: string;
  date: string;
  platform: string;
  tech: string;
  desc: string;
}

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onBack: () => void;
}

// ── Form Field ────────────────────────────────────────────────────────────────

function FormField({ label, value, onChange, placeholder, disabled, type = "text" }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-gray-700 font-bold text-sm">{label}</label>
      <input
        type={type} disabled={disabled} value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-500 transition-colors disabled:opacity-60"
        style={{ color: "#374151", fontWeight: 700, fontSize: 13 }}
      />
    </div>
  );
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────

function ProjectModal({ initial, onSave, onClose }: {
  initial?: Project | null;
  onSave: (p: Partial<Project>) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    id:       initial?.id       ?? "",
    name:     initial?.name     ?? "",
    date:     initial?.date     ?? "",
    platform: initial?.platform ?? "",
    tech:     initial?.tech     ?? "",
    desc:     initial?.desc     ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.id || !form.name) {
      toast.error("ID and Name are required");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden" style={{ background: "linear-gradient(135deg,#1e1e2c,#232838)" }}>
          <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
            <span className="text-white/70 text-xs font-mono">{isEdit ? "Edit Project" : "Add New Project"}</span>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
          </div>
          <div className="flex flex-col gap-4 p-5" style={{ direction: "ltr" }}>
            <FormField label="ID" value={form.id} onChange={isEdit ? undefined : set("id")} disabled={isEdit} placeholder="menu" />
            <FormField label="Name" value={form.name} onChange={set("name")} placeholder="Coffee Shop Menu" />
            <FormField label="Date" value={form.date} onChange={set("date")} placeholder="2025" />
            <FormField label="Platform" value={form.platform} onChange={set("platform")} placeholder="Mobile" />
            <FormField label="Tech" value={form.tech} onChange={set("tech")} placeholder="Flutter, Dart" />
            <div className="flex flex-col gap-1">
              <label className="text-gray-300 font-bold text-sm">Description</label>
              <textarea
                rows={4} value={form.desc} placeholder="Project description..."
                onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm outline-none focus:border-amber-500 resize-none text-gray-300"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-mono transition-colors">Cancel</button>
              <button onClick={submit} disabled={saving} className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-mono font-bold transition-colors disabled:opacity-50">
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Confirm delete modal ──────────────────────────────────────────────────────

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
            <p className="text-gray-300 text-center text-sm">Are you sure you want to delete this project?</p>
            <p className="text-gray-500 text-center text-xs">This action cannot be undone.</p>
            <button onClick={onConfirm} className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminProjectManagement({ onClose, onMinimize, onBack }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/system/showProject?p=cs");
      const data = await res.json();
      if (data.data) setProjects(data.data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(form: Partial<Project>) {
    const isEdit = !!selected;
    const res = await fetch(`/api/system/${isEdit ? "updateProject" : "addProject"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.msg || "Failed");
    toast.success(isEdit ? "Project updated successfully!" : "Project added successfully!");
    load();
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      const res = await fetch("/api/system/removeProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted successfully!");
        load();
      } else {
        toast.error(data.msg || "Failed to delete project");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setModal(null);
  }

  return (
    <>
      <WindowFloat onclose={onClose} onminimize={onMinimize} showMinimize padding={0} maxWidth="140vh" title="Project Management"
        contentStyle={{ background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)", height: "70vh" }}
      >
        <div className="flex flex-col h-full" style={{ direction: "ltr" }}>
          {/* Header */}
          <div className="flex flex-row items-center flex-wrap sm:flex-nowrap gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-[#1e1e1e] border-b border-gray-700">
            <div className="flex flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button onClick={onBack} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <span className="icon-[mdi--arrow-left] w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <span className="icon-[mdi--folder-edit] w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold text-sm sm:text-lg truncate">Project Management</span>
                <span className="text-white/70 text-xs truncate">Control Panel / Projects</span>
              </div>
            </div>
            <button onClick={() => { setSelected(null); setModal("add"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-mono transition-colors w-full sm:w-auto justify-center"
            >
              <span className="icon-[mdi--plus-circle] w-5 h-5" />
              Add Project
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#1a1a1a] flex flex-col gap-3">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
            {!loading && projects.map((project) => (
              <div key={project.id} className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                  <div className="flex flex-row items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <span className="icon-[material-symbols--folder] w-[35px] h-[35px] text-amber-400 flex-shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0 gap-1">
                      <span className="text-white font-semibold truncate text-sm sm:text-base">{project.name}</span>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {[`📅 ${project.date}`, `💻 ${project.platform}`, `🛠️ ${project.tech}`].map((tag) => (
                          <span key={tag} className="text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                      {project.desc && <span className="text-gray-400 text-xs sm:text-sm line-clamp-2">{project.desc}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                    <button onClick={() => { setSelected(project); setModal("edit"); }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs font-mono transition-colors border border-yellow-600/30"
                    >
                      <span className="icon-[mdi--pencil] w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => { setSelected(project); setModal("delete"); }}
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

      {(modal === "add" || modal === "edit") && (
        <ProjectModal initial={modal === "edit" ? selected : null} onSave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal === "delete" && <ConfirmModal onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </>
  );
}