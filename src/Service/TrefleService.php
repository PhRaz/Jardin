<?php

namespace App\Service;

use App\Document\Plante;
use App\Document\TrefleCache;
use App\Exception\TrefleException;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Données botaniques Trefle.io : recherche par nom anglais, image téléchargée en local,
 * résultat mis en cache dans le document Plante (30 jours).
 */
class TrefleService
{
    private const string URL_API = 'https://trefle.io/api/v1';
    private const int TIMEOUT_SECONDES = 10;

    public function __construct(
        private DocumentManager $dm,
        private VignetteService $vignettes,
        #[Autowire('%kernel.project_dir%/public')]
        private string $dossierPublic,
        #[Autowire('%env(default::TREFLE_API_TOKEN)%')]
        private ?string $token,
    ) {}

    /**
     * Le cache est utilisable s'il est encore valide et que son image (s'il en a une) est sur le disque.
     */
    public function cacheUtilisable(Plante $plante): bool
    {
        $cache = $plante->getTrefleCache();
        if ($cache === null || !$cache->estValide()) {
            return false;
        }
        $image = $cache->getImageLocale();

        return $image === null || is_file($this->dossierPublic . $image);
    }

    /**
     * @return array<string, mixed> données de l'espèce (image_url pointant sur l'image locale si téléchargée)
     *
     * @throws TrefleException
     */
    public function details(Plante $plante, bool $forcer = false): array
    {
        if (!$forcer && $this->cacheUtilisable($plante)) {
            return $plante->getTrefleCache()->getDonnees();
        }

        $recherche = $this->get('/plants/search', ['q' => $plante->getNomEN() ?? $plante->getNom()]);
        if (empty($recherche['data'])) {
            throw new TrefleException(sprintf('Aucun résultat pour « %s »', $plante->getNom()), 404);
        }

        $donnees = $this->get('/species/' . (int) $recherche['data'][0]['id'])['data'] ?? [];

        $imageDistante = $donnees['image_url']
            ?? $donnees['images']['flower'][0]['image_url']
            ?? $donnees['images']['habit'][0]['image_url']
            ?? null;
        if ($imageDistante !== null) {
            $imageLocale = $this->telechargerImage($imageDistante, $plante->getNom());
            if ($imageLocale !== null) {
                $donnees['image_url'] = $imageLocale;
                $this->vignettes->carre($imageLocale);
                $this->vignettes->reduite($imageLocale);
            }
        }

        $cache = new TrefleCache();
        $cache->setDonnees($donnees);
        $cache->setImageLocale($donnees['image_url'] ?? null);
        $plante->setTrefleCache($cache);
        $this->dm->flush();

        return $donnees;
    }

    /**
     * @param array<string, string> $parametres
     * @return array<string, mixed>
     *
     * @throws TrefleException
     */
    private function get(string $chemin, array $parametres = []): array
    {
        $url = self::URL_API . $chemin . '?' . http_build_query(['token' => $this->token ?? ''] + $parametres);
        $contexte = stream_context_create([
            'http' => [
                'timeout' => self::TIMEOUT_SECONDES,
                'ignore_errors' => true,
                'header' => "Accept: application/json\r\n",
            ],
        ]);

        $reponse = @file_get_contents($url, false, $contexte);
        $data = $reponse === false ? null : json_decode($reponse, true);
        if (!is_array($data)) {
            throw new TrefleException('Erreur lors de l\'appel à Trefle.io', 502);
        }
        if (!empty($data['error']) || (!isset($data['data']) && isset($data['message']))) {
            throw new TrefleException('Trefle.io : ' . ($data['message'] ?? 'erreur inconnue'), 502);
        }

        return $data;
    }

    private function telechargerImage(string $urlDistante, string $nomPlante): ?string
    {
        $dossier = $this->dossierPublic . '/images/plantes';
        if (!is_dir($dossier) && !mkdir($dossier, 0755, true) && !is_dir($dossier)) {
            return null;
        }

        $ext = strtolower(pathinfo((string) parse_url($urlDistante, PHP_URL_PATH), PATHINFO_EXTENSION));
        $ext = in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true) ? $ext : 'jpg';
        $nomFichier = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($nomPlante)), '-') . '.' . $ext;

        $contenu = @file_get_contents($urlDistante);
        if ($contenu === false || file_put_contents($dossier . '/' . $nomFichier, $contenu) === false) {
            return null;
        }

        return '/images/plantes/' . $nomFichier;
    }
}
