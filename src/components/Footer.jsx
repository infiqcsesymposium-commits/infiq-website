import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Calendar, Terminal, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Footer = () => {
    const quickLinks = [
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Updates', path: '/announcements' },
        { name: 'Coordinators', path: '/coordinators' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Location', path: '/location' },
    ];

    const socialLinks = [
        { Icon: Instagram, url: '#', name: 'Instagram' },
        { Icon: Facebook, url: '#', name: 'Facebook' },
        { Icon: Twitter, url: '#', name: 'Twitter' },
        { Icon: Mail, url: 'mailto:info@infiq.com', name: 'Email' },
    ];

    const contactInfo = [
        { name: 'Subasanjeev S', phone: '+91 9787668997', Icon: Phone },
        { name: 'Diva S', phone: '+91 8072652321', Icon: Phone },
    ];

    return (
        <footer style={{
            background: 'linear-gradient(180deg, #08090F 0%, #06070B 100%)',
            paddingTop: '100px',
            paddingBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '100px'
        }}>
            {/* Animated Top Border */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(56, 234, 140, 0.5), transparent)',
            }}>
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: '200px',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                        boxShadow: '0 0 20px var(--primary)'
                    }}
                />
            </div>

            {/* Floating Container */}
            <div className="container" style={{ maxWidth: '1280px', position: 'relative', zIndex: 1 }}>

                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>

                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <Logo size={32} />
                            </div>
                        </Link>

                        <p style={{
                            color: 'var(--text-muted)',
                            lineHeight: '1.8',
                            fontSize: '0.95rem',
                            marginBottom: '2rem',
                            maxWidth: '320px'
                        }}>
                            The ultimate tech symposium pushing the boundaries of innovation. Organized by the Department of CSE.
                        </p>

                        {/* Event Info Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            background: 'rgba(56, 234, 140, 0.08)',
                            border: '1px solid rgba(56, 234, 140, 0.2)',
                            borderRadius: '100px',
                            marginBottom: '2rem'
                        }}>
                            <Calendar size={16} color="var(--primary)" />
                            <span style={{
                                color: '#fff',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                fontFamily: 'Orbitron, monospace'
                            }}>
                                FEB 2026
                            </span>
                        </div>

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {socialLinks.map(({ Icon, url, name }) => (
                                <motion.a
                                    key={name}
                                    href={url}
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'var(--text-muted)',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(56, 234, 140, 0.1)';
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                        e.currentTarget.style.color = 'var(--primary)';
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 234, 140, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = 'var(--text-muted)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <Icon size={18} strokeWidth={2} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 style={{
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            letterSpacing: '2px',
                            color: 'var(--primary)',
                            marginBottom: '2rem',
                            textTransform: 'uppercase',
                            fontFamily: 'Orbitron, sans-serif'
                        }}>
                            Quick Links
                        </h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0 }}>
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.95rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#fff';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <span style={{
                                            color: 'var(--primary)',
                                            fontSize: '1.2rem',
                                            fontWeight: '300'
                                        }}>→</span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 style={{
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            letterSpacing: '2px',
                            color: 'var(--primary)',
                            marginBottom: '2rem',
                            textTransform: 'uppercase',
                            fontFamily: 'Orbitron, sans-serif'
                        }}>
                            Get in Touch
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {contactInfo.map(({ name, phone, Icon }) => (
                                <div
                                    key={name}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(56, 234, 140, 0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(56, 234, 140, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                                    }}
                                >
                                    <div style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '10px',
                                        background: 'rgba(56, 234, 140, 0.1)',
                                        border: '1px solid rgba(56, 234, 140, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary)',
                                        flexShrink: 0
                                    }}>
                                        <Icon size={18} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-muted)',
                                            textTransform: 'uppercase',
                                            fontWeight: '700',
                                            margin: '0 0 0.25rem 0',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {name}
                                        </p>
                                        <a
                                            href={`tel:${phone}`}
                                            style={{
                                                fontSize: '0.95rem',
                                                color: '#fff',
                                                fontWeight: '600',
                                                margin: 0,
                                                textDecoration: 'none',
                                                fontFamily: 'monospace'
                                            }}
                                        >
                                            {phone}
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {/* Location Badge */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'rgba(124, 58, 237, 0.05)',
                                border: '1px solid rgba(124, 58, 237, 0.2)',
                                borderRadius: '12px',
                                marginTop: '0.5rem'
                            }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '10px',
                                    background: 'rgba(124, 58, 237, 0.1)',
                                    border: '1px solid rgba(124, 58, 237, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#7C3AED',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p style={{
                                        fontSize: '0.7rem',
                                        color: '#7C3AED',
                                        textTransform: 'uppercase',
                                        fontWeight: '700',
                                        margin: '0 0 0.25rem 0',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Venue
                                    </p>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: '#fff',
                                        fontWeight: '500',
                                        margin: 0,
                                        lineHeight: '1.5'
                                    }}>
                                        VSBEC, Coimbatore
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    style={{
                        paddingTop: '3rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        alignItems: 'center'
                    }}
                >
                    {/* Copyright */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            background: 'var(--primary)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px var(--primary)',
                            animation: 'pulse-dot 2s infinite'
                        }} />
                        <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            letterSpacing: '0.5px',
                            fontFamily: 'monospace'
                        }}>
                            © 2026 INFIQ • <span style={{ color: 'var(--primary)' }}>All Systems Operational</span>
                        </p>
                    </div>

                    {/* Powered By */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={14} color="var(--primary)" />
                        <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            fontFamily: 'monospace'
                        }}>
                            Powered by{' '}
                            <a
                                href="https://averqon.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: '#fff',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#fff';
                                }}
                            >
                                Averqon
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Ambient Background Effects */}
            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                height: '300px',
                background: 'radial-gradient(ellipse at bottom, rgba(56, 234, 140, 0.08) 0%, transparent 60%)',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: '250px',
                height: '250px',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
        </footer>
    );
};

export default Footer;
