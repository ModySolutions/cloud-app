<?php

namespace App\Controllers\Auth;

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

        if(is_user_logged_in()) {
            if (is_front_page() && !is_admin()) {
                $current_user = get_user(get_current_user_id());
                if(app_maybe_logout($current_user)) {
                    wp_redirect(wp_login_url());
                    exit;
                }
                $dashboard_page_id = get_option('dashboard_page_id');
                $dashboard_page = get_permalink($dashboard_page_id);
                wp_redirect($dashboard_page);
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
            if(!is_page('auth') || $autologin_token) {
                wp_redirect(wp_login_url());
                exit;
            }
        }
    }

    public static function query_vars(array $vars): array {
        $vars[] = 'action';
        return $vars;
    }

    public static function login_url(string $login, string $redirect, bool $force_re_auth): string {
        $auth_page = get_option('authentication_page_id');
        $page_permalink = get_permalink($auth_page);
        $login_page = trailingslashit("{$page_permalink}sign-in");
        return $redirect ? add_query_arg('initial_page', $redirect, $login_page) : $login_page;
    }

    public static function logout_url(string $logout_url, string $redirect): string {
        $auth_page = get_option('authentication_page_id');
        $page_permalink = get_permalink($auth_page);
        return trailingslashit("{$page_permalink}sign-out");
    }

    public static function register_url(string $register): string {
        $auth_page = get_option('authentication_page_id');
        $page_permalink = get_permalink($auth_page);
        return trailingslashit("{$page_permalink}sign-up");
    }

    public static function lostpassword_url(string $lostpassword_url, string $redirect): string {
        $auth_page = get_option('authentication_page_id');
        $page_permalink = get_permalink($auth_page);
        $lostpassword_page = trailingslashit("{$page_permalink}forgot-passwd");
        return $redirect ? add_query_arg('initial_page', $redirect, $lostpassword_page) : $lostpassword_page;
    }
}