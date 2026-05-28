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

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onBack: () => void;
}

export default function AdminProjectManagement({ onClose, onMinimize, onBack }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Modals ────────────────────────────────────────────────────────────────
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // add form
  const [form, setForm] = useState({ id: "", name: "", date: "", platform: "", tech: "", desc: "" });
  // edit form
  const [editForm, setEditForm] = useState({ name: "", date: "", platform: "", tech: "", desc: "" });

  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  const showMsg = (msg: string, ok = true) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  };

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/showProject?p=cs");
      const data = await res.json();
      if (data.data) setProjects(data.data);
    } catch { showMsg("Failed to load projects", false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // ── Add ───────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!form.id || !form.name) { showMsg("ID and Name are required!", false); return; }
    const res = await fetch("/api/system/addProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(r => r.json());
    if (res.success) { showMsg("Project added successfully"); setAddModal(false); setForm({ id: "", name: "", date: "", platform: "", tech: "", desc: "" }); load(); }
    else showMsg(res.msg || "Failed to add project", false);
  };

  // ── Edit ──────────────────────────────────────────────────────────────────

  const handleEdit = async () => {
    if (!editModal) return;
    const res = await fetch("/api/system/updateProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editModal.id, ...editForm }),
    }).then(r => r.json());
    if (res.success) { showMsg("Project updated successfully"); setEditModal(null); load(); }
    else showMsg(res.msg || "Failed to update project", false);
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch("/api/system/removeProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    }).then(r => r.json());
    if (res.success) { showMsg("Project deleted successfully"); setDeleteId(null); load(); }
    else showMsg(res.msg || "Failed to delete project", false);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <WindowFloat
        onclose={onClose}
        onminimize={onMinimize}
        showMinimize
        padding={0}
        maxWidth="140vh"
        title="Project Management"
        contentStyle={{ background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", height: "70vh" }}
      >
        <div className="flex flex-col h-full" style={{ direction: "ltr" }}>
          {/* Header */}
          <div className="flex flex-row items-center flex-wrap sm:flex-nowrap gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-[#1e1e1e] border-b border-gray-700">
            <div className="flex flex-row items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <button onClick={onBack} className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
                <span className="icon-[mdi--arrow-left] w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <span className="icon-[mdi--folder-edit] w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold tracking-wide text-sm sm:text-lg truncate" style={{ fontSize: 18 }}>Project Management</span>
                <span className="text-white/80 text-xs sm:text-sm truncate" style={{ fontSize: 12 }}>Control Panel / Projects</span>
              </div>
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors w-full sm:w-auto justify-center"
            >
              <span className="icon-[mdi--plus-circle] w-4 h-4 sm:w-5 sm:h-5" />
              Add Project
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mx-4 mt-3 px-4 py-2 rounded-lg text-sm font-medium ${feedback.ok ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
              {feedback.msg}
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#1a1a1a]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                      <div className="flex flex-row items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <span className="icon-[material-symbols--folder] w-[35px] h-[35px] text-amber-400 flex-shrink-0" />
                        <div className="flex flex-col flex-1 min-w-0 gap-1">
                          <span className="text-white font-semibold truncate text-sm sm:text-base" style={{ fontSize: 17 }}>{project.name}</span>
                          <div className="flex flex-row flex-wrap gap-1 sm:gap-2">
                            {[`📅 ${project.date}`, `💻 ${project.platform}`, `🛠️ ${project.tech}`].map((tag) => (
                              <span key={tag} className="text-gray-400 bg-gray-700/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{tag}</span>
                            ))}
                          </div>
                          <span className="text-gray-400 line-clamp-2 text-xs sm:text-sm" style={{ fontSize: 13 }}>{project.desc}</span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => { setEditModal(project); setEditForm({ name: project.name, date: project.date, platform: project.platform, tech: project.tech, desc: project.desc }); }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs font-medium transition-colors"
                        >
                          <span className="icon-[mdi--pencil] w-3 h-3 sm:w-4 sm:h-4" />Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(project.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition-colors"
                        >
                          <span className="icon-[mdi--delete] w-3 h-3 sm:w-4 sm:h-4" />Delete
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

      {/* ── Add Modal ──────────────────────────────────────────────────────── */}
      {addModal && (
        <Modal title="Add New Project" onClose={() => setAddModal(false)}>
          <FormFields
            data={form}
            onChange={(k, v) => setForm(prev => ({ ...prev, [k]: v }))}
            showId
          />
          <button onClick={handleAdd} className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold mt-2 transition-colors">
            Add Project
          </button>
        </Modal>
      )}

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      {editModal && (
        <Modal title="Edit Project" onClose={() => setEditModal(null)}>
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-gray-400 text-xs font-mono">ID (Cannot be changed)</label>
            <input value={editModal.id} disabled className="w-full rounded-lg px-3 py-2 text-sm bg-white/5 text-gray-500 border border-white/10 opacity-60" />
          </div>
          <FormFields
            data={editForm}
            onChange={(k, v) => setEditForm(prev => ({ ...prev, [k]: v }))}
          />
          <button onClick={handleEdit} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold mt-2 transition-colors">
            Save Changes
          </button>
        </Modal>
      )}

      {/* ── Delete Confirm ─────────────────────────────────────────────────── */}
      {deleteId && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)} maxWidth="300px">
          <div className="flex flex-col items-center gap-3 py-2">
            <span className="icon-[mdi--alert-circle] w-16 h-16 text-red-500" />
            <span className="text-gray-300 text-center text-sm">Are you sure you want to delete this project?</span>
            <span className="text-gray-500 text-center text-xs">This action cannot be undone.</span>
          </div>
          <button onClick={handleDelete} className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold mt-2 transition-colors">
            Delete
          </button>
        </Modal>
      )}
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, maxWidth = "420px" }: { title: string; onClose: () => void; children: React.ReactNode; maxWidth?: string }) {
  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div className="w-full rounded-2xl shadow-2xl border border-white/10 overflow-hidden" style={{ maxWidth, background: "linear-gradient(135deg, #1E1E2C, #232838)" }}>
          <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
            <span className="text-white/80 text-sm font-mono">{title}</span>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
          </div>
          <div className="p-5 flex flex-col gap-3" style={{ direction: "ltr" }}>{children}</div>
        </div>
      </div>
    </>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  const base = "w-full rounded-lg px-3 py-2 text-sm bg-white/5 text-white border border-white/10 focus:border-blue-500/60 outline-none transition-colors";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-400 text-xs font-mono">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} className={`${base} resize-none`} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} className={base} />
      }
    </div>
  );
}

function FormFields({ data, onChange, showId = false }: { data: Record<string, string>; onChange: (k: string, v: string) => void; showId?: boolean }) {
  return (
    <>
      {showId && <Field label="ID" value={data.id ?? ""} onChange={v => onChange("id", v)} />}
      <Field label="Name" value={data.name ?? ""} onChange={v => onChange("name", v)} />
      <Field label="Date" value={data.date ?? ""} onChange={v => onChange("date", v)} />
      <Field label="Platform" value={data.platform ?? ""} onChange={v => onChange("platform", v)} />
      <Field label="Tech" value={data.tech ?? ""} onChange={v => onChange("tech", v)} />
      <Field label="Description" value={data.desc ?? ""} onChange={v => onChange("desc", v)} textarea />
    </>
  );
}
