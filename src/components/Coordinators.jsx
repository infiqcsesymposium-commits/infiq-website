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
    const hod = {
        name: "Dr. L. S. Sindhuja",
        role: "HOD / Dept of CSE",
        type: "SYSTEM_COMMANDER",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    };

    const facultyCoords = [
        {
            name: "Mr. M. Bharathiraja",
            role: "AP / Dept of CSE",
            type: "ROOT_ADMIN",
            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const studentCoords = [
        { name: "Mr. S. Pream Kumar", role: "IV - CSE", type: "SYSTEM_NODE" },
        { name: "Mr. P. Babu Prasanth", role: "IV - CSE", type: "SYSTEM_NODE" },
        { name: "Mr. V. Sridhar", role: "IV - CSE", type: "SYSTEM_NODE" }
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8rem' }}>
                    <CoordinatorCard person={hod} isHOD={true} />
                    <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, var(--primary), transparent)', marginTop: '2rem', opacity: 0.3 }} />
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

                {/* Contact Matrix */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '12rem',
                        padding: '4rem',
                        background: 'rgba(15, 17, 26, 0.6)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(56, 234, 140, 0.1)',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <Zap size={24} className="text-[#38EA8C] animate-pulse" />
                        <h3 style={{ fontSize: '1.4rem', letterSpacing: '2px', margin: 0, fontFamily: 'Orbitron' }}>SUPPORT_MATRIX.XLSX</h3>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '3rem',
                        alignItems: 'start'
                    }}>
                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <Smartphone size={20} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Direct Uplink</span>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '900' }}>80726 52321</span>
                        </div>
                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <AtSign size={20} style={{ color: '#3B82F6', marginBottom: '1rem' }} />
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Network Address</span>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '900' }}>infiqcsesymposium@gmail.com</span>
                        </div>
                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <Terminal size={20} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Root Admin</span>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '900' }}>97876 68997</span>
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
