<?php

namespace App\Hooks;

use App\Hooks\Page\Meta;

class Page {
    public static function init() : void {
        add_action('rest_api_init', Meta::rest_api_init(...));
    }
}