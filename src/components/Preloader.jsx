import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
                        background: '#08090F',
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
                        backgroundImage: `linear-gradient(rgba(56, 234, 140, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 234, 140, 0.03) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none'
                    }} />

                    <div style={{ maxWidth: '600px', width: '100%', position: 'relative' }}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    fontSize: msg.highlight ? '1.5rem' : '1.1rem',
                                    fontWeight: msg.highlight ? '900' : '400',
                                    color: msg.color || (msg.highlight ? '#fff' : 'rgba(255,255,255,0.7)'),
                                    marginBottom: '1rem',
                                    letterSpacing: msg.highlight ? '4px' : '1px',
                                    fontFamily: msg.highlight ? 'Orbitron' : 'inherit',
                                    textAlign: msg.highlight ? 'center' : 'left',
                                    textTransform: msg.highlight ? 'uppercase' : 'none',
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
                                            width: '8px',
                                            height: '1.2rem',
                                            background: 'var(--primary)',
                                            marginLeft: '8px',
                                            verticalAlign: 'middle'
                                        }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Scanning Bar Animation */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'rgba(56, 234, 140, 0.1)',
                            boxShadow: '0 0 15px var(--primary)',
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
