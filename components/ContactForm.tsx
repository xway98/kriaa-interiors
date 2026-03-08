'use client';
import { useState } from 'react';

export default function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('success');
                setForm({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const inputStyle = {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 reveal-up delay-2" noValidate>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full outline-none px-4 py-3 rounded-lg transition-all focus:ring-2"
                        style={{ ...inputStyle, '--tw-ring-color': 'var(--accent)' } as React.CSSProperties} />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Phone *</label>
                    <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full outline-none px-4 py-3 rounded-lg transition-all focus:ring-2"
                        style={{ ...inputStyle, '--tw-ring-color': 'var(--accent)' } as React.CSSProperties} />
                </div>
            </div>
            <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full outline-none px-4 py-3 rounded-lg transition-all focus:ring-2"
                    style={{ ...inputStyle, '--tw-ring-color': 'var(--accent)' } as React.CSSProperties} />
            </div>
            <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Message</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project, space size, budget..."
                    className="w-full outline-none px-4 py-3 rounded-lg transition-all resize-none focus:ring-2"
                    style={{ ...inputStyle, '--tw-ring-color': 'var(--accent)' } as React.CSSProperties} />
            </div>

            {status === 'success' && (
                <p className="text-sm py-3 px-4 rounded-lg" style={{ color: 'var(--accent)', background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}>
                    ✓ Thank you! We&apos;ll be in touch within 24 hours.
                </p>
            )}
            {status === 'error' && (
                <p className="text-red-400 text-sm py-3 px-4 bg-red-900/20 rounded-lg">
                    Something went wrong. Please try again or call us directly.
                </p>
            )}

            <button type="submit" disabled={status === 'loading'}
                className="w-full text-white uppercase tracking-widest text-sm py-4 rounded-lg transition-all disabled:opacity-50"
                style={{ background: 'var(--accent)' }}>
                {status === 'loading' ? 'Sending...' : 'Send Enquiry'}
            </button>
        </form>
    );
}
