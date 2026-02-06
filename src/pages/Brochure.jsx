import React from 'react';
import Brochure from '../components/Brochure';
import PageTransition from '../components/PageTransition';

const BrochurePage = () => {
    return (
        <PageTransition>
            <Brochure />
        </PageTransition>
    );
};

export default BrochurePage;
