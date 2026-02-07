import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { name: 'Updates', path: '/announcements' },
        { name: 'Coordinators', path: '/coordinators' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/location' },
    ];

    return (
        <>
            <motion.nav
                id="navbar-redesigned"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={isScrolled ? 'scrolled' : ''}
            >
                <div className="nav-floating-container">
                    {/* Logo */}
                    <Link to="/" className="nav-logo-new">
                        <motion.div
                            className="logo-icon-wrapper"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Terminal size={24} strokeWidth={2.5} />
                            <motion.div
                                className="logo-pulse"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.8, 0.3, 0.8]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                        <div className="logo-text">
                            <span className="logo-main">INFIQ</span>
                            <span className="logo-year">2K26</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <ul className="nav-links-redesigned">
                        {navLinks.map((link, idx) => {
                            const isActive = location.pathname === link.path;
                            const isHovered = hoveredLink === idx;

                            return (
                                <motion.li
                                    key={link.name}
                                    onHoverStart={() => setHoveredLink(idx)}
                                    onHoverEnd={() => setHoveredLink(null)}
                                >
                                    <Link
                                        to={link.path}
                                        className={`nav-link-item ${isActive ? 'active' : ''}`}
                                    >
                                        <span className="link-text">{link.name}</span>
                                        {(isActive || isHovered) && (
                                            <motion.div
                                                className="link-underline"
                                                layoutId={isActive ? "activeUnderline" : `hoverUnderline-${idx}`}
                                                initial={{ opacity: 0, scaleX: 0 }}
                                                animate={{ opacity: 1, scaleX: 1 }}
                                                exit={{ opacity: 0, scaleX: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>
                                </motion.li>
                            );
                        })}
                    </ul>

                    {/* Action Buttons */}
                    <div className="nav-actions-new">
                        <Link to="/register" className="nav-register-btn">
                            <Sparkles size={16} strokeWidth={2.5} />
                            <span>Register</span>
                            <ChevronRight size={16} strokeWidth={2.5} />
                        </Link>

                        <motion.button
                            className="mobile-hamburger"
                            onClick={() => setIsMenuOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Menu size={24} strokeWidth={2.5} />
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            className="mobile-overlay-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            className="mobile-menu-redesigned"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            {/* Mobile Menu Header */}
                            <div className="mobile-header">
                                <div className="mobile-logo">
                                    <Terminal size={20} />
                                    <span>INFIQ <span className="highlight">2K26</span></span>
                                </div>
                                <motion.button
                                    className="mobile-close-btn"
                                    onClick={() => setIsMenuOpen(false)}
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>

                            {/* Mobile Navigation Links */}
                            <nav className="mobile-nav-list">
                                {navLinks.map((link, idx) => {
                                    const isActive = location.pathname === link.path;

                                    return (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                        >
                                            <Link
                                                to={link.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                                            >
                                                <span className="mobile-link-number">0{idx + 1}</span>
                                                <span className="mobile-link-text">{link.name}</span>
                                                <ChevronRight size={20} className="mobile-link-icon" />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            {/* Mobile CTA */}
                            <motion.div
                                className="mobile-cta"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link
                                    to="/register"
                                    className="mobile-register-btn"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Sparkles size={18} />
                                    <span>Register Now</span>
                                </Link>

                                <div className="mobile-status">
                                    <div className="status-dot" />
                                    <span>SYSTEM ONLINE</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
