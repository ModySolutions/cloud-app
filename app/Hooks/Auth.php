<?php

namespace App\Hooks;

use App\Hooks\Account\Password;
use App\Hooks\Auth\Ajax;
use App\Hooks\Auth\Block;
use App\Hooks\Auth\Logout;
use App\Hooks\Auth\Routes;

class Auth
{
    public const LAST_UPDATE = 'Hipe|Tinky|Sonya|Simple';
    public const AUTH_PAGE_CONTENT = <<<EOF
<!-- wp:image {"lightbox":{"enabled":false},"width":"250px","sizeSlug":"medium","linkDestination":"custom","align":"center"} -->
<figure class="wp-block-image aligncenter size-medium is-resized"><a href="/"><img src="https://modycloud.test/content/uploads/2024/12/logo-mody-cloud-300x148.png" alt="" class="wp-image-51" style="width:250px"/></a></figure>
<!-- /wp:image -->

<!-- wp:app/auth-v2 -->
<p class="wp-block-app-auth-v2">Auth Module for Mody Cloud</p>
<!-- /wp:app/auth-v2 -->
EOF;

    public static function init(): void
    {
        add_action('init', self::wp_init(...));
        add_action('init', Routes::wp_init(...));
        add_action('admin_init', Routes::admin_init(...));
        add_action('template_redirect', Routes::template_redirect(...));
        add_action('wp_set_password', Password::wp_set_password(...), 10, 2);
        add_action('wp_ajax_nopriv_sign_in', Ajax::sign_in(...));
        add_action('wp_ajax_nopriv_sign_up', Ajax::sign_up(...));
        add_action('wp_ajax_nopriv_forgot_password', Ajax::forgot_password(...));
        add_action('wp_ajax_nopriv_reset_password', Ajax::reset_password(...));
        add_action('wp_logout', Logout::wp_logout(...));

        add_filter('query_vars', Routes::query_vars(...));
        add_filter('login_url', Routes::login_url(...), 10, 3);
        add_filter('logout_url', Routes::logout_url(...), 10, 3);
        add_filter('register_url', Routes::register_url(...), 10, 3);
        add_filter('lostpassword_url', Routes::lostpassword_url(...), 10, 3);

        add_filter('app_before_render_block_auth', Block::app_before_render_block(...));
        add_filter('render_block', Block::app_render_block(...), 10, 3);
    }

    public static function wp_init(): void
    {
        $authentication_page_id = get_option('authentication_page_id');
        $auth_module_last_update = get_option('auth_option_last_update');
        if (! $authentication_page_id || $auth_module_last_update !== self::LAST_UPDATE) {
            if (!$authentication_page_id) {
                $authentication_page_id = wp_insert_post([
                    'post_type' => 'page',
                    'post_title' => __('Auth', APP_THEME_LOCALE),
                    'post_status' => 'publish',
                    'post_author' => 1,
                    'post_name' => 'auth',
                    'post_content' => self::AUTH_PAGE_CONTENT,
                ]);
            }

            wp_update_post([
                'ID' => $authentication_page_id,
                'post_content' => self::AUTH_PAGE_CONTENT,
            ]);

            update_option('auth_option_last_update', self::LAST_UPDATE);
            update_option('authentication_page_id', $authentication_page_id);
        }
    }
}
