import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import PageTransition from './PageTransition';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="glass-card"
            style={{
                padding: '1.5rem 2rem',
                marginBottom: '1rem',
                cursor: 'pointer',
                borderLeft: isOpen ? '4px solid var(--primary)' : '1px solid var(--glass-border)',
                background: isOpen ? 'rgba(0, 229, 255, 0.03)' : 'rgba(17, 24, 39, 0.7)',
                transition: '0.3s'
            }}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{
                    margin: 0,
                    fontSize: '1rem',
                    color: isOpen ? '#fff' : 'var(--text-primary)',
                    fontFamily: 'Inter',
                    textTransform: 'none',
                    letterSpacing: '0'
                }}>
                    {question}
                </h4>
                <div style={{
                    color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
                    transition: '0.3s'
                }}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p style={{
                            marginTop: '1.5rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.8',
                            fontSize: '0.9rem',
                            borderTop: '1px solid var(--glass-border)',
                            paddingTop: '1rem'
                        }}>
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "Who can participate in INFIQ 2K26?",
            answer: "The symposium is open to all engineering and technical students from any department and any college/university across the country."
        },
        {
            question: "Is there a registration fee for the events?",
            answer: "Yes, there is a registration fee of ₹250 which includes access to all major sessions, technical tracks, and standard perks including lunch."
        },
        {
            question: "Can I participate in multiple events?",
            answer: "Yes, you can participate in multiple events as long as they are scheduled at different times. Please plan your schedule accordingly."
        },
        {
            question: "What are the perks for participants?",
            answer: "All participants will receive e-certificates, a physical symposium kit, and refreshments/lunch. Winners will receive trophies and cash prizes."
        },
        {
            question: "What is the team size for Project Expo?",
            answer: "For Technical events like Project Expo and Hackathons, teams can consist of 2 to 4 members. Individual participation is also allowed for specific tracks."
        }
    ];

    return (
        <PageTransition>
            <section id="faq" className="faq" style={{ background: 'transparent', padding: '120px 0' }}>
                <div className="container container-small">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="section-subtitle">Got Questions?</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <HelpCircle className="text-[#00E5FF]" size={28} />
                            <h2 className="section-title" style={{ margin: 0 }}>FAQ Section</h2>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        {faqs.map((f, idx) => <FAQItem key={idx} {...f} />)}
                    </div>

                    <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Don't see your question here? <a href="/location" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Contact our support desk</a>
                        </p>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default FAQ;
