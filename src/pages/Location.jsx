import React from 'react';
import { Navigation, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

const LocationPage = () => {
    return (
        <PageTransition>
            <section className="location-page" style={{ padding: '120px 0', background: 'transparent' }}>
                <div className="container" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span className="section-subtitle">Reach Us</span>
                        <h2 className="section-title">Location & Contact</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card"
                            style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            <div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <MapPin className="text-[#00E5FF]" size={24} /> Venue Details
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                    V.S.B College of Engineering Technical Campus <br />
                                    NH-209, Coimbatore-Pollachi Main Road, <br />
                                    Eachanari, Coimbatore, Tamil Nadu 642109
                                </p>
                            </div>

                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Mail className="text-[#00FF9C]" size={24} /> Support Channels
                                </h3>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Mail size={16} /> infiqcsesymposium@gmail.com
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Phone size={16} /> +91 80726 52321
                                    </li>
                                </ul>
                            </div>

                            <a href="https://maps.google.com/?q=VSB+College+of+Engineering+Technical+Campus" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <Navigation size={18} /> Get Live Directions
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            style={{
                                height: '500px',
                                background: '#111827',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Animated Map Placeholder / UI */}
                            <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'linear-gradient(rgba(0,0,0,0.8), transparent), url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000") center/cover' }}></div>

                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                                <div style={{ background: 'rgba(0, 229, 255, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid var(--primary)', boxShadow: '0 0 20px var(--primary-glow)' }}>
                                    <MapPin size={40} className="text-[#00E5FF]" />
                                </div>
                                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Interactive Map</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', maxWidth: '300px' }}>
                                    Visit our campus for the ultimate technical experience. Use the button below to view on Google Maps.
                                </p>
                                <a href="https://maps.google.com/?q=VSB+College+of+Engineering+Technical+Campus" target="_blank" rel="noreferrer" className="btn btn-outline">
                                    <ExternalLink size={16} style={{ marginRight: '0.8rem' }} /> View Larger Map
                                </a>
                            </div>

                            {/* Decorative Neon Lines */}
                            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '1px', height: '80%', background: 'linear-gradient(to bottom, transparent, var(--primary), transparent)', opacity: 0.2 }}></div>
                            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '1px', height: '80%', background: 'linear-gradient(to bottom, transparent, var(--primary), transparent)', opacity: 0.2 }}></div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default LocationPage;
