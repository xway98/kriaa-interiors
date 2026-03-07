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

    return (
        <form onSubmit={handleSubmit} className="space-y-5 reveal-up delay-2" noValidate>
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-[#7a9099] mb-2">Name *</label>
                    <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full bg-[#0f1618] border border-[#1b5e72]/25 focus:border-[#3a8fa8] outline-none px-4 py-3 text-white placeholder-[#4a6068] rounded transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest text-[#7a9099] mb-2">Phone *</label>
                    <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-[#0f1618] border border-[#1b5e72]/25 focus:border-[#3a8fa8] outline-none px-4 py-3 text-white placeholder-[#4a6068] rounded transition-colors"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs uppercase tracking-widest text-[#7a9099] mb-2">Email *</label>
                <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-[#0f1618] border border-[#1b5e72]/25 focus:border-[#3a8fa8] outline-none px-4 py-3 text-white placeholder-[#4a6068] rounded transition-colors"
                />
            </div>
            <div>
                <label className="block text-xs uppercase tracking-widest text-[#7a9099] mb-2">Message</label>
                <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project, space size, budget..."
                    className="w-full bg-[#0f1618] border border-[#1b5e72]/25 focus:border-[#3a8fa8] outline-none px-4 py-3 text-white placeholder-[#4a6068] rounded transition-colors resize-none"
                />
            </div>

            {status === 'success' && (
                <p className="text-[#3a8fa8] text-sm py-3 px-4 bg-[#3a8fa8]/10 rounded">
                    ✓ Thank you! We'll be in touch within 24 hours.
                </p>
            )}
            {status === 'error' && (
                <p className="text-red-400 text-sm py-3 px-4 bg-red-900/20 rounded">
                    Something went wrong. Please try again or call us directly.
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#1b5e72] hover:bg-[#276c83] disabled:opacity-50 text-white uppercase tracking-widest text-sm py-4 transition-all cursor-none rounded"
            >
                {status === 'loading' ? 'Sending...' : 'Send Enquiry'}
            </button>
        </form>
    );
}
