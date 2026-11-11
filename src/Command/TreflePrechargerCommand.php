<?php

namespace App\Command;

use App\Document\Plante;
use App\Exception\TrefleException;
use App\Service\TrefleService;
use App\Service\VignetteService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:trefle-precharger',
    description: 'Charge les données et images Trefle.io de toutes les plantes, et génère les vignettes',
)]
class TreflePrechargerCommand extends Command
{
    /** Trefle limite à 120 requêtes/minute ; chaque plante en coûte deux. */
    private const int PAUSE_MS = 1100;

    public function __construct(
        private DocumentManager $dm,
        private TrefleService $trefle,
        private VignetteService $vignettes,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('force', 'f', InputOption::VALUE_NONE, 'Interroge Trefle même si le cache est valide')
            ->addOption('plante', 'p', InputOption::VALUE_REQUIRED, 'Ne traiter qu\'une plante (nom exact)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $forcer = (bool) $input->getOption('force');
        $nom = $input->getOption('plante');

        $depot = $this->dm->getRepository(Plante::class);
        /** @var Plante[] $plantes */
        $plantes = $nom !== null ? array_filter([$depot->findOneBy(['nom' => $nom])]) : $depot->findAll();
        if ($plantes === []) {
            $io->error($nom !== null ? "Plante « $nom » introuvable." : 'Aucune plante en base.');

            return Command::FAILURE;
        }

        $lignes = [];
        $compteurs = ['image' => 0, 'sans image' => 0, 'introuvable' => 0, 'échec' => 0];
        $appelPrecedent = false;
        $io->progressStart(count($plantes));

        foreach ($plantes as $plante) {
            $appel = $forcer || !$this->trefle->cacheUtilisable($plante);
            if ($appel && $appelPrecedent) {
                usleep(self::PAUSE_MS * 1000);
            }
            $appelPrecedent = $appel;

            try {
                $donnees = $this->trefle->details($plante, $forcer);
            } catch (TrefleException $e) {
                $statut = $e->getCode() === 404 ? 'introuvable' : 'échec';
                $lignes[] = [$plante->getNom(), $statut, $e->getMessage()];
                $compteurs[$statut]++;
                $io->progressAdvance();
                continue;
            }

            $image = $plante->getTrefleCache()?->getImageLocale();
            if ($image !== null) {
                $this->vignettes->carre($image);
                $this->vignettes->reduite($image);
            }
            foreach ($plante->getPhotos() as $photo) {
                $this->vignettes->carre($photo->getChemin());
                $this->vignettes->reduite($photo->getChemin());
            }

            $statut = $image !== null ? 'image' : 'sans image';
            $compteurs[$statut]++;
            $lignes[] = [
                $plante->getNom(),
                ($appel ? '' : 'cache, ') . $statut,
                $this->espece($plante, $donnees),
            ];
            $io->progressAdvance();
        }

        $io->progressFinish();
        $io->table(['Plante', 'Résultat', 'Espèce retenue par Trefle (à vérifier)'], $lignes);
        $bilan = sprintf(
            '%d avec image, %d sans image, %d introuvable(s) sur Trefle, %d échec(s).',
            $compteurs['image'],
            $compteurs['sans image'],
            $compteurs['introuvable'],
            $compteurs['échec'],
        );
        $compteurs['échec'] > 0
            ? $io->warning($bilan . ' Relancez la commande : les plantes déjà chargées sont sautées.')
            : $io->success($bilan);

        return $compteurs['échec'] > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    /**
     * @param array<string, mixed> $donnees
     */
    private function espece(Plante $plante, array $donnees): string
    {
        $scientifique = $donnees['scientific_name'] ?? '?';
        $espece = trim($scientifique . ' — ' . ($donnees['common_name'] ?? ''), ' —');
        $attendu = $plante->getNomLatin();

        return $attendu !== null && strcasecmp($attendu, $scientifique) !== 0
            ? $espece . ' (≠ ' . $attendu . ')'
            : $espece;
    }
}
