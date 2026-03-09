'use client';
import { useEffect, useRef, useState } from 'react';

type Phase = 'playing' | 'exiting' | 'done';

export default function LogoIntro() {
    const [phase, setPhase] = useState<Phase>('playing');
    const [exitStyle, setExitStyle] = useState<React.CSSProperties>({});
    const wrapRef = useRef<HTMLDivElement>(null);

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
        }, 1650);

        const doneTimer = setTimeout(() => {
            setPhase('done');
        }, 2500);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(doneTimer);
        };
    }, []);

    if (phase === 'done') return null;

    // Render as SVG — exactly matching KriaaLogo.tsx so the 'i' looks identical
    const FONT = "'Colonna MT Std', 'Colonna MT', serif";
    const FS = 'clamp(3.5rem, 12vw, 8rem)';  // responsive font size via CSS var

    return (
        <div
            className={`intro-overlay${phase === 'exiting' ? ' intro-overlay--exit' : ''}`}
            aria-hidden="true"
        >
            {/* SVG logo — same structure as KriaaLogo.tsx */}
            <div ref={wrapRef} className="intro-logo-svg-wrap" style={phase === 'exiting' ? exitStyle : {}}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 310 80"
                    className="intro-logo-svg"
                >
                    {/* K — slides from left */}
                    <text x="0" y="60" fontFamily={FONT} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-K">K</text>

                    {/* R — slides from left */}
                    <text x="60" y="60" fontFamily={FONT} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-R">R</text>

                    {/* i — crimson, NO italic — matches KriaaLogo exactly */}
                    <text x="111" y="60" fontFamily={FONT} fontSize="72" fontWeight="400" fill="#9b1c3a"
                        className="intro-svg-i">i</text>

                    {/* A — slides from right */}
                    <text x="130" y="60" fontFamily={FONT} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-A1">A</text>

                    {/* A — slides from right */}
                    <text x="187" y="60" fontFamily={FONT} fontSize="72" fontWeight="400" fill="#f5f0eb"
                        className="intro-svg-A2">A</text>
                </svg>
            </div>

            {/* Tagline + accent lines — only during playing */}
            {phase === 'playing' && (
                <>
                    <div className="intro-tagline">INTERIORS</div>
                    <div className="intro-line intro-line-left" />
                    <div className="intro-line intro-line-right" />
                </>
            )}
        </div>
    );
}
