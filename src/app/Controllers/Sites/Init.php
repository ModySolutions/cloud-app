<?php

namespace App\Controllers\Sites;

use App\Traits\Migrate_Trait;

class Init {
    use Migrate_Trait;
    public static function wp_init() : void {
        $permalink_structure = get_option('permalink_structure');
        if($permalink_structure !== '/%postname%/') {
            update_option('permalink_structure', '/%postname%/');
        }
    }
}