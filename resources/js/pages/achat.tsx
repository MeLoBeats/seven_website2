import { Head, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import SevenLayout from '@/layouts/seven-layout';
import type { Item } from '@/types';

interface AchatProps {
    items: Item[];
}

export default function Achat({ items }: AchatProps) {
    return (
        <SevenLayout title="Catalogue de rachat">
            <Head title="Rachat — Seven" />

            {items.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[#1a1a1a] bg-[#0d0d0d]">
                    <span className="text-xs text-[#333]">// AUCUN ARTICLE EN RACHAT</span>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
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
            { onFinish: () => setLoading(false) },
        );
    }

    return (
        <div className="seven-panel fade-in flex flex-col">
            <div className="relative h-36 overflow-hidden bg-[#0a0a0a]">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.nom} className="h-full w-full object-cover opacity-80" />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-3xl text-[#1a1a1a]">?</span>
                    </div>
                )}
                <div className="absolute left-2 top-2 border border-[#cc0000] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#cc0000]">
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

                <h3 className="text-sm font-bold uppercase tracking-widest text-[#ccc]">{item.nom}</h3>
                {item.description && (
                    <p className="mt-1 text-[11px] leading-relaxed text-[#555]">{item.description}</p>
                )}

                <div className="mt-auto pt-3">
                    <div className="mb-3 flex items-center justify-between border-t border-[#1a1a1a] pt-3">
                        <div>
                            <div className="text-[10px] text-[#444]">ON RACHÈTE À</div>
                            <div className="text-lg font-bold text-[#00ff41]">
                                {item.prix_achat ? `$${Number(item.prix_achat).toLocaleString()}` : 'Sur devis'}
                            </div>
                        </div>
                        {quantite > 1 && item.prix_achat && (
                            <div className="text-right">
                                <div className="text-[10px] text-[#444]">ESTIMATION</div>
                                <div className="text-sm font-bold text-[#00ff41]">
                                    ${(Number(item.prix_achat) * quantite).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#1e1e1e]">
                            <button
                                type="button"
                                onClick={dec}
                                className="cursor-pointer px-2 py-1.5 text-[#555] transition-colors hover:bg-[#111] hover:text-[#ccc]"
                            >
                                <Minus size={12} />
                            </button>
                            <input
                                type="number"
                                min={1}
                                value={quantite}
                                onChange={(e) => setQuantite(Math.max(1, Number(e.target.value) || 1))}
                                className="w-10 bg-transparent py-1.5 text-center text-sm text-[#ccc] focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={inc}
                                className="cursor-pointer px-2 py-1.5 text-[#555] transition-colors hover:bg-[#111] hover:text-[#ccc]"
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
