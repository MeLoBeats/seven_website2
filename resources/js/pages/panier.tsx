import { Head, Link, router, useForm } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

import SevenLayout from '@/layouts/seven-layout';
import type { Tag } from '@/types';

interface PanierItem {
    id: number;
    quantite: number;
    prix_unitaire: string;
    item: {
        id: number;
        nom: string;
        image_url: string | null;
        stock: number;
        tags: Tag[];
    };
}

interface PanierData {
    id: number;
    note: string | null;
    items: PanierItem[];
}

export default function Panier({ panier }: { panier: PanierData }) {
    const { data, setData, post, processing } = useForm({ note: panier.note ?? '' });

    const total = panier.items.reduce((sum, i) => sum + Number(i.prix_unitaire) * i.quantite, 0);

    function retirer(id: number) {
        router.delete(route('panier.retirer', id));
    }

    function majQuantite(id: number, quantite: number) {
        if (quantite < 1) return;
        router.patch(route('panier.quantite', id), { quantite });
    }

    function valider(e: React.FormEvent) {
        e.preventDefault();
        post(route('panier.valider'));
    }

    return (
        <SevenLayout title="Mon offre de vente">
            <Head title="Mon offre — Seven" />

            {panier.items.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-3 border border-[#1a1a1a] bg-[#0d0d0d]">
                    <span className="text-xs text-[#333]">// AUCUN ARTICLE</span>
                    <Link href={route('achat')} className="seven-btn-primary px-4 py-2 text-xs">
                        <ShoppingCart size={12} className="mr-1 inline" /> VOIR LE CATALOGUE DE RACHAT
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Items */}
                    <div className="space-y-3 lg:col-span-2">
                        <div className="text-[10px] tracking-widest text-[#333]">// ARTICLES ({panier.items.length})</div>

                        {panier.items.map((ci) => (
                            <div key={ci.id} className="seven-panel flex items-center gap-4 p-3">
                                {/* Thumbnail */}
                                <div className="h-12 w-12 shrink-0 overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]">
                                    {ci.item.image_url ? (
                                        <img src={ci.item.image_url} alt="" className="h-full w-full object-cover opacity-80" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xl text-[#1a1a1a]">?</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold uppercase tracking-widest text-[#ccc]">{ci.item.nom}</div>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {ci.item.tags.map((t) => (
                                            <span key={t.nom} className="seven-tag" style={{ color: t.couleur, borderColor: t.couleur }}>
                                                {t.nom}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-1 text-[10px] text-[#444]">
                                        ${Number(ci.prix_unitaire).toLocaleString()} / u
                                    </div>
                                </div>

                                {/* Quantity controls */}
                                <div className="flex shrink-0 items-center border border-[#1e1e1e]">
                                    <button
                                        type="button"
                                        onClick={() => majQuantite(ci.id, ci.quantite - 1)}
                                        disabled={ci.quantite <= 1}
                                        className="cursor-pointer px-2 py-1 text-[#555] transition-colors hover:bg-[#111] hover:text-[#ccc] disabled:opacity-30"
                                    >
                                        <Minus size={11} />
                                    </button>
                                    <span className="w-8 text-center text-sm text-[#ccc]">{ci.quantite}</span>
                                    <button
                                        type="button"
                                        onClick={() => majQuantite(ci.id, ci.quantite + 1)}
                                        disabled={ci.quantite >= ci.item.stock}
                                        className="cursor-pointer px-2 py-1 text-[#555] transition-colors hover:bg-[#111] hover:text-[#ccc] disabled:opacity-30"
                                    >
                                        <Plus size={11} />
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div className="w-20 shrink-0 text-right">
                                    <div className="text-sm font-bold text-[#00ff41]">
                                        ${(Number(ci.prix_unitaire) * ci.quantite).toLocaleString()}
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => retirer(ci.id)}
                                    className="cursor-pointer shrink-0 text-[#333] transition-colors hover:text-[#cc0000]"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <div className="seven-panel p-4">
                            <div className="mb-3 text-[10px] tracking-widest text-[#333]">// ESTIMATION</div>

                            <div className="mb-3 flex items-center justify-between border-b border-[#1a1a1a] pb-3">
                                <span className="text-xs text-[#555]">Seven vous paiera</span>
                                <span className="text-xl font-bold text-[#00ff41]">${total.toLocaleString()}</span>
                            </div>

                            <form onSubmit={valider} className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-[#555]">
                                        Note (optionnel)
                                    </label>
                                    <textarea
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        className="seven-input w-full px-3 py-2 text-sm"
                                        rows={3}
                                        placeholder="Ex: disponible ce soir, contactez le 555-1234..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="seven-btn-primary w-full py-3 text-xs disabled:opacity-50"
                                >
                                    {processing ? '[ ENVOI... ]' : '[ VALIDER LA COMMANDE ]'}
                                </button>
                            </form>
                        </div>

                        <Link href={route('achat')} className="block text-center text-[10px] text-[#444] hover:text-[#999]">
                            &lt; Voir d'autres articles
                        </Link>
                    </div>
                </div>
            )}
        </SevenLayout>
    );
}
