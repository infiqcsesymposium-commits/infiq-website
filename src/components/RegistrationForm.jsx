import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Calendar, MapPin, Upload, ArrowLeft, Users } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

const RegistrationForm = () => {
    // 1=Details, 2=Payment, 3=Success
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState("");
    const [formData, setFormData] = useState({
        teamName: "",
        studentName: "",
        mobile: "",
        email: "",
        collegeName: "",
        department: "",
        year: "",
        city: "",
        regNo: "",
        paymentId: "" // Added transaction ID
    });
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [status, setStatus] = useState("idle");
    const [eventCounts, setEventCounts] = useState({});
    const [eventLimits, setEventLimits] = useState({});
    const [filterTab, setFilterTab] = useState("ALL");
    const [teamCount, setTeamCount] = useState(1);
    const [teamMembers, setTeamMembers] = useState(["", "", ""]);  // For members 2, 3, 4
    const [feeConfigs, setFeeConfigs] = useState([]);
    const [notification, setNotification] = useState(null);

    const showNotify = (message, type = "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    // Events Configuration
    const eventsList = [
        {
            id: 1,
            title: "Paper Presentation",
            category: "TECHNICAL",
            tag: "RESEARCH",
            time: "10:00 AM - 1:00 PM",
            venue: "A005",
            dbName: "Paper Presentation"
        },
        {
            id: 2,
            title: "Project Expo",
            category: "TECHNICAL",
            tag: "INNOVATION",
            time: "10:00 AM - 1:00 PM",
            venue: "A007",
            dbName: "Project Expo"
        },
        {
            id: 3,
            title: "Code Debugging",
            category: "TECHNICAL",
            tag: "CODE",
            time: "10:00 AM - 1:00 PM",
            venue: "A006",
            dbName: "Code Debugging"
        },
        {
            id: 4,
            title: "Web Designing",
            category: "TECHNICAL",
            tag: "DEV",
            time: "10:00 AM - 1:00 PM",
            venue: "Lab 2",
            dbName: "Web Designing"
        },
        {
            id: 5,
            title: "Technical Quiz",
            category: "TECHNICAL",
            tag: "QUIZ",
            time: "2:00 PM - 3:00 PM",
            venue: "Seminar Hall",
            dbName: "Technical Quiz"
        },
        {
            id: 6,
            title: "Connections", // Non-technical in some contexts, but let's stick to previous categorization or user intent. Assuming Technical based on list.
            category: "NON-TECHNICAL",
            tag: "FUN",
            time: "11:00 AM - 12:00 PM",
            venue: "A205",
            dbName: "Connections"
        },
        {
            id: 7,
            title: "Multimedia Editing",
            category: "NON-TECHNICAL",
            tag: "CREATIVE",
            time: "1:00 PM - 2:00 PM",
            venue: "Lab 3",
            dbName: "Multimedia Editing"
        },
        {
            id: 8,
            title: "Photography",
            category: "NON-TECHNICAL",
            tag: "ART",
            time: "All Day",
            venue: "Campus",
            dbName: "Photography"
        },
        {
            id: 9,
            title: "Short Film",
            category: "NON-TECHNICAL",
            tag: "CINEMA",
            time: "2:00 PM",
            venue: "Auditorium",
            dbName: "Short Film"
        },
        {
            id: 10,
            title: "Esports",
            category: "NON-TECHNICAL",
            tag: "GAMING",
            time: "11:00 AM",
            venue: "Lab 4",
            dbName: "Esports"
        },
        {
            id: 11,
            title: "Ideathon",
            category: "TECHNICAL",
            tag: "HACK",
            time: "10:00 AM",
            venue: "A305",
            dbName: "Ideathon"
        }
    ];

    useEffect(() => {
        const unsubscribeLimits = onSnapshot(collection(db, "event_settings"), (snapshot) => {
            const limits = {};
            snapshot.docs.forEach(doc => {
                limits[doc.id] = doc.data().limit;
            });
            setEventLimits(limits);
        });

        const unsubscribeRegs = onSnapshot(collection(db, "registrations"), (snapshot) => {
            const counts = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.eventName && data.status === 'APPROVED') {
                    counts[data.eventName] = (counts[data.eventName] || 0) + 1;
                }
            });
            setEventCounts(counts);
        });

        const unsubscribeFees = onSnapshot(collection(db, "fee_config"), (snapshot) => {
            const fees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFeeConfigs(fees);
        });

        return () => {
            unsubscribeLimits();
            unsubscribeRegs();
            unsubscribeFees();
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleEvent = (eventName) => {
        if (selectedEvents.includes(eventName)) {
            setSelectedEvents(prev => prev.filter(e => e !== eventName));
        } else {
            if (selectedEvents.length >= 4) {
                showNotify("You can select a maximum of 4 events.", "warning");
                return;
            }
            setSelectedEvents(prev => [...prev, eventName]);
        }
    };

    const isEventFull = (eventName) => {
        const count = eventCounts[eventName] || 0;
        const limit = eventLimits[eventName] !== undefined ? eventLimits[eventName] : 15; // Default limit 15 for new events
        return count >= limit;
    };

    // --- Validation and Navigation ---

    const handleContinueToPayment = (e) => {
        e.preventDefault();

        // 1. Basic Field Validation
        if (!formData.teamName || !formData.studentName || !formData.mobile || !formData.email) {
            showNotify("Please fill in all required fields.", "error");
            return;
        }

        // 2. Category specific validation
        if (category === "OUTER") {
            if (!formData.collegeName || !formData.department || !formData.year || !formData.city) {
                showNotify("Please fill in all external participant details.", "error");
                return;
            }
        } else if (category === "OTHER_DEPT") {
            if (!formData.regNo || !formData.department || !formData.year) {
                showNotify("Please fill in all internal student details.", "error");
                return;
            }
            // Dept validation
            const dept = formData.department.toUpperCase();
            if (dept === "CSE" || dept === "AI" || dept === "AI&DS") {
                showNotify("CSE/AI students should use the 'VSBCETC - CSE / AI Only' category", "error");
                return;
            }
        } else if (category === "CSE_ONLY") {
            if (!formData.regNo || !formData.department || !formData.year) {
                alert("Please fill in all internal student details.");
                return;
            }
            // Dept validation
            const dept = formData.department.toUpperCase();
            if (dept !== "CSE" && dept !== "AI" && dept !== "AI&DS") {
                showNotify("Only CSE / AI students allowed in this category", "error");
                return;
            }
        } else {
            showNotify("Please select a registration category.", "error");
            return;
        }

        // 3. Event Selection Validation
        if (selectedEvents.length === 0) {
            showNotify("Please select at least one event.", "error");
            return;
        }

        // 4. Team Members Validation
        if (teamCount > 1) {
            for (let i = 0; i < teamCount - 1; i++) {
                if (!teamMembers[i] || teamMembers[i].trim() === "") {
                    showNotify(`Please enter the name for Team Member ${i + 2}`, "error");
                    return;
                }
            }
        }

        // All good, move to Step 2
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();

        // Final check on payment ID (if paying)
        const totalAmount = calculateTotalAmount();
        if (totalAmount > 0 && !formData.paymentId) {
            showNotify("Please enter the Transaction ID / Reference Number.", "error");
            return;
        }

        setStatus("submitting");

        try {
            const promises = selectedEvents.map(eventName => {
                // Filter team members to only include non-empty names
                const filteredTeamMembers = teamMembers.slice(0, teamCount - 1).filter(name => name.trim() !== "");

                return addDoc(collection(db, "registrations"), {
                    ...formData,
                    eventName: eventName,
                    category,
                    teamCount: teamCount,
                    teamMembers: filteredTeamMembers,
                    createdAt: serverTimestamp(),
                    status: 'PENDING',
                    totalAmount,
                    paymentId: formData.paymentId // Store transaction ID
                });
            });

            await Promise.all(promises);

            setStatus("success");
            setStep(3);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Error adding document: ", error);
            showNotify("Registration failed. Please try again.", "error");
            setStatus("idle");
        }
    };

    const calculateTotalAmount = () => {
        // Map RegistrationForm categories to fee_config categories
        const categoryMap = {
            "OUTER": "EXTERNAL_PARTICIPANT",
            "OTHER_DEPT": "OTHER_DEPT_STUDENT",
            "CSE_ONLY": "CSE_AI_DEPT_STUDENT"
        };

        const crmCategory = categoryMap[category];
        const feeRule = feeConfigs.find(f => f.category === crmCategory && f.isActive);

        if (feeRule) {
            if (feeRule.calculationType === 'FREE') return 0;
            return (feeRule.feePerStudent || 0) * teamCount;
        }

        // Fallback to legacy hardcoded logic if no dynamic rule exists
        const baseAmount = category === "OUTER" ? 250 : category === "OTHER_DEPT" ? 100 : 0;
        return baseAmount * teamCount;
    };

    const totalAmount = calculateTotalAmount();

    const filteredEvents = eventsList.filter(ev => {
        if (filterTab === "ALL") return true;
        return ev.category === filterTab;
    });

    // --- Render Logic ---

    // Success View
    if (status === "success" || step === 3) {
        return (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '150px auto' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(56, 234, 140, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={48} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>Registration Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Your registration for {selectedEvents.length} event(s) is successful.
                    <br />A confirmation email will be sent to {formData.email}.
                </p>
                <button onClick={() => {
                    setStatus("idle");
                    setStep(1);
                    setSelectedEvents([]);
                    setTeamCount(1);
                    setTeamMembers(["", "", ""]);
                    setFormData({ ...formData, teamName: "", studentName: "", paymentId: "" });
                }} className="btn btn-outline">
                    Register Another Team
                </button>
            </div>
        );
    }

    return (
        <section style={{
            padding: '140px 0 80px',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                right: '5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '5%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(56, 234, 140, 0.12), transparent)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '3.5rem'
                    }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1.25rem',
                        background: 'rgba(56, 234, 140, 0.1)',
                        border: '1px solid rgba(56, 234, 140, 0.3)',
                        borderRadius: '100px',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--primary)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px var(--primary)',
                            animation: 'pulse-dot 2s infinite'
                        }} />
                        <span style={{
                            color: 'var(--primary)',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            fontFamily: 'Orbitron, sans-serif'
                        }}>Registration Portal</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: '900',
                        margin: '0 0 1.25rem 0',
                        background: 'linear-gradient(135deg, #fff 30%, var(--primary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: '1.1',
                        letterSpacing: '-0.02em',
                        fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                        Join INFIQ 2K26
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Fill in your details and select your events to secure your spot at the biggest tech symposium
                    </p>
                </motion.div>

                {/* Stepper - Redesigned */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '3rem',
                        gap: '0.5rem',
                        padding: '1.5rem',
                        background: 'rgba(15, 17, 26, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        maxWidth: '600px',
                        margin: '0 auto 3rem'
                    }}
                >
                    {[
                        { num: 1, label: 'Details', icon: '📋' },
                        { num: 2, label: 'Payment', icon: '💳' },
                        { num: 3, label: 'Done', icon: '✓' }
                    ].map((item, idx) => (
                        <React.Fragment key={item.num}>
                            <motion.div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    flex: 1
                                }}
                                animate={{
                                    opacity: step >= item.num ? 1 : 0.4,
                                    scale: step === item.num ? 1.05 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    background: step >= item.num
                                        ? 'linear-gradient(135deg, var(--primary) 0%, rgba(56, 234, 140, 0.8) 100%)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: step >= item.num
                                        ? '2px solid var(--primary)'
                                        : '2px solid rgba(255, 255, 255, 0.1)',
                                    color: step >= item.num ? '#000' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    boxShadow: step >= item.num
                                        ? '0 4px 15px rgba(56, 234, 140, 0.3)'
                                        : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {step > item.num ? '✓' : item.icon}
                                </div>
                                <span style={{
                                    color: step >= item.num ? '#fff' : 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    fontWeight: step === item.num ? '700' : '500',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {item.label}
                                </span>
                            </motion.div>

                            {idx < 2 && (
                                <div style={{
                                    flex: '0 0 40px',
                                    height: '2px',
                                    background: 'rgba(255,255,255,0.08)',
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                    margin: '0 0.5rem',
                                    alignSelf: 'center',
                                    marginBottom: '24px'
                                }}>
                                    <motion.div
                                        style={{
                                            height: '100%',
                                            background: 'var(--primary)',
                                            borderRadius: '2px',
                                            boxShadow: '0 0 8px var(--primary)'
                                        }}
                                        initial={{ width: '0%' }}
                                        animate={{
                                            width: step > item.num ? '100%' : '0%'
                                        }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* Important Notes - Standalone Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    style={{
                        background: 'rgba(15, 17, 26, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        marginBottom: '3rem',
                        backdropFilter: 'blur(20px)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Accent Border */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--primary), var(--neon-blue))' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '10px', background: 'rgba(56, 234, 140, 0.1)', borderRadius: '12px' }}>
                            <AlertCircle size={24} color="var(--primary)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif' }}>System Briefing</h3>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700' }}>Essential Protocol</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        <div style={{
                            background: 'rgba(255, 193, 7, 0.03)',
                            border: '1px solid rgba(255, 193, 7, 0.15)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>⚡</div>
                            <div>
                                <div style={{ color: '#FFD700', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '4px' }}>SPECIAL EVENTS</div>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Ideathon & Startup Arena: Register here <strong>only if shortlisted</strong>.
                                </p>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255, 67, 54, 0.03)',
                            border: '1px solid rgba(255, 67, 54, 0.15)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <div style={{ color: '#ff4336', fontSize: '1.2rem' }}>🚫</div>
                            <div>
                                <div style={{ color: '#ff4336', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '4px' }}>RESTRICTION</div>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    <strong>NO ON-SPOT REGISTRATIONS.</strong> All participants must secure online slots.
                                </p>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(56, 234, 140, 0.03)',
                            border: '1px solid rgba(56, 234, 140, 0.15)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            gridColumn: '1 / -1'
                        }}>
                            <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%' }} />
                                MANDATORY REQUIREMENTS
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {[
                                    { text: "College ID Card (Required for Entry)", icon: "🪪" },
                                    { text: "Payment Screenshot for Verification", icon: "📸" },
                                    { text: "Laptop & Gear for Tech Events", icon: "💻" }
                                ].map((req, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                        <span style={{ fontSize: '1rem' }}>{req.icon}</span>
                                        {req.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Card Container */}
                <motion.div
                    className="glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                        padding: '3rem',
                        background: 'rgba(15, 17, 26, 0.8)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >

                    {/* STEP 1: Details */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#fff' }}>Event Registration</h2>

                            <form onSubmit={handleContinueToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                                {/* 1. Category Selection */}
                                <div className="form-group">
                                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontWeight: 'bold' }}>Registration Category *</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="form-input"
                                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none' }}
                                    >
                                        <option value="" style={{ color: '#000' }}>-- Select Category --</option>
                                        <option value="OUTER" style={{ color: '#000' }}>Outer College (Other Institutions)</option>
                                        <option value="OTHER_DEPT" style={{ color: '#000' }}>VSBCETC - Other Departments</option>
                                        <option value="CSE_ONLY" style={{ color: '#000' }}>VSBCETC - CSE / AI Only</option>
                                    </select>
                                </div>

                                {/* Common Fields */}
                                <div className="form-grid">
                                    <div><label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Team Name *</label><input type="text" name="teamName" value={formData.teamName} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                    <div><label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Lead Student Name *</label><input type="text" name="studentName" value={formData.studentName} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                </div>
                                <div className="form-grid">
                                    <div><label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Mobile Number *</label><input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                    <div><label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email ID *</label><input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                </div>

                                {/* Team Size Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1.5rem',
                                        background: 'rgba(124, 58, 237, 0.08)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(124, 58, 237, 0.2)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <Users size={20} color="#A78BFA" />
                                        <label style={{ color: '#A78BFA', fontWeight: 'bold', margin: 0 }}>Team Size *</label>
                                    </div>

                                    {/* Team Size Radio Buttons */}
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                        {[1, 2, 3, 4].map(size => (
                                            <label key={size} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1.25rem',
                                                borderRadius: '8px',
                                                background: teamCount === size ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                                border: teamCount === size ? '2px solid #A78BFA' : '1px solid rgba(255, 255, 255, 0.1)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                color: teamCount === size ? '#fff' : 'var(--text-muted)'
                                            }}>
                                                <input
                                                    type="radio"
                                                    name="teamSize"
                                                    value={size}
                                                    checked={teamCount === size}
                                                    onChange={(e) => setTeamCount(parseInt(e.target.value))}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <span style={{ fontWeight: teamCount === size ? 'bold' : 'normal' }}>
                                                    {size} {size === 1 ? 'Member' : 'Members'}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Dynamic Team Member Name Fields */}
                                    {teamCount > 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                        >
                                            <div style={{
                                                color: 'var(--text-muted)',
                                                fontSize: '0.9rem',
                                                paddingBottom: '0.5rem',
                                                borderBottom: '1px solid rgba(124, 58, 237, 0.2)'
                                            }}>
                                                Additional Team Members
                                            </div>
                                            {Array.from({ length: teamCount - 1 }).map((_, index) => (
                                                <div key={index}>
                                                    <label style={{
                                                        display: 'block',
                                                        color: 'var(--text-muted)',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        Member {index + 2} Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={teamMembers[index]}
                                                        onChange={(e) => {
                                                            const newMembers = [...teamMembers];
                                                            newMembers[index] = e.target.value;
                                                            setTeamMembers(newMembers);
                                                        }}
                                                        placeholder={`Enter member ${index + 2} full name`}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.8rem',
                                                            borderRadius: '8px',
                                                            background: 'rgba(0, 0, 0, 0.3)',
                                                            border: '1px solid rgba(124, 58, 237, 0.3)',
                                                            color: '#fff',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Conditional Category Fields */}
                                <AnimatePresence>
                                    {category === "OUTER" && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
                                            <h4 style={{ color: 'var(--neon-blue)', margin: 0 }}>External Participant Details</h4>
                                            <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>College Name *</label><input type="text" name="collegeName" onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                            <div className="form-grid">
                                                <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department *</label><input type="text" name="department" onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                                <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Year *</label><select name="year" onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
                                            </div>
                                            <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>City *</label><input type="text" name="city" onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                        </motion.div>
                                    )}

                                    {(category === "OTHER_DEPT" || category === "CSE_ONLY") && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: category === 'CSE_ONLY' ? 'rgba(56, 234, 140, 0.05)' : 'rgba(255, 46, 223, 0.05)', borderRadius: '12px', border: `1px solid ${category === 'CSE_ONLY' ? 'var(--primary)' : 'var(--neon-pink)'}` }}>
                                            <h4 style={{ color: category === 'CSE_ONLY' ? 'var(--primary)' : 'var(--neon-pink)', margin: 0 }}>Internal Student Details</h4>
                                            <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Register Number *</label><input type="text" name="regNo" onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                            <div className="form-grid">
                                                <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department *</label><select name="department" onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}><option value="">Select Dept</option>{category === 'CSE_ONLY' ? (<><option value="CSE">CSE</option><option value="AI&DS">AI & DS</option></>) : (<><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option><option value="IT">IT</option><option value="MBA">MBA</option></>)}</select></div>
                                                <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Year *</label><select name="year" onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Event Selection */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <label style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Select Events (max 4) <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>{selectedEvents.length}/4 selected</span></label>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                        {['ALL', 'TECHNICAL', 'NON-TECHNICAL'].map(tab => (
                                            <button key={tab} type="button" onClick={() => setFilterTab(tab)} style={{ background: 'none', border: 'none', color: filterTab === tab ? '#fff' : 'var(--text-muted)', borderBottom: filterTab === tab ? '2px solid var(--primary)' : '2px solid transparent', paddingBottom: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>{tab}</button>
                                        ))}
                                    </div>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {filteredEvents.map((ev) => {
                                            const isSelected = selectedEvents.includes(ev.dbName);
                                            const isFull = isEventFull(ev.dbName);
                                            const disabled = isFull && !isSelected;
                                            return (
                                                <div key={ev.id} onClick={() => !disabled && toggleEvent(ev.dbName)} style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: isSelected ? 'rgba(56, 234, 140, 0.1)' : 'rgba(255, 255, 255, 0.03)', border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, transition: 'all 0.2s', position: 'relative' }}>
                                                    <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }}><div style={{ width: '20px', height: '20px', borderRadius: '4px', border: isSelected ? 'none' : '2px solid var(--text-muted)', background: isSelected ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isSelected && <CheckCircle2 size={14} color="#000" />}</div></div>
                                                    <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>{ev.title}</h4>{disabled ? (<span style={{ fontSize: '0.7rem', color: '#FF5F56', border: '1px solid #FF5F56', padding: '2px 6px', borderRadius: '4px' }}>FULL</span>) : (<span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: ev.category === 'TECHNICAL' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 46, 223, 0.2)', color: ev.category === 'TECHNICAL' ? 'var(--neon-blue)' : 'var(--neon-pink)' }}>{ev.tag}</span>)}</div><div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {ev.time}</span><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {ev.venue}</span></div></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                    Continue to Payment
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 2: Payment */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <ArrowLeft size={16} /> Back to Details
                                </button>
                                <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#fff' }}>Payment</h2>
                                <div style={{ width: '60px' }}></div>{/* Spacer */}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                                {/* Order Summary */}
                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1.5rem' }}>
                                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>Order Summary</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#fff' }}>
                                        <span>Category</span>
                                        <span style={{ fontWeight: 'bold' }}>{category}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#fff' }}>
                                        <span>Selected Events</span>
                                        <span style={{ fontWeight: 'bold' }}>{selectedEvents.length}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#fff' }}>
                                        <span>Team Members</span>
                                        <span style={{ fontWeight: 'bold' }}>{teamCount}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.1rem', color: '#fff' }}>Total Amount</span>
                                        <span style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '900' }}>₹{totalAmount}</span>
                                    </div>
                                    {totalAmount === 0 && (
                                        <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(56, 234, 140, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                                            Registration is Free for {category}
                                        </div>
                                    )}
                                </div>

                                {/* QR Code & Payment Section (Only if amount > 0) */}
                                {totalAmount > 0 && (
                                    <>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                width: '240px',
                                                height: '240px',
                                                background: '#fff',
                                                margin: '0 auto',
                                                borderRadius: '20px',
                                                padding: '10px',
                                                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                                            }}>
                                                <img
                                                    src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=9042561295@upi&pn=VyuGa%2026&cu=INR"
                                                    alt="Payment QR Code"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            </div>

                                            <div style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                marginTop: '2rem',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>OR PAY TO THIS UPI ID</p>
                                                <p style={{ color: 'var(--neon-blue)', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                                                    9042561295@upi
                                                </p>
                                            </div>
                                        </div>

                                        {/* Screenshot Upload & Form */}
                                        <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                            <div>
                                                <label className="form-label" style={{ display: 'block', color: '#fff', marginBottom: '1rem', textAlign: 'center' }}>Upload Payment Screenshot</label>
                                                <div
                                                    style={{
                                                        border: '2px dashed rgba(255,255,255,0.2)',
                                                        borderRadius: '12px',
                                                        padding: '2rem',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        background: 'rgba(0,0,0,0.2)',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onClick={() => document.getElementById('screenshot-upload').click()}
                                                >
                                                    <input
                                                        id="screenshot-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                if (file.size > 5 * 1024 * 1024) {
                                                                    alert("File size should be less than 5MB");
                                                                    return;
                                                                }

                                                                setStatus("uploading_image");
                                                                const formData = new FormData();
                                                                formData.append('file', file);
                                                                formData.append('upload_preset', 'ml_default'); // Updated to ML preset

                                                                try {
                                                                    if (!navigator.onLine) {
                                                                        throw new Error("No internet connection detected.");
                                                                    }
                                                                    const response = await fetch('https://api.cloudinary.com/v1_1/dydzkpfmx/image/upload', {
                                                                        method: 'POST',
                                                                        body: formData
                                                                    });

                                                                    const data = await response.json();

                                                                    if (!response.ok) {
                                                                        // Specifically handle the "unsigned preset" error
                                                                        if (data.error?.message?.includes("whitelisted for unsigned uploads")) {
                                                                            throw new Error("CONFIGURATION ERROR: The Cloudinary preset 'ml_default' is not set for 'Unsigned' uploads. Please enable Unsigned uploads in your Cloudinary Dashboard (Settings > Upload > Upload presets) or provide a whitelisted preset name.");
                                                                        }
                                                                        throw new Error(data.error?.message || "Upload failed with status " + response.status);
                                                                    }

                                                                    if (data.secure_url) {
                                                                        setFormData(prev => ({ ...prev, paymentScreenshot: data.secure_url }));
                                                                        alert("Screenshot uploaded successfully!");
                                                                    } else {
                                                                        throw new Error("Secure URL not found in response");
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Upload Error Details:", error);
                                                                    if (!navigator.onLine) {
                                                                        alert("Network Error: No internet connection. Please check your network and try again.");
                                                                    } else if (error.message.includes("CONFIGURATION ERROR")) {
                                                                        alert(error.message);
                                                                    } else if (error.message.includes("Failed to fetch") || error.message.includes("net::ERR")) {
                                                                        alert("Network Error: Could not reach Cloudinary servers. This might be a DNS or connection issue.");
                                                                    } else {
                                                                        alert("Image upload failed: " + error.message);
                                                                    }
                                                                    // Fallback: Record the filename so the user can still submit the form
                                                                    setFormData(prev => ({ ...prev, paymentScreenshot: "FAILED_UPLOAD_" + file.name }));
                                                                } finally {
                                                                    setStatus("idle");
                                                                }
                                                            }
                                                        }}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <Upload size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Click to upload screenshot</p>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '5px', opacity: 0.7 }}>Max 5MB, Images only</p>
                                                    {status === "uploading_image" && <p style={{ color: 'var(--neon-blue)', marginTop: '10px' }}>Uploading...</p>}
                                                    {formData.paymentScreenshot && status !== "uploading_image" && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            {formData.paymentScreenshot.startsWith('http') ? (
                                                                <>
                                                                    <p style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '5px' }}>Upload Successful!</p>
                                                                    <img src={formData.paymentScreenshot} alt="Preview" style={{ width: '100px', borderRadius: '8px', border: '1px solid var(--primary)' }} />
                                                                </>
                                                            ) : (
                                                                <p style={{ color: 'var(--primary)', marginTop: '10px', fontSize: '0.9rem' }}>Selected: {formData.paymentScreenshot}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Transaction ID / Reference No. *</label>
                                                <input
                                                    type="text"
                                                    value={formData.paymentId}
                                                    onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                                                    placeholder="e.g. 1234567890"
                                                    required
                                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '1.1rem' }}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={status === "submitting"}
                                                className="btn btn-primary"
                                                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold' }}
                                            >
                                                {status === "submitting" ? "Verifying..." : "Complete Registration"}
                                            </button>
                                        </form>
                                    </>
                                )}

                                {totalAmount === 0 && (
                                    <button
                                        onClick={handleFinalSubmit}
                                        disabled={status === "submitting"}
                                        className="btn btn-primary"
                                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold' }}
                                    >
                                        {status === "submitting" ? "Processing..." : "Complete Registration"}
                                    </button>
                                )}

                            </div>
                        </motion.div>
                    )}

                </motion.div>
            </div>
            {/* Premium Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
                        style={{
                            position: 'fixed',
                            bottom: '40px',
                            left: '50%',
                            zIndex: 9999,
                            background: notification.type === 'error' ? 'rgba(20, 2, 8, 0.95)' : 'rgba(2, 6, 20, 0.95)',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            boxShadow: notification.type === 'error' ? '0 10px 40px rgba(255, 67, 54, 0.2)' : '0 10px 40px rgba(56, 234, 140, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: '600',
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${notification.type === 'error' ? 'rgba(255, 67, 54, 0.4)' : 'rgba(56, 234, 140, 0.4)'}`,
                            fontSize: '0.9rem',
                            minWidth: '320px',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: notification.type === 'error' ? '#ff4336' : 'var(--primary)',
                            boxShadow: `0 0 10px ${notification.type === 'error' ? '#ff4336' : 'var(--primary)'}`
                        }} />
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default RegistrationForm;
