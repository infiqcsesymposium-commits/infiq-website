import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Cpu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Coordinators', path: '/coordinators' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/location' },
    ];

    return (
        <motion.nav
            id="navbar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={isScrolled ? 'scrolled' : ''}
        >
            <div className="nav-container">
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'Orbitron', flexShrink: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <Terminal size={22} className="text-[#38EA8C]" />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ position: 'absolute', top: -4, right: -4, width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 8px var(--primary)' }}
                        />
                    </div>
                    <span style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>INFIQ <span>2K26</span></span>
                </Link>

                <ul className="nav-links" style={{ flex: 1, justifyContent: 'center', gap: '3rem' }}>
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                className={location.pathname === link.path ? 'active-link' : ''}
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '800',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    color: location.pathname === link.path ? 'var(--primary)' : '#fff',
                                    opacity: location.pathname === link.path ? 1 : 0.6
                                }}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }} className="nav-actions">
                    <Link to="/register" className="btn btn-primary">
                        Register
                    </Link>
                    <div
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Menu size={28} style={{ color: 'var(--primary)' }} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mobile-nav-overlay"
                    >
                        <div className="mobile-menu-header">
                            <span className="logo" style={{ fontFamily: 'Orbitron' }}>INFIQ <span style={{ color: 'var(--primary)' }}>2K26</span></span>
                            <div
                                onClick={() => setIsMenuOpen(false)}
                                style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <X size={28} style={{ color: 'var(--primary)' }} />
                            </div>
                        </div>

                        <ul className="mobile-nav-links">
                            {navLinks.map((link, idx) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={location.pathname === link.path ? 'active-link' : ''}
                                        style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                                    >
                                        <span style={{ color: 'var(--primary)', fontSize: '1rem', fontFamily: 'Orbitron', opacity: 0.5 }}>0{idx + 1}</span>
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                style={{ marginTop: '2rem' }}
                            >
                                <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)} style={{ width: '100%', padding: '1.5rem' }}>
                                    REQUEST ACCESS NOW
                                </Link>
                                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <div className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                                    SYSTEM_STATUS: ONLINE
                                </div>
                            </motion.div>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
