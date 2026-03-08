'use client';
import { useEffect, useRef, useState } from 'react';

type Phase = 'playing' | 'exiting' | 'done';

export default function LogoIntro() {
    const [phase, setPhase] = useState<Phase>('playing');
    const [exitStyle, setExitStyle] = useState<React.CSSProperties>({});
    const wrapRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fly to navbar position then remove overlay
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

    return (
        <div
            ref={overlayRef}
            className={`intro-overlay${phase === 'exiting' ? ' intro-overlay--exit' : ''}`}
            aria-hidden="true"
        >
            <div ref={wrapRef} className="intro-logo-wrap" style={phase === 'exiting' ? exitStyle : {}}>
                <span className="intro-letter intro-K">K</span>
                <span className="intro-letter intro-R">R</span>
                <span className="intro-letter intro-i">i</span>
                <span className="intro-letter intro-A1">A</span>
                <span className="intro-letter intro-A2">A</span>
            </div>

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
