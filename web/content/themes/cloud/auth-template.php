<?php
/**
 * Template name: Auth
 */

use Timber\Timber;
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render('@app/auth.twig', $context);