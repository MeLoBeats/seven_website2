import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList, KeyRound, ShieldCheck, ShoppingCart, User, Users } from 'lucide-react';
import { type ReactNode } from 'react';

import Toast from '@/components/toast';

import type { SharedData } from '@/types';

interface NavLinkProps {
    href: string;
    active: boolean;
    children: ReactNode;
    icon: ReactNode;
    badge?: number;
}

function NavLink({ href, active, children, icon, badge }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-3 py-2 text-sm uppercase tracking-widest transition-all ${
                active
                    ? 'border-l-2 border-primary text-primary'
                    : 'border-l-2 border-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-sidebar-foreground'
            }`}
        >
            <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5">{icon}</span>
                {children}
            </span>
            {badge != null && badge > 0 && (
                <span className="rounded-none bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {badge}
                </span>
            )}
        </Link>
    );
}

interface SevenLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function SevenLayout({ children, title }: SevenLayoutProps) {
    const { auth, nb_commandes_attente, nb_panier } = usePage<SharedData>().props;
    const user = auth.user;
    const currentPath = window.location.pathname;

    function logout() {
        router.post(route('logout'));
    }

    return (
        <div className="scanlines flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="sticky top-0 flex h-screen w-52 shrink-0 flex-col overflow-y-auto border-r border-[var(--sidebar-border)] bg-sidebar">
                {/* Logo */}
                <div className="border-b border-[var(--sidebar-border)] px-4 py-5">
                    <div className="text-primary">
                        <span className="block text-xs tracking-[0.3em] text-muted-foreground/60">[ SEVEN ]</span>
                        <span className="cursor-blink text-lg font-bold tracking-widest">NETWORK</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 px-2 py-4">
                    <span className="px-3 py-1 text-[10px] tracking-[0.3em] text-muted-foreground/40">// MENU</span>

                    <NavLink href={route('gestion')} active={currentPath === '/gestion'} icon={<User size={14} />}>
                        Gestion
                    </NavLink>
                    <NavLink href={route('achat')} active={currentPath === '/achat'} icon={<ShoppingCart size={14} />}>
                        Rachat
                    </NavLink>
                    <NavLink href={route('panier')} active={currentPath === '/panier'} icon={<ClipboardList size={14} />} badge={nb_panier}>
                        Mon offre
                    </NavLink>

                    {user?.role === 'admin' && (
                        <>
                            <span className="mt-4 px-3 py-1 text-[10px] tracking-[0.3em] text-muted-foreground/40">// ADMIN</span>
                            <NavLink
                                href={route('admin.commandes')}
                                active={currentPath === '/admin/commandes'}
                                icon={<ClipboardList size={14} />}
                                badge={nb_commandes_attente}
                            >
                                Commandes
                            </NavLink>
                            <NavLink href={route('admin.users')} active={currentPath === '/admin/users'} icon={<Users size={14} />}>
                                Invités
                            </NavLink>
                            <NavLink href={route('admin.items')} active={currentPath === '/admin/items'} icon={<ShieldCheck size={14} />}>
                                Articles
                            </NavLink>
                            <NavLink href={route('admin.codes')} active={currentPath === '/admin/codes'} icon={<KeyRound size={14} />}>
                                Codes
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* User info at bottom */}
                <div className="mt-auto border-t border-[var(--sidebar-border)] p-3">
                    <div className="flex items-center gap-2">
                        {user?.photo_profil_url ? (
                            <img src={user.photo_profil_url} alt="" className="h-7 w-7 rounded-full border border-[var(--seven-border-bright)] object-cover" />
                        ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--seven-border-bright)] bg-muted text-xs text-muted-foreground/60">
                                {user?.username?.[0]?.toUpperCase() ?? '?'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="truncate text-xs text-sidebar-foreground">{user?.username}</div>
                            <div className="text-[10px] tracking-widest text-muted-foreground/60">{user?.role?.toUpperCase()}</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-2 w-full cursor-pointer text-left text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-colors hover:text-destructive"
                    >
                        &gt; déconnexion
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex flex-1 flex-col overflow-auto">
                {title && (
                    <header className="border-b border-[var(--sidebar-border)] px-6 py-4">
                        <h1 className="text-sm uppercase tracking-[0.2em] text-muted-foreground/80">
                            <span className="mr-2 text-primary">&gt;</span>
                            {title}
                        </h1>
                    </header>
                )}
                <div className="flex-1 p-6">{children}</div>
            </main>

            <Toast />
        </div>
    );
}
