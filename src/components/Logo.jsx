import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 24, className = "" }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className={className}>
            <motion.div
                style={{
                    position: 'relative',
                    width: size * 1.5,
                    height: size * 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                whileHover={{ scale: 1.1 }}
            >
                {/* Outer Hexagon/Shield Shape */}
                <svg
                    width={size * 1.5}
                    height={size * 1.5}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        d="M20 2L36 10V30L20 38L4 30V10L20 2Z"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <path
                        d="M20 6L32 12V28L20 34L8 28V12L20 6Z"
                        fill="rgba(56, 234, 140, 0.1)"
                        stroke="var(--primary)"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                    />

                    {/* Inner Core */}
                    <motion.circle
                        cx="20"
                        cy="20"
                        r="6"
                        fill="var(--primary)"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 1, 0.8],
                            boxShadow: ["0 0 10px var(--primary)", "0 0 20px var(--primary)", "0 0 10px var(--primary)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Orbiting Elements */}
                    <motion.path
                        d="M20 10V14"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.path
                        d="M20 26V30"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    />
                </svg>

                {/* Glow Effect */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                    opacity: 0.2,
                    filter: 'blur(10px)',
                    zIndex: -1
                }} />
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                <span style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: '900',
                    fontSize: size * 0.8,
                    color: '#fff',
                    letterSpacing: '2px',
                    background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    INFIQ
                </span>
                <span style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: size * 0.45,
                    color: 'var(--primary)',
                    letterSpacing: '4px',
                    marginTop: '2px',
                    opacity: 0.8
                }}>
                    2K26
                </span>
            </div>
        </div>
    );
};

export default Logo;
