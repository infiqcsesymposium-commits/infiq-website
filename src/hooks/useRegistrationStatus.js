import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const useRegistrationStatus = () => {
    const [status, setStatus] = useState({
        isOpen: true, // Default to true or check date
        loading: true,
        access: {
            cseDept: true,
            otherDepts: true,
            outerCollege: true
        }
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "system_settings", "registration_access"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Consider open if at least one category is enabled
                const isOpen = data.cseDept || data.otherDepts || data.outerCollege;
                setStatus({
                    isOpen,
                    loading: false,
                    access: data
                });
            } else {
                // If doc doesn't exist, assume open or closed depending on requirements. 
                // Let's assume open by default if no config, or create it.
                setStatus(prev => ({ ...prev, loading: false }));
            }
        }, (error) => {
            console.error("Error fetching registration status:", error);
            setStatus(prev => ({ ...prev, loading: false }));
        });

        return () => unsubscribe();
    }, []);

    return status;
};

export default useRegistrationStatus;
