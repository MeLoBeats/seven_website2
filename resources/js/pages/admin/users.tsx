import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Trash2, User } from 'lucide-react';

import SevenLayout from '@/layouts/seven-layout';
import type { PhoneNumber } from '@/types';

interface UserRow {
    id: number;
    username: string;
    groupe: string | null;
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
            <Head title="Invités — Admin Seven" />

            <div className="mb-4 text-xs text-[#555]">
                <span className="text-[#00ff41]">{users.length}</span> invité{users.length !== 1 ? 's' : ''} enregistré{users.length !== 1 ? 's' : ''}
            </div>

            {users.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[#1a1a1a] bg-[#0d0d0d]">
                    <span className="text-xs text-[#333]">// AUCUN INVITÉ</span>
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
                                    className="h-10 w-10 shrink-0 rounded-full border border-[#2a2a2a] object-cover"
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111] text-[#444]">
                                    <User size={16} />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-[#ccc]">{user.username}</span>
                                    {user.groupe && (
                                        <span className="seven-tag text-[#555] border-[#333]">{user.groupe}</span>
                                    )}
                                </div>
                                <div className="text-[10px] text-[#444]">Inscrit le {user.created_at}</div>

                                {/* Phone numbers */}
                                {user.phone_numbers.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {user.phone_numbers.map((p, i) => (
                                            <span key={i} className="border border-[#1a1a1a] bg-[#0a0a0a] px-2 py-0.5 text-[11px] text-[#666]">
                                                {p.numero}
                                                {p.label && <span className="ml-1 text-[#444]">({p.label})</span>}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    onClick={() => toggleRole(user.id)}
                                    title="Promouvoir admin"
                                    className="cursor-pointer text-[#333] transition-colors hover:text-[#00ff41]"
                                >
                                    <ShieldCheck size={15} />
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="cursor-pointer text-[#333] transition-colors hover:text-[#cc0000]"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SevenLayout>
    );
}