'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ContactForm from '@/components/ContactForm';
import WardrobeSection from '@/components/WardrobeSection';
import PortfolioSection from '@/components/PortfolioSection';
import SiteVisitPopup from '@/components/SiteVisitPopup';

export default function HomePage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Hero zoom + reveal animations
  useEffect(() => {
    setTimeout(() => heroRef.current?.classList.add('hero-loaded'), 100);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom cursor (desktop only)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = document.querySelector<HTMLElement>('.cursor-dot');
    const outline = document.querySelector<HTMLElement>('.cursor-outline');
    const onMove = (e: MouseEvent) => {
      if (dot) { dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`; }
      if (outline) outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 450, fill: 'forwards' });
    };
    window.addEventListener('mousemove', onMove);
    const links = document.querySelectorAll('a, button, .portfolio-item, .wardrobe');
    links.forEach((el) => {
      el.addEventListener('mouseenter', () => outline?.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => outline?.classList.remove('cursor-hover'));
    });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const NAV_ITEMS = ['Studio', 'Signature', 'Projects', 'Services'];

  return (
    <>
      {/* Custom Cursor */}
      <div className="cursor-dot" />
      <div className="cursor-outline" />

      {/* ─── Navbar ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navScrolled ? 'bg-[#080c0e]/95 backdrop-blur-md border-b border-[#1b5e72]/20 py-2 md:py-3' : 'py-3 md:py-4'} px-[5%]`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="KRiAA Interiors" width={64} height={64} className="h-10 md:h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex gap-10 list-none">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="text-[#7a9099] hover:text-white text-sm uppercase tracking-widest transition-colors cursor-none">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden md:inline-block border border-white/15 hover:border-[#3a8fa8] hover:text-[#3a8fa8] text-white text-sm uppercase tracking-wider px-6 py-3 transition-all cursor-none">
              Let&apos;s Talk
            </a>

            {/* Hamburger button — mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[60]"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
              <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Drawer ─── */}
      <div className={`fixed inset-0 z-[55] md:hidden transition-all duration-500 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-400 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-[#080c0e] border-l border-[#1b5e72]/15 transition-transform duration-500 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col pt-24 px-8`}>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                  className="block py-3 text-[#7a9099] hover:text-white text-lg tracking-wide transition-colors border-b border-[#1b5e72]/10">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" onClick={() => setMenuOpen(false)}
            className="mt-8 w-full bg-[#1b5e72] text-white text-sm uppercase tracking-wider py-4 text-center rounded-lg transition-all block">
            Let&apos;s Talk
          </a>
          <div className="mt-auto pb-10 space-y-3">
            <a href="tel:+919448658254" className="flex items-center gap-2 text-[#7a9099] text-sm">📞 +91 94486 58254</a>
            <a href="https://www.instagram.com/kriaa_interiors" target="_blank" rel="noopener" className="flex items-center gap-2 text-[#7a9099] text-sm">📷 @kriaa_interiors</a>
          </div>
        </div>
      </div>

      <main>
        {/* ─── Hero ─── */}
        <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden" id="home">
          <div className="absolute inset-0 -z-10">
            <Image src="/hero_img.png" alt="Luxury Interior" fill className="hero-bg object-cover scale-110 transition-transform duration-[2500ms] ease-out" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080c0e]/90 via-[#080c0e]/60 to-[#080c0e]/35 md:from-[#080c0e]/90 md:to-[#080c0e]/35" />
          </div>
          <div className="px-[5%] max-w-[1400px] mx-auto w-full z-10">
            <div className="reveal-up flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-[#3a8fa8]" />
              <span className="text-[#3a8fa8] text-xs tracking-[0.22em] uppercase font-medium">KRiAA Interiors</span>
            </div>
            <h1 className="reveal-up delay-1 font-serif text-[clamp(2.4rem,8vw,6rem)] leading-[1.1] tracking-tight mb-4">
              Spaces Crafted<br /><em>with</em> Purpose.
            </h1>
            <p className="reveal-up delay-2 text-[#7a9099] text-base md:text-lg max-w-lg mb-8">
              We transform your vision into extraordinary living spaces.
            </p>
            <div className="reveal-up delay-3 flex items-center gap-4 md:gap-8 flex-wrap">
              <a href="#projects" className="bg-[#1b5e72] hover:bg-[#276c83] border border-[#1b5e72] text-white text-sm uppercase tracking-wider px-6 md:px-8 py-3.5 md:py-4 transition-all cursor-none rounded-lg md:rounded-none">
                View Our Work
              </a>
              <a href="#signature" className="text-[#7a9099] hover:text-white text-sm transition-colors cursor-none hidden md:inline-block">
                Our Signature ↓
              </a>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 opacity-50 hidden md:flex">
            <span className="text-[0.65rem] tracking-[0.2em] uppercase rotate-90 mb-5">Scroll</span>
            <div className="w-5 h-7 border border-white rounded-[10px] relative">
              <div className="wheel-anim absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </section>

        {/* ─── About / Studio ─── */}
        <section className="py-16 md:py-32 px-[5%]" id="studio">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="reveal-up flex items-center gap-4 mb-4">
                <span className="h-px w-10 bg-[#3a8fa8]" />
                <span className="text-[#3a8fa8] text-xs tracking-[0.22em] uppercase">The Studio</span>
              </div>
              <h2 className="reveal-up delay-1 font-serif text-[clamp(1.8rem,4vw,3.5rem)] leading-snug mb-6">
                Where vision meets perfect execution.
              </h2>
              <p className="reveal-up delay-2 text-[#7a9099] text-base md:text-lg leading-relaxed max-w-xl">
                At KRiAA Interiors, we believe every space tells a story. Our approach blends timeless craftsmanship with modern sensibilities — each project is a bespoke journey from concept to completion.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-5 reveal-up delay-1">
              {[['12+', 'Years of Mastery'], ['85', 'Bespoke Projects'], ['4', 'Design Awards'], ['100%', 'Client Focus']].map(([num, label]) => (
                <div key={label} className="bg-[#0f1618] border border-[#1b5e72]/12 hover:border-[#3a8fa8]/30 p-5 md:p-7 rounded-lg transition-colors">
                  <span className="block font-serif text-3xl md:text-5xl text-[#3a8fa8] mb-2">{num}</span>
                  <span className="text-[#7a9099] text-xs md:text-sm uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WardrobeSection />
        <PortfolioSection />

        {/* ─── Services ─── */}
        <section className="py-16 md:py-32 px-[5%] bg-[#040608]" id="services">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <span className="text-[#3a8fa8] text-xs tracking-[0.22em] uppercase">Expertise</span>
              <h2 className="font-serif text-[clamp(1.8rem,4vw,3.5rem)] leading-snug mt-3">
                Tailored<br /><em>Solutions</em>
              </h2>
            </div>
            <div>
              {[
                ['Concept Design', 'Transforming abstract ideas into comprehensive visual blueprints aligned with your spatial realities.'],
                ['Interior Architecture', 'Restructuring your space for optimal flow, natural light, and structural harmony.'],
                ['Furniture & Curation', 'Sourcing bespoke pieces, rare artworks, and luxury materials for a distinct character.'],
                ['Project Management', 'End-to-end coordination with craftsmen, suppliers and contractors for flawless delivery.'],
              ].map(([name, desc]) => (
                <div key={name} className="py-5 md:py-7 border-b border-white/7 first:border-t hover:pl-3 transition-all group">
                  <h3 className="font-serif text-xl md:text-2xl mb-2 md:mb-3 group-hover:text-[#3a8fa8] transition-colors">{name}</h3>
                  <p className="text-[#7a9099] text-sm md:text-base">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section className="py-16 md:py-32 px-[5%]" id="contact">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="reveal-up flex items-center gap-4 mb-4">
                <span className="h-px w-10 bg-[#3a8fa8]" />
                <span className="text-[#3a8fa8] text-xs tracking-[0.22em] uppercase">Get In Touch</span>
              </div>
              <h2 className="reveal-up delay-1 font-serif text-[clamp(1.8rem,4vw,3.5rem)] leading-snug mb-6">
                Ready to elevate your space?
              </h2>
              <p className="reveal-up delay-2 text-[#7a9099] text-base md:text-lg mb-8 md:mb-10">Let&apos;s bring your vision to life.</p>
              <div className="reveal-up delay-2 space-y-3 md:space-y-4">
                <a href="mailto:hello@kriaainteriors.com" className="block text-[#3a8fa8] hover:text-white transition-colors text-base md:text-lg">hello@kriaainteriors.com</a>
                <a href="tel:+919448658254" className="block text-[#7a9099] hover:text-white transition-colors">+91 94486 58254</a>
                <a href="https://www.instagram.com/kriaa_interiors" target="_blank" rel="noopener" className="block text-[#7a9099] hover:text-white transition-colors">@kriaa_interiors</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1b5e72]/20 py-6 md:py-8 px-[5%]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-[#7a9099] text-sm gap-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="KRiAA Interiors" width={40} height={40} className="h-8 md:h-10 w-auto" />
            <span className="text-xs md:text-sm">© 2026 KRiAA Interiors. All Rights Reserved.</span>
          </div>
          <div className="flex gap-6 md:gap-8">
            <a href="https://www.instagram.com/kriaa_interiors?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

      <SiteVisitPopup />
    </>
  );
}
