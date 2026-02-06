import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, AlertCircle, Shield, Terminal, Lock, Cpu, Server, Globe2, Building2, UserPlus } from 'lucide-react';

const Registration = () => {
    const portals = [
        {
            title: "VSB STUDENTS",
            subtitle: "INTRA-COLLEGE PORTAL",
            icon: <Building2 size={32} />,
            desc: "Dedicated access node for current students of V.S.B. College of Engineering Technical Campus.",
            link: "https://docs.google.com/forms/d/e/1FAIpQLSeH72RZBzW5kUF9lROyfOKOmHsrMppotRnjrqT5lmtWTakhvA/viewform?usp=sharing",
            color: "var(--primary)",
            accent: "rgba(56, 234, 140, 0.2)"
        },
        {
            title: "OTHER COLLEGES",
            subtitle: "EXTERNAL ACCESS PORTAL",
            icon: <Globe2 size={32} />,
            desc: "Gateway for participants from other institutions. Join the innovation network.",
            link: "https://docs.google.com/forms/d/e/1FAIpQLSdDLs8yPYuolOBTLkc7CZF8Y_qMm-eJSqJCVaJXy7jvXMjdFA/viewform?usp=sharing",
            color: "#00E5FF",
            accent: "rgba(0, 229, 255, 0.2)"
        },
        {
            title: "PAPER PRESENTATION",
            subtitle: "RESEARCH SUBMISSION",
            icon: <Server size={32} />,
            desc: "Direct channel for paper presentation and specialized track registrations.",
            link: "https://docs.google.com/forms/d/e/1FAIpQLSdXA74J6JASPqJwLU02CQZXxRO6oeigZzrAPDrHCG2IyvQayQ/viewform?usp=sharing",
            color: "#FF2EDF",
            accent: "rgba(255, 46, 223, 0.2)"
        }
    ];

    return (
        <section id="register" className="registration" style={{ padding: '120px 0', background: 'transparent', overflow: 'hidden', position: 'relative' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '6rem' }}
                >
                    <span className="section-subtitle">Security Protocol</span>
                    <h2 className="section-title">CHOOSE ACCESS PORTAL</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Select your origin node to initialize the correct registration sequence.</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {portals.map((portal, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card"
                            style={{
                                padding: '3rem',
                                borderTop: `4px solid ${portal.color}`,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Accent Background */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '200px',
                                background: `linear-gradient(180deg, ${portal.accent} 0%, transparent 100%)`,
                                opacity: 0.3,
                                pointerEvents: 'none'
                            }} />

                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '2rem',
                                color: portal.color,
                                border: `1px solid ${portal.color}44`
                            }}>
                                {portal.icon}
                            </div>

                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: portal.color, letterSpacing: '2px', marginBottom: '0.5rem' }}>
                                {portal.subtitle}
                            </span>
                            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontFamily: 'Orbitron' }}>
                                {portal.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2.5rem', flex: 1 }}>
                                {portal.desc}
                            </p>

                            <a
                                href={portal.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{
                                    background: 'transparent',
                                    border: `1px solid ${portal.color}`,
                                    color: portal.color,
                                    textAlign: 'center',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: '0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = portal.color;
                                    e.currentTarget.style.color = '#000';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = portal.color;
                                }}
                            >
                                <Terminal size={16} /> INITIATE_LOGIN
                            </a>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ marginTop: '5rem', maxWidth: '900px', margin: '5rem auto 0' }}
                >
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', border: '1px dashed rgba(255, 68, 68, 0.3)', background: 'rgba(255, 68, 68, 0.02)' }}>
                        <div style={{ padding: '15px', background: 'rgba(255, 68, 68, 0.1)', borderRadius: '50%', color: '#ff4444' }}>
                            <Lock size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>REGISTRATION RESTRICTED</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                <strong style={{ color: '#ff4444' }}>CRITICAL ALERT:</strong> On-spot registration capabilities are currently DISABLED.
                                All personnel must secure access credentials via these portals before the deadline.
                                Unregistered entities will be denied entry at the physical firewall.
                            </p>
                        </div>
                    </div>
                </motion.div>
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
