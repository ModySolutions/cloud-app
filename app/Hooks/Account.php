<?php

namespace App\Hooks;

use App\Hooks\Account\Api;
use App\Hooks\Account\Block;
use App\Hooks\Account\Service;
use App\Hooks\Account\Routes;
use App\Hooks\User\Service as UserService;

class Account
{
    public const LAST_UPDATE = 'Hipe|Po|Sonya|Simple';
    public const ACCOUNT_PAGE_CONTENT = <<<EOF
<!-- wp:app/account-v2 -->
<p class="wp-block-app-account-v2">Example – hello from the saved content!</p>
<!-- /wp:app/account-v2 -->
EOF;

    public static function init(): void
    {
        add_action('init', self::wp_init(...));
        add_action('init', Routes::wp_init(...));
        add_action('rest_api_init', Api::register_rest_route(...));
        add_action('rest_prepare_user', Service::rest_prepare_user(...), 10, 3);
        add_action('delete_user', UserService::delete_user(...), 10, 3);

        add_filter('query_vars', Routes::query_vars(...));
        add_filter('app_before_render_block_profile', Block::app_before_render_block(...));
    }

    public static function wp_init(): void
    {
        $account_page_id = get_option('account_page_id');
        $account_module_last_update = get_option('account_option_last_update');
        if (! $account_page_id || $account_module_last_update !== self::LAST_UPDATE) {
            if (!$account_page_id) {
                $account_page_id = wp_insert_post([
                    'post_type' => 'page',
                    'post_title' => __('Account', APP_THEME_LOCALE),
                    'post_status' => 'publish',
                    'post_author' => 1,
                    'post_name' => 'account',
                    'post_content' => self::ACCOUNT_PAGE_CONTENT,
                ]);
            }

            wp_update_post([
                'ID' => $account_page_id,
                'post_content' => self::ACCOUNT_PAGE_CONTENT,
            ]);

            $main_cta = [
                'route' => '/invoices/new',
                'title' => __('New invoice', 'app'),
            ];

            update_post_meta($account_page_id, 'main_cta', $main_cta);

            update_option('account_option_last_update', self::LAST_UPDATE);
            update_option('account_page_id', $account_page_id);
        }
    }
}
