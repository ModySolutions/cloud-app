<?php

namespace App\Hooks\Account;

use Roots\WPConfig\Config;

use function Env\env;

class Api
{
    public static function register_rest_route(): void
    {
        register_rest_route('app/v1', '/update-account/', [
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => self::update_account_data(...),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ]);
        register_rest_route('app/v1', '/update-account-settings/', [
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => self::update_account_settings(...),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ]);
        register_rest_route('app/v1', '/update-account-password/', [
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => self::update_account_password(...),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ]);
        register_rest_route('app/v1', '/update-main-account-password/', [
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => self::update_main_account_password(...),
            'permission_callback' => self::check_child_site_permission(...),
        ]);
    }

    public static function update_account_data($data): \WP_Error|\WP_REST_Response|\WP_HTTP_Response
    {
        $user_id = get_current_user_id();
        $data_user_id = (int) $data['user_id'];

        if (!$user_id || $user_id !== $data_user_id) {
            return new \WP_Error(
                'unauthorized',
                'You are not authorized to perform this action',
                ['status' => 401],
            );
        }

        $email = isset($data['email']) ? sanitize_email($data['email']) : false;
        $name = isset($data['name']) ? sanitize_text_field($data['name']) : false;
        $last_name = isset($data['last_name']) ? sanitize_text_field($data['last_name']) : false;
        $phone = isset($data['phone']) ? sanitize_text_field($data['phone']) : '';

        if (!$email) {
            return rest_ensure_response([
                'success' => false,
                'message' => __('Email address is required.', APP_THEME_LOCALE),
            ]);
        }

        if (!$name || !$last_name) {
            return rest_ensure_response([
                'success' => false,
                'message' => __('Name and last name are required.', APP_THEME_LOCALE),
            ]);
        }

        wp_update_user([
            'ID' => $user_id,
            'user_email' => $email,
            'first_name' => $name,
            'last_name' => $last_name,
        ]);

        update_user_meta($user_id, 'phone', $phone);

        return rest_ensure_response([
            'success' => true,
            'message' => __('User data updated successfully.', APP_THEME_LOCALE),
        ]);
    }

    public static function update_account_settings($data): \WP_Error|\WP_REST_Response|\WP_HTTP_Response
    {
        $user_id = get_current_user_id();
        $data_user_id = (int) $data['user_id'];

        if (!$user_id || $user_id !== $data_user_id) {
            return new \WP_Error(
                'unauthorized',
                'You are not authorized to perform this action.',
                ['status' => 401],
            );
        }

        $opt_in_updates = isset($data['opt_in_updates']) ? (int) $data['opt_in_updates'] : 1;
        $opt_in_commercial = isset($data['opt_in_commercial']) ? (int) $data['opt_in_commercial'] : 1;
        $preferred_language =
            isset($data['preferred_language']) ? sanitize_text_field($data['preferred_language']) : false;

        if (!$preferred_language) {
            $preferred_language = get_locale();
        }

        update_user_meta($user_id, 'opt_in_updates', $opt_in_updates);
        update_user_meta($user_id, 'opt_in_commercial', $opt_in_commercial);
        update_user_meta($user_id, 'preferred_language', $preferred_language);

        return rest_ensure_response([
            'success' => true,
            'message' => __('User settings updated successfully.', APP_THEME_LOCALE),
        ]);
    }

    public static function update_account_password($data): \WP_Error|\WP_REST_Response|\WP_HTTP_Response
    {
        $user_id = get_current_user_id();
        $data_user_id = (int) $data['user_id'];

        if (!$user_id || $user_id !== $data_user_id) {
            return new \WP_Error(
                'unauthorized',
                'You are not authorized to perform this action.',
                ['status' => 401],
            );
        }

        $current_password = $data['current_password'] ?? false;
        $new_password = $data['new_password'] ? trim($data['new_password']) : false;
        $confirm_new_password = $data['confirm_new_password'] ? trim($data['confirm_new_password']) : false;

        if (!$current_password || !$new_password || !$confirm_new_password) {
            return rest_ensure_response([
                'success' => false,
                'message' => __('All passwords are required., APP_THEME_LOCALE'),
            ]);
        }

        $user = get_user($user_id);
        $stored_password_hash = $user->user_pass;

        if (!wp_check_password($current_password, $stored_password_hash, $user_id)) {
            return rest_ensure_response([
                'success' => false,
                'message' => __('Current password does not match with stored password.', APP_THEME_LOCALE),
            ]);
        }

        if ($new_password !== $confirm_new_password) {
            return rest_ensure_response([
                'success' => false,
                'message' => __('New password should match to password confirmation field., APP_THEME_LOCALE'),
            ]);
        }

        if (!app_is_secure_password($new_password)) {
            return rest_ensure_response([
                'success' => false,
                'message' => __(
                    'Password must be at least 8 characters long, contain at least one uppercase letter, and one special character.',
                    APP_THEME_LOCALE,
                ),
            ]);
        }

        global $wpdb;

        $old_user_data = get_userdata($user_id);

        $hash = wp_hash_password($new_password);
        $wpdb->update($wpdb->users, [
            'user_pass' => $hash,
            'user_activation_key' => '',
        ], ['ID' => $user_id]);

        clean_user_cache($user_id);
        wp_set_auth_cookie($user_id);
        do_action('wp_set_password', $new_password, $user_id, $old_user_data);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Password updated successfully.', APP_THEME_LOCALE),
        ]);
    }

    public static function update_main_account_password(\WP_REST_Request $request): \WP_REST_Response
    {
        $email = $request->get_param('email');
        $hashed_password = $request->get_param('password');

        $user = get_user_by('email', $email);
        if (!$user) {
            return rest_ensure_response([
                'success' => false,
            ]);
        }

        $user_id = $user->ID;
        global $wpdb;
        $wpdb->update(
            $wpdb->users,
            [
                'user_pass' => $hashed_password,
            ],
            [
                'ID' => $user_id,
            ],
        );

        return rest_ensure_response([
            'email' => $email,
            'password' => $hashed_password,
        ]);
    }

    public static function check_child_site_permission(\WP_REST_Request $request): bool
    {
        if (Config::get('CHILD_SITE')) {
            return false;
        }

        $auth_header = $request->get_header('authorization');
        app_log("update-main-account-password: Change password main site");

        if (!$auth_header || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            return false;
        }

        $token = $matches[1];
        $valid_token = env('APP_CHILD_SITES_TOKEN');

        app_log("update-main-account-password: $token $valid_token");
        return $token === $valid_token;
    }
}
