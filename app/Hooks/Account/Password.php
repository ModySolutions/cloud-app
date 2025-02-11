<?php

namespace App\Hooks\Account;

use Roots\WPConfig\Config;
use function Env\env;

class Password {
    public static function wp_set_password(string $password, int $user_id) : void {
        if(Config::get('CHILD_SITE')) {
            self::propagate_passwd_from_child($password, $user_id);
        }
    }

    public static function propagate_passwd_from_child(string $password, int $user_id) : void {
        $user = get_user($user_id);
        $response = wp_remote_post(env('APP_MAIN_SITE') . '/wp-json/app/v1/update-main-account-password/', [
            'body'    => json_encode([
                'email'      => $user->user_email,
                'password'   => wp_hash_password($password),
                'user_data'  => $user,
            ]),
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . env('APP_CHILD_SITES_TOKEN'),
            ],
            'sslverify' => env('WP_ENV') === 'production'
        ]);

        if (is_wp_error($response)) {
            app_log('wp_set_password: ERROR: Could not update parent password');
            app_log('wp_set_password: ' . print_r($response->get_error_messages(), 1));
        } else {
            app_log('wp_set_password: ' . print_r($response['response'], 1));
        }
    }

    public static function propagate_passwd_from_main(string $password, int $user_id) : void {

    }
}