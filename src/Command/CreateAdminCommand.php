<?php

namespace App\Command;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crée un compte administrateur',
)]
class CreateAdminCommand extends Command
{
    public function __construct(
        private DocumentManager $dm,
        private UserPasswordHasherInterface $hasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'Email de l\'administrateur')
            ->addArgument('password', InputArgument::REQUIRED, 'Mot de passe')
            ->addOption('reset-password', null, InputOption::VALUE_NONE, 'Réinitialise le mot de passe si le compte existe déjà');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = $input->getArgument('email');
        $plainPassword = $input->getArgument('password');
        $reset = $input->getOption('reset-password');

        $existing = $this->dm->getRepository(User::class)->findOneBy(['email' => $email]);

        if ($existing) {
            if (!$reset) {
                $io->error("Un utilisateur avec l'email « $email » existe déjà. Utilisez --reset-password pour changer son mot de passe.");
                return Command::FAILURE;
            }

            $existing->setPassword($this->hasher->hashPassword($existing, $plainPassword));
            $this->dm->flush();

            $io->success("Mot de passe de « $email » mis à jour.");
            return Command::SUCCESS;
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($this->hasher->hashPassword($user, $plainPassword));
        $user->setRoles(['ROLE_ADMIN']);

        $this->dm->persist($user);
        $this->dm->flush();

        $io->success("Administrateur « $email » créé.");
        return Command::SUCCESS;
    }
}
