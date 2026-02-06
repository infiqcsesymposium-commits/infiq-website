import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import PageTransition from '../components/PageTransition';

const RegisterPage = () => {
    return (
        <PageTransition>
            <RegistrationForm />
        </PageTransition>
    );
};

export default RegisterPage;
