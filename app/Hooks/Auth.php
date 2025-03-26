<?php

namespace App\Hooks;

use App\Hooks\Account\Password;
use App\Hooks\Auth\Ajax;
use App\Hooks\Auth\Block;
use App\Hooks\Auth\Logout;
use App\Hooks\Auth\Routes;
use App\Hooks\Auth\Scripts;

class Auth
{
    public static function init(): void
    {
        add_action('init', Routes::wp_init(...));
        add_action('admin_init', Routes::admin_init(...));
        add_action('template_redirect', Routes::template_redirect(...));
        add_action('wp_set_password', Password::wp_set_password(...), 10, 2);
        add_action('wp_enqueue_scripts', Scripts::wp_enqueue_scripts(...));
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
}
