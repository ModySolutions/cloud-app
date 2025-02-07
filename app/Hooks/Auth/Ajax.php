<?php

namespace App\Hooks\Auth;

use App\Hooks\Queue\Post;
use Timber\Timber;
use function Env\env;

class Ajax {
    public static function sign_in(): void {
        if (!defined('DOING_AJAX') || !DOING_AJAX) {
            wp_send_json_error(array('message' => __('Invalid request.')), APP_THEME_LOCALE);
        }

        $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
        $password = $_POST['password'] ?? '';
        $remember_me = !!$_POST['remember_me'];

        if (empty($email) || empty($password)) {
            wp_send_json_error(array('message' => __('Email and password are required.')), APP_THEME_LOCALE);
        }

        $userdata = get_user_by('email', $email);

        if (!$userdata) {
            wp_send_json_error(array('message' => __('Incorrect email or password.')), APP_THEME_LOCALE);
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
                    'message' => __('Account locked. Try again in ', APP_THEME_LOCALE).
                        round($remaining_time / 60).
                        __(' minutes., APP_THEME_LOCALE')
                ));
            }
        }

        $failed_attempts = get_user_meta($userdata->ID, '_failed_login_attempts', true);
        if (!$failed_attempts) {
            $failed_attempts = 0;
        }

        $user = wp_signon(array(
            'user_login'    => $email,
            'user_password' => $password,
            'remember'      => $remember_me,
        ));

        if (is_wp_error($user)) {
            $failed_attempts++;
            update_user_meta($user->ID, '_failed_login_attempts', $failed_attempts);

            if ($failed_attempts >= 3) {
                update_user_meta($user->ID, '_failed_login_lockout', time() + (24 * 60 * 60));
                wp_send_json_error(array(
                    'message' => __('Incorrect email or password., APP_THEME_LOCALE')
                ));
            }

            wp_send_json_error(array(
                'message' => __('Incorrect email or password., APP_THEME_LOCALE')
            ));
        }

        update_user_meta($user->ID, '_failed_login_attempts', 0);

        wp_set_auth_cookie($user->ID, true);

        $initial_page = app_get_initial_page($user);

        wp_send_json_success(array(
            'message' => sprintf(__('Login successful, welcome %s'), $userdata->first_name, APP_THEME_LOCALE),
            'initial_page' => $initial_page,
        ));
    }

    public static function sign_up(): void {
        if (!isset($_POST['email'])) {
            wp_send_json_error([
                'message' => __('Invalid request.', APP_THEME_LOCALE),
            ]);
        }

        $email = sanitize_email($_POST['email']);

        if (!is_email($email)) {
            wp_send_json_error([
                'message' => __('Invalid email address.', APP_THEME_LOCALE),
            ]);
        }

        if (email_exists($email)) {
            wp_send_json_error([
                'message' => __('This email is already registered.', APP_THEME_LOCALE),
            ]);
        }

        $random_password = wp_generate_password();
        $user_id = wp_create_user($email, $random_password, $email);

        if (is_wp_error($user_id)) {
            wp_send_json_error([
                'message' => __('There was an error creating your account.', APP_THEME_LOCALE),
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
                'message' => __('Unable to generate password reset key.', APP_THEME_LOCALE),
            ]);
        }

        $reset_pass_page = wp_login_url();
        $auth_page_id = get_option('authentication_page_id');
        if ($auth_page_id) {
            $reset_pass_page = get_permalink($auth_page_id);
            $reset_pass_page .= 'reset-passwd';
        }

        $reset_url = add_query_arg(array(
            'key' => $reset_key,
            'email' => urlencode($user->user_email),
            'first_time' => 'true',
        ), $reset_pass_page);

        $button = Timber::compile('@app/mail/button.twig', [
            'link' => $reset_url,
            'text' => __('Activate account', APP_THEME_LOCALE),
        ]);

        $subject = __('Complete your registration', APP_THEME_LOCALE);
        $message = sprintf(
            __('To complete your registration, please set your password using the link below:%s %s %s', APP_THEME_LOCALE),
            '<br><br>',
            $button,
            '<br><br>'
        );

        $message .= sprintf(
            __('If the button doesn\'t work, please copy the URL below in your browser: %s %s', APP_THEME_LOCALE),
            '<br><br>',
            $reset_url
        );

        $headers = ['Content-Type: text/html; charset=UTF-8'];
        $mail_sent = wp_mail($email, $subject, $message, $headers);

        if (!$mail_sent) {
            global $wpdb;
            $wpdb->delete(
                $wpdb->usermeta,
                array('user_id' => $user_id)
            );
            wp_delete_user($user_id);
            wp_send_json_error([
                'message' => __('Failed to send the email. Please try again.', APP_THEME_LOCALE),
            ]);
        }

        wp_send_json_success([
            'message' => __('Registration successful! Please check your email to complete the process.', APP_THEME_LOCALE),
            'callback' => 'hide_form'
        ]);
    }

    public static function forgot_password(): void {
        if (!isset($_POST['email'])) {
            wp_send_json_error([
                'message' => __('Invalid request.', APP_THEME_LOCALE),
            ]);
        }

        $email = sanitize_email($_POST['email']);

        if (!is_email($email)) {
            wp_send_json_error([
                'message' => __('Invalid email address.', APP_THEME_LOCALE),
            ]);
        }

        if (!email_exists($email)) {
            wp_send_json_success([
                'message' => __('An email is coming your way to help you.', APP_THEME_LOCALE),
            ]);
        }


        $user = get_user_by('email', $email);
        $reset_key = get_password_reset_key($user);

        if (is_wp_error($reset_key)) {
            wp_send_json_error([
                'message' => __('Unable to generate password reset key.', APP_THEME_LOCALE),
            ]);
        }

        $reset_pass_page = wp_login_url();
        $auth_page_id = get_option('authentication_page_id');
        if ($auth_page_id) {
            $reset_pass_page = get_permalink($auth_page_id);
            $reset_pass_page .= 'reset-passwd';
        }

        $reset_url = add_query_arg([
            'key' => $reset_key,
            'email' => urlencode($user->user_email),
        ], $reset_pass_page);

        $button = Timber::compile('@app/mail/button.twig', [
            'link' => $reset_url,
            'text' => __('Reset my password', APP_THEME_LOCALE),
        ]);

        $subject = __('Did you forget your password?', APP_THEME_LOCALE);
        $message = sprintf(
            __('Someone asked for a password reset on your account, click on the button below to set a new one:%s %s %s', APP_THEME_LOCALE),
            '<br><br>',
            $button,
            '<br><br>'
        );

        $message .= sprintf(
            __('If the button doesn\'t work, please copy the URL below in your browser: %s %s', APP_THEME_LOCALE),
            '<br><br>',
            $reset_url
        );

        $headers = ['Content-Type: text/html; charset=UTF-8'];
        $mail_sent = wp_mail($email, $subject, nl2br($message), $headers);

        if (!$mail_sent) {
            wp_send_json_error([
                'message' => __('Failed to send the email. Please try again.', APP_THEME_LOCALE),
            ]);
        }

        wp_send_json_success([
            'message' => sprintf(__('An email is coming to %s.'), $email, APP_THEME_LOCALE),
            'callback' => 'hide_form'
        ]);
    }

    public static function reset_password(): void {
        if (empty($_POST['key']) ||  empty($_POST['email']) || empty($_POST['password'])) {
            wp_send_json_error([
                'message' => __('All fields are required.', APP_THEME_LOCALE),
            ]);
        }

        $key = sanitize_text_field($_POST['key']);
        $email = sanitize_user($_POST['email']);
        $password = $_POST['password'];

        if ($_POST['password'] !== $_POST['confirm_password']) {
            wp_send_json_error([
                'message' => __('Please confirm your password.', APP_THEME_LOCALE),
            ]);
        }

        if (!app_is_secure_password($password)) {
            wp_send_json_error([
                'message' => __('Password must be at least 8 characters long, contain at least one uppercase letter, and one special character.', APP_THEME_LOCALE),
            ]);
        }

        $user = get_user_by_email($email);

        if (!$user) {
            wp_send_json_error([
                'message' => __('Invalid reset link.', APP_THEME_LOCALE),
            ]);
        }

        $is_valid_key = check_password_reset_key($key, $user->user_login);

        if (is_wp_error($is_valid_key)) {
            wp_send_json_error([
                'message' => __('Invalid or expired reset link.', APP_THEME_LOCALE),
            ]);
        }

        wp_set_password($password, $user->ID);
        update_user_meta($user->ID, '_user_is_active', 1);

        $first_time = sanitize_text_field($_POST['first_time']) ?? false;
        if ($first_time === 'yes') {
            $initial_page = self::_authenticate_user($email, $password);
        }

        wp_send_json_success([
            'message' => __('Password reset successfully. Let\'s make awesome...', APP_THEME_LOCALE),
            'initial_page' => $initial_page ?? 'navigate-to-sign-in',
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
}