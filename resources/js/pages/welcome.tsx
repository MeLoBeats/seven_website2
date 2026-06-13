import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const bufferRef = useRef('');
    const secret = '777';
    const [taps, setTaps] = useState(0);
    const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const destination = auth.user ? '/gestion' : '/login';

    // Clavier : taper "777"
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            bufferRef.current += e.key.toLowerCase();
            bufferRef.current = bufferRef.current.slice(-secret.length);
            if (bufferRef.current === secret) {
                router.visit(destination);
            }
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [destination]);

    // Mobile / sans clavier : cliquer 7x sur le logo
    function handleLogoClick() {
        const next = taps + 1;
        setTaps(next);

        if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

        if (next >= 7) {
            setTaps(0);
            router.visit(destination);
            return;
        }

        // Remet à zéro si on arrête de taper pendant 3 secondes
        tapTimerRef.current = setTimeout(() => setTaps(0), 3000);
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                fontFamily: 'Georgia, serif',
                color: '#d8ccc0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}
        >
            <div style={{ maxWidth: '560px', textAlign: 'center' }}>
                {/* Logo */}
                <div style={{ marginBottom: '3rem' }}>
                    <div
                        onClick={handleLogoClick}
                        style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'opacity 0.15s',
                            opacity: taps > 0 ? Math.max(0.5, 1 - taps * 0.08) : 1,
                        }}
                    >
                        <img src="/logo.png" alt="777 Hustler" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', letterSpacing: '0.08em', color: '#d4af37', marginBottom: '0.5rem' }}>
                        777 HUSTLER
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '0.25rem', letterSpacing: '0.15em' }}>ORGANIZATION</p>
                </div>

                {/* Contenu */}
                <div
                    style={{
                        borderTop: '1px solid #2a2a2a',
                        borderBottom: '1px solid #2a2a2a',
                        padding: '2.5rem 0',
                        marginBottom: '2rem',
                    }}
                >
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#b8b0a0' }}>
                        Bienvenue dans la famille. Ici, on achète, on vend, on bouge. Que tu sois client ou partenaire, 777 Hustler te traite comme un roi.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {[
                        { label: 'RACHAT', desc: 'On achète tes biens' },
                        { label: 'VENTE', desc: 'On te proprose des offres' },
                        { label: 'SERVICES', desc: 'On soutient la famille' },
                    ].map((s) => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.15em', color: '#d4af37', marginBottom: '0.25rem' }}>
                                {s.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{s.desc}</div>
                        </div>
                    ))}
                </div>

                <p style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.05em' }}>
                    Une question ? Contacte-nous directement. On répond vite.
                </p>
            </div>

            {/* Footer */}
            <footer
                style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    fontSize: '0.65rem',
                    color: '#555',
                    letterSpacing: '0.05em',
                }}
            >
                © 2025 777 Hustler — Tous droits réservés
            </footer>
        </div>
    );
}
