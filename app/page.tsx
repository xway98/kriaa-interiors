'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ContactForm from '@/components/ContactForm';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import PortfolioSection from '@/components/PortfolioSection';
import SiteVisitPopup from '@/components/SiteVisitPopup';
import ThemeToggle from '@/components/ThemeToggle';
import KriaaLogo from '@/components/KriaaLogo';
import LogoIntro from '@/components/LogoIntro';

export default function HomePage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    setTimeout(() => heroRef.current?.classList.add('hero-loaded'), 100);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const NAV_ITEMS = ['Studio', 'Transformation', 'Projects', 'Services'];

  return (
    <>
      {/* ─── Logo Intro animation — shows once per session ─── */}
      <LogoIntro />

      {/* ─── Navbar ─── */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: navScrolled ? 'var(--bg-surface)' : 'transparent',
          borderBottom: navScrolled ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter: navScrolled ? 'blur(14px)' : 'none',
        }}
      >
        <div
          className="container flex justify-between items-center"
          style={{ paddingTop: navScrolled ? '0.65rem' : '1rem', paddingBottom: navScrolled ? '0.65rem' : '1rem' }}
        >
          {/* Logo — text SVG, theme-adaptive */}
          <Link href="/" className="shrink-0" style={{ color: navScrolled ? 'var(--text-primary)' : 'white' }}>
            <KriaaLogo size="md" />
          </Link>

          <ul className="hidden md:flex gap-8 lg:gap-12 list-none">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-[0.7rem] uppercase tracking-[0.2em] transition-colors"
                  style={{ color: navScrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = navScrolled ? 'var(--text-primary)' : 'white'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = navScrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.7)'}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden md:inline-block text-[0.7rem] uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all font-medium"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              Let&apos;s Talk
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] relative z-[60]"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-[1.5px] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`}
                style={{ background: navScrolled ? 'var(--text-primary)' : 'white' }} />
              <span className={`block w-5 h-[1.5px] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
                style={{ background: navScrolled ? 'var(--text-primary)' : 'white' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Drawer ─── */}
      <div className={`fixed inset-0 z-[55] md:hidden transition-all duration-500 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 transition-transform duration-500 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col pt-24 px-8`}
          style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)' }}
        >
          <ul className="space-y-0">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-base tracking-wide transition-colors"
                  style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-8 w-full text-white text-xs uppercase tracking-widest py-4 text-center rounded-lg block font-medium"
            style={{ background: 'var(--accent)' }}
          >
            Let&apos;s Talk
          </a>
          <div className="mt-auto pb-10 space-y-4">
            <a href="tel:+919448658254" className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>📞 +91 94486 58254</a>
            <a href="https://www.instagram.com/kriaa_interiors" target="_blank" rel="noopener" className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>📷 @kriaa_interiors</a>
          </div>
        </div>
      </div>

      <main>
        {/* ─── Hero ─── */}
        <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden" id="home">
          <div className="absolute inset-0 -z-10">
            <Image src="/hero_img.png" alt="Luxury Interior" fill className="hero-bg object-cover scale-110 transition-transform duration-[2500ms] ease-out" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/60 to-black/20" />
          </div>
          <div className="container w-full z-10">
            <div className="reveal-up flex items-center gap-3 mb-6">
              <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
              <span className="text-[0.65rem] tracking-[0.28em] uppercase font-medium" style={{ color: 'var(--accent)' }}>KRiAA Interiors</span>
            </div>
            <h1 className="reveal-up delay-1 font-serif text-[clamp(3rem,7.5vw,6rem)] leading-[1.06] tracking-tight mb-6 text-white max-w-3xl">
              Spaces Crafted<br /><em className="not-italic" style={{ color: 'var(--accent)' }}>with</em> Purpose.
            </h1>
            <p className="reveal-up delay-2 text-sm md:text-base max-w-md mb-10 leading-[1.9]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              We transform your vision into extraordinary living spaces — blending timeless craftsmanship with modern design sensibility.
            </p>
            <div className="reveal-up delay-3 flex items-center gap-5 flex-wrap">
              <a href="#projects" className="text-white text-[0.7rem] uppercase tracking-widest px-8 py-4 transition-all rounded-lg font-medium"
                style={{ background: 'var(--accent)' }}>
                View Our Work
              </a>
              <a href="#transformation" className="text-sm transition-colors flex items-center gap-2 hidden md:flex"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                See Transformation <span>↓</span>
              </a>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-35 hidden md:flex">
            <div className="w-5 h-7 border border-white/50 rounded-[10px] relative">
              <div className="wheel-anim absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </section>

        {/* ─── Studio ─── */}
        <section className="section-py" id="studio">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <div className="reveal-up flex items-center gap-3 mb-6">
                  <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                  <span className="text-[0.65rem] tracking-[0.28em] uppercase" style={{ color: 'var(--accent)' }}>The Studio</span>
                </div>
                <h2 className="reveal-up delay-1 font-serif text-[clamp(2.2rem,4vw,3.5rem)] mb-8">
                  Where vision meets<br />perfect execution.
                </h2>
                <p className="reveal-up delay-2 text-sm md:text-base leading-[1.9] max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                  At KRiAA Interiors, we believe every space tells a story. Our approach blends
                  timeless craftsmanship with modern sensibilities — each project is a bespoke
                  journey from concept to completion.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 reveal-up delay-1">
                {[['12+', 'Years of Mastery'], ['85', 'Bespoke Projects'], ['4', 'Design Awards'], ['100%', 'Client Focus']].map(([num, label]) => (
                  <div key={label} className="p-7 rounded-2xl"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <span className="block font-serif text-4xl mb-2" style={{ color: 'var(--accent)' }}>{num}</span>
                    <span className="text-[0.7rem] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Transformation ─── */}
        <section className="section-py" id="transformation" style={{ background: 'var(--bg-card)' }}>
          <div className="container">
            <div className="text-center mb-12 md:mb-16">
              <div className="reveal-up flex items-center justify-center gap-3 mb-5">
                <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                <span className="text-[0.65rem] tracking-[0.28em] uppercase" style={{ color: 'var(--accent)' }}>Our Impact</span>
                <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
              </div>
              <h2 className="reveal-up delay-1 font-serif text-[clamp(2.2rem,4vw,3.5rem)] mb-5">
                The <em className="not-italic" style={{ color: 'var(--accent)' }}>Transformation</em>
              </h2>
              <p className="reveal-up delay-2 text-sm md:text-base max-w-sm mx-auto leading-[1.9]" style={{ color: 'var(--text-secondary)' }}>
                Drag the slider to witness how we transform raw spaces into stunning interiors.
              </p>
            </div>
            <BeforeAfterSlider
              beforeSrc="/before_interior.png"
              afterSrc="/after_interior.png"
              beforeAlt="Raw construction site"
              afterAlt="Finished luxury interior"
            />
          </div>
        </section>

        {/* ─── Portfolio ─── */}
        <PortfolioSection />

        {/* ─── Services ─── */}
        <section className="section-py" id="services">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
              <div className="md:sticky md:top-32">
                <div className="reveal-up flex items-center gap-3 mb-6">
                  <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                  <span className="text-[0.65rem] tracking-[0.28em] uppercase" style={{ color: 'var(--accent)' }}>Expertise</span>
                </div>
                <h2 className="reveal-up delay-1 font-serif text-[clamp(2.2rem,4vw,3.5rem)]">
                  Tailored<br />
                  <em className="not-italic" style={{ color: 'var(--accent)' }}>Solutions</em>
                </h2>
              </div>
              <div>
                {[
                  ['Concept Design', 'Transforming abstract ideas into comprehensive visual blueprints that align with your spatial realities and lifestyle aspirations.'],
                  ['Interior Architecture', 'Restructuring your space for optimal flow, natural light ingress, and structural harmony.'],
                  ['Furniture & Curation', 'Sourcing bespoke pieces, rare artworks, and luxury materials to give each space a distinct, irreplaceable character.'],
                  ['Project Management', 'End-to-end coordination with craftsmen, suppliers and contractors — ensuring flawless delivery on time.'],
                ].map(([name, desc]) => (
                  <div key={name} className="py-8 reveal-up" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 className="font-serif text-xl md:text-2xl mb-3">{name}</h3>
                    <p className="text-sm md:text-base leading-[1.9]" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section className="section-py" id="contact" style={{ background: 'var(--bg-card)' }}>
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
              <div>
                <div className="reveal-up flex items-center gap-3 mb-6">
                  <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                  <span className="text-[0.65rem] tracking-[0.28em] uppercase" style={{ color: 'var(--accent)' }}>Get In Touch</span>
                </div>
                <h2 className="reveal-up delay-1 font-serif text-[clamp(2.2rem,4vw,3.5rem)] mb-5">
                  Ready to elevate<br />your space?
                </h2>
                <p className="reveal-up delay-2 text-sm md:text-base mb-8 leading-[1.9]" style={{ color: 'var(--text-secondary)' }}>
                  Let&apos;s bring your vision to life. Book a complimentary site visit and speak
                  with our designers in your own space.
                </p>
                <div className="reveal-up delay-2 space-y-4">
                  <a href="mailto:hello@kriaainteriors.com" className="flex items-center gap-3 text-sm md:text-base transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
                    <span>✉</span> hello@kriaainteriors.com
                  </a>
                  <a href="tel:+919448658254" className="flex items-center gap-3 text-sm md:text-base transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    <span>📞</span> +91 94486 58254
                  </a>
                  <a href="https://www.instagram.com/kriaa_interiors" target="_blank" rel="noopener" className="flex items-center gap-3 text-sm md:text-base transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    <span>📷</span> @kriaa_interiors
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Circular logo in footer as requested */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="KRiAA Interiors"
                width={48}
                height={48}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>KRiAA Interiors</p>
                <p className="text-[0.65rem]" style={{ color: 'var(--text-muted)' }}>© 2026 All Rights Reserved.</p>
              </div>
            </div>
            <div className="flex gap-7 text-xs" style={{ color: 'var(--text-muted)' }}>
              <a href="https://www.instagram.com/kriaa_interiors?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener" className="hover:opacity-70 transition-opacity tracking-wider uppercase">Instagram</a>
              <a href="#" className="hover:opacity-70 transition-opacity tracking-wider uppercase">Pinterest</a>
              <a href="#" className="hover:opacity-70 transition-opacity tracking-wider uppercase">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      <SiteVisitPopup />
    </>
  );
}
