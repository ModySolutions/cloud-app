<?php

namespace App\Hooks;

use GeoIp2\Database\Reader;
use Roots\WPConfig\Config;
use Timber\Timber;

class Security
{
    public static function init(): void
    {
        add_action('rest_api_init', self::cors_headers(...));
        add_action('wp_head', [Security::class, 'add_recaptcha']);
        add_action('init', [Security::class, 'limit_access_to_spain']);

        remove_action('wp_head', 'rest_output_link_wp_head', 10);
        remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
        remove_action('template_redirect', 'rest_output_link_header', 10);

        remove_action('admin_init', '_maybe_update_core');
        remove_action('wp_version_check', 'wp_version_check');

        remove_action('load-plugins.php', 'wp_update_plugins');
        remove_action('load-update.php', 'wp_update_plugins');
        remove_action('load-update-core.php', 'wp_update_plugins');
        remove_action('admin_init', '_maybe_update_plugins');
        remove_action('wp_update_plugins', 'wp_update_plugins');

        remove_action('load-themes.php', 'wp_update_themes');
        remove_action('load-update.php', 'wp_update_themes');
        remove_action('load-update-core.php', 'wp_update_themes');
        remove_action('admin_init', '_maybe_update_themes');
        remove_action('wp_update_themes', 'wp_update_themes');

        remove_action('update_option_WPLANG', 'wp_clean_update_cache', 10, 0);
        remove_action('wp_maybe_auto_update', 'wp_maybe_auto_update');
        remove_action('init', 'wp_schedule_update_checks');
        remove_action('wp_delete_temp_updater_backups', 'wp_delete_all_temp_backups');
    }

    public static function cors_headers(): void
    {
        header("Access-Control-Allow-Origin: https://*.modycloud.test");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, Content-Type");
        header("Access-Control-Allow-Credentials: true");
    }

    public static function add_recaptcha(): void
    {
        if (is_singular()) {
            global $post;
            $blocks = parse_blocks($post->post_content);
            if ($blocks && is_array($blocks)) {

                $add_script = function () {
                    $recaptcha_site_key = Config::get('RECAPTCHA_KEY');
                    $recaptcha_site_secret = Config::get('RECAPTCHA_SECRET');

                    if (!$recaptcha_site_key || !$recaptcha_site_secret) {
                        return;
                    }

                    echo Timber::compile('@app/components/tags/script.twig', [
                        'src' => add_query_arg([
                            'render' => $recaptcha_site_key,
                        ], 'https://www.google.com/recaptcha/api.js'),
                        'defer' => true,
                    ]);
                };

                $protected_pages = [
                    'app/auth',
                ];
                foreach ($blocks as $block) {
                    if (in_array($block['blockName'], $protected_pages)) {
                        $add_script();
                        return;
                    }
                }
            }
        }
    }

    public static function limit_access_to_spain(): void
    {
        $ip = $_SERVER['REMOTE_ADDR'];

        $dbPath = Config::get('SRC_PATH') . '/geodb/GeoLite2-Country.mmdb';
        if (!file_exists($dbPath)) {
            return;
        }

        try {
            $reader = new Reader($dbPath);
            $record = $reader->country($ip);

            if ($record->country->isoCode !== 'ES') {
                wp_die(
                    __('Only Spain users allowed.', APP_THEME_LOCALE),
                    __('Access denied', APP_THEME_LOCALE),
                    ['response' => 403],
                );
            }
        } catch (\Exception $e) {
            return;
        }
    }
}
