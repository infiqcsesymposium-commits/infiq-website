import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Bell, Calendar, Info, AlertTriangle, X, ChevronRight, Pin } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [urgentAnn, setUrgentAnn] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // We use a simple query to avoid needing composite indexes for isActive + createdAt
        const q = query(
            collection(db, "announcements"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = new Date();
            const data = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(ann => {
                    // Filter active and non-expired on client
                    if (ann.isActive === false) return false;
                    if (!ann.expiresAt) return true;
                    return new Date(ann.expiresAt) > now;
                });

            setAnnouncements(data);

            // Find most recent urgent announcement
            const urgent = data.find(ann => ann.priority === 'URGENT');
            setUrgentAnn(urgent);
        }, (error) => {
            console.error("Announcement Sync Error:", error);
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
            clearInterval(timer);
        };
    }, []);

    const getIcon = (category) => {
        switch (category) {
            case 'Technical': return <Info size={18} />;
            case 'Deadline': return <Calendar size={18} />;
            case 'Closed': return <AlertTriangle size={18} />;
            case 'Update': return <Megaphone size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return 'var(--neon-pink)';
            case 'IMPORTANT': return '#FFBD2E';
            default: return 'var(--primary)';
        }
    };

    if (announcements.length === 0) return null;

    return (
        <>
            {/* Announcement Section on Page */}
            <section style={{ padding: '60px 0', background: 'transparent' }} id="announcements">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0, fontFamily: 'Share Tech Mono' }}>LATEST_UPDATES</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {announcements.map((ann, index) => (
                            <motion.div
                                key={ann.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card"
                                style={{
                                    padding: '2rem',
                                    position: 'relative',
                                    border: `1px solid ${ann.priority === 'URGENT' ? 'rgba(255, 46, 223, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    overflow: 'hidden'
                                }}
                            >
                                {ann.priority === 'URGENT' && (
                                    <div style={{
                                        position: 'absolute', top: 0, right: 0,
                                        background: 'var(--neon-pink)', color: '#000',
                                        padding: '4px 12px', fontSize: '0.7rem', fontWeight: 'bold',
                                        borderBottomLeftRadius: '12px'
                                    }}>URGENT</div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '45px', height: '45px', borderRadius: '12px',
                                        background: `rgba(${ann.priority === 'URGENT' ? '255, 46, 223' : '56, 234, 140'}, 0.1)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: getPriorityColor(ann.priority)
                                    }}>
                                        {getIcon(ann.category)}
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase' }}>
                                            {ann.category} • {ann.eventName === 'ALL' ? 'General' : ann.eventName}
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>{ann.title}</h3>
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', minHeight: '60px' }}>
                                    {ann.message}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                                        {ann.createdAt?.toDate ? ann.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Details <ChevronRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Announcements;
