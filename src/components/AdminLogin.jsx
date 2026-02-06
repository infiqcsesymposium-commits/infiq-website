import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertTriangle, ArrowRight } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Auth state listener in Admin.jsx will handle redirection
        } catch (err) {
            console.error("Login failed", err);
            setError("Invalid credentials. Access denied.");
            setLoading(false);
        }
    };

    return (
        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05060A' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'rgba(56, 234, 140, 0.1)', border: '1px solid var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Lock size={24} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>SYSTEM ENTRY</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Restricted Access. Authorization Required.</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(255, 95, 86, 0.1)', border: '1px solid #FF5F56',
                        padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem',
                        display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FF5F56', fontSize: '0.9rem'
                    }}>
                        <AlertTriangle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Admin ID</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter admin email"
                                style={{
                                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', color: '#fff', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Passcode</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter passcode"
                                style={{
                                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', color: '#fff', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '0.8rem', justifyContent: 'center', marginTop: '1rem',
                            opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'} <ArrowRight size={16} />
                    </button>
                </form>
            </motion.div>
        </section>
    );
};

export default AdminLogin;
