<?php

namespace App\Hooks\Queue;

use function Env\env;

class Post {
    public static function register_post_type() : void {
        register_post_type( 'queue', array(
            'labels' => array(
                'name' => __('Queues'),
                'singular_name' => __('Queue'),
                'menu_name' => __('Queues'),
                'all_items' => __('All Queues'),
                'edit_item' => __('Edit Queue'),
                'view_item' => __('View Queue'),
                'view_items' => __('View Queues'),
                'add_new_item' => __('Add New Queue'),
                'add_new' => __('Add New Queue'),
                'new_item' => __('New Queue'),
                'parent_item_colon' => __('Parent Queue:'),
                'search_items' => __('Search Queues'),
                'not_found' => __('No queues found'),
                'not_found_in_trash' => __('No queues found in Trash'),
                'archives' => __('Queue Archives'),
                'attributes' => __('Queue Attributes'),
                'insert_into_item' => __('Insert into queue'),
                'uploaded_to_this_item' => __('Uploaded to this queue'),
                'filter_items_list' => __('Filter queues list'),
                'filter_by_date' => __('Filter queues by date'),
                'items_list_navigation' => __('Queues list navigation'),
                'items_list' => __('Queues list'),
                'item_published' => __('Queue published.'),
                'item_published_privately' => __('Queue published privately.'),
                'item_reverted_to_draft' => __('Queue reverted to draft.'),
                'item_scheduled' => __('Queue scheduled.'),
                'item_updated' => __('Queue updated.'),
                'item_link' => __('Queue Link'),
                'item_link_description' => __('A link to a queue.'),
            ),
            'public' => false,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_admin_bar' => false,
            'show_in_rest' => true,
            'menu_position' => 7,
            'menu_icon' => 'dashicons-editor-ul',
            'supports' => array(
                0 => 'title',
                1 => 'author',
                2 => 'custom-fields',
            ),
            'rewrite' => array(
                'with_front' => false,
                'pages' => false,
            ),
            'can_export' => false,
            'delete_with_user' => true,
        ) );
    }

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

            $site_id = wp_insert_post(array(
                'post_type' => 'site',
                'post_title' => esc_html($company_name),
                'post_name' => $space_name,
                'post_status' => 'publish',
                'post_author' => $site_owner->ID,
            ));

            app_log("Site entry for {$company_name} created with ID {$site_id}");
            update_field('site_uri', $wp_home, $site_id);
            foreach ($variables as $key => $variable) {
                app_log("Updating {$key} for site {$company_name}");
                update_field($key, $variable, $site_id);
            }
        } catch (\PDOException $e) {
            self::_un_publish_queue($queue_id);
            app_log("save_post_queue: Error creating database: ".$e->getMessage());
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
}