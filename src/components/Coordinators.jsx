import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, ShieldCheck, Zap, Terminal, Smartphone, AtSign, Activity, Trophy, Users as UsersIcon, Hexagon, Fingerprint, Cpu, Search } from 'lucide-react';
import radhaImg from '../assets/WhatsApp Image 2026-02-09 at 11.51.24 AM (1).jpeg';
import kalaiImg from '../assets/WhatsApp Image 2026-02-09 at 11.51.24 AM.jpeg';
import premImg from '../assets/WhatsApp Image 2026-02-09 at 1.28.28 PM.jpeg';
import sridharImg from '../assets/WhatsApp Image 2026-02-09 at 1.35.03 PM.jpeg';
import abishImg from '../assets/WhatsApp Image 2026-02-09 at 11.48.24 AM (1).jpeg';
import apurvaImg from '../assets/WhatsApp Image 2026-02-09 at 11.48.24 AM (2).jpeg';
import divaImg from '../assets/WhatsApp Image 2026-02-09 at 11.48.24 AM.jpeg';
import subaImg from '../assets/mypic.jpg.jpeg';
const HeaderSection = () => (
    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.5rem 1.5rem',
                background: 'rgba(56, 234, 140, 0.1)',
                border: '1px solid rgba(56, 234, 140, 0.2)',
                borderRadius: '100px',
                marginBottom: '1.5rem'
            }}
        >
            <Fingerprint size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>DECRYPTING_HIERARCHY</span>
        </motion.div>

        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title holo-text"
            style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 'clamp(3rem, 8vw, 5rem)' }}
        >
            COMMAND CENTER
        </motion.h2>

        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}
        >
            Accessing decentralized node network. Authorized personnel list decrypted.
        </motion.p>
    </div>
);

const CoordinatorCard = ({ person, isFaculty, isHOD, index = 0 }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 60, rotateX: 15, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
            duration: 0.8,
            delay: index * 0.05,
            ease: [0.215, 0.61, 0.355, 1]
        }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="glass-dossier"
        style={{
            position: 'relative',
            width: isHOD ? '360px' : '300px',
            padding: '2.5rem 1.5rem',
            borderRadius: '24px',
            textAlign: 'center',
            zIndex: 1
        }}
    >
        {/* Holographic Mesh Background */}
        <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(56, 234, 140, 0.1), transparent 70%)',
            pointerEvents: 'none',
            borderRadius: 'inherit'
        }} />

        {/* Tech Corner Accents */}
        <div style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.3 }}>
            <Hexagon size={16} color="var(--primary)" />
        </div>

        <div className="coord-img-wrapper" style={{ width: '120px', height: '120px', margin: '0 auto 2rem' }}>
            <div style={{
                width: '100%',
                height: '100%',
                background: '#08090F',
                borderRadius: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {person.img ? (
                    <img
                        src={person.img}
                        alt={person.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ color: 'var(--primary)', opacity: 0.5 }}>
                        {isFaculty ? <ShieldCheck size={48} /> : <User size={48} />}
                    </div>
                )}
            </div>

            {/* Online Pulse */}
            <div style={{
                position: 'absolute',
                bottom: '8%',
                right: '8%',
                width: '14px',
                height: '14px',
                background: 'var(--primary)',
                borderRadius: '50%',
                border: '3px solid #0F111A',
                boxShadow: '0 0 10px var(--primary)'
            }} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>
            {person.name}
        </h3>

        <div style={{
            color: isHOD ? 'var(--primary)' : 'var(--neon-blue)',
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '1.5rem'
        }}>
            {person.role}
        </div>

        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.5rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '100px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontFamily: 'Share Tech Mono'
        }}>
            <Terminal size={12} />
            {person.type}
        </div>
    </motion.div>
);

