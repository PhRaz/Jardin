<?php

namespace App\Document;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

#[MongoDB\Document(collection: 'potagers')]
class Potager
{
    #[MongoDB\Id]
    private ?string $id = null;

    #[MongoDB\Field(type: 'string')]
    #[MongoDB\Index]
    private string $proprietaire;

    #[MongoDB\Field(type: 'date')]
    private \DateTime $creeLe;

    #[MongoDB\Field(type: 'date')]
    private \DateTime $modifieLe;

    /** @var Collection<int, JardinPlan> */
    #[MongoDB\EmbedMany(targetDocument: JardinPlan::class)]
    private Collection $jardins;

    public function __construct()
    {
        $this->jardins = new ArrayCollection();
        $this->creeLe = new \DateTime();
        $this->modifieLe = new \DateTime();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getProprietaire(): string
    {
        return $this->proprietaire;
    }

    public function setProprietaire(string $proprietaire): self
    {
        $this->proprietaire = $proprietaire;
        return $this;
    }

    public function getCreeLe(): \DateTime
    {
        return $this->creeLe;
    }

    public function getModifieLe(): \DateTime
    {
        return $this->modifieLe;
    }

    public function setModifieLe(\DateTime $modifieLe): self
    {
        $this->modifieLe = $modifieLe;
        return $this;
    }

    /** @return Collection<int, JardinPlan> */
    public function getJardins(): Collection
    {
        return $this->jardins;
    }

    public function addJardin(JardinPlan $jardin): self
    {
        $this->jardins->add($jardin);
        return $this;
    }
}
