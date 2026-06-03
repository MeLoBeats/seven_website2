import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, Phone, XCircle } from 'lucide-react';
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

interface Props {
    commandes: Commande[];
    nb_en_attente: number;
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

export default function AdminCommandes({ commandes, nb_en_attente }: Props) {
    const [filtre, setFiltre] = useState<string>('en_attente');

    const filtered = filtre === 'tout' ? commandes : commandes.filter((c) => c.statut === filtre);

    return (
        <SevenLayout title="Commandes">
            <Head title="Commandes — Admin Seven" />

            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-2">
                {['en_attente', 'validee', 'refusee', 'tout'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFiltre(s)}
                        className="seven-tag cursor-pointer transition-all"
                        style={{
                            color: filtre === s ? '#000' : (statutColors[s] ?? '#555'),
                            borderColor: statutColors[s] ?? '#555',
                            backgroundColor: filtre === s ? (statutColors[s] ?? '#555') : 'transparent',
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

    const color = statutColors[c.statut];

    return (
        <div className="seven-panel fade-in p-4">
            {/* Header */}
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    {c.user.photo_profil_url ? (
                        <img src={c.user.photo_profil_url} alt="" className="h-9 w-9 rounded-full border border-[var(--seven-border-bright)] object-cover" />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--seven-border-bright)] bg-muted text-muted-foreground/60">
                            {c.user.username[0]?.toUpperCase()}
                        </div>
                    )}
                    <div>
                        <span className="text-sm font-bold text-foreground">{c.user.username}</span>
                        {c.user.groupe && <span className="ml-2 text-[10px] text-muted-foreground/80">{c.user.groupe}</span>}
                        <div className="flex flex-wrap gap-1 mt-0.5">
                            {c.user.phone_numbers.map((p, i) => (
                                <span key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                                    <Phone size={9} /> {p.numero}{p.label && ` (${p.label})`}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <span className="seven-tag" style={{ color, borderColor: color }}>{statutLabels[c.statut]}</span>
                    <div className="mt-1 text-[10px] text-muted-foreground/60">{c.created_at}</div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-3 space-y-1 border border-[var(--sidebar-border)] bg-[var(--seven-input-bg)] p-3">
                {c.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-sidebar-foreground">
                            <span className="text-muted-foreground/80">x{item.quantite}</span> {item.nom}
                        </span>
                        <span className="text-primary">
                            ${(Number(item.prix_unitaire) * item.quantite).toLocaleString()}
                        </span>
                    </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-[var(--sidebar-border)] pt-2 text-xs font-bold">
                    <span className="text-muted-foreground/80">TOTAL</span>
                    <span className="text-primary">${Number(c.total).toLocaleString()}</span>
                </div>
            </div>

            {/* Note client */}
            {c.note && (
                <div className="mb-3 border-l-2 border-[var(--seven-warning)] pl-3 text-xs text-muted-foreground">
                    <span className="text-[var(--seven-warning)]">NOTE: </span>{c.note}
                </div>
            )}

            {/* Note admin */}
            {c.note_admin && (
                <div className="mb-3 border-l-2 border-primary pl-3 text-xs text-muted-foreground">
                    <span className="text-primary">RÉPONSE: </span>{c.note_admin}
                </div>
            )}

            {/* Actions */}
            {c.statut === 'en_attente' && (
                <div className="space-y-2">
                    <button
                        onClick={() => setShowNote((v) => !v)}
                        className="text-[10px] text-muted-foreground/60 hover:text-sidebar-foreground cursor-pointer"
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
