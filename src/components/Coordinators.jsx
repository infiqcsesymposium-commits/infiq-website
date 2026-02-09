import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, Cpu, ShieldCheck, Zap, Award, Terminal, Smartphone, AtSign, Activity, Trophy, Users as UsersIcon } from 'lucide-react';

const CoordinatorCard = ({ person, isFaculty, isHOD }) => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
            position: 'relative',
            width: isHOD ? '380px' : '300px',
            background: 'rgba(15, 17, 26, 0.4)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isHOD ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow: isHOD ? '0 0 30px rgba(56, 234, 140, 0.15)' : 'none'
        }}
    >
        {/* Holographic Scanline Effect */}
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: isHOD ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
            boxShadow: `0 0 10px ${isHOD ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
            animation: 'scanline 3s linear infinite',
            opacity: 0.3,
            zIndex: 1
        }} />

        <div style={{
            position: 'relative',
            width: '110px',
            height: '110px',
            margin: '0 auto 1.5rem',
            padding: '8px',
            borderRadius: '20px',
            border: `2px solid ${isHOD ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
            background: 'rgba(0,0,0,0.3)',
        }}>
            {person.img ? (
                <img
                    src={person.img}
                    alt={person.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', filter: 'contrast(1.1) brightness(0.9)' }}
                />
            ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isHOD ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }}>
                    {isFaculty ? <User size={50} /> : <GraduationCap size={50} />}
                </div>
            )}

            {/* Status Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'var(--primary)',
                border: '2px solid #08090F',
                boxShadow: '0 0 8px var(--primary)'
            }} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem', fontFamily: 'Orbitron', letterSpacing: '1px' }}>
            {person.name}
        </h3>
        <p style={{
            fontSize: '0.75rem',
            color: isHOD ? 'var(--primary)' : '#3B82F6',
            fontWeight: '900',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '1rem'
        }}>
            {person.role}
        </p>

        <div style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.05)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontWeight: '700',
            letterSpacing: '1px'
        }}>
            {person.type}
        </div>
    </motion.div>
);

const EventCoordinators = () => {
    const techEvents = [
        {
            name: "PUBLITEX",
            actual: "Paper Presentation ( Technical )",
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
            actual: "Web / App Development Challenge",
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
            actual: "Hackathon (Mini - 6 to 12 hrs)",
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
            name: "VISIONIX ARVR",
            actual: "AR / VR Challenge",
            faculty: "MR. P. RAGUL",
            III: ["ABDUL RAHUMAN", "SABARINARAYANAN D"],
            II: ["NETHRA SIVA", "MEISINTHA"],
            I: ["KARTHI", "SOWBARNIKA", "VISHALI S"]
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

    const EventUnit = ({ ev, accentColor }) => (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
                background: 'rgba(15, 17, 26, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: `1px solid rgba(255, 255, 255, 0.08)`,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Side Glow Accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: accentColor }} />

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ color: accentColor, fontFamily: 'Share Tech Mono', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: 'bold' }}>{ev.name}</div>
                        <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: '0.4rem 0 0', fontWeight: '800', letterSpacing: '-0.5px' }}>{ev.actual}</h4>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <ShieldCheck size={14} color={accentColor} />
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Faculty Command</span>
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}>{ev.faculty}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor }} />
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>III YEAR</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {ev.III.map(name => (
                                <div key={name} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: accentColor, fontSize: '10px' }}>&gt;</span> {name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>II YEAR</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {ev.II.map(name => (
                                <div key={name} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>&gt;</span> {name}
                                </div>
                            ))}
                        </div>
                    </div>
                    {ev.I && ev.I.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>I YEAR</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {ev.I.map(name => (
                                    <div key={name} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '10px' }}>&gt;</span> {name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Terminal Bottom Footer */}
            <div style={{ padding: '0.75rem 2rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'Share Tech Mono', display: 'flex', justifyContent: 'space-between' }}>
                <span>ENCRYPTED_ACCESS_PORTAL</span>
                <span>ID_{ev.name.substring(0, 4)}</span>
            </div>
        </motion.div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {/* Technical Cluster */}
            <div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}
                >
                    <div style={{ width: '50px', height: '50px', background: 'rgba(56, 234, 140, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--primary)' }}>
                        <Activity size={24} color="var(--primary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', color: '#fff', margin: 0, fontFamily: 'Orbitron', letterSpacing: '2px' }}>TECHNICAL_CLUSTER</h3>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '3px', fontWeight: 'bold' }}>SECTOR: COMPPS_ENG</div>
                    </div>
                </motion.div>

                <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', background: 'rgba(56, 234, 140, 0.03)', border: '1px solid rgba(56, 234, 140, 0.15)', borderRadius: '24px', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>TECH_CMD_FACULTY</div>
                        <div style={{ color: 'var(--primary)', fontSize: '1.4rem', fontWeight: '900', fontFamily: 'Share Tech Mono' }}>DR. S. V. DIVYA</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>TECH_CMD_STUDENT</div>
                        <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '900', fontFamily: 'Share Tech Mono' }}>Ms. K. APURVASRI</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    {techEvents.map(ev => <EventUnit key={ev.name} ev={ev} accentColor="var(--primary)" />)}
                </div>
            </div>

            {/* Non-Technical Cluster */}
            <div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}
                >
                    <div style={{ width: '50px', height: '50px', background: 'rgba(255, 46, 223, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--neon-pink)' }}>
                        <Trophy size={24} color="var(--neon-pink)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', color: '#fff', margin: 0, fontFamily: 'Orbitron', letterSpacing: '2px' }}>CREATIVE_MATRIX</h3>
                        <div style={{ fontSize: '0.7rem', color: 'var(--neon-pink)', letterSpacing: '3px', fontWeight: 'bold' }}>SECTOR: USER_EXP</div>
                    </div>
                </motion.div>

                <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', background: 'rgba(255, 46, 223, 0.03)', border: '1px solid rgba(255, 46, 223, 0.15)', borderRadius: '24px', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>CREATIVE_CMD_FACULTY</div>
                        <div style={{ color: 'var(--neon-pink)', fontSize: '1.4rem', fontWeight: '900', fontFamily: 'Share Tech Mono' }}>MRS. S. VIGNESHWARI</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>CREATIVE_CMD_STUDENT</div>
                        <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '900', fontFamily: 'Share Tech Mono' }}>Mr. ABISH A</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    {nonTechEvents.map(ev => <EventUnit key={ev.name} ev={ev} accentColor="var(--neon-pink)" />)}
                </div>
            </div>
        </div>
    );
};

