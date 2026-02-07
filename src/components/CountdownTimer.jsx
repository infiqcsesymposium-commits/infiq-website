import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const CountdownTimer = () => {
    const releaseDate = new Date('2026-02-09T00:00:00');
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isOpen: false
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = releaseDate - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOpen: true });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isOpen: false
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    if (timeLeft.isOpen) return null;

    const TimeUnit = ({ label, value }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="time-unit"
            style={{
                position: 'relative',
                padding: '1.5rem 1rem',
                background: 'rgba(15, 17, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '90px'
            }}
        >
            <div style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: 'var(--primary)',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '2px',
                textShadow: '0 0 20px rgba(56, 234, 140, 0.4)'
            }}>
                {String(value).padStart(2, '0')}
            </div>
            <div style={{
                fontSize: '0.6rem',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '800'
            }}>
                {label}
            </div>
            {/* Corner Accents */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '4px', height: '4px', borderTop: '1px solid var(--primary)', borderLeft: '1px solid var(--primary)' }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '4px', height: '4px', borderBottom: '1px solid var(--primary)', borderRight: '1px solid var(--primary)' }} />
        </motion.div>
    );

    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 1.5rem 60px',
            position: 'relative',
            overflow: 'hidden',
            background: '#05060A'
        }}>
            {/* Backdrop Glows */}
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56, 234, 140, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />

            <div style={{ maxWidth: '800px', width: '100%', position: 'relative', zIndex: 1 }}>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '3.5rem' }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '6px 16px',
                        background: 'rgba(56, 234, 140, 0.1)',
                        border: '1px solid rgba(56, 234, 140, 0.3)',
                        borderRadius: '100px',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)', animation: 'pulse-dot 2s infinite' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Orbitron' }}>Initialization Locked</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                        fontWeight: '900',
                        color: '#fff',
                        lineHeight: '1',
                        marginBottom: '1rem',
                        letterSpacing: '-1px'
                    }}>
                        Standby for <span style={{ color: 'var(--primary)' }}>Infiq</span>
                    </h1>

                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                        Neural link synchronization in progress. The portal to Coimbatore's premier tech symposia initializes shortly.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1rem',
                    marginBottom: '3.5rem'
                }} className="timer-grid">
                    <TimeUnit label="Days" value={timeLeft.days} />
                    <TimeUnit label="Hours" value={timeLeft.hours} />
                    <TimeUnit label="Mins" value={timeLeft.minutes} />
                    <TimeUnit label="Secs" value={timeLeft.seconds} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ padding: '10px', background: 'rgba(56, 234, 140, 0.1)', borderRadius: '12px' }}>
                                <Calendar size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Launch Sequence</div>
                                <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>Feb 09, 2026</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ padding: '10px', background: 'rgba(56, 234, 140, 0.1)', borderRadius: '12px' }}>
                                <ShieldCheck size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Security Status</div>
                                <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Verified
                                    <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '1.2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        textAlign: 'center'
                    }}>
                        <Zap size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>
                            Early bird shortlists will be notified via registered neural IDs.
                        </span>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 600px) {
                    .timer-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    .time-unit div:first-child {
                        fontSize: 2rem !important;
                    }
                }
                @keyframes pulse-dot {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.3); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            `}</style>
        </section>
    );
};

export default CountdownTimer;
