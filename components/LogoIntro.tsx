'use client';
import { useEffect, useRef, useState } from 'react';

type Phase = 'playing' | 'exiting' | 'done';

export default function LogoIntro() {
    const [phase, setPhase] = useState<Phase>('playing');
    const [exitStyle, setExitStyle] = useState<React.CSSProperties>({});
    const wrapRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only play once per session
        if (sessionStorage.getItem('intro-shown')) {
            setPhase('done');
            return;
        }

        // Start exit: shrink + fly to navbar logo position
        const exitTimer = setTimeout(() => {
            const navLogo = document.getElementById('navbar-logo');
            const wrap = wrapRef.current;

            if (navLogo && wrap) {
                const navRect = navLogo.getBoundingClientRect();
                const wrapRect = wrap.getBoundingClientRect();

                // Calculate offset from intro-logo center → navbar logo center
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
        }, 1650); // starts flyout after letters finish appearing

        // Remove overlay completely
        const doneTimer = setTimeout(() => {
            setPhase('done');
            sessionStorage.setItem('intro-shown', '1');
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
            {/* Logo letters — fly to navbar on exit */}
            <div ref={wrapRef} className="intro-logo-wrap" style={phase === 'exiting' ? exitStyle : {}}>
                <span className="intro-letter intro-K">K</span>
                <span className="intro-letter intro-R">R</span>
                <span className="intro-letter intro-i">i</span>
                <span className="intro-letter intro-A1">A</span>
                <span className="intro-letter intro-A2">A</span>
            </div>

            {/* Tagline + accent lines — only during playing phase */}
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
