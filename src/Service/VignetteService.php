<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Versions allégées (WebP) des images de plantes, générées à la demande puis gardées sur le disque.
 *
 * /images/plantes/x.jpg → /images/plantes/carre-96/x.webp (vignette carrée)
 *                       → /images/plantes/reduite-800/x.webp (largeur max 800 px)
 */
class VignetteService
{
    public const int TAILLE_CARRE = 96;
    public const int LARGEUR_REDUITE = 800;
    private const int QUALITE_WEBP = 80;

    public function __construct(
        #[Autowire('%kernel.project_dir%/public')]
        private string $dossierPublic,
    ) {}

    public function carre(string $chemin): ?string
    {
        return $this->deriver($chemin, 'carre-' . self::TAILLE_CARRE, self::TAILLE_CARRE, true);
    }

    public function reduite(string $chemin): ?string
    {
        return $this->deriver($chemin, 'reduite-' . self::LARGEUR_REDUITE, self::LARGEUR_REDUITE, false);
    }

    private function deriver(string $chemin, string $sousDossier, int $taille, bool $carre): ?string
    {
        $source = $this->dossierPublic . $chemin;
        if (!is_file($source) || !function_exists('imagewebp')) {
            return null;
        }

        $cheminPublic = dirname($chemin) . '/' . $sousDossier . '/' . pathinfo($chemin, PATHINFO_FILENAME) . '.webp';
        $cible = $this->dossierPublic . $cheminPublic;
        if (is_file($cible) && filemtime($cible) >= filemtime($source)) {
            return $cheminPublic;
        }

        return $this->generer($source, $cible, $taille, $carre) ? $cheminPublic : null;
    }

    private function generer(string $source, string $cible, int $taille, bool $carre): bool
    {
        $contenu = file_get_contents($source);
        $image = $contenu === false ? false : @imagecreatefromstring($contenu);
        if ($image === false) {
            return false;
        }

        $largeur = imagesx($image);
        $hauteur = imagesy($image);
        if ($carre) {
            $cote = min($largeur, $hauteur);
            [$srcX, $srcY, $srcL, $srcH] = [intdiv($largeur - $cote, 2), intdiv($hauteur - $cote, 2), $cote, $cote];
            [$dstL, $dstH] = [$taille, $taille];
        } else {
            $ratio = min(1, $taille / $largeur);
            [$srcX, $srcY, $srcL, $srcH] = [0, 0, $largeur, $hauteur];
            [$dstL, $dstH] = [max(1, (int) round($largeur * $ratio)), max(1, (int) round($hauteur * $ratio))];
        }

        $sortie = imagecreatetruecolor($dstL, $dstH);
        imagecopyresampled($sortie, $image, 0, 0, $srcX, $srcY, $dstL, $dstH, $srcL, $srcH);

        $dossier = dirname($cible);
        if (!is_dir($dossier) && !mkdir($dossier, 0755, true) && !is_dir($dossier)) {
            return false;
        }

        return imagewebp($sortie, $cible, self::QUALITE_WEBP);
    }
}
