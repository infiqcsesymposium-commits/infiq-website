import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Calendar, Users, Terminal, Zap, Shield, Search, Filter } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import PageTransition from '../components/PageTransition';

const EventSchedule = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        const q = query(collection(db, "event_slots"), orderBy("startTime", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSlots(data);
            setLoading(false);
        }, (error) => {
            console.error("Schedule Sync Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredSlots = slots.filter(slot => {
        const matchesSearch = slot.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            slot.venue.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'ALL' || slot.date === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const uniqueDates = [...new Set(slots.map(s => s.date))].sort();

    return (
        <PageTransition>
            <div style={{ padding: '120px 0 80px', minHeight: '100vh', background: '#05060A', position: 'relative', overflow: 'hidden' }}>
                {/* Background Grid Effect */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(56, 234, 140, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 234, 140, 0.03) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    pointerEvents: 'none', zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', borderRadius: '30px', background: 'rgba(56, 234, 140, 0.05)', border: '1px solid rgba(56, 234, 140, 0.1)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '2px' }}
                        >
                            <Zap size={14} className="animate-pulse" /> SYSTEM_CLOCK_SYNCED
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontFamily: 'Share Tech Mono', color: '#fff', margin: '0 0 1rem', letterSpacing: '4px' }}
                        >
                            EVENT_TIMINGS
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}
                        >
                            Central dispatch for all INFIQ 2K26 nodes. Track dates, venues, and execution windows.
                        </motion.p>
                    </div>

                    {/* Filter & Search Controls */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
                        gap: '1.5rem', marginBottom: '3rem', background: 'rgba(255,255,255,0.02)',
                        padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '5px' }}>
                            <button
                                onClick={() => setActiveFilter('ALL')}
                                style={{
                                    padding: '0.8rem 1.5rem', borderRadius: '8px', border: activeFilter === 'ALL' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                    background: activeFilter === 'ALL' ? 'rgba(56, 234, 140, 0.1)' : 'transparent', color: activeFilter === 'ALL' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                ALL_DAYS
                            </button>
                            {uniqueDates.map(date => (
                                <button
                                    key={date}
                                    onClick={() => setActiveFilter(date)}
                                    style={{
                                        padding: '0.8rem 1.5rem', borderRadius: '8px', border: activeFilter === date ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                        background: activeFilter === date ? 'rgba(56, 234, 140, 0.1)' : 'transparent', color: activeFilter === date ? 'var(--primary)' : 'var(--text-muted)',
                                        fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                                    }}
                                >
                                    {date}
                                </button>
                            ))}
                        </div>

                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px', minWidth: '280px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                            <input
                                type="text"
                                placeholder="Search by event or venue..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Schedule Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                            <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
                            FETCHING_DATA_STREAMS...
                        </div>
                    ) : filteredSlots.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No schedule entries found matching your query.</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            <AnimatePresence>
                                {filteredSlots.map((slot, index) => (
                                    <motion.div
                                        key={slot.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card shimmer-sweep glow-interactive"
                                        style={{
                                            padding: '2rem', background: 'rgba(15, 17, 26, 0.4)', borderRadius: '24px',
                                            border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {/* Creative Corner Decor */}
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'linear-gradient(135deg, transparent 50%, rgba(56, 234, 140, 0.1) 50%)' }} />

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '1.2rem', letterSpacing: '1px' }}>
                                            <Terminal size={14} /> SLOT_ID: {slot.id.substring(0, 6).toUpperCase()}
                                        </div>

                                        <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 1.5rem', minHeight: '3.5rem' }}>{slot.eventName}</h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 234, 140, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                    <Calendar size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>Event Date</div>
                                                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>{slot.date}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 234, 140, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>Execution Window</div>
                                                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>{slot.startTime} - {slot.endTime}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 189, 46, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFBD2E' }}>
                                                    <Shield size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, color: '#FFBD2E' }}>Reporting In</div>
                                                    <div style={{ color: '#FFBD2E', fontSize: '0.95rem', fontWeight: 'bold' }}>{slot.reportTime}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 234, 140, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                    <MapPin size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>Deployment Zone</div>
                                                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>{slot.venue}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
                                                <Users size={12} /> {slot.coordinator || 'SYSTEM_ADMIN'}
                                            </div>
                                            <div style={{ height: '4px', width: '40px', background: 'var(--primary)', borderRadius: '2px', boxShadow: '0 0 10px var(--primary)' }} />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Aesthetic Floating Circles */}
                <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56, 234, 140, 0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(56, 234, 140, 0.03) 0%, transparent 70%)', filter: 'blur(100px)' }} />
            </div>
        </PageTransition>
    );
};

export default EventSchedule;
