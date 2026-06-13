import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle, Phone, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

import SevenLayout from '@/layouts/seven-layout';

interface CommandeItem {
    nom: string;
    quantite: number;
    prix_unitaire: string;
}

interface Commande {
    id: number;
    statut: 'en_attente' | 'validee' | 'refusee';
    note: string | null;
    note_admin: string | null;
    created_at: string;
    total: number;
    user: {
        username: string;
        groupe: string | null;
        photo_profil_url: string | null;
        phone_numbers: { numero: string; label: string | null }[];
    };
    items: CommandeItem[];
}

interface Stats {
    total_rachete: number;
    nb_validees: number;
    nb_en_attente: number;
    nb_refusees: number;
}

interface Props {
    commandes: Commande[];
    nb_en_attente: number;
    stats: Stats;
    groupes: string[];
    filters: { periode: string; groupe: string | null };
}

const statutColors: Record<string, string> = {
    en_attente: 'var(--seven-warning)',
    validee: 'var(--seven-green)',
    refusee: 'var(--seven-red)',
};

const statutLabels: Record<string, string> = {
    en_attente: 'EN ATTENTE',
    validee: 'VALIDÉE',
    refusee: 'REFUSÉE',
};

const periodes = [
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week',  label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
    { key: 'tout',  label: 'Tout' },
];

