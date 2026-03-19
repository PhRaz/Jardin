<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Uid\Uuid;

#[MongoDB\EmbeddedDocument]
class PhotoPlante
{
    #[MongoDB\Field(type: 'string')]
    private string $id;

    #[MongoDB\Field(type: 'string')]
    private string $chemin;

    #[MongoDB\Field(type: 'date')]
    private \DateTime $priseLe;

    public function __construct()
    {
        $this->id = Uuid::v4()->toRfc4122();
        $this->priseLe = new \DateTime();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getChemin(): string
    {
        return $this->chemin;
    }

    public function setChemin(string $chemin): self
    {
        $this->chemin = $chemin;
        return $this;
    }

    public function getPriseLe(): \DateTime
    {
        return $this->priseLe;
    }
}
