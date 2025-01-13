<?php

namespace App\Hooks;

use App\Hooks\User\Api;

class UserHooks {
    public static function init() : void {
        add_action('rest_api_init', Api::rest_api_init(...));
    }
}