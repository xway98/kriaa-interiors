'use client';
import { useEffect, useRef, useState } from 'react';

type Phase = 'playing' | 'exiting' | 'done';

export default function LogoIntro() {
    const [phase, setPhase] = useState<Phase>('playing');
    const [exitStyle, setExitStyle] = useState<React.CSSProperties>({});
    const wrapRef = useRef<HTMLDivElement>(null);

    // ─── ANIMATION & LAYOUT CONFIG — Edit these for quick adjustments ───
    const CONFIG = {
        // Main Logo (SVG)
        logoSize: 'clamp(3.5rem, 12vw, 8rem)',
        logoFont: "'Colonna MT Std', 'Colonna MT', serif",
        logoY: "60", // vertical position inside the SVG viewBox

        // "INTERIORS" Tagline
        tagline: {
            text: "INTERIORS",
            fontSize: 'clamp(0.55rem, 1.5vw, 0.75rem)',
            letterSpacing: '0.8em', // Adjust this for word spacing
            marginTop: '0.75rem',    // Distance from the main logo
            opacity: 0.5,            // Final transparency level
            fontWeight: 300,
            fontFamily: "'Outfit', sans-serif",
            color: '#f5f0eb'
        },

        // Animation Timings (ms)
        exitDelay: 1650, // when the fly-to-navbar starts
        doneDelay: 2500  // when the intro is completely removed
    };

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            const navLogo = document.getElementById('navbar-logo');
            const wrap = wrapRef.current;

            if (navLogo && wrap) {
                const navRect = navLogo.getBoundingClientRect();
                const wrapRect = wrap.getBoundingClientRect();

                const fromCX = wrapRect.left + wrapRect.width / 2;
                const fromCY = wrapRect.top + wrapRect.height / 2;
                const toCX = navRect.left + navRect.width / 2;
                const toCY = navRect.top + navRect.height / 2;

                const scale = Math.min(navRect.height / wrapRect.height, 0.18);
                const tx = toCX - fromCX;
                const ty = toCY - fromCY;

                setExitStyle({
                    transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                    opacity: 0,
                    transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease 0.35s',
                    transformOrigin: 'center center',
                });
            }

            setPhase('exiting');
        }, CONFIG.exitDelay);

        const doneTimer = setTimeout(() => {
            setPhase('done');
        }, CONFIG.doneDelay);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(doneTimer);
        };
    }, []);

    if (phase === 'done') return null;

    return (
        <div
            className={`intro-overlay${phase === 'exiting' ? ' intro-overlay--exit' : ''}`}
            aria-hidden="true"
        >
            {/* SVG logo — matches KriaaLogo.tsx structure */}
            <div ref={wrapRef} className="intro-logo-svg-wrap" style={phase === 'exiting' ? exitStyle : {}}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 310 80"
                    className="intro-logo-svg"
                >
                    {/* K — slides from left */}
                    <text x="0" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-K">K</text>

                    {/* R — slides from left */}
                    <text x="60" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-R">R</text>

                    {/* i — crimson, NO italic — matches KriaaLogo exactly */}
                    <text x="111" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fontWeight="400" fill="#9b1c3a"
                        className="intro-svg-i">i</text>

                    {/* A — slides from right */}
                    <text x="136" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-A1">A</text>

                    {/* A — slides from right */}
                    <text x="193" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-A2">A</text>
                </svg>
            </div>

            {/* Tagline + accent lines — only during playing */}
            {phase === 'playing' && (
                <>
                    <div
                        className="intro-tagline"
                        style={{
                            fontSize: CONFIG.tagline.fontSize,
                            letterSpacing: CONFIG.tagline.letterSpacing,
                            marginTop: CONFIG.tagline.marginTop,
                            fontWeight: CONFIG.tagline.fontWeight,
                            fontFamily: CONFIG.tagline.fontFamily,
                            color: CONFIG.tagline.color,
                            // Note: animation in CSS handles the initial opacity (0 -> value)
                        }}
                    >
                        {CONFIG.tagline.text}
                    </div>
                    <div className="intro-line intro-line-left" />
                    <div className="intro-line intro-line-right" />
                </>
            )}
        </div>
    );
}
