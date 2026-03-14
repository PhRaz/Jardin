<?php

namespace App\Document;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

#[MongoDB\Document(collection: 'plantes')]
class Plante
{
    #[MongoDB\Id]
    private ?string $id = null;

    #[MongoDB\Field(type: 'string')]
    #[MongoDB\Index]
    private string $nom;

    #[MongoDB\Field(type: 'string')]
    private string $type;

    #[MongoDB\Field(type: 'string', nullable: true)]
    private ?string $nomEN = null;

    #[MongoDB\EmbedOne(targetDocument: TrefleCache::class, nullable: true)]
    private ?TrefleCache $trefleCache = null;

    /** @var Collection<int, Entretien> */
    #[MongoDB\EmbedMany(targetDocument: Entretien::class)]
    private Collection $entretien;

    public function __construct()
    {
        $this->entretien = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
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

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getNomEN(): ?string
    {
        return $this->nomEN;
    }

    public function setNomEN(?string $nomEN): self
    {
        $this->nomEN = $nomEN;
        return $this;
    }

    /** @return Collection<int, Entretien> */
    public function getEntretien(): Collection
    {
        return $this->entretien;
    }

    public function addEntretien(Entretien $entretien): self
    {
        $this->entretien->add($entretien);
        return $this;
    }

    public function removeEntretien(Entretien $entretien): self
    {
        $this->entretien->removeElement($entretien);
        return $this;
    }

    public function getTrefleCache(): ?TrefleCache
    {
        return $this->trefleCache;
    }

    public function setTrefleCache(?TrefleCache $trefleCache): self
    {
        $this->trefleCache = $trefleCache;
        return $this;
    }
}
