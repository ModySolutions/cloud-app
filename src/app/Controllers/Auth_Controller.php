<?php

namespace App\Controllers;

use App\Controllers\Account\Set_Password;
use App\Controllers\Auth\Ajax;
use App\Controllers\Auth\Block;
use App\Controllers\Auth\Routes;
use App\Controllers\Auth\Scripts;

class Auth_Controller {
    public static function init(): void {
        add_action('init', Routes::wp_init(...));
        add_action('admin_init', Routes::admin_init(...));
        add_action('template_redirect', Routes::template_redirect(...));
        add_action('wp_set_password', Set_Password::wp_set_password(...), 10, 2);
        add_action('wp_enqueue_scripts', Scripts::wp_enqueue_scripts(...));
        add_action('wp_ajax_nopriv_sign_in', Ajax::sign_in(...));
        add_action('wp_ajax_nopriv_sign_up', Ajax::sign_up(...));
        add_action('wp_ajax_nopriv_forgot_password', Ajax::forgot_password(...));
        add_action('wp_ajax_nopriv_reset_password', Ajax::reset_password(...));

        add_filter('query_vars', Routes::query_vars(...));
        add_filter('login_url', Routes::login_url(...), 10, 3);
        add_filter('logout_url', Routes::logout_url(...), 10, 3);
        add_filter('register_url', Routes::register_url(...), 10, 3);
        add_filter('lostpassword_url', Routes::lostpassword_url(...), 10, 3);

        add_filter('app_before_render_block_auth', Block::app_before_render_block(...));
    }
}