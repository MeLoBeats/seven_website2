import { Head } from '@inertiajs/react';

import SevenLayout from '@/layouts/seven-layout';
import type { Item } from '@/types';

interface VenteProps {
    items: Item[];
}

export default function Vente({ items }: VenteProps) {
    return (
        <SevenLayout title="Catalogue de vente">
            <Head title="Vente — Seven" />

            <div className="mb-4 border border-[var(--sidebar-border)] bg-[var(--seven-panel)] px-4 py-3">
                <p className="text-xs text-muted-foreground/80">
                    <span className="text-primary">&gt;</span> Vendez vos articles au réseau Seven. Nous rachetons les marchandises listées ci-dessous.
                </p>
            </div>

            {items.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[var(--sidebar-border)] bg-[var(--seven-panel)]">
                    <span className="text-xs text-muted-foreground/40">// AUCUN ARTICLE EN RACHAT</span>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <BuybackCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </SevenLayout>
    );
}

function BuybackCard({ item }: { item: Item }) {
    return (
        <div className="seven-panel fade-in flex flex-col">
            {/* Image */}
            <div className="relative h-36 overflow-hidden bg-[var(--seven-input-bg)]">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.nom} className="h-full w-full object-cover opacity-80" />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-3xl text-[var(--seven-subtle)]">?</span>
                    </div>
                )}
                <div className="absolute left-2 top-2 border border-destructive px-2 py-0.5 text-[10px] uppercase tracking-widest text-destructive">
                    RACHAT
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

                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">{item.nom}</h3>
                {item.description && (
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/80">{item.description}</p>
                )}

                <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between border-t border-[var(--sidebar-border)] pt-3">
                        <div>
                            <div className="text-[10px] text-muted-foreground/60">PRIX DE RACHAT</div>
                            <div className="text-lg font-bold text-primary">
                                {item.prix_achat ? `$${Number(item.prix_achat).toLocaleString()}` : 'N/A'}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-muted-foreground/60">UNITÉ</div>
                            <div className="text-sm text-muted-foreground/80">x1</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}