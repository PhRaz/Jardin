<?php

namespace App\Exception;

/**
 * Échec d'un appel à Trefle.io ; le code est le statut HTTP à renvoyer au front.
 */
class TrefleException extends \RuntimeException
{
}
