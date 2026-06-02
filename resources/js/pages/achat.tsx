import { Head, useForm } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import SevenLayout from '@/layouts/seven-layout';
import type { Item } from '@/types';

interface AchatProps {
    items: Item[];
}

export default function Achat({ items }: AchatProps) {
    return (
        <SevenLayout title="Catalogue d'achat">
            <Head title="Achat — Seven" />

            {items.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[#1a1a1a] bg-[#0d0d0d]">
                    <span className="text-xs text-[#333]">// AUCUN ARTICLE DISPONIBLE</span>
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
    const { post, processing } = useForm({ quantite });

    const stockColor = item.stock > 10 ? '#00ff41' : item.stock > 0 ? '#ffaa00' : '#cc0000';

    function addToCart(e: React.FormEvent) {
        e.preventDefault();
        post(route('panier.ajouter', item.id), { data: { quantite } } as never);
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
                <div
                    className="absolute right-2 top-2 border border-current px-2 py-0.5 text-[10px] uppercase tracking-widest"
                    style={{ color: stockColor, borderColor: stockColor }}
                >
                    {item.stock > 0 ? `STOCK: ${item.stock}` : 'RUPTURE'}
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
                            <div className="text-[10px] text-[#444]">PRIX</div>
                            <div className="text-lg font-bold text-[#00ff41]">
                                {item.prix_vente ? `$${Number(item.prix_vente).toLocaleString()}` : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {item.stock > 0 && (
                        <form onSubmit={addToCart} className="flex gap-2">
                            <input
                                type="number"
                                min={1}
                                max={item.stock}
                                value={quantite}
                                onChange={(e) => setQuantite(Number(e.target.value))}
                                className="seven-input w-16 px-2 py-1.5 text-center text-sm"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="seven-btn-primary flex flex-1 items-center justify-center gap-1 py-1.5 text-[10px] disabled:opacity-50"
                            >
                                <ShoppingCart size={11} />
                                AJOUTER
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
