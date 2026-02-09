import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import Hero from '../components/Hero';
import About from '../components/About';
import Events from '../components/Events';
import PageTransition from '../components/PageTransition';
import {
    EventCountdown,
    CategoryExplore,
    PosterLocation
} from '../components/HomeSections';
import Announcements from '../components/Announcements';
import Timeline from '../pages/Timeline'; // Reusing the timeline layout
import PosterModal from '../components/PosterModal';

const HomePage = () => {
    const [showPosterModal, setShowPosterModal] = useState(false);

    // Auto-show the poster popup when the page loads
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPosterModal(true);
        }, 1000); // Show after 1 second

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <PageTransition>
                <Hero />
                <Announcements />

                {/* About Section */}
                <div id="about-summary">
                    <About />
                </div>

                {/* Events Section */}
                <div id="events-summary">
                    <Events />
                </div>

                {/* Marquee & Countdown */}
                <EventCountdown />

                {/* Domains & Organization */}
                <CategoryExplore />

                {/* Venue & Poster */}
                <PosterLocation />

                {/* Floating View Poster Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2, duration: 0.5, type: 'spring' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPosterModal(true)}
                    style={{
                        position: 'fixed',
                        bottom: 'clamp(20px, 4vw, 30px)',
                        right: 'clamp(20px, 4vw, 30px)',
                        width: 'clamp(50px, 12vw, 60px)',
                        height: 'clamp(50px, 12vw, 60px)',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), #2dd4bf)',
                        border: '2px solid rgba(56, 234, 140, 0.3)',
                        boxShadow: '0 0 30px rgba(56, 234, 140, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        color: '#000'
                    }}
                    title="View Symposium Poster"
                >
                    <ImageIcon size={window.innerWidth < 768 ? 20 : 24} />
                </motion.button>
            </PageTransition>

            {/* Poster Modal - Moved outside PageTransition to fix centering issues */}
            <PosterModal
                isOpen={showPosterModal}
                onClose={() => setShowPosterModal(false)}
            />
        </>
    );
};

export default HomePage;
