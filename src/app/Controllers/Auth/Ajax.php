<?php

namespace App\Controllers\Auth;

use Timber\Timber;
use function Env\env;

class Ajax {
    public static function sign_in(): void {
        if (!defined('DOING_AJAX') || !DOING_AJAX) {
            wp_send_json_error(array('message' => __('Invalid request.')));
        }

        $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            wp_send_json_error(array('message' => __('Email and password are required.')));
        }

        $userdata = get_user_by('email', $email);

        if (!$userdata) {
            wp_send_json_error(array('message' => __('Incorrect email or password.')));
        }

        if ($userdata) {
            $user_is_active = get_user_meta($userdata->ID, '_user_is_active', true);
            if (!$user_is_active) {
                wp_send_json_error(array(
                    'message' => sprintf(
                        __(implode('<br>', [
                            'Your account is not yet active, please check your email.',
                            'Haven\'t get an email, <a href="%s">Reset your password</a> to get one'
                        ])),
                        add_query_arg([
                            'email' => urlencode($email),
                        ], wp_lostpassword_url())
                    )
                ));
            }

            $lockout_time = get_user_meta($userdata->ID, '_failed_login_lockout', true);
            if ($lockout_time && $lockout_time > time()) {
                $remaining_time = $lockout_time - time();
                wp_send_json_error(array(
                    'message' => __('Account locked. Try again in ').
                        round($remaining_time / 60).
                        __(' minutes.')
                ));
            }
        }

        $failed_attempts = get_user_meta($userdata->ID, '_failed_login_attempts', true);
        if (!$failed_attempts) {
            $failed_attempts = 0;
        }

        $user = wp_authenticate($email, $password);
        if (is_wp_error($user)) {
            $failed_attempts++;
            update_user_meta($user->ID, '_failed_login_attempts', $failed_attempts);

            if ($failed_attempts >= 3) {
                update_user_meta($user->ID, '_failed_login_lockout', time() + (24 * 60 * 60));
                wp_send_json_error(array(
                    'message' => __('Incorrect email or password. You have no attempts left. Your account is locked for 24 hours.')
                ));
            }

            wp_send_json_error(array(
                'message' => sprintf(__('Incorrect email or password. You have %d attempts left.'),
                    (3 - $failed_attempts))
            ));
        }

        update_user_meta($user->ID, '_failed_login_attempts', 0);

        wp_set_auth_cookie($user->ID, true);

        $dashboard_page_id = get_option('dashboard_page_id');
        $dashboard_url = get_permalink($dashboard_page_id);
        wp_send_json_success(array(
            'message' => sprintf(__('Login successful, welcome %s'), $userdata->first_name),
            'initial_page' => user_can($user, 'manage_network') ? network_admin_url() : $dashboard_url,
        ));
    }

    public static function sign_up(): void {
        if (!isset($_POST['email'])) {
            wp_send_json_error([
                'message' => __('Invalid request.'),
            ]);
        }

        $email = sanitize_email($_POST['email']);

        if (!is_email($email)) {
            wp_send_json_error([
                'message' => __('Invalid email address.'),
            ]);
        }

        if (email_exists($email)) {
            wp_send_json_error([
                'message' => __('This email is already registered.'),
            ]);
        }

        $random_password = wp_generate_password();
        $user_id = wp_create_user($email, $random_password, $email);

        if (is_wp_error($user_id)) {
            wp_send_json_error([
                'message' => __('There was an error creating your account.'),
            ]);
        }

        wp_update_user([
            'ID' => $user_id,
            'role' => 'subscriber',
        ]);

        $user = get_user_by('id', $user_id);
        $reset_key = get_password_reset_key($user);

        if (is_wp_error($reset_key)) {
            wp_send_json_error([
                'message' => __('Unable to generate password reset key.'),
            ]);
        }

        $reset_pass_page = wp_login_url();
        $auth_page_id = get_field('authentication_page', 'option');
        if ($auth_page_id) {
            $reset_pass_page = get_permalink($auth_page_id);
            $reset_pass_page .= 'reset-passwd';
        }

        $reset_url = add_query_arg([
            'key' => $reset_key,
            'email' => urlencode($user->user_email),
            'first_time' => 'true',
        ], $reset_pass_page);

        $button = Timber::compile('@app/mail/button.twig', [
            'link' => $reset_url,
            'text' => __('Activate account'),
        ]);

        $subject = __('Complete your registration');
        $message = sprintf(
            __('To complete your registration, please set your password using the link below:%s %s %s'),
            '<br><br>',
            $button,
            '<br><br>'
        );

        $message .= sprintf(
            __('If the button doesn\'t work, please copy the URL below in your browser: %s %s'),
            '<br><br>',
            $reset_url
        );

        $headers = ['Content-Type: text/html; charset=UTF-8'];
        $mail_sent = wp_mail($email, $subject, nl2br($message), $headers);

        if (!$mail_sent) {
            wp_send_json_error([
                'message' => __('Failed to send the email. Please try again.'),
            ]);
        }

        wp_send_json_success([
            'message' => __('Registration successful! Please check your email to complete the process.'),
            'callback' => 'hide_form'
        ]);
    }

    public static function reset_password(): void {
        if (!isset($_POST['key'], $_POST['email'], $_POST['password'])) {
            wp_send_json_error([
                'message' => __('Invalid request.'),
            ]);
        }

        $key = sanitize_text_field($_POST['key']);
        $email = sanitize_user($_POST['email']);
        $password = $_POST['password'];

        if ($_POST['password'] !== $_POST['confirm-password']) {
            wp_send_json_error([
                'message' => __('Please confirm your password'),
            ]);
        }

        if (!self::_is_secure_password($password)) {
            wp_send_json_error([
                'message' => __('Password must be at least 8 characters long, contain at least one uppercase letter, and one special character.'),
            ]);
        }

        $user = get_user_by_email($email);

        if (!$user) {
            wp_send_json_error([
                'message' => __('Invalid reset link.'),
            ]);
        }

        $is_valid_key = check_password_reset_key($key, $user->user_login);

        if (is_wp_error($is_valid_key)) {
            wp_send_json_error([
                'message' => __('Invalid or expired reset link.'),
            ]);
        }

        wp_set_password($password, $user->ID);
        update_user_meta($user->ID, '_user_is_active', 1);

        $first_time = $_POST['first_time'] ?? false;
        if ($first_time === 'yes') {
            $initial_page = self::_authenticate_user($email, $password);
            self::_store_password_hash($email);
        }

        wp_send_json_success([
            'message' => __('Password reset successfully. Let\'s make awesome...'),
            'initial_page' => $initial_page ?? home_url(),
        ]);
    }

    private static function _is_secure_password(string $password): bool {
        $pattern = '/^(?=.*[A-Z])(?=.*[\W])(?=.*[a-zA-Z0-9]).{8,}$/';
        return preg_match($pattern, $password) === 1;
    }

    private static function _authenticate_user($email, $password) : string {
        $create_page_id = get_option('create_page_id');
        $initial_page = get_permalink($create_page_id);
        $user = wp_authenticate($email, $password);
        wp_set_auth_cookie($user->ID, true);
        return $initial_page;
    }

    private static function _store_password_hash($email) : void {
        if(!is_dir(MC_USERS_PATH)) {
            mkdir(MC_USERS_PATH);
        }

        $file_name = base64_encode($email) . '.txt';
        $file_path = MC_USERS_PATH . "/$file_name";
        if(!is_file($file_path)) {
            touch($file_path);
        }

        $user = get_user_by('email', $email);
        file_put_contents($file_path, $user->user_pass);
    }
}