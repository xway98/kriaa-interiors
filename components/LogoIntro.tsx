'use client';
import { useEffect, useRef, useState } from 'react';

type Phase = 'playing' | 'exiting' | 'done';

export default function LogoIntro() {

  const [phase, setPhase] = useState<Phase>('playing');
  const [exitStyle, setExitStyle] = useState<React.CSSProperties>({});
  const wrapRef = useRef<HTMLDivElement>(null);

  /* ---------- EASY EDIT SETTINGS ---------- */

  const CONFIG = {


    logoFont: "'Colonna MT Std', 'Colonna MT', serif",

    logoY: 60,

    tagline: {
      text: "INTERIORS",
      y: 100,
      fontSize: 14,
      letterSpacing: "0.8em",
      opacity: 0.6,
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: "#f5f0eb"
    },

    exitDelay: 1650,
    doneDelay: 2500


  };

  /* ---------- EXIT ANIMATION ---------- */

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
          transition:
            "transform 0.75s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease 0.35s",
          transformOrigin: "center center"
        });

      }

      setPhase("exiting");

    }, CONFIG.exitDelay);

    const doneTimer = setTimeout(() => {
      setPhase("done");
    }, CONFIG.doneDelay);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };


  }, []);

  if (phase === "done") return null;

  /* ---------- RENDER ---------- */

  return (


    <div
      className={`intro-overlay${phase === "exiting" ? " intro-overlay--exit" : ""}`}
      aria-hidden="true"
    >

      <div
        ref={wrapRef}
        className="intro-logo-svg-wrap"
        style={phase === "exiting" ? exitStyle : {}}
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 310 120"
          className="intro-logo-svg"
        >

          {/* KRiAA */}

          <text x="28" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fill="#f5f0eb" className="intro-svg-K">
            K
          </text>

          <text x="88" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fill="#f5f0eb" className="intro-svg-R">
            R
          </text>

          <text x="139" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fill="#9b1c3a" className="intro-svg-i">
            i
          </text>

          <text x="164" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fill="#f5f0eb" className="intro-svg-A1">
            A
          </text>

          <text x="221" y={CONFIG.logoY} fontFamily={CONFIG.logoFont} fontSize="72" fill="#f5f0eb" className="intro-svg-A2">
            A
          </text>

          {/* decorative lines */}

          {phase === "playing" && (
            <>
              <line x1="25" y1="93" x2="100" y2="93" stroke="#f5f0eb" strokeOpacity="0.25" strokeWidth="1" className="intro-svg-line" />
              <line x1="210" y1="93" x2="285" y2="93" stroke="#f5f0eb" strokeOpacity="0.25" strokeWidth="1" className="intro-svg-line" />

              {/* tagline */}

              <text
                x="155"
                y={CONFIG.tagline.y}
                textAnchor="middle"
                fontFamily={CONFIG.tagline.fontFamily}
                fontSize={CONFIG.tagline.fontSize}
                letterSpacing={CONFIG.tagline.letterSpacing}
                fill={CONFIG.tagline.color}
                opacity={CONFIG.tagline.opacity}
                className="intro-tagline-svg"
              >
                {CONFIG.tagline.text}
              </text>
            </>
          )}

        </svg>

      </div>

    </div>


  );
}
