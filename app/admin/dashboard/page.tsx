'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Lead {
    id: string; name: string; email: string; phone: string;
    message: string; contacted: boolean; createdAt: string;
}
interface Project {
    id: string; title: string; location: string; category: string; imageUrl: string; createdAt: string;
}

export default function AdminDashboard() {
    const [tab, setTab] = useState<'leads' | 'projects'>('leads');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [expandedLead, setExpandedLead] = useState<string | null>(null);
    const router = useRouter();

    // Upload state
    const [uploadForm, setUploadForm] = useState({ title: '', location: '', category: 'Residential' });
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const fetchLeads = async () => {
        const r = await fetch('/api/leads');
        if (r.status === 401) { router.push('/admin/login'); return; }
        const data = await r.json();
        setLeads(Array.isArray(data) ? data : []);
        setLoadingLeads(false);
    };

    const fetchProjects = async () => {
        try {
            const r = await fetch('/api/projects');
            const data = await r.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch { setProjects([]); }
        setLoadingProjects(false);
    };

    useEffect(() => { fetchLeads(); fetchProjects(); }, []);

    const toggleContacted = async (id: string, contacted: boolean) => {
        await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contacted: !contacted }) });
        setLeads((prev) => prev.map((l) => l.id === id ? { ...l, contacted: !contacted } : l));
    };

    const deleteLead = async (id: string) => {
        if (!confirm('Delete this lead permanently?')) return;
        await fetch(`/api/leads/${id}`, { method: 'DELETE' });
        setLeads((prev) => prev.filter((l) => l.id !== id));
    };

    const deleteProject = async (id: string) => {
        if (!confirm('Delete this project?')) return;
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        setProjects((prev) => prev.filter((p) => p.id !== id));
    };

    const handleFileSelect = (file: File) => {
        setUploadFile(file);
        setUploadPreview(URL.createObjectURL(file));
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) { setUploadMsg('Please select an image.'); return; }
        setUploading(true); setUploadMsg('');
        const fd = new FormData();
        fd.append('image', uploadFile);
        fd.append('title', uploadForm.title);
        fd.append('location', uploadForm.location);
        fd.append('category', uploadForm.category);
        const r = await fetch('/api/projects', { method: 'POST', body: fd });
        if (r.ok) {
            setUploadMsg('✓ Project uploaded successfully!');
            setUploadForm({ title: '', location: '', category: 'Residential' });
            setUploadFile(null); setUploadPreview(null);
            if (fileRef.current) fileRef.current.value = '';
            fetchProjects();
            setTimeout(() => setUploadMsg(''), 4000);
        } else { setUploadMsg('Upload failed. Please try again.'); }
        setUploading(false);
    };

    const logout = async () => {
        await fetch('/api/admin/login', { method: 'DELETE' });
        router.push('/admin/login');
    };

    const exportCSV = () => {
        const rows = [['Name', 'Email', 'Phone', 'Message', 'Contacted', 'Date'], ...leads.map(l => [l.name, l.email, l.phone, l.message, l.contacted ? 'Yes' : 'No', new Date(l.createdAt).toLocaleDateString()])];
        const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'kriaa_leads.csv'; a.click();
    };

    const pendingLeads = leads.filter(l => !l.contacted).length;
    const contactedLeads = leads.filter(l => l.contacted).length;

    // Input class helper
    const inputClass = "w-full bg-[#0a1217] border border-[#1b5e72]/20 focus:border-[#3a8fa8] focus:ring-1 focus:ring-[#3a8fa8]/20 outline-none px-4 py-3 text-white placeholder-[#3a5060] rounded-lg transition-all text-sm";

    return (
        <div className="min-h-screen bg-[#050a0d] text-[#e8eff1]">

            {/* ─── Sidebar + Main Layout ─── */}
            <div className="flex min-h-screen">

                {/* Sidebar — hidden on mobile */}
                <aside className="hidden lg:flex flex-col w-64 bg-[#080c0e] border-r border-[#1b5e72]/15 p-6 justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <Image src="/logo.png" alt="KRiAA" width={44} height={44} className="h-11 w-auto" />
                            <div>
                                <h1 className="font-serif text-lg leading-tight">KRiAA</h1>
                                <p className="text-[#4a6068] text-[0.65rem] uppercase tracking-widest">Admin Panel</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <button onClick={() => setTab('leads')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${tab === 'leads' ? 'bg-[#1b5e72]/25 text-[#3a8fa8] border border-[#1b5e72]/30' : 'text-[#7a9099] hover:bg-[#0f1618] hover:text-white border border-transparent'}`}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Enquiries
                                {pendingLeads > 0 && <span className="ml-auto bg-[#3a8fa8]/20 text-[#3a8fa8] text-xs px-2 py-0.5 rounded-full">{pendingLeads}</span>}
                            </button>
                            <button onClick={() => setTab('projects')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${tab === 'projects' ? 'bg-[#1b5e72]/25 text-[#3a8fa8] border border-[#1b5e72]/30' : 'text-[#7a9099] hover:bg-[#0f1618] hover:text-white border border-transparent'}`}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Portfolio
                                <span className="ml-auto text-[#4a6068] text-xs">{projects.length}</span>
                            </button>
                        </nav>
                    </div>

                    <div className="space-y-3">
                        <a href="/" target="_blank" className="flex items-center gap-2 text-[#7a9099] hover:text-[#3a8fa8] text-sm transition-colors px-4 py-2">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            View Live Site
                        </a>
                        <button onClick={logout} className="flex items-center gap-2 text-[#7a9099] hover:text-red-400 text-sm transition-colors px-4 py-2 w-full">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden">

                    {/* Mobile Header */}
                    <header className="lg:hidden bg-[#080c0e] border-b border-[#1b5e72]/15 px-4 py-3 flex justify-between items-center sticky top-0 z-30">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="KRiAA" width={36} height={36} className="h-9 w-auto" />
                            <span className="font-serif text-base">KRiAA Admin</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="/" target="_blank" className="text-[#7a9099] hover:text-[#3a8fa8] text-xs">↗ Site</a>
                            <button onClick={logout} className="text-[#7a9099] hover:text-red-400 text-xs transition-colors">Sign Out</button>
                        </div>
                    </header>

                    {/* Mobile Tab Bar */}
                    <div className="lg:hidden flex bg-[#080c0e] border-b border-[#1b5e72]/10 sticky top-[53px] z-20">
                        {(['leads', 'projects'] as const).map((t) => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs uppercase tracking-wider transition-all border-b-2 ${tab === t ? 'border-[#3a8fa8] text-[#3a8fa8] bg-[#3a8fa8]/5' : 'border-transparent text-[#7a9099]'}`}>
                                {t === 'leads' ? '📋' : '🖼'} {t === 'leads' ? `Enquiries (${leads.length})` : `Projects (${projects.length})`}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 md:p-8 lg:p-10">

                        {/* ─── Stats Row ─── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                            {[
                                { label: 'Total Enquiries', value: leads.length, icon: '📋', accent: '#3a8fa8' },
                                { label: 'Pending', value: pendingLeads, icon: '⏳', accent: '#f59e0b' },
                                { label: 'Contacted', value: contactedLeads, icon: '✓', accent: '#10b981' },
                                { label: 'Projects', value: projects.length, icon: '🖼', accent: '#8b5cf6' },
                            ].map((s) => (
                                <div key={s.label} className="bg-[#080c0e] border border-[#1b5e72]/12 rounded-xl p-4 md:p-5 hover:border-[#1b5e72]/30 transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xl md:text-2xl">{s.icon}</span>
                                        <span className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-widest text-[#4a6068]">{s.label}</span>
                                    </div>
                                    <span className="font-serif text-3xl md:text-4xl block" style={{ color: s.accent }}>{s.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* ─── LEADS TAB ─── */}
                        {tab === 'leads' && (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                    <div>
                                        <h2 className="font-serif text-xl md:text-2xl">Client Enquiries</h2>
                                        <p className="text-[#4a6068] text-xs mt-1">Manage incoming leads from the website</p>
                                    </div>
                                    <button onClick={exportCSV} className="bg-[#0f1618] hover:bg-[#1b5e72]/30 border border-[#1b5e72]/25 text-[#3a8fa8] text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all flex items-center gap-2">
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Export CSV
                                    </button>
                                </div>

                                {loadingLeads ? (
                                    <div className="text-center py-20"><div className="inline-block w-8 h-8 border-2 border-[#1b5e72] border-t-[#3a8fa8] rounded-full animate-spin" /></div>
                                ) : leads.length === 0 ? (
                                    <div className="text-center py-20 bg-[#080c0e] rounded-xl border border-[#1b5e72]/10">
                                        <p className="text-5xl mb-4">📬</p>
                                        <p className="text-[#7a9099] mb-1">No enquiries yet</p>
                                        <p className="text-[#4a6068] text-sm">They'll appear here once clients submit the contact form.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop table */}
                                        <div className="hidden md:block overflow-x-auto rounded-xl border border-[#1b5e72]/12 bg-[#080c0e]">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-[#0a1015] text-[#4a6068] uppercase text-[0.65rem] tracking-widest">
                                                        {['Name', 'Contact', 'Message', 'Date', 'Status', ''].map((h) => (
                                                            <th key={h} className="px-5 py-3.5 text-left font-medium">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leads.map((lead, i) => (
                                                        <tr key={lead.id} className={`border-t border-[#1b5e72]/8 hover:bg-[#0f1618]/60 transition-colors ${i % 2 === 0 ? '' : 'bg-[#060a0c]'}`}>
                                                            <td className="px-5 py-4">
                                                                <span className="font-medium">{lead.name}</span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <a href={`mailto:${lead.email}`} className="text-[#3a8fa8] hover:underline text-xs block">{lead.email}</a>
                                                                <a href={`tel:${lead.phone}`} className="text-[#7a9099] hover:text-white text-xs block mt-0.5">{lead.phone}</a>
                                                            </td>
                                                            <td className="px-5 py-4 max-w-[220px]">
                                                                <p className="text-[#7a9099] text-xs leading-relaxed line-clamp-2">{lead.message || '—'}</p>
                                                            </td>
                                                            <td className="px-5 py-4 text-[#7a9099] text-xs whitespace-nowrap">
                                                                {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <button onClick={() => toggleContacted(lead.id, lead.contacted)}
                                                                    className={`text-[0.65rem] px-3 py-1.5 rounded-full transition-all font-medium ${lead.contacted ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/30' : 'bg-amber-950/40 text-amber-400 border border-amber-800/20 hover:bg-amber-950/60'}`}>
                                                                    {lead.contacted ? '✓ Contacted' : '○ Pending'}
                                                                </button>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <button onClick={() => deleteLead(lead.id)} className="text-[#3a5060] hover:text-red-400 transition-colors">
                                                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile card layout */}
                                        <div className="md:hidden space-y-3">
                                            {leads.map((lead) => (
                                                <div key={lead.id}
                                                    className="bg-[#080c0e] border border-[#1b5e72]/12 rounded-xl p-4 transition-all"
                                                    onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-sm">{lead.name}</h3>
                                                            <p className="text-[#7a9099] text-xs mt-0.5">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                                        </div>
                                                        <button onClick={(e) => { e.stopPropagation(); toggleContacted(lead.id, lead.contacted); }}
                                                            className={`text-[0.6rem] px-2.5 py-1 rounded-full ${lead.contacted ? 'bg-emerald-950/60 text-emerald-400' : 'bg-amber-950/40 text-amber-400'}`}>
                                                            {lead.contacted ? '✓' : '○'}
                                                        </button>
                                                    </div>
                                                    {expandedLead === lead.id && (
                                                        <div className="mt-3 pt-3 border-t border-[#1b5e72]/10 space-y-2.5 text-xs">
                                                            <div className="flex gap-3">
                                                                <a href={`tel:${lead.phone}`} className="flex-1 bg-[#1b5e72]/20 text-[#3a8fa8] py-2 rounded-lg text-center">📞 Call</a>
                                                                <a href={`mailto:${lead.email}`} className="flex-1 bg-[#1b5e72]/20 text-[#3a8fa8] py-2 rounded-lg text-center">✉ Email</a>
                                                            </div>
                                                            <p className="text-[#7a9099]"><span className="text-[#4a6068]">Phone:</span> {lead.phone}</p>
                                                            <p className="text-[#7a9099]"><span className="text-[#4a6068]">Email:</span> {lead.email}</p>
                                                            {lead.message && <p className="text-[#7a9099]"><span className="text-[#4a6068]">Message:</span> {lead.message}</p>}
                                                            <button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} className="text-[#3a5060] hover:text-red-400 text-xs mt-1">Delete</button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ─── PROJECTS TAB ─── */}
                        {tab === 'projects' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="font-serif text-xl md:text-2xl">Portfolio Manager</h2>
                                    <p className="text-[#4a6068] text-xs mt-1">Upload and manage your showcase projects</p>
                                </div>

                                <div className="grid lg:grid-cols-[380px_1fr] gap-6 lg:gap-8">
                                    {/* Upload form with drag & drop */}
                                    <div className="bg-[#080c0e] border border-[#1b5e72]/15 rounded-xl p-5 md:p-6 h-fit lg:sticky lg:top-8">
                                        <h3 className="text-sm uppercase tracking-widest text-[#4a6068] mb-5 flex items-center gap-2">
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                            New Project
                                        </h3>
                                        <form onSubmit={handleUpload} className="space-y-4">
                                            {/* Image upload zone */}
                                            <div
                                                className={`relative border-2 border-dashed rounded-xl text-center cursor-pointer transition-all overflow-hidden ${dragActive ? 'border-[#3a8fa8] bg-[#3a8fa8]/5' : 'border-[#1b5e72]/25 hover:border-[#1b5e72]/50'} ${uploadPreview ? 'h-48' : 'py-8'}`}
                                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                                onDragLeave={() => setDragActive(false)}
                                                onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                                                onClick={() => fileRef.current?.click()}>
                                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                                                {uploadPreview ? (
                                                    <>
                                                        <img src={uploadPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs uppercase tracking-wider">Change Image</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="mx-auto mb-3 text-[#1b5e72]" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <p className="text-[#4a6068] text-xs mb-1">Drop image here or <span className="text-[#3a8fa8]">browse</span></p>
                                                        <p className="text-[#2a3840] text-[0.6rem]">JPG, PNG up to 10MB</p>
                                                    </>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-[0.65rem] uppercase tracking-widest text-[#4a6068] mb-2">Project Title *</label>
                                                <input required value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                                    placeholder="e.g. The Obsidian Kitchen" className={inputClass} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[0.65rem] uppercase tracking-widest text-[#4a6068] mb-2">Location</label>
                                                    <input value={uploadForm.location} onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                                                        placeholder="City, State" className={inputClass} />
                                                </div>
                                                <div>
                                                    <label className="block text-[0.65rem] uppercase tracking-widest text-[#4a6068] mb-2">Category</label>
                                                    <select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className={inputClass}>
                                                        {['Residential', 'Commercial', 'Kitchen', 'Bedroom', 'Living Room', 'Office'].map((c) => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {uploadMsg && (
                                                <div className={`text-xs py-2.5 px-3 rounded-lg ${uploadMsg.includes('✓') ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/20' : 'bg-red-950/40 text-red-400 border border-red-800/20'}`}>
                                                    {uploadMsg}
                                                </div>
                                            )}

                                            <button type="submit" disabled={uploading}
                                                className="w-full bg-gradient-to-r from-[#1b5e72] to-[#276c83] hover:from-[#276c83] hover:to-[#2d7a94] disabled:opacity-40 text-white text-xs uppercase tracking-widest py-3.5 transition-all rounded-lg font-medium flex items-center justify-center gap-2">
                                                {uploading ? (
                                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                                ) : (
                                                    <><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Upload Project</>
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Projects grid */}
                                    <div>
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-sm uppercase tracking-widest text-[#4a6068]">Live Portfolio ({projects.length})</h3>
                                        </div>
                                        {loadingProjects ? (
                                            <div className="text-center py-20"><div className="inline-block w-8 h-8 border-2 border-[#1b5e72] border-t-[#3a8fa8] rounded-full animate-spin" /></div>
                                        ) : projects.length === 0 ? (
                                            <div className="text-center py-20 bg-[#080c0e] rounded-xl border border-dashed border-[#1b5e72]/20">
                                                <svg className="mx-auto mb-4 text-[#1b5e72]" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <p className="text-[#7a9099] mb-1">No projects uploaded yet</p>
                                                <p className="text-[#4a6068] text-sm">Upload your first project using the form.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {projects.map((p) => (
                                                    <div key={p.id} className="relative group rounded-xl overflow-hidden bg-[#080c0e] border border-[#1b5e72]/10 hover:border-[#1b5e72]/25 transition-all">
                                                        <div className="overflow-hidden">
                                                            <Image src={p.imageUrl} alt={p.title} width={500} height={320} className="w-full h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <h3 className="font-medium text-sm mb-0.5">{p.title}</h3>
                                                                    <p className="text-[#4a6068] text-xs">{p.location || 'No location'}</p>
                                                                </div>
                                                                <span className="text-[0.6rem] uppercase tracking-wider text-[#3a8fa8] bg-[#3a8fa8]/10 px-2 py-1 rounded whitespace-nowrap">{p.category}</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => deleteProject(p.id)}
                                                            className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm hover:bg-red-900/80 text-white/60 hover:text-red-300 text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
