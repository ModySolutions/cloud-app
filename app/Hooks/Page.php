<?php

namespace App\Hooks;

use App\Hooks\Page\Service;

class Page
{
    public static function init(): void
    {
        add_action('rest_api_init', Service::rest_api_init(...));
    }
}