const EventCoordinators = () => {
    const [selectedCategory, setSelectedCategory] = useState('TECHNICAL');

    const techEvents = [
        {
            name: "PUBLITEX",
            actual: "Paper Presentation",
            faculty: "DR. ANNAPOORANI",
            III: ["ABHI ROOPA BAGAVATHI", "AMRUTHAVARSHINI S", "VIDHYASREE M"],
            II: ["DINESHKUMAR", "KARTHIKEYAN", "ABINAYA T"],
            I: ["KAMILINI", "DIANA JAZLYN"]
        },
        {
            name: "CODE SURGEON",
            actual: "Debugging Challenge",
            faculty: "MR. M. MARIKUMAR",
            III: ["ARCHANA KARUNYA S", "HEMAVARINI"],
            II: ["LAKSHAMANAN T", "GANESH KUMAR"],
            I: ["NAVANEEDHAN", "MUTHURITHANYA", "KEERTHANA K"]
        },
        {
            name: "INNOVEXPO",
            actual: "Project Expo",
            faculty: "MR. M. RAJSEKAR",
            III: ["PARTHASARATHI S", "PANDEESHWARI M"],
            II: ["KAILASH K", "GOWSHIKA E"],
            I: ["HEMANMATHIV", "HARIDARSHINI", "BIRUNDHADEVI J"]
        },
        {
            name: "DEVATHON",
            actual: "Web / App Development",
            faculty: "DR. JAMUNA",
            III: ["MOHANAPRIYA C", "MOHAN", "AKALYA"],
            II: ["BALAVIGNESH M", "DHARSHINI A"],
            I: ["KARTHI KANNAN", "HARINI K"]
        },
        {
            name: "QUIZTRON",
            actual: "Tech Quiz",
            faculty: "MRS. R. BHAVANI",
            III: ["KIRUTHIGA C S", "KEERTHANA P", "RAHULRAJ"],
            II: ["NARMATHA M", "SOWMIYA T"],
            I: ["PRATHEESH", "ROSHNAG"]
        },
        {
            name: "CODEFUSION",
            actual: "Hackathon",
            faculty: "DR. G. NEELAMEGAM",
            III: ["SUBHASRI S", "CHARUNETHRA MS", "SREE GAYATHREE R"],
            II: ["VANATHI P", "SATHIYAMOOORTHI S"],
            I: ["NAVANEETHAKRISHNAN", "PAVITHRADS"]
        }
    ];

    const nonTechEvents = [
        {
            name: "PIXEL VISION",
            actual: "Photography Contest",
            faculty: "MR. KUMAREESAN",
            III: ["LOGITH T A", "DHARANEESH"],
            II: ["PRANUSH J R", "RAMANATHAN S"],
            I: ["VIJAY VASANTHAN", "SWATHI", "BHARATHIKANNAN"]
        },
        {
            name: "POSTERIA",
            actual: "Poster Design",
            faculty: "MRS. VAISHNAVIKARTHIGA",
            III: ["GOKULAVASAN", "SELVAKUMARAN G"],
            II: ["PRASANTH", "KALAIARASAN P"],
            I: ["VIKASH", "SWATHIKA", "VENKATESH A"]
        },
        {
            name: "POPFRENZY",
            actual: "Quiz (Non-Tech / Pop Culture)",
            faculty: "MRS. P. KOHILA",
            III: ["ADWIN JESO", "ARUNADEVI J", "DRAKSHITHA"],
            II: ["SHAM K", "MIRTHANA J"],
            I: ["RAGHAVAN", "RAGUL"]
        },
        {
            name: "LINKSTROM",
            actual: "Connections",
            faculty: "MRS. M. RAMADEVI",
            III: ["VARSHA PS", "SHIKA RJ", "SRI VARSHINI"],
            II: ["ANTON BRAIL", "ARUN S"],
            I: ["ANTONY VIMALDO", "GAYATHIRI N"]
        },
        {
            name: "LOGOZO",
            actual: "Logo Design",
            faculty: "MR. KATHIRESAN",
            III: ["KALAIVANI", "RAMESH S", "NITIN M"],
            II: ["YOGESHWAR P", "MOHAMMED THOUFIC"],
            I: ["DEEBAK", "DHEKSHAS"]
        }
    ];

    const EventCard = ({ ev, isTech, index }) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-dossier"
            style={{
                padding: '2rem',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle at top right, ${isTech ? 'rgba(56, 234, 140, 0.1)' : 'rgba(124, 58, 237, 0.1)'}, transparent)`,
                pointerEvents: 'none'
            }} />

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: isTech ? 'var(--primary)' : 'var(--accent-purple)', fontFamily: 'Share Tech Mono', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>{ev.name}</div>
                <h4 style={{ color: '#fff', fontSize: '1.4rem', margin: '0.5rem 0 0', fontWeight: '800' }}>{ev.actual}</h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isTech ? 'rgba(56, 234, 140, 0.1)' : 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${isTech ? 'var(--primary)' : 'var(--accent-purple)'}` }}>
                    <ShieldCheck size={20} color={isTech ? 'var(--primary)' : 'var(--accent-purple)'} />
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>FACULTY LEAD</div>
                    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>{ev.faculty}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                    { year: 'III', list: ev.III, color: isTech ? 'var(--primary)' : 'var(--accent-purple)' },
                    { year: 'II', list: ev.II, color: 'rgba(255,255,255,0.4)' },
                    { year: 'I', list: ev.I || [], color: 'rgba(255,255,255,0.2)' }
                ].map((group, idx) => (
                    <div key={idx}>
                        <div style={{ fontSize: '0.65rem', color: group.color, fontWeight: '900', marginBottom: '10px' }}>{group.year}_NODE</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {group.list.map(name => (
                                <div key={name} style={{ fontSize: '0.7rem', color: idx === 0 ? '#fff' : 'var(--text-muted)', lineHeight: '1.2' }}>{name}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div style={{ width: '100%' }}>
            {/* Category Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
                {['TECHNICAL', 'NON-TECHNICAL'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '1rem 3rem',
                            background: selectedCategory === cat ? (cat === 'TECHNICAL' ? 'rgba(56, 234, 140, 0.1)' : 'rgba(124, 58, 237, 0.1)') : 'transparent',
                            border: `1px solid ${selectedCategory === cat ? (cat === 'TECHNICAL' ? 'var(--primary)' : 'var(--accent-purple)') : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '16px',
                            color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {cat === 'TECHNICAL' ? <Activity size={18} /> : <Trophy size={18} />}
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {(selectedCategory === 'TECHNICAL' ? techEvents : nonTechEvents).map((ev, idx) => (
                    <EventCard key={ev.name} ev={ev} isTech={selectedCategory === 'TECHNICAL'} index={idx} />
                ))}
            </div>
        </div>
    );
};

const Coordinators = () => {
    const [activeTab, setActiveTab] = useState('SYSTEM');

    return (
        <section id="coordinators" style={{ padding: '140px 0', minHeight: '100vh', overflow: 'hidden' }}>
            <div className="container">
                <HeaderSection />

                {/* Main Tab Switcher */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '8px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        {['SYSTEM', 'EVENTS'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '1.2rem 4rem',
                                    borderRadius: '18px',
                                    background: activeTab === tab ? 'var(--primary)' : 'transparent',
                                    border: 'none',
                                    color: activeTab === tab ? '#000' : '#fff',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    letterSpacing: '2px',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                {tab === 'SYSTEM' ? <ShieldCheck size={20} /> : <UsersIcon size={20} />}
                                {tab}_NODES
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'SYSTEM' ? (
                        <motion.div
                            key="system"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Command Core */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginBottom: '10rem' }}>
                                <CoordinatorCard index={0} person={{ name: "Dr. T. Kalaikumaran", role: "Principal_Admin", type: "PRINCIPAL / VSBCETC", img: kalaiImg }} isHOD={true} />
                                <CoordinatorCard index={1} person={{ name: "Mrs. V. Radha", role: "Strategic_Lead", type: "HOD / DEPT OF CSE", img: radhaImg }} isHOD={true} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', justifyContent: 'center' }}>
                                <CoordinatorCard index={2} person={{ name: "Dr. S. V. Divya", role: "Associate_Cmd", type: "ASSOCIATE HOD", img: null }} isFaculty={true} />
                                <CoordinatorCard index={3} person={{ name: "Mrs. S. Vigneshwari", role: "Associate_Cmd", type: "ASSOCIATE HOD", img: null }} isFaculty={true} />
                                <CoordinatorCard index={4} person={{ name: "Mr. M. Bharathiraja", role: "Faculty_Ops", type: "ASST PROFESSOR", img: null }} isFaculty={true} />
                            </div>

                            <div style={{ margin: '8rem 0', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

                            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                                <h3 style={{ fontSize: '1.8rem', color: '#fff', fontFamily: 'Orbitron' }}>FIELD_OPERATIVES</h3>
                                <div style={{ color: 'var(--primary)', letterSpacing: '4px', fontSize: '0.7rem' }}>UNDERGRADUATE_COUNCIL</div>
                            </div>

                            {/* Strategic Council (IV Years) */}
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-block', padding: '0.4rem 1.5rem', background: 'rgba(56, 234, 140, 0.05)', border: '1px solid rgba(56, 234, 140, 0.1)', borderRadius: '4px', color: 'var(--primary)', fontSize: '0.65rem', fontFamily: 'Share Tech Mono', letterSpacing: '3px' }}>
                                    STRATEGIC_COUNCIL // IV_YEAR
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto 8rem' }}>
                                <CoordinatorCard index={0} person={{ name: "Mr. S. Prem Kumar", role: "Student_Lead", type: "IV YEAR - CSE", img: premImg }} />
                                <CoordinatorCard index={1} person={{ name: "Mr. P. Babu Prasanth", role: "Student_Lead", type: "IV YEAR - CSE" }} />
                                <CoordinatorCard index={2} person={{ name: "Mr. V. Sridhar", role: "Student_Lead", type: "IV YEAR - CSE", img: sridharImg }} />
                            </div>

                            {/* Technical & Non-Technical Split (III Years) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '4rem', maxWidth: '1100px', margin: '0 auto' }}>
                                {/* Technical Council */}
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                        <div style={{ display: 'inline-block', padding: '0.4rem 1.5rem', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.1)', borderRadius: '4px', color: 'var(--neon-blue)', fontSize: '0.65rem', fontFamily: 'Share Tech Mono', letterSpacing: '3px' }}>
                                            TECHNICAL_COUNCIL // III_YEAR
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                                        <CoordinatorCard index={0} person={{ name: "Mr. S. Diva", role: "Tech_Lead", type: "III YEAR - CSE", img: divaImg }} />
                                        <CoordinatorCard index={1} person={{ name: "Ms. K. Apurvasri", role: "Tech_Lead", type: "III YEAR - CSE", img: apurvaImg }} />
                                    </div>
                                </div>

                                {/* Non-Technical Council */}
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                        <div style={{ display: 'inline-block', padding: '0.4rem 1.5rem', background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.1)', borderRadius: '4px', color: 'var(--accent-purple)', fontSize: '0.65rem', fontFamily: 'Share Tech Mono', letterSpacing: '3px' }}>
                                            NON_TECHNICAL_COUNCIL // III_YEAR
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                                        <CoordinatorCard index={2} person={{ name: "Mr. S. Subasanjeev", role: "Tactical_Lead", type: "III YEAR - CSE", img: subaImg }} />
                                        <CoordinatorCard index={3} person={{ name: "Mr. A. Abish", role: "Tactical_Lead", type: "III YEAR - CSE", img: abishImg }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="events"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <EventCoordinators />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Terminal Communication Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{ marginTop: '12rem', maxWidth: '1000px', margin: '12rem auto 0' }}
                >
                    <div className="glass-dossier" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--primary)', background: 'rgba(8, 9, 15, 0.9)' }}>
                        <div style={{ background: 'rgba(56, 234, 140, 0.05)', padding: '1.2rem 2.5rem', borderBottom: '1px solid rgba(56, 234, 140, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Activity size={20} color="var(--primary)" />
                                <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--primary)', letterSpacing: '2px', fontWeight: 'bold' }}>NETWORK_UPLINK_STATUS: SECURE</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            {[
                                { label: 'PRIMARY_TX', value: '+91 80726 52321', icon: <Smartphone />, status: 'ACTIVE' },
                                { label: 'ENCRYPTED_MAIL', value: 'infiqcsesymposium@gmail.com', icon: <AtSign />, status: 'STABLE' },
                                { label: 'SECONDARY_TX', value: '+91 97876 68997', icon: <ShieldCheck />, status: 'STANDBY' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ padding: '2.5rem', borderRight: idx !== 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', textAlign: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', letterSpacing: '2px', marginBottom: '8px' }}>{item.label}</div>
                                    <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', overflowWrap: 'break-word' }}>{item.value}</div>
                                    <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(56, 234, 140, 0.1)', border: '1px solid var(--primary)', borderRadius: '4px', fontSize: '0.6rem', color: 'var(--primary)', fontFamily: 'Share Tech Mono' }}>
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Coordinators;
