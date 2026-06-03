import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { SharedData } from '@/types';

export default function Toast() {
    const { flash } = usePage<SharedData>().props;
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (flash.success) {
            setCurrent({ message: flash.success, type: 'success' });
            setVisible(true);
        } else if (flash.error) {
            setCurrent({ message: flash.error, type: 'error' });
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(t);
    }, [visible, current]);

    if (!current) return null;

    const isSuccess = current.type === 'success';
    const color = isSuccess ? 'var(--seven-green)' : 'var(--seven-red)';

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 9998,
                transition: 'all 0.2s ease',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div
                style={{
                    background: 'var(--seven-panel)',
                    border: `1px solid ${color}`,
                    padding: '0.65rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: '220px',
                    maxWidth: '320px',
                }}
            >
                {isSuccess
                    ? <CheckCircle size={14} style={{ color, flexShrink: 0 }} />
                    : <XCircle size={14} style={{ color, flexShrink: 0 }} />
                }
                <span style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    color: 'var(--seven-text)',
                    fontFamily: 'var(--font-mono)',
                }}>
                    {current.message}
                </span>
            </div>
        </div>
    );
}
