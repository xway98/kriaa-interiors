'use client';
import { useEffect, useState } from 'react';

export default function LogoIntro() {
    const [phase, setPhase] = useState<'playing' | 'fading' | 'done'>('playing');

    useEffect(() => {
        // Only show once per session
        if (sessionStorage.getItem('intro-shown')) {
            setPhase('done');
            return;
        }

        // After animation completes, fade out the overlay
        const fadeTimer = setTimeout(() => setPhase('fading'), 2800);
        // After fade, remove from DOM
        const doneTimer = setTimeout(() => {
            setPhase('done');
            sessionStorage.setItem('intro-shown', '1');
        }, 3700);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, []);

    if (phase === 'done') return null;

    return (
        <div
            className="intro-overlay"
            style={{ opacity: phase === 'fading' ? 0 : 1 }}
            aria-hidden="true"
        >
            <div className="intro-logo-wrap">
                {/* K — slides in from left */}
                <span className="intro-letter intro-K">K</span>
                {/* R — slides in from left with delay */}
                <span className="intro-letter intro-R">R</span>
                {/* i — drops from top, crimson */}
                <span className="intro-letter intro-i">i</span>
                {/* AA — slides in from right */}
                <span className="intro-letter intro-A1">A</span>
                <span className="intro-letter intro-A2">A</span>
            </div>
            {/* INTERIORS tagline fades up last */}
            <div className="intro-tagline">INTERIORS</div>

            {/* Decorative accent lines */}
            <div className="intro-line intro-line-left" />
            <div className="intro-line intro-line-right" />
        </div>
    );
}
