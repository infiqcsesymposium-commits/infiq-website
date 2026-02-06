import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Trophy,
    TrendingUp, Activity, Search,
    Filter, Download, MoreHorizontal,
    CheckCircle, AlertCircle, Clock, LogOut, X, ChevronDown, Edit2, Save
} from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import * as XLSX from 'xlsx';

const CRMDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Events limit data
    const [events, setEvents] = useState([
        { id: 1, name: "Paper Presentation", registered: 0, limit: 15, status: "OPEN" },
        { id: 2, name: "Project Expo", registered: 0, limit: 15, status: "OPEN" },
        { id: 3, name: "Code Debugging", registered: 0, limit: 15, status: "OPEN" },
        { id: 4, name: "Web Designing", registered: 0, limit: 15, status: "OPEN" },
        { id: 5, name: "Technical Quiz", registered: 0, limit: 15, status: "OPEN" },
        { id: 6, name: "Esports", registered: 0, limit: 15, status: "OPEN" },
        { id: 7, name: "Connections", registered: 0, limit: 15, status: "OPEN" },
        { id: 8, name: "Multimedia Editing", registered: 0, limit: 15, status: "OPEN" },
        { id: 9, name: "Photography", registered: 0, limit: 15, status: "OPEN" },
        { id: 10, name: "Short Film", registered: 0, limit: 15, status: "OPEN" },
        { id: 11, name: "Ideathon", registered: 0, limit: 15, status: "OPEN" }
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
        return () => unsubscribe();
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

            // Update event counts
            const counts = {};
            data.forEach(reg => {
                const evt = reg.eventName;
                counts[evt] = (counts[evt] || 0) + 1;
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
                reg.email?.toLowerCase().includes(lowerTerm)
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(reg => (reg.status || 'PENDING') === statusFilter);
        }

        if (eventFilter !== 'ALL') {
            result = result.filter(reg => reg.eventName === eventFilter);
        }

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
            "Registered At": reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleString() : new Date(reg.createdAt).toLocaleString()
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        XLSX.writeFile(workbook, "INFIQ_Registrations.xlsx");
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

    // Stats
    const totalRegistrations = registrations.length;
    const totalRevenue = registrations.reduce((acc, curr) => {
        if (curr.category === 'OUTER') return acc + 250;
        if (curr.category === 'OTHER_DEPT') return acc + 100;
        return acc;
    }, 0);
    const eventsFull = events.filter(e => e.status === "CLOSED").length;

    return (
        <section style={{ padding: '120px 0', minHeight: '100vh', background: '#05060A' }}>
            <div className="container" style={{ maxWidth: '1400px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span style={{ color: 'var(--primary)', fontFamily: 'Share Tech Mono', letterSpacing: '2px' }}>SYSTEM_ADMIN</span>
                        <h2 style={{ fontSize: '2.5rem', color: '#fff', margin: 0 }}>CRM DASHBOARD</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #FF5F56', color: '#FF5F56' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(56, 234, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={30} color="var(--primary)" />
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Registrations</span>
                            <h3 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>{totalRegistrations}</h3>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255, 46, 223, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trophy size={30} color="var(--neon-pink)" />
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Events Full</span>
                            <h3 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>{eventsFull}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/11</span></h3>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={30} color="var(--neon-blue)" />
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Revenue Generated</span>
                            <h3 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>₹{totalRevenue}</h3>
                        </div>
                    </div>

                </div>

                {/* Filters and Actions Bar */}
                <div className="glass-card" style={{ padding: '1rem 2rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by Team, ID, or Email..."
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ position: 'relative', minWidth: '150px' }}>
                            <select
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    outline: 'none',
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="ALL">All Events</option>
                                {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                            </select>
                            <Filter size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>
                        <div style={{ position: 'relative', minWidth: '150px' }}>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    outline: 'none',
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>
                    </div>

                    <button onClick={handleExport} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} /> Export Excel
                    </button>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>

                    {/* Registrations Table */}
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Registration Data</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Showing {filteredRegistrations.length} entries</span>
                        </div>

                        <div className="no-scrollbar" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', color: '#fff', fontWeight: '600' }}>Team / Student</th>
                                        <th style={{ padding: '1rem', color: '#fff', fontWeight: '600' }}>Event</th>
                                        <th style={{ padding: '1rem', color: '#fff', fontWeight: '600' }}>Category</th>
                                        <th style={{ padding: '1rem', color: '#fff', fontWeight: '600' }}>Contact</th>
                                        <th style={{ padding: '1rem', color: '#fff', fontWeight: '600' }}>Status</th>
                                        <th style={{ padding: '1rem', color: '#fff', fontWeight: '600', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }}>Loading data...</td></tr>
                                    ) : filteredRegistrations.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }}>No matching records found.</td></tr>
                                    ) : (
                                        filteredRegistrations.map(row => (
                                            <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ display: 'block', color: '#fff', fontWeight: '600' }}>{row.teamName}</span>
                                                    <span style={{ fontSize: '0.8rem' }}>{row.studentName}</span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>{row.eventName}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold',
                                                        background: row.category === 'CSE_ONLY' ? 'rgba(56, 234, 140, 0.1)' : row.category === 'OUTER' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 46, 223, 0.1)',
                                                        color: row.category === 'CSE_ONLY' ? 'var(--primary)' : row.category === 'OUTER' ? 'var(--neon-blue)' : 'var(--neon-pink)'
                                                    }}>
                                                        {row.category}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontSize: '0.8rem' }}>{row.email}</div>
                                                    <div style={{ fontSize: '0.8rem' }}>{row.phoneNumber}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        {(!row.status || row.status === 'PENDING') && <Clock size={14} color="#FFBD2E" />}
                                                        {row.status === 'APPROVED' && <CheckCircle size={14} color="var(--primary)" />}
                                                        {row.status === 'REJECTED' && <AlertCircle size={14} color="#FF5F56" />}

                                                        <span style={{
                                                            color: (!row.status || row.status === 'PENDING') ? '#FFBD2E' : row.status === 'APPROVED' ? 'var(--primary)' : '#FF5F56',
                                                            textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold'
                                                        }}>
                                                            {row.status || 'PENDING'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <button onClick={() => openModal(row)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px' }}>
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Side: Slots Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem' }}>Live Event Status</h3>
                            <div className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                                {events.map(ev => (
                                    <div key={ev.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ color: '#fff', fontSize: '0.9rem' }}>{ev.name}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    color: ev.status === 'CLOSED' ? '#FF5F56' : ev.status === 'FILLING FAST' ? '#FFBD2E' : 'var(--primary)',
                                                    fontWeight: 'bold'
                                                }}>{ev.status}</span>
                                                <button
                                                    onClick={() => openEditLimit(ev)}
                                                    style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                                                    title="Edit Capacity"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Edit Mode Inline */}
                                        {editingEvent && editingEvent.id === ev.id ? (
                                            <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                                <input
                                                    type="number"
                                                    value={newLimit}
                                                    onChange={(e) => setNewLimit(e.target.value)}
                                                    style={{ width: '60px', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--primary)', background: '#000', color: '#fff' }}
                                                />
                                                <button
                                                    onClick={saveLimit}
                                                    style={{ background: 'var(--primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#000', padding: '2px 8px' }}>
                                                    <Save size={12} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingEvent(null)}
                                                    style={{ background: '#FF5F56', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff', padding: '2px 8px' }}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${Math.min((ev.registered / ev.limit) * 100, 100)}%`,
                                                    height: '100%',
                                                    background: ev.status === 'CLOSED' ? '#FF5F56' : ev.status === 'FILLING FAST' ? '#FFBD2E' : 'var(--primary)'
                                                }} />
                                            </div>
                                        )}

                                        <div style={{ textAlign: 'right', fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                                            {ev.registered} / {ev.limit} Teams
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
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
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>College</label>
                                            <div style={{ color: '#fff' }}>{selectedRegistration.collegeName}</div>
                                        </div>
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
            </AnimatePresence>

        </section>
    );
};

export default CRMDashboard;
