<?php

namespace App\Hooks;

use App\Hooks\Account\Api;
use App\Hooks\Account\Block;
use App\Hooks\Account\Meta;
use App\Hooks\Account\Routes;
use App\Hooks\Account\Scripts;

class AccountHooks {
    public static function init() : void {
        add_action('init', Routes::wp_init(...));
        add_action('wp_enqueue_scripts', Scripts::wp_enqueue_scripts(...), 100);
        add_action('rest_api_init', Meta::rest_api_init(...));
        add_action('rest_api_init', Api::rest_api_init(...));
        add_action('rest_prepare_user', Meta::rest_prepare_user(...), 10, 3);

        add_filter('query_vars', Routes::query_vars(...));
        add_filter('app_before_render_block_profile', Block::app_before_render_block(...));
    }
}