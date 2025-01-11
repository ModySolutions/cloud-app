<?php

namespace App\Controllers\Account;

class Routes {
    public static function wp_init(): void {
        add_rewrite_rule(
            'account/([^/]+)/?$',
            'index.php?pagename=account&account_page=$matches[1]',
            'top'
        );

        $login_page = basename($_SERVER['PHP_SELF']);
        if ($login_page === 'wp-login.php' && !current_user_can('manage_network')) {
            status_header(404);
            nocache_headers();
            include get_404_template();
            exit;
        }
    }

    public static function query_vars(array $vars): array {
        $vars[] = 'account_page';
        return $vars;
    }
}