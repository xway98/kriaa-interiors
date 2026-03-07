'use client';
import { useState, useEffect } from 'react';

export default function SiteVisitPopup() {
    const [show, setShow] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Wait slightly to not cause hydration issues, and delay popup so it isn't annoying
        setMounted(true);
        const timer = setTimeout(() => {
            if (!dismissed) setShow(true);
        }, 15000); // 15 seconds delay
        return () => clearTimeout(timer);
    }, [dismissed]);

    if (!mounted) return null;

    return (
        <div
            className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 transition-all duration-700 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
                }`}
        >
            <div className="bg-[#0f1618]/95 backdrop-blur-md border border-[#1b5e72]/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-lg p-5 md:p-6 w-[calc(100vw-2rem)] max-w-[340px] relative">
                <button
                    onClick={() => { setShow(false); setDismissed(true); }}
                    className="absolute top-4 right-4 text-[#7a9099] hover:text-white transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="pr-6">
                    <span className="text-[#3a8fa8] text-[0.65rem] tracking-[0.2em] uppercase mb-1.5 block font-semibold">Complimentary</span>
                    <h3 className="font-serif text-xl md:text-2xl mb-2 text-[#f0f4f5]">Free Site Visit</h3>
                    <p className="text-[#7a9099] text-xs md:text-sm mb-5 leading-relaxed">
                        Discuss your design vision with our experts in your own space, at no cost.
                    </p>
                </div>

                <div className="flex gap-2.5">
                    <a href="#contact"
                        onClick={() => { setShow(false); setDismissed(true); }}
                        className="flex-1 bg-[#1b5e72] hover:bg-[#276c83] text-white text-xs uppercase tracking-wider py-3 rounded transition-colors text-center font-medium cursor-pointer">
                        Book Now
                    </a>
                    <a href="tel:+919448658254"
                        onClick={() => { setShow(false); setDismissed(true); }}
                        className="flex-1 bg-transparent border border-[#1b5e72]/50 hover:border-[#3a8fa8] text-white text-xs uppercase tracking-wider py-3 rounded transition-colors text-center font-medium flex items-center justify-center gap-1.5 cursor-pointer">
                        <span className="text-sm">📞</span> Call Us
                    </a>
                </div>
            </div>
        </div>
    );
}