export default function AdminCommandes({ commandes, nb_en_attente, stats, groupes, filters }: Props) {
    const [statutFiltre, setStatutFiltre] = useState<string>('en_attente');

    function applyFilter(key: string, value: string | null) {
        router.get(route('admin.commandes'), {
            ...filters,
            [key]: value ?? undefined,
        }, { preserveScroll: true, preserveState: true });
    }

    const filtered = statutFiltre === 'tout'
        ? commandes
        : commandes.filter((c) => c.statut === statutFiltre);

    return (
        <SevenLayout title="Commandes">
            <Head title="Commandes — Admin 777 Hustler" />

            {/* Stats totaux */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total racheté" value={`$${Number(stats.total_rachete).toLocaleString()}`} color="var(--seven-green)" />
                <StatCard label="Validées" value={stats.nb_validees} color="var(--seven-green)" />
                <StatCard label="En attente" value={stats.nb_en_attente} color="var(--seven-warning)" />
                <StatCard label="Refusées" value={stats.nb_refusees} color="var(--seven-red)" />
            </div>

            {/* Filtres période + groupe */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                    {periodes.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => applyFilter('periode', p.key)}
                            className="seven-tag cursor-pointer transition-all"
                            style={{
                                color: filters.periode === p.key ? '#000' : 'var(--seven-text-dim)',
                                borderColor: 'var(--seven-text-dim)',
                                backgroundColor: filters.periode === p.key ? 'var(--seven-text-dim)' : 'transparent',
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {groupes.length > 0 && (
                    <select
                        value={filters.groupe ?? ''}
                        onChange={(e) => applyFilter('groupe', e.target.value || null)}
                        className="seven-input px-2 py-1 text-xs"
                    >
                        <option value="">Tous les groupes</option>
                        {groupes.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Filtre statut */}
            <div className="mb-4 flex flex-wrap gap-2">
                {['en_attente', 'validee', 'refusee', 'tout'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatutFiltre(s)}
                        className="seven-tag cursor-pointer transition-all"
                        style={{
                            color: statutFiltre === s ? '#000' : (statutColors[s] ?? 'var(--seven-text-dim)'),
                            borderColor: statutColors[s] ?? 'var(--seven-text-dim)',
                            backgroundColor: statutFiltre === s ? (statutColors[s] ?? 'var(--seven-text-dim)') : 'transparent',
                        }}
                    >
                        {s === 'tout' ? 'TOUT' : statutLabels[s]}
                        {s === 'en_attente' && nb_en_attente > 0 && (
                            <span className="ml-1 font-bold">({nb_en_attente})</span>
                        )}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[var(--sidebar-border)] bg-[var(--seven-panel)]">
                    <span className="text-xs text-muted-foreground/40">// AUCUNE COMMANDE</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((c) => (
                        <CommandeCard key={c.id} commande={c} />
                    ))}
                </div>
            )}
        </SevenLayout>
    );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className="seven-panel p-3 text-center">
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground/60">{label.toUpperCase()}</div>
        </div>
    );
}

function CommandeCard({ commande: c }: { commande: Commande }) {
    const validerForm = useForm({ note_admin: '' });
    const refuserForm = useForm({ note_admin: '' });
    const [showNote, setShowNote] = useState(false);

    function valider(e: React.FormEvent) {
        e.preventDefault();
        validerForm.post(route('admin.commandes.valider', c.id));
    }

    function refuser(e: React.FormEvent) {
        e.preventDefault();
        refuserForm.post(route('admin.commandes.refuser', c.id));
    }

    function destroy() {
        if (!confirm('Supprimer définitivement cette commande ?')) return;
        router.delete(route('admin.commandes.destroy', c.id));
    }

    const color = statutColors[c.statut];

    return (
        <div className="seven-panel fade-in p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    {c.user.photo_profil_url ? (
                        <img src={c.user.photo_profil_url} alt="" className="h-9 w-9 rounded-full border border-[var(--seven-border-bright)] object-cover object-center" />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--seven-border-bright)] bg-muted text-muted-foreground/60">
                            {c.user.username[0]?.toUpperCase()}
                        </div>
                    )}
                    <div>
                        <span className="text-sm font-bold text-foreground">{c.user.username}</span>
                        {c.user.groupe && <span className="ml-2 text-[10px] text-muted-foreground/60">{c.user.groupe}</span>}
                        <div className="flex flex-wrap gap-2 mt-0.5">
                            {c.user.phone_numbers.map((p, i) => (
                                <span key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                                    <Phone size={9} /> {p.numero}{p.label && ` (${p.label})`}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span className="seven-tag" style={{ color, borderColor: color }}>{statutLabels[c.statut]}</span>
                        <div className="mt-1 text-[10px] text-muted-foreground/60">{c.created_at}</div>
                    </div>
                    <button
                        onClick={destroy}
                        className="cursor-pointer text-muted-foreground/40 transition-colors hover:text-destructive"
                        title="Supprimer"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Items */}
            <div className="mb-3 space-y-1 border border-[var(--sidebar-border)] bg-[var(--seven-input-bg)] p-3">
                {c.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-sidebar-foreground">
                            <span className="text-muted-foreground/60">x{item.quantite}</span> {item.nom}
                        </span>
                        <span className="text-primary">
                            ${(Number(item.prix_unitaire) * item.quantite).toLocaleString()}
                        </span>
                    </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-[var(--sidebar-border)] pt-2 text-xs font-bold">
                    <span className="text-muted-foreground/60">TOTAL</span>
                    <span className="text-primary">${Number(c.total).toLocaleString()}</span>
                </div>
            </div>

            {c.note && (
                <div className="mb-3 border-l-2 border-[var(--seven-warning)] pl-3 text-xs text-muted-foreground/60">
                    <span className="text-[var(--seven-warning)]">NOTE: </span>{c.note}
                </div>
            )}

            {c.note_admin && (
                <div className="mb-3 border-l-2 border-primary pl-3 text-xs text-muted-foreground/60">
                    <span className="text-primary">RÉPONSE: </span>{c.note_admin}
                </div>
            )}

            {c.statut === 'en_attente' && (
                <div className="space-y-2">
                    <button
                        onClick={() => setShowNote((v) => !v)}
                        className="cursor-pointer text-[10px] text-muted-foreground/40 hover:text-sidebar-foreground"
                    >
                        {showNote ? '▲ masquer note' : '▼ ajouter une note'}
                    </button>

                    {showNote && (
                        <textarea
                            value={validerForm.data.note_admin}
                            onChange={(e) => {
                                validerForm.setData('note_admin', e.target.value);
                                refuserForm.setData('note_admin', e.target.value);
                            }}
                            className="seven-input w-full px-3 py-2 text-sm"
                            rows={2}
                            placeholder="Message pour le client..."
                        />
                    )}

                    <div className="flex gap-2">
                        <form onSubmit={valider} className="flex-1">
                            <button
                                type="submit"
                                disabled={validerForm.processing}
                                className="seven-btn-primary flex w-full items-center justify-center gap-1 py-2 text-xs disabled:opacity-50"
                            >
                                <CheckCircle size={12} /> VALIDER
                            </button>
                        </form>
                        <form onSubmit={refuser} className="flex-1">
                            <button
                                type="submit"
                                disabled={refuserForm.processing}
                                className="seven-btn-danger flex w-full items-center justify-center gap-1 py-2 text-xs disabled:opacity-50"
                            >
                                <XCircle size={12} /> REFUSER
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
