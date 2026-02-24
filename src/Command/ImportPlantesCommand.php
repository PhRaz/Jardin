<?php

namespace App\Command;

use App\Document\Entretien;
use App\Document\Plante;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:import-plantes',
    description: 'Importe les plantes depuis le fichier fixtures/plantes.json dans MongoDB',
)]
class ImportPlantesCommand extends Command
{
    public function __construct(private DocumentManager $dm)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $fichier = dirname(__DIR__, 2) . '/fixtures/plantes.json';
        if (!file_exists($fichier)) {
            $io->error("Fichier $fichier introuvable.");
            return Command::FAILURE;
        }

        $data = json_decode(file_get_contents($fichier), true);
        if (!$data) {
            $io->error('Impossible de décoder le JSON.');
            return Command::FAILURE;
        }

        // Vider la collection existante
        $this->dm->getDocumentCollection(Plante::class)->drop();
        $io->info('Collection "plantes" vidée.');

        foreach ($data as $item) {
            $plante = new Plante();
            $plante->setNom($item['nom']);
            $plante->setType($item['type']);

            foreach ($item['entretien'] as $e) {
                $entretien = new Entretien();
                $entretien->setOperation($e['operation']);
                $entretien->setMois($e['mois']);
                $entretien->setDetails($e['details']);
                $plante->addEntretien($entretien);
            }

            $this->dm->persist($plante);
        }

        $this->dm->flush();

        $io->success(count($data) . ' plantes importées dans MongoDB.');

        return Command::SUCCESS;
    }
}
