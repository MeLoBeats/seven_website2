import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="scanlines flex min-h-screen items-center justify-center bg-background">
            <Head title="Connexion — 777 Hustler" />

            <div className="w-full max-w-sm px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-1 text-[10px] tracking-[0.4em] text-muted-foreground/40">[ CONNEXION SÉCURISÉE ]</div>
                    <h1 className="cursor-blink text-2xl font-bold tracking-[0.2em] text-primary">SEVEN</h1>
                    <div className="mt-1 text-[10px] tracking-widest text-muted-foreground/60">ACCÈS RESTREINT</div>
                </div>

                {/* Panel */}
                <div className="border border-border bg-[var(--seven-panel)] p-6">
                    <div className="mb-4 text-[10px] tracking-widest text-muted-foreground/40">
                        // AUTHENTIFICATION REQUISE
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
                                placeholder="identifiant"
                            />
                            {errors.username && (
                                <p className="mt-1 text-[10px] text-destructive">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="seven-input w-full px-3 py-2 text-sm"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-[10px] text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="seven-btn-primary mt-2 w-full py-2.5 text-xs disabled:opacity-50"
                        >
                            {processing ? '[ CONNEXION... ]' : '[ ACCÉDER ]'}
                        </button>
                    </form>
                </div>

                <div className="mt-4 text-center text-[10px] text-muted-foreground/40">
                    Pas encore de compte ?{' '}
                    <Link href={route('register')} className="text-muted-foreground/80 underline underline-offset-2 hover:text-primary">
                        s'enregistrer
                    </Link>
                </div>

                <div className="mt-6 text-center text-[9px] tracking-widest text-border">
                    SEVEN NETWORK — ACCÈS CONTRÔLÉ
                </div>
            </div>
        </div>
    );
}