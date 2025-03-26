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
        $account = include(APP_THEME_DIR . '/dist/auth.asset.php');
        foreach ($account['dependencies'] as $dependency) {
            wp_enqueue_script($dependency);
        }
        wp_enqueue_script(
            'account',
            APP_THEME_URL . '/dist/auth.js',
            $account['version'],
            $account['dependencies'],
            ['in_footer' => true, 'type' => 'module'],
        );
    }
}