const Coordinators = () => {
    const [activeTab, setActiveTab] = useState('system');

    const facultyCoords = [
        {
            name: "Mrs. S. Vigneshwari",
            role: "AP / Dept of CSE",
            type: "FACULTY_COORD",
            img: null
        },
        {
            name: "Mr. M. Bharathiraja",
            role: "AP / Dept of CSE",
            type: "FACULTY_COORD",
            img: null
        }
    ];

    const studentCoords = [
        { name: "Mr. S. Prem Kumar", role: "IV - CSE", type: "STUDENT_COORD" },
        { name: "Mr. P. Babu Prasanth", role: "IV - CSE", type: "STUDENT_COORD" },
        { name: "Mr. V. Sridhar", role: "IV - CSE", type: "STUDENT_COORD" }
    ];

    return (
        <section id="coordinators" style={{ padding: '120px 0', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="section-subtitle">Organization Matrix</motion.span>
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="section-title">COMMAND HIERARCHY</motion.h2>

                    <div style={{
                        display: 'inline-flex',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '6px',
                        borderRadius: '100px',
                        marginTop: '2rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <button
                            onClick={() => setActiveTab('system')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '100px',
                                background: activeTab === 'system' ? 'var(--primary)' : 'transparent',
                                border: 'none',
                                color: activeTab === 'system' ? '#000' : '#fff',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <ShieldCheck size={16} /> SYSTEM ADMINS
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '100px',
                                background: activeTab === 'events' ? 'var(--primary)' : 'transparent',
                                border: 'none',
                                color: activeTab === 'events' ? '#000' : '#fff',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <UsersIcon size={16} /> EVENT COORDINATORS
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'system' ? (
                        <motion.div
                            key="system"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginBottom: '8rem', flexWrap: 'wrap' }}>
                                <CoordinatorCard person={{
                                    name: "Dr. T. Kalaikumaran",
                                    role: "HOD / Dept of CSE",
                                    type: "HOD / Dept of CSE",
                                    img: "https://vsbcetc.edu.in/wp-content/uploads/2021/07/Principal-New.jpg"
                                }} isHOD={true} />

                                <CoordinatorCard person={{
                                    name: "Mrs. V. Radha",
                                    role: "HOD / Dept of CSE",
                                    type: "HOD / Dept of CSE",
                                    img: "https://vsbcetc.edu.in/wp-content/uploads/2022/11/CSE-HOD.jpg"
                                }} isHOD={true} />
                            </div>
                            <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, var(--primary), transparent)', margin: '-6rem auto 6rem', opacity: 0.1 }} />

                            <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginBottom: '8rem', flexWrap: 'wrap' }}>
                                <CoordinatorCard person={{
                                    name: "Dr. S. V. Divya",
                                    role: "AHOD / Dept of CSE",
                                    type: "ASSOCIATE COMMAND",
                                    img: null
                                }} isHOD={false} isFaculty={true} />

                                <CoordinatorCard person={{
                                    name: "Mrs. S. Vigneshwari",
                                    role: "AHOD / Dept of CSE",
                                    type: "ASSOCIATE COMMAND",
                                    img: null
                                }} isHOD={false} isFaculty={true} />
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6rem',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {facultyCoords.map((c, idx) => <CoordinatorCard key={idx} person={c} isFaculty={true} />)}
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '3rem',
                                    width: '100%',
                                    maxWidth: '1000px'
                                }}>
                                    {studentCoords.map((c, idx) => <CoordinatorCard key={idx} person={c} isFaculty={false} />)}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="events"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <EventCoordinators />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ marginTop: '12rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}
                >
                    <div style={{ background: 'rgba(11, 15, 26, 0.8)', border: '1px solid var(--primary)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 40px rgba(56, 234, 140, 0.1)' }}>
                        <div style={{ background: 'rgba(56, 234, 140, 0.1)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Terminal size={18} className="text-[#38EA8C]" />
                                <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--primary)', letterSpacing: '1px' }}>COMMUNICATION_CHANNELS</span>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }}></div>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }}></div>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }}></div>
                            </div>
                        </div>
                        <div style={{ padding: '0' }}>
                            {[
                                { label: 'PRIMARY_UPLINK', value: '+91 80726 52321', icon: <Smartphone size={18} />, status: 'ACTIVE' },
                                { label: 'SECURE_MAIL', value: 'infiqcsesymposium@gmail.com', icon: <AtSign size={18} />, status: 'ONLINE' },
                                { label: 'ADMIN_LINE', value: '+91 97876 68997', icon: <ShieldCheck size={18} />, status: 'STANDBY' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: idx !== 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{item.icon}</div>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', marginBottom: '2px' }}>{item.label}</span>
                                        <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '600', letterSpacing: '0.5px' }}>{item.value}</span>
                                    </div>
                                    <div style={{
                                        padding: '5px 12px',
                                        background: item.status === 'ACTIVE' ? 'rgba(56, 234, 140, 0.1)' : (item.status === 'ONLINE' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)'),
                                        border: `1px solid ${item.status === 'ACTIVE' ? 'var(--primary)' : (item.status === 'ONLINE' ? 'var(--neon-blue)' : 'rgba(255,255,255,0.2)')}`,
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        color: item.status === 'ACTIVE' ? 'var(--primary)' : (item.status === 'ONLINE' ? 'var(--neon-blue)' : 'var(--text-muted)'),
                                        fontFamily: 'Share Tech Mono'
                                    }}>
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(0); opacity: 0; }
                    5% { opacity: 0.5; }
                    50% { opacity: 0.1; }
                    95% { opacity: 0.5; }
                    100% { transform: translateY(400px); opacity: 0; }
                }
            `}</style>
            <div style={{ position: 'absolute', top: '10%', left: '-5%', opacity: 0.05, fontSize: '20rem', color: 'var(--primary)', fontWeight: '900', userSelect: 'none', filter: 'blur(10px)' }}>USER</div>
            <div style={{ position: 'absolute', bottom: '10%', right: '-5%', opacity: 0.05, fontSize: '20rem', color: 'var(--primary)', fontWeight: '900', userSelect: 'none', filter: 'blur(10px)' }}>ROOT</div>
        </section>
    );
};

export default Coordinators;
