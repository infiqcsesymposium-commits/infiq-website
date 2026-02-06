import React, { useState, useEffect } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import PageTransition from '../components/PageTransition';
import RegistrationPopup from '../components/RegistrationPopup';
import CountdownTimer from '../components/CountdownTimer';

const RegisterPage = () => {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

    useEffect(() => {
        // Release date: Monday, February 9th, 2026 at 00:00:00
        const releaseDate = new Date('2026-02-09T00:00:00');
        const currentDate = new Date();

        setIsRegistrationOpen(currentDate >= releaseDate);
    }, []);

    return (
        <PageTransition>
            {isRegistrationOpen ? (
                <>
                    <RegistrationPopup />
                    <RegistrationForm />
                </>
            ) : (
                <CountdownTimer />
            )}
        </PageTransition>
    );
};

export default RegisterPage;
