'use client'; // This must stay at the very top
import { track } from '@vercel/analytics'; // Moved this up
import { useState, useEffect } from 'react';

export default function SiteVisitPopup() {
    const [show, setShow] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const wasDismissed = sessionStorage.getItem('kriaa-popup-dismissed');
        if (wasDismissed) { setDismissed(true); return; }
        const timer = setTimeout(() => {
            if (!dismissed) setShow(true);
        }, 15000);
        return () => clearTimeout(timer);
    }, [dismissed]);

    const dismiss = () => {
        setShow(false);
        setDismissed(true);
        sessionStorage.setItem('kriaa-popup-dismissed', '1');
    };

    // Tracking Functions
    const handleBookClick = () => {
        track('Book Now Clicked'); // Tracks the "Book Now" button
        dismiss();
    };

    const handleCallClick = () => {
        track('Call Button Clicked'); // Tracks the "Call Us" button
        dismiss();
    };

    if (!mounted) return null;

    return (
        <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 transition-all duration-700 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
            <div className="backdrop-blur-md shadow-lg rounded-2xl p-5 md:p-6 w-[calc(100vw-2rem)] max-w-[340px] relative"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent-border)', boxShadow: 'var(--shadow)' }}>
                <button onClick={dismiss}
                    className="absolute top-4 right-4 transition-colors" style={{ color: 'var(--text-muted)' }}
                    aria-label="Close">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <div className="pr-6">
                    <span className="text-[0.65rem] tracking-[0.2em] uppercase mb-1.5 block font-semibold" style={{ color: 'var(--accent)' }}>Complimentary</span>
                    <h3 className="font-serif text-xl md:text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>Free Site Visit</h3>
                    <p className="text-xs md:text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Discuss your design vision with our experts in your own space, at no cost.
                    </p>
                </div>
                <div className="flex gap-2.5">
                    {/* BOOK NOW BUTTON */}
                    <a href="#contact" onClick={handleBookClick}
                        className="flex-1 text-white text-xs uppercase tracking-wider py-3 rounded-lg transition-colors text-center font-medium"
                        style={{ background: 'var(--accent)' }}>
                        Book Now
                    </a>
                    {/* CALL US BUTTON */}
                    <a href="tel:+919448658254" onClick={handleCallClick}
                        className="flex-1 text-xs uppercase tracking-wider py-3 rounded-lg transition-colors text-center font-medium flex items-center justify-center gap-1.5"
                        style={{ border: '1px solid var(--accent-border)', color: 'var(--text-primary)' }}>
                        <span className="text-sm">📞</span> Call Us
                    </a>
                </div>
            </div>
        </div>
    );
}