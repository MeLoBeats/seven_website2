import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    nb_commandes_attente: number;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string | null;
    groupe: string | null;
    role: 'invite' | 'admin';
    photo_profil: string | null;
    photo_profil_url: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface PhoneNumber {
    id: number;
    user_id: number;
    numero: string;
    label: string | null;
}

export interface Tag {
    id?: number;
    nom: string;
    couleur: string;
}

export interface Item {
    id: number;
    nom: string;
    description: string | null;
    prix_achat: string | null;
    prix_vente: string | null;
    stock: number;
    type: 'achat' | 'vente' | 'les_deux';
    image_url: string | null;
    tags: Tag[];
}
