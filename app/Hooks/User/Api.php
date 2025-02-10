<?php

namespace App\Hooks\User;

use Roots\WPConfig\Config;

class Api {
    public static function register_rest_route() : void {
        register_rest_route('app/v1', '/users', array(
            'methods' => \WP_REST_Server::READABLE,
            'callback' => self::get_user_data(...),
            'permission_callback' => function(){
                return is_user_logged_in();
            },
        ));
        register_rest_route('app/v1', '/get-user-token', array(
            'methods' => \WP_REST_Server::READABLE,
            'callback' => self::get_current_user_token(...),
            'permission_callback' => function(){
                return is_user_logged_in();
            },
        ));
    }

    public static function get_user_data(\WP_REST_Request $request) : \WP_REST_Response {
        $results = get_users();

        $response = array(
            'results' => array(),
            'count' => count_users(),
        );

        if($response['count'] === 0) {
            return rest_ensure_response($response);
        }

        foreach($results as $user_data) {
            $response['results'][] = array(
                'firstName' => $user_data->user_firstname,
                'lastName' => $user_data->user_lastname,
                'email' => $user_data->user_email,
                'roles' => '',
            );
        }

        $response['count'] = count_users();

        return rest_ensure_response($response);
    }

    public static function get_current_user_token(\WP_REST_Request $request) : \WP_REST_Response {
        $user_id = get_current_user_id();
        $user_dir = Config::get('MC_USERS_PATH');
        $uuid = get_user_meta($user_id, 'uuid', true);
        $token = false;

        if($user_dir) {
            $file_name = "{$user_dir}/{$uuid}.json";
            $file_data = json_decode(file_get_contents($file_name));
            $token = $file_data->application_password;
        }

        return rest_ensure_response(array(
            'token' => $token,
        ));
    }
}