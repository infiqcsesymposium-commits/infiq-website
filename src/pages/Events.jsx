import React from 'react';
import Events from '../components/Events';
import PageTransition from '../components/PageTransition';

const EventsPage = () => {
    return (
        <PageTransition>
            <Events />
        </PageTransition>
    );
};

export default EventsPage;
