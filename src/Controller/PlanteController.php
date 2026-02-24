<?php

namespace App\Controller;

use App\Document\Plante;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
