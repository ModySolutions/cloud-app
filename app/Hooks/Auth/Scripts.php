<?php

namespace App\Hooks\Auth;

class Scripts
{
    public static function wp_enqueue_scripts(): void
    {
        $authentication_page_id = get_option('authentication_page_id');
        if (!is_page($authentication_page_id)) {
            return;
        }
    }
}
