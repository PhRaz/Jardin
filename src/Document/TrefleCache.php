<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

#[MongoDB\EmbeddedDocument]
class TrefleCache
{
    #[MongoDB\Field(type: 'date')]
    private \DateTime $cachedAt;

    #[MongoDB\Field(type: 'string', nullable: true)]
    private ?string $imageLocale = null;

    #[MongoDB\Field(type: 'string')]
    private string $donneesJson = '{}';

    public function __construct()
    {
        $this->cachedAt = new \DateTime();
    }

    public function getCachedAt(): \DateTime
    {
        return $this->cachedAt;
    }

    public function getImageLocale(): ?string
    {
        return $this->imageLocale;
    }

    public function setImageLocale(?string $imageLocale): self
    {
        $this->imageLocale = $imageLocale;
        return $this;
    }

    public function getDonnees(): array
    {
        return json_decode($this->donneesJson, true) ?? [];
    }

    public function setDonnees(array $donnees): self
    {
        $this->donneesJson = json_encode($donnees, JSON_UNESCAPED_UNICODE);
        return $this;
    }

    public function estValide(int $dureeSecondes = 2592000): bool // 30 jours par défaut
    {
        return (time() - $this->cachedAt->getTimestamp()) < $dureeSecondes;
    }
}
