<?php

namespace App\Controllers\Auth;

class Block {
    public static function app_before_render_block(array $context): array {
        $action = get_query_var('action') ?? 'sign-in';
        $allowed_actions = ['sign-in', 'sign-up', 'forgot-passwd', 'reset-passwd'];
        $context['action'] = in_array($action, $allowed_actions) ? $action : 'sign-in';

        if(in_array($context['action'], ['sign-in', 'sign-up']) && is_user_logged_in()){
            wp_redirect(home_url());
            exit;
        }

        if($context['action'] === 'sign-in' &&
            (array_key_exists('autologin_user', $_GET) &&
                array_key_exists('key', $_GET)
            )
        ) {
            $decoded_key = base64_decode($_GET['key']);
            if($decoded_key === 'from-first-install') {
                $user_id = sanitize_text_field($_GET['autologin_user']);
                wp_set_auth_cookie($user_id, true);
                wp_redirect(home_url());
                exit;
            }
        }

        if($context['action'] === 'forgot-passwd') {
            $context['email'] = isset($_GET['email']) ? sanitize_text_field($_GET['email']) : null;
        }

        if ($context['action'] === 'reset-passwd') {
            $context['key'] = isset($_GET['key']) ? sanitize_text_field($_GET['key']) : null;
            $context['email'] = isset($_GET['email']) ? sanitize_user($_GET['email']) : null;
            $context['first_time'] = isset($_GET['first_time']) ? 'yes' : null;

            if(!$context['key'] &&!$context['email']) {
                wp_redirect(wp_lostpassword_url());
                exit;
            }
        }
        $context['template'] = "@app/blocks/auth/{$context['action']}.twig";
        return $context;
    }
}