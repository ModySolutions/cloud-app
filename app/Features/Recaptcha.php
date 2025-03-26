<?php

namespace App\Features;

use Roots\WPConfig\Config;

trait Recaptcha
{
    public static function validate_recaptcha(): void
    {
        $recaptcha_token = $_POST['token'] ?? '';
        $recaptcha_secret = Config::get('RECAPTCHA_SECRET');

        if ($recaptcha_secret && $recaptcha_token) {
            $response = wp_remote_get(add_query_arg([
                'secret' => $recaptcha_secret,
                'response' => $recaptcha_token,
            ], 'https://www.google.com/recaptcha/api/siteverify'));
            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body);

            if (!$result->success || $result->score < 0.5) {
                wp_send_json_error(
                    [
                        'success' => false,
                        'message' => __('Incorrect email or password.', APP_THEME_LOCALE),
                        'result' => $result,
                    ],
                    400,
                );
            }
        }
    }
}
