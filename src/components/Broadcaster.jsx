import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Megaphone, Terminal } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Broadcaster = () => {
    const [messages, setMessages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Fetch only active, urgent/important messages
        const q = query(
            collection(db, "announcements"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = new Date();
            const data = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(ann => {
                    if (!ann.isActive) return false;
                    if (ann.priority === 'NORMAL') return false; // Broadcaster only for high priority
                    if (!ann.expiresAt) return true;
                    return new Date(ann.expiresAt) > now;
                });

            setMessages(data);
            setCurrentIndex(0);
        });

        return () => unsubscribe();
    }, []);

    // Rotation timer for multiple messages
    useEffect(() => {
        if (messages.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % messages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [messages.length]);

    if (!isVisible || messages.length === 0) return null;

    const current = messages[currentIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0.8, opacity: 0, x: '-50%', y: '-50%' }}
                animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                exit={{ scale: 0.8, opacity: 0, x: '-50%', y: '-50%' }}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    zIndex: 2000,
                    width: '95%',
                    maxWidth: '800px',
                    pointerEvents: 'none'
                }}
            >
                <div style={{
                    background: 'rgba(8, 9, 15, 0.9)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    borderRadius: '100px',
                    padding: '8px 24px 8px 12px',
                    border: `1px solid ${current.priority === 'URGENT' ? 'rgba(255, 46, 223, 0.4)' : 'rgba(56, 234, 140, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#fff',
                    boxShadow: current.priority === 'URGENT' ? '0 10px 40px rgba(255, 46, 223, 0.15)' : '0 10px 40px rgba(56, 234, 140, 0.1)',
                    pointerEvents: 'auto',
                    fontFamily: "'Space Grotesk', sans-serif",
                    position: 'relative',
                    overflow: 'hidden',
                    height: '54px'
                }}>
                    {/* Scanning Line Effect */}
                    <motion.div
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: '40%',
                            background: `linear-gradient(90deg, transparent, ${current.priority === 'URGENT' ? 'rgba(255, 46, 223, 0.08)' : 'rgba(56, 234, 140, 0.08)'}, transparent)`,
                            pointerEvents: 'none'
                        }}
                    />

                    {/* Left Icon Capsule */}
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: current.priority === 'URGENT' ? 'linear-gradient(135deg, #FF2EDF, #FF4336)' : 'linear-gradient(135deg, #38EA8C, #2dd4bf)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 0 15px ${current.priority === 'URGENT' ? 'rgba(255, 46, 223, 0.4)' : 'rgba(56, 234, 140, 0.4)'}`
                    }}>
                        <Megaphone size={16} color="#000" strokeWidth={3} />
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', overflow: 'hidden' }}>
                        <div style={{
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            color: current.priority === 'URGENT' ? 'var(--neon-pink)' : 'var(--primary)',
                            letterSpacing: '2px',
                            fontFamily: 'Orbitron',
                            whiteSpace: 'nowrap',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {current.priority}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#fff',
                            letterSpacing: '0.2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', marginRight: '8px' }}>•</span>
                            {current.title}: {current.message}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        {messages.length > 1 && (
                            <div style={{
                                fontSize: '0.7rem',
                                color: 'rgba(255,255,255,0.3)',
                                fontFamily: 'Share Tech Mono',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '2px 10px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {currentIndex + 1}/{messages.length}
                            </div>
                        )}

                        <button
                            onClick={() => setIsVisible(false)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px',
                                borderRadius: '50%',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 67, 54, 0.2)';
                                e.currentTarget.style.color = '#ff4336';
                                e.currentTarget.style.transform = 'rotate(90deg)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                                e.currentTarget.style.transform = 'rotate(0deg)';
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Broadcaster;
