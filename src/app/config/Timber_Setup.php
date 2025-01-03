<?php

namespace App\config;

use Timber\Timber;

class Timber_Setup {
    static function init(): void {
        Timber_Setup::action();
    }

    static function action(): void {
        if (\Timber::class) {
            add_action('timber/context', self::timber_context(...));
            add_filter('timber/twig', self::timber_twig(...));
            add_filter('timber/locations', self::timber_locations(...), 100);
        } else {
            add_action('admin_notices', self::admin_notice(...));
        }
    }

    public static function admin_notice(): void {
        echo <<<EOF
<div class="error">
  <p>
    Timber not activated. Please run <pre>composer require timber/timber</pre> in the project root terminal.
  </p>
</div>
EOF;
    }

    public static function timber_context(array $context): array {
        if (function_exists('get_fields')) {
            $context['options'] = get_fields('options');
            $context['auth_urls'] = [
                'sign_in' => wp_login_url(),
                'sign_up' => wp_registration_url(),
                'lost_password' => wp_lostpassword_url(),
            ];
        }
        $context['site_url'] = get_bloginfo('url');
        return $context;
    }

    public static function timber_twig(\Twig\Environment $twig): \Twig\Environment {
        $twig->addFilter(new \Twig\TwigFilter('admin_url', function ($filename) {
            return admin_url($filename);
        }));

        $twig->addFilter(new \Twig\TwigFilter('print_id', function ($string) {
            $id = " id=\"{$string}\" ";
            return $string ? $id : '';
        }));

        return $twig;
    }

    public static function timber_locations(array $paths): array {
        $paths['app'] = [
            SRC_PATH.'/views',
        ];

        return $paths;
    }
}