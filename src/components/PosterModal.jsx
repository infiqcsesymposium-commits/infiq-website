import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Image as ImageIcon } from 'lucide-react';
import eventPoster from '../assets/Black & Blue Minimalist Sunday Service Event Announcement Instagram Post (Presentation).png';

const PosterModal = ({ isOpen, onClose }) => {
    // Close on 'Escape' key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = eventPoster;
        link.download = 'INFIQ_2K26_Symposium_Poster.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'INFIQ 2K26 - Tech Symposium',
                    text: 'Check out the official INFIQ 2K26 symposium poster!',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 9998,
                            cursor: 'pointer'
                        }}
                    />

                    {/* Modal Wrapper for Centering */}
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: 'clamp(10px, 3vw, 20px)',
                        pointerEvents: 'none' // Allow clicks to pass to backdrop
                    }}>
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ duration: 0.4, type: 'spring', damping: 25 }}
                            className="poster-modal-content"
                            style={{
                                width: '100%',
                                maxWidth: '900px',
                                maxHeight: '90vh',
                                background: 'linear-gradient(145deg, rgba(15, 17, 26, 0.95), rgba(8, 9, 15, 0.98))',
                                border: '2px solid rgba(56, 234, 140, 0.3)',
                                borderRadius: 'clamp(12px, 3vw, 24px)',
                                boxShadow: '0 0 60px rgba(56, 234, 140, 0.2), 0 20px 50px rgba(0, 0, 0, 0.7)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                pointerEvents: 'auto' // Re-enable pointer events for modal
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'clamp(0.8rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
                                borderBottom: '1px solid rgba(56, 234, 140, 0.1)',
                                background: 'rgba(0, 0, 0, 0.3)',
                                gap: '0.5rem',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 1.5vw, 0.8rem)', minWidth: 0, flex: '1 1 auto' }}>
                                    <ImageIcon size={window.innerWidth < 768 ? 16 : 20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                    <h3 style={{
                                        fontSize: 'clamp(0.65rem, 2vw, 1rem)',
                                        letterSpacing: 'clamp(1px, 0.3vw, 3px)',
                                        margin: 0,
                                        color: '#fff',
                                        fontFamily: 'Orbitron',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        SYMPOSIUM_POSTER.IMG
                                    </h3>
                                </div>

                                <div style={{ display: 'flex', gap: 'clamp(0.3rem, 1vw, 0.5rem)', flexShrink: 0 }}>
                                    {/* Download Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDownload}
                                        style={{
                                            background: 'rgba(56, 234, 140, 0.1)',
                                            border: '1px solid rgba(56, 234, 140, 0.3)',
                                            borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                            padding: 'clamp(0.4rem, 1.2vw, 0.5rem)',
                                            color: 'var(--primary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s',
                                            minWidth: 'clamp(32px, 8vw, 40px)',
                                            minHeight: 'clamp(32px, 8vw, 40px)'
                                        }}
                                        title="Download"
                                    >
                                        <Download size={window.innerWidth < 768 ? 16 : 18} />
                                    </motion.button>

                                    {/* Share Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        style={{
                                            background: 'rgba(0, 229, 255, 0.1)',
                                            border: '1px solid rgba(0, 229, 255, 0.3)',
                                            borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                            padding: 'clamp(0.4rem, 1.2vw, 0.5rem)',
                                            color: 'var(--neon-blue)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s',
                                            minWidth: 'clamp(32px, 8vw, 40px)',
                                            minHeight: 'clamp(32px, 8vw, 40px)'
                                        }}
                                        title="Share"
                                    >
                                        <Share2 size={window.innerWidth < 768 ? 16 : 18} />
                                    </motion.button>

                                    {/* Close Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05, rotate: 90 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        style={{
                                            background: 'rgba(255, 95, 86, 0.1)',
                                            border: '1px solid rgba(255, 95, 86, 0.3)',
                                            borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                            padding: 'clamp(0.4rem, 1.2vw, 0.5rem)',
                                            color: '#FF5F56',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s',
                                            minWidth: 'clamp(32px, 8vw, 40px)',
                                            minHeight: 'clamp(32px, 8vw, 40px)'
                                        }}
                                        title="Close (ESC)"
                                    >
                                        <X size={window.innerWidth < 768 ? 16 : 18} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Poster Image */}
                            <div className="poster-modal-image-container" style={{
                                background: 'rgba(0, 0, 0, 0.4)',
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                padding: 'clamp(0.5rem, 2vw, 1.5rem)',
                                position: 'relative'
                            }}>
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    src={eventPoster}
                                    alt="INFIQ 2K26 Official Symposium Poster"
                                    className="poster-modal-image"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: 'clamp(4px, 1vw, 8px)',
                                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
                                        zIndex: 1
                                    }}
                                />
                            </div>

                            {/* Footer Info */}
                            <div style={{
                                padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
                                borderTop: '1px solid rgba(56, 234, 140, 0.1)',
                                background: 'rgba(0, 0, 0, 0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{
                                    fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
                                    color: 'var(--text-muted)',
                                    margin: 0,
                                    letterSpacing: 'clamp(0.5px, 0.2vw, 1px)'
                                }}>
                                    Click outside or press <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>ESC</span> to close
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PosterModal;
