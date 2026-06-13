import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Trash2, User } from 'lucide-react';

import SevenLayout from '@/layouts/seven-layout';
import type { PhoneNumber } from '@/types';

interface UserRow {
    id: number;
    username: string;
    groupe: string | null;
    role: 'invite' | 'admin';
    photo_profil_url: string | null;
    phone_numbers: Pick<PhoneNumber, 'numero' | 'label'>[];
    created_at: string;
}

interface AdminUsersProps {
    users: UserRow[];
}

export default function AdminUsers({ users }: AdminUsersProps) {
    function deleteUser(id: number) {
        if (!confirm('Supprimer cet utilisateur ?')) return;
        router.delete(route('admin.users.destroy', id));
    }

    function toggleRole(id: number) {
        router.patch(route('admin.users.role', id));
    }

    return (
        <SevenLayout title="Gestion des invités">
            <Head title="Invités — Admin 777 Hustler" />

            <div className="mb-4 text-xs text-muted-foreground/80">
                <span className="text-primary">{users.length}</span> invité{users.length !== 1 ? 's' : ''} enregistré{users.length !== 1 ? 's' : ''}
            </div>

            {users.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[var(--sidebar-border)] bg-[var(--seven-panel)]">
                    <span className="text-xs text-muted-foreground/40">// AUCUN INVITÉ</span>
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((user) => (
                        <div key={user.id} className="seven-panel fade-in flex items-start gap-4 p-4">
                            {/* Avatar */}
                            {user.photo_profil_url ? (
                                <img
                                    src={user.photo_profil_url}
                                    alt=""
                                    className="h-10 w-10 shrink-0 rounded-full border border-[var(--seven-border-bright)] object-cover object-center"
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--seven-border-bright)] bg-muted text-muted-foreground/60">
                                    <User size={16} />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-foreground">{user.username}</span>
                                    {user.groupe && (
                                        <span className="seven-tag text-muted-foreground/80 border-[var(--seven-dim)]">{user.groupe}</span>
                                    )}
                                </div>
                                <div className="text-[10px] text-muted-foreground/60">Inscrit le {user.created_at}</div>

                                {/* Phone numbers */}
                                {user.phone_numbers.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {user.phone_numbers.map((p, i) => (
                                            <span key={i} className="border border-[var(--sidebar-border)] bg-[var(--seven-input-bg)] px-2 py-0.5 text-[11px] text-muted-foreground">
                                                {p.numero}
                                                {p.label && <span className="ml-1 text-muted-foreground/60">({p.label})</span>}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                                <button
                                    onClick={() => toggleRole(user.id)}
                                    className="seven-btn-primary flex items-center gap-1 px-2 py-1 text-[10px]"
                                >
                                    <ShieldCheck size={11} />
                                    {user.role === 'admin' ? 'Rétrograder' : 'Promouvoir admin'}
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="seven-btn-danger flex items-center gap-1 px-2 py-1 text-[10px]"
                                >
                                    <Trash2 size={11} />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SevenLayout>
    );
}