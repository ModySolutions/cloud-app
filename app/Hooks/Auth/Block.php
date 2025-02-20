<?php

namespace App\Hooks\Auth;

use Roots\WPConfig\Config;

class Block {
    public static function app_before_render_block(array $context): array {
        $action = get_query_var('action');
        if(empty($action)) {
            wp_redirect(wp_login_url());
            exit;
        }
        $allowed_actions = ['sign-in', 'sign-up', 'forgot-passwd', 'reset-passwd', 'sign-out'];
        $context['action'] = in_array($action, $allowed_actions) ? $action : 'sign-in';

        self::_maybe_sign_out($context['action']);
        self::_redirect_if_logged_in($context['action']);
        self::_maybe_auto_login($context['action']);
        self::_maybe_populate_email($context['action'], $context);
        self::_maybe_populate_reset_passwd($context['action'], $context);

        if(Config::get('CHILD_SITE')) {
            wp_redirect(Config::get('APP_MAIN_SITE') . "/auth/{$context['action']}");
            exit;
        }

        return $context;
    }

    private static function _maybe_sign_out($action) : void {
        if($action === 'sign-out' && is_user_logged_in()) {
            wp_logout();
            if(Config::get('CHILD_SITE')) {
                wp_redirect(Config::get('APP_MAIN_SITE') . '/auth/sign-out');
            } else {
                wp_redirect(wp_login_url());
            }
            exit;
        }
    }

    private static function _redirect_if_logged_in($action) : void {
        if(in_array($action, array('sign-in', 'sign-up')) && is_user_logged_in()){
            $user = wp_get_current_user();
            $initial_page = app_get_initial_page($user);
            wp_redirect($initial_page);
            exit;
        }
    }

    private static function _maybe_auto_login($action) : void {
        if($action !== 'sign-in'){ return; }
        $autologin_key = array_key_exists('autologin_key', $_GET) ?
            urldecode($_GET['autologin_key']) : null;
        $autologin_email = array_key_exists('email', $_GET) ?
            htmlentities(base64_decode($_GET['email'])) : null;

//        wp_die($autologin_email);
        if((!$autologin_email && !$autologin_key)) {
            wp_redirect(Config::get('APP_MAIN_SITE'));
            exit;
        }

        $user = $autologin_email ? get_user_by('email', $autologin_email) : false;
        if($user && $autologin_key) {
            if(app_validate_autologin_token($user, $autologin_key)) {
                wp_set_auth_cookie($user->ID);
                wp_redirect(app_get_initial_page($user));
                exit;
            }
        }
    }

    private static function _maybe_populate_email($action, &$context) : void {
        if($action === 'forgot-passwd') {
            $context['email'] = isset($_GET['email']) ? sanitize_text_field($_GET['email']) : null;
        }
    }

    private static function _maybe_populate_reset_passwd($action, &$context) : void {
        if ($action === 'reset-passwd') {
            $context['key'] = isset($_GET['key']) ? sanitize_text_field($_GET['key']) : null;
            $context['email'] = isset($_GET['email']) ? sanitize_user($_GET['email']) : null;
            $context['first_time'] = isset($_GET['first_time']) ? 'yes' : null;

            if(!$context['key'] && !$context['email']) {
                wp_redirect(wp_lostpassword_url());
                exit;
            }
        }
    }
}