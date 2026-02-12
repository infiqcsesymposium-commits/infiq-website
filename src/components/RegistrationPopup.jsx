import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Terminal, ShieldCheck, ArrowRight, Activity, Cpu } from 'lucide-react';
import popupImg from '../assets/poster.jpeg';

const RegistrationPopup = ({ onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Target release date: Monday, February 9th, 2026 at 00:00:00
        const releaseDate = new Date('2026-02-09T00:00:00');
        const currentDate = new Date();

        if (currentDate >= releaseDate) {
            const hasSeenPopup = sessionStorage.getItem('regPopupSeen');
            const isMobile = window.innerWidth <= 768; // Check for mobile width
            if (!hasSeenPopup && !isMobile) {
                setShow(true);
            }
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem('regPopupSeen', 'true');
        if (onClose) onClose();
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(10, 15, 30, 0.95), #05060A)',
                    backdropFilter: 'blur(15px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    overflow: 'hidden'
                }}
            >
                {/* Background Decorations */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1 }} />
                    <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'var(--neon-blue)', filter: 'blur(150px)', opacity: 0.1 }} />
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{
                        background: 'rgba(15, 17, 26, 0.7)',
                        borderRadius: '32px',
                        maxWidth: '850px',
                        width: '100%',
                        position: 'relative',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 0 80px rgba(255,255,255,0.02)',
                        overflow: 'hidden',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
                    }}
                >
                    {/* Visual Side */}
                    <div style={{
                        padding: '3.5rem',
                        background: `linear-gradient(135deg, rgba(8, 9, 15, 0.95), rgba(8, 9, 15, 0.6)), url(${popupImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,17,26,1) 0%, transparent 100%)', opacity: 0.4 }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                <div style={{ padding: '8px', background: 'rgba(56, 234, 140, 0.1)', borderRadius: '10px' }}>
                                    <Activity size={20} color="var(--primary)" />
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '4px', fontWeight: '900', fontFamily: 'Orbitron' }}>SYSTEM_LAUNCH</span>
                            </div>

                            <h2 style={{
                                fontSize: '3.5rem',
                                fontWeight: '950',
                                color: '#fff',
                                lineHeight: '1',
                                marginBottom: '1.5rem',
                                letterSpacing: '-2px',
                                fontFamily: 'Orbitron'
                            }}>
                                GATEWAY <br /><span style={{ color: 'var(--primary)' }}>INITIALIZED</span>
                            </h2>

                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                                The portal to INFIQ 2K26 is now active. Secure your node in the network to access the ultimate tech symposium.
                            </p>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {[
                                    { icon: <Calendar size={18} />, label: 'DATE_NODE', value: 'FEB 24, 2026' },
                                    { icon: <ShieldCheck size={18} />, label: 'SECURITY', value: 'ENCRYPTED_ACCESS' },
                                    { icon: <Clock size={18} />, label: 'STATUS', value: 'LIVE_PENDING' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ color: 'rgba(255,255,255,0.3)' }}>{item.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', fontWeight: '700' }}>{item.label}</div>
                                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Side */}
                    <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>PROTOCOL_REG01</div>
                            <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>Registration Sequence</h3>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0', display: 'grid', gap: '1.5rem' }}>
                            {[
                                { title: 'Core Validation', desc: 'Verify institution credentials' },
                                { title: 'Node Assignment', desc: 'Select technical or non-tech domains' },
                                { title: 'Final Sync', desc: 'Secure payment and slot locking' }
                            ].map((step, i) => (
                                <li key={i} style={{ display: 'flex', gap: '1.2rem' }}>
                                    <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--primary)', border: '1px solid rgba(56, 234, 140, 0.2)', fontWeight: 'bold' }}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>{step.title}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{step.desc}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <motion.button
                            onClick={handleClose}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(56, 234, 140, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                background: 'var(--primary)',
                                border: 'none',
                                borderRadius: '16px',
                                color: '#000',
                                fontWeight: '900',
                                fontSize: '1rem',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                marginBottom: '1.5rem'
                            }}
                        >
                            INITIALIZE_SYSTEM <ArrowRight size={20} />
                        </motion.button>

                        <button
                            onClick={handleClose}
                            style={{
                                padding: '1rem',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        >
                            CLOSE_SESSION
                        </button>
                    </div>

                    {/* Exit Button */}
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RegistrationPopup;
