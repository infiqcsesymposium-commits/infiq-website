import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket, Clock, Zap,
    ShieldAlert, Users,
    CheckCircle2, Globe, Lock, Cpu, Server, Terminal, Building2, Globe2,
    ShieldOff
} from 'lucide-react';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const Registration = () => {
    const [systemAccess, setSystemAccess] = useState({
        otherDepts: true,
        cseDept: true,
        outerCollege: true
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "system_settings", "registration_access"), (docSnap) => {
            if (docSnap.exists()) {
                setSystemAccess(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    const RegistrationCard = ({ title, subtitle, price, items, icon: Icon, color, accessKey, href, free = false }) => {
        const isOpen = systemAccess[accessKey];

        return (
            <motion.div
                whileHover={isOpen ? { y: -10 } : {}}
                className="glass-card"
                style={{
                    border: `1px solid ${color}`,
                    background: `linear-gradient(145deg, rgba(15, 17, 26, 0.9), ${color}10)`,
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isOpen ? 1 : 0.8
                }}
            >
                {!isOpen && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)', zIndex: 10, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '1rem'
                    }}>
                        <ShieldOff size={48} color={color} />
                        <div style={{ color: color, fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'Share Tech Mono' }}>STANDBY_MODE</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Access Restricted by Admin</div>
                    </div>
                )}

                {free && (
                    <div style={{
                        position: 'absolute', top: '15px', right: '-30px', transform: 'rotate(45deg)',
                        background: color, color: '#000', padding: '5px 40px', fontSize: '0.7rem', fontWeight: 'bold'
                    }}>
                        EXCLUSIVE
                    </div>
                )}

                <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        margin: '0 auto 1.5rem',
                        background: `${color}1A`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${color}`,
                        boxShadow: `0 0 20px ${color}33`
                    }}>
                        <Icon size={28} style={{ color: color }} />
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>{title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{subtitle}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', height: '60px' }}>
                        {free ? (
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: color, fontFamily: 'Orbitron', letterSpacing: '2px' }}>FREE</span>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '1rem', marginTop: '5px', color: 'var(--text-muted)' }}>₹</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Orbitron', lineHeight: 1 }}>{price}</span>
                            </div>
                        )}
                    </div>

                    <ul style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                        {items.map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                <CheckCircle2 size={16} style={{ color: color }} />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <a
                        href={isOpen ? href : "#"}
                        className={`btn ${free ? 'btn-primary' : ''}`}
                        style={{
                            width: '100%', justifyContent: 'center',
                            border: free ? 'none' : `1px solid ${color}`,
                            color: free ? '#000' : color,
                            pointerEvents: isOpen ? 'auto' : 'none',
                            opacity: isOpen ? 1 : 0.5
                        }}
                    >
                        {isOpen ? (free ? 'REGISTER FREE' : 'REGISTER NOW') : 'ACCESS_LOCKED'}
                    </a>
                </div>
            </motion.div>
        );
    };

    return (
        <section id="register" className="registration" style={{ padding: '120px 0', background: 'transparent', overflow: 'hidden', position: 'relative' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '6rem' }}
                >
                    <span className="section-subtitle">ACCESS PROTOCOLS</span>
                    <h2 className="section-title">SECURE ENTRY</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
                        Select your designation to initialize the appropriate access sequence.
                    </p>
                </motion.div>

                <div className="events-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <RegistrationCard
                        title="OUTER COLLEGE"
                        subtitle="Students from other institutions"
                        price="300"
                        icon={Globe}
                        color="var(--neon-blue)"
                        accessKey="outerCollege"
                        href="/register"
                        items={['Full Event Access', 'Food & Hydration', 'Certificate of Merit', 'Networking Access']}
                    />

                    <RegistrationCard
                        title="OTHER DEPTS"
                        subtitle="VSBCETC Students (Non-CSE)"
                        price="100"
                        icon={Users}
                        color="var(--neon-pink)"
                        accessKey="otherDepts"
                        href="/register"
                        items={['Full Event Access', 'Food & Hydration', 'Participate & Win', 'Campus Resources']}
                    />

                    <RegistrationCard
                        title="CSE"
                        subtitle="VSBCETC Dept Students Only"
                        icon={Ticket}
                        color="var(--primary)"
                        accessKey="cseDept"
                        href="/register"
                        free={true}
                        items={['Full Event Access', 'Food & Hydration', 'Certificate provided', 'Host Privileges']}
                    />
                </div>

                {/* Important Notices Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '3rem auto 0' }}>
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'start', gap: '1.5rem', borderLeft: '4px solid #FF2EDF' }}>
                        <div style={{ color: '#FF2EDF', background: 'rgba(255, 46, 223, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>TIME CRITICAL</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                Registration portal closes on <span style={{ color: '#FF2EDF', fontWeight: 'bold' }}>22/02/2026</span>. Secure your slot before system lockdown.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'start', gap: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
                        <div style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>PROTOCOL ALERT</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                <strong> AR/VR :</strong><br />
                                Spot registration ₹100 / head
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ position: 'absolute', top: '10%', right: '5%', opacity: 0.05, pointerEvents: 'none' }}>
                <Cpu size={300} className="text-[#38EA8C]" />
            </div>
            <div style={{ position: 'absolute', bottom: '10%', left: '5%', opacity: 0.05, pointerEvents: 'none' }}>
                <Server size={300} className="text-[#00E5FF]" />
            </div>
        </section>
    );
};

export default Registration;
