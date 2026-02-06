import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Cpu, ShieldCheck, Zap, Award, Terminal, Smartphone, AtSign } from 'lucide-react';

const CoordinatorCard = ({ person, isFaculty, isHOD }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, scale: 1.02 }}
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

const Coordinators = () => {

    const facultyCoords = [
        {
            name: "Dr. M. Ramesh Kumar",
            role: "PROF / Dept of CSE",
            type: "FACULTY_COORD",
            img: null
        },
        {
            name: "Mr. M. Bharathiraja",
            role: "AP / Dept of CSE",
            type: "FACULTY_COORD",
            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const studentCoords = [
        { name: "Mr. S. Prem Kumar", role: "IV - CSE", type: "SYSTEM_NODE" },
        { name: "Mr. P. Babu Prasanth", role: "IV - CSE", type: "SYSTEM_NODE" },
        { name: "Mr. V. Sridhar", role: "IV - CSE", type: "SYSTEM_NODE" },
        { name: "Mr. S. Diva", role: "III - CSE", type: "SYSTEM_NODE" },
        { name: "Mr. S. Subasanjeev", role: "III - CSE", type: "SYSTEM_NODE" },
        { name: "Mr. A. Abish", role: "III - CSE", type: "SYSTEM_NODE" },
        { name: "Ms. K. Apurvasri", role: "III - CSE", type: "SYSTEM_NODE" }
    ];

    return (
        <section id="coordinators" style={{ padding: '120px 0', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="section-subtitle"
                    >
                        Personnel Matrix
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="section-title"
                    >
                        SYSTEM ADMINISTRATORS
                    </motion.h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
                        The official command hierarchy responsible for the seamless execution of INFIQ 2K26.
                    </p>
                </div>

                {/* HOD Section */}
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
                <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, var(--primary), transparent)', margin: '-6rem auto 6rem', opacity: 0.3 }} />

                {/* AHOD Section */}
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

                {/* Grid Layout for Others */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6rem',
                    alignItems: 'center'
                }}>
                    {/* Faculty */}
                    <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {facultyCoords.map((c, idx) => (
                            <CoordinatorCard key={idx} person={c} isFaculty={true} />
                        ))}
                    </div>

                    {/* Students */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '3rem',
                        width: '100%',
                        maxWidth: '1000px'
                    }}>
                        {studentCoords.map((c, idx) => (
                            <CoordinatorCard key={idx} person={c} isFaculty={false} />
                        ))}
                    </div>
                </div>

                {/* Contact Matrix Redesigned to Data Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '12rem',
                        maxWidth: '900px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <div style={{
                        background: 'rgba(11, 15, 26, 0.8)',
                        border: '1px solid var(--primary)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 0 40px rgba(56, 234, 140, 0.1)'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'rgba(56, 234, 140, 0.1)',
                            padding: '1rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--primary)'
                        }}>
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

                        {/* List Items */}
                        <div style={{ padding: '0' }}>
                            {[
                                { label: 'PRIMARY_UPLINK', value: '+91 80726 52321', icon: <Smartphone size={18} />, status: 'ACTIVE' },
                                { label: 'SECURE_MAIL', value: 'infiqcsesymposium@gmail.com', icon: <AtSign size={18} />, status: 'ONLINE' },
                                { label: 'ADMIN_LINE', value: '+91 97876 68997', icon: <ShieldCheck size={18} />, status: 'STANDBY' }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1.5rem 2rem',
                                    borderBottom: idx !== 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    gap: '1rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-muted)'
                                    }}>
                                        {item.icon}
                                    </div>

                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', marginBottom: '2px' }}>{item.label}</span>
                                        <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '600', letterSpacing: '0.5px' }}>{item.value}</span>
                                    </div>

                                    <div style={{
                                        padding: '5px 12px',
                                        background: item.status === 'ACTIVE' ? 'rgba(56, 234, 140, 0.1)' : item.status === 'ONLINE' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: `1px solid ${item.status === 'ACTIVE' ? 'var(--primary)' : item.status === 'ONLINE' ? 'var(--neon-blue)' : 'rgba(255,255,255,0.2)'}`,
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        color: item.status === 'ACTIVE' ? 'var(--primary)' : item.status === 'ONLINE' ? 'var(--neon-blue)' : 'var(--text-muted)',
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

            {/* Background Symbols */}
            <div style={{ position: 'absolute', top: '10%', left: '-5%', opacity: 0.05, fontSize: '20rem', color: 'var(--primary)', fontWeight: '900', userSelect: 'none', filter: 'blur(10px)' }}>USER</div>
            <div style={{ position: 'absolute', bottom: '10%', right: '-5%', opacity: 0.05, fontSize: '20rem', color: 'var(--primary)', fontWeight: '900', userSelect: 'none', filter: 'blur(10px)' }}>ROOT</div>
        </section>
    );
};

export default Coordinators;
