'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Project { id: string; title: string; location: string; imageUrl: string; }

const FALLBACK: Project[] = [
    { id: '1', title: 'The Obsidian Kitchen', location: 'Penthouse Residence', imageUrl: '/portfolio_kitchen.png' },
    { id: '2', title: 'Serenity Suite', location: 'Lakeside Villa', imageUrl: '/portfolio_bedroom.png' },
];

export default function PortfolioSection() {
    const [projects, setProjects] = useState<Project[]>(FALLBACK);

    useEffect(() => {
        fetch('/api/projects')
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
            .catch(() => { });
    }, []);

    return (
        <section className="py-16 md:py-28 px-[5%]" id="projects">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-12 md:mb-16 reveal-up">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="h-px w-10" style={{ background: 'var(--accent)' }} />
                        <span className="text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--accent)' }}>Selected Works</span>
                        <span className="h-px w-10" style={{ background: 'var(--accent)' }} />
                    </div>
                    <h2 className="font-serif text-[clamp(1.8rem,4vw,3.2rem)]">A Curated Collection</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4 md:gap-6">
                    {projects.slice(0, 2).map((project, i) => (
                        <div key={project.id} className="portfolio-item relative overflow-hidden rounded-xl group reveal-up"
                            style={{ transitionDelay: `${i * 0.15}s` }}>
                            <div className="overflow-hidden rounded-xl">
                                <Image src={project.imageUrl} alt={project.title} width={900} height={600}
                                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ${i === 1 ? 'h-[400px] md:h-[600px]' : 'h-[350px] md:h-[520px]'}`} />
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 rounded-b-xl">
                                <h3 className="font-serif text-lg md:text-xl mb-1 text-white">{project.title}</h3>
                                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}>{project.location}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length > 2 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
                        {projects.slice(2).map((project, i) => (
                            <div key={project.id} className="portfolio-item relative overflow-hidden rounded-xl group"
                                style={{ transitionDelay: `${i * 0.1}s` }}>
                                <Image src={project.imageUrl} alt={project.title} width={600} height={400}
                                    className="w-full h-52 md:h-72 object-cover group-hover:scale-105 transition-transform duration-[1200ms] rounded-xl" />
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all rounded-b-xl">
                                    <h3 className="font-serif text-base mb-0.5 text-white">{project.title}</h3>
                                    <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}>{project.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
