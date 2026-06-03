import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { SharedData } from '@/types';

interface ToastItem {
    id: number;
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

let nextId = 0;

export default function Toast() {
    const { flash } = usePage<SharedData>().props;
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const prevKeyRef = useRef<string | null>(null);

    useEffect(() => {
        // La clé unique garantit qu'on ne dédoublonne pas les messages identiques
        if (!flash.key || flash.key === prevKeyRef.current) return;
        prevKeyRef.current = flash.key;

        const message = flash.success ?? flash.error;
        if (!message) return;

        const type = flash.success ? 'success' : 'error';
        const id = nextId++;

        setToasts((all) => [...all, { id, message, type, visible: true }]);

        setTimeout(() => {
            setToasts((all) => all.map((t) => (t.id === id ? { ...t, visible: false } : t)));
        }, 2800);

        setTimeout(() => {
            setToasts((all) => all.filter((t) => t.id !== id));
        }, 3200);
    }, [flash.key]);

    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '0.5rem',
        }}>
            {toasts.map((toast) => {
                const color = toast.type === 'success' ? 'var(--seven-green)' : 'var(--seven-red)';
                return (
                    <div
                        key={toast.id}
                        style={{
                            background: 'var(--seven-panel)',
                            border: `1px solid ${color}`,
                            padding: '0.65rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: '220px',
                            maxWidth: '320px',
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                            opacity: toast.visible ? 1 : 0,
                            transform: toast.visible ? 'translateY(0)' : 'translateY(6px)',
                        }}
                    >
                        {toast.type === 'success'
                            ? <CheckCircle size={14} style={{ color, flexShrink: 0 }} />
                            : <XCircle size={14} style={{ color, flexShrink: 0 }} />
                        }
                        <span style={{
                            fontSize: '0.7rem',
                            letterSpacing: '0.05em',
                            color: 'var(--seven-text)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            {toast.message}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
