'use client';
import { useState } from 'react';

const SERVICES = [
    { icon: '✦', title: 'Concept Design', desc: 'Blueprints crafted from your vision' },
    { icon: '◈', title: 'Space Planning', desc: 'Optimal flow & architectural harmony' },
    { icon: '❋', title: 'Furniture & Finishes', desc: 'Bespoke pieces, curated materials' },
];

export default function WardrobeSection() {
    const [open, setOpen] = useState(false);

    return (
        <section className="py-32 px-[5%] bg-[#0d1a1f]" id="signature">
            <div className="max-w-[1400px] mx-auto text-center">
                <div className="reveal-up flex items-center justify-center gap-4 mb-4">
                    <span className="h-px w-10 bg-[#3a8fa8]" />
                    <span className="text-[#3a8fa8] text-xs tracking-[0.22em] uppercase">Our Signature</span>
                    <span className="h-px w-10 bg-[#3a8fa8]" />
                </div>
                <h2 className="reveal-up delay-1 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-snug mb-4">
                    Every Detail<br /><em>Considered.</em>
                </h2>
                <p className="reveal-up delay-2 text-[#7a9099] mb-16 max-w-lg mx-auto">
                    Hover the wardrobe to reveal what's inside every space we design.
                </p>

                {/* Wardrobe */}
                <div
                    className={`wardrobe inline-block cursor-pointer ${open ? 'wardrobe-open' : ''}`}
                    style={{ width: 'min(700px, 85vw)' }}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    onClick={() => setOpen((o) => !o)}
                >
                    {/* Top cornice */}
                    <div className="w-full h-5 rounded-t-sm" style={{ background: 'linear-gradient(to bottom, #2a6a80, #1e5060)' }} />

                    {/* Cabinet body */}
                    <div className="relative w-full overflow-hidden border-x-[3px] border-[#1e5060]" style={{ height: 380, perspective: 1200, background: 'linear-gradient(160deg, #0d2129, #091519)' }}>

                        {/* Interior */}
                        <div className="cabinet-interior absolute inset-0 flex items-center justify-around px-8 opacity-0 transition-opacity duration-500 delay-300"
                            style={{ background: 'linear-gradient(160deg, #0f2a35, #0a1e26)' }}>
                            {SERVICES.map((s, i) => (
                                <>
                                    {i > 0 && <div key={`div-${i}`} className="w-px self-stretch mx-4 opacity-30 flex-shrink-0" style={{ background: 'linear-gradient(to bottom, transparent, #3a8fa8, transparent)' }} />}
                                    <div key={s.title} className="interior-item flex-1 text-center px-4 opacity-0 translate-y-3 transition-all duration-500" style={{ transitionDelay: `${0.45 + i * 0.1}s` }}>
                                        <div className="text-[#3a8fa8] text-3xl mb-3">{s.icon}</div>
                                        <h4 className="font-serif text-lg mb-2">{s.title}</h4>
                                        <p className="text-[#7a9099] text-sm leading-relaxed">{s.desc}</p>
                                    </div>
                                </>
                            ))}
                        </div>

                        {/* Left door */}
                        <div className="cabinet-door door-left absolute top-0 left-0 w-1/2 h-full z-10 transition-transform duration-[900ms] cubic-bezier"
                            style={{ transformOrigin: 'left center' }}>
                            <div className="w-full h-full flex items-center justify-end pr-3 border border-[#3a8fa8]/10"
                                style={{ background: 'linear-gradient(170deg, #1f6070, #154a5a, #0f3844)' }}>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-full" style={{ background: 'linear-gradient(to bottom, #3a8fa8, #1b5e72)' }} />
                                <div className="w-[70%] h-[65%] border border-[#3a8fa8]/15 rounded-sm absolute" />
                            </div>
                        </div>

                        {/* Right door */}
                        <div className="cabinet-door door-right absolute top-0 right-0 w-1/2 h-full z-10 transition-transform duration-[900ms]"
                            style={{ transformOrigin: 'right center' }}>
                            <div className="w-full h-full flex items-center justify-start pl-3 border border-[#3a8fa8]/10"
                                style={{ background: 'linear-gradient(170deg, #1f6070, #154a5a, #0f3844)' }}>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-full" style={{ background: 'linear-gradient(to bottom, #3a8fa8, #1b5e72)' }} />
                                <div className="w-[70%] h-[65%] border border-[#3a8fa8]/15 rounded-sm absolute" />
                            </div>
                        </div>
                    </div>

                    {/* Legs */}
                    <div className="flex justify-between px-[5%]">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="w-3.5 h-7 rounded-b-sm" style={{ background: 'linear-gradient(to bottom, #1e5060, #0f2e38)' }} />
                        ))}
                    </div>

                    <p className="wardrobe-hint mt-4 text-[#7a9099] text-xs tracking-widest uppercase transition-opacity">
                        {open ? '' : 'Hover to open'}
                    </p>
                </div>
            </div>
        </section>
    );
}
