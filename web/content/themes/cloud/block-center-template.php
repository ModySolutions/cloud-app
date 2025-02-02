<?php
/**
 * Template name: Block center
 */

use Timber\Timber;
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render('@app/wizard.twig', $context);