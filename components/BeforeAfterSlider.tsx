'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Props {
    beforeSrc: string;
    afterSrc: string;
    beforeAlt?: string;
    afterAlt?: string;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt = 'Before', afterAlt = 'After' }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const updatePosition = useCallback((clientX: number) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
        setPosition(pct);
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updatePosition(e.clientX);
    }, [updatePosition]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        updatePosition(e.touches[0].clientX);
    }, [updatePosition]);

    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (e: MouseEvent) => updatePosition(e.clientX);
        const handleTouchMove = (e: TouchEvent) => { e.preventDefault(); updatePosition(e.touches[0].clientX); };
        const handleUp = () => setIsDragging(false);

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, updatePosition]);

    return (
        <div
            ref={containerRef}
            className="ba-slider aspect-[16/9] md:aspect-[2/1] w-full relative"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* Before image (full width, behind) */}
            <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" sizes="100vw" />

            {/* After image (clipped from right) */}
            <div
                className="ba-after-container"
                style={{ clipPath: `inset(0 0 0 ${position}%)` }}
            >
                <Image src={afterSrc} alt={afterAlt} fill className="object-cover" sizes="100vw" />
            </div>

            {/* Drag handle */}
            <div className="ba-handle" style={{ left: `${position}%` }} />

            {/* Labels */}
            <span className="ba-label ba-label-before">Before</span>
            <span className="ba-label ba-label-after">After</span>
        </div>
    );
}
