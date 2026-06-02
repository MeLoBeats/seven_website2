import { Head, Link, router, useForm } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';

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

interface PanierProps {
    panier: PanierData;
}

export default function Panier({ panier }: PanierProps) {
    const { data, setData, post, processing } = useForm({ note: panier.note ?? '' });

    const total = panier.items.reduce((sum, i) => sum + Number(i.prix_unitaire) * i.quantite, 0);

    function retirer(id: number) {
        router.delete(route('panier.retirer', id));
    }

    function valider(e: React.FormEvent) {
        e.preventDefault();
        post(route('panier.valider'));
    }

    return (
        <SevenLayout title="Mon panier">
            <Head title="Panier — Seven" />

            {panier.items.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-3 border border-[#1a1a1a] bg-[#0d0d0d]">
                    <span className="text-xs text-[#333]">// PANIER VIDE</span>
                    <Link href={route('achat')} className="seven-btn-primary px-4 py-2 text-xs">
                        <ShoppingCart size={12} className="mr-1 inline" /> VOIR LE CATALOGUE
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="text-[10px] tracking-widest text-[#333]">// ARTICLES ({panier.items.length})</div>
                        {panier.items.map((ci) => (
                            <div key={ci.id} className="seven-panel flex items-center gap-4 p-3">
                                <div className="h-12 w-12 shrink-0 overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]">
                                    {ci.item.image_url ? (
                                        <img src={ci.item.image_url} alt="" className="h-full w-full object-cover opacity-80" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[#1a1a1a] text-xl">?</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold uppercase tracking-widest text-[#ccc]">{ci.item.nom}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {ci.item.tags.map((t) => (
                                            <span key={t.nom} className="seven-tag" style={{ color: t.couleur, borderColor: t.couleur }}>
                                                {t.nom}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className="text-[10px] text-[#444]">x{ci.quantite}</div>
                                    <div className="text-sm font-bold text-[#00ff41]">
                                        ${(Number(ci.prix_unitaire) * ci.quantite).toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-[#444]">${Number(ci.prix_unitaire).toLocaleString()} / u</div>
                                </div>

                                <button
                                    onClick={() => retirer(ci.id)}
                                    className="cursor-pointer shrink-0 text-[#333] transition-colors hover:text-[#cc0000]"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary + submit */}
                    <div className="space-y-4">
                        <div className="seven-panel p-4">
                            <div className="mb-3 text-[10px] tracking-widest text-[#333]">// RÉCAPITULATIF</div>

                            <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3 mb-3">
                                <span className="text-xs text-[#555]">Total estimé</span>
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
                                        placeholder="Infos supplémentaires pour l'admin..."
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
                            &lt; Continuer les achats
                        </Link>
                    </div>
                </div>
            )}
        </SevenLayout>
    );
}
