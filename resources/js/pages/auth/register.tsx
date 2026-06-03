import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        password_confirmation: '',
        groupe: '',
        code_affiliation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="scanlines flex min-h-screen items-center justify-center bg-background">
            <Head title="Inscription — Seven" />

            <div className="w-full max-w-sm px-4">
                <div className="mb-8 text-center">
                    <div className="mb-1 text-[10px] tracking-[0.4em] text-muted-foreground/40">[ NOUVEAU COMPTE ]</div>
                    <h1 className="cursor-blink text-2xl font-bold tracking-[0.2em] text-primary">SEVEN</h1>
                    <div className="mt-1 text-[10px] tracking-widest text-muted-foreground/60">CODE D'AFFILIATION REQUIS</div>
                </div>

                <div className="border border-border bg-[var(--seven-panel)] p-6">
                    <div className="mb-4 text-[10px] tracking-widest text-muted-foreground/40">
                        // ENREGISTREMENT
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                Identifiant
                            </label>
                            <input
                                type="text"
                                autoFocus
                                autoComplete="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="seven-input w-full px-3 py-2 text-sm"
                                placeholder="votre_id"
                            />
                            {errors.username && <p className="mt-1 text-[10px] text-destructive">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                Groupe / Gang
                            </label>
                            <input
                                type="text"
                                value={data.groupe}
                                onChange={(e) => setData('groupe', e.target.value)}
                                className="seven-input w-full px-3 py-2 text-sm"
                                placeholder="ex: Los Santos"
                            />
                            {errors.groupe && <p className="mt-1 text-[10px] text-destructive">{errors.groupe}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="seven-input w-full px-3 py-2 text-sm"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-[10px] text-destructive">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="seven-input w-full px-3 py-2 text-sm"
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-[10px] text-destructive">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-primary">
                                Code d'affiliation
                            </label>
                            <input
                                type="text"
                                value={data.code_affiliation}
                                onChange={(e) => setData('code_affiliation', e.target.value.toUpperCase())}
                                className="seven-input w-full px-3 py-2 font-mono text-sm uppercase tracking-widest text-primary"
                                placeholder="XXXX-XXXX"
                            />
                            {errors.code_affiliation && (
                                <p className="mt-1 text-[10px] text-destructive">{errors.code_affiliation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="seven-btn-primary mt-2 w-full py-2.5 text-xs disabled:opacity-50"
                        >
                            {processing ? '[ VÉRIFICATION... ]' : '[ CRÉER LE COMPTE ]'}
                        </button>
                    </form>
                </div>

                <div className="mt-4 text-center text-[10px] text-muted-foreground/40">
                    Déjà un compte ?{' '}
                    <Link href={route('login')} className="text-muted-foreground/80 underline underline-offset-2 hover:text-primary">
                        se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}