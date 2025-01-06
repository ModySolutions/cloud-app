<?php

namespace App\Controllers\Queue;

use function Env\env;

class Post {
    public static function save_post_queue(int $queue_id, \WP_Post $post, bool $update): void {
        if ($post->post_type !== 'queue') {
            return;
        }

        if ($post->post_status !== 'publish') {
            return;
        }

        $site_owner = get_userdata($post->post_author);
        $queue_info = get_field('queue_info', $queue_id, false);
        if (empty($queue_info)) {
            self::_un_publish_queue($queue_id);
            app_log(sprintf(__('save_post_queue: queue_info not found for %s.'), $queue_id));
            return;
        }

        $variables = parse_env_text($queue_info);
        if (empty($variables)) {
            self::_un_publish_queue($queue_id);
            app_log(
                sprintf(
                    __('save_post_queue: variables not extracted from queue_info for %s.'),
                    $queue_id
                )
            );
            return;
        }

        extract($variables);
        $db_host = $variables['db_host'] ?? DEFAULT_DB_HOST;

        if (!$db_name || !$db_user || !$db_password || !$wp_home || !$domain_current_site) {
            self::_un_publish_queue($queue_id);
            app_log(
                sprintf(
                    __('save_post_queue: required fields not present in queue_info variables for %s.'),
                    $queue_id
                )
            );
            return;
        }

        try {
            $pdo = new \PDO("mysql:host=$db_host", env('DB_USER'), env('DB_PASSWORD'));
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("CREATE USER IF NOT EXISTS '$db_user'@'$db_host' IDENTIFIED BY '$db_password'");
            $pdo->exec("GRANT ALL PRIVILEGES ON `$db_name`.* TO '$db_user'@'$db_host'");
            $pdo->exec("FLUSH PRIVILEGES");

            app_log(
                sprintf(
                    __('save_post_queue: Database %s and user %s created.'),
                    $db_name,
                    $db_user
                )
            );

            $install_key = get_field('install_key', $queue_id);
            $decoded_key = base64_decode($install_key);
            $exploded_key = explode('|--|', $decoded_key);

            $admin_user = $site_owner->user_email;
            $admin_email = $admin_user;
            $admin_password = $exploded_key[1] ?? wp_generate_password();

            $install = self::_app_install(
                $company_name,
                $wp_home,
                $admin_user,
                $admin_email,
                $admin_password
            );

            if (!is_wp_error($install)) {
                app_log(
                    sprintf(
                        __('save_post_queue: %s install completed at %s'),
                        $company_name,
                        $wp_home
                    )
                );

                $site_id = wp_insert_post(array(
                    'post_type' => 'site',
                    'post_title' => esc_html($company_name),
                    'post_name' => $space_name,
                    'post_status' => 'publish',
                    'post_author' => $site_owner->ID,
                ));

                update_field('site_uri', $wp_home, $site_id);
                foreach($variables as $key => $variable) {
                    update_field($key, $variable, $site_id);
                }

                $sign_in_url = add_query_arg([
                    'autologin_user' => urlencode($site_owner->ID),
                    'key' => base64_encode('from-first-install'),
                ], "{$wp_home}/auth");

                $ping_page = add_query_arg(array(
                    'initial_page' => urlencode($sign_in_url),
                ), "{$wp_home}/app/space-install-setup.php");

                update_field('sign_in_url', $sign_in_url, $queue_id);
                update_field('ping_url', $ping_page, $queue_id);
                update_field('admin_email', $admin_email, $queue_id);
                update_field('admin_password', $admin_password, $queue_id);
                update_field('action', 'finish_site_setup', $queue_id);
                update_field('api_url', "{$wp_home}/wp-json/app/v1/finish_site_setup", $queue_id);
            } else {
                app_log($install->get_error_message());
            }
        } catch (\PDOException $e) {
            self::_un_publish_queue($queue_id);
            app_log("save_post_queue: Error al crear la base de datos o el usuario: ".$e->getMessage());
            return;
        }
    }

    private static function _un_publish_queue(int $post_id): void {
        remove_action('save_post_queue', self::save_post_queue(...));
        wp_update_post(array(
            'ID' => $post_id,
            'post_status' => 'draft',
        ));
        add_action('save_post_queue', self::save_post_queue(...));
    }

    private static function _app_install(
        string $company_name,
        string $wp_home,
        string $admin_user,
        string $admin_email,
        string $admin_password
    ): array|\WP_Error {
        return wp_remote_post(
            "{$wp_home}/wp/wp-admin/install.php?step=2",
            array(
                'body' => array(
                    'weblog_title' => $company_name,
                    'user_name' => $admin_user,
                    'admin_password' => $admin_password,
                    'admin_password2' => $admin_password,
                    'admin_email' => $admin_email,
                    'blog_public' => 0,
                ),
            )
        );
    }
}