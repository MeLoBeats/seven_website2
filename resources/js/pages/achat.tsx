import { Head } from '@inertiajs/react';

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
                        <ItemCard key={item.id} item={item} mode="achat" />
                    ))}
                </div>
            )}
        </SevenLayout>
    );
}

interface ItemCardProps {
    item: Item;
    mode: 'achat' | 'vente';
}

function ItemCard({ item, mode }: ItemCardProps) {
    const price = mode === 'achat' ? item.prix_vente : item.prix_achat;
    const priceLabel = mode === 'achat' ? 'PRIX' : 'RACHAT';
    const stockColor = item.stock > 10 ? '#00ff41' : item.stock > 0 ? '#ffaa00' : '#cc0000';

    return (
        <div className="seven-panel fade-in flex flex-col">
            {/* Image */}
            <div className="relative h-36 overflow-hidden bg-[#0a0a0a]">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.nom} className="h-full w-full object-cover opacity-80" />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-3xl text-[#1a1a1a]">?</span>
                    </div>
                )}
                {/* Stock badge */}
                <div
                    className="absolute right-2 top-2 border border-current px-2 py-0.5 text-[10px] uppercase tracking-widest"
                    style={{ color: stockColor, borderColor: stockColor }}
                >
                    {item.stock > 0 ? `STOCK: ${item.stock}` : 'RUPTURE'}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap gap-1 mb-2">
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
                    <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-3">
                        <div>
                            <div className="text-[10px] text-[#444]">{priceLabel}</div>
                            <div className="text-lg font-bold text-[#00ff41]">
                                {price ? `$${Number(price).toLocaleString()}` : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}