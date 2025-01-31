<?php

namespace App\Hooks;

use App\Hooks\Migrations\Delta;

class MigrationHooks {
    public static function init() : void {
        add_action('init', Delta::create_table(...));
    }
}