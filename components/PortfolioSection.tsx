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
            .catch(() => { }); // gracefully use fallback
    }, []);

    return (
        <section className="py-32 px-[5%]" id="projects">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16 reveal-up">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="h-px w-10 bg-[#3a8fa8]" />
                        <span className="text-[#3a8fa8] text-xs tracking-[0.22em] uppercase">Selected Works</span>
                        <span className="h-px w-10 bg-[#3a8fa8]" />
                    </div>
                    <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)]">A Curated Collection</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">
                    {projects.slice(0, 2).map((project, i) => (
                        <div key={project.id} className="portfolio-item relative overflow-hidden rounded group reveal-up" style={{ transitionDelay: `${i * 0.15}s` }}>
                            <div className="overflow-hidden">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    width={900}
                                    height={600}
                                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ${i === 1 ? 'h-[600px]' : 'h-[520px]'}`}
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#080c0e]/90 to-transparent opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <h3 className="font-serif text-xl mb-1">{project.title}</h3>
                                <span className="text-[#3a8fa8] text-xs uppercase tracking-wider">{project.location}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional projects grid */}
                {projects.length > 2 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                        {projects.slice(2).map((project, i) => (
                            <div key={project.id} className="portfolio-item relative overflow-hidden rounded group" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#080c0e]/90 to-transparent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                                    <h3 className="font-serif text-base mb-0.5">{project.title}</h3>
                                    <span className="text-[#3a8fa8] text-xs uppercase tracking-wider">{project.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
