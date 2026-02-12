import React, { useState, useEffect } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import PageTransition from '../components/PageTransition';
import CountdownTimer from '../components/CountdownTimer';
import useRegistrationStatus from '../hooks/useRegistrationStatus';

const RegisterPage = () => {
    const { isOpen: isGateOpen, loading } = useRegistrationStatus();
    const [isDatePassed, setIsDatePassed] = useState(false);

    useEffect(() => {
        // Release date: Monday, February 9th, 2026 at 00:00:00
        const releaseDate = new Date('2026-02-09T00:00:00');
        const currentDate = new Date();

        setIsDatePassed(currentDate >= releaseDate);
    }, []);

    if (loading) return <PageTransition><div style={{ color: '#fff', textAlign: 'center', marginTop: '20vh' }}>Checking System Status...</div></PageTransition>;

    // Logic: 
    // 1. If Date NOT passed -> Countdown
    // 2. If Date passed but Gate closed -> "Registration Closed"
    // 3. If both passed -> Show Form

    if (!isDatePassed) {
        return (
            <PageTransition>
                <CountdownTimer />
            </PageTransition>
        );
    }

    if (!isGateOpen) {
        return (
            <PageTransition>
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh',
                    color: '#fff', fontFamily: 'Orbitron', textAlign: 'center', gap: '1rem'
                }}>
                    <h1 style={{ fontSize: '3rem', color: '#FF5F56' }}>REGISTRATION CLOSED</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>The gateway is currently inactive. Please check back later.</p>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <>
                <RegistrationPopup />
                <RegistrationForm />
            </>
        </PageTransition>
    );
};

export default RegisterPage;
