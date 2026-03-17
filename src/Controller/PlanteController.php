<?php

namespace App\Controller;

use App\Document\Plante;
use App\Document\TrefleCache;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PlanteController extends AbstractController
{
    private const MOIS_LABELS = [
        1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
        5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
        9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre',
    ];

    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        return $this->redirectToRoute('app_mois', ['mois' => (int) date('n')]);
    }

    #[Route('/offline', name: 'app_offline')]
    public function offline(): Response
    {
        return $this->render('offline.html.twig');
    }

    #[Route('/mois/{mois}', name: 'app_mois', requirements: ['mois' => '1[0-2]?|[2-9]'])]
    public function mois(int $mois, DocumentManager $dm): Response
    {
        $plantes = $dm->getRepository(Plante::class)->findAll();

        // Grouper les opérations par type
        $operationsParType = [];
        foreach ($plantes as $plante) {
            foreach ($plante->getEntretien() as $entretien) {
                if ($entretien->getMois() === $mois) {
                    $type = $plante->getType();
                    $operationsParType[$type][] = [
                        'nom' => $plante->getNom(),
                        'operation' => $entretien->getOperation(),
                        'details' => $entretien->getDetails(),
                    ];
                }
            }
        }

        // Trier les types alphabétiquement et les plantes dans chaque type
        ksort($operationsParType);
        foreach ($operationsParType as &$ops) {
            usort($ops, fn($a, $b) => strcmp($a['nom'], $b['nom']));
        }

        // Première plante pour le lien "Par plante"
        $premierePlante = $this->getPremierePlante($plantes);

        return $this->render('plante/mois.html.twig', [
            'moisCourant' => $mois,
            'moisLabels' => self::MOIS_LABELS,
            'operationsParType' => $operationsParType,
            'premierePlante' => $premierePlante,
        ]);
    }

    #[Route('/plante/{nom}', name: 'app_plante')]
    public function plante(string $nom, DocumentManager $dm): Response
    {
        $plante = $dm->getRepository(Plante::class)->findOneBy(['nom' => $nom]);

        if (!$plante) {
            throw $this->createNotFoundException('Plante non trouvée : ' . $nom);
        }

        $toutesPlantes = $dm->getRepository(Plante::class)->findAll();

        // Grouper par type, triées alpha
        $plantesParType = [];
        foreach ($toutesPlantes as $p) {
            $plantesParType[$p->getType()][] = $p;
        }
        ksort($plantesParType);
        foreach ($plantesParType as &$groupe) {
            usort($groupe, fn($a, $b) => strcmp($a->getNom(), $b->getNom()));
        }

        return $this->render('plante/plante.html.twig', [
            'plante' => $plante,
            'plantesParType' => $plantesParType,
            'moisLabels' => self::MOIS_LABELS,
            'moisCourant' => (int) date('n'),
        ]);
    }

    #[Route('/api/plante/{nom}/details', name: 'api_plante_details')]
    public function details(string $nom, DocumentManager $dm): JsonResponse
    {
        $plante = $dm->getRepository(Plante::class)->findOneBy(['nom' => $nom]);
        if (!$plante) {
            return $this->json(['error' => 'Plante non trouvée'], 404);
        }

        // Retourner le cache si valide et image disponible
        $cache = $plante->getTrefleCache();
        if ($cache !== null && $cache->estValide()) {
            $imageLocale = $cache->getImageLocale();
            $cheminAbsolu = $imageLocale
                ? $this->getParameter('kernel.project_dir') . '/public' . $imageLocale
                : null;
            if ($cheminAbsolu === null || file_exists($cheminAbsolu)) {
                return $this->json($cache->getDonnees());
            }
            // Image locale manquante sur le disque → on recalcule
        }

        $token = $_ENV['TREFLE_API_TOKEN'] ?? '';
        $searchName = $plante->getNomEN() ?? $nom;

        $searchUrl = sprintf(
            'https://trefle.io/api/v1/plants/search?token=%s&q=%s',
            urlencode($token),
            urlencode($searchName)
        );

        $searchData = $this->trefleGet($searchUrl);
        if ($searchData === null) {
            return $this->json(['error' => 'Erreur lors de la recherche Trefle.io'], 502);
        }
        if (empty($searchData['data'])) {
            return $this->json(['error' => "Aucun résultat pour « $nom »"], 404);
        }

        $speciesId = $searchData['data'][0]['id'];
        $detailsUrl = sprintf(
            'https://trefle.io/api/v1/species/%d?token=%s',
            $speciesId,
            urlencode($token)
        );

        $detailsData = $this->trefleGet($detailsUrl);
        if ($detailsData === null) {
            return $this->json(['error' => 'Erreur lors de la récupération des détails'], 502);
        }

        $donnees = $detailsData['data'] ?? [];

        // Télécharger l'image en local
        $imageDistante = $donnees['image_url']
            ?? $donnees['images']['flower'][0]['image_url']
            ?? $donnees['images']['habit'][0]['image_url']
            ?? null;

        if ($imageDistante) {
            $imageLocale = $this->telechargerImage($imageDistante, $nom);
            if ($imageLocale !== null) {
                $donnees['image_url'] = $imageLocale;
            }
        }

        // Sauvegarder en cache MongoDB
        $nouveauCache = new TrefleCache();
        $nouveauCache->setDonnees($donnees);
        $nouveauCache->setImageLocale($donnees['image_url'] ?? null);
        $plante->setTrefleCache($nouveauCache);
        $dm->flush();

        return $this->json($donnees);
    }

    private function telechargerImage(string $urlDistante, string $nomPlante): ?string
    {
        $dossier = $this->getParameter('kernel.project_dir') . '/public/images/plantes';
        if (!is_dir($dossier)) {
            mkdir($dossier, 0755, true);
        }

        $ext = pathinfo(parse_url($urlDistante, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
        $ext = in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'webp']) ? strtolower($ext) : 'jpg';

        $nomFichier = preg_replace('/[^a-z0-9]+/', '-', strtolower($nomPlante));
        $nomFichier = trim($nomFichier, '-') . '.' . $ext;
        $cheminLocal = $dossier . '/' . $nomFichier;

        $contenu = @file_get_contents($urlDistante);
        if ($contenu === false) {
            return null;
        }

        if (file_put_contents($cheminLocal, $contenu) === false) {
            return null;
        }

        return '/images/plantes/' . $nomFichier;
    }

    private function trefleGet(string $url): ?array
    {
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'ignore_errors' => true,
                'header' => "Accept: application/json\r\n",
            ],
        ]);

        $response = @file_get_contents($url, false, $context);
        if ($response === false) {
            return null;
        }

        $data = json_decode($response, true);
        return is_array($data) ? $data : null;
    }

    /**
     * @param Plante[] $plantes
     */
    private function getPremierePlante(array $plantes): string
    {
        $parType = [];
        foreach ($plantes as $p) {
            $parType[$p->getType()][] = $p;
        }
        ksort($parType);
        $premierType = array_key_first($parType);
        if ($premierType === null) {
            return '';
        }
        usort($parType[$premierType], fn($a, $b) => strcmp($a->getNom(), $b->getNom()));
        return $parType[$premierType][0]->getNom();
    }
}
