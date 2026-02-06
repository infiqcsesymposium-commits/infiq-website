import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Calendar, MapPin, Upload, ArrowLeft } from 'lucide-react';
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
                if (data.eventName) {
                    counts[data.eventName] = (counts[data.eventName] || 0) + 1;
                }
            });
            setEventCounts(counts);
        });

        return () => {
            unsubscribeLimits();
            unsubscribeRegs();
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
                alert("You can select a maximum of 4 events.");
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
            alert("Please fill in all required fields.");
            return;
        }

        // 2. Category specific validation
        if (category === "OUTER") {
            if (!formData.collegeName || !formData.department || !formData.year || !formData.city) {
                alert("Please fill in all external participant details.");
                return;
            }
        } else if (category === "OTHER_DEPT") {
            if (!formData.regNo || !formData.department || !formData.year) {
                alert("Please fill in all internal student details.");
                return;
            }
            // Dept validation
            const dept = formData.department.toUpperCase();
            if (dept === "CSE" || dept === "AI" || dept === "AI&DS") {
                alert("CSE/AI students should use the 'VSBCETC - CSE / AI Only' category");
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
                alert("Only CSE / AI students allowed in this category");
                return;
            }
        } else {
            alert("Please select a registration category.");
            return;
        }

        // 3. Event Selection Validation
        if (selectedEvents.length === 0) {
            alert("Please select at least one event.");
            return;
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
            alert("Please enter the Transaction ID / Reference Number.");
            return;
        }

        setStatus("submitting");

        try {
            const promises = selectedEvents.map(eventName => {
                return addDoc(collection(db, "registrations"), {
                    ...formData,
                    eventName: eventName,
                    category,
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
            alert("Registration failed. Please try again.");
            setStatus("idle");
        }
    };

    const calculateTotalAmount = () => {
        if (category === "OUTER") return 250;
        if (category === "OTHER_DEPT") return 100;
        return 0; // CSE_ONLY is free
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
                <button onClick={() => { setStatus("idle"); setStep(1); setSelectedEvents([]); setFormData({ ...formData, teamName: "", studentName: "", paymentId: "" }); }} className="btn btn-outline">
                    Register Another Team
                </button>
            </div>
        );
    }

    return (
        <section style={{ padding: '120px 0', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                {/* Stepper Header */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 1 ? 1 : 0.5 }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: step >= 1 ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                        <span style={{ color: step >= 1 ? '#fff' : 'var(--text-muted)' }}>Details</span>
                    </div>
                    <div style={{ width: '50px', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                        <div style={{ width: step >= 2 ? '100%' : '0%', height: '100%', background: 'var(--primary)', transition: 'all 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 2 ? 1 : 0.5 }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 2 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: step >= 2 ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                        <span style={{ color: step >= 2 ? '#fff' : 'var(--text-muted)' }}>Payment</span>
                    </div>
                    <div style={{ width: '50px', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                        <div style={{ width: step >= 3 ? '100%' : '0%', height: '100%', background: 'var(--primary)', transition: 'all 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 3 ? 1 : 0.5 }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 3 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: step >= 3 ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                        <span style={{ color: step >= 3 ? '#fff' : 'var(--text-muted)' }}>Done</span>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem' }}>

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
                                                                    const response = await fetch('https://api.cloudinary.com/v1_1/dydzkpfmx/image/upload', {
                                                                        method: 'POST',
                                                                        body: formData
                                                                    });
                                                                    const data = await response.json();
                                                                    if (data.secure_url) {
                                                                        setFormData(prev => ({ ...prev, paymentScreenshot: data.secure_url }));
                                                                        alert("Screenshot uploaded successfully!");
                                                                    } else {
                                                                        console.error("Cloudinary Error:", data);
                                                                        // Fallback just to show flow works if preset fails
                                                                        alert("Note: Upload might have failed due to missing preset. Setting local name for demo.");
                                                                        setFormData(prev => ({ ...prev, paymentScreenshot: file.name }));
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Upload Error:", error);
                                                                    alert("Image upload failed. Please try again.");
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

                </div>
            </div>
        </section>
    );
};

export default RegistrationForm;
