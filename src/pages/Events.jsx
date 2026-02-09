import React from 'react';
import Events from '../components/Events';
import PageTransition from '../components/PageTransition';
import { EventPasses } from '../components/HomeSections';

const EventsPage = () => {
    return (
        <PageTransition>
            <EventPasses />
            <Events />
        </PageTransition>
    );
};

export default EventsPage;
