import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Sparkles } from 'lucide-react';

const CountdownTimer = () => {
    const releaseDate = new Date('2026-02-09T07:00:00');
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
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isOpen: true
                });
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

    // If registration is open, don't show countdown
    if (timeLeft.isOpen) {
        return null;
    }

    return (
        <div
            style={{
                padding: '120px 0',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div className="container" style={{ maxWidth: '900px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{
                        padding: '4rem 2.5rem',
                        textAlign: 'center',
                        border: '2px solid var(--primary)',
                        boxShadow: '0 0 60px rgba(56, 234, 140, 0.2)'
                    }}
                >
                    {/* Animated Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        style={{
                            display: 'inline-flex',
                            padding: '1.5rem',
                            background: 'rgba(56, 234, 140, 0.15)',
                            borderRadius: '50%',
                            marginBottom: '2rem',
                            border: '2px solid var(--primary)'
                        }}
                    >
                        <Sparkles size={60} color="var(--primary)" />
                    </motion.div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: '3rem',
                            fontWeight: '900',
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--neon-blue) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: '1.2'
                        }}
                    >
                        Registrations Opening Soon!
                    </h1>

                    <p
                        style={{
                            fontSize: '1.2rem',
                            color: 'var(--text-muted)',
                            marginBottom: '3rem',
                            lineHeight: '1.6'
                        }}
                    >
                        Get ready for <strong style={{ color: 'var(--primary)' }}>INFIQ 2K26</strong> - The countdown has begun!
                    </p>

                    {/* Release Date Info */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '3rem',
                            padding: '1rem 2rem',
                            background: 'rgba(56, 234, 140, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(56, 234, 140, 0.2)',
                            flexWrap: 'wrap'
                        }}
                    >
                        <Calendar size={24} color="var(--primary)" />
                        <span style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700' }}>
                            Monday, February 9th, 2026
                        </span>
                        <Clock size={24} color="var(--neon-blue)" />
                        <span style={{ color: 'var(--neon-blue)', fontSize: '1.3rem', fontWeight: '700' }}>
                            07:00 AM
                        </span>
                    </div>

                    {/* Countdown Timer */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem',
                            maxWidth: '600px',
                            margin: '0 auto 3rem'
                        }}
                    >
                        {[
                            { label: 'Days', value: timeLeft.days },
                            { label: 'Hours', value: timeLeft.hours },
                            { label: 'Minutes', value: timeLeft.minutes },
                            { label: 'Seconds', value: timeLeft.seconds }
                        ].map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(56, 234, 140, 0.1) 0%, rgba(0, 229, 255, 0.1) 100%)',
                                    padding: '2rem 1rem',
                                    borderRadius: '16px',
                                    border: '2px solid rgba(56, 234, 140, 0.3)',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Glow effect */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '-50%',
                                        left: '-50%',
                                        width: '200%',
                                        height: '200%',
                                        background: 'radial-gradient(circle, rgba(56, 234, 140, 0.2) 0%, transparent 70%)',
                                        animation: 'pulse 3s ease-in-out infinite',
                                        pointerEvents: 'none'
                                    }}
                                />

                                <div
                                    style={{
                                        fontSize: '3rem',
                                        fontWeight: '900',
                                        color: 'var(--primary)',
                                        marginBottom: '0.5rem',
                                        textShadow: '0 0 20px rgba(56, 234, 140, 0.5)',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    {String(item.value).padStart(2, '0')}
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        fontWeight: '600',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    {item.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Note */}
                    <p
                        style={{
                            fontSize: '1rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.8',
                            marginBottom: '2rem'
                        }}
                    >
                        Mark your calendars! Registration will be available starting Monday, February 9th at midnight.
                        Don't miss your chance to be part of this incredible tech symposium!
                    </p>

                    {/* Call-to-action */}
                    <div
                        style={{
                            padding: '1.5rem',
                            background: 'rgba(255, 46, 223, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 46, 223, 0.2)'
                        }}
                    >
                        <p style={{ color: 'var(--neon-pink)', margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                            ⚡ Prepare to register for exciting events, workshops, and more!
                        </p>
                    </div>
                </motion.div>
            </div>

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 0.5;
                            transform: scale(1);
                        }
                        50% {
                            opacity: 1;
                            transform: scale(1.1);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default CountdownTimer;
