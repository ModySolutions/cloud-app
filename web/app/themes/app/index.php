<?php

use Timber\Timber;
$context = Timber::context();
Timber::render('views/pages/index.twig', $context);
