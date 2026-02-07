import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu, Gamepad2, FileText, Bug,
    Globe, HelpCircle, Code, Palette, Eye,
    Camera, Image, Users, Sparkles, ChevronRight, Terminal, Zap
} from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import PageTransition from './PageTransition';
import eventPoster from '../assets/image.png';

const TrackCard = ({ track, index, registeredCount, maxLimit, teamList }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [viewMode, setViewMode] = useState('RULES'); // RULES or TEAMS
    const isFull = registeredCount >= maxLimit;
    const progress = Math.min((registeredCount / maxLimit) * 100, 100);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`card-container ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className="card-inner">
                {/* ... Front Face ... */}
                <div className="card-face card-front" style={{ background: 'rgba(15, 17, 26, 0.4)', backdropFilter: 'blur(20px)' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                        <div className="badge" style={{ background: 'rgba(56, 234, 140, 0.1)', color: 'var(--primary)', border: '1px solid rgba(56, 234, 140, 0.2)' }}>{track.tag}</div>
                        {track.isFeatured && <div className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>FEATURED</div>}
                    </div>

                    <div className="card-img-wrapper" style={{ margin: '15px', borderRadius: '12px', overflow: 'hidden', height: '180px' }}>
                        <img
                            src={track.img}
                            alt={track.title}
                            className="card-img"
                            style={{ filter: 'grayscale(0.5) contrast(1.2)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 9, 15, 0.8), transparent)' }}></div>
                    </div>

                    <div className="card-body" style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '0.5rem' }}>
                            <div style={{ color: 'var(--primary)', background: 'rgba(56, 234, 140, 0.1)', padding: '8px', borderRadius: '8px', marginTop: '2px' }}>
                                {track.icon && React.cloneElement(track.icon, { size: 18 })}
                            </div>
                            <div>
                                <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0, letterSpacing: '1px', lineHeight: '1.2' }}>{track.title}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.8, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{track.subtitle}</p>
                            </div>
                        </div>
                        {/* Progress Bar UI */}
                        <div style={{ width: '100%', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--text-muted)' }}>
                                <span>Slots Status</span>
                                <span style={{ color: isFull ? '#FF5F56' : 'var(--primary)' }}>{registeredCount} / {maxLimit}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    background: isFull ? '#FF5F56' : 'var(--primary)',
                                    transition: 'width 0.5s ease-out'
                                }} />
                            </div>
                        </div>
                    </div>

                    <div className="card-footer" style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', fontWeight: '800' }}>PRIZES</span>
                            <span className="card-price" style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.1rem' }}>{track.prize}</span>
                        </div>
                        <button disabled={isFull} className={`btn ${isFull ? 'btn-disabled' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', border: isFull ? '1px solid #FF5F56' : '1px solid rgba(56, 234, 140, 0.3)', color: isFull ? '#FF5F56' : '' }}>
                            {isFull ? 'CLOSED' : 'EXECUTE'} <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                        </button>
                    </div>
                </div>

                {/* Maximum Height Back Face */}
                <div className="card-face card-back" style={{ background: '#0F111A', border: '2px solid var(--primary)', display: 'flex', flexDirection: 'column' }}>
                    <div className="card-back-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>

                        {/* Tabs */}
                        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid rgba(56, 234, 140, 0.2)', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                            <span
                                onClick={(e) => { e.stopPropagation(); setViewMode('RULES'); }}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    color: viewMode === 'RULES' ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: viewMode === 'RULES' ? '2px solid var(--primary)' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                RULES
                            </span>
                            <span
                                onClick={(e) => { e.stopPropagation(); setViewMode('TEAMS'); }}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    color: viewMode === 'TEAMS' ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: viewMode === 'TEAMS' ? '2px solid var(--primary)' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                TEAMS ({registeredCount})
                            </span>
                        </div>

                        {/* Content Area */}
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', scrollbarWidth: 'thin', scrollbarColor: 'var(--primary) transparent' }}>
                            {viewMode === 'RULES' ? (
                                <ul className="features-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {track.rules.map((rule, idx) => (
                                        <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', gap: '10px' }}>
                                            <span style={{ color: 'var(--primary)' }}>[0{idx + 1}]</span> {rule}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {teamList && teamList.length > 0 ? (
                                        <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                            {teamList.map((team, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }}>
                                                    <strong style={{ color: '#fff' }}>{team.teamName}</strong>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p style={{ fontStyle: 'italic', textAlign: 'center', opacity: 0.7 }}>No teams registered yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="back-footer">
                            <button
                                onClick={(e) => { e.stopPropagation(); window.location.href = '/register'; }}
                                disabled={isFull}
                                className="btn btn-primary"
                                style={{ width: '100%', fontSize: '0.8rem', fontWeight: '800', opacity: isFull ? 0.5 : 1, cursor: isFull ? 'not-allowed' : 'pointer' }}
                            >
                                {isFull ? 'REGISTRATION CLOSED' : 'INITIALIZE REGISTRATION'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Events = () => {
    const [filter, setFilter] = useState('ALL');
    const [eventCounts, setEventCounts] = useState({});
    const [eventLimits, setEventLimits] = useState({}); // New state for dynamic limits

    const [eventTeams, setEventTeams] = useState({}); // New state for team lists

    useEffect(() => {
        // Fetch dynamic limits
        const unsubscribeLimits = onSnapshot(collection(db, "event_settings"), (snapshot) => {
            const limits = {};
            snapshot.docs.forEach(doc => {
                limits[doc.id] = doc.data().limit;
            });
            setEventLimits(limits);
        });

        // Real-time listener for event counts and team details
        const unsubscribe = onSnapshot(collection(db, "registrations"), (snapshot) => {
            const counts = {};
            const teams = {};

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const eventName = data.eventName;
                const status = data.status;

                // Only count and show APPROVED registrations
                if (eventName && status === 'APPROVED') {
                    // Update Count
                    counts[eventName] = (counts[eventName] || 0) + 1;

                    // Update Team List
                    if (!teams[eventName]) teams[eventName] = [];
                    teams[eventName].push({ teamName: data.teamName, id: doc.id });
                }
            });
            setEventCounts(counts);
            setEventTeams(teams);
        }, (error) => {
            console.error("Error fetching event data:", error);
        });

        return () => {
            unsubscribeLimits();
            unsubscribe();
        };
    }, []);

    const allEvents = [
        {
            title: "PUBLITEX",
            subtitle: "PAPER PRESENTATION",
            dbName: "Paper Presentation", // Mapped to DB value
            icon: <FileText />,
            img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
            desc: "Present your innovative ideas and research in the field of technology and engineering.",
            tag: "RESEARCH",
            category: "TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Team size: 1-3 members", "Time limit: 10 mins", "Abstract mandatory", "Q&A session included"]
        },
        {
            title: "CODE SURGEON",
            subtitle: "DEBUGGING CHALLENGE",
            dbName: "Code Debugging",
            icon: <Bug />,
            img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
            desc: "Test your skills in finding and fixing critical bugs in complex codebases.",
            tag: "CODE",
            category: "TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Individual Contest", "Language: C/C++/Java/Python", "Time: 60 Minutes", "No Internet Allowed"]
        },
        {
            title: "INNOVEXPO",
            subtitle: "PROJECT EXPO",
            dbName: "Project Expo",
            icon: <Cpu />,
            img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
            desc: "Showcase your working projects that offer practical real-world solutions.",
            tag: "INNOVATION",
            category: "TECHNICAL",
            isFeatured: true,
            prize: "Exciting Prizes",
            rules: ["Team Size: Max 4", "Working model required", "Abstract mandatory", "Judged on Innovation"]
        },
        {
            title: "DEVATHON",
            subtitle: "WEB/APP DEV",
            dbName: "Web Designing", // Assuming mapping
            icon: <Globe />,
            img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
            desc: "Build modern, responsive web or mobile applications with the latest tech stack.",
            tag: "DEV",
            category: "TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Topic on-spot", "Duration: 4 Hours", "Bring your own laptop", "Responsive UI focus"]
        },
        {
            title: "QUIZTRON",
            subtitle: "TECH QUIZ",
            dbName: "Technical Quiz",
            icon: <HelpCircle />,
            img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800",
            desc: "Test your technical knowledge in this rapid-fire quiz competition.",
            tag: "QUIZ",
            category: "TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Team of 2", "Multiple Rounds", "Tech & General QA", "Buzzer Round Final"]
        },
        // ... (Other events would follow same pattern, ensuring dbName matches selection in form)
        {
            title: "CODEFUSION",
            subtitle: "MINI HACKATHON",
            dbName: "Ideathon", // Mapping to closest if needed or add new
            icon: <Code />,
            img: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=800",
            desc: "Collaborate and code to solve complex problem statements in a limited time.",
            tag: "HACK",
            category: "TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Team Size: 2-3", "Duration: 3 Hours", "Problem statement on-spot", "Efficiency matters"]
        },
        {
            title: "VISIONIX",
            subtitle: "AR/VR SHOWCASE",
            dbName: "Multimedia Editing", // Placeholder mapping if needed
            icon: <Eye />,
            img: "https://images.unsplash.com/photo-1592478411213-61535f944886?auto=format&fit=crop&q=80&w=800",
            desc: "Experience and create immersive augmented and virtual reality solutions.",
            tag: "FUTURE",
            category: "TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Team or Individual", "Device provided/BYOD", "Creativity focus", "Implementation check"]
        },
        {
            title: "PIXEL VISION",
            subtitle: "PHOTOGRAPHY",
            dbName: "Photography",
            icon: <Camera />,
            img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
            desc: "Capture the perfect moment, lighting, and composition to win.",
            tag: "CREATIVE",
            category: "NON-TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Theme-based", "Mobile/DSLR allowed", "Editing restricted", "On-campus shots only"]
        },
        {
            title: "POSTERIA",
            subtitle: "POSTER DESIGN",
            dbName: "Multimedia Editing", // Mapping
            icon: <Image />,
            img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
            desc: "Design visually stunning posters that communicate a powerful message.",
            tag: "DESIGN",
            category: "NON-TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Digital/Handmade", "Theme on-spot", "Originality key", "Presentation matters"]
        },
        {
            title: "POOFRENZY",
            subtitle: "POP CULTURE QUIZ",
            dbName: "Connections", // Closest non-tech or add new
            icon: <Zap />,
            img: "https://images.unsplash.com/photo-1514525253440-b393452e3383?auto=format&fit=crop&q=80&w=800",
            desc: "Test your knowledge of pop culture, movies, music, and general trivia.",
            tag: "FUN",
            category: "NON-TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Team of 2", "Rapid fire rounds", "Movies/Music/Series", "Buzzer round"]
        },
        {
            title: "LINKSTORM",
            subtitle: "CONNECTIONS",
            dbName: "Connections",
            icon: <Users />,
            img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
            desc: "Classic word-matching and logic puzzle game. Connect the dots to win.",
            tag: "GAME",
            category: "NON-TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Team of 2", "Visual clues", "Time limits", "Lateral thinking"]
        },
        {
            title: "LOGOZO",
            subtitle: "LOGO DESIGN",
            dbName: "Web Designing", // Placeholder
            icon: <Palette />,
            img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
            desc: "Showcase your artistic skills and brand identity vision by designing unique logos.",
            tag: "DESIGN",
            category: "NON-TECHNICAL",
            prize: "Exciting Prizes",
            rules: ["Theme on-spot", "Software/Paper", "Explain concept", "No plagiarism"]
        }
    ];

    const filteredEvents = filter === 'ALL'
        ? allEvents
        : allEvents.filter(e => e.category === filter);

    return (
        <PageTransition>
            <section className="events-section" style={{ minHeight: '100vh', padding: '120px 0', background: 'transparent' }}>
                <div className="container">
                    {/* Official Poster Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            marginBottom: '6rem',
                            textAlign: 'center',
                            background: 'rgba(15, 17, 26, 0.4)',
                            backdropFilter: 'blur(20px)',
                            padding: '2rem',
                            borderRadius: '24px',
                            border: '1px solid rgba(56, 234, 140, 0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <Image size={24} className="text-[#38EA8C]" />
                            <h3 style={{ fontSize: '1rem', letterSpacing: '3px', margin: 0, opacity: 0.6 }}>SYMPOSIUM_POSTER.IMG</h3>
                        </div>
                        <div style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <img
                                src={eventPoster}
                                alt="INFIQ 2K26 Official Poster"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </motion.div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="section-subtitle">System Catalog</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Terminal className="text-[#38EA8C]" size={28} />
                                <h2 className="section-title" style={{ margin: 0 }}>EVENT MODULES</h2>
                            </div>
                        </motion.div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '5px' }}>
                            {['ALL', 'TECHNICAL', 'NON-TECHNICAL'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        background: filter === cat ? 'var(--primary)' : 'transparent',
                                        color: filter === cat ? '#000' : 'var(--text-muted)'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        layout
                        className="events-grid"
                    >
                        <AnimatePresence>
                            {filteredEvents.map((event, idx) => (
                                <TrackCard
                                    key={event.title}
                                    index={idx}
                                    track={event}
                                    registeredCount={eventCounts[event.dbName] || 0} // Get live count
                                    maxLimit={eventLimits[event.dbName] || 15} // Dynamic limit with fallback
                                    teamList={eventTeams[event.dbName] || []} // Pass registered teams
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ marginTop: '8rem', textAlign: 'center' }}
                    >
                        <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', border: '1px dashed var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                <Zap size={24} className="animate-pulse" />
                                <span style={{ fontWeight: '800', letterSpacing: '2px' }}>SYSTEM LOGS</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                                * All events are carefully scheduled to prevent major overlaps. <br />
                                * Registrations are strictly managed through the INFIQ terminal. <br />
                                * For technical support, contact the system administrators in the footer.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    );
};

export default Events;
