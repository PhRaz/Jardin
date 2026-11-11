<?php

namespace App\Dto;

/**
 * Données de la landing page « Le chemin du jardin ».
 */
final readonly class AccueilDto
{
    /**
     * @param array<int, int>   $operationsParMois     mois (1-12) => nombre d'opérations
     * @param array<int, array{nom: string, operation: string}> $apercuMois quelques opérations du mois visité
     * @param array<string, array<int, array{nom: string, image: ?string}>> $plantesParType type => plantes
     * @param array<int, string[]> $friseSuivie        mois (1-12) => opérations de la plante suivie
     */
    public function __construct(
        public int $nbPlantes,
        public int $nbOperations,
        public int $moisCourant,
        public int $moisVisite,
        public array $operationsParMois,
        public array $apercuMois,
        public ?string $planteSuivie,
        public ?string $imageSuivie,
        public array $friseSuivie,
        public ?int $moisRebond,
        public ?string $operationRebond,
        public array $plantesParType,
    ) {}
}
