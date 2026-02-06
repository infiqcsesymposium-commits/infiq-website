import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, ExternalLink, MessageCircle, Heart, Globe, Terminal, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer style={{ background: '#08090F', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
            {/* System Breakdown Divider */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', opacity: 0.5 }}>
                <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '150px', height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}
                />
            </div>

            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '5rem' }}>
                <div className="footer-brand">
                    <div className="logo" style={{ marginBottom: '2rem', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Terminal size={24} className="text-[#38EA8C]" />
                        <span>INFIQ <span>2K26</span></span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.9rem', marginBottom: '2.5rem', maxWidth: '350px' }}>
                        The terminal for future technologists. Organized by the Department of CSE to push the boundaries of innovation and academic excellence.
                    </p>
                    <div className="footer-socials" style={{ display: 'flex', gap: '1.2rem' }}>
                        {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
                            <motion.a
                                key={i}
                                whileHover={{ y: -5, color: 'var(--primary)' }}
                                href="#"
                                style={{ color: 'var(--text-muted)', transition: '0.3s' }}
                            >
                                <Icon size={20} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div className="footer-links">
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '2px', color: '#fff', marginBottom: '2.5rem', textTransform: 'uppercase' }}>DIRECTORY</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {['About', 'Events', 'Coordinators', 'FAQ', 'Location'].map((link) => (
                            <li key={link}>
                                <Link to={`/${link.toLowerCase()}`} style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover:text-white transition-colors">
                                    <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>›</span> {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '2px', color: '#fff', marginBottom: '2.5rem', textTransform: 'uppercase' }}>SUPPORT MODULES</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(56, 234, 140, 0.05)', border: '1px solid rgba(56, 234, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <Phone size={18} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', margin: 0 }}>S. Pream Kumar</p>
                                <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '600', margin: 0 }}>+91 80726 52321</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(56, 234, 140, 0.05)', border: '1px solid rgba(56, 234, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <MessageCircle size={18} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', margin: 0 }}>P. Babu Prasanth</p>
                                <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '600', margin: 0 }}>+91 97876 68997</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{
                marginTop: '6rem',
                padding: '2.5rem 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '2rem',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={16} className="text-[#38EA8C]" />
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        © 2026 INFIQ SYMPOSIUM | <span style={{ color: 'var(--primary)' }}>SECURE SYSTEM ACTIVE</span>
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        POWERED BY <span style={{ color: '#fff', fontWeight: '800' }}>CSE DEPARTMENT</span>
                    </p>
                </div>
            </div>

            {/* Ambient Background Flow */}
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '50%',
                width: '80%',
                height: '30%',
                background: 'radial-gradient(circle, rgba(56, 234, 140, 0.05) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
                transform: 'translateX(-50%)'
            }} />
        </footer>
    );
};

export default Footer;
