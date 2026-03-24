<?php

namespace App\Document;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

#[MongoDB\EmbeddedDocument]
class JardinPlan
{
    #[MongoDB\Field(type: 'string')]
    private string $id;

    #[MongoDB\Field(type: 'string')]
    private string $nom;

    #[MongoDB\Field(type: 'int')]
    private int $cols;

    #[MongoDB\Field(type: 'int')]
    private int $rows;

    /** @var Collection<int, ZonePlan> */
    #[MongoDB\EmbedMany(targetDocument: ZonePlan::class)]
    private Collection $zones;

    /** @var Collection<int, CellulePlan> */
    #[MongoDB\EmbedMany(targetDocument: CellulePlan::class)]
    private Collection $cellules;

    public function __construct()
    {
        $this->zones = new ArrayCollection();
        $this->cellules = new ArrayCollection();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;
        return $this;
    }

    public function getCols(): int
    {
        return $this->cols;
    }

    public function setCols(int $cols): self
    {
        $this->cols = $cols;
        return $this;
    }

    public function getRows(): int
    {
        return $this->rows;
    }

    public function setRows(int $rows): self
    {
        $this->rows = $rows;
        return $this;
    }

    /** @return Collection<int, ZonePlan> */
    public function getZones(): Collection
    {
        return $this->zones;
    }

    public function addZone(ZonePlan $zone): self
    {
        $this->zones->add($zone);
        return $this;
    }

    /** @return Collection<int, CellulePlan> */
    public function getCellules(): Collection
    {
        return $this->cellules;
    }

    public function addCellule(CellulePlan $cellule): self
    {
        $this->cellules->add($cellule);
        return $this;
    }
}
