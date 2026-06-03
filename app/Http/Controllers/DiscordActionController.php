<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DiscordActionController extends Controller
{
    public function valider(Request $request, Commande $commande): Response
    {
        if (! $request->hasValidSignature()) {
            abort(403, 'Lien invalide ou expiré.');
        }

        if ($commande->statut !== 'en_attente') {
            return $this->page('Déjà traitée', "Cette commande est déjà <strong>{$commande->statut}</strong>.", '#ffaa00');
        }

        $commande->update(['statut' => 'validee']);

        return $this->page('Commande validée ✅', "La commande de <strong>{$commande->user->username}</strong> a été validée.", '#00ff41');
    }

    public function refuser(Request $request, Commande $commande): Response
    {
        if (! $request->hasValidSignature()) {
            abort(403, 'Lien invalide ou expiré.');
        }

        if ($commande->statut !== 'en_attente') {
            return $this->page('Déjà traitée', "Cette commande est déjà <strong>{$commande->statut}</strong>.", '#ffaa00');
        }

        $commande->update(['statut' => 'refusee']);

        return $this->page('Commande refusée ❌', "La commande de <strong>{$commande->user->username}</strong> a été refusée.", '#cc0000');
    }

    private function page(string $titre, string $message, string $couleur): Response
    {
        $html = <<<HTML
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>{$titre} — Seven</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: #080808; color: #c8c8c8; font-family: 'Courier New', monospace;
                       display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                .box { border: 1px solid {$couleur}; padding: 2rem 3rem; text-align: center; max-width: 400px; }
                .title { color: {$couleur}; font-size: 1.2rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem; }
                .msg { font-size: 0.85rem; color: #999; line-height: 1.6; }
                .footer { margin-top: 1.5rem; font-size: 0.7rem; color: #333; letter-spacing: 0.1em; }
            </style>
        </head>
        <body>
            <div class="box">
                <div class="title">{$titre}</div>
                <div class="msg">{$message}</div>
                <div class="footer">SEVEN NETWORK</div>
            </div>
        </body>
        </html>
        HTML;

        return response($html);
    }
}
