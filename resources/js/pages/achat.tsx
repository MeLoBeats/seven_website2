import { Head, router } from '@inertiajs/react';
import { Minus, Plus, Search, ShoppingCart, X } from 'lucide-react';
import { useState, useMemo } from 'react';

import SevenLayout from '@/layouts/seven-layout';
import type { Item } from '@/types';

interface AchatProps {
    items: Item[];
}

export default function Achat({ items }: AchatProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return items;
        const term = searchTerm.toLowerCase();
        return items.filter((item) =>
            item.nom.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term) ||
            item.tags.some((tag) => tag.nom.toLowerCase().includes(term))
        );
    }, [items, searchTerm]);

    return (
        <SevenLayout title="Catalogue de rachat">
            <Head title="Rachat — 777 Hustler" />

            {/* Barre de recherche */}
            <div className="mb-6 relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="seven-input w-full pl-10 pr-10 py-2.5 text-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[var(--sidebar-border)] bg-[var(--seven-panel)]">
                    <span className="text-xs text-muted-foreground/40">
                        {items.length === 0 ? '// AUCUN ARTICLE EN RACHAT' : '// AUCUN RÉSULTAT'}
                    </span>
                </div>
            ) : (
                <>
                    {searchTerm && (
                        <div className="mb-4 text-xs text-muted-foreground/60">
                            {filteredItems.length} résultat{filteredItems.length !== 1 ? 's' : ''} trouvé{filteredItems.length !== 1 ? 's' : ''}
                        </div>
                    )}
                    <div className="product-grid">
                        {filteredItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </>
            )}
        </SevenLayout>
    );
}

function ItemCard({ item }: { item: Item }) {
    const [quantite, setQuantite] = useState(1);
    const [loading, setLoading] = useState(false);

    function dec() {
        setQuantite((q) => Math.max(1, q - 1));
    }

    function inc() {
        setQuantite((q) => q + 1);
    }

    function addToCart() {
        setLoading(true);
        router.post(
            route('panier.ajouter', item.id),
            { quantite },
            { preserveScroll: true, onFinish: () => setLoading(false) },
        );
    }

    return (
        <div className="seven-panel fade-in flex flex-col">
            <div className="relative h-48 overflow-hidden bg-[var(--seven-input-bg)]">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.nom}
                        className="h-full w-full object-cover object-center opacity-90"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-4xl text-[var(--seven-subtle)]">?</span>
                    </div>
                )}
                <div className="absolute left-2 top-2 border border-destructive px-2 py-0.5 text-[10px] uppercase tracking-widest text-destructive">
                    RACHAT
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                        <span key={tag.nom} className="seven-tag" style={{ color: tag.couleur, borderColor: tag.couleur }}>
                            {tag.nom}
                        </span>
                    ))}
                </div>

                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">{item.nom}</h3>
                {item.description && (
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/80">{item.description}</p>
                )}

                <div className="mt-auto pt-3">
                    <div className="mb-3 flex items-center justify-between border-t border-[var(--sidebar-border)] pt-3">
                        <div>
                            <div className="text-[10px] text-muted-foreground/60">ON RACHÈTE À</div>
                            <div className="text-lg font-bold text-primary">
                                {item.prix_achat ? `$${Number(item.prix_achat).toLocaleString()}` : 'Sur devis'}
                            </div>
                        </div>
                        {quantite > 1 && item.prix_achat && (
                            <div className="text-right">
                                <div className="text-[10px] text-muted-foreground/60">ESTIMATION</div>
                                <div className="text-sm font-bold text-primary">
                                    ${(Number(item.prix_achat) * quantite).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center border border-border">
                            <button
                                type="button"
                                onClick={dec}
                                className="cursor-pointer px-2 py-1.5 text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <Minus size={12} />
                            </button>
                            <input
                                type="number"
                                min={1}
                                value={quantite}
                                onChange={(e) => setQuantite(Math.max(1, Number(e.target.value) || 1))}
                                className="w-10 bg-transparent py-1.5 text-center text-sm text-foreground focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={inc}
                                className="cursor-pointer px-2 py-1.5 text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <Plus size={12} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={addToCart}
                            disabled={loading}
                            className="seven-btn-primary flex flex-1 items-center justify-center gap-1 py-1.5 text-[10px] disabled:opacity-50"
                        >
                            <ShoppingCart size={11} />
                            {loading ? '...' : 'AJOUTER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
