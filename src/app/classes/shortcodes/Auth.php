<?php

namespace App\classes\shortcodes;

use Timber\Timber;

class Auth {
    public static function init(): void {
        add_shortcode('app_auth', self::do_shortcode(...));
    }

    public static function do_shortcode(array $attributes, string|null $content, string $tag): void {
        $action = get_query_var('action') ?? 'sign-in';
        $allowed_actions = ['sign-in', 'sign-up', 'forgot-passwd', 'reset-passwd'];
        $action = in_array($action, $allowed_actions) ? $action : 'sign-in';
        $template = "@app/pages/auth/{$action}.twig";

        $context = Timber::context([
            'action' => $action,
            'template' => $template,
        ]);
        Timber::render('@app/pages/auth/index.twig', $context);
    }
}