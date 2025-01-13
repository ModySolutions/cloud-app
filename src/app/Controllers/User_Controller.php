<?php

namespace App\Controllers;

use App\Controllers\User\Api;

class User_Controller {
    public static function init() : void {
        add_action('rest_api_init', Api::rest_api_init(...));
    }
}