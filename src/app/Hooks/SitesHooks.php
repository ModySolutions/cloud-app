<?php

namespace App\Hooks;

use App\Hooks\Sites\Ajax;
use App\Hooks\Sites\Block;
use App\Hooks\Sites\Post;
use App\Hooks\Sites\Routes;

class SitesHooks {
    public static function init() : void {
        add_action('init', Routes::permalink_structure(...));
        add_action('init', Post::register_post_type(...));
        add_action('wp_install', Routes::migrate(...));
        add_action('wp_ajax_check_setup_finished', Ajax::check_setup_finished(...));
        add_action('wp_ajax_check_space_name_exists', Ajax::check_space_name_exists(...));
        add_action('wp_ajax_create_space', Ajax::create_space(...));
        add_filter('app_before_render_block_create-site', Block::app_before_render_block(...));
    }
}