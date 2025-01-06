<?php

namespace App\Controllers;

use App\Controllers\Sites\Ajax;
use App\Controllers\Sites\Block;

class Sites_Controller {
    public static function init() : void {
        add_action('wp_ajax_check_setup_finished', Ajax::check_setup_finished(...));
        add_action('wp_ajax_check_space_name_exists', Ajax::check_space_name_exists(...));
        add_action('wp_ajax_create_space', Ajax::create_space(...));
        add_filter('app_before_render_block_setup-wizard', Block::app_before_render_block(...));
    }
}