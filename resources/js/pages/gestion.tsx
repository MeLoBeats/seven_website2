import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';

import SevenLayout from '@/layouts/seven-layout';
import type { PhoneNumber, SharedData } from '@/types';

interface GestionProps {
    phoneNumbers: PhoneNumber[];
}

export default function Gestion({ phoneNumbers }: GestionProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const [preview, setPreview] = useState<string | null>(user.photo_profil_url ?? null);

    const profileForm = useForm({
        username: user.username ?? '',
        groupe: user.groupe ?? '',
        photo_profil: null as File | null,
    });

    const phoneForm = useForm({
        numero: '',
        label: '',
    });

    const fileRef = useRef<HTMLInputElement>(null);

    function submitProfile(e: React.FormEvent) {
        e.preventDefault();
        profileForm.post(route('gestion.update'), { forceFormData: true });
    }

    function submitPhone(e: React.FormEvent) {
        e.preventDefault();
        phoneForm.post(route('gestion.phone.store'), {
            onSuccess: () => phoneForm.reset(),
        });
    }

    function deletePhone(id: number) {
        router.delete(route('gestion.phone.destroy', id));
    }

    function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        profileForm.setData('photo_profil', file);
        setPreview(URL.createObjectURL(file));
    }

    return (
        <SevenLayout title="Gestion du profil">
            <Head title="Gestion — 777 Hustler" />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Profile card */}
                <div className="seven-panel p-5">
                    <div className="mb-4 text-[10px] tracking-widest text-muted-foreground/40">// INFORMATIONS PERSONNELLES</div>

                    <form onSubmit={submitProfile} encType="multipart/form-data" className="space-y-4">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="group relative h-16 w-16 shrink-0 cursor-pointer"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt=""
                                        className="h-16 w-16 rounded-full border border-[var(--seven-border-bright)] object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--seven-border-bright)] bg-muted text-2xl text-muted-foreground/40">
                                        {user.username?.[0]?.toUpperCase() ?? '?'}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                    <span className="text-[10px] text-primary">CHANGER</span>
                                </div>
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                            <div className="text-xs text-muted-foreground/80">
                                <div className="text-sidebar-foreground">{user.username}</div>
                                <div className="text-[10px] tracking-widest text-muted-foreground/60">{user.role?.toUpperCase()}</div>
                            </div>
                        </div>

                        {profileForm.errors.photo_profil && (
                            <p className="text-[10px] text-destructive">{profileForm.errors.photo_profil}</p>
                        )}

                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Identifiant</label>
                            <input
                                type="text"
                                value={profileForm.data.username}
                                onChange={(e) => profileForm.setData('username', e.target.value)}
                                className="seven-input w-full px-3 py-2 text-sm"
                            />
                            {profileForm.errors.username && (
                                <p className="mt-1 text-[10px] text-destructive">{profileForm.errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Groupe / Gang</label>
                            <input
                                type="text"
                                value={profileForm.data.groupe}
                                onChange={(e) => profileForm.setData('groupe', e.target.value)}
                                className="seven-input w-full px-3 py-2 text-sm"
                            />
                            {profileForm.errors.groupe && (
                                <p className="mt-1 text-[10px] text-destructive">{profileForm.errors.groupe}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={profileForm.processing}
                            className="seven-btn-primary px-4 py-2 text-xs disabled:opacity-50"
                        >
                            {profileForm.processing ? '[ SAUVEGARDE... ]' : '[ SAUVEGARDER ]'}
                        </button>
                    </form>
                </div>

                {/* Phone numbers */}
                <div className="seven-panel p-5">
                    <div className="mb-4 text-[10px] tracking-widest text-muted-foreground/40">// NUMÉROS DE CONTACT</div>

                    <form onSubmit={submitPhone} className="mb-4">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={phoneForm.data.numero}
                                    onChange={(e) => phoneForm.setData('numero', e.target.value)}
                                    className="seven-input w-full px-3 py-2 text-sm"
                                    placeholder="Numéro"
                                />
                                {phoneForm.errors.numero && (
                                    <p className="mt-1 text-[10px] text-destructive">{phoneForm.errors.numero}</p>
                                )}
                            </div>
                            <div className="w-28">
                                <input
                                    type="text"
                                    value={phoneForm.data.label}
                                    onChange={(e) => phoneForm.setData('label', e.target.value)}
                                    className="seven-input w-full px-3 py-2 text-sm"
                                    placeholder="Label"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={phoneForm.processing}
                                className="seven-btn-primary px-3 disabled:opacity-50"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </form>

                    {phoneNumbers.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground/40">Aucun numéro enregistré</div>
                    ) : (
                        <div className="space-y-2">
                            {phoneNumbers.map((phone) => (
                                <div
                                    key={phone.id}
                                    className="flex items-center justify-between border border-[var(--sidebar-border)] bg-[var(--seven-input-bg)] px-3 py-2"
                                >
                                    <div>
                                        <span className="text-sm text-foreground">{phone.numero}</span>
                                        {phone.label && (
                                            <span className="ml-2 text-[10px] text-muted-foreground/80">{phone.label}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deletePhone(phone.id)}
                                        className="cursor-pointer text-muted-foreground/40 transition-colors hover:text-destructive"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SevenLayout>
    );
}