'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        setLoading(false);
        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#080c0e] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <Image src="/logo.png" alt="KRiAA Interiors" width={80} height={80} className="mx-auto h-20 w-auto mb-6" />
                    <h1 className="font-serif text-2xl mb-1">Admin Panel</h1>
                    <p className="text-[#7a9099] text-sm">KRiAA Interiors — Restricted Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#7a9099] mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            required
                            className="w-full bg-[#0f1618] border border-[#1b5e72]/25 focus:border-[#3a8fa8] outline-none px-4 py-3 text-white placeholder-[#4a6068] rounded transition-colors"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1b5e72] hover:bg-[#276c83] disabled:opacity-50 text-white uppercase tracking-widest text-sm py-4 transition-all rounded"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-[#3a5060] text-xs mt-8">
                    © 2026 KRiAA Interiors
                </p>
            </div>
        </div>
    );
}
