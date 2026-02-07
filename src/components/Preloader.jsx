import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Preloader = ({ onComplete }) => {
    const [messages, setMessages] = useState([]);
    const [isDone, setIsDone] = useState(false);

    const sequence = [
        { text: "> Initializing INFIQ Core...", delay: 800 },
        { text: "> Loading Innovation Modules...", delay: 1000 },
        { text: "> Verifying System Integrity...", delay: 1200 },
        { text: "> Access Granted ✓", delay: 800, color: 'var(--primary)' },
        { text: "SYSTEM READY.", delay: 500, highlight: true },
        { text: "WELCOME TO INFIQ 2K26", delay: 1000, highlight: true }
    ];

    useEffect(() => {
        let currentIdx = 0;
        const processSequence = async () => {
            for (const item of sequence) {
                await new Promise(resolve => setTimeout(resolve, item.delay));
                setMessages(prev => [...prev, item]);
                currentIdx++;
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsDone(true);
            setTimeout(() => {
                onComplete();
            }, 1000);
        };

        processSequence();
    }, []);

    return (
        <AnimatePresence>
            {!isDone && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        backgroundColor: '#000',
                        transition: { duration: 0.8, ease: "circIn" }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: '#040508',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        fontFamily: "'Share Tech Mono', monospace"
                    }}
                >
                    {/* Background Grid Minimal */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(rgba(56, 234, 140, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 234, 140, 0.05) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        pointerEvents: 'none',
                        opacity: 0.3
                    }} />

                    {/* Central Logo Animation */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ marginBottom: '4rem', filter: 'drop-shadow(0 0 30px rgba(56, 234, 140, 0.2))' }}
                    >
                        <Logo size={48} />
                    </motion.div>

                    <div style={{ maxWidth: '600px', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: '120px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {messages.slice(-3).map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1 - (2 - idx) * 0.3, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        fontSize: msg.highlight ? '1.2rem' : '0.9rem',
                                        fontWeight: msg.highlight ? '900' : '400',
                                        color: msg.color || (msg.highlight ? '#fff' : 'rgba(56, 234, 140, 0.6)'),
                                        marginBottom: '0.8rem',
                                        letterSpacing: msg.highlight ? '6px' : '2px',
                                        fontFamily: msg.highlight ? 'Orbitron' : 'inherit',
                                        textAlign: 'center',
                                        textTransform: 'uppercase',
                                        textShadow: msg.highlight ? '0 0 20px rgba(56, 234, 140, 0.5)' : 'none'
                                    }}
                                >
                                    {msg.text}
                                    {idx === messages.length - 1 && !isDone && (
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            style={{
                                                display: 'inline-block',
                                                width: '10px',
                                                height: '2px',
                                                background: 'var(--primary)',
                                                marginLeft: '12px',
                                                verticalAlign: 'middle'
                                            }}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div style={{
                        width: '240px',
                        height: '2px',
                        background: 'rgba(255,255,255,0.05)',
                        marginTop: '2rem',
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: sequence.reduce((acc, curr) => acc + curr.delay, 0) / 1000, ease: "linear" }}
                            style={{
                                height: '100%',
                                background: 'var(--primary)',
                                boxShadow: '0 0 15px var(--primary)'
                            }}
                        />
                    </div>

                    {/* Scanning Bar Animation */}
                    <motion.div
                        animate={{ top: ['-20%', '120%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '15vh',
                            background: 'linear-gradient(to bottom, transparent, rgba(56, 234, 140, 0.05), transparent)',
                            zIndex: 10,
                            pointerEvents: 'none'
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
