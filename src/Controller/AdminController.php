<?php

namespace App\Controller;

use App\Document\Plante;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    #[Route('/entretien/{id}', name: 'admin_entretien_edit', methods: ['POST'])]
    public function editEntretien(string $id, Request $request, DocumentManager $dm): JsonResponse
    {
        if (!$this->isCsrfTokenValid('edit-details', $request->headers->get('X-CSRF-Token'))) {
            return $this->json(['error' => 'Token CSRF invalide'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $details = trim($data['details'] ?? '');

        if ($details === '') {
            return $this->json(['error' => 'Le champ détails ne peut pas être vide'], 400);
        }

        $plante = $dm->getRepository(Plante::class)->findOneBy(['entretien.id' => $id]);
        if (!$plante) {
            return $this->json(['error' => 'Opération introuvable'], 404);
        }

        foreach ($plante->getEntretien() as $entretien) {
            if ($entretien->getId() === $id) {
                $entretien->setDetails($details);
                $dm->flush();
                return $this->json(['success' => true, 'details' => $details]);
            }
        }

        return $this->json(['error' => 'Opération introuvable dans la plante'], 404);
    }
}
