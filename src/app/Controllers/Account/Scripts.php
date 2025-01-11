<?php

namespace App\Controllers\Account;

class Scripts {
    public static function wp_enqueue_scripts(): void {
        $account_page_id = get_option('account_page_id');
        if(!is_page($account_page_id)) {
            return;
        }
        $account = include(APP_THEME_DIR.'/dist/account.asset.php');
        foreach($account['dependencies'] as $dependency) {
            wp_enqueue_script($dependency);
        }
        wp_enqueue_script(
            'account',
            APP_THEME_URL.'/dist/account.js',
            $account['version'],
            $account['dependencies'],
            ['in_footer' => true, 'type' => 'module']
        );
    }
}