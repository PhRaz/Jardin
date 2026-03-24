<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

#[MongoDB\EmbeddedDocument]
class CellulePlan
{
    #[MongoDB\Field(type: 'int')]
    private int $ligne;

    #[MongoDB\Field(type: 'int')]
    private int $colonne;

    #[MongoDB\Field(type: 'string')]
    private string $zoneId;

    public function getLigne(): int
    {
        return $this->ligne;
    }

    public function setLigne(int $ligne): self
    {
        $this->ligne = $ligne;
        return $this;
    }

    public function getColonne(): int
    {
        return $this->colonne;
    }

    public function setColonne(int $colonne): self
    {
        $this->colonne = $colonne;
        return $this;
    }

    public function getZoneId(): string
    {
        return $this->zoneId;
    }

    public function setZoneId(string $zoneId): self
    {
        $this->zoneId = $zoneId;
        return $this;
    }
}
