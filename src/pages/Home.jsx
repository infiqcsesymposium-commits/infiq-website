import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Events from '../components/Events';
import PageTransition from '../components/PageTransition';
import {
    EventPasses,
    EventCountdown,
    CategoryExplore,
    PosterLocation
} from '../components/HomeSections';
import Timeline from '../pages/Timeline'; // Reusing the timeline layout

const HomePage = () => {
    return (
        <PageTransition>
            <Hero />

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

            {/* Registration / Passes */}
            <EventPasses />


            {/* Domains & Organization */}
            <CategoryExplore />

            {/* Venue & Poster */}
            <PosterLocation />
        </PageTransition>
    );
};

export default HomePage;
