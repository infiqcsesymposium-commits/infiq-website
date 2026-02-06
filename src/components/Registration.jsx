import React from 'react';
import { motion } from 'framer-motion';
import {
    Ticket, Clock, Zap,
    ShieldAlert, Users,
    CheckCircle2, Globe, Lock, Cpu, Server, Terminal, Building2, Globe2
} from 'lucide-react';

const Registration = () => {
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

                    {/* 1. Outer College Pass -> Link to Form 2 (External) */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            border: '1px solid var(--neon-blue)',
                            background: 'linear-gradient(145deg, rgba(15, 17, 26, 0.9), rgba(0, 229, 255, 0.05))',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                margin: '0 auto 1.5rem',
                                background: 'rgba(0, 229, 255, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--neon-blue)',
                                boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)'
                            }}>
                                <Globe size={28} style={{ color: 'var(--neon-blue)' }} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>OUTER COLLEGE</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Students from other institutions</p>

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '5px', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '1rem', marginTop: '5px', color: 'var(--text-muted)' }}>₹</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Orbitron', lineHeight: 1 }}>250</span>
                            </div>

                            <ul style={{ textAlign: 'left', marginBottom: '2.5rem', space: 'y-3' }}>
                                {['Full Event Access', 'Food & Hydration', 'Certificate of Merit', 'Networking Access'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--neon-blue)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="/register"
                                className="btn"
                                style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)' }}
                            >
                                REGISTER NOW
                            </a>
                        </div>
                    </motion.div>

                    {/* 2. Other Departments Pass -> Link to Form 1 (Intra) assuming shared form or general VSB student form */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            border: '1px solid var(--neon-pink)',
                            background: 'linear-gradient(145deg, rgba(15, 17, 26, 0.9), rgba(255, 46, 223, 0.05))',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                margin: '0 auto 1.5rem',
                                background: 'rgba(255, 46, 223, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--neon-pink)',
                                boxShadow: '0 0 20px rgba(255, 46, 223, 0.2)'
                            }}>
                                <Users size={28} style={{ color: 'var(--neon-pink)' }} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>OTHER DEPTS</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>VSBCETC Students (Non-CSE/AI)</p>

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '5px', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '1rem', marginTop: '5px', color: 'var(--text-muted)' }}>₹</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Orbitron', lineHeight: 1 }}>100</span>
                            </div>

                            <ul style={{ textAlign: 'left', marginBottom: '2.5rem', space: 'y-3' }}>
                                {['Full Event Access', 'Food & Hydration', 'Participate & Win', 'Campus Resources'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--neon-pink)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="/register"
                                className="btn"
                                style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--neon-pink)', color: 'var(--neon-pink)' }}
                            >
                                REGISTER NOW
                            </a>
                        </div>
                    </motion.div>

                    {/* 3. CSE Intra College - Free -> Link to Form 1 (Intra) */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            border: '1px solid var(--primary)',
                            background: 'linear-gradient(145deg, rgba(15, 17, 26, 0.9), rgba(56, 234, 140, 0.05))',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: '15px', right: '-30px', transform: 'rotate(45deg)',
                            background: 'var(--primary)', color: '#000', padding: '5px 40px', fontSize: '0.7rem', fontWeight: 'bold'
                        }}>
                            EXCLUSIVE
                        </div>

                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                margin: '0 auto 1.5rem',
                                background: 'rgba(56, 234, 140, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--primary)',
                                boxShadow: '0 0 20px rgba(56, 234, 140, 0.2)'
                            }}>
                                <Ticket size={28} style={{ color: 'var(--primary)' }} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>CSE</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>VSBCETC Dept Students Only</p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', height: '60px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', fontFamily: 'Orbitron', letterSpacing: '2px' }}>FREE</span>
                            </div>

                            <ul style={{ textAlign: 'left', marginBottom: '2.5rem', space: 'y-3' }}>
                                {['Full Event Access', 'Food & Hydration', 'Certificate provided', 'Host Privileges'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="/register"
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                REGISTER FREE
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Important Notices Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '3rem auto 0' }}>

                    {/* Deadline Notice */}
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'start', gap: '1.5rem', borderLeft: '4px solid #FF2EDF' }}>
                        <div style={{ color: '#FF2EDF', background: 'rgba(255, 46, 223, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>TIME CRITICAL</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                Registration portal closes on <span style={{ color: '#FF2EDF', fontWeight: 'bold' }}>13/02/2026</span>. Secure your slot before system lockdown.
                            </p>
                        </div>
                    </div>

                    {/* Special Events Notice */}
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'start', gap: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
                        <div style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>PROTOCOL ALERT</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                <strong>Ideathon, Startup Arena & Esports:</strong><br />
                                Abstract submission required first. Payment only after selection confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
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
