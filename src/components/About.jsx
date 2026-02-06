import React from 'react';
import { motion } from 'framer-motion';
import { Binary, Cpu, Brain, Code, Globe2, Building2, Target, Compass, Sparkles, ExternalLink, GraduationCap, School } from 'lucide-react';

const About = () => {
    const timelineData = [
        {
            icon: <Binary size={24} />,
            title: "Pure Logic",
            text: "The foundation of computation and discrete structures—where complexity begins with simplicity.",
            year: "Phase 01"
        },
        {
            icon: <Code size={24} />,
            title: "The Architecture",
            text: "Building robust systems, compilers, and the languages that speak directly to the machine.",
            year: "Phase 02"
        },
        {
            icon: <Globe2 size={24} />,
            title: "Connectivity",
            text: "Exploring decentralized networks, cloud infrastructure, and the global flow of intelligence.",
            year: "Phase 03"
        },
        {
            icon: <Brain size={24} />,
            title: "Innovation (AI)",
            text: "Where machines learn, reason, and create. The high-performance peak of modern engineering.",
            year: "Phase 04"
        },
    ];

    return (
        <section id="about" className="about" style={{ padding: '120px 0', background: 'transparent', overflow: 'hidden', position: 'relative' }}>
            <div className="container">
                {/* 1. Our Campus - The Host System */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '10rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-subtitle">The Mainframe</span>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Our Campus</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <div style={{ padding: '5px 12px', background: 'rgba(56, 234, 140, 0.1)', border: '1px solid var(--primary)', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '1px' }}>EST. 2018</div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Coimbatore, Tamil Nadu</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
                            <strong style={{ color: '#fff' }}>VSB College of Engineering Technical Campus</strong> is more than a collection of buildings—it’s a place where students from all backgrounds come together to learn, grow, and make lifelong friends.
                            Our campus is always alive with activity, from technical fests to cultural nights, and our faculty are mentors who genuinely care about each student’s journey.
                        </p>
                        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(56, 234, 140, 0.03)', border: '1px solid rgba(56, 234, 140, 0.1)' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                With accreditation from top bodies and a sprawling green campus, VSB offers a vibrant ecosystem for holistic development and innovation.
                            </p>
                        </div>
                        <a href="https://www.vsbcetc.com/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: '2.5rem', gap: '10px', fontSize: '0.8rem' }}>
                            Visit Official Website <ExternalLink size={14} />
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000"
                                alt="Campus"
                                style={{ width: '100%', height: '500px', objectFit: 'cover', filter: 'grayscale(0.3) brightness(0.7)' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 9, 15, 0.9), transparent)' }} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '30px', left: '30px', borderLeft: '4px solid var(--primary)', paddingLeft: '20px' }}>
                            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '2px' }}>LOCATION_NODE</span>
                            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>VSB_TECHNICAL_CAMPUS.ROOT</h4>
                        </div>
                    </motion.div>
                </div>

                {/* 2. Vision & Mission Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '10rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card"
                        style={{ padding: '3.5rem', borderTop: '4px solid var(--accent-blue)' }}
                    >
                        <div style={{ color: 'var(--accent-blue)', marginBottom: '2rem' }}>
                            <Target size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Core Vision</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            We endeavor to impart futuristic technical education of the highest quality to the student community and to inculcate discipline in them to face the world with self-confidence and thus we prepare them for life as responsible citizens to uphold human values and to be of services at large.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="glass-card"
                        style={{ padding: '3.5rem', borderTop: '4px solid var(--primary)' }}
                    >
                        <div style={{ color: 'var(--primary)', marginBottom: '2rem' }}>
                            <Compass size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>The Mission</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            We transform persons into personalities by the state of the art infrastructure, time consciousness, quick response and the best academic practices through assessment and advice. Our goal is academic excellence of international standard.
                        </p>
                    </motion.div>
                </div>

                {/* 3. The Path of Logic (Timeline) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '6rem' }}
                >
                    <span className="section-subtitle">Symposium Concept</span>
                    <h2 className="section-title">From Logic to Innovation</h2>
                </motion.div>

                <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, var(--primary), var(--accent-blue), transparent)', transform: 'translateX(-50%)', opacity: 0.3 }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {timelineData.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.2 }}
                                style={{ display: 'flex', justifyContent: idx % 2 === 0 ? 'flex-end' : 'flex-start', alignItems: 'center', width: '100%', position: 'relative' }}
                            >
                                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)', zIndex: 5 }} />

                                <div className="glass-card" style={{ width: '45%', padding: '2rem', textAlign: idx % 2 === 0 ? 'right' : 'left', position: 'relative', borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(56, 234, 140, 0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                                        {item.year}
                                    </span>
                                    <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card"
                    style={{ marginTop: '10rem', textAlign: 'center', padding: '5rem', background: 'linear-gradient(to bottom right, rgba(15, 17, 26, 0.8), rgba(8, 9, 15, 0.9))', border: '1px solid rgba(56, 234, 140, 0.2)' }}
                >
                    <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Department of CSE</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3.5rem', lineHeight: '1.8' }}>
                        The Department of Computer Science and Engineering is dedicated to pushing the boundaries of technology. INFIQ 2K26 is our flagship terminal to showcase talent, foster innovation, and build the next generation of engineers.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem' }}>
                            <School size={20} className="text-[#38EA8C]" /> Academic Excellence
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem' }}>
                            <GraduationCap size={20} className="text-[#38EA8C]" /> Mentorship Driven
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem' }}>
                            <Sparkles size={20} className="text-[#38EA8C]" /> Innovation Hub
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Ambient background details */}
            <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(56, 234, 140, 0.03) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />
        </section>
    );
};

export default About;
