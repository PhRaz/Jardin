<?php

namespace App\Service;

use App\Document\Plante;
use App\Dto\AccueilDto;
use Doctrine\ODM\MongoDB\DocumentManager;

/**
 * Construit le parcours de la landing : mois visité → plante suivie → mois de rebond.
 */
class AccueilService
{
    private const int TAILLE_APERCU = 3;

    public function __construct(
        private DocumentManager $dm,
        private VignetteService $vignettes,
    ) {}

    public function construire(int $moisCourant, int $graine): AccueilDto
    {
        /** @var Plante[] $plantes */
        $plantes = $this->dm->getRepository(Plante::class)->findAll();
        $collator = new \Collator('fr_FR');
        usort($plantes, fn(Plante $a, Plante $b) => $collator->compare($a->getNom(), $b->getNom()));

        $operationsParMois = array_fill(1, 12, 0);
        $plantesParType = [];
        foreach ($plantes as $plante) {
            foreach ($plante->getEntretien() as $entretien) {
                $operationsParMois[$entretien->getMois()]++;
            }
            $plantesParType[$plante->getType()][] = [
                'nom' => $plante->getNom(),
                'image' => $this->version($this->image($plante), $this->vignettes->carre(...)),
            ];
        }
        ksort($plantesParType);

        $moisVisite = $this->prochainMoisActif($moisCourant, $operationsParMois, true);
        $candidates = $moisVisite === null ? [] : $this->plantesDuMois($plantes, $moisVisite);
        $suivie = $this->choisirPlante($candidates, $graine);

        $friseSuivie = [];
        if ($suivie !== null) {
            foreach ($suivie->getEntretien() as $entretien) {
                $friseSuivie[$entretien->getMois()][] = $entretien->getOperation();
            }
        }

        [$moisRebond, $operationRebond] = $this->rebond($moisVisite, $friseSuivie, $operationsParMois);

        return new AccueilDto(
            nbPlantes: count($plantes),
            nbOperations: array_sum($operationsParMois),
            moisCourant: $moisCourant,
            moisVisite: $moisVisite ?? $moisCourant,
            operationsParMois: $operationsParMois,
            apercuMois: $moisVisite === null ? [] : $this->apercu($plantes, $moisVisite, $suivie),
            planteSuivie: $suivie?->getNom(),
            imageSuivie: $suivie === null ? null : $this->version($this->image($suivie), $this->vignettes->reduite(...)),
            friseSuivie: $friseSuivie,
            moisRebond: $moisRebond,
            operationRebond: $operationRebond,
            plantesParType: $plantesParType,
        );
    }

    /**
     * Premier mois ayant des opérations, à partir de $depart (inclus ou non), en bouclant sur l'année.
     *
     * @param array<int, int> $operationsParMois
     */
    private function prochainMoisActif(int $depart, array $operationsParMois, bool $inclus): ?int
    {
        for ($pas = $inclus ? 0 : 1; $pas < 12 + ($inclus ? 0 : 1); $pas++) {
            $mois = ($depart - 1 + $pas) % 12 + 1;
            if ($operationsParMois[$mois] > 0) {
                return $mois;
            }
        }

        return null;
    }

    /**
     * @param Plante[] $plantes
     * @return Plante[]
     */
    private function plantesDuMois(array $plantes, int $mois): array
    {
        return array_values(array_filter(
            $plantes,
            fn(Plante $p) => $this->operationsDuMois($p, $mois) !== [],
        ));
    }

    /**
     * Plante suivie : de préférence une plante avec photo, stable pour une même graine (le jour).
     *
     * @param Plante[] $candidates
     */
    private function choisirPlante(array $candidates, int $graine): ?Plante
    {
        $avecImage = array_values(array_filter($candidates, fn(Plante $p) => $this->image($p) !== null));
        $pool = $avecImage !== [] ? $avecImage : $candidates;

        return $pool === [] ? null : $pool[$graine % count($pool)];
    }

    /**
     * Mois où l'on retrouve la plante suivie après le mois visité, sinon le prochain mois actif.
     *
     * @param array<int, string[]> $friseSuivie
     * @param array<int, int>      $operationsParMois
     * @return array{0: ?int, 1: ?string}
     */
    private function rebond(?int $moisVisite, array $friseSuivie, array $operationsParMois): array
    {
        if ($moisVisite === null) {
            return [null, null];
        }

        for ($pas = 1; $pas < 12; $pas++) {
            $mois = ($moisVisite - 1 + $pas) % 12 + 1;
            if (isset($friseSuivie[$mois])) {
                return [$mois, $friseSuivie[$mois][0]];
            }
        }

        $mois = $this->prochainMoisActif($moisVisite, $operationsParMois, false);

        return [$mois === $moisVisite ? null : $mois, null];
    }

    /**
     * Quelques opérations du mois, la plante suivie en tête, puis des opérations de natures variées.
     *
     * @param Plante[] $plantes
     * @return array<int, array{nom: string, operation: string}>
     */
    private function apercu(array $plantes, int $mois, ?Plante $suivie): array
    {
        $lignes = [];
        foreach ($plantes as $plante) {
            foreach ($this->operationsDuMois($plante, $mois) as $operation) {
                $lignes[] = ['nom' => $plante->getNom(), 'operation' => $operation];
            }
        }

        $apercu = [];
        $vues = [];
        if ($suivie !== null) {
            foreach ($lignes as $i => $ligne) {
                if ($ligne['nom'] === $suivie->getNom()) {
                    $apercu[] = $ligne;
                    $vues[$ligne['operation']] = true;
                    unset($lignes[$i]);
                    break;
                }
            }
        }
        foreach ($lignes as $i => $ligne) {
            if (count($apercu) < self::TAILLE_APERCU && !isset($vues[$ligne['operation']])) {
                $apercu[] = $ligne;
                $vues[$ligne['operation']] = true;
                unset($lignes[$i]);
            }
        }
        foreach ($lignes as $ligne) {
            if (count($apercu) >= self::TAILLE_APERCU) {
                break;
            }
            $apercu[] = $ligne;
        }

        return $apercu;
    }

    /**
     * @return string[]
     */
    private function operationsDuMois(Plante $plante, int $mois): array
    {
        $operations = [];
        foreach ($plante->getEntretien() as $entretien) {
            if ($entretien->getMois() === $mois) {
                $operations[] = $entretien->getOperation();
            }
        }

        return $operations;
    }

    /**
     * Version allégée de l'image, ou l'originale si elle n'a pas pu être générée.
     *
     * @param callable(string): ?string $deriver
     */
    private function version(?string $image, callable $deriver): ?string
    {
        return $image === null ? null : ($deriver($image) ?? $image);
    }

    private function image(Plante $plante): ?string
    {
        $photos = $plante->getPhotos()->toArray();
        if ($photos !== []) {
            usort($photos, fn($x, $y) => $y->getPriseLe() <=> $x->getPriseLe());

            return $photos[0]->getChemin();
        }

        return $plante->getTrefleCache()?->getImageLocale();
    }
}
