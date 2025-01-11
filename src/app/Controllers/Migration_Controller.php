<?php

namespace App\Controllers;

use App\Controllers\Migrations\Delta;

class Migration_Controller {
    public static function init() : void {
        add_action('init', Delta::create_table(...));
    }
}