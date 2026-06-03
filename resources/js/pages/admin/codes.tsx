import { Head, router, useForm } from '@inertiajs/react';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import SevenLayout from '@/layouts/seven-layout';

interface Code {
    id: number;
    code: string;
    is_used: boolean;
    used_by_username: string | null;
    created_at: string;
}

interface Props {
    codes: Code[];
    nb_disponibles: number;
}

export default function AdminCodes({ codes, nb_disponibles }: Props) {
    const [copied, setCopied] = useState<number | null>(null);
    const [filtre, setFiltre] = useState<'tous' | 'disponible' | 'utilise'>('tous');

    const { data, setData, post, processing, reset, errors } = useForm({ code: '' });

    const filtered = codes.filter((c) => {
        if (filtre === 'disponible') return !c.is_used;
        if (filtre === 'utilise') return c.is_used;
        return true;
    });

    function copyCode(id: number, code: string) {
        navigator.clipboard.writeText(code);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    }

    function deleteCode(id: number) {
        router.delete(route('admin.codes.destroy', id));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.codes.store'), { onSuccess: () => reset() });
    }

    return (
        <SevenLayout title="Codes d'affiliation">
            <Head title="Codes — Admin Seven" />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="seven-panel p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{nb_disponibles}</div>
                    <div className="text-[10px] tracking-widest text-muted-foreground/60">DISPONIBLES</div>
                </div>
                <div className="seven-panel p-3 text-center">
                    <div className="text-2xl font-bold text-foreground">{codes.length - nb_disponibles}</div>
                    <div className="text-[10px] tracking-widest text-muted-foreground/60">UTILISÉS</div>
                </div>
                <div className="seven-panel p-3 text-center">
                    <div className="text-2xl font-bold text-foreground">{codes.length}</div>
                    <div className="text-[10px] tracking-widest text-muted-foreground/60">TOTAL</div>
                </div>
            </div>

            {/* Create form */}
            <div className="seven-panel mb-6 p-4">
                <div className="mb-3 text-[10px] tracking-widest text-muted-foreground/40">// GÉNÉRER UN CODE</div>
                <form onSubmit={submit} className="flex gap-2">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            className="seven-input w-full px-3 py-2 font-mono text-sm uppercase tracking-widest"
                            placeholder="LAISSE VIDE POUR AUTO (ex: BALLAS-2025)"
                        />
                        {errors.code && <p className="mt-1 text-[10px] text-destructive">{errors.code}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="seven-btn-primary flex items-center gap-1 px-4 text-xs disabled:opacity-50"
                    >
                        <Plus size={13} /> CRÉER
                    </button>
                </form>
                <p className="mt-2 text-[10px] text-muted-foreground/40">
                    Laisse le champ vide pour générer un code aléatoire. Sinon écris le code que tu veux donner au groupe.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-3 flex gap-2">
                {(['tous', 'disponible', 'utilise'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFiltre(f)}
                        className="seven-tag cursor-pointer uppercase transition-all"
                        style={{
                            color: filtre === f ? '#000' : '#555',
                            borderColor: '#555',
                            backgroundColor: filtre === f ? '#555' : 'transparent',
                        }}
                    >
                        {f === 'tous' ? 'TOUS' : f === 'disponible' ? 'DISPONIBLES' : 'UTILISÉS'}
                    </button>
                ))}
            </div>

            {/* Codes list */}
            {filtered.length === 0 ? (
                <div className="flex h-32 items-center justify-center border border-[var(--sidebar-border)] bg-[var(--seven-panel)]">
                    <span className="text-xs text-muted-foreground/40">// AUCUN CODE</span>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((c) => (
                        <div
                            key={c.id}
                            className="seven-panel fade-in flex items-center justify-between gap-4 px-4 py-3"
                        >
                            {/* Code */}
                            <div className="flex items-center gap-3">
                                <span
                                    className="font-mono text-sm font-bold tracking-widest"
                                    style={{ color: c.is_used ? '#333' : '#00ff41' }}
                                >
                                    {c.code}
                                </span>
                                {!c.is_used && (
                                    <button
                                        onClick={() => copyCode(c.id, c.code)}
                                        title="Copier"
                                        className="cursor-pointer text-muted-foreground/40 transition-colors hover:text-foreground"
                                    >
                                        {copied === c.id ? (
                                            <span className="text-[10px] text-primary">COPIÉ !</span>
                                        ) : (
                                            <Copy size={13} />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex flex-1 items-center justify-end gap-4">
                                {c.is_used ? (
                                    <span className="text-[11px] text-muted-foreground/80">
                                        Utilisé par{' '}
                                        <span className="text-sidebar-foreground">{c.used_by_username}</span>
                                    </span>
                                ) : (
                                    <span className="seven-tag border-primary text-primary">DISPONIBLE</span>
                                )}
                                <span className="text-[10px] text-muted-foreground/40">{c.created_at}</span>
                                {!c.is_used && (
                                    <button
                                        onClick={() => deleteCode(c.id)}
                                        className="cursor-pointer text-muted-foreground/40 transition-colors hover:text-destructive"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SevenLayout>
    );
}
