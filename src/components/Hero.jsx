import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatrixBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const characters = '01アカサタナハマヤラワガザダバパイウエオカキクケコ01';
        const fontSize = 16;
        const columns = width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(8, 9, 15, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#38EA8C';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: 0.15,
                pointerEvents: 'none'
            }}
        />
    );
};

const Hero = () => {
    const [bootSequence, setBootSequence] = useState(0);
    const [isBooted, setIsBooted] = useState(() => {
        return !!sessionStorage.getItem('infiq_preloader_seen');
    });

    const bootMessages = [
        "> Initializing INFIQ Core...",
        "> Loading Innovation Modules...",
        "> Verifying System Integrity...",
        "> Access Granted ✓"
    ];

    useEffect(() => {
        if (isBooted) return;

        if (bootSequence < bootMessages.length) {
            const timer = setTimeout(() => {
                setBootSequence(prev => prev + 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setIsBooted(true);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [bootSequence, isBooted]);

    return (
        <section id="home" className="hero" style={{ overflow: 'hidden', background: '#08090F', minHeight: '100vh', paddingTop: '80px', position: 'relative' }}>
            <MatrixBackground />

            <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                <AnimatePresence mode="wait">
                    {!isBooted ? (
                        <motion.div
                            key="boot"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                fontFamily: 'monospace',
                                color: 'var(--primary)',
                                paddingTop: '15vh',
                                maxWidth: '600px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <Terminal size={24} />
                                <span style={{ letterSpacing: '2px', fontWeight: 'bold' }}>SYSTEM TERMINAL</span>
                            </div>
                            {bootMessages.slice(0, bootSequence + 1).map((msg, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        fontSize: '1.2rem',
                                        marginBottom: '1rem',
                                        color: i === bootMessages.length - 1 ? 'var(--primary)' : 'var(--text-muted)'
                                    }}
                                >
                                    {msg}
                                    {i === bootSequence && (
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            style={{ display: 'inline-block', width: '10px', height: '1.2rem', background: 'var(--primary)', marginLeft: '5px', verticalAlign: 'middle' }}
                                        />
                                    )}
                                </motion.p>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                minHeight: 'calc(100vh - 160px)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: '2rem',
                                textAlign: 'center',
                                maxWidth: '900px',
                                margin: '0 auto'
                            }}
                        >
                            {/* Status Indicator */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '2rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    letterSpacing: '2px',
                                    color: 'var(--primary)',
                                    background: 'rgba(56, 234, 140, 0.1)',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '100px',
                                    border: '1px solid rgba(56, 234, 140, 0.2)'
                                }}
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        boxShadow: '0 0 10px var(--primary)'
                                    }}
                                />
                                SYSTEM STATUS: ONLINE
                            </motion.div>

                            {/* Main Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h1 style={{
                                    fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                                    fontWeight: '950',
                                    color: '#fff',
                                    lineHeight: 0.9,
                                    marginBottom: '1.5rem',
                                    fontFamily: 'Orbitron',
                                    letterSpacing: '2px',
                                    textShadow: '0 0 40px rgba(56, 234, 140, 0.3)'
                                }}>
                                    INFIQ <span style={{
                                        background: 'linear-gradient(135deg, var(--primary), #2dd4bf)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'block',
                                        marginTop: '0.5rem'
                                    }}>2K26</span>
                                </h1>
                                <p style={{
                                    fontSize: '1.3rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: '500',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}>
                                    National Level Symposium
                                </p>
                            </motion.div>

                            {/* Event Details */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{
                                    display: 'flex',
                                    gap: '3rem',
                                    marginTop: '3rem',
                                    fontSize: '1rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                                    <span style={{ fontWeight: '600', letterSpacing: '1px' }}>24.02.2026</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📍</span>
                                    <span style={{ fontWeight: '600', letterSpacing: '1px' }}>VSBCETC</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🎯</span>
                                    <span style={{ fontWeight: '600', letterSpacing: '1px' }}>12 Events</span>
                                </div>
                            </motion.div>

                            {/* Prize Pool */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 }}
                                style={{
                                    marginTop: '4rem'
                                }}
                            >
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontWeight: '800',
                                    letterSpacing: '3px',
                                    marginBottom: '1rem'
                                }}>
                                    TOTAL PRIZE POOL
                                </div>
                                <motion.div
                                    animate={{
                                        textShadow: [
                                            '0 0 20px rgba(56, 234, 140, 0.5)',
                                            '0 0 40px rgba(56, 234, 140, 0.8)',
                                            '0 0 20px rgba(56, 234, 140, 0.5)'
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{
                                        fontSize: 'clamp(3rem, 8vw, 5rem)',
                                        fontWeight: '900',
                                        color: 'var(--primary)',
                                        fontFamily: 'Orbitron'
                                    }}
                                >
                                    ₹50,000
                                </motion.div>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    marginTop: '4rem',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}
                            >
                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                    style={{
                                        padding: '1.2rem 3rem',
                                        fontSize: '1rem',
                                        fontWeight: '900',
                                        letterSpacing: '1px',
                                        boxShadow: '0 0 40px rgba(56, 234, 140, 0.4)'
                                    }}
                                >
                                    REGISTER NOW
                                </Link>
                                <Link
                                    to="/events"
                                    className="btn btn-outline"
                                    style={{
                                        padding: '1.2rem 3rem',
                                        fontSize: '1rem',
                                        fontWeight: '900',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    VIEW EVENTS
                                </Link>
                            </motion.div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.1 }}
                                style={{
                                    marginTop: '5rem',
                                    fontSize: '0.75rem',
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    letterSpacing: '1px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Terminal size={14} style={{ color: 'var(--primary)' }} />
                                    Dept. of Computer Science & Engineering
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.2)' }}
                >
                    <ChevronDown size={32} />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
