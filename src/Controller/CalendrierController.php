<?php

namespace App\Controller;

use App\Document\Plante;
use Doctrine\ODM\MongoDB\DocumentManager;
use Sensiolabs\GotenbergBundle\Enumeration\Unit;
use Sensiolabs\GotenbergBundle\GotenbergPdfInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CalendrierController extends AbstractController
{
    private const MOIS_LABELS = [
        1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
        5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
        9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre',
    ];

    #[Route('/calendrier/apercu', name: 'app_calendrier_apercu')]
    public function apercu(Request $request, DocumentManager $dm): Response
    {
        $type = $request->query->getString('type', 'légume');
        $format = in_array($request->query->getString('format'), ['a3', 'a4'])
            ? $request->query->getString('format')
            : 'a4';

        return $this->render('calendrier/calendrier.html.twig', [
            ...$this->buildDonnees($dm, $type, $format),
            'mode' => 'apercu',
        ]);
    }

    #[Route('/calendrier/pdf', name: 'app_calendrier_pdf')]
    public function pdf(Request $request, DocumentManager $dm, GotenbergPdfInterface $gotenberg): Response
    {
        $type = $request->query->getString('type', 'légume');
        $format = in_array($request->query->getString('format'), ['a3', 'a4'])
            ? $request->query->getString('format')
            : 'a4';

        $donnees = [
            ...$this->buildDonnees($dm, $type, $format),
            'mode' => 'pdf',
        ];

        // Dimensions portrait en mm : A4=210×297, A3=297×420
        [$largeur, $hauteur] = $format === 'a3' ? [297.0, 420.0] : [210.0, 297.0];
        $nomFichier = sprintf(
            'calendrier-%s-%s.pdf',
            preg_replace('/[^a-z0-9]+/', '-', strtolower($type)),
            $format
        );

        return $gotenberg->html()
            ->content('calendrier/calendrier.html.twig', $donnees)
            ->paperSize($largeur, $hauteur, Unit::Millimeters)
            ->margins(0.0, 0.0, 0.0, 0.0)
            ->generate()
            ->stream($nomFichier);
    }

    private function buildDonnees(DocumentManager $dm, string $type, string $format): array
    {
        $plantes = $dm->getRepository(Plante::class)->findBy(['type' => $type]);

        $entretiensParMois = array_fill_keys(range(1, 12), []);
        foreach ($plantes as $plante) {
            foreach ($plante->getEntretien() as $entretien) {
                $mois = $entretien->getMois();
                if ($mois >= 1 && $mois <= 12) {
                    $entretiensParMois[$mois][] = [
                        'nom' => $plante->getNom(),
                        'operation' => $entretien->getOperation(),
                    ];
                }
            }
        }

        foreach ($entretiensParMois as &$ops) {
            usort($ops, fn($a, $b) => strcmp($a['nom'], $b['nom']));
        }

        return [
            'type' => $type,
            'format' => $format,
            'entretiensParMois' => $entretiensParMois,
            'moisLabels' => self::MOIS_LABELS,
        ];
    }
}
