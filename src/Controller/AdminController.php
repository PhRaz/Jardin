<?php

namespace App\Controller;

use App\Document\Plante;
use App\Document\PhotoPlante;
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

    #[Route('/plante/{nom}/photo', name: 'admin_plante_photo_upload', methods: ['POST'])]
    public function uploadPhoto(string $nom, Request $request, DocumentManager $dm): JsonResponse
    {
        if (!$this->isCsrfTokenValid('upload-photo', $request->headers->get('X-CSRF-Token'))) {
            return $this->json(['error' => 'Token CSRF invalide'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $photoData = $data['photo'] ?? '';

        if (!preg_match('/^data:image\/(jpeg|jpg|png|webp);base64,/', $photoData)) {
            return $this->json(['error' => "Format d'image invalide"], 400);
        }

        $plante = $dm->getRepository(Plante::class)->findOneBy(['nom' => $nom]);
        if (!$plante) {
            return $this->json(['error' => 'Plante non trouvée'], 404);
        }

        $base64 = preg_replace('/^data:image\/[a-z]+;base64,/', '', $photoData);
        $contenu = base64_decode($base64);
        if ($contenu === false) {
            return $this->json(['error' => 'Image invalide'], 400);
        }

        $dossier = $this->getParameter('kernel.project_dir') . '/public/images/plantes';
        if (!is_dir($dossier)) {
            mkdir($dossier, 0755, true);
        }

        $photo = new PhotoPlante();
        $nomFichier = $photo->getId() . '.jpg';
        if (file_put_contents($dossier . '/' . $nomFichier, $contenu) === false) {
            return $this->json(['error' => 'Erreur lors de la sauvegarde'], 500);
        }

        $photo->setChemin('/images/plantes/' . $nomFichier);
        $plante->addPhoto($photo);
        $dm->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/plante/{nom}/photo/{photoId}', name: 'admin_plante_photo_delete', methods: ['DELETE'])]
    public function deletePhoto(string $nom, string $photoId, Request $request, DocumentManager $dm): JsonResponse
    {
        if (!$this->isCsrfTokenValid('upload-photo', $request->headers->get('X-CSRF-Token'))) {
            return $this->json(['error' => 'Token CSRF invalide'], 403);
        }

        $plante = $dm->getRepository(Plante::class)->findOneBy(['nom' => $nom]);
        if (!$plante) {
            return $this->json(['error' => 'Plante non trouvée'], 404);
        }

        foreach ($plante->getPhotos() as $photo) {
            if ($photo->getId() === $photoId) {
                $cheminAbsolu = $this->getParameter('kernel.project_dir') . '/public' . $photo->getChemin();
                if (file_exists($cheminAbsolu)) {
                    unlink($cheminAbsolu);
                }
                $plante->removePhoto($photo);
                $dm->flush();
                return $this->json(['success' => true]);
            }
        }

        return $this->json(['error' => 'Photo introuvable'], 404);
    }
}
