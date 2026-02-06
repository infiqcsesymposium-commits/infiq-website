import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, Eye } from 'lucide-react';

const Brochure = () => {
    return (
        <section id="brochure" className="brochure" style={{ background: 'transparent', padding: '120px 0' }}>
            <div className="container text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card"
                    style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}
                >
                    <h2 className="section-title text-center">📄 Event Brochure</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>
                        Download our comprehensive INFIQ 2K26 event brochure to get all the details about the symposium, rules, schedule, and more.
                    </p>
                    <div className="flex gap-6 justify-center flex-wrap">
                        <a href="/brochure.pdf" target="_blank" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Eye size={20} /> View Online
                        </a>
                        <a href="/brochure.pdf" download className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <FileDown size={20} /> Download PDF
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Brochure;
