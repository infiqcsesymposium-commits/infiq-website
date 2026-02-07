import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Trophy,
    TrendingUp, Activity, Search,
    Filter, Download, MoreHorizontal,
    CheckCircle, AlertCircle, Clock, LogOut, X, ChevronDown, Edit2, Save,
    Plus, Trash2, Bell, Megaphone, Info, Settings, DollarSign
} from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc, addDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import * as XLSX from 'xlsx';

const CRMDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [eventFilter, setEventFilter] = useState('ALL');

    // modal state
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // limit edit state
    const [editingEvent, setEditingEvent] = useState(null);
    const [newLimit, setNewLimit] = useState("");
    const [eventLimits, setEventLimits] = useState({});

    // Announcement states
    const [announcements, setAnnouncements] = useState([]);
    const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
    const [currentAnn, setCurrentAnn] = useState({
        title: "",
        message: "",
        category: "General",
        priority: "NORMAL",
        eventName: "ALL",
        isActive: true,
        expiresAt: ""
    });
    const [isEditingAnn, setIsEditingAnn] = useState(false);
    const [userRole, setUserRole] = useState('VOLUNTEER'); // Default low access
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Event Slots State
    const [eventSlots, setEventSlots] = useState([]);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState({
        eventName: "",
        date: "",
        reportTime: "",
        startTime: "",
        endTime: "",
        venue: "",
        coordinator: ""
    });
    const [isEditingSlot, setIsEditingSlot] = useState(false);

    // Prize Winners State
    const [prizeWinners, setPrizeWinners] = useState([]);
    const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    const [currentWinner, setCurrentWinner] = useState({
        eventName: "",
        position: "FIRST",
        teamName: "",
        prize: "",
        remarks: "",
        published: false
    });
    const [isEditingWinner, setIsEditingWinner] = useState(false);

    // Fee Configuration State
    const [feeConfigs, setFeeConfigs] = useState([]);
    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
    const [currentFee, setCurrentFee] = useState({
        category: "EXTERNAL_PARTICIPANT",
        feePerStudent: 250,
        calculationType: "PER_STUDENT",
        priorityAccess: false,
        isActive: true
    });
    const [isEditingFee, setIsEditingFee] = useState(false);

    // Events definition with classification
    const [events, setEvents] = useState([
        { id: 1, name: "Paper Presentation", type: "TECHNICAL", tag: "RESEARCH", registered: 0, limit: 15, status: "OPEN" },
        { id: 2, name: "Project Expo", type: "TECHNICAL", tag: "INNOVATION", registered: 0, limit: 15, status: "OPEN" },
        { id: 3, name: "Code Debugging", type: "TECHNICAL", tag: "CODE", registered: 0, limit: 15, status: "OPEN" },
        { id: 4, name: "Web Designing", type: "TECHNICAL", tag: "DEV", registered: 0, limit: 15, status: "OPEN" },
        { id: 5, name: "Technical Quiz", type: "TECHNICAL", tag: "QUIZ", registered: 0, limit: 15, status: "OPEN" },
        { id: 6, name: "Esports", type: "NON-TECHNICAL", tag: "GAMING", registered: 0, limit: 15, status: "OPEN" },
        { id: 7, name: "Connections", type: "NON-TECHNICAL", tag: "FUN", registered: 0, limit: 15, status: "OPEN" },
        { id: 8, name: "Multimedia Editing", type: "NON-TECHNICAL", tag: "CREATIVE", registered: 0, limit: 15, status: "OPEN" },
        { id: 9, name: "Photography", type: "NON-TECHNICAL", tag: "ART", registered: 0, limit: 15, status: "OPEN" },
        { id: 10, name: "Short Film", type: "NON-TECHNICAL", tag: "CINEMA", registered: 0, limit: 15, status: "OPEN" },
        { id: 11, name: "Ideathon", type: "TECHNICAL", tag: "HACK", registered: 0, limit: 15, status: "OPEN" }
    ]);

    // Fetch limits from event_settings collection
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "event_settings"), (snapshot) => {
            const limits = {};
            snapshot.docs.forEach(doc => {
                limits[doc.id] = doc.data().limit;
            });
            setEventLimits(limits);
        });

        const unsubscribeFees = onSnapshot(collection(db, "fee_config"), (snapshot) => {
            const fees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFeeConfigs(fees);
        });

        return () => {
            unsubscribe();
            unsubscribeFees();
        };
    }, []);

    useEffect(() => {
        // Subscribe to registrations
        const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRegistrations(data);

            // Update event counts - Only count APPROVED registrations for slots
            const counts = {};
            data.forEach(reg => {
                if (reg.status === 'APPROVED') {
                    const evt = reg.eventName;
                    counts[evt] = (counts[evt] || 0) + 1;
                }
            });

            setEvents(prev => prev.map(ev => {
                const count = counts[ev.name] || 0;
                // Use dynamic limit if available, else default to 15
                // Note: We use eventLimits from the closure, but also rely on the dependency to re-run
                const currentLimit = eventLimits[ev.name] !== undefined ? eventLimits[ev.name] : 15;

                let status = "OPEN";
                if (count >= currentLimit) status = "CLOSED";
                else if (count >= currentLimit * 0.8) status = "FILLING FAST";

                return { ...ev, registered: count, limit: currentLimit, status };
            }));

            setLoading(false);
        }, (error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [eventLimits]); // Re-run when limits change

    useEffect(() => {
        const handleStatusChange = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);
        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    // Fetch User Role
    useEffect(() => {
        const fetchRole = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, "admins", auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role || 'VOLUNTEER');
                } else {
                    // Fallback for demo or if doc doesn't exist (e.g. initial set up)
                    // If you want everyone who can log in to be admin initially:
                    setUserRole('ADMIN');
                }
            }
        };
        fetchRole();
    }, []);

    // Fetch announcements
    useEffect(() => {
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAnnouncements(data);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Event Slots
    useEffect(() => {
        const q = query(collection(db, "event_slots"), orderBy("eventName", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEventSlots(data);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Prize Winners
    useEffect(() => {
        const q = query(collection(db, "prize_winners"), orderBy("eventName", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrizeWinners(data);
        });
        return () => unsubscribe();
    }, []);

    const handleAnnChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentAnn(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveAnn = async (e) => {
        e.preventDefault();
        try {
            if (isEditingAnn) {
                const annRef = doc(db, "announcements", currentAnn.id);
                await updateDoc(annRef, {
                    ...currentAnn,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, "announcements"), {
                    ...currentAnn,
                    createdAt: serverTimestamp()
                });
            }
            setIsAnnModalOpen(false);
            resetAnnForm();
        } catch (error) {
            console.error("Error saving announcement:", error);
            alert("Failed to save announcement");
        }
    };

    const handleDeleteAnn = async (id) => {
        if (userRole !== 'ADMIN') {
            alert("Insufficient permissions. Only Admins can delete announcements.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                await deleteDoc(doc(db, "announcements", id));
            } catch (error) {
                console.error("Error deleting announcement:", error);
                alert("Failed to delete announcement");
            }
        }
    };

    const openAnnModal = (ann = null) => {
        if (ann) {
            setCurrentAnn(ann);
            setIsEditingAnn(true);
        } else {
            resetAnnForm();
            setIsEditingAnn(false);
        }
        setIsAnnModalOpen(true);
    };

    const resetAnnForm = () => {
        setCurrentAnn({
            title: "",
            message: "",
            category: "General",
            priority: "NORMAL",
            eventName: "ALL",
            isActive: true,
            expiresAt: ""
        });
    };

    // Slot Handlers
    const handleSlotChange = (e) => {
        const { name, value } = e.target;
        setCurrentSlot(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSlot = async (e) => {
        e.preventDefault();
        try {
            if (isEditingSlot) {
                await updateDoc(doc(db, "event_slots", currentSlot.id), {
                    ...currentSlot,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, "event_slots"), {
                    ...currentSlot,
                    createdAt: serverTimestamp()
                });
            }
            setIsSlotModalOpen(false);
            resetSlotForm();
        } catch (error) {
            console.error("Error saving slot:", error);
            alert("Failed to save slot");
        }
    };

    const handleDeleteSlot = async (id) => {
        if (userRole !== 'ADMIN') return alert("Admin access required.");
        if (window.confirm("Delete this slot?")) {
            await deleteDoc(doc(db, "event_slots", id));
        }
    };

    const openSlotModal = (slot = null) => {
        if (slot) {
            setCurrentSlot(slot);
            setIsEditingSlot(true);
        } else {
            resetSlotForm();
            setIsEditingSlot(false);
        }
        setIsSlotModalOpen(true);
    };

    const resetSlotForm = () => {
        setCurrentSlot({
            eventName: "", date: "", reportTime: "",
            startTime: "", endTime: "", venue: "", coordinator: ""
        });
    };

    // Winner Handlers
    const handleWinnerChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentWinner(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveWinner = async (e) => {
        e.preventDefault();
        try {
            if (isEditingWinner) {
                await updateDoc(doc(db, "prize_winners", currentWinner.id), {
                    ...currentWinner,
                    updatedAt: serverTimestamp()
                });
            } else {
                const winnerRef = await addDoc(collection(db, "prize_winners"), {
                    ...currentWinner,
                    createdAt: serverTimestamp()
                });

                // Auto Announcement if published
                if (currentWinner.published) {
                    await addDoc(collection(db, "announcements"), {
                        title: `🎉 Results Published: ${currentWinner.eventName}`,
                        message: `The results for ${currentWinner.eventName} are now official! Congratulations to all winners.`,
                        category: "Update",
                        priority: "IMPORTANT",
                        eventName: currentWinner.eventName,
                        isActive: true,
                        createdAt: serverTimestamp()
                    });
                }
            }
            setIsWinnerModalOpen(false);
            resetWinnerForm();
        } catch (error) {
            console.error("Error saving winner:", error);
            alert("Failed to save winner");
        }
    };

    const handleDeleteWinner = async (id) => {
        if (userRole !== 'ADMIN') return alert("Admin access required.");
        if (window.confirm("Delete this result?")) {
            await deleteDoc(doc(db, "prize_winners", id));
        }
    };

    const openWinnerModal = (winner = null) => {
        if (winner) {
            setCurrentWinner(winner);
            setIsEditingWinner(true);
        } else {
            resetWinnerForm();
            setIsEditingWinner(false);
        }
        setIsWinnerModalOpen(true);
    };

    const resetWinnerForm = () => {
        setCurrentWinner({
            eventName: "", position: "FIRST", teamName: "",
            prize: "", remarks: "", published: false
        });
    };

    // Filter logic helper
    const getEvType = (name) => events.find(e => e.name === name)?.type || 'TECHNICAL';

    // Effect to handle filtering
    useEffect(() => {
        let result = registrations;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(reg =>
                reg.teamName?.toLowerCase().includes(lowerTerm) ||
                reg.studentName?.toLowerCase().includes(lowerTerm) ||
                reg.registerNumber?.toLowerCase().includes(lowerTerm) ||
                reg.collegeName?.toLowerCase().includes(lowerTerm) ||
                reg.email?.toLowerCase().includes(lowerTerm) ||
                (reg.teamMembers && reg.teamMembers.some(m => m.toLowerCase().includes(lowerTerm)))
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(reg => (reg.status || 'PENDING') === statusFilter);
        }

        if (eventFilter !== 'ALL') {
            result = result.filter(reg => reg.eventName === eventFilter);
        }

        // Additional category filter for new views if needed
        setFilteredRegistrations(result);
    }, [registrations, searchTerm, statusFilter, eventFilter]);


    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredRegistrations.map(reg => ({
            "Team Name": reg.teamName,
            "Lead Student": reg.studentName,
            "Register No": reg.registerNumber,
            "Email": reg.email,
            "Phone": reg.phoneNumber,
            "Event": reg.eventName,
            "Category": reg.category,
            "College": reg.collegeName,
            "Department": reg.department,
            "Status": reg.status || 'PENDING',
            "AmountPaid": reg.totalAmount || 0,
            "Registered At": reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleString() : new Date(reg.createdAt).toLocaleString()
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "MasterData");
        XLSX.writeFile(workbook, `INFIQ_Master_Export_${new Date().toLocaleDateString()}.xlsx`);
    };

    const exportEventWise = () => {
        const workbook = XLSX.utils.book_new();
        const eventNames = [...new Set(registrations.map(r => r.eventName))];

        eventNames.forEach(evName => {
            const evData = registrations.filter(r => r.eventName === evName);
            const sheetData = [];

            evData.forEach(reg => {
                // Add Lead
                sheetData.push({
                    "Team": reg.teamName || 'N/A',
                    "Student Name": reg.studentName,
                    "Role": "Leader",
                    "Reg No / College": reg.registerNumber || reg.collegeName,
                    "Dept": reg.department,
                    "Phone": reg.phoneNumber,
                    "Status": reg.status
                });

                // Add Members
                if (reg.teamMembers) {
                    reg.teamMembers.forEach(member => {
                        sheetData.push({
                            "Team": reg.teamName || 'N/A',
                            "Student Name": member,
                            "Role": "Member",
                            "Reg No / College": "—",
                            "Dept": reg.department,
                            "Phone": "—",
                            "Status": reg.status
                        });
                    });
                }
            });

            const ws = XLSX.utils.json_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(workbook, ws, evName.substring(0, 31));
        });
        XLSX.writeFile(workbook, "INFIQ_EventWise_Detailed.xlsx");
    };

    const exportFlattenedMembers = () => {
        const flattened = [];
        registrations.forEach(reg => {
            // Add Leader
            flattened.push({
                "Student Name": reg.studentName,
                "Team Name": reg.teamName || 'Individual',
                "Event": reg.eventName,
                "Type": getEvType(reg.eventName),
                "Category": reg.category,
                "College": reg.collegeName,
                "Dept": reg.department,
                "Role": "LEADER",
                "Phone": reg.phoneNumber,
                "Status": reg.status
            });

            // Add Members
            if (reg.teamMembers) {
                reg.teamMembers.forEach(m => {
                    flattened.push({
                        "Student Name": m,
                        "Team Name": reg.teamName || 'Individual',
                        "Event": reg.eventName,
                        "Type": getEvType(reg.eventName),
                        "Category": reg.category,
                        "College": reg.collegeName,
                        "Dept": reg.department,
                        "Role": "MEMBER",
                        "Phone": "—",
                        "Status": reg.status
                    });
                });
            }
        });

        const worksheet = XLSX.utils.json_to_sheet(flattened);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "AllStudents");
        XLSX.writeFile(workbook, `INFIQ_All_Students_${new Date().toLocaleDateString()}.xlsx`);
    };

    const exportCollegeWise = () => {
        const collegeStats = registrations.reduce((acc, curr) => {
            const col = curr.collegeName || "Internal";
            if (!acc[col]) acc[col] = { college: col, students: 0, technical: 0, nonTechnical: 0, revenue: 0 };
            acc[col].students += (curr.teamCount || 1);
            if (getEvType(curr.eventName) === 'TECHNICAL') acc[col].technical++;
            else acc[col].nonTechnical++;
            acc[col].revenue += (curr.totalAmount || 0);
            return acc;
        }, {});

        const worksheet = XLSX.utils.json_to_sheet(Object.values(collegeStats));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CollegeReport");
        XLSX.writeFile(workbook, "INFIQ_College_Summary.xlsx");
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedRegistration) return;
        try {
            const regRef = doc(db, "registrations", selectedRegistration.id);
            await updateDoc(regRef, {
                status: newStatus
            });
            // Local update strictly for UI responsiveness (though onSnapshot will handle it)
            setSelectedRegistration(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const openEditLimit = (ev) => {
        setEditingEvent(ev);
        setNewLimit(ev.limit);
    };

    const saveLimit = async () => {
        if (!editingEvent || !newLimit) return;
        try {
            // Save to event_settings collection
            await setDoc(doc(db, "event_settings", editingEvent.name), {
                limit: parseInt(newLimit)
            }, { merge: true });

            setEditingEvent(null);
        } catch (error) {
            console.error("Error updating limit:", error);
            alert("Failed to update limit");
        }
    };

    const openModal = (reg) => {
        setSelectedRegistration(reg);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRegistration(null);
    };

    // Fee Handlers
    const openFeeModal = (fee = null) => {
        if (fee) {
            setCurrentFee(fee);
            setIsEditingFee(true);
        } else {
            setCurrentFee({
                category: "EXTERNAL_PARTICIPANT",
                feePerStudent: 250,
                calculationType: "PER_STUDENT",
                priorityAccess: false,
                isActive: true
            });
            setIsEditingFee(false);
        }
        setIsFeeModalOpen(true);
    };

    const handleFeeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentFee(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'feePerStudent' ? parseInt(value) || 0 : value)
        }));
    };

    const handleSaveFee = async (e) => {
        e.preventDefault();
        try {
            if (isEditingFee) {
                const feeRef = doc(db, "fee_config", currentFee.id);
                await updateDoc(feeRef, { ...currentFee, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, "fee_config"), { ...currentFee, createdAt: serverTimestamp() });
            }
            setIsFeeModalOpen(false);
        } catch (error) {
            console.error("Error saving fee config:", error);
            alert("Failed to save fee configuration");
        }
    };

    const handleDeleteFee = async (id) => {
        if (window.confirm("Are you sure you want to delete this fee configuration?")) {
            try {
                await deleteDoc(doc(db, "fee_config", id));
            } catch (error) {
                console.error("Error deleting fee config:", error);
            }
        }
    };

    // Stats
    const totalRegistrations = registrations.length;

    // Improved participant counting: Group by unique registration session (email + paymentId) 
    // to avoid overcounting people who registered for multiple events.
    const uniqueSessions = new Set();
    const uniqueParticipantsCount = registrations.reduce((acc, curr) => {
        const sessionKey = `${curr.email}_${curr.paymentId}`;
        if (!uniqueSessions.has(sessionKey)) {
            uniqueSessions.add(sessionKey);
            return acc + (curr.teamCount || 1);
        }
        return acc;
    }, 0);

    const totalParticipants = uniqueParticipantsCount;

    // Revenue: Sum totalAmount from unique sessions only
    const uniqueRevenueSessions = new Set();
    const totalRevenue = registrations.reduce((acc, curr) => {
        const sessionKey = `${curr.email}_${curr.paymentId}`;
        if (!uniqueRevenueSessions.has(sessionKey)) {
            uniqueRevenueSessions.add(sessionKey);
            return acc + (curr.totalAmount || 0);
        }
        return acc;
    }, 0);
    const eventsFull = events.filter(e => e.status === "CLOSED").length;

    // Additional Metrics for Dashboard
    const freeTeamsCount = registrations.filter(r => r.category === 'CSE_ONLY' || (r.totalAmount === 0)).length;
    const externalTeamsCount = registrations.filter(r => r.category === 'OUTER').length;
    const otherDeptTeamsCount = registrations.filter(r => r.category === 'OTHER_DEPT').length;

    return (
        <section style={{ padding: '0', height: '100vh', background: '#05060A', width: '100%', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
            <style>{`
                /* Hide scrollbars for the whole CRM */
                * {
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE and Edge */
                }
                *::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                }

                .crm-layout { 
                    height: 100vh; 
                    overflow: hidden;
                }

                .crm-main-scroll {
                    height: 100vh;
                    overflow-y: auto;
                    padding: 2.5rem;
                    width: 100%;
                }

                @media (max-width: 1024px) {
                    .crm-layout { grid-template-columns: 1fr !important; }
                    .crm-sidebar { 
                        position: fixed !important; 
                        left: -300px; 
                        top: 0; 
                        bottom: 0; 
                        z-index: 2000; 
                        transition: left 0.3s ease; 
                        width: 280px !important;
                        height: 100vh !important;
                        border-right: 1px solid rgba(56, 234, 140, 0.2);
                    }
                    .crm-sidebar.open { left: 0 !important; }
                    .sidebar-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.8);
                        z-index: 1999;
                        backdrop-filter: blur(5px);
                    }
                    .mobile-toggle { display: flex !important; }
                    .crm-main-scroll { padding: 1.5rem !important; }
                }

                .crm-sidebar { 
                    height: 100vh; 
                    position: sticky; 
                    top: 0; 
                    border-right: 1px solid rgba(255,255,255,0.05);
                }
            `}</style>

            {/* Connectivity Banner */}
            <AnimatePresence>
                {!isOnline && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ background: '#FF5F56', color: '#fff', textAlign: 'center', padding: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '8px', margin: '0 2rem 1rem' }}
                    >
                        <AlertCircle size={16} /> YOU ARE CURRENTLY OFFLINE. DATA UPDATES ARE PAUSED.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Mobile Toggle Button */}
            <button
                className="mobile-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{
                    display: 'none',
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    border: 'none',
                    color: '#000',
                    zIndex: 1500,
                    boxShadow: '0 4px 15px rgba(56, 234, 140, 0.4)',
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <LayoutDashboard size={24} />
            </button>

            <div className="crm-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', maxWidth: '100%', minHeight: '100vh', background: 'rgba(255,255,255,0.01)' }}>

                {/* Sidebar Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="sidebar-overlay"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar Navigation */}
                <aside className={`crm-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', borderRadius: '0', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', background: 'rgba(5, 6, 10, 0.8)' }}>
                        <div style={{ marginBottom: '2.5rem', padding: '0.5rem', borderBottom: '1px solid rgba(56, 234, 140, 0.1)' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.5rem', fontWeight: '800' }}>Administrative Hub</div>
                            <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.5px' }}>MASTER_REGISTRY</div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Share Tech Mono', marginTop: '4px' }}>ACCESS_LEVEL: {userRole}</div>
                        </div>

                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
                            { id: 'all_participants', icon: Users, label: 'All Participants' },
                            { id: 'tech_events', icon: Activity, label: 'Technical Events' },
                            { id: 'non_tech_events', icon: Trophy, label: 'Non-Tech' },
                            { id: 'payments', icon: DollarSign, label: 'Payments' },
                            { id: 'reports', icon: Download, label: 'Reports & Export' },
                            { id: 'slots', icon: Clock, label: 'Event Timings' },
                            { id: 'announcements', icon: Megaphone, label: 'Broadcasts' },
                            { id: 'fees', icon: Settings, label: 'Fee Config' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px',
                                    background: activeTab === item.id ? 'rgba(56, 234, 140, 0.1)' : 'transparent',
                                    border: activeTab === item.id ? '1px solid rgba(56, 234, 140, 0.2)' : '1px solid transparent',
                                    color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontWeight: activeTab === item.id ? '600' : '400'
                                }}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}

                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '1rem 0' }} />

                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px',
                                background: 'transparent', border: 'none', color: '#FF5F56',
                                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="crm-main-scroll">
                    <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Global Search Header bar - Hidden on Dashboard, Config, Reports */}
                        {['all_participants', 'tech_events', 'non_tech_events', 'payments'].includes(activeTab) && (
                            <div className="glass-card g-search-header" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <style>{`
                                @media (max-width: 768px) {
                                    .g-search-header { flex-direction: column !important; align-items: stretch !important; }
                                    .g-search-header select { width: 100% !important; }
                                }
                            `}</style>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text" placeholder="Global Search: Name, Team, Member, College, Reg No..."
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', width: '160px' }}>
                                        <option value="ALL">All Events</option>
                                        {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                                    </select>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', width: '140px' }}>
                                        <option value="ALL">All Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>
                                {searchTerm && <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: '#FF5F56', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'center' }}>Clear</button>}
                            </div>
                        )}
                        {activeTab === 'dashboard' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>System Overview</h2>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back, {userRole}</div>
                                </div>


                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Students</div>
                                        <div style={{ fontSize: '1.8rem', color: '#fff', fontWeight: '900' }}>{totalParticipants}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>Across {totalRegistrations} entries</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tech Teams</div>
                                        <div style={{ fontSize: '1.8rem', color: 'var(--neon-blue)', fontWeight: '900' }}>{registrations.filter(r => getEvType(r.eventName) === 'TECHNICAL').length}</div>
                                        <div style={{ fontSize: '0.7rem' }}>Technical Events</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Non-Tech</div>
                                        <div style={{ fontSize: '1.8rem', color: 'var(--neon-pink)', fontWeight: '900' }}>{registrations.filter(r => getEvType(r.eventName) === 'NON-TECHNICAL').length}</div>
                                        <div style={{ fontSize: '0.7rem' }}>Individual/Group</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>External</div>
                                        <div style={{ fontSize: '1.8rem', color: '#FFBD2E', fontWeight: '900' }}>{registrations.filter(r => r.category === 'OUTER').length}</div>
                                        <div style={{ fontSize: '0.7rem' }}>Outer Colleges</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Collection</div>
                                        <div style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: '900' }}>₹{totalRevenue}</div>
                                        <div style={{ fontSize: '0.7rem' }}>Total Fees Received</div>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: '#fff', marginTop: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <TrendingUp size={20} color="#FFBD2E" /> Fee Logic Console
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {feeConfigs.length === 0 ? (
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No fee rules configured. Go to Configuration tab.</div>
                                        ) : (
                                            feeConfigs.filter(f => f.isActive).map(f => (
                                                <div key={f.id} style={{
                                                    background: f.category === 'EXTERNAL_PARTICIPANT' ? 'rgba(255, 189, 46, 0.05)' : f.category === 'CSE_AI_DEPT_STUDENT' ? 'rgba(0, 229, 255, 0.05)' : 'rgba(56, 234, 140, 0.05)',
                                                    padding: '1.5rem', borderRadius: '16px',
                                                    border: `1px solid ${f.category === 'EXTERNAL_PARTICIPANT' ? 'rgba(255, 189, 46, 0.2)' : f.category === 'CSE_AI_DEPT_STUDENT' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(56, 234, 140, 0.2)'}`
                                                }}>
                                                    <div style={{ color: f.category === 'EXTERNAL_PARTICIPANT' ? '#FFBD2E' : f.category === 'CSE_AI_DEPT_STUDENT' ? 'var(--neon-blue)' : 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{f.category}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                        <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>₹{f.feePerStudent}</span>
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ {f.calculationType === 'FREE' ? 'Free Entry' : 'Per Student'}</span>
                                                    </div>
                                                    {f.priorityAccess && <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem' }}>⭐ Priority Access Enabled</div>}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                    <div className="glass-card" style={{ padding: '2rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Free Registrations</div>
                                        <div style={{ fontSize: '2rem', color: 'var(--neon-blue)', fontWeight: 'bold' }}>{freeTeamsCount}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Internal Teams</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '2rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>External Teams</div>
                                        <div style={{ fontSize: '2rem', color: '#FFBD2E', fontWeight: 'bold' }}>{externalTeamsCount}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Outer College</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '2rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Other Dept Teams</div>
                                        <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 'bold' }}>{otherDeptTeamsCount}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Non-CSE Internal</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {
                            activeTab === 'all_participants' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Master Registry</h2>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button onClick={handleExport} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download size={18} /> Export</button>
                                        </div>
                                    </div>

                                    {/* Smart Filters Removed for Global Search */}

                                    <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Name</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>College & Dept</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Category</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Event (Type)</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Team</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Fee</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Status</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRegistrations.map(reg => (
                                                    <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <td style={{ padding: '1rem', color: '#fff', fontWeight: '600' }}>{reg.studentName}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <div>{reg.collegeName || 'VSBCETC'}</div>
                                                            <div style={{ fontSize: '0.7rem' }}>{reg.department} ({reg.year})</div>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ color: reg.category === 'OUTER' ? '#FFBD2E' : 'var(--primary)' }}>{reg.category}</span>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <div style={{ color: '#fff' }}>{reg.eventName}</div>
                                                            <div style={{ fontSize: '0.7rem', color: getEvType(reg.eventName) === 'TECHNICAL' ? 'var(--neon-blue)' : 'var(--neon-pink)' }}>{getEvType(reg.eventName)}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>{reg.teamName || '—'}</td>
                                                        <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹{reg.totalAmount || 0}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ padding: '4px 8px', borderRadius: '4px', background: reg.status === 'APPROVED' ? 'rgba(56,234,140,0.1)' : 'rgba(255,189,46,0.1)', color: reg.status === 'APPROVED' ? 'var(--primary)' : '#FFBD2E' }}>
                                                                {reg.status || 'PENDING'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}><button onClick={() => openModal(reg)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }

                        {/* Technical Events View */}
                        {
                            activeTab === 'tech_events' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Technical Team Portal</h2>
                                        <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '100px', color: 'var(--neon-blue)', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                                            {registrations.filter(r => getEvType(r.eventName) === 'TECHNICAL' && r.status === 'APPROVED').length} Approved Teams
                                        </div>
                                    </div>

                                    <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(56,234,140,0.02)' }}>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Team Name</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Event</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Members</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Category</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Fee</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Status</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRegistrations.filter(r => getEvType(r.eventName) === 'TECHNICAL').map(reg => (
                                                    <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <td style={{ padding: '1rem', color: 'var(--neon-blue)', fontWeight: 'bold' }}>{reg.teamName}</td>
                                                        <td style={{ padding: '1rem', color: '#fff' }}>{reg.eventName}</td>
                                                        <td style={{ padding: '1rem' }}><span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>{reg.teamCount || 1} Members</span></td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ color: reg.category === 'OUTER' ? '#FFBD2E' : 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>{reg.category}</span>
                                                        </td>
                                                        <td style={{ padding: '1rem', color: 'var(--primary)' }}>₹{reg.totalAmount || 0}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ color: reg.status === 'APPROVED' ? 'var(--primary)' : '#FFBD2E' }}>{reg.status || 'PENDING'}</span>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <button onClick={() => openModal(reg)} style={{ background: 'none', border: 'none', color: 'var(--neon-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                <MoreHorizontal size={18} /> View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }

                        {/* Non-Technical View */}
                        {
                            activeTab === 'non_tech_events' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Non-Technical Entries</h2>
                                    <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,46,223,0.02)' }}>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Participant</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Event</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>College</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Dept</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Fee</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Status</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRegistrations.filter(r => getEvType(r.eventName) === 'NON-TECHNICAL').map(reg => (
                                                    <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <td style={{ padding: '1rem', color: 'var(--neon-pink)', fontWeight: 'bold' }}>{reg.studentName}</td>
                                                        <td style={{ padding: '1rem', color: '#fff' }}>{reg.eventName}</td>
                                                        <td style={{ padding: '1rem' }}>{reg.collegeName || 'VSBCETC'}</td>
                                                        <td style={{ padding: '1rem' }}>{reg.department}</td>
                                                        <td style={{ padding: '1rem', color: 'var(--primary)' }}>₹{reg.totalAmount || 0}</td>
                                                        <td style={{ padding: '1rem' }}>{reg.status || 'PENDING'}</td>
                                                        <td style={{ padding: '1rem' }}><button onClick={() => openModal(reg)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }

                        {/* Payment Management */}
                        {
                            activeTab === 'payments' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Unified Payment Ledger</h2>
                                        <div style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '900' }}>Total: ₹{totalRevenue}</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(56,234,140,0.05)' }}>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Reference ID</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Participant / Team</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Event</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Amount</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Mode</th>
                                                    <th style={{ padding: '1.2rem', color: '#fff' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {registrations.map(reg => (
                                                    <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <td style={{ padding: '1rem', color: 'var(--neon-blue)', fontFamily: 'monospace' }}>{reg.paymentId || 'FREE-ENTRY'}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <div style={{ color: '#fff' }}>{reg.teamName || reg.studentName}</div>
                                                            <div style={{ fontSize: '0.7rem' }}>Leader: {reg.studentName}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>{reg.eventName}</td>
                                                        <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹{reg.totalAmount || 0}</td>
                                                        <td style={{ padding: '1rem' }}>{reg.totalAmount > 0 ? 'UPI / Online' : '—'}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ color: reg.status === 'APPROVED' ? 'var(--primary)' : '#FFBD2E' }}>
                                                                {reg.status === 'APPROVED' ? 'PAID & VERIFIED' : 'PENDING'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }

                        {/* Reports & Export */}
                        {
                            activeTab === 'reports' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Reports & Intelligence</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                        <div className="glass-card" style={{ padding: '2rem' }}>
                                            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Excel Exports</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <button onClick={handleExport} className="btn btn-primary" style={{ justifyContent: 'center' }}>Master Data (All Enrolments)</button>
                                                <button onClick={exportFlattenedMembers} className="btn btn-outline" style={{ justifyContent: 'center', color: 'var(--primary)' }}>Flattened Student Master</button>
                                                <button onClick={exportEventWise} className="btn btn-outline" style={{ justifyContent: 'center' }}>Event-wise Spreadsheets</button>
                                                <button onClick={exportCollegeWise} className="btn btn-outline" style={{ justifyContent: 'center' }}>College-wise Summary</button>
                                            </div>
                                        </div>
                                        <div className="glass-card" style={{ padding: '2rem' }}>
                                            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Financial Summary</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                    <span>Total Collection</span>
                                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{totalRevenue}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                    <span>External Fees</span>
                                                    <span style={{ color: '#FFBD2E', fontWeight: 'bold' }}>₹{registrations.filter(r => r.category === 'OUTER').reduce((a, c) => a + (c.totalAmount || 0), 0)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                    <span>Other Dept Fees</span>
                                                    <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>₹{registrations.filter(r => r.category === 'OTHER_DEPT').reduce((a, c) => a + (c.totalAmount || 0), 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === 'slots' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Event Timings</h2>
                                        {userRole !== 'VOLUNTEER' && <button onClick={() => openSlotModal()} className="btn btn-primary"><Plus size={18} /> Add Slot</button>}
                                    </div>
                                    <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Event & Venue</th>
                                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Schedule</th>
                                                    <th style={{ padding: '1rem', textAlign: 'center', color: '#fff' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {eventSlots.length === 0 ? (
                                                    <tr><td colSpan="3" style={{ padding: '3rem', textAlign: 'center' }}>No slots scheduled.</td></tr>
                                                ) : (
                                                    eventSlots.map(slot => (
                                                        <tr key={slot.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <td style={{ padding: '1rem' }}>
                                                                <div style={{ color: '#fff', fontWeight: 'bold' }}>{slot.eventName}</div>
                                                                <div style={{ fontSize: '0.8rem' }}>📍 {slot.venue}</div>
                                                            </td>
                                                            <td style={{ padding: '1rem' }}>
                                                                <div>📅 {slot.date}</div>
                                                                <div style={{ fontSize: '0.8rem' }}>🕒 {slot.startTime} - {slot.endTime}</div>
                                                            </td>
                                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                    {userRole !== 'VOLUNTEER' && <button onClick={() => openSlotModal(slot)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={16} /></button>}
                                                                    {userRole === 'ADMIN' && <button onClick={() => handleDeleteSlot(slot.id)} style={{ background: 'none', border: 'none', color: '#FF5F56', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === 'announcements' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Broadcast Manager</h2>
                                        {userRole !== 'VOLUNTEER' && <button onClick={() => openAnnModal()} className="btn btn-primary"><Plus size={18} /> New Broadcast</button>}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100%, 1fr))', gap: '1.5rem' }}>
                                        <style>{`
                                        @media (min-width: 768px) {
                                            .ann-grid { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important; }
                                        }
                                    `}</style>
                                        <div className="ann-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                            {announcements.length === 0 ? (
                                                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>No broadcasts found.</div>
                                            ) : (
                                                announcements.map(ann => {
                                                    const isExpired = ann.expiresAt && new Date(ann.expiresAt) < new Date();
                                                    return (
                                                        <div key={ann.id} className="glass-card" style={{
                                                            padding: '1.2rem',
                                                            borderLeft: `4px solid ${ann.priority === 'URGENT' ? 'var(--neon-pink)' : ann.priority === 'IMPORTANT' ? '#FFBD2E' : 'rgba(255,255,255,0.2)'}`,
                                                            background: 'rgba(255,255,255,0.02)',
                                                            position: 'relative',
                                                            opacity: ann.isActive && !isExpired ? 1 : 0.6,
                                                            borderRadius: '8px'
                                                        }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                                        <span style={{
                                                                            fontFamily: 'Share Tech Mono',
                                                                            fontSize: '0.7rem',
                                                                            color: ann.priority === 'URGENT' ? 'var(--neon-pink)' : ann.priority === 'IMPORTANT' ? '#FFBD2E' : 'var(--text-muted)'
                                                                        }}>
                                                                            [{ann.priority}]
                                                                        </span>
                                                                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>ID_{ann.id.substring(0, 6).toUpperCase()}</span>
                                                                    </div>
                                                                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>{ann.title}</h3>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    {userRole !== 'VOLUNTEER' && <button onClick={() => openAnnModal(ann)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(56, 234, 140, 0.1)', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={14} /></button>}
                                                                    {userRole === 'ADMIN' && <button onClick={() => handleDeleteAnn(ann.id)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255, 95, 86, 0.1)', border: 'none', color: '#FF5F56', cursor: 'pointer' }}><Trash2 size={14} /></button>}
                                                                </div>
                                                            </div>
                                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.5', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '4px' }}>{ann.message}</p>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                                    <span style={{ color: (ann.isActive && !isExpired) ? 'var(--primary)' : '#FF5F56', fontWeight: 'bold' }}>状态: {(ann.isActive && !isExpired) ? 'ACTIVE' : 'IDLE'}</span>
                                                                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>CAT: {ann.category}</span>
                                                                </div>
                                                                <span style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Share Tech Mono' }}>
                                                                    {ann.createdAt?.toDate ? ann.createdAt.toDate().toLocaleDateString() : 'INITIAL'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === 'winners' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Prize Winners</h2>
                                        {userRole !== 'VOLUNTEER' && <button onClick={() => openWinnerModal()} className="btn btn-primary"><Trophy size={18} /> Declare Result</button>}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        {prizeWinners.length === 0 ? (
                                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1/-1' }}>No results declared yet.</div>
                                        ) : (
                                            prizeWinners.map(winner => (
                                                <div key={winner.id} className="glass-card" style={{ padding: '1.5rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <h3 style={{ color: '#fff', margin: 0 }}>{winner.teamName}</h3>
                                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{winner.position}</span>
                                                    </div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{winner.eventName}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: winner.published ? 'var(--primary)' : '#FFBD2E' }}>{winner.published ? 'Published' : 'Draft'}</span>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            {userRole !== 'VOLUNTEER' && <button onClick={() => openWinnerModal(winner)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={16} /></button>}
                                                            {userRole === 'ADMIN' && <button onClick={() => handleDeleteWinner(winner.id)} style={{ background: 'none', border: 'none', color: '#FF5F56', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === 'fees' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Fee Configuration</h2>
                                        {userRole === 'ADMIN' && <button onClick={() => openFeeModal()} className="btn btn-primary"><Plus size={18} /> Add Rule</button>}
                                    </div>
                                    <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <tr>
                                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Category</th>
                                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Amount</th>
                                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Calculation</th>
                                                    <th style={{ padding: '1rem', textAlign: 'center', color: '#fff' }}>Priority</th>
                                                    <th style={{ padding: '1rem', textAlign: 'center', color: '#fff' }}>Status</th>
                                                    <th style={{ padding: '1rem', textAlign: 'center', color: '#fff' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {feeConfigs.length === 0 ? (
                                                    <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }}>No fee rules configured.</td></tr>
                                                ) : (
                                                    feeConfigs.map(fee => (
                                                        <tr key={fee.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <td style={{ padding: '1rem' }}>
                                                                <div style={{ color: '#fff', fontWeight: 'bold' }}>{fee.category}</div>
                                                            </td>
                                                            <td style={{ padding: '1rem' }}>
                                                                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{fee.feePerStudent}</div>
                                                            </td>
                                                            <td style={{ padding: '1rem' }}>{fee.calculationType}</td>
                                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                {fee.priorityAccess ? <span style={{ color: 'var(--primary)' }}>Yes</span> : <span>No</span>}
                                                            </td>
                                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                <span style={{ color: fee.isActive ? 'var(--primary)' : '#FF5F56' }}>{fee.isActive ? 'Active' : 'Inactive'}</span>
                                                            </td>
                                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                    {userRole === 'ADMIN' && <button onClick={() => openFeeModal(fee)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={16} /></button>}
                                                                    {userRole === 'ADMIN' && <button onClick={() => handleDeleteFee(fee.id)} style={{ background: 'none', border: 'none', color: '#FF5F56', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </main>
            </div>


            {/* Registration Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedRegistration && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeModal}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card no-scrollbar"
                            style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', zIndex: 1001, padding: '0', border: '1px solid var(--primary)' }}
                        >
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(56, 234, 140, 0.05)' }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem' }}>Registration Details</h3>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Event Name</label>
                                        <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedRegistration.eventName}</div>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Team Name</label>
                                        <div style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedRegistration.teamName}</div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                                    <h4 style={{ color: 'var(--primary)', margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Team Leader Info</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Name</label>
                                            <div style={{ color: '#fff' }}>{selectedRegistration.studentName}</div>
                                        </div>
                                        <div>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Register No</label>
                                            <div style={{ color: '#fff' }}>{selectedRegistration.registerNumber}</div>
                                        </div>
                                        <div>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department</label>
                                            <div style={{ color: '#fff' }}>{selectedRegistration.department}</div>
                                        </div>
                                        <div>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Year</label>
                                            <div style={{ color: '#fff' }}>{selectedRegistration.year}</div>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>College</label>
                                            <div style={{ color: '#fff' }}>{selectedRegistration.collegeName}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Size Badge */}
                                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Team Size:</span>
                                    <span style={{
                                        padding: '8px 16px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold',
                                        background: 'rgba(124, 58, 237, 0.15)',
                                        color: '#A78BFA',
                                        border: '2px solid rgba(124, 58, 237, 0.4)'
                                    }}>
                                        {selectedRegistration.teamCount || 1} {(selectedRegistration.teamCount || 1) === 1 ? 'Member' : 'Members'}
                                    </span>
                                </div>

                                {/* Team Members Table */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ color: 'var(--primary)', margin: '0 0 1rem 0', fontSize: '1rem' }}>Team Composition</h4>
                                    <div className="glass-card" style={{ padding: '0', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>#</th>
                                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Student Name</th>
                                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Role</th>
                                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Dept/Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                    <td style={{ padding: '0.75rem', color: 'var(--primary)' }}>1</td>
                                                    <td style={{ padding: '0.75rem', color: '#fff', fontWeight: 'bold' }}>{selectedRegistration.studentName}</td>
                                                    <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--primary)', fontSize: '0.7rem', border: '1px solid var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>LEADER</span></td>
                                                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{selectedRegistration.department} ({selectedRegistration.year} Year)</td>
                                                </tr>
                                                {selectedRegistration.teamMembers?.map((member, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <td style={{ padding: '0.75rem' }}>{idx + 2}</td>
                                                        <td style={{ padding: '0.75rem', color: '#fff' }}>{member}</td>
                                                        <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>MEMBER</span></td>
                                                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{selectedRegistration.department}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Phone</label>
                                        <div style={{ color: '#fff' }}>{selectedRegistration.phoneNumber}</div>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Email</label>
                                        <div style={{ color: '#fff', wordBreak: 'break-all' }}>{selectedRegistration.email}</div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div style={{
                                    background: 'rgba(56, 234, 140, 0.05)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    marginBottom: '2rem',
                                    border: '1px solid rgba(56, 234, 140, 0.2)'
                                }}>
                                    <h4 style={{ color: 'var(--primary)', margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid rgba(56, 234, 140, 0.2)', paddingBottom: '0.5rem' }}>Payment Information</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Amount</label>
                                            <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>₹{selectedRegistration.totalAmount || 0}</div>
                                        </div>
                                        <div>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Transaction ID</label>
                                            <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>{selectedRegistration.paymentId || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Control */}
                                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <label style={{ color: '#fff', marginBottom: '1rem', display: 'block' }}>Approval Status</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => handleStatusUpdate('APPROVED')}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                background: selectedRegistration.status === 'APPROVED' ? 'var(--primary)' : 'rgba(56, 234, 140, 0.1)',
                                                color: selectedRegistration.status === 'APPROVED' ? '#000' : 'var(--primary)',
                                                fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                            }}
                                        >
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate('REJECTED')}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                background: selectedRegistration.status === 'REJECTED' ? '#FF5F56' : 'rgba(255, 95, 86, 0.1)',
                                                color: selectedRegistration.status === 'REJECTED' ? '#fff' : '#FF5F56',
                                                fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                            }}
                                        >
                                            <AlertCircle size={18} /> Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate('PENDING')}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                background: (!selectedRegistration.status || selectedRegistration.status === 'PENDING') ? '#FFBD2E' : 'rgba(255, 189, 46, 0.1)',
                                                color: (!selectedRegistration.status || selectedRegistration.status === 'PENDING') ? '#000' : '#FFBD2E',
                                                fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                            }}
                                        >
                                            <Clock size={18} /> Pending
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            {/* Announcement Modal */}
            < AnimatePresence >
                {isAnnModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAnnModalOpen(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{
                                position: 'relative', width: '100%', maxWidth: '600px',
                                background: '#0F111A', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                maxHeight: '90vh', overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>{isEditingAnn ? "Edit Announcement" : "Create Announcement"}</h3>
                                <button onClick={() => setIsAnnModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSaveAnn} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Title *</label>
                                    <input
                                        type="text" name="title" value={currentAnn.title} onChange={handleAnnChange}
                                        required placeholder="e.g., CodeFusion Deadline"
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Message *</label>
                                    <textarea
                                        name="message" value={currentAnn.message} onChange={handleAnnChange}
                                        required placeholder="Enter detailed message..." rows="4"
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Category</label>
                                        <select
                                            name="category" value={currentAnn.category} onChange={handleAnnChange}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                        >
                                            <option value="General">General</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Deadline">Deadline</option>
                                            <option value="Venue">Venue</option>
                                            <option value="Closed">Registration Closed</option>
                                            <option value="Update">Update</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Priority</label>
                                        <select
                                            name="priority" value={currentAnn.priority} onChange={handleAnnChange}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                        >
                                            <option value="NORMAL">Normal</option>
                                            <option value="IMPORTANT">Important</option>
                                            <option value="URGENT">Urgent 🚨</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Target Event</label>
                                    <select
                                        name="eventName" value={currentAnn.eventName} onChange={handleAnnChange}
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    >
                                        <option value="ALL">All Events</option>
                                        {events.map(ev => (
                                            <option key={ev.id} value={ev.name}>{ev.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Expiry Date (Optional)</label>
                                    <input
                                        type="datetime-local" name="expiresAt" value={currentAnn.expiresAt} onChange={handleAnnChange}
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', display: 'block' }}>Leave empty for no expiry.</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox" name="isActive" checked={currentAnn.isActive} onChange={handleAnnChange}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label style={{ color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>Visible on website</label>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsAnnModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{isEditingAnn ? "Save Changes" : "Create Announcement"}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            {/* Slot Modal */}
            < AnimatePresence >
                {isSlotModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSlotModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card" style={{ position: 'relative', width: '100%', maxWidth: '500px', padding: '2rem', border: '1px solid var(--primary)' }}>
                            <h3 style={{ color: '#fff', marginTop: 0, fontSize: '1.5rem', marginBottom: '1.5rem' }}>{isEditingSlot ? 'Edit Slot' : 'Add New Slot'}</h3>
                            <form onSubmit={handleSaveSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Event Name</label>
                                    <select name="eventName" value={currentSlot.eventName} onChange={handleSlotChange} required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}>
                                        <option value="">Select Event</option>
                                        {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Venue</label>
                                    <input type="text" name="venue" value={currentSlot.venue} onChange={handleSlotChange} placeholder="e.g., Seminar Hall II" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Date</label>
                                        <input type="date" name="date" value={currentSlot.date} onChange={handleSlotChange} required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Report Time</label>
                                        <input type="text" name="reportTime" value={currentSlot.reportTime} onChange={handleSlotChange} placeholder="9:00 AM" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Start Time</label>
                                        <input type="time" name="startTime" value={currentSlot.startTime} onChange={handleSlotChange} required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>End Time</label>
                                        <input type="time" name="endTime" value={currentSlot.endTime} onChange={handleSlotChange} required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsSlotModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{isEditingSlot ? 'Update Slot' : 'Add Slot'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            {/* Winner Modal */}
            < AnimatePresence >
                {isWinnerModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsWinnerModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card" style={{ position: 'relative', width: '100%', maxWidth: '500px', padding: '2rem', border: '1px solid var(--primary)' }}>
                            <h3 style={{ color: '#fff', marginTop: 0, fontSize: '1.5rem', marginBottom: '1.5rem' }}>{isEditingWinner ? 'Edit Winner' : 'Declare Result'}</h3>
                            <form onSubmit={handleSaveWinner} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Event</label>
                                    <select name="eventName" value={currentWinner.eventName} onChange={handleWinnerChange} required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}>
                                        <option value="">Select Event</option>
                                        {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Position</label>
                                        <select name="position" value={currentWinner.position} onChange={handleWinnerChange} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}>
                                            <option value="FIRST">1st Place</option>
                                            <option value="SECOND">2nd Place</option>
                                            <option value="THIRD">3rd Place</option>
                                            <option value="SPECIAL">Special Mention</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Team Name</label>
                                        <input type="text" name="teamName" value={currentWinner.teamName} onChange={handleWinnerChange} placeholder="Team Name" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Prize (Optional)</label>
                                    <input type="text" name="prize" value={currentWinner.prize} onChange={handleWinnerChange} placeholder="e.g., ₹2000 + Certificate" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(56, 234, 140, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(56, 234, 140, 0.1)' }}>
                                    <input type="checkbox" name="published" checked={currentWinner.published} onChange={handleWinnerChange} id="pub-check-final" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                    <label htmlFor="pub-check-final" style={{ color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>Publish result publicly (Includes Broadcast)</label>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsWinnerModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{isEditingWinner ? 'Update Result' : 'Publish Result'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
            {/* Fee Configuration Modal */}
            < AnimatePresence >
                {isFeeModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsFeeModalOpen(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{
                                position: 'relative', width: '100%', maxWidth: '500px',
                                background: '#0F111A', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', zIndex: 1001
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>{isEditingFee ? "Edit Fee Rule" : "Create Fee Rule"}</h3>
                                <button onClick={() => setIsFeeModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSaveFee} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Category *</label>
                                    <select
                                        name="category" value={currentFee.category} onChange={handleFeeChange} required
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    >
                                        <option value="EXTERNAL_PARTICIPANT">EXTERNAL_PARTICIPANT</option>
                                        <option value="OTHER_DEPT_STUDENT">OTHER_DEPT_STUDENT</option>
                                        <option value="CSE_AI_DEPT_STUDENT">CSE_AI_DEPT_STUDENT</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Fee Per Student (₹) *</label>
                                    <input
                                        type="number" name="feePerStudent" value={currentFee.feePerStudent} onChange={handleFeeChange}
                                        required placeholder="0"
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Calculation Type *</label>
                                    <select
                                        name="calculationType" value={currentFee.calculationType} onChange={handleFeeChange} required
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    >
                                        <option value="PER_STUDENT">Per Student × Team Size</option>
                                        <option value="FREE">Free Entry</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                                        <input type="checkbox" name="priorityAccess" checked={currentFee.priorityAccess} onChange={handleFeeChange} />
                                        Priority Access
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                                        <input type="checkbox" name="isActive" checked={currentFee.isActive} onChange={handleFeeChange} />
                                        Is Active
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    {isEditingFee ? "Update Rule" : "Create Rule"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CRMDashboard;
