import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Ticket, Clock, Zap, Trophy, Rocket,
    Gamepad2, Lightbulb, Users, MapPin,
    Calendar, ArrowRight, CheckCircle2,
    ShieldAlert, Search, Code, Cpu, Globe
} from 'lucide-react';

/* 1. Event Passes Section */
export const EventPasses = () => {
    return (
        <section className="passes-section" style={{ background: 'transparent', padding: '120px 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-subtitle">ACCESS PROTOCOLS</span>
                        <h2 className="section-title">SECURE ENTRY</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
                            Select your access level to penetrate the INFIQ 2K26 mainframe.
                        </p>
                    </motion.div>
                </div>

                <div className="events-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* 1. Outer College Pass */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            border: '1px solid var(--neon-blue)',
                            background: 'linear-gradient(145deg, rgba(15, 17, 26, 0.9), rgba(0, 229, 255, 0.05))',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                margin: '0 auto 1.5rem',
                                background: 'rgba(0, 229, 255, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--neon-blue)',
                                boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)'
                            }}>
                                <Globe size={28} style={{ color: 'var(--neon-blue)' }} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>OUTER COLLEGE</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Students from other institutions</p>

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '5px', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '1rem', marginTop: '5px', color: 'var(--text-muted)' }}>₹</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Orbitron', lineHeight: 1 }}>250</span>
                            </div>

                            <ul style={{ textAlign: 'left', marginBottom: '2.5rem', space: 'y-3' }}>
                                {['Full Event Access', 'Food & Hydration', 'Certificate of Merit', 'Networking Access'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--neon-blue)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/register" className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)' }}>
                                REGISTER NOW
                            </Link>
                        </div>
                    </motion.div>

                    {/* 2. Other Departments Pass */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            border: '1px solid var(--neon-pink)',
                            background: 'linear-gradient(145deg, rgba(15, 17, 26, 0.9), rgba(255, 46, 223, 0.05))',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                margin: '0 auto 1.5rem',
                                background: 'rgba(255, 46, 223, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--neon-pink)',
                                boxShadow: '0 0 20px rgba(255, 46, 223, 0.2)'
                            }}>
                                <Users size={28} style={{ color: 'var(--neon-pink)' }} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>OTHER DEPTS</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>VSBCETC Students (Non-CSE/AI)</p>

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '5px', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '1rem', marginTop: '5px', color: 'var(--text-muted)' }}>₹</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Orbitron', lineHeight: 1 }}>100</span>
                            </div>

                            <ul style={{ textAlign: 'left', marginBottom: '2.5rem', space: 'y-3' }}>
                                {['Full Event Access', 'Food & Hydration', 'Participate & Win', 'Campus Resources'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--neon-pink)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/register" className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--neon-pink)', color: 'var(--neon-pink)' }}>
                                REGISTER NOW
                            </Link>
                        </div>
                    </motion.div>

                    {/* 3. CSE Intra College - Free */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            border: '1px solid var(--primary)',
                            background: 'linear-gradient(145deg, rgba(15, 17, 26, 0.9), rgba(56, 234, 140, 0.05))',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: '15px', right: '-30px', transform: 'rotate(45deg)',
                            background: 'var(--primary)', color: '#000', padding: '5px 40px', fontSize: '0.7rem', fontWeight: 'bold'
                        }}>
                            EXCLUSIVE
                        </div>

                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                margin: '0 auto 1.5rem',
                                background: 'rgba(56, 234, 140, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--primary)',
                                boxShadow: '0 0 20px rgba(56, 234, 140, 0.2)'
                            }}>
                                <Ticket size={28} style={{ color: 'var(--primary)' }} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Orbitron' }}>CSE</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>VSBCETC Dept Students Only</p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', height: '60px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', fontFamily: 'Orbitron', letterSpacing: '2px' }}>FREE</span>
                            </div>

                            <ul style={{ textAlign: 'left', marginBottom: '2.5rem', space: 'y-3' }}>
                                {['Full Event Access', 'Food & Hydration', 'Certificate provided', 'Host Privileges'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontSize: '0.9rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                REGISTER FREE
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Important Notices Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '3rem auto 0' }}>

                    {/* Deadline Notice */}
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'start', gap: '1.5rem', borderLeft: '4px solid #FF2EDF' }}>
                        <div style={{ color: '#FF2EDF', background: 'rgba(255, 46, 223, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>TIME CRITICAL</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                Registration portal closes on <span style={{ color: '#FF2EDF', fontWeight: 'bold' }}>13/02/2026</span>. Secure your slot before system lockdown.
                            </p>
                        </div>
                    </div>

                    {/* Special Events Notice */}
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'start', gap: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
                        <div style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>PROTOCOL ALERT</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                <strong>Ideathon, Startup Arena & Esports:</strong><br />
                                Abstract submission required first. Payment only after selection confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* 2. Countdown & Marquee Section */
export const EventCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date("February 24, 2026 09:00:00").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Helper for rendering digits with leading zero
    const formatTime = (time) => String(time).padStart(2, '0');

    return (
        <section style={{ padding: '80px 0', background: 'transparent', position: 'relative' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-subtitle" style={{ fontSize: '0.8rem', letterSpacing: '4px' }}>TEMPORAL DATA</span>
                        <h3 style={{
                            fontSize: '2.5rem',
                            color: '#fff',
                            margin: '10px 0',
                            textShadow: '0 0 20px rgba(56, 234, 140, 0.4)',
                            fontFamily: 'Orbitron'
                        }}>
                            SYSTEM LAUNCH IN
                        </h3>
                    </motion.div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    {[
                        { label: 'DAYS', value: timeLeft.days },
                        { label: 'HOURS', value: timeLeft.hours },
                        { label: 'MINUTES', value: timeLeft.minutes },
                        { label: 'SECONDS', value: timeLeft.seconds }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <div className="glass-card" style={{
                                width: '120px',
                                height: '140px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(15, 17, 26, 0.8)',
                                borderRadius: '16px',
                                border: '1px solid rgba(56, 234, 140, 0.2)',
                                boxShadow: '0 0 30px rgba(56, 234, 140, 0.1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Animated Scanline */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    background: 'var(--primary)',
                                    boxShadow: '0 0 10px var(--primary)',
                                    animation: 'scanline 3s linear infinite',
                                    opacity: 0.5
                                }} />

                                <span style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '900',
                                    color: '#fff',
                                    fontFamily: 'Orbitron',
                                    textShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
                                }}>
                                    {formatTime(item.value)}
                                </span>
                            </div>
                            <span style={{
                                marginTop: '1rem',
                                color: 'var(--primary)',
                                fontSize: '0.8rem',
                                letterSpacing: '2px',
                                fontWeight: '800'
                            }}>
                                {item.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="marquee-container" style={{ marginTop: '5rem', background: 'rgba(56, 234, 140, 0.05)', borderTop: '1px solid rgba(56, 234, 140, 0.1)', borderBottom: '1px solid rgba(56, 234, 140, 0.1)' }}>
                <div className="marquee-content">
                    {[1, 2, 3, 4].map((i) => (
                        <span key={i} className="marquee-item" style={{ color: 'var(--primary)' }}>
                            Technical Events *<span>✦</span> NON-Technical Events *<span>✦</span> PROJECT EXPO <span>✦</span> WORKSHOPS <span>✦</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* 3. Cash Prize Events Section */
const CountUp = ({ to, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(to.substring(0, 2));
        if (start === end) return;

        let totalMilisecondsStep = Math.abs(Math.floor(duration * 1000 / end));

        let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, totalMilisecondsStep);

        return () => clearInterval(timer);
    }, [to, duration]);

    return <span>{count}K</span>;
};

export const PrizeShowcase = () => {
    const cashEvents = [
        {
            title: "ESPORTS",
            category: "GAMING",
            icon: <Gamepad2 size={32} />,
            desc: "The ultimate competitive gaming tournament. Battle for the top spot in Free Fire.",
            color: "#FF2EDF"
        },
        {
            title: "IDEATHON",
            category: "INNOVATION",
            icon: <Lightbulb size={32} />,
            desc: "Pitch technology-driven solutions to real-world problems and win massive rewards.",
            color: "#3B82F6"
        },
        {
            title: "PROJECT EXPO",
            category: "ENGINEERING",
            icon: <Rocket size={32} />,
            desc: "Demonstrate working hardware or software prototypes. Scaling ideas to production.",
            color: "#38EA8C"
        }
    ];

    return (
        <section className="prize-highlights" style={{ padding: '120px 0', background: 'linear-gradient(to bottom, #08090F, #0B0F1A)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <span className="section-subtitle">The Rewards</span>
                    <h2 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                        ₹<CountUp to="50K" />
                        <span style={{ display: 'block', fontSize: '1rem', color: 'var(--text-muted)', marginTop: '10px' }}>TOTAL PRIZE POOL TO BE CONQUERED</span>
                    </h2>
                </div>

                <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                    {cashEvents.map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -15, scale: 1.02 }}
                            className="glass-card"
                            style={{
                                padding: '3rem',
                                borderTop: `4px solid ${event.color}`,
                                background: 'rgba(15, 17, 26, 0.6)',
                                boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${event.color}11`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <div style={{ color: event.color, background: `${event.color}11`, padding: '15px', borderRadius: '15px' }}>{event.icon}</div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '950', color: event.color, letterSpacing: '2px', textTransform: 'uppercase' }}>{event.category}</span>
                                    <div className="badge" style={{ background: 'rgba(56, 234, 140, 0.1)', color: 'var(--primary)', display: 'block', marginTop: '5px' }}>CASH_PRIZE</div>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>{event.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2.5rem' }}>{event.desc}</p>
                            <button className="btn btn-outline" style={{ width: '100%', borderColor: `${event.color}44`, color: event.color, fontWeight: '800' }}>
                                REWARD_DETAILS
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* 4. Pre-registration Events Section */
export const InnovationShowcase = () => {
    const preEvents = [
        { title: "IDEATHON", icon: <Lightbulb size={40} />, desc: "Submit abstract for tech solutions to real problems.", color: "var(--neon-blue)" },
        { title: "ESPORTS", icon: <Gamepad2 size={40} />, desc: "Competitive Free Fire tournament with pre-selection.", color: "var(--neon-pink)" },
        { title: "STARTUP ARENA", icon: <Rocket size={40} />, desc: "Entrepreneurial pitch for business innovations.", color: "var(--neon-purple)" }
    ];

    return (
        <section style={{ background: 'rgba(11, 15, 26, 0.4)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <span className="section-subtitle">Showcase Your Innovation</span>
                    <h2 className="section-title">Pre-registering Events</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Require abstract submission and shortlisting before final payment.</p>
                </div>

                <div className="events-grid">
                    {preEvents.map((event, idx) => (
                        <div key={idx} className="glass-card" style={{ padding: '3rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.6rem', background: 'var(--neon-green)', color: '#000', padding: '2px 8px', borderRadius: '2px', fontWeight: 'bold' }}>FREE SUBMISSION</div>

                            <div style={{ color: event.color, marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>{event.icon}</div>

                            <h3 className="text-center" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{event.title}</h3>
                            <p className="text-center" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{event.desc}</p>

                            <div className="glass-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                                <span style={{ color: 'var(--neon-green)', fontSize: '0.7rem', fontWeight: 'bold' }}>PAY ONLY IF SHORTLISTED</span>
                            </div>

                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2rem', fontStyle: 'italic' }}>
                                Submit details via Google Form first. Payment link shared with selected teams later.
                            </p>

                            <button className="btn btn-primary" style={{ width: '100%' }}>View & Submit</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* 5. Categories Section */
export const CategoryExplore = () => {
    return (
        <section className="categories">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <span className="section-subtitle">Explore Domains</span>
                    <h2 className="section-title">Event Categories</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card"
                        style={{ padding: '4rem', display: 'flex', gap: '2rem', alignItems: 'center', borderRight: '4px solid var(--neon-blue)' }}
                    >
                        <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '2rem', borderRadius: '12px' }}>
                            <Code size={48} className="text-[#00E5FF]" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Technical</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Coding, circuits, and cutting-edge tech challenges.</p>
                            <button style={{ background: 'none', border: 'none', color: 'var(--neon-blue)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                VIEW EVENTS <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card"
                        style={{ padding: '4rem', display: 'flex', gap: '2rem', alignItems: 'center', borderRight: '4px solid var(--neon-purple)' }}
                    >
                        <div style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '2rem', borderRadius: '12px' }}>
                            <Cpu size={48} className="text-[#7C3AED]" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Non-Technical</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Art, gaming, and creative networking sessions.</p>
                            <button style={{ background: 'none', border: 'none', color: 'var(--neon-purple)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                VIEW EVENTS <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center" style={{ marginTop: '6rem' }}>
                    <Link to="/coordinators" className="btn btn-outline" style={{ padding: '1.2rem 4rem' }}>
                        MEET OUR TEAM
                    </Link>
                </div>
            </div>
        </section>
    );
};

/* 6. Location & Poster Section */
export const PosterLocation = () => {
    return (
        <section style={{ borderTop: '1px solid var(--glass-border)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card"
                        style={{ padding: '1.5rem', background: '#000' }}
                    >
                        <div style={{ height: '500px', background: 'url("https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1000") center/cover', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)' }}>
                                <span style={{ color: '#fff', fontSize: '0.8rem', letterSpacing: '2px' }}>OFFICIAL EVENT POSTER</span>
                            </div>
                        </div>
                    </motion.div>

                    <div>
                        <span className="section-subtitle">Venue</span>
                        <h2 className="section-title">Mark Your Calendar</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '3rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Calendar size={32} /></div>
                                <div>
                                    <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>February 24, 2026</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Main Auditorium, V.S.B Building. <br />Registration starts at 08:30 AM sharp.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ color: 'var(--primary)', flexShrink: 0 }}><MapPin size={32} /></div>
                                <div>
                                    <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Interactive Location</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>NH-209, Coimbatore-Pollachi Main Road, <br />Tamil Nadu 642109</p>
                                    <a href="/location" className="btn btn-outline" style={{ marginTop: '1.5rem', fontSize: '0.7rem' }}>GET DIRECTIONS</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
