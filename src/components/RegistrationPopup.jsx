import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Sparkles } from 'lucide-react';

const RegistrationPopup = ({ onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Target release date: Monday, February 9th, 2026 at 00:00:00
        const releaseDate = new Date('2026-02-09T00:00:00');
        const currentDate = new Date();

        // Show popup only if current date is on or after release date
        if (currentDate >= releaseDate) {
            // Check if user has already dismissed the popup in this session
            const hasSeenPopup = sessionStorage.getItem('regPopupSeen');
            if (!hasSeenPopup) {
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
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.95) 0%, rgba(20, 20, 50, 0.95) 100%)',
                        borderRadius: '24px',
                        padding: '3rem',
                        maxWidth: '600px',
                        width: '100%',
                        position: 'relative',
                        border: '2px solid var(--primary)',
                        boxShadow: '0 0 60px rgba(56, 234, 140, 0.3), inset 0 0 60px rgba(56, 234, 140, 0.05)',
                        textAlign: 'center'
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            color: '#fff'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'rotate(90deg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'rotate(0deg)';
                        }}
                    >
                        <X size={24} />
                    </button>

                    {/* Sparkles Icon with Animation */}
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3,
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
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--neon-blue) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textShadow: '0 0 30px rgba(56, 234, 140, 0.5)',
                            lineHeight: '1.2'
                        }}
                    >
                        Registrations Now Open! 🎉
                    </h1>

                    {/* Subtitle */}
                    <p
                        style={{
                            fontSize: '1.2rem',
                            color: '#fff',
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}
                    >
                        Join us for <strong style={{ color: 'var(--primary)' }}>INFIQ 2K26</strong> - The Ultimate Tech Symposium!
                    </p>

                    {/* Event Details */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            marginBottom: '2.5rem',
                            flexWrap: 'wrap'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(56, 234, 140, 0.1)',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(56, 234, 140, 0.2)'
                            }}
                        >
                            <Calendar size={20} color="var(--primary)" />
                            <span style={{ color: '#fff', fontWeight: '600' }}>Feb 9, 2026</span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(0, 229, 255, 0.1)',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 229, 255, 0.2)'
                            }}
                        >
                            <Clock size={20} color="var(--neon-blue)" />
                            <span style={{ color: '#fff', fontWeight: '600' }}>Limited Slots</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: '1rem',
                            color: 'var(--text-muted)',
                            marginBottom: '2.5rem',
                            lineHeight: '1.7'
                        }}
                    >
                        Explore cutting-edge technology, compete in exciting events, and connect with innovators. Register now to secure your spot!
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={handleClose}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1.2rem 2rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #2dd4bf 100%)',
                            border: 'none',
                            color: '#000',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(56, 234, 140, 0.4)',
                            transition: 'all 0.3s'
                        }}
                    >
                        Start Registration →
                    </motion.button>

                    {/* Bottom Note */}
                    <p
                        style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            marginTop: '1.5rem',
                            opacity: 0.7
                        }}
                    >
                        This popup will only appear once per session
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RegistrationPopup;
