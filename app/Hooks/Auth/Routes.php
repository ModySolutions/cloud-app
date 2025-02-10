<?php

namespace App\Hooks\Auth;

use Roots\WPConfig\Config;
use function Env\env;

class Routes {
    public static function wp_init(): void {
        add_rewrite_rule(
            'auth/([^/]+)/?$',
            'index.php?pagename=auth&action=$matches[1]',
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

    public static function admin_init(): void {
        if (env('WP_ENV') === 'local') {
            return;
        }
        if (is_admin() && !current_user_can('manage_network')) {
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

    public static function template_redirect(): void {
        if (is_category() || is_tag() || is_date() || is_author() || is_tax() || is_attachment()) {
            global $wp_query;
            $wp_query->set_404();
        }

        $allowed_pages = ['invoices', 'account', 'auth'];
        $current_page_id = get_queried_object_id();

        $is_allowed_page = false;
        foreach ($allowed_pages as $slug) {
            $page = get_page_by_path($slug);
            if ($page && ($current_page_id == $page->ID || wp_get_post_parent_id($current_page_id) == $page->ID)) {
                $is_allowed_page = true;
                break;
            }
        }

        if (!$is_allowed_page && Config::get('CHILD_SITE')) {
            wp_redirect(home_url('/invoices'));
            exit;
        }

        if(is_user_logged_in()) {
            if (is_front_page() && !is_admin()) {
                $current_user = wp_get_current_user();
                wp_redirect(app_get_initial_page($current_user));
                exit;
            }
        } else {
            $autologin_token = array_key_exists('autologin_key', $_GET) ?
                urldecode($_GET['autologin_key']) : null;
            $autologin_email = array_key_exists('email', $_GET) ?
                sanitize_email($_GET['email']) : null;

            if((!$autologin_email && !$autologin_token) && !is_page('auth')) {
                wp_redirect(wp_login_url());
                exit;
            }

            $user = $autologin_email ? get_user_by('email', $autologin_email) : false;
            if($user && $autologin_token) {
                if(app_validate_autologin_token($user, $autologin_token)) {
                    wp_set_auth_cookie($user->ID);
                    $initial_page = app_get_initial_page($user);
                    wp_redirect($initial_page);
                    exit;
                }
            }
        }
    }

    public static function query_vars(array $vars): array {
        $vars[] = 'action';
        return $vars;
    }

    public static function login_url(string $login, string $redirect, bool $force_re_auth): string {
        $login_page = Config::get('APP_MAIN_SITE') . '/auth/sign-in';
        return $redirect ? add_query_arg('initial_page', $redirect, $login_page) : $login_page;
    }

    public static function logout_url(string $logout_url, string $redirect): string {
        $auth_page = get_option('authentication_page_id');
        $page_permalink = get_permalink($auth_page);
        return trailingslashit("{$page_permalink}sign-out");
    }

    public static function register_url(string $register_url): string {
        return trailingslashit(Config::get('APP_MAIN_SITE') . '/auth/sign-up');
    }

    public static function lostpassword_url(string $lostpassword_url, string $redirect): string {
        $lostpassword_url = Config::get('APP_MAIN_SITE') . '/auth/forgot-passwd';
        return $redirect ? add_query_arg('initial_page', $redirect, $lostpassword_url) : $lostpassword_url;
    }
}