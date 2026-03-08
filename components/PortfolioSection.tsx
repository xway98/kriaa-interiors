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
        <section className="section-py" id="projects">
            <div className="container">
                <div className="text-center mb-12 reveal-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                        <span className="text-xs tracking-[0.24em] uppercase" style={{ color: 'var(--accent)' }}>Selected Works</span>
                        <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                    </div>
                    <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)]">A Curated Collection</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {projects.slice(0, 2).map((project, i) => (
                        <div
                            key={project.id}
                            className="relative overflow-hidden rounded-2xl group reveal-up"
                            style={{ transitionDelay: `${i * 0.15}s` }}
                        >
                            <Image
                                src={project.imageUrl}
                                alt={project.title}
                                width={900}
                                height={600}
                                className="w-full h-64 md:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-[1400ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" />
                            <div className="absolute bottom-0 left-0 w-full p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                                <h3 className="font-serif text-lg text-white mb-0.5">{project.title}</h3>
                                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}>{project.location}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length > 2 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {projects.slice(2).map((project, i) => (
                            <div
                                key={project.id}
                                className="relative overflow-hidden rounded-2xl group"
                                style={{ transitionDelay: `${i * 0.1}s` }}
                            >
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-[1400ms]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" />
                                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                                    <h3 className="font-serif text-base text-white mb-0.5">{project.title}</h3>
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
