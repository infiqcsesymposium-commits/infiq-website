import React, { useRef } from 'react';
import PageTransition from '../components/PageTransition';
import { Clock, MapPin, Coffee, Trophy, Stars, Zap, Play, Terminal } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

const TimelinePage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const events = [
        { time: "09:00 AM", title: "System Boot", desc: "Registration & Kit Distribution. Booting up the INFIQ terminal.", icon: <Terminal size={20} /> },
        { time: "10:00 AM", title: "Main Process Start", desc: "Grand Inauguration. Initializing the day with visionaries.", icon: <Play size={20} /> },
        { time: "11:00 AM", title: "Parallel Execution", desc: "Technical & Non-Technical tracks start simultaneously across nodes.", icon: <Zap size={20} /> },
        { time: "01:00 PM", title: "Resource Recharge", desc: "Power lunch and networking at the main server hall (Food Court).", icon: <Coffee size={20} /> },
        { time: "02:00 PM", title: "Overflow Check", desc: "Final rounds and showdowns for the elite innovators.", icon: <Stars size={20} /> },
        { time: "04:30 PM", title: "System Shutdown", desc: "Valedictory ceremony & awards. Finalizing all processes.", icon: <Trophy size={20} /> }
    ];

    return (
        <PageTransition>
            <section ref={containerRef} className="timeline-page" style={{ padding: '120px 0', background: 'transparent', overflow: 'hidden' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '8rem' }}
                    >
                        <span className="section-subtitle">24.02.2026</span>
                        <h2 className="section-title">Execution Timeline</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                            Track the real-time flow of INFIQ 2K26. From initialization to final system shutdown.
                        </p>
                    </motion.div>

                    <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                        {/* The Flow Line */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            background: 'rgba(56, 234, 140, 0.1)',
                            transform: 'translateX(-50%)',
                            zIndex: 1
                        }}>
                            <motion.div
                                style={{
                                    scaleY,
                                    originY: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'var(--primary)',
                                    boxShadow: '0 0 15px var(--primary)'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                            {events.map((event, index) => (
                                <div key={index} style={{ position: 'relative', display: 'flex', justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start', alignItems: 'center' }}>

                                    {/* Connection Node */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: '#0F111A',
                                            border: '2px solid var(--primary)',
                                            boxShadow: '0 0 20px rgba(56, 234, 140, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary)',
                                            zIndex: 5
                                        }}
                                    >
                                        {event.icon}
                                    </motion.div>

                                    {/* Event Card */}
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        style={{
                                            width: '40%',
                                            textAlign: index % 2 === 0 ? 'left' : 'right'
                                        }}
                                    >
                                        <div className="glass-card" style={{ padding: '2rem', background: 'rgba(15, 17, 26, 0.6)' }}>
                                            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '950', letterSpacing: '2px' }}>{event.time}</span>
                                            <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '10px 0' }}>{event.title}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{event.desc}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(56, 234, 140, 0.03) 0%, transparent 70%)', filter: 'blur(100px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)', filter: 'blur(100px)' }} />
            </section>
        </PageTransition>
    );
};

export default TimelinePage;
