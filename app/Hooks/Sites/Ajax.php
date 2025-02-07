<?php

namespace App\Hooks\Sites;

use Roots\WPConfig\Config;
use Timber\Timber;
use function Env\env;

class Ajax {
    public static function check_setup_finished(): void {
        $queue_id = sanitize_text_field($_POST['queue_id']);
        $user = wp_get_current_user();
        if (get_post_status($queue_id) === 'publish') {
            wp_send_json_success(array(
                'message' => sprintf(
                    __('%s complete', APP_THEME_LOCALE),
                    get_the_title($queue_id)
                ),
                'done' => get_post_status($queue_id) === 'publish',
                'initial_page' => app_get_initial_page($user)
            ));
        }

        wp_send_json_success(array('done' => false));
    }

    public static function check_space_name_exists(): void {
        if (empty($_POST['space_name'])) {
            wp_send_json_error(array(
                'exists' => true,
                'message' => __('The space name is required., APP_THEME_LOCALE')
            ));
        }
        $space_name = sanitize_text_field($_POST['space_name']);
        $exists = self::_check_space_name_exists($space_name);
        wp_send_json_success(array(
            'exists' => $exists,
            'message' => sprintf(
                __('The space name <strong>%s</strong> is already taken. Please try another.', APP_THEME_LOCALE),
                $space_name
            )
        ));
    }

    public static function create_space(): void {
        if (empty($_POST['space_name'])) {
            wp_send_json_error(array(
                'message' => __('The space name is required., APP_THEME_LOCALE')
            ));
        }

        if (empty($_POST['company_name'])) {
            wp_send_json_error(array(
                'message' => __('The company name is required., APP_THEME_LOCALE')
            ));
        }

        $space_name = sanitize_text_field($_POST['space_name']);
        $company_name = sanitize_text_field($_POST['company_name']);

        if (strlen($space_name) > 16) {
            wp_send_json_error(array(
                'message' => __('The space name should be 16 characters maximum.', APP_THEME_LOCALE),
            ));
        }

        if (self::_check_space_name_exists($space_name)) {
            wp_send_json_error(array(
                'message' => sprintf(
                    __('The space name <strong>%s</strong> is already taken. Please try another.', APP_THEME_LOCALE),
                    $space_name
                )
            ));
        }

        $queue_id = wp_insert_post(array(
            'post_type' => 'queue',
            'post_title' => sprintf(
                __('Create space %s', APP_THEME_LOCALE),
                $company_name
            ),
            'post_status' => 'draft',
        ));

        if (is_wp_error($queue_id)) {
            wp_send_json_error(array(
                'message' => $queue_id->get_error_message(),
            ));
        }

        update_field('install_key', $_POST['install_key'], $queue_id);

        $env_file_data = app_generate_env_file_info($queue_id, $space_name, $company_name);
        if (count($env_file_data) === 0) {
            wp_send_json_error(array(
                'message' => __('There was an error generating the configuration file. Please contact with support', APP_THEME_LOCALE),
            ));
        }
        $env_file = Timber::compile('@provision/env-template.twig', $env_file_data);

        foreach ($env_file_data as $env_key => $env_value) {
            update_field($env_key, $env_value, $queue_id);
        }

        update_field('queue_info', $env_file, $queue_id);
        update_field('queue_type', 'install', $queue_id);

        if (!is_dir(Config::get('MC_SITES_PATH'))) {
            mkdir(Config::get('MC_SITES_PATH'), 0755, true);
        }

        $new_site_dir = $env_file_data['space_path'];
        if (!is_dir($new_site_dir)) {
            mkdir($new_site_dir, 0755, true);
        }

        $env_file_path = $new_site_dir.'/'.'.env';
        if (!is_file($env_file_path)) {
            touch($env_file_path);
        }

        file_put_contents($env_file_path, $env_file);
        app_log(".env\n".print_r($env_file, 1));

        wp_send_json_success([
            'message' => __('We are provisioning your space, please wait, this could take a while', APP_THEME_LOCALE),
            'initial_page' => add_query_arg(array(
                'autologin_user' => base64_encode(md5(rand(111111, 999999))),
            ), "{$env_file_data['wp_home']}/content/space-install-setup.php"),
            'queue_id' => $queue_id,
        ]);
    }

    private static function _check_space_name_exists(string $space_name): bool {
        $site = get_page_by_path($space_name, OBJECT, 'site');
        return !!$site;
    }
}