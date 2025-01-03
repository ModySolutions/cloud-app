<?php

namespace App\classes\blocks;

class Auth {
    public static function init(): void {
        add_filter('app_before_render_block', self::app_before_render_block(...));
    }

    public static function app_before_render_block(array $context): array {
        $action = get_query_var('action') ?? 'sign-in';
        $allowed_actions = ['sign-in', 'sign-up', 'forgot-passwd', 'reset-passwd'];
        $context['action'] = in_array($action, $allowed_actions) ? $action : 'sign-in';

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