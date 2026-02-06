import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

const RegistrationForm = () => {
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
        regNo: ""
    });
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [status, setStatus] = useState("idle"); // idle, submitting, success, error
    const [eventCounts, setEventCounts] = useState({});
    const [eventLimits, setEventLimits] = useState({});
    const [filterTab, setFilterTab] = useState("ALL"); // ALL, TECHNICAL, NON-TECHNICAL

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

    // Fetch Event Counts and Limits
    useEffect(() => {
        // Fetch Limits
        const unsubscribeLimits = onSnapshot(collection(db, "event_settings"), (snapshot) => {
            const limits = {};
            snapshot.docs.forEach(doc => {
                limits[doc.id] = doc.data().limit;
            });
            setEventLimits(limits);
        });

        // Fetch Registrations for Counts
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedEvents.length === 0) {
            alert("Please select at least one event.");
            return;
        }

        // Category Validations
        if (category === "CSE_ONLY") {
            const dept = formData.department.toUpperCase();
            if (dept !== "CSE" && dept !== "AI" && dept !== "AI&DS") {
                alert("Only CSE / AI students allowed in this category");
                return;
            }
        }
        if (category === "OTHER_DEPT") {
            const dept = formData.department.toUpperCase();
            if (dept === "CSE" || dept === "AI" || dept === "AI&DS") {
                alert("CSE/AI students should use the 'VSBCETC - CSE / AI Only' category");
                return;
            }
        }

        setStatus("submitting");

        try {
            // Create a registration document for EACH selected event
            const promises = selectedEvents.map(eventName => {
                return addDoc(collection(db, "registrations"), {
                    ...formData,
                    eventName: eventName, // Individual event name per doc
                    category,
                    createdAt: serverTimestamp(),
                    status: 'PENDING'
                });
            });

            await Promise.all(promises);

            setStatus("success");
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Registration failed. Please try again.");
            setStatus("idle");
        }
    };

    const isEventFull = (eventName) => {
        const count = eventCounts[eventName] || 0;
        const limit = eventLimits[eventName] !== undefined ? eventLimits[eventName] : 15;
        return count >= limit;
    };

    if (status === "success") {
        return (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '150px auto' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(56, 234, 140, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={48} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>Registration Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Your team has been successfully registered for {selectedEvents.length} event(s).
                    <br />A confirmation email will be sent to {formData.email}.
                </p>
                <button onClick={() => { setStatus("idle"); setSelectedEvents([]); setFormData({ ...formData, teamName: "", studentName: "" }); }} className="btn btn-outline">
                    Register Another Team
                </button>
            </div>
        );
    }

    const filteredEvents = eventsList.filter(ev => {
        if (filterTab === "ALL") return true;
        return ev.category === filterTab;
    });

    return (
        <section style={{ padding: '120px 0', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#fff' }}>Event Registration</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* 1. Category Selection */}
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontWeight: 'bold' }}>Registration Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="form-input"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    outline: 'none'
                                }}
                            >
                                <option value="" style={{ color: '#000' }}>-- Select Category --</option>
                                <option value="OUTER" style={{ color: '#000' }}>Outer College (Other Institutions)</option>
                                <option value="OTHER_DEPT" style={{ color: '#000' }}>VSBCETC - Other Departments</option>
                                <option value="CSE_ONLY" style={{ color: '#000' }}>VSBCETC - CSE / AI Only</option>
                            </select>
                        </div>

                        {/* 2. Common Fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Team Name *</label>
                                <input
                                    type="text" name="teamName" value={formData.teamName} onChange={handleChange} required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
                                />
                            </div>
                            <div>
                                <label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Lead Student Name *</label>
                                <input
                                    type="text" name="studentName" value={formData.studentName} onChange={handleChange} required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Mobile Number *</label>
                                <input
                                    type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
                                />
                            </div>
                            <div>
                                <label className="form-label" style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email ID *</label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange} required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
                                />
                            </div>
                        </div>

                        {/* 3. Conditional Detail Fields based on Category */}
                        <AnimatePresence>
                            {category === "OUTER" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 229, 255, 0.1)' }}
                                >
                                    <h4 style={{ color: 'var(--neon-blue)', margin: 0 }}>External Participant Details</h4>
                                    <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>College Name *</label><input type="text" name="collegeName" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department *</label><input type="text" name="department" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                        <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Year *</label><select name="year" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
                                    </div>
                                    <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>City *</label><input type="text" name="city" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                </motion.div>
                            )}

                            {(category === "OTHER_DEPT" || category === "CSE_ONLY") && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: category === 'CSE_ONLY' ? 'rgba(56, 234, 140, 0.05)' : 'rgba(255, 46, 223, 0.05)', borderRadius: '12px', border: `1px solid ${category === 'CSE_ONLY' ? 'var(--primary)' : 'var(--neon-pink)'}` }}
                                >
                                    <h4 style={{ color: category === 'CSE_ONLY' ? 'var(--primary)' : 'var(--neon-pink)', margin: 0 }}>Internal Student Details</h4>
                                    <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Register Number *</label><input type="text" name="regNo" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department *</label>
                                            <select name="department" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                                                <option value="">Select Dept</option>
                                                {category === 'CSE_ONLY' ? (
                                                    <><option value="CSE">CSE</option><option value="AI&DS">AI & DS</option></>
                                                ) : (
                                                    <><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option><option value="IT">IT</option><option value="MBA">MBA</option></>
                                                )}
                                            </select>
                                        </div>
                                        <div><label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Year *</label><select name="year" required onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 4. Event Selection - Multi Select UI */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                    Select Events (max 4)
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>{selectedEvents.length}/4 selected</span>
                                </label>
                            </div>

                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                {['ALL', 'TECHNICAL', 'NON-TECHNICAL'].map(tab => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setFilterTab(tab)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: filterTab === tab ? '#fff' : 'var(--text-muted)',
                                            borderBottom: filterTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                                            paddingBottom: '5px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Event List */}
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {filteredEvents.map((ev) => {
                                    const isSelected = selectedEvents.includes(ev.dbName);
                                    const isFull = isEventFull(ev.dbName);
                                    const disabled = isFull && !isSelected; // Allow unchecking if full but already selected (edge case)

                                    return (
                                        <div
                                            key={ev.id}
                                            onClick={() => !disabled && toggleEvent(ev.dbName)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                background: isSelected ? 'rgba(56, 234, 140, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                                border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                                                borderRadius: '12px',
                                                cursor: disabled ? 'not-allowed' : 'pointer',
                                                opacity: disabled ? 0.6 : 1,
                                                transition: 'all 0.2s',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '20px', height: '20px', borderRadius: '4px',
                                                    border: isSelected ? 'none' : '2px solid var(--text-muted)',
                                                    background: isSelected ? 'var(--primary)' : 'transparent',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {isSelected && <CheckCircle2 size={14} color="#000" />}
                                                </div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>{ev.title}</h4>
                                                    {disabled ? (
                                                        <span style={{ fontSize: '0.7rem', color: '#FF5F56', border: '1px solid #FF5F56', padding: '2px 6px', borderRadius: '4px' }}>FULL</span>
                                                    ) : (
                                                        <span style={{
                                                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px',
                                                            background: ev.category === 'TECHNICAL' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 46, 223, 0.2)',
                                                            color: ev.category === 'TECHNICAL' ? 'var(--neon-blue)' : 'var(--neon-pink)'
                                                        }}>
                                                            {ev.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {ev.time}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {ev.venue}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === "submitting" || !category || selectedEvents.length === 0}
                            className="btn btn-primary"
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                padding: '1.2rem',
                                opacity: (!category || selectedEvents.length === 0) ? 0.5 : 1,
                                cursor: (!category || selectedEvents.length === 0) ? 'not-allowed' : 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {status === "submitting" ? "Processing..." : `Register for ${selectedEvents.length} Event(s)`}
                        </button>

                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegistrationForm;
