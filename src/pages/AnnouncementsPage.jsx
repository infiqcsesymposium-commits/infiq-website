import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Bell, Calendar, Info, AlertTriangle, ChevronRight, Clock, MapPin, Tag } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import PageTransition from '../components/PageTransition';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [rawDocs, setRawDocs] = useState([]);
    const [eventSlots, setEventSlots] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple query to avoid composite index requirements
        const q = query(
            collection(db, "announcements"),
            orderBy("createdAt", "desc")
        );

        const fetchData = () => {
            const now = new Date();
            // We use the raw snapshot data if available
            if (rawDocs.length > 0) {
                const data = rawDocs
                    .filter(ann => {
                        if (ann.isActive === false) return false;
                        if (!ann.expiresAt) return true;
                        return new Date(ann.expiresAt) > now;
                    });
                setAnnouncements(data);
                setLoading(false);
            }
        };

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRawDocs(data);

            const now = new Date();
            const filtered = data.filter(ann => {
                if (ann.isActive === false) return false;
                if (!ann.expiresAt) return true;
                return new Date(ann.expiresAt) > now;
            });

            setAnnouncements(filtered);
            setLoading(false);
        }, (error) => {
            console.error("Announcements Page Sync Error:", error);
            setLoading(false);
        });

        // Subscribe to event slots for time details
        const unsubscribeSlots = onSnapshot(collection(db, "event_slots"), (snapshot) => {
            const slots = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                slots[data.eventName] = data;
            });
            setEventSlots(slots);
        });

        // Periodic re-filter for real-time expiration handling
        const timer = setInterval(() => {
            const now = new Date();
            setAnnouncements(prev => prev.filter(ann => {
                if (!ann.expiresAt) return true;
                return new Date(ann.expiresAt) > now;
            }));
        }, 30000); // Check every 30s

        return () => {
            unsubscribe();
            unsubscribeSlots();
            clearInterval(timer);
        };
    }, []);

    const getIcon = (category) => {
        switch (category) {
            case 'Technical': return <Info size={24} />;
            case 'Deadline': return <Calendar size={24} />;
            case 'Closed': return <AlertTriangle size={24} />;
            case 'Update': return <Megaphone size={24} />;
            case 'Venue': return <MapPin size={24} />;
            default: return <Bell size={24} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return '#FF5F56';
            case 'IMPORTANT': return '#FFBD2E';
            default: return 'var(--primary)';
        }
    };

    const getPriorityGlow = (priority) => {
        switch (priority) {
            case 'URGENT': return 'rgba(255, 95, 86, 0.2)';
            case 'IMPORTANT': return 'rgba(255, 189, 46, 0.2)';
            default: return 'rgba(56, 234, 140, 0.2)';
        }
    };

    return (
        <PageTransition>
            <div style={{ padding: '120px 0 80px', minHeight: '100vh', background: '#05060A' }}>
                <div className="container">
                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vw, 5rem)' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)', borderRadius: '50%',
                                background: 'rgba(56, 234, 140, 0.1)', border: '1px solid var(--primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.5rem', color: 'var(--primary)'
                            }}
                        >
                            <Megaphone size={window.innerWidth < 768 ? 24 : 32} />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                fontFamily: 'Share Tech Mono',
                                color: '#fff',
                                margin: '0 0 1rem',
                                letterSpacing: 'clamp(2px, 0.5vw, 5px)'
                            }}
                        >
                            BROADCAST_LOGS
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                color: 'var(--text-muted)',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                                maxWidth: '600px',
                                margin: '0 auto',
                                padding: '0 1rem'
                            }}
                        >
                            Stay synced with the real-time event updates, technical logs, and critical deadlines.
                        </motion.p>
                    </div>

                    {/* Announcements List */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                            <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
                            SYCHRONIZING_DATA...
                        </div>
                    ) : announcements.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)',
                            borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No active broadcasts found. Check back soon.</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                            {announcements.map((ann, index) => (
                                <motion.div
                                    key={ann.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card"
                                    style={{
                                        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                                        display: 'grid',
                                        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'auto 1fr auto',
                                        gap: 'clamp(1rem, 3vw, 2rem)',
                                        alignItems: 'start',
                                        border: `1px solid ${ann.priority === 'URGENT' ? 'rgba(255, 95, 86, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Priority Indicator Line */}
                                    <div style={{
                                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                                        background: getPriorityColor(ann.priority),
                                        boxShadow: `0 0 15px ${getPriorityGlow(ann.priority)}`
                                    }} />

                                    {/* Icon Column */}
                                    <div style={{
                                        width: 'clamp(50px, 12vw, 60px)', height: 'clamp(50px, 12vw, 60px)', borderRadius: '16px',
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: getPriorityColor(ann.priority),
                                        flexShrink: 0
                                    }}>
                                        {React.cloneElement(getIcon(ann.category), { size: window.innerWidth < 768 ? 20 : 24 })}
                                    </div>

                                    {/* Content Column */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 'bold',
                                                background: 'rgba(56, 234, 140, 0.1)', color: 'var(--primary)', textTransform: 'uppercase'
                                            }}>
                                                {ann.category}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)' }}>
                                                <Tag size={14} /> {ann.eventName === 'ALL' ? 'GLOBAL_EVENT' : ann.eventName}
                                            </span>
                                            {ann.priority === 'URGENT' && (
                                                <motion.span
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    style={{ color: '#FF5F56', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 'bold' }}
                                                >
                                                    🚨 SYSTEM_CRITICAL
                                                </motion.span>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: '#fff', margin: '0 0 1rem' }}>{ann.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', margin: '0 0 1.5rem 0' }}>
                                            {ann.message}
                                        </p>

                                        {/* Event Time Detail Injection */}
                                        {ann.eventName !== 'ALL' && eventSlots[ann.eventName] && (
                                            <div style={{
                                                display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
                                                padding: '1rem', background: 'rgba(56, 234, 140, 0.05)',
                                                borderRadius: '12px', border: '1px solid rgba(56, 234, 140, 0.1)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem' }}>
                                                    <Calendar size={14} /> {eventSlots[ann.eventName].date}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem' }}>
                                                    <Clock size={14} /> {eventSlots[ann.eventName].startTime}
                                                </div>
                                                {eventSlots[ann.eventName].venue && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem' }}>
                                                        <MapPin size={14} /> {eventSlots[ann.eventName].venue}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Meta Column */}
                                    <div style={{
                                        textAlign: window.innerWidth < 768 ? 'left' : 'right',
                                        display: 'flex',
                                        flexDirection: window.innerWidth < 768 ? 'row' : 'column',
                                        gap: '1rem',
                                        minWidth: window.innerWidth < 768 ? '100%' : '150px',
                                        justifyContent: window.innerWidth < 768 ? 'space-between' : 'flex-start',
                                        alignItems: window.innerWidth < 768 ? 'center' : 'flex-end',
                                        marginTop: window.innerWidth < 768 ? '1rem' : 0,
                                        borderTop: window.innerWidth < 768 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        paddingTop: window.innerWidth < 768 ? '1.5rem' : 0
                                    }}>
                                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: window.innerWidth < 768 ? 'flex-start' : 'flex-end', marginBottom: '4px' }}>
                                                <Clock size={14} />
                                                {ann.createdAt?.toDate ? ann.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOW'}
                                            </div>
                                            <div>{ann.createdAt?.toDate ? ann.createdAt.toDate().toLocaleDateString() : ''}</div>
                                        </div>

                                        {ann.expiresAt && (
                                            <div style={{
                                                fontSize: '0.75rem', color: '#FFBD2E', padding: '8px',
                                                background: 'rgba(255, 189, 46, 0.05)', borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end'
                                            }}>
                                                <AlertTriangle size={12} />
                                                Expires: {new Date(ann.expiresAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default AnnouncementsPage;
