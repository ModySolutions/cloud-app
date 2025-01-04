<?php

namespace App\controllers;

use App\controllers\setup_wizard\Ajax;
use App\controllers\setup_wizard\Block;

class Wizard_Controller {
    public static function init() : void {
        add_action('wp_ajax_check_space_name_exists', Ajax::check_space_name_exists(...));
        add_filter('app_before_render_block_setup-wizard', Block::app_before_render_block(...));
    }
}