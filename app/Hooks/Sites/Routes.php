<?php

namespace App\Hooks\Sites;

use App\Features\Migrate;

class Routes {
    use Migrate;
    public static function permalink_structure() : void {
        $permalink_structure = get_option('permalink_structure');
        if($permalink_structure !== '/%postname%/') {
            update_option('permalink_structure', '/%postname%/');
        }
    }
}