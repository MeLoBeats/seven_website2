import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList, KeyRound, ShieldCheck, ShoppingCart, User, Users } from 'lucide-react';
import { type ReactNode } from 'react';

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
                    ? 'border-l-2 border-[#00ff41] text-[#00ff41]'
                    : 'border-l-2 border-transparent text-[#666] hover:border-[#333] hover:text-[#999]'
            }`}
        >
            <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5">{icon}</span>
                {children}
            </span>
            {badge != null && badge > 0 && (
                <span className="rounded-none bg-[#cc0000] px-1.5 py-0.5 text-[9px] font-bold text-white">
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
        <div className="scanlines flex min-h-screen bg-[#080808]">
            {/* Sidebar */}
            <aside className="flex w-52 shrink-0 flex-col border-r border-[#1a1a1a] bg-[#050505]">
                {/* Logo */}
                <div className="border-b border-[#1a1a1a] px-4 py-5">
                    <div className="text-[#00ff41]">
                        <span className="block text-xs tracking-[0.3em] text-[#444]">[ SEVEN ]</span>
                        <span className="cursor-blink text-lg font-bold tracking-widest">NETWORK</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 px-2 py-4">
                    <span className="px-3 py-1 text-[10px] tracking-[0.3em] text-[#333]">// MENU</span>

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
                            <span className="mt-4 px-3 py-1 text-[10px] tracking-[0.3em] text-[#333]">// ADMIN</span>
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
                <div className="mt-auto border-t border-[#1a1a1a] p-3">
                    <div className="flex items-center gap-2">
                        {user?.photo_profil_url ? (
                            <img src={user.photo_profil_url} alt="" className="h-7 w-7 rounded-full border border-[#2a2a2a] object-cover" />
                        ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111] text-xs text-[#444]">
                                {user?.username?.[0]?.toUpperCase() ?? '?'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="truncate text-xs text-[#999]">{user?.username}</div>
                            <div className="text-[10px] tracking-widest text-[#444]">{user?.role?.toUpperCase()}</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-2 w-full cursor-pointer text-left text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:text-[#cc0000]"
                    >
                        &gt; déconnexion
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex flex-1 flex-col overflow-auto">
                {title && (
                    <header className="border-b border-[#1a1a1a] px-6 py-4">
                        <h1 className="text-sm uppercase tracking-[0.2em] text-[#555]">
                            <span className="mr-2 text-[#00ff41]">&gt;</span>
                            {title}
                        </h1>
                    </header>
                )}
                <div className="flex-1 p-6">{children}</div>
            </main>
        </div>
    );
}
