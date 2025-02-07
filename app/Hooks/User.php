<?php

namespace App\Hooks;

use App\Hooks\User\Api;
use App\Hooks\User\Meta;

class User {
    public static function init() : void {
        add_action('rest_api_init', Api::register_rest_route(...));
        add_filter(
            'insert_custom_user_meta',
            Meta::insert_custom_user_meta(...),
            10,
            4
        );
    }
}