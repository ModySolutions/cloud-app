<?php

namespace App\Controllers;

use App\Controllers\Auth\Ajax;
use App\Controllers\Auth\Block;

class Auth_Controller {
    public static function init(): void {
        add_action('init', self::wp_init(...));
        add_action('admin_init', self::admin_init(...));
        add_action('wp_ajax_nopriv_sign_in', Ajax::sign_in(...));
        add_action('wp_ajax_nopriv_sign_up', Ajax::sign_up(...));
        add_action('wp_ajax_nopriv_reset_password', Ajax::reset_password(...));

        add_filter('query_vars', self::query_vars(...));
        add_filter('login_url', self::login_url(...), 10, 3);
        add_filter('register_url', self::register_url(...), 10, 3);
        add_filter('lostpassword_url', self::lostpassword_url(...), 10, 3);

        add_filter('app_before_render_block_auth', Block::app_before_render_block(...));
    }

    public static function wp_init(): void {
        add_rewrite_rule('^([^/]+)/sign-in/?$', 'index.php?pagename=$matches[1]&action=sign-in', 'top');
        add_rewrite_rule('^([^/]+)/sign-up/?$', 'index.php?pagename=$matches[1]&action=sign-up', 'top');
        add_rewrite_rule('^([^/]+)/forgot-passwd/?$', 'index.php?pagename=$matches[1]&action=forgot-passwd', 'top');
        add_rewrite_rule('^([^/]+)/reset-passwd/?$', 'index.php?pagename=$matches[1]&action=reset-passwd', 'top');

        $login_page = basename($_SERVER['PHP_SELF']);
        if ($login_page === 'wp-login.php' && !current_user_can('administrator')) {
            status_header(404);
            nocache_headers();
            include get_404_template();
            exit;
        }
    }

    public static function admin_init(): void {
        if (is_admin() && !current_user_can('administrator')) {
            if (str_contains($_SERVER['REQUEST_URI'], 'admin-ajax.php')) {
                if (!defined('DOING_AJAX') || !DOING_AJAX) {
                    status_header(404);
                    nocache_headers();
                    include get_404_template();
                    exit;
                }
                return;
            }

            status_header(404);
            nocache_headers();
            include get_404_template();
            exit;
        }
    }

    public static function query_vars(array $vars): array {
        $vars[] = 'action';
        return $vars;
    }

    public static function login_url(string $login, string $redirect, bool $force_re_auth): string {
        $auth_page = get_field('authentication_page', 'option');
        $page_permalink = get_permalink($auth_page);
        $login_page = trailingslashit("{$page_permalink}sign-in");
        return $redirect ? add_query_arg('initial_page', $redirect, $login_page) : $login_page;
    }

    public static function register_url(string $register): string {
        $auth_page = get_field('authentication_page', 'option');
        $page_permalink = get_permalink($auth_page);
        return trailingslashit("{$page_permalink}sign-up");
    }

    public static function lostpassword_url(string $lostpassword_url, string $redirect): string {
        $auth_page = get_field('authentication_page', 'option');
        $page_permalink = get_permalink($auth_page);
        $lostpassword_page = trailingslashit("{$page_permalink}forgot-passwd");
        return $redirect ? add_query_arg('initial_page', $redirect, $lostpassword_page) : $lostpassword_page;
    }
}