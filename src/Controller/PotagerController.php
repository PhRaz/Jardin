<?php

namespace App\Controller;

use App\Document\CellulePlan;
use App\Document\JardinPlan;
use App\Document\Potager;
use App\Document\ZonePlan;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class PotagerController extends AbstractController
{
    #[Route('/potager', name: 'app_potager', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('potager/potager.html.twig');
    }

    #[Route('/api/potager', name: 'api_potager_load', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function load(DocumentManager $dm): JsonResponse
    {
        $email = $this->getUser()->getUserIdentifier();
        $potager = $dm->getRepository(Potager::class)->findOneBy(['proprietaire' => $email]);

        if (!$potager) {
            return $this->json(null, 404);
        }

        return $this->json($this->serialize($potager));
    }

    #[Route('/api/potager', name: 'api_potager_save', methods: ['PUT'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function save(Request $request, DocumentManager $dm): JsonResponse
    {
        if (!$this->isCsrfTokenValid('potager-save', $request->headers->get('X-CSRF-Token'))) {
            return $this->json(['error' => 'Token CSRF invalide'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['jardins'])) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        $email = $this->getUser()->getUserIdentifier();
        $potager = $dm->getRepository(Potager::class)->findOneBy(['proprietaire' => $email]);

        if (!$potager) {
            $potager = new Potager();
            $potager->setProprietaire($email);
            $dm->persist($potager);
        }

        $potager->setModifieLe(new \DateTime());
        $potager->getJardins()->clear();

        foreach ($data['jardins'] as $jardinData) {
            $jardin = new JardinPlan();
            $jardin->setId($jardinData['id'] ?? bin2hex(random_bytes(16)));
            $jardin->setNom(substr(trim($jardinData['nom'] ?? 'Potager'), 0, 30));
            $jardin->setCols(max(5, min(40, (int)($jardinData['cols'] ?? 20))));
            $jardin->setRows(max(5, min(40, (int)($jardinData['rows'] ?? 20))));

            foreach ($jardinData['zones'] ?? [] as $zoneData) {
                $zone = new ZonePlan();
                $zone->setId($zoneData['id'] ?? bin2hex(random_bytes(16)));
                $zone->setNom(substr(trim($zoneData['nom'] ?? ''), 0, 30));
                $zone->setType($zoneData['type'] ?? 'autre');
                $zone->setCouleur($zoneData['couleur'] ?? '#aaaaaa');
                $jardin->addZone($zone);
            }

            foreach ($jardinData['cellules'] ?? [] as $celluleData) {
                $cellule = new CellulePlan();
                $cellule->setLigne((int)($celluleData['ligne'] ?? 0));
                $cellule->setColonne((int)($celluleData['colonne'] ?? 0));
                $cellule->setZoneId($celluleData['zoneId'] ?? '');
                $jardin->addCellule($cellule);
            }

            $potager->addJardin($jardin);
        }

        $dm->flush();

        return $this->json(['success' => true]);
    }

    private function serialize(Potager $potager): array
    {
        return [
            'jardins' => $potager->getJardins()->map(fn(JardinPlan $j) => [
                'id'       => $j->getId(),
                'nom'      => $j->getNom(),
                'cols'     => $j->getCols(),
                'rows'     => $j->getRows(),
                'zones'    => $j->getZones()->map(fn(ZonePlan $z) => [
                    'id'      => $z->getId(),
                    'nom'     => $z->getNom(),
                    'type'    => $z->getType(),
                    'couleur' => $z->getCouleur(),
                ])->toArray(),
                'cellules' => $j->getCellules()->map(fn(CellulePlan $c) => [
                    'ligne'   => $c->getLigne(),
                    'colonne' => $c->getColonne(),
                    'zoneId'  => $c->getZoneId(),
                ])->toArray(),
            ])->toArray(),
        ];
    }
}
