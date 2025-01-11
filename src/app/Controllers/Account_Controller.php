<?php

namespace App\Controllers;

use App\Controllers\Account\Api;
use App\Controllers\Account\Block;
use App\Controllers\Account\Meta;
use App\Controllers\Account\Routes;
use App\Controllers\Account\Scripts;

class Account_Controller {
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