<?php

use Timber\Timber;
$context = Timber::context();
Timber::render('views/pages/404.twig', $context);
