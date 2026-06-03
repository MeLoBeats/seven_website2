import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const bufferRef = useRef('');
    const secret = 'seven';

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            bufferRef.current += e.key.toLowerCase();
            bufferRef.current = bufferRef.current.slice(-secret.length);
            if (bufferRef.current === secret) {
                router.visit(auth.user ? '/gestion' : '/login');
            }
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [auth.user]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f0',
            fontFamily: 'Georgia, serif',
            color: '#333',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{ maxWidth: '560px', textAlign: 'center' }}>
                {/* Logo / titre leurre */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#222',
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 'bold' }}>S</span>
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 'normal', letterSpacing: '0.05em', color: '#222' }}>
                        Santos Consulting
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.25rem', letterSpacing: '0.1em' }}>
                        MANAGEMENT & ADVISORY
                    </p>
                </div>

                {/* Contenu leurre */}
                <div style={{
                    borderTop: '1px solid #ddd',
                    borderBottom: '1px solid #ddd',
                    padding: '2rem 0',
                    marginBottom: '2rem',
                }}>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555' }}>
                        Notre cabinet accompagne les entreprises et particuliers dans leurs
                        projets de développement stratégique, de restructuration et de gestion
                        d'actifs en Amérique latine et aux Caraïbes.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {[
                        { label: 'Conseil', desc: 'Stratégie & planification' },
                        { label: 'Finance', desc: 'Gestion de patrimoine' },
                        { label: 'Audit', desc: 'Conformité & contrôle' },
                    ].map((s) => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.15em', color: '#222', marginBottom: '0.25rem' }}>
                                {s.label.toUpperCase()}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{s.desc}</div>
                        </div>
                    ))}
                </div>

                <p style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '0.05em' }}>
                    Pour toute demande de contact, merci de nous écrire par courrier.
                </p>
            </div>

            {/* Footer */}
            <footer style={{
                position: 'absolute',
                bottom: '1.5rem',
                fontSize: '0.65rem',
                color: '#ccc',
                letterSpacing: '0.05em',
            }}>
                © 2025 Santos Consulting S.A. — Tous droits réservés
            </footer>
        </div>
    );
}
