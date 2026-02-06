import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import CRMDashboard from '../components/CRMDashboard';
import AdminLogin from '../components/AdminLogin';
import PageTransition from '../components/PageTransition';
import Preloader from '../components/Preloader';

const AdminPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05060A' }}>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <PageTransition>
            {user ? <CRMDashboard /> : <AdminLogin />}
        </PageTransition>
    );
};

export default AdminPage;
