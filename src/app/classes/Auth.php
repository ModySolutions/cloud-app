<?php

namespace App\classes;

use Timber\Timber;

class Auth {
    public static function init(): void {
        \App\classes\blocks\Auth::init();
        add_action('init', self::wp_init(...));
        add_action('admin_init', self::admin_init(...));
        add_action('wp_ajax_nopriv_sign_in', self::sign_in(...));
        add_action('wp_ajax_nopriv_sign_up', self::sign_up(...));
        add_action('wp_ajax_nopriv_reset_password', self::reset_password(...));

        add_filter('query_vars', self::query_vars(...));
        add_filter('login_url', self::login_url(...), 10, 3);
        add_filter('register_url', self::register_url(...), 10, 3);
        add_filter('lostpassword_url', self::lostpassword_url(...), 10, 3);
    }

    public static function wp_init(): void {
        add_rewrite_rule('^([^/]+)/sign-in/?$', 'index.php?pagename=$matches[1]&action=sign-in', 'top');
        add_rewrite_rule('^([^/]+)/sign-up/?$', 'index.php?pagename=$matches[1]&action=sign-up', 'top');
        add_rewrite_rule('^([^/]+)/forgot-passwd/?$', 'index.php?pagename=$matches[1]&action=forgot-passwd', 'top');
        add_rewrite_rule('^([^/]+)/reset-passwd/?$', 'index.php?pagename=$matches[1]&action=reset-passwd', 'top');

        $login_page = basename($_SERVER['PHP_SELF']);
        if ($login_page === 'wp-login.php' && !current_user_can('administrator')) {
            status_header(404);
            nocache_headers();
            include get_404_template();
            exit;
        }
    }

    public static function admin_init(): void {
        if (is_admin() && !current_user_can('administrator')) {
            if (str_contains($_SERVER['REQUEST_URI'], 'admin-ajax.php')) {
                if (!defined('DOING_AJAX') || !DOING_AJAX) {
                    status_header(404);
                    nocache_headers();
                    include get_404_template();
                    exit;
                }
                return;
            }

            status_header(404);
            nocache_headers();
            include get_404_template();
            exit;
        }
    }

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
        wp_send_json_success(array(
            'message' => sprintf(__('Login successful, welcome %s'), $userdata->first_name),
            'initial_page' => user_can($user, 'manage_network') ? network_admin_url() : home_url(),
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
            __('If the button doesn\'t seem to work, please copy the URL below in your browser: %s %s'),
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

        if (isset($_POST['first_time']) && $_POST['first_time'] === 'yes') {
            $wizard_page = get_field('wizard_page', 'option');
            $initial_page = get_permalink($wizard_page);
            $user = wp_authenticate($email, $password);
            wp_set_auth_cookie($user->ID, true);
        }

        wp_send_json_success([
            'message' => __('Password reset successfully. Let\'s make awesome...'),
            'initial_page' => $initial_page ?? home_url()
        ]);
    }

    public static function query_vars(array $vars): array {
        $vars[] = 'action';
        return $vars;
    }

    public static function login_url(string $login, string $redirect, bool $force_re_auth): string {
        $auth_page = get_field('authentication_page', 'option');
        $page_permalink = get_permalink($auth_page);
        $login_page = trailingslashit("{$page_permalink}sign-in");
        return $redirect ? add_query_arg('initial_page', $redirect, $login_page) : $login_page;
    }

    public static function register_url(string $register): string {
        $auth_page = get_field('authentication_page', 'option');
        $page_permalink = get_permalink($auth_page);
        return trailingslashit("{$page_permalink}sign-up");
    }

    public static function lostpassword_url(string $lostpassword_url, string $redirect): string {
        $auth_page = get_field('authentication_page', 'option');
        $page_permalink = get_permalink($auth_page);
        $lostpassword_page = trailingslashit("{$page_permalink}forgot-passwd");
        return $redirect ? add_query_arg('initial_page', $redirect, $lostpassword_page) : $lostpassword_page;
    }

    private static function _is_secure_password(string $password): bool {
        $pattern = '/^(?=.*[A-Z])(?=.*[\W])(?=.*[a-zA-Z0-9]).{8,}$/';
        return preg_match($pattern, $password) === 1;
    }
}