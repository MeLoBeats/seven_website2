import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Package, Plus, Power, Trash2, X } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

import SevenLayout from '@/layouts/seven-layout';
import type { Item, Tag } from '@/types';

interface AdminItemsProps {
    items: Item[];
    tags: (Tag & { id: number })[];
}

type ItemForm = {
    nom: string;
    description: string;
    prix_achat: string;
    prix_vente: string;
    stock: string;
    type: 'achat' | 'vente' | 'les_deux';
    image: File | null;
    tags: number[];
};

const defaultForm: ItemForm = {
    nom: '',
    description: '',
    prix_achat: '',
    prix_vente: '',
    stock: '0',
    type: 'les_deux',
    image: null,
    tags: [],
};

export default function AdminItems({ items, tags }: AdminItemsProps) {
    const [editing, setEditing] = useState<Item | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showTagForm, setShowTagForm] = useState(false);

    const tagForm = useForm({ nom: '', couleur: '#d4af37' });
    const itemForm = useForm<ItemForm>(defaultForm);

    function openCreate() {
        itemForm.reset();
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(item: Item) {
        setEditing(item);
        itemForm.setData({
            nom: item.nom,
            description: item.description ?? '',
            prix_achat: item.prix_achat ?? '',
            prix_vente: item.prix_vente ?? '',
            stock: String(item.stock),
            type: item.type,
            image: null,
            tags: item.tags.map((t) => (t as Tag & { id: number }).id),
        });
        setShowForm(true);
    }

    function submitItem(e: React.FormEvent) {
        e.preventDefault();
        const url = editing ? route('admin.items.update', editing.id) : route('admin.items.store');
        itemForm.post(url, {
            forceFormData: true,
            onSuccess: () => {
                setShowForm(false);
                setEditing(null);
                itemForm.reset();
            },
        });
    }

    function deleteItem(id: number) {
        if (!confirm('Supprimer cet article ?')) return;
        router.delete(route('admin.items.destroy', id));
    }

    function submitTag(e: React.FormEvent) {
        e.preventDefault();
        tagForm.post(route('admin.tags.store'), {
            onSuccess: () => {
                tagForm.reset();
                setShowTagForm(false);
            },
        });
    }

    function deleteTag(id: number) {
        router.delete(route('admin.tags.destroy', id));
    }

    function toggleTag(id: number) {
        const current = itemForm.data.tags;
        itemForm.setData('tags', current.includes(id) ? current.filter((t) => t !== id) : [...current, id]);
    }

    function handleImage(e: ChangeEvent<HTMLInputElement>) {
        itemForm.setData('image', e.target.files?.[0] ?? null);
    }

    const typeLabels: Record<string, string> = {
        achat: 'Rachat seulement',
        vente: 'Vente seulement',
        les_deux: 'Achat & Vente',
    };

    return (
        <SevenLayout title="Gestion des articles">
            <Head title="Articles — Admin 777 Hustler" />

            {/* Tags section */}
            <div className="mb-6 seven-panel p-4">
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] tracking-widest text-muted-foreground/40">// TAGS</span>
                    <button onClick={() => setShowTagForm((v) => !v)} className="seven-btn-primary px-3 py-1 text-[10px]">
                        <Plus size={11} className="inline" /> TAG
                    </button>
                </div>

                {showTagForm && (
                    <form onSubmit={submitTag} className="mb-3 flex gap-2">
                        <input
                            type="text"
                            value={tagForm.data.nom}
                            onChange={(e) => tagForm.setData('nom', e.target.value)}
                            className="seven-input flex-1 px-3 py-1.5 text-sm"
                            placeholder="Nom du tag"
                        />
                        <input
                            type="color"
                            value={tagForm.data.couleur}
                            onChange={(e) => tagForm.setData('couleur', e.target.value)}
                            className="h-8 w-10 cursor-pointer border border-border bg-transparent"
                        />
                        <button type="submit" disabled={tagForm.processing} className="seven-btn-primary px-3 py-1 text-xs">
                            OK
                        </button>
                    </form>
                )}

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center gap-1">
                            <span className="seven-tag" style={{ color: tag.couleur, borderColor: tag.couleur }}>
                                {tag.nom}
                            </span>
                            <button
                                onClick={() => deleteTag(tag.id)}
                                className="cursor-pointer text-muted-foreground/40 hover:text-destructive"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                    {tags.length === 0 && <span className="text-[10px] text-muted-foreground/40">Aucun tag</span>}
                </div>
            </div>

            {/* Items header */}
            <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground/80">
                    <span className="text-primary">{items.length}</span> article{items.length !== 1 ? 's' : ''}
                </span>
                <button onClick={openCreate} className="seven-btn-primary px-4 py-2 text-xs">
                    <Plus size={12} className="mr-1 inline" /> NOUVEL ARTICLE
                </button>
            </div>

            {/* Item form modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[var(--seven-border-bright)] bg-[var(--seven-panel)] p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-[10px] tracking-widest text-muted-foreground/80">
                                {editing ? '// MODIFIER ARTICLE' : '// NOUVEL ARTICLE'}
                            </span>
                            <button
                                onClick={() => setShowForm(false)}
                                className="cursor-pointer text-muted-foreground/60 hover:text-foreground"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={submitItem} encType="multipart/form-data" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Nom</label>
                                    <input
                                        type="text"
                                        value={itemForm.data.nom}
                                        onChange={(e) => itemForm.setData('nom', e.target.value)}
                                        className="seven-input w-full px-3 py-2 text-sm"
                                    />
                                    {itemForm.errors.nom && <p className="mt-1 text-[10px] text-destructive">{itemForm.errors.nom}</p>}
                                </div>

                                <div className="col-span-2">
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Description</label>
                                    <textarea
                                        value={itemForm.data.description}
                                        onChange={(e) => itemForm.setData('description', e.target.value)}
                                        className="seven-input w-full px-3 py-2 text-sm"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Prix achat ($)</label>
                                    <input
                                        type="number"
                                        value={itemForm.data.prix_achat}
                                        onChange={(e) => itemForm.setData('prix_achat', e.target.value)}
                                        className="seven-input w-full px-3 py-2 text-sm"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Prix vente ($)</label>
                                    <input
                                        type="number"
                                        value={itemForm.data.prix_vente}
                                        onChange={(e) => itemForm.setData('prix_vente', e.target.value)}
                                        className="seven-input w-full px-3 py-2 text-sm"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Stock</label>
                                    <input
                                        type="number"
                                        value={itemForm.data.stock}
                                        onChange={(e) => itemForm.setData('stock', e.target.value)}
                                        className="seven-input w-full px-3 py-2 text-sm"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Type</label>
                                    <select
                                        value={itemForm.data.type}
                                        onChange={(e) => itemForm.setData('type', e.target.value as ItemForm['type'])}
                                        className="seven-input w-full px-3 py-2 text-sm"
                                    >
                                        <option value="achat">Rachat seulement</option>
                                        <option value="vente">Vente seulement</option>
                                        <option value="les_deux">Achat & Vente</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                        className="w-full text-[11px] text-muted-foreground/80 file:mr-3 file:border file:border-[var(--seven-border-bright)] file:bg-transparent file:px-2 file:py-1 file:text-[10px] file:text-muted-foreground/80 file:uppercase"
                                    />
                                </div>

                                {tags.length > 0 && (
                                    <div className="col-span-2">
                                        <label className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground/80">Tags</label>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => {
                                                const selected = itemForm.data.tags.includes(tag.id);
                                                return (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => toggleTag(tag.id)}
                                                        className="seven-tag transition-all"
                                                        style={{
                                                            color: selected ? '#000' : tag.couleur,
                                                            borderColor: tag.couleur,
                                                            backgroundColor: selected ? tag.couleur : 'transparent',
                                                        }}
                                                    >
                                                        {tag.nom}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={itemForm.processing}
                                    className="seven-btn-primary flex-1 py-2.5 text-xs disabled:opacity-50"
                                >
                                    {itemForm.processing ? '[ SAUVEGARDE... ]' : editing ? '[ MODIFIER ]' : '[ CRÉER ]'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="seven-btn-danger px-4 text-xs"
                                >
                                    ANNULER
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Items list */}
            {items.length === 0 ? (
                <div className="flex h-48 items-center justify-center border border-[var(--sidebar-border)] bg-[var(--seven-panel)]">
                    <span className="text-xs text-muted-foreground/40">// AUCUN ARTICLE</span>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => {
                        const stockColor =
                            item.stock > 10 ? '#00ff41' : item.stock > 0 ? '#ffaa00' : '#cc0000';
                        return (
                            <div key={item.id} className={`seven-panel fade-in flex items-center gap-4 p-4 transition-opacity ${!item.actif ? 'opacity-40' : ''}`}>
                                {/* Thumbnail */}
                                <div className="h-12 w-12 shrink-0 overflow-hidden border border-[var(--sidebar-border)] bg-[var(--seven-input-bg)]">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt=""
                                            className="h-full w-full object-cover object-center opacity-90"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[var(--seven-subtle)]">
                                            <Package size={18} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-foreground">{item.nom}</span>
                                        <span className="seven-tag border-[var(--seven-dim)] text-muted-foreground/80">{typeLabels[item.type]}</span>
                                        {item.tags.map((tag) => (
                                            <span
                                                key={(tag as Tag & { id: number }).id}
                                                className="seven-tag"
                                                style={{ color: tag.couleur, borderColor: tag.couleur }}
                                            >
                                                {tag.nom}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-4 text-[11px]">
                                        {item.prix_achat && (
                                            <span className="text-muted-foreground/80">
                                                Rachat: <span className="text-primary">${Number(item.prix_achat).toLocaleString()}</span>
                                            </span>
                                        )}
                                        {item.prix_vente && (
                                            <span className="text-muted-foreground/80">
                                                Vente: <span className="text-primary">${Number(item.prix_vente).toLocaleString()}</span>
                                            </span>
                                        )}
                                        <span style={{ color: stockColor }}>Stock: {item.stock}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        onClick={() => router.patch(route('admin.items.actif', item.id))}
                                        title={item.actif ? 'Désactiver le rachat' : 'Activer le rachat'}
                                        className="cursor-pointer transition-colors"
                                        style={{ color: item.actif ? 'var(--seven-green)' : 'var(--seven-dim)' }}
                                    >
                                        <Power size={15} />
                                    </button>
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="cursor-pointer text-muted-foreground/40 transition-colors hover:text-primary"
                                    >
                                        <Edit2 size={15} />
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="cursor-pointer text-muted-foreground/40 transition-colors hover:text-destructive"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </SevenLayout>
    );
}