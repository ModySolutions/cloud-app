<?php

namespace App\Controllers\Sites;

use Timber\Timber;

class Ajax {
    public static function check_setup_finished() : void {
        $queue_id = sanitize_text_field($_POST['queue_id']);
        if(get_post_status($queue_id) === 'publish') {
            wp_send_json_success(array(
                'message' => sprintf(
                    __('%s complete'),
                    get_the_title($queue_id)
                ),
                'done' => true,
                'ping_page' => get_field('ping_url', $queue_id),
            ));
        }

        wp_send_json_success(array('done' => false));
    }

    public static function check_space_name_exists(): void {
        if (empty($_POST['space_name'])) {
            wp_send_json_error(array(
                'exists' => true,
                'message' => __('The space name is required.')
            ));
        }
        $space_name = sanitize_text_field($_POST['space_name']);
        $exists = self::_check_space_name_exists($space_name);
        wp_send_json_success(array(
            'exists' => $exists,
            'message' => sprintf(
                __('The space name <strong>%s</strong> is already taken. Please try another.'),
                $space_name
            )
        ));
    }

    public static function create_space(): void {
        if (empty($_POST['space_name'])) {
            wp_send_json_error(array(
                'message' => __('The space name is required.')
            ));
        }

        if (empty($_POST['company_name'])) {
            wp_send_json_error(array(
                'message' => __('The company name is required.')
            ));
        }

        $space_name = sanitize_text_field($_POST['space_name']);
        $company_name = sanitize_text_field($_POST['company_name']);

        if (self::_check_space_name_exists($space_name)) {
            wp_send_json_error(array(
                'message' => sprintf(
                    __('The space name <strong>%s</strong> is already taken. Please try another.'),
                    $space_name
                )
            ));
        }

        $queue_id = wp_insert_post(array(
            'post_type' => 'queue',
            'post_title' => sprintf(
                __('Create space %s'),
                $company_name
            ),
            'post_status' => 'draft',
        ));

        update_field('install_key', $_POST['install_key'], $queue_id);

        if(is_wp_error($queue_id)) {
            wp_send_json_error(array(
                'message' => $queue_id->get_error_message(),
            ));
        }

        $env_file_data = self::_generate_env_file_info($queue_id, $space_name, $company_name);
        $env_file = Timber::compile('@provision/env-template.twig', $env_file_data);

        update_field('queue_info', $env_file, $queue_id);
        update_field('queue_type', 'install', $queue_id);

        if (!is_dir(MC_SITES_PATH)) {
            mkdir(MC_SITES_PATH);
        }

        $new_site_dir = MC_SITES_PATH.'/'.$space_name;
        if (!is_dir($new_site_dir)) {
            mkdir($new_site_dir);
        }

        $env_file_path = $new_site_dir.'/'.'.env';
        if(!is_file($env_file_path)) {
            touch($env_file_path);
        }

        file_put_contents($env_file_path, $env_file);
        app_log(".env\n".print_r($env_file, 1));

        wp_send_json_success([
            'message' => __('We are provisioning your space, please wait, this could take up to a minute'),
            'callback' => 'poll_check_finished_install',
            'callback_data' => array(
                'queue_id' => $queue_id,
            )
        ]);
    }

    private static function _check_space_name_exists(string $space_name): bool {;
        $site = get_page_by_path($space_name, OBJECT, 'site');
        return !!$site;
    }

    private static function _generate_env_file_info(int $queue_id, string $space_name, string $company_name) : array {
        return [
            'company_name' => $company_name,
            'space_name' => $space_name,
            'database_name' => "{$space_name}_db",
            'database_user' => "{$space_name}_user",
            'database_password' => wp_generate_password(16),
            'database_host' => DEFAULT_DB_HOST,
            'database_prefix' => self::_generate_db_prefix(4),
            'auth_key' => wp_generate_password(64),
            'logged_in_key' => wp_generate_password(64),
            'secure_auth_key' => wp_generate_password(64),
            'nonce_key' => wp_generate_password(64),
            'auth_salt' => wp_generate_password(64),
            'secure_auth_salt' => wp_generate_password(64),
            'logged_in_salt' => wp_generate_password(64),
            'nonce_salt' => wp_generate_password(64),
        ];
    }

    private static function _generate_db_prefix(int $length = 6) : string {
        $characters = 'abcdefghijklmnopqrstuvwxyz0123456789_';
        $prefix = '';

        for ($i = 0; $i < $length; $i++) {
            $prefix .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $prefix . '_';
    }
}